/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HistoryItem } from './types';

const HISTORY_KEY = 'nhc-magic-tool-history';
const MAX_HISTORY_ITEMS = 50;
const MAX_HISTORY_IMAGE_DIMENSION = 512; // px

/**
 * Compresses an image to a smaller JPEG for storage.
 * @param base64 The base64 data URL of the image.
 * @returns A promise that resolves with the compressed base64 JPEG data URL.
 */
const compressImageForHistory = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
        if (!base64) {
            return resolve(''); // Handle null/empty strings
        }
        const img = new Image();
        img.onload = () => {
            let { width, height } = img;

            if (width > height) {
                if (width > MAX_HISTORY_IMAGE_DIMENSION) {
                    height = Math.round(height * (MAX_HISTORY_IMAGE_DIMENSION / width));
                    width = MAX_HISTORY_IMAGE_DIMENSION;
                }
            } else {
                if (height > MAX_HISTORY_IMAGE_DIMENSION) {
                    width = Math.round(width * (MAX_HISTORY_IMAGE_DIMENSION / height));
                    height = MAX_HISTORY_IMAGE_DIMENSION;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                console.error('Could not get canvas context for image compression.');
                return resolve(base64); // Fallback to original
            }

            ctx.drawImage(img, 0, 0, width, height);
            // Use JPEG with quality 0.8 to significantly reduce size
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = (err) => {
            console.error("Failed to load image for compression, storing original.", err);
            resolve(base64); // Fallback to original
        };
        img.src = base64;
    });
};


export const loadHistory = (): HistoryItem[] => {
    try {
        const storedHistory = localStorage.getItem(HISTORY_KEY);
        return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
        console.error("Error loading history:", error);
        return [];
    }
};

export const saveHistory = (history: HistoryItem[]): void => {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Error saving history:", error);
        // Check if it's a quota error
        if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
            console.warn("Local storage quota exceeded. Pruning oldest history item and retrying.");
            // Prune the oldest item and try again
            if (history.length > 1) {
                const prunedHistory = history.slice(0, history.length - 1);
                try {
                    localStorage.setItem(HISTORY_KEY, JSON.stringify(prunedHistory));
                } catch (retryError) {
                    console.error("Error saving history even after pruning:", retryError);
                }
            } else {
                console.error("Cannot save history, single item is too large for local storage.");
            }
        }
    }
};

export const addHistoryItem = async (itemData: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<void> => {
    const history = loadHistory();
    
    // Compress images before saving
    const [compressedOriginal, compressedGenerated] = await Promise.all([
        compressImageForHistory(itemData.original),
        compressImageForHistory(itemData.generated)
    ]);
    
    const newItem: HistoryItem = {
        ...itemData,
        original: compressedOriginal,
        generated: compressedGenerated,
        id: Date.now(),
        timestamp: Date.now(),
    };
    const updatedHistory = [newItem, ...history];
    
    // Enforce the history limit
    if (updatedHistory.length > MAX_HISTORY_ITEMS) {
        updatedHistory.length = MAX_HISTORY_ITEMS; // Truncate the array to the max size
    }
    
    saveHistory(updatedHistory);
};

export const deleteHistoryItem = (id: number): void => {
    const history = loadHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    saveHistory(updatedHistory);
};

export const clearHistory = (): void => {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error("Error clearing history:", error);
    }
};