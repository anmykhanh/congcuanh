
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { h, FunctionalComponent } from 'preact';
import { useState, useMemo, useRef, useEffect } from 'preact/hooks';
import htm from 'htm';
import type { TargetedEvent } from 'preact/compat';

import {
    ImageItem,
    IdPhotoSettings,
    RestorationSettings,
    SymmetrySettings,
    LightingSettings,
    BackgroundSettings,
    MockupSettings,
    TrendCreatorSettings,
    CleanBackgroundSettings,
    Theme,
    ImageFilterSettings,
    WeddingPhotoSettings,
    FamilyFaceSwapSettings,
    BirthdayPhotoSettings,
} from './types';
import { CLOTHING_OPTIONS, LIGHTING_STYLES, PREDEFINED_TRENDS, WEDDING_CONCEPTS, TABS, BIRTHDAY_CONCEPTS } from './constants';
// FIX: Removed Icon360, Icon4K, Icon8K, and SaveIcon as they are not exported from components.tsx
import {
    Loader,
    ImageUploader,
    ImageComparisonSlider,
    UploadIcon,
    RegenerateIcon,
    DeleteIcon,
    Lightbox,
    ImageIcon,
    SimpleLightbox,
    ViewIcon,
    FamilyIcon,
    EnhancedDownloadButton,
    DownloadIcon,
    ImageActionsToolbar,
} from './components';
import {
    IdPhotoSettingsPanel,
    RestorationSettingsPanel,
    BackgroundSettingsPanel,
    MockupSettingsPanel,
    TrendCreatorSettingsPanel,
    CleanBackgroundSettingsPanel,
    ImageFilterSettingsPanel,
    WeddingPhotoSettingsPanel,
    BirthdayPhotoSettingsPanel,
} from './featurePanels';
import {
    generateIdPhoto,
    restoreImage,
    correctFacialSymmetry,
    changeImageLighting,
    changeBackground,
    createProductMockup,
    callGeminiAPI,
    testApiKey,
    cleanBackground,
    upscaleImage,
    applyImageFilters,
    generateWeddingPhoto,
    swapFamilyFaces,
} from './api';
import { addHistoryItem } from './history';

const html = htm.bind(h);

// NOTE: Most feature editors have been moved to the `features` directory.
// This file contains the remaining ones that have not yet been refactored.
// It also exports features from the `features` directory for backward compatibility.

// Re-export refactored features
export { IdPhotoApp } from './features/idPhoto/IdPhotoApp';
export { RestorationApp } from './features/restoration/RestorationApp';
// FIX: Corrected re-export path for BackgroundApp.
export { BackgroundApp } from './features/background/BackgroundApp';
export { MockupApp } from './features/mockup/MockupApp';
export { SettingsApp } from './features/settings/SettingsApp';
export { TrendCreatorApp } from './features/trendCreator/TrendCreatorApp';
export { LoginComponent } from './features/auth/LoginComponent';


const SingleCleanBackgroundEditor: FunctionalComponent = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState<CleanBackgroundSettings>({
        removeObjects: true,
        evenColor: true,
        denoise: false,
        sharpen: false,
        customPrompt: '',
    });

    const handleGenerate = async () => {
        if (!originalImage) return;
        setGenerating(true);
        setError('');
        try {
            const result = await cleanBackground(originalImage, settings);
            setGeneratedImage(result);
            const featureInfo = TABS.find(t => t.id === 'clean-background');
            await addHistoryItem({
                original: originalImage,
                generated: result,
                feature: 'clean-background',
                featureLabel: featureInfo?.label || 'Làm Sạch Nền',
            });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        } finally {
            setGenerating(false);
        }
    };
    
    const handleUpload = (image: string | null) => {
        setOriginalImage(image);
        setGeneratedImage(null);
        setError('');
    };

    return html`
        <div class="editor-layout">
            <${CleanBackgroundSettingsPanel} settings=${settings} setSettings=${setSettings} onGenerate=${handleGenerate} generating=${generating} hasImage=${!!originalImage} />
            <div class="image-panel">
                ${!originalImage ? html`
                    <${ImageUploader} onImageUpload=${(img: string) => handleUpload(img)} />
                ` : html`
                    <div class="image-panel-preview">
                        ${generating && html`<${Loader} text="AI đang làm sạch nền..." />`}
                        <div class="image-display-wrapper">
                            <${ImageComparisonSlider} original=${originalImage} generated=${generatedImage} objectFit="contain" />
                            <${ImageActionsToolbar}
                                generatedImage=${generatedImage}
                                filename="clean-background.jpeg"
                                onReset=${() => handleUpload(null)}
                                isGenerating=${generating}
                            />
                        </div>
                        ${error && html`<div class="error-message">${error}</div>`}
                    </div>
                `}
            </div>
        </div>
    `;
};

const BatchCleanBackgroundEditor: FunctionalComponent = () => {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [settings, setSettings] = useState<CleanBackgroundSettings>({
        removeObjects: true,
        evenColor: true,
        denoise: false,
        sharpen: false,
        customPrompt: '',
    });
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    const handleFileChange = (e: TargetedEvent<HTMLInputElement>) => {
        if (!e.currentTarget.files) return;
        const files = Array.from(e.currentTarget.files);
        const newImages: ImageItem[] = files.map((file: File) => ({
            id: Date.now() + Math.random(),
            file: file,
            original: URL.createObjectURL(file),
            generated: null,
            status: 'pending'
        }));
        setImages(current => [...current, ...newImages]);
    };
    
    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    const processQueue = async (tasks: ImageItem[], concurrency: number, processFn: (task: ImageItem) => Promise<void>) => {
        let completed = 0;
        const queue = [...tasks];

        const worker = async () => {
            while(queue.length > 0) {
                const task = queue.shift();
                if (task) {
                    await processFn(task);
                    completed++;
                    setProgress(Math.round((completed / tasks.length) * 100));
                    if (queue.length > 0) {
                        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before the next call
                    }
                }
            }
        }
        
        const workers = Array(concurrency).fill(null).map(() => worker());
        await Promise.all(workers);
    };

    const handleBatchGenerate = async () => {
        setProcessing(true);
        setProgress(0);
        setError('');
        
        const tasks = images.filter(img => img.status === 'pending' || img.status === 'error');
        
        const processTask = async (img: ImageItem) => {
            setImages(current => current.map(i => i.id === img.id ? { ...i, status: 'processing' } : i));
            try {
                const originalDataUrl = await readFileAsDataURL(img.file);
                const result = await cleanBackground(originalDataUrl, settings);
                setImages(current => current.map(i => i.id === img.id ? { ...i, generated: result, status: 'done' } : i));
                const featureInfo = TABS.find(t => t.id === 'clean-background');
                await addHistoryItem({
                    original: originalDataUrl,
                    generated: result,
                    feature: 'clean-background',
                    featureLabel: featureInfo?.label || 'Làm Sạch Nền',
                });
            } catch (err) {
                 if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(String(err));
                }
                setImages(current => current.map(i => i.id === img.id ? { ...i, status: 'error' } : i));
                // Stop the entire queue on first error
                throw err;
            }
        };
        
        try {
            await processQueue(tasks, 1, processTask);
        } catch (e) {
            console.error("Batch processing stopped due to an error.", e);
        } finally {
            setProcessing(false);
        }
    };
    
    const regenerateImage = async (id: number) => {
        const imageToRegen = images.find(i => i.id === id);
        if (!imageToRegen) return;

        setImages(current => current.map(i => i.id === id ? { ...i, status: 'processing' } : i));
        setError('');
        try {
            const originalDataUrl = await readFileAsDataURL(imageToRegen.file);
            const result = await cleanBackground(originalDataUrl, settings);
            setImages(current => current.map(i => i.id === id ? { ...i, generated: result, status: 'done' } : i));
             const featureInfo = TABS.find(t => t.id === 'clean-background');
             await addHistoryItem({
                original: originalDataUrl,
                generated: result,
                feature: 'clean-background',
                featureLabel: featureInfo?.label || 'Làm Sạch Nền',
            });
        } catch (err) {
             if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
             setImages(current => current.map(i => i.id === id ? { ...i, status: 'error' } : i));
        }
    };
    
    const deleteImage = (id: number) => {
        setImages(current => current.filter(i => i.id !== id));
    }
    
    const handleDownloadAll = async () => {
        setIsDownloading(true);
        setError('');
        const imagesToDownload = images.filter(img => img.generated);

        for (let i = 0; i < imagesToDownload.length; i++) {
            const img = imagesToDownload[i];
            if (!img.generated) continue;
            
            try {
                const link = document.createElement('a');
                link.href = img.generated;
                link.download = `clean-background-${img.id}.jpeg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                await new Promise(resolve => setTimeout(resolve, 300)); // Small delay between downloads
            } catch(err) {
                 const message = `Lỗi khi tải ảnh ${i + 1}.`;
                setError(message);
                console.error(message, err);
                break;
            }
        }
        setIsDownloading(false);
    };
    
    const pendingCount = useMemo(() => images.filter(img => img.status === 'pending' || img.status === 'error').length, [images]);
    const buttonText = pendingCount > 0 ? `Làm sạch ${pendingCount} ảnh` : 'Làm sạch nền';

    return html`
        <div class="editor-layout">
            <${CleanBackgroundSettingsPanel}
                settings=${settings}
                setSettings=${setSettings}
                onGenerate=${handleBatchGenerate}
                generating=${processing}
                hasImage=${pendingCount > 0}
                buttonText=${buttonText}
            />
            <div class="batch-panel">
                <div class="actions" style=${{ justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                     <button class="btn btn-secondary" onClick=${() => document.getElementById('batch-clean-bg-file-input')?.click()}>
                         <${UploadIcon} /> Thêm ảnh
                    </button>
                     <input type="file" id="batch-clean-bg-file-input" multiple accept="image/*" style=${{display: 'none'}} onChange=${handleFileChange} />
                    <button class="btn btn-primary" onClick=${handleDownloadAll} disabled=${images.every(img => !img.generated) || isDownloading}>
                        ${isDownloading ? 'Đang tải...' : html`<${DownloadIcon} /> Tải tất cả`}
                    </button>
                </div>
                
                ${processing && html`
                    <div class="progress-bar">
                        <div class="progress-bar-inner" style=${{ width: `${progress}%` }}></div>
                        <span class="progress-label">${progress}%</span>
                    </div>
                `}
                
                ${error && html`<div class="error-message" style=${{marginTop: '1rem'}}>${error}</div>`}
    
                <div class="batch-grid">
                    ${images.map(img => html`
                        <div class="batch-item">
                            <div class="image-container">
                                <img src=${img.generated || img.original} />
                                ${img.status === 'processing' && html`<${Loader} text="Đang xử lý..." />`}
                                ${img.status === 'error' && html`<div class="error-badge">Lỗi</div>`}
                            </div>
                            <div class="batch-item-actions">
                                <button class="batch-item-btn" title="Làm sạch lại" onClick=${() => regenerateImage(img.id)}><${RegenerateIcon} /></button>
                                <button class="batch-item-btn" title="Xóa" onClick=${() => deleteImage(img.id)}><${DeleteIcon} /></button>
                            </div>
                        </div>
                    `)}
                     ${images.length === 0 && html`
                        <div class="image-panel-content" style=${{gridColumn: '1 / -1'}}>
                             <${UploadIcon} class="placeholder-icon"/>
                             <h4>Làm sạch nền hàng loạt</h4>
                             <p class="placeholder-text">Tải nhiều ảnh lên để bắt đầu chỉnh sửa cùng lúc.</p>
                        </div>
                     `}
                </div>
            </div>
        </div>
    `;
};

export const CleanBackgroundApp: FunctionalComponent = () => {
    const [activeTab, setActiveTab] = useState('single');
    return html`
        <div>
            <div class="tabs">
                <button class="tab ${activeTab === 'single' ? 'active' : ''}" onClick=${() => setActiveTab('single')}>Chỉnh sửa một ảnh</button>
                <button class="tab ${activeTab === 'batch' ? 'active' : ''}" onClick=${() => setActiveTab('batch')}>Chỉnh sửa hàng loạt</button>
            </div>
            ${activeTab === 'single' ? html`<${SingleCleanBackgroundEditor} />` : html`<${BatchCleanBackgroundEditor} />`}
        </div>
    `;
};


export const ImageFilterApp: FunctionalComponent = () => {
    const initialSettings: ImageFilterSettings = {
        allFilters: true,
        smoothSkin: false,
        smartPortrait: true,
        makeupTransfer: false,
        styleTransfer: false,
        colorize: false,
        superResolution: false,
        removeJpegArtifacts: false,
        denoise: false,
        happiness: 0,
        surprise: 0,
        anger: 0,
        age: 0,
        hairThickness: 0,
        numResults: 2,
    };
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [selectedGeneratedImage, setSelectedGeneratedImage] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState<ImageFilterSettings>(initialSettings);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!originalImage) return;
        setGenerating(true);
        setError('');
        setGeneratedImages([]);
        setSelectedGeneratedImage(null);

        const results: string[] = [];
        for (let i = 0; i < settings.numResults; i++) {
            try {
                const result = await applyImageFilters(originalImage, settings);
                results.push(result);
            } catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                setError(prev => prev ? `${prev}\nLỗi lần ${i + 1}: ${message}` : `Lỗi lần ${i + 1}: ${message}`);
                break; // Stop on first error
            }
        }

        setGeneratedImages(results);
        if (results.length > 0) {
            setSelectedGeneratedImage(results[0]);
        }

        setGenerating(false);
    };

    const handleImageUpload = (dataUrl: string | null) => {
        setOriginalImage(dataUrl);
        setGeneratedImages([]);
        setSelectedGeneratedImage(null);
        setError('');
        if (!dataUrl) {
            setSettings(initialSettings);
        }
    };

    const handleCancel = () => {
        setSettings(initialSettings);
    };

    return html`
        ${lightboxImage && html`
            <${SimpleLightbox}
                imageUrl=${lightboxImage}
                caption="Ảnh Sau Khi Lọc"
                onClose=${() => setLightboxImage(null)}
            />
        `}
        <div class="image-filter-layout">
            <main class="image-display-area">
                ${!originalImage ? html`
                    <${ImageUploader} onImageUpload=${(img: string) => handleImageUpload(img)} />
                ` : html `
                    <div class="image-panel-preview" style="padding-top: 1rem;">
                        ${generating && html`<${Loader} text="Đang áp dụng bộ lọc..." />`}
                        <div class="image-display-wrapper">
                            <${ImageComparisonSlider} original=${originalImage} generated=${selectedGeneratedImage} objectFit="contain" />
                        </div>
                         ${generatedImages.length > 1 && html`
                            <div class="thumbnail-gallery">
                                ${generatedImages.map((url, index) => html`
                                    <div class="thumbnail-item">
                                        <img 
                                            src=${url} 
                                            alt="Generated ${index + 1}" 
                                            class=${selectedGeneratedImage === url ? 'active' : ''}
                                            onClick=${() => setSelectedGeneratedImage(url)}
                                        />
                                    </div>
                                `)}
                            </div>
                        `}
                        ${error && html`<div class="error-message" style=${{width: '100%', marginTop: '1rem'}}>${error}</div>`}
                        <div class="actions" style=${{width: '100%', marginTop: 'auto'}}>
                            <button class="btn btn-secondary" onClick=${() => handleImageUpload(null)}>Thay đổi ảnh</button>
                            <button class="btn btn-secondary" onClick=${() => setLightboxImage(selectedGeneratedImage)} disabled=${!selectedGeneratedImage}>
                                <${ViewIcon} /> Xem ảnh
                            </button>
                            <${EnhancedDownloadButton} baseImageUrl=${selectedGeneratedImage} filename="filtered-image.jpeg">
                                <${DownloadIcon} /> Tải về
                            </${EnhancedDownloadButton}>
                        </div>
                    </div>
                `}
            </main>
            <aside class="image-filter-controls-panel">
                 <${ImageFilterSettingsPanel} settings=${settings} setSettings=${setSettings} onGenerate=${handleGenerate} onCancel=${handleCancel} generating=${generating} hasImage=${!!originalImage} />
            </aside>
        </div>
    `;
};

export const WeddingPhotoApp: FunctionalComponent = () => {
    const [settings, setSettings] = useState<WeddingPhotoSettings>({
        brideImage: null,
        groomImage: null,
        selectedConcepts: [],
        customPrompt: '',
    });
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [generatedImages, setGeneratedImages] = useState<Record<string, string[]>>({});
    const [lightboxImage, setLightboxImage] = useState<{url: string, caption: string} | null>(null);

    const handleGenerate = async () => {
        if (!settings.brideImage || !settings.groomImage || settings.selectedConcepts.length === 0) return;
        
        setGenerating(true);
        setError('');
        const newResults: Record<string, string[]> = {};

        for (const conceptId of settings.selectedConcepts) {
            const concept = WEDDING_CONCEPTS.find(c => c.id === conceptId);
            if (!concept) continue;

            try {
                // For simplicity, we'll generate one image per concept for now.
                // This can be extended to generate multiple choices.
                const resultUrl = await generateWeddingPhoto(settings.brideImage, settings.groomImage, concept.prompt, settings.customPrompt);
                if (newResults[concept.id]) {
                    newResults[concept.id].push(resultUrl);
                } else {
                    newResults[concept.id] = [resultUrl];
                }
            } catch (err) {
                 const message = err instanceof Error ? err.message : String(err);
                 setError(prev => prev ? `${prev}\nLỗi concept ${concept.label}: ${message}` : `Lỗi concept ${concept.label}: ${message}`);
                 console.error(`Error generating for concept ${concept.label}:`, err);
            }
        }
        
        setGeneratedImages(newResults);
        setGenerating(false);
    };

    return html`
        ${lightboxImage && html`
            <${SimpleLightbox} 
                imageUrl=${lightboxImage.url}
                caption=${lightboxImage.caption}
                onClose=${() => setLightboxImage(null)}
            />
        `}
        <div class="wedding-photo-layout">
            <div class="page-header">
                <h1>Ảnh Cưới AI – Khoảnh Khắc Lứa Đôi</h1>
                <p class="subtitle">Biến giấc mơ ảnh cưới của bạn thành hiện thực chỉ với vài bước đơn giản. Tải lên một ảnh chân dung rõ mặt của cô dâu và chú rể, sau đó chọn từ bộ sưu tập các concept ảnh cưới độc đáo của chúng tôi. AI sẽ tự động ghép khuôn mặt của bạn vào những bối cảnh lãng mạn, tạo ra những bức ảnh chuyên nghiệp và đầy cảm xúc. Bắt đầu hành trình sáng tạo khoảnh khắc lứa đôi ngay bây giờ!</p>
            </div>
            <aside>
                <${WeddingPhotoSettingsPanel}
                    settings=${settings}
                    setSettings=${setSettings}
                    onGenerate=${handleGenerate}
                    generating=${generating}
                />
            </aside>
            <main class="wedding-results-panel">
                ${generating && html`<${Loader} text="AI đang kiến tạo khoảnh khắc lứa đôi..." />`}
                ${error && html`<div class="error-message" style=${{textAlign: 'left', whiteSpace: 'pre-wrap'}}>${error}</div>`}
                
                ${Object.keys(generatedImages).length === 0 && !generating && html`
                    <div class="placeholder-container" style=${{height: '100%'}}>
                        <${ImageIcon} class="placeholder-icon"/>
                        <h4>Kết quả sẽ hiện ở đây</h4>
                        <p class="placeholder-text">Tải ảnh cô dâu, chú rể và chọn concept để bắt đầu.</p>
                    </div>
                `}

                ${Object.entries(generatedImages).map(([conceptId, urls]) => {
                    const concept = WEDDING_CONCEPTS.find(c => c.id === conceptId);
                    return html`
                        <div class="results-group">
                            <h3 class="results-group-title">Kết quả cho: ${concept?.label}</h3>
                            <div class="results-grid">
                                ${Array.isArray(urls) && urls.map((url, index) => {
                                    const caption = `Ảnh cưới concept ${concept?.label} - Lựa chọn ${index + 1}`;
                                    return html`
                                    <div class="result-image-wrapper" onClick=${() => setLightboxImage({ url, caption })}>
                                        <img src=${url} alt=${caption} />
                                        <span class="choice-label">Lựa chọn ${index + 1}</span>
                                        <div class="image-overlay">
                                            <button 
                                                class="btn btn-secondary overlay-btn" 
                                                onClick=${(e: MouseEvent) => { e.stopPropagation(); setLightboxImage({ url, caption }); }}
                                            >
                                                <${ViewIcon} /> Xem
                                            </button>
                                            <${EnhancedDownloadButton} 
                                                class="btn-primary overlay-btn"
                                                baseImageUrl=${url}
                                                filename=${`${caption}.jpeg`}
                                            >
                                                <${DownloadIcon} /> Tải
                                            </${EnhancedDownloadButton}>
                                        </div>
                                    </div>
                                `})}
                            </div>
                        </div>
                    `;
                })}
            </main>
        </div>
    `;
};

export const BirthdayPhotoApp: FunctionalComponent = () => {
    const initialSettings: BirthdayPhotoSettings = {
        selectedConcepts: [],
        customPrompt: '',
        numImages: 1,
    };

    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [selectedGeneratedImage, setSelectedGeneratedImage] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState<BirthdayPhotoSettings>(initialSettings);

    const handleGenerate = async () => {
        if (!originalImage) return;

        setGenerating(true);
        setError('');
        setGeneratedImages([]);
        setSelectedGeneratedImage(null);

        const promptParts = [
            'Generate a beautiful, high-resolution, photorealistic birthday-themed portrait. The subject\'s face and identity must be an exact match to the person in the provided reference photo.',
            'The overall mood should be celebratory and joyful.'
        ];

        const selectedConceptPrompts = settings.selectedConcepts
            .map(conceptId => {
                const concept = BIRTHDAY_CONCEPTS.find(c => c.id === conceptId);
                return concept ? concept.prompt : '';
            })
            .filter(Boolean);
        
        if (selectedConceptPrompts.length > 0) {
            promptParts.push(`Apply the following theme(s): ${selectedConceptPrompts.join('. ')}.`);
        }

        if (settings.customPrompt.trim()) {
            promptParts.push(`Additionally, follow this specific user request: "${settings.customPrompt.trim()}".`);
        }
        
        const finalPrompt = promptParts.join(' ');
        
        const results: string[] = [];
        const featureInfo = TABS.find(t => t.id === 'birthday-photo');

        for (let i = 0; i < settings.numImages; i++) {
            try {
                const result = await callGeminiAPI(finalPrompt, originalImage);
                results.push(result);
                await addHistoryItem({
                    original: originalImage,
                    generated: result,
                    feature: 'birthday-photo',
                    featureLabel: featureInfo?.label || 'Tạo Ảnh Sinh Nhật',
                });
            } catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                setError(prev => prev ? `${prev}\nLỗi lần ${i + 1}: ${message}` : `Lỗi lần ${i + 1}: ${message}`);
                break;
            }
        }
        
        setGeneratedImages(results);
        if (results.length > 0) {
            setSelectedGeneratedImage(results[0]);
        }
        setGenerating(false);
    };

    const handleImageUpload = (dataUrl: string | null) => {
        setOriginalImage(dataUrl);
        setGeneratedImages([]);
        setSelectedGeneratedImage(null);
        setError('');
    };
    
    return html`
        <div class="editor-layout">
            <div class="settings-panel">
                 <div class="form-section">
                    <h3 class="form-section-title">1. Tải ảnh của bạn lên</h3>
                    ${!originalImage ? html`
                        <${ImageUploader} onImageUpload=${(img: string) => handleImageUpload(img)} />
                    ` : html`
                        <div class="image-preview-container" style=${{height: 'auto', maxHeight: '300px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border-color)'}}>
                            <img src=${originalImage} alt="Uploaded preview" style=${{maxHeight: '100%', width: 'auto', objectFit: 'contain'}}/>
                        </div>
                        <button class="btn btn-secondary" onClick=${() => handleImageUpload(null)} style=${{width: '100%', marginTop:'1rem'}}>
                            Tải ảnh khác
                        </button>
                    `}
                </div>
                <${BirthdayPhotoSettingsPanel}
                    settings=${settings}
                    setSettings=${setSettings}
                    onGenerate=${handleGenerate}
                    generating=${generating}
                    hasImage=${!!originalImage}
                />
            </div>
            <div class="image-panel">
                ${!originalImage ? html`
                    <div class="image-panel-content">
                        <${ImageIcon} class="placeholder-icon"/>
                        <h4>Tạo Ảnh Sinh Nhật</h4>
                        <p class="placeholder-text">Tải ảnh của bạn lên và chọn concept để tạo ra những bức ảnh sinh nhật lung linh.</p>
                    </div>
                ` : html`
                    <div class="image-panel-preview">
                        ${generating && html`<${Loader} text="AI đang chuẩn bị bữa tiệc sinh nhật..." />`}
                        <div class="image-display-wrapper">
                            <${ImageComparisonSlider} original=${originalImage} generated=${selectedGeneratedImage} objectFit="contain" />
                            <${ImageActionsToolbar}
                                generatedImage=${selectedGeneratedImage}
                                filename="birthday-photo.jpeg"
                                onReset=${() => handleImageUpload(null)}
                                isGenerating=${generating}
                            />
                        </div>
                        ${generatedImages.length > 1 && html`
                            <div class="thumbnail-gallery">
                                ${generatedImages.map((url, index) => html`
                                    <div class="thumbnail-item">
                                        <img 
                                            src=${url} 
                                            alt="Generated ${index + 1}" 
                                            class=${selectedGeneratedImage === url ? 'active' : ''}
                                            onClick=${() => setSelectedGeneratedImage(url)}
                                        />
                                        <span class="thumbnail-label">Ảnh ${index+1}</span>
                                    </div>
                                `)}
                            </div>
                        `}
                        ${error && html`<div class="error-message" style=${{textAlign: 'left', whiteSpace: 'pre-wrap'}}>${error}</div>`}
                    </div>
                `}
            </div>
        </div>
    `;
};

export const FamilyFaceSwapApp: FunctionalComponent = () => {
    const [settings, setSettings] = useState<FamilyFaceSwapSettings>({
        groupImage: null,
        portraitImages: [{ image: null, description: '' }], // Start with one empty slot
    });
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const handleImageUpload = (dataUrl: string, type: 'group' | 'portrait', index?: number) => {
        if (type === 'group') {
            setSettings(s => ({ ...s, groupImage: dataUrl }));
        } else if (type === 'portrait' && index !== undefined) {
            const newPortraits = [...settings.portraitImages];
            newPortraits[index] = { ...newPortraits[index], image: dataUrl };
            setSettings(s => ({ ...s, portraitImages: newPortraits }));
        }
    };
    
    // Helper to read file as base64
    const handlePortraitFileChange = (e: TargetedEvent<HTMLInputElement>, index: number) => {
        const file = e.currentTarget.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                if (loadEvent.target?.result) {
                    handleImageUpload(loadEvent.target.result as string, 'portrait', index);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDescriptionChange = (description: string, index: number) => {
        const newPortraits = [...settings.portraitImages];
        newPortraits[index] = { ...newPortraits[index], description };
        setSettings(s => ({ ...s, portraitImages: newPortraits }));
    };

    const addPortraitSlot = () => {
        setSettings(s => ({ ...s, portraitImages: [...s.portraitImages, { image: null, description: '' }] }));
    };

    const removePortraitSlot = (index: number) => {
        if (settings.portraitImages.length <= 1) return; // Always keep at least one
        const newPortraits = settings.portraitImages.filter((_, i) => i !== index);
        setSettings(s => ({ ...s, portraitImages: newPortraits }));
    };
    
    const handleGenerate = async () => {
        const { groupImage, portraitImages } = settings;
        const validPortraits = portraitImages.filter(
            (p): p is { image: string; description: string } => p.image !== null
        );

        if (!groupImage || validPortraits.length === 0) {
            setError('Vui lòng tải lên ảnh nhóm và ít nhất một ảnh chân dung.');
            return;
        }

        setGenerating(true);
        setError('');
        setGeneratedImage(null);
        try {
            const result = await swapFamilyFaces(groupImage, validPortraits);
            setGeneratedImage(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setGenerating(false);
        }
    };
    
    const resetApp = () => {
        setSettings({ groupImage: null, portraitImages: [{ image: null, description: '' }] });
        setGeneratedImage(null);
        setError('');
    };

    const canGenerate = useMemo(() => {
        return !!settings.groupImage && settings.portraitImages.some(p => p.image !== null);
    }, [settings]);

    if (generating) {
        return html`
         <div class="face-swap-app-container">
            <${Loader} text="AI đang ghép mặt, vui lòng chờ..." />
         </div>
        `
    }

    if (generatedImage) {
        return html`
            ${lightboxImage && html`
                <${SimpleLightbox}
                    imageUrl=${lightboxImage}
                    caption="Ảnh Gia Đình Đã Ghép Mặt"
                    onClose=${() => setLightboxImage(null)}
                />
            `}
            <div class="face-swap-results-view">
                 <div class="single-result-container" onClick=${() => setLightboxImage(generatedImage)}>
                     <img src=${generatedImage} alt="Ảnh đã ghép mặt" />
                     <div class="single-result-overlay">
                         <${ViewIcon} /> Xem ảnh lớn
                     </div>
                 </div>
                 ${error && html`<div class="error-message" style=${{marginTop: '1.5rem'}}>${error}</div>`}
                 <div class="actions" style=${{marginTop: '2rem'}}>
                    <button class="btn btn-secondary" onClick=${resetApp}>Tạo ảnh mới</button>
                    <${EnhancedDownloadButton} baseImageUrl=${generatedImage} filename="family-face-swap.jpeg">
                        <${DownloadIcon} /> Tải về
                    </${EnhancedDownloadButton}>
                 </div>
            </div>
        `;
    }

    return html`
    <div class="face-swap-app-container">
        <div class="face-swap-header">
             <h2>Ghép Mặt Ảnh Gia Đình</h2>
        </div>

        <div class="face-swap-info-box">
            <h3>Chào mừng bạn!</h3>
            <p>Sẵn sàng cho một chút niềm vui với ảnh gia đình chưa? Chỉ cần làm theo các bước đơn giản sau:</p>
            <ol>
                <li>Tải lên ảnh gia đình hoặc ảnh nhóm mà bạn muốn chỉnh sửa.</li>
                <li>Tải lên <strong>một hoặc nhiều</strong> ảnh chân dung rõ nét có khuôn mặt bạn muốn sử dụng.</li>
                <li>Nhấn nút <strong>Ghép Mặt</strong> và để AI của chúng tôi ghép tất cả các khuôn mặt vào ảnh!</li>
            </ol>
            <p><strong>Mẹo:</strong> Để có kết quả tốt nhất, hãy sử dụng hình ảnh chất lượng cao và khuôn mặt nhìn thẳng về phía trước.</p>
        </div>

        <div class="face-swap-main-layout">
            <div class="face-swap-upload-section">
                <h4>1. Tải lên Ảnh Nhóm</h4>
                <p class="subtitle">Chọn ảnh gia đình hoặc bạn bè của bạn.</p>
                ${settings.groupImage ? html`
                    <div class="image-preview-container">
                        <img src=${settings.groupImage} alt="Group preview" />
                        <button class="btn btn-secondary" onClick=${() => handleImageUpload('', 'group')} style=${{width:'100%', marginTop: '1rem'}}>
                            Thay đổi ảnh nhóm
                        </button>
                    </div>
                ` : html`
                    <${ImageUploader} onImageUpload=${(data) => handleImageUpload(data, 'group')} id="group-uploader" />
                `}
            </div>

            <div class="face-swap-upload-section">
                <h4>2. Tải lên Ảnh Chân dung</h4>
                <p class="subtitle">Thêm bao nhiêu khuôn mặt tùy thích.</p>
                <div class="portrait-upload-list">
                    ${settings.portraitImages.map((portrait, index) => html`
                        <div class="portrait-upload-item" key=${index}>
                             ${portrait.image ? html`
                                 <div class="image-preview-container" style="width: 120px; height: 120px; flex-shrink: 0;">
                                     <img src=${portrait.image} alt="Portrait ${index + 1}" />
                                 </div>
                             `: html`
                                <div onClick=${() => document.getElementById(`portrait-uploader-${index}`)?.click()} style="width: 120px; height: 120px; flex-shrink: 0;">
                                    <div class="portrait-preview-wrapper" style="width:100%; height: 100%; border-radius: 8px;">
                                        <${UploadIcon} class="upload-icon" />
                                    </div>
                                </div>
                                <input type="file" id=${`portrait-uploader-${index}`} accept="image/*" style="display:none" onChange=${(e: TargetedEvent<HTMLInputElement>) => handlePortraitFileChange(e, index)} />
                             `}
                             <div class="portrait-info">
                                 <p class="label">Gương mặt ${index + 1}</p>
                                 <div class="form-group" style="margin-bottom: 0.5rem;">
                                     <input 
                                         type="text" 
                                         placeholder="Mô tả (vd: người đàn ông áo xanh)" 
                                         value=${portrait.description}
                                         onInput=${(e: TargetedEvent<HTMLInputElement>) => handleDescriptionChange(e.currentTarget.value, index)}
                                     />
                                 </div>
                                 <div class="portrait-actions">
                                      <button class="btn btn-secondary" onClick=${() => document.getElementById(`portrait-uploader-${index}`)?.click()}>
                                        ${portrait.image ? 'Thay đổi' : 'Chọn ảnh'}
                                      </button>
                                      ${settings.portraitImages.length > 1 && html`
                                          <button class="btn btn-danger" onClick=${() => removePortraitSlot(index)}>Xóa</button>
                                      `}
                                 </div>
                             </div>
                        </div>
                    `)}
                </div>
                 <button class="btn add-portrait-btn" onClick=${addPortraitSlot}>+ Thêm gương mặt</button>
            </div>
        </div>
        
        <div class="face-swap-action-bar">
            <button class="btn face-swap-generate-btn" onClick=${handleGenerate} disabled=${generating || !canGenerate}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" style=${{marginRight: '0.5rem'}}><path d="M12 2L9.5 9.5L2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/></svg>
                Ghép Mặt
            </button>
        </div>
        ${error && html`<div class="error-message" style=${{marginTop: '1.5rem'}}>${error}</div>`}
    </div>
    `;
};
