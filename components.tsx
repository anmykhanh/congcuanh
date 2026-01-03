/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { h, FunctionalComponent, ComponentChildren } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import htm from 'htm';
import type { TargetedEvent } from 'preact/compat';
import { Theme } from './types';
import { upscaleImage } from './api';

const html = htm.bind(h);

// --- Navigation Icons ---
export const IdPhotoIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
            <linearGradient id="idCardGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#63b3ed"/>
                <stop offset="100%" stop-color="#4299e1"/>
            </linearGradient>
        </defs>
        <path d="M52,61H12c-2.2,0-4-1.8-4-4V7c0-2.2,1.8-4,4-4h40c2.2,0,4,1.8,4,4v50C56,59.2,54.2,61,52,61z" fill="#3182ce"/>
        <path d="M52,59H12c-2.2,0-4-1.8-4-4V5c0-2.2,1.8-4,4-4h40c2.2,0,4,1.8,4,4v50C56,57.2,54.2,59,52,59z" fill="url(#idCardGradient)"/>
        <path d="M32,33c-5.5,0-10-4.5-10-10s4.5-10,10-10s10,4.5,10,10S37.5,33,32,33z" fill="#dbeafe"/>
        <path d="M46,49H18c0-7.7,6.3-14,14-14S46,41.3,46,49z" fill="#dbeafe"/>
    </svg>
`;
export const RestorationIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <path fill="#f6e05e" d="M55,61H9c-2.2,0-4-1.8-4-4V7c0-2.2,1.8-4,4-4h46c2.2,0,4,1.8,4,4v50C59,59.2,57.2,61,55,61z"/>
        <path fill="#f56565" d="M55,59H9c-2.2,0-4-1.8-4-4V5c0-2.2,1.8-4,4-4h46c2.2,0,4,1.8,4,4v50C59,57.2,57.2,59,55,59z"/>
        <path fill="#f6e05e" d="M5,5v43.2c0,0,15.6-1.1,23.3-13.1c3.1-4.8,3.6-10.9,1.6-16.2C26.4,11.1,19.3,5,19.3,5H5z"/>
        <path fill="none" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" d="M54 21L42 39l-9-7-12 11"/>
    </svg>
`;
export const DocumentIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <path fill="#a0aec0" d="M49 60H15c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4h23l10 10v42c0 2.2-1.8 4-4 4z"/>
        <path fill="#e2e8f0" d="M49 58H15c-2.2 0-4-1.8-4-4V6c0-2.2 1.8-4 4-4h23l10 10v42c0 2.2-1.8 4-4 4z"/>
        <path fill="#a0aec0" d="M37 2v10c0 1.1.9 2 2 2h10L37 2z"/>
        <g fill="#a0aec0">
            <path d="M21 28h22v2H21zM21 36h22v2H21zM21 44h14v2H21z"/>
        </g>
    </svg>
`;
export const FashionIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
            <linearGradient id="fashionGradient3D" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ed64a6"/>
                <stop offset="100%" stop-color="#9f7aea"/>
            </linearGradient>
        </defs>
        <path fill="#794ACF" d="M46 61H18L13 23h38z"/>
        <path fill="url(#fashionGradient3D)" d="M46 59H18L13 21h38z"/>
        <path fill="#794ACF" d="M40 23h-6c0-5 4-9 4-9s-1-4-4-4-4 4-4 4-1.4 4 2 9h-8c-3 0-4 4-4 4h24s-1-4-2-4z"/>
        <path fill="url(#fashionGradient3D)" d="M40 21h-6c0-5 4-9 4-9s-1-4-4-4-4 4-4 4-1.4 4 2 9h-8c-3 0-4 4-4 4h24s-1-4-2-4z"/>
    </svg>
`;
export const ClothingIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
            <linearGradient id="clothingGradient3D" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#4fd1c5"/>
                <stop offset="100%" stop-color="#48bb78"/>
            </linearGradient>
        </defs>
        <path fill="#38A89D" d="M54 61H10c-2.2 0-4-1.8-4-4V21c0-2.2 1.8-4 4-4h44c2.2 0 4 1.8 4 4v36c0 2.2-1.8 4-4 4z"/>
        <path fill="url(#clothingGradient3D)" d="M54 59H10c-2.2 0-4-1.8-4-4V19c0-2.2 1.8-4 4-4h44c2.2 0 4 1.8 4 4v36c0 2.2-1.8 4-4 4z"/>
        <path fill="#38A89D" d="M22 19V9c0-3.3 2.7-6 6-6h8c3.3 0 6 2.7 6 6v10h-2V9c0-2.2-1.8-4-4-4h-8c-2.2 0-4 1.8-4 4v10h-2z"/>
        <path fill="url(#clothingGradient3D)" d="M22 17V7c0-3.3 2.7-6 6-6h8c3.3 0 6 2.7 6 6v10h-2V7c0-2.2-1.8-4-4-4h-8c-2.2 0-4 1.8-4 4v10h-2z"/>
        <g fill="#FFFFFF">
            <path d="M30 33h4v12h-4z"/>
            <path d="M39.6 38.6l-2.8-2.8-5.7 5.7 2.8 2.8z"/>
            <path d="M24.4 38.6l5.7-5.7-2.8-2.8-5.7 5.7z"/>
        </g>
    </svg>
`;
export const FaceTransformIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <path fill="#667eea" d="M26 5C14.4 5 5 14.4 5 26s9.4 21 21 21c2.8 0 5.4-.5 7.8-1.5-.7-.9-1.2-2-1.6-3.1-3.6.9-7.5.2-10.4-2.7-3.8-3.8-3.8-9.9 0-13.7 3.8-3.8 9.9-3.8 13.7 0 1.2 1.2 2 2.6 2.4 4.2.9-.1 1.8-.1 2.7-.1 11.6 0 21-9.4 21-21S49.6 5 38 5c-3.5 0-6.8 1-9.6 2.6C27.6 6 26.8 5.5 26 5z"/>
        <path fill="#b794f4" d="M38 59c11.6 0 21-9.4 21-21s-9.4-21-21-21c-2.8 0-5.4.5-7.8 1.5.7.9 1.2 2 1.6 3.1 3.6-.9 7.5-.2 10.4 2.7 3.8-3.8 3.8-9.9 0 13.7-3.8 3.8-9.9 3.8-13.7 0-1.2-1.2-2-2.6-2.4-4.2-.9.1-1.8.1-2.7.1C9.4 38 0 47.4 0 59c0 2.8 2.2 5 5 5h32c.3 0 .7 0 1-.1.1-.1.1-.1 0 0z"/>
    </svg>
`;
export const WrinkleIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
            <linearGradient id="wrinkleGradient3D" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ecc94b"/>
                <stop offset="100%" stop-color="#ed8936"/>
            </linearGradient>
        </defs>
        <path fill="#D69E2E" d="m32 6-6 13-13 6 13 6 6 13 6-13 13-6-13-6z"/>
        <path fill="url(#wrinkleGradient3D)" d="m32 4-6 13-13 6 13 6 6 13 6-13 13-6-13-6z"/>
        <path opacity=".2" fill="#FFFFFF" d="m32 4 6 13 13 6-4 2.3-9-3.3-3.3-9z"/>
    </svg>
`;
export const ImageFilterIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <path d="M16 54H8V10h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H8C4.7 2 2 4.7 2 8v48c0 3.3 2.7 6 6 6h8c3.3 0 6-2.7 6-6V8c0-3.3-2.7-6-6-6h-2c-1.1 0-2 .9-2 2v44c0 1.1-.9 2-2 2z" fill="#3b82f6"/>
        <path d="M37 54h-8V10h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-8c-3.3 0-6 2.7-6 6v48c0 3.3 2.7 6 6 6h8c3.3 0 6-2.7 6-6V8c0-3.3-2.7-6-6-6h-2c-1.1 0-2 .9-2 2v44c0 1.1-.9 2-2 2z" fill="#f59e0b"/>
        <path d="M58 54h-8V10h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-8c-3.3 0-6 2.7-6 6v48c0 3.3 2.7 6 6 6h8c3.3 0 6-2.7 6-6V8c0-3.3-2.7-6-6-6h-2c-1.1 0-2 .9-2 2v44c0 1.1-.9 2-2 2z" fill="#ef4444"/>
        <circle cx="8" cy="44" r="6" fill="#FFFFFF" stroke="#3b82f6" stroke-width="2"/>
        <circle cx="29" cy="24" r="6" fill="#FFFFFF" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="50" cy="34" r="6" fill="#FFFFFF" stroke="#ef4444" stroke-width="2"/>
    </svg>
`;
export const WeddingIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
            <linearGradient id="weddingGradient3D" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#fbb6ce"/>
                <stop offset="100%" stop-color="#e4b980"/>
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="2" dy="4" result="offsetblur"/>
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5"/>
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#shadow)">
            <path fill="url(#weddingGradient3D)" d="M32 16.3c-8.4-8.5-22.1-8.5-30.5 0-8.5 8.4-8.5 22.1 0 30.5L32 62.1l30.5-30.5c8.5-8.4 8.5-22.1 0-30.5-8.4-8.5-22.1-8.5-30.5 0z"/>
            <path fill="#fff" opacity=".3" d="M32 16.3c-4.2-4.2-11-4.2-15.2 0-4.2 4.2-4.2 11 0 15.2L32 46.8l5-5c-4.2-4.2-4.2-11 0-15.2 4.2-4.2 11-4.2 15.2 0 .8-.8 1.5-1.7 2.2-2.6-8.4-8.5-22.1-8.5-30.5 0z"/>
        </g>
    </svg>
`;
export const BirthdayIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <path fill="#f59e0b" d="M56 62H8c-1.1 0-2-.9-2-2V42c0-1.1.9-2 2-2h48c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2z"/>
        <path fill="#ed64a6" d="M54 44H10V30h44v14z"/>
        <path fill="#f6e05e" d="M52 32H12c-1.1 0-2-.9-2-2V18c0-1.1.9-2 2-2h40c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2z"/>
        <path fill="#fbb6ce" d="M22 16h-4V8h4v8zm8 0h-4V4h4v12zm8 0h-4V8h4v8zm8 0h-4V4h4v12z"/>
        <path fill="#f6e05e" d="M22 8h-4V5h4v3zm8 0h-4V1h4v7zm8 0h-4V5h4v3zm8 0h-4V1h4v7z"/>
    </svg>
`;
export const SharpenIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
            <linearGradient id="sharpenGradient3D" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#3b82f6"/>
                <stop offset="100%" stop-color="#2dd4bf"/>
            </linearGradient>
        </defs>
        <path fill="#1D6CBC" d="m32 6-6 13-13 6 13 6 6 13 6-13 13-6-13-6z"/>
        <path fill="url(#sharpenGradient3D)" d="m32 4-6 13-13 6 13 6 6 13 6-13 13-6-13-6z"/>
        <path opacity=".3" fill="#FFFFFF" d="m32 4 6 13 13 6-4 2.3-9-3.3-3.3-9z"/>
    </svg>
`;
export const FamilyIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <g fill="#48bb78">
            <circle cx="32" cy="18" r="9"/>
            <path d="M46 41H18c0-7.7 6.3-14 14-14s14 6.3 14 14z"/>
        </g>
        <g fill="#f6e05e">
            <circle cx="13" cy="29" r="7"/>
            <path d="M24 50H2c0-6.1 4.9-11 11-11s11 4.9 11 11z"/>
        </g>
        <g fill="#f6e05e">
            <circle cx="51" cy="29" r="7"/>
            <path d="M62 50H40c0-6.1 4.9-11 11-11s11 4.9 11 11z"/>
        </g>
    </svg>
`;
export const PaletteIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <path fill="#a0aec0" d="M55.9 33.3C52.1 49.5 36.8 61 22.3 61c-11.4 0-21.2-7.2-24-17.7C-4.4 34.2 1.4 23 11.2 16.5c9.8-6.5 22.6-4.9 30.8 1.8 3.5 2.8 6.1 6.5 7.9 10.5 1 .9 2.4.5 3-.5s.5-2.4-.5-3C50.2 21 47 16.7 42.9 13.5c-9.7-7.6-24.5-5.8-35.8 2.5C-4.1 22.9-10.5 35.6-7.1 46.2-3.8 58.7 8.1 63 19.3 63c15.4 0 31.8-12.4 36-29.9.5-1.3-.3-2.6-1.6-3.1s-2.6.3-3.1 1.6z"/>
        <circle fill="#ef4444" cx="19" cy="17" r="7"/>
        <circle fill="#3b82f6" cx="41" cy="46" r="6"/>
        <circle fill="#10b981" cx="43" cy="29" r="8"/>
        <circle fill="#f59e0b" cx="21" cy="38" r="9"/>
    </svg>
`;
export const ColorCorrectionIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <path fill="#f87171" d="M14 62H6V2h8v60z"/>
        <path fill="#4ade80" d="M29 62h-8V22h8v40z"/>
        <path fill="#60a5fa" d="M44 62h-8V12h8v50z"/>
        <path fill="#eab308" d="M59 62h-8V32h8v30z"/>
    </svg>
`;
export const FaceAlignIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
            <radialGradient id="faceAlignGradient3D" cx="0.3" cy="0.3" r="1">
                <stop offset="0%" stop-color="#a7f3d0"/>
                <stop offset="100%" stop-color="#34d399"/>
            </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#faceAlignGradient3D)"/>
        <path fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" d="M12 32h40M32 12v40"/>
        <circle cx="32" cy="32" r="10" fill="none" stroke="#fff" stroke-width="2"/>
        <path fill="#fff" d="M30 30h4v4h-4z"/>
    </svg>
`;
export const SymmetryIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
            <linearGradient id="symmetryGradient3D" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#c084fc"/>
                <stop offset="100%" stop-color="#818cf8"/>
            </linearGradient>
        </defs>
        <path fill="#6D28D9" d="M49,58.5c-9,4.4-19.9,4.4-28.9,0C10.7,54.3,6,45.8,6,36.2V15.7l26-12l26,12v20.5 C58,45.8,53.3,54.3,49,58.5z"/>
        <path fill="url(#symmetryGradient3D)" d="M49,56.5c-9,4.4-19.9,4.4-28.9,0C10.7,52.3,6,43.8,6,34.2V13.7l26-12l26,12v20.5 C58,43.8,53.3,52.3,49,56.5z"/>
        <path fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" d="M32,5.2v53.1 M16,19c0,0,16-6,16-6s16,6,16,6 M19,41c0,0,13,6,13,6s13-6,13-6"/>
    </svg>
`;
export const LightingIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
            <radialGradient id="lightingGradient3D" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stop-color="#fef3c7"/>
                <stop offset="100%" stop-color="#fbbf24"/>
            </radialGradient>
        </defs>
        <path fill="#f97316" d="M42,52c0,3.3-2.7,6-6,6h-8c-3.3,0-6-2.7-6-6v-4h20V52z"/>
        <path fill="#d97706" d="M42.4,50c-0.1-1.2-0.2-1.9-0.4-3c-1.2-6.5-7.3-15-10-17c-2.7,2-8.8,10.5-10,17c-0.1,1.1-0.2,1.8-0.4,3H42.4z"/>
        <path fill="url(#lightingGradient3D)" d="M46,31c0-7.7-6.3-14-14-14s-14,6.3-14,14c0,5.6,3.3,10.4,8,12.6V46h12v-2.4C42.7,41.4,46,36.6,46,31z"/>
        <g fill="#f97316">
            <path d="M32 6L30 14h4z"/>
            <path d="M51.9 19.1L45 22.9l-2-3.5 6.9-3.8z"/>
            <path d="M12.1 19.1l6.9 3.8-2 3.5-6.9-3.8z"/>
        </g>
    </svg>
`;
export const BackgroundIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
            <linearGradient id="backgroundGradient3D" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#4ade80"/>
                <stop offset="100%" stop-color="#38bdf8"/>
            </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="4" ry="4" fill="url(#backgroundGradient3D)"/>
        <path d="M51.1,58H12.9c-2.2,0-4-1.8-4-4V35.1l11.7-14.1c1.6-1.9,4.4-2.2,6.3-0.6l5.9,5l9.2-11.1c1.7-2,4.7-2,6.4-0.1l9.5,10.6V54 C55.1,56.2,53.3,58,51.1,58z" fill="#f0fdf4"/>
        <circle cx="42" cy="17" r="6" fill="#fef08a"/>
    </svg>
`;
export const MockupIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
            <linearGradient id="mockupGradient3D" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#9ca3af"/>
                <stop offset="100%" stop-color="#60a5fa"/>
            </linearGradient>
        </defs>
        <path fill="#64748b" d="M54,62H10c-2.2,0-4-1.8-4-4V12c0-2.2,1.8-4,4-4h44c2.2,0,4,1.8,4,4v46C58,60.2,56.2,62,54,62z"/>
        <path fill="url(#mockupGradient3D)" d="M54,60H10c-2.2,0-4-1.8-4-4V10c0-2.2,1.8-4,4-4h44c2.2,0,4,1.8,4,4v46C58,58.2,56.2,60,54,60z"/>
        <rect x="14" y="14" width="36" height="36" rx="2" ry="2" fill="#e2e8f0"/>
        <circle cx="32" cy="54" r="3" fill="#e2e8f0"/>
    </svg>
`;
export const TrendIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <path fill="#ef4444" d="M62 16.2V8.8c0-1.1-1.2-1.8-2.1-1.2l-15.5 9.7c-.5.3-1.1.2-1.5-.2L32 6.5 15.6 22.2c-.5.5-.5 1.2 0 1.7L26.2 34c.5.5 1.2.5 1.7 0l15.3-16.1c.4-.4.3-1.1-.2-1.5L33.3 9.7c-.6-.4-1.4-.4-2 0L19.4 20.2c-.5.5-1.2.5-1.7 0L7.1 9.6c-.5-.5-1.3-.4-1.7.1L2.1 13c-.6.8.1 1.9 1.1 1.9h5.1c.5 0 .9.4.9.9v35.4c0 4.1 3.3 7.4 7.4 7.4h35.1c1 0 1.7-.9 1.7-2V17.1c0-.5.4-.9.9-.9H62z"/>
        <path fill="#f97316" d="M52.3,13.8L37.1,29.8c-0.5,0.5-1.2,0.5-1.7,0L24.8,19.2c-0.5-0.5-1.2-0.5-1.7,0L13,29.3V15.5 c0-0.6,0.4-1,1-1h38.3C52.7,14.5,52.5,14.2,52.3,13.8z"/>
        <path fill="#FFFFFF" opacity=".3" d="M62 8.8c0-1.1-1.2-1.8-2.1-1.2l-15.5 9.7c-.5.3-1.1.2-1.5-.2L32 6.5 15.6 22.2c-.5.5-.5 1.2 0 1.7L26.2 34c.2.2.5.4.8.4l19.1-20.1c.4-.4.3-1.1-.2-1.5l-9.7-6.1c-.6-.4-1.4-.4-2 0L22.3 20.2c-.5.5-1.2.5-1.7 0L10.1 9.6c-.5-.5-1.3-.4-1.7.1L5.1 13c-.6.8.1 1.9 1.1 1.9h5.1c.5 0 .9.4.9.9v10.3l-2.9-2.9c-.5-.5-1.2-.5-1.7,0l-1.9,1.9c-.5,.5-.5,1.2,0,1.7l10.6,10.6c.5,.5,1.2,.5,1.7,0l10.6-10.6c.5-.5,.5-1.2,0-1.7l-1.9-1.9c-.5-.5-1.2-.5-1.7,0l-2.9,2.9v-7.4l11.9-12.5c.4-.4,1.1-.5,1.5-.2l15.5,9.7c.9,.6,2.1-.1,2.1-1.2V8.8z"/>
    </svg>
`;
export const CleanBackgroundIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
            <linearGradient id="cleanBackgroundGradient3D" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#7dd3fc"/>
                <stop offset="100%" stop-color="#e0f2fe"/>
            </linearGradient>
        </defs>
        <path fill="#0ea5e9" d="M60 62H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h56c1.1 0 2 .9 2 2v56c0 1.1-.9 2-2 2z"/>
        <path fill="url(#cleanBackgroundGradient3D)" d="M60 60H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h56c1.1 0 2 .9 2 2v54c0 1.1-.9 2-2 2z"/>
        <path d="M42.8 19.2c-1.6-1.6-4.1-1.6-5.7 0L20.5 35.8c-.8.8-2 .8-2.8 0l-4.2-4.2c-.8-.8-2-.8-2.8 0l-2.8 2.8c-.8.8-.8 2 0 2.8l9.9 9.9c.8.8 2 .8 2.8 0L45.6 22c.8-.8.8-2 0-2.8l-2.8-2.8z" fill="#FFFFFF" opacity=".8"/>
    </svg>
`;
export const HistoryIcon: FunctionalComponent = () => html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
            <linearGradient id="historyGradient3D" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#60a5fa"/>
                <stop offset="100%" stop-color="#a78bfa"/>
            </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="#a78bfa"/>
        <circle cx="32" cy="32" r="28" fill="url(#historyGradient3D)"/>
        <circle cx="32" cy="32" r="23" fill="#FFFFFF"/>
        <path fill="#a78bfa" d="M34 18h-4v15.2l12.4 7.2 2-3.5-10.4-6.1z"/>
        <path fill="#60a5fa" d="M38.7 54.7C27.2 53.2 18 43.5 18 32c0-5.4 2.1-10.3 5.5-14L18 12.5V23h-4V11c0-1.1.9-2 2-2h12v4H19.5l4.4 5.9C27.3 16.5 32 15 37 16.3c10.3 2.6 17 12.3 17 23.2.1 11.2-8.8 20.6-20 20.6-1.5 0-3-.2-4.4-.5l2.1-3.6c1.1.2 2.1.3 3.2.3 8.3 0 15-6.7 15-15 0-8.2-6.5-14.7-14.5-15z"/>
    </svg>
`;
export const NavToggleIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`;
export const SunIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.64 5.64c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L5.64 5.64zm12.73 12.73c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.06-1.06zM5.64 18.36c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.06-1.06c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.06 1.06zm12.73-12.73c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.06-1.06c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.06 1.06z"/></svg>`;
export const MoonIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>`;
export const MicIcon: FunctionalComponent<{ recording: boolean }> = ({ recording }) => html`<svg class=${recording ? 'recording' : ''} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14q.825 0 1.413-.587T14 12V6q0-.825-.587-1.413T12 4q-.825 0-1.413.587T10 6v6q0 .825.587 1.413T12 14Zm-1 7v-3.075q-2.6-.35-4.3-2.325T5 12H7q0 2.075 1.463 3.538T12 17q2.075 0 3.538-1.463T17 12h2q0 2.25-1.7 4.225T13 20.925V21Zm1-6q1.65 0 2.825-1.175T16 12V6q0-1.65-1.175-2.825T12 2q-1.65 0-2.825 1.175T8 6v6q0 1.65 1.175 2.825T12 15Z"/></svg>`;
export const UploadIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 16V7.85l-2.6 2.6L7 9l5-5 5 5-1.4 1.45-2.6-2.6V16h-2Zm-5 4q-.825 0-1.413-.587T4 18V6q0-.825.587-1.413T6 4h4V2H6q-1.65 0-2.825 1.175T2 6v12q0 1.65 1.175 2.825T6 22h12q1.65 0 2.825-1.175T22 18V9h-2v9q0 .825-.587 1.413T18 20H6Z"/></svg>`;
export const DownloadIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16.5l-4-4h2.5v-6h3v6H15l-3 4.5M6 20h12v-2H6v2Z"/></svg>`;
export const RegenerateIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>`;
export const DeleteIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;
export const CloseIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"/></svg>`;
export const ImageIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`;
export const PassportPhotoIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zM4 19V7h16v12H4zm8-11c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>`;
export const ViewIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 13C8.24 17.5 5.5 15.12 4.08 12c1.42-3.12 4.16-5.5 7.92-5.5s6.5 2.38 7.92 5.5c-1.42 3.12-4.16 5.5-7.92 5.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z"/></svg>`;
export const UnfoldIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5.83 15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"/></svg>`;
export const ZaloIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M15.24,15.31H9.86C8.56,15.31 7.5,14.25 7.5,12.95V9.05C7.5,7.75 8.56,6.69 9.86,6.69H15.24C16.54,6.69 17.6,7.75 17.6,9.05V12.95C17.6,14.25 16.54,15.31 15.24,15.31M12.22,13.86H15.24V9.05H9.86V10.85H13.4L9.86,13.01V13.86Z" /></svg>`;
export const HelpIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>`;
export const CheckIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`;
export const DiamondIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5L2 9l10 13L22 9l-3-3zm-7 15.67L6.44 9h11.12L12 18.67z"/></svg>`;
export const ChevronDownIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 10.59L12 15.17l4.59-4.58L18 12l-6 6-6-6 1.41-1.41z"/></svg>`;
export const ZoomInIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM10 9h-1v-1H8v1H7v1h1v1h1v-1h1V9z"/></svg>`;
export const ZoomOutIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/></svg>`;
export const UserSolidIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
export const ControlsIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>`;
export const GridIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"></path></svg>`;
export const Icon4K: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8.5 7.5H9v1h1.5v1.5h-1.5v1H9v-1H7.5V9H9V7.5h1.5V9H12v1.5h-1.5v1zm6.5 2.5h-1.5l-1.5-2v2H13V9h1.5v2l1.5-2H17.5l-2 2.5 2 4z"/></svg>`;
export const Icon8K: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm0 4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm0 4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm6 2.5h-1.5l-1.5-2v2H13V9h1.5v2l1.5-2H17.5l-2 2.5 2 4z"/></svg>`;
export const CompareIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z"/></svg>`;
export const SideBySideIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z"/></svg>`;
export const SliderSwapIcon: FunctionalComponent = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 9l-3.99-4v3H6.99v2H17.01v3L21 9zM3 15l3.99 4v-3h10.02v-2H6.99v-3L3 15z"></path></svg>`;


// --- Reusable Components ---
export const Loader: FunctionalComponent<{ text: string }> = ({ text }) => html`
    <div class="loader-overlay">
        <div class="spinner"></div>
        <div class="loader-text">${text}</div>
    </div>
`;

interface ImageUploaderProps {
    onImageUpload: (dataUrl: string) => void;
    id?: string;
}

export const ImageUploader: FunctionalComponent<ImageUploaderProps> = ({ onImageUpload, id = 'file-input' }) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File | null | undefined) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                if (loadEvent.target?.result) {
                    onImageUpload(loadEvent.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e: TargetedEvent<HTMLInputElement>) => {
        handleFile(e.currentTarget.files?.[0]);
    };

    const handleClick = () => inputRef.current?.click();

    const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Necessary to allow drop
    };
    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFile(e.dataTransfer?.files[0]);
    };

    return html`
        <div 
            class="upload-area ${isDragging ? 'dragging' : ''}" 
            onClick=${handleClick}
            onDragEnter=${handleDragEnter}
            onDragLeave=${handleDragLeave}
            onDragOver=${handleDragOver}
            onDrop=${handleDrop}
        >
            <input type="file" id=${id} ref=${inputRef} accept="image/*" style=${{display: 'none'}} onChange=${handleFileChange} />
            <div class="upload-area-content">
                <${UploadIcon} />
                <h3>Kéo & Thả ảnh vào đây</h3>
                <p class="separator"><span>hoặc</span></p>
                <button class="btn btn-secondary btn-upload" onClick=${(e: MouseEvent) => {e.stopPropagation(); handleClick();}}>Chọn từ máy tính</button>
                <p class="upload-hint">Hỗ trợ: PNG, JPG, WEBP</p>
            </div>
        </div>
    `;
};


interface ImageComparisonSliderProps {
    original: string | null;
    generated: string | null;
    objectFit?: 'cover' | 'contain';
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export const ImageComparisonSlider: FunctionalComponent<ImageComparisonSliderProps> = ({ 
    original, 
    generated, 
    objectFit = 'cover',
    size = 'medium',
    className = ''
}) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const fitStyle = { objectFit };

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        percentage = Math.max(0, Math.min(100, percentage));
        setSliderPosition(percentage);
    };

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleTouchStart = (e: TouchEvent) => {
        setIsDragging(true);
    };
    
    useEffect(() => {
        const handleMouseUp = () => setIsDragging(false);
        const handleTouchEnd = () => setIsDragging(false);

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) handleMove(e.clientX);
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging) handleMove(e.touches[0].clientX);
        };

        // Attach listeners to window to handle dragging outside the component
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleMove]);

    // Thêm class dựa trên size
    const sizeClass = size === 'small' ? 'comparison-slider-small' : 
                     size === 'large' ? 'comparison-slider-large' : '';

    if (!original) {
        return null; // Or some placeholder
    }

    if (!generated) {
        return html`
            <div class="comparison-slider ${sizeClass} ${className}">
                <div class="comparison-image-wrapper">
                    <img src=${original} alt="Image" draggable="false" style=${fitStyle} />
                </div>
            </div>
        `;
    }

    return html`
        <div 
            ref=${containerRef}
            class="comparison-slider ${sizeClass} ${className}" 
            onMouseDown=${handleMouseDown}
            onTouchStart=${handleTouchStart}
        >
            <div class="comparison-image-wrapper">
                <img src=${original} alt="Original" draggable="false" style=${fitStyle} />
            </div>
            <div 
                class="comparison-image-wrapper comparison-image-after" 
                style=${{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img src=${generated} alt="Generated" draggable="false" style=${fitStyle} />
            </div>
            <div 
                class="comparison-handle" 
                style=${{ left: `${sliderPosition}%` }}
            >
                <div class="comparison-handle-icon">
                    <${UnfoldIcon} />
                </div>
            </div>
        </div>
    `;
};

interface EnhancedDownloadButtonProps {
    baseImageUrl: string | null;
    filename: string;
    disabled?: boolean;
    children: any;
    class?: string;
    style?: h.JSX.CSSProperties;
    onProcessStart?: () => void;
    onProcessComplete?: (processedUrl: string) => void;
    onError?: (error: string) => void;
}

export const EnhancedDownloadButton: FunctionalComponent<EnhancedDownloadButtonProps> = ({
    baseImageUrl,
    filename,
    disabled,
    children,
    class: className,
    style,
    onProcessStart,
    onProcessComplete,
    onError
}) => {
    const [status, setStatus] = useState<'idle' | 'upscaling' | 'downloading' | 'downloaded' | 'error'>('idle');
    const [quality, setQuality] = useState<'standard' | 'high' | 'ultra'>('standard');
    const [fileFormat, setFileFormat] = useState<'jpg' | 'png' | 'webp'>('jpg');
    const [qualityDropdownOpen, setQualityDropdownOpen] = useState(false);
    const [formatDropdownOpen, setFormatDropdownOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setQualityDropdownOpen(false);
                setFormatDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDownloadClick = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!baseImageUrl || status === 'upscaling' || status === 'downloading') return;

        onProcessStart?.();
        setStatus(quality === 'standard' ? 'downloading' : 'upscaling');
        setErrorMsg('');

        try {
            let urlToProcess = baseImageUrl;
            if (quality === 'high' || quality === 'ultra') {
                const target = quality === 'high' ? '4k' : '8k';
                urlToProcess = await upscaleImage(baseImageUrl, target);
            }
            
            onProcessComplete?.(urlToProcess);
            setStatus('downloading');

            const response = await fetch(urlToProcess);
            if (!response.ok) throw new Error('Failed to fetch image for download');
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Canvas context error');
                
                ctx.drawImage(img, 0, 0);
                
                const mimeType = `image/${fileFormat === 'jpg' ? 'jpeg' : fileFormat}`;
                const finalFilename = `${filename.split('.')[0]}.${fileFormat}`;
                const dataUrlToDownload = canvas.toDataURL(mimeType, 0.95);
                
                const link = document.createElement('a');
                link.href = dataUrlToDownload;
                link.download = finalFilename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                URL.revokeObjectURL(objectUrl);
                
                setStatus('downloaded');
                setTimeout(() => setStatus('idle'), 3000);
            };
            img.onerror = () => { throw new Error('Failed to load processed image'); };
            img.src = objectUrl;

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Lỗi không xác định khi xử lý ảnh.';
            setErrorMsg(message);
            onError?.(message);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    const toggleQualityDropdown = () => { setFormatDropdownOpen(false); setQualityDropdownOpen(o => !o); };
    const toggleFormatDropdown = () => { setQualityDropdownOpen(false); setFormatDropdownOpen(o => !o); };

    const handleQualitySelect = (q: 'standard' | 'high' | 'ultra') => { setQuality(q); setQualityDropdownOpen(false); };
    const handleFormatSelect = (f: 'jpg' | 'png' | 'webp') => { setFileFormat(f); setFormatDropdownOpen(false); };

    const isDisabled = disabled || !baseImageUrl || status === 'upscaling' || status === 'downloading';
    
    let buttonContent;
    let finalClassName = `btn ${className || 'btn-primary'}`;
    switch (status) {
        case 'upscaling': buttonContent = `Đang nâng cấp ${quality === 'high' ? '4K' : '8K'}...`; break;
        case 'downloading': buttonContent = 'Đang xử lý tải...'; break;
        case 'downloaded': buttonContent = html`<${CheckIcon} /> Đã tải!`; break;
        case 'error': buttonContent = 'Lỗi! Thử lại'; finalClassName += ' btn-danger'; break;
        default: buttonContent = children;
    }

    const qualityLabels = { standard: 'STD', high: '4K', ultra: '8K' };

    return html`
        <div class="download-control-group" style=${style} ref=${wrapperRef}>
            <button class=${finalClassName} onClick=${handleDownloadClick} disabled=${isDisabled}>
                ${buttonContent}
            </button>
            <button class="btn ${className || 'btn-primary'} selector-toggle-btn" onClick=${toggleQualityDropdown} disabled=${isDisabled} title="Chọn chất lượng">
                <span class="selector-label">${qualityLabels[quality]}</span>
                <${ChevronDownIcon} />
            </button>
            <button class="btn ${className || 'btn-primary'} selector-toggle-btn" onClick=${toggleFormatDropdown} disabled=${isDisabled} title="Chọn định dạng tệp">
                <span class="selector-label">${fileFormat.toUpperCase()}</span>
                <${ChevronDownIcon} />
            </button>
            
            ${qualityDropdownOpen && html`
                <ul class="selector-dropdown quality-dropdown">
                    <li onClick=${() => handleQualitySelect('standard')}>Tiêu chuẩn (STD)</li>
                    <li onClick=${() => handleQualitySelect('high')}>Chất lượng cao (4K)</li>
                    <li onClick=${() => handleQualitySelect('ultra')}>Siêu sắc nét (8K)</li>
                </ul>
            `}
            ${formatDropdownOpen && html`
                <ul class="selector-dropdown format-dropdown">
                    <li onClick=${() => handleFormatSelect('jpg')}>JPG</li>
                    <li onClick=${() => handleFormatSelect('png')}>PNG</li>
                    <li onClick=${() => handleFormatSelect('webp')}>WEBP</li>
                </ul>
            `}
        </div>
    `;
};


interface ThemeToggleProps {
    theme: Theme;
    onToggle: () => void;
}
export const ThemeToggle: FunctionalComponent<ThemeToggleProps> = ({ theme, onToggle }) => {
    const Icon = theme === 'light' ? MoonIcon : SunIcon;
    const label = theme === 'light' ? 'Giao diện Tối' : 'Giao diện Sáng';
    return html`
        <button class="theme-toggle" onClick=${onToggle} title="Toggle theme">
            <span class="tab-icon"><${Icon} /></span>
            <span class="tab-label">${label}</span>
        </button>
    `;
};

interface LightboxProps {
    originalUrl: string;
    generatedUrl: string;
    caption: string;
    onClose: () => void;
}
export const Lightbox: FunctionalComponent<LightboxProps> = ({ originalUrl, generatedUrl, caption, onClose }) => {
    return html`
        <div class="lightbox-overlay" onClick=${onClose}>
            <div class="lightbox-content" onClick=${(e: MouseEvent) => e.stopPropagation()}>
                <div class="lightbox-header">
                    <h3>${caption}</h3>
                    <button class="lightbox-close-btn" onClick=${onClose} title="Close">
                        <${CloseIcon} />
                    </button>
                </div>
                <div class="lightbox-image-comparison">
                    <div class="lightbox-image-wrapper">
                        <img src=${originalUrl} alt="Original Image" />
                        <p>Ảnh gốc</p>
                    </div>
                    <div class="lightbox-image-wrapper">
                        <img src=${generatedUrl} alt="Generated Image" />
                        <p>Ảnh Trend</p>
                    </div>
                </div>
            </div>
        </div>
    `;
};

interface SimpleLightboxProps {
    imageUrl: string;
    caption: string;
    onClose: () => void;
}

export const SimpleLightbox: FunctionalComponent<SimpleLightboxProps> = ({ imageUrl, caption, onClose }) => {
    const [zoom, setZoom] = useState(100);

    const imgStyle = {
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'center',
        maxWidth: zoom > 100 ? 'none' : '100%',
        maxHeight: zoom > 100 ? 'none' : '100%',
        transition: 'transform 0.1s ease-out',
    };
    
    const zoomStep = 25;
    const minZoom = 25;
    const maxZoom = 400;

    const handleZoomIn = () => setZoom(z => Math.min(maxZoom, z + zoomStep));
    const handleZoomOut = () => setZoom(z => Math.max(minZoom, z - zoomStep));
    const handleSliderChange = (e: TargetedEvent<HTMLInputElement>) => setZoom(parseInt(e.currentTarget.value, 10));

    return html`
        <div class="lightbox-overlay" onClick=${onClose}>
            <div class="lightbox-content" onClick=${(e: MouseEvent) => e.stopPropagation()}>
                <div class="lightbox-header">
                    <h3>${caption}</h3>
                    <div class="lightbox-actions">
                         <${EnhancedDownloadButton} baseImageUrl=${imageUrl} filename=${`${caption}.jpg`}>
                            <${DownloadIcon} /> Tải về
                        </${EnhancedDownloadButton}>
                        <button class="lightbox-close-btn" onClick=${onClose} title="Close">
                            <${CloseIcon} />
                        </button>
                    </div>
                </div>
                <div class="lightbox-image-wrapper-single">
                    <img src=${imageUrl} alt=${caption} style=${imgStyle} />
                </div>
                <div class="lightbox-footer">
                    <button class="toolbar-btn" onClick=${handleZoomOut} disabled=${zoom <= minZoom}><${ZoomOutIcon} /></button>
                    <div class="zoom-slider-container">
                        <input 
                            type="range" 
                            min=${minZoom} 
                            max=${maxZoom} 
                            value=${zoom} 
                            onInput=${handleSliderChange}
                        />
                    </div>
                    <button class="toolbar-btn" onClick=${handleZoomIn} disabled=${zoom >= maxZoom}><${ZoomInIcon} /></button>
                    <span class="zoom-value">${zoom}%</span>
                </div>
            </div>
        </div>
    `;
};

export const ImageActionsToolbar: FunctionalComponent<{
    generatedImage: string | null;
    filename: string;
    onReset: () => void;
    onView?: () => void;
    isGenerating: boolean;
    children?: ComponentChildren;
}> = ({ generatedImage, filename, onReset, onView, isGenerating, children }) => {
    // This toolbar fades out during generation
    if (!generatedImage && !isGenerating) {
        return null;
    }

    return html`
        <div 
            class="image-actions-toolbar" 
            style=${{ 
                opacity: isGenerating ? 0 : 1, 
                pointerEvents: isGenerating ? 'none' : 'auto',
                transition: 'opacity 0.3s ease'
            }}
        >
            ${children}
            ${children && html`<div class="divider"></div>`}

            <button class="toolbar-btn" onClick=${onReset} title="Tải ảnh mới" disabled=${isGenerating}>
                <${UploadIcon} />
            </button>
            
            <div class="divider"></div>

            <${EnhancedDownloadButton} 
                baseImageUrl=${generatedImage} 
                filename=${filename} 
                disabled=${isGenerating || !generatedImage}
            >
                <${DownloadIcon} /> Tải về
            </${EnhancedDownloadButton}>
            
            ${onView && html`
                <div class="divider"></div>
                <button class="toolbar-btn" onClick=${onView} disabled=${isGenerating || !generatedImage} title="Xem ảnh lớn">
                    <${ViewIcon} />
                </button>
            `}
        </div>
    `;
};

// --- New Components for Small Image Display ---

interface SmallImageDisplayProps {
    imageUrl: string;
    alt: string;
    maxWidth?: number;
    maxHeight?: number;
    width?: number;
    height?: number;
    className?: string;
    onClick?: () => void;
}

export const SmallImageDisplay: FunctionalComponent<SmallImageDisplayProps> = ({
    imageUrl,
    alt,
    maxWidth = 300,
    maxHeight = 300,
    width,
    height,
    className = '',
    onClick
}) => {
    const containerStyle: h.JSX.CSSProperties = {
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#f5f5f5',
        cursor: onClick ? 'pointer' : 'default',
        margin: '0 auto'
    };

    const imgStyle: h.JSX.CSSProperties = {
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        objectFit: 'contain' as const,
        display: 'block'
    };

    return html`
        <div 
            class=${`small-image-display ${className}`} 
            style=${containerStyle}
            onClick=${onClick}
        >
            <img src=${imageUrl} alt=${alt} style=${imgStyle} />
        </div>
    `;
};

interface CompactImageDisplayProps {
    imageUrl: string;
    alt: string;
    filename: string;
    onView?: () => void;
    onReset?: () => void;
    onDelete?: () => void;
    maxWidth?: number;
    maxHeight?: number;
    showActions?: boolean;
}

export const CompactImageDisplay: FunctionalComponent<CompactImageDisplayProps> = ({
    imageUrl,
    alt,
    filename,
    onView,
    onReset,
    onDelete,
    maxWidth = 250,
    maxHeight = 250,
    showActions = true
}) => {
    return html`
        <div class="compact-image-container">
            <${SmallImageDisplay} 
                imageUrl=${imageUrl}
                alt=${alt}
                maxWidth=${maxWidth}
                maxHeight=${maxHeight}
                onClick=${onView}
                className="compact-image"
            />
            
            ${showActions && html`
                <div class="compact-image-actions">
                    ${onReset && html`
                        <button class="btn btn-sm btn-secondary" onClick=${onReset} title="Tải ảnh mới">
                            <${UploadIcon} />
                            <span>Mới</span>
                        </button>
                    `}
                    
                    ${onView && html`
                        <button class="btn btn-sm btn-secondary" onClick=${onView} title="Xem ảnh lớn">
                            <${ViewIcon} />
                            <span>Xem</span>
                        </button>
                    `}
                    
                    <${EnhancedDownloadButton} 
                        baseImageUrl=${imageUrl} 
                        filename=${filename}
                        style=${{ padding: '4px 8px', fontSize: '12px' }}
                        class="btn-sm"
                    >
                        <${DownloadIcon} /> Tải
                    </${EnhancedDownloadButton}>
                    
                    ${onDelete && html`
                        <button class="btn btn-sm btn-danger" onClick=${onDelete} title="Xóa ảnh">
                            <${DeleteIcon} />
                            <span>Xóa</span>
                        </button>
                    `}
                </div>
            `}
        </div>
    `;
};

interface GalleryGridProps {
    images: Array<{
        id: string | number;
        url: string;
        alt: string;
        filename: string;
        originalUrl?: string;
    }>;
    onImageClick?: (image: any) => void;
    onDownload?: (image: any) => void;
    onDelete?: (image: any) => void;
    columns?: number;
}

export const GalleryGrid: FunctionalComponent<GalleryGridProps> = ({
    images,
    onImageClick,
    onDownload,
    onDelete,
    columns = 3
}) => {
    const gridStyle: h.JSX.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '16px',
        padding: '16px'
    };

    return html`
        <div class="gallery-grid" style=${gridStyle}>
            ${images.map((image, index) => html`
                <div key=${image.id || index} class="gallery-item">
                    <${SmallImageDisplay}
                        imageUrl=${image.url}
                        alt=${image.alt}
                        maxWidth=${200}
                        maxHeight=${200}
                        onClick=${() => onImageClick?.(image)}
                    />
                    
                    <div class="gallery-item-actions">
                        ${onImageClick && html`
                            <button 
                                class="btn btn-xs btn-secondary"
                                onClick=${() => onImageClick?.(image)}
                            >
                                <${ViewIcon} />
                            </button>
                        `}
                        
                        ${onDownload && html`
                            <${EnhancedDownloadButton}
                                baseImageUrl=${image.url}
                                filename=${image.filename}
                                style=${{ padding: '2px 6px', fontSize: '10px' }}
                                class="btn-xs"
                            >
                                <${DownloadIcon} />
                            </${EnhancedDownloadButton}>
                        `}
                        
                        ${onDelete && html`
                            <button 
                                class="btn btn-xs btn-danger"
                                onClick=${() => onDelete?.(image)}
                            >
                                <${DeleteIcon} />
                            </button>
                        `}
                    </div>
                </div>
            `)}
        </div>
    `;
};

// --- Compact Comparison Display ---
interface CompactComparisonProps {
    originalUrl: string;
    generatedUrl: string;
    onView?: () => void;
    onDownload?: () => void;
    onReset?: () => void;
    size?: 'small' | 'medium';
}

export const CompactComparisonDisplay: FunctionalComponent<CompactComparisonProps> = ({
    originalUrl,
    generatedUrl,
    onView,
    onDownload,
    onReset,
    size = 'small'
}) => {
    const containerClass = size === 'small' ? 'compact-comparison-small' : 'compact-comparison-medium';
    
    return html`
        <div class="compact-comparison-container ${containerClass}">
            <div class="comparison-images-row">
                <div class="compact-image-pair">
                    <div class="compact-image-wrapper">
                        <img src=${originalUrl} alt="Original" class="compact-image" />
                        <div class="compact-image-label">Ảnh gốc</div>
                    </div>
                    <div class="compact-image-wrapper">
                        <img src=${generatedUrl} alt="Generated" class="compact-image" />
                        <div class="compact-image-label">Ảnh đã xử lý</div>
                    </div>
                </div>
            </div>
            
            <div class="compact-comparison-actions">
                ${onReset && html`
                    <button class="btn btn-sm btn-secondary" onClick=${onReset}>
                        <${UploadIcon} /> Mới
                    </button>
                `}
                
                ${onView && html`
                    <button class="btn btn-sm btn-secondary" onClick=${onView}>
                        <${ViewIcon} /> Xem
                    </button>
                `}
                
                ${onDownload && html`
                    <button class="btn btn-sm btn-primary" onClick=${onDownload}>
                        <${DownloadIcon} /> Tải
                    </button>
                `}
            </div>
        </div>
    `;
};