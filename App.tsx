
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { render, h, FunctionalComponent } from 'preact';
import { useState, useEffect, useMemo } from 'preact/hooks';
import htm from 'htm';
import { Theme } from './types';
import { TABS } from './constants';
import { ThemeToggle, NavToggleIcon, HelpIcon } from './components';
import {
    IdPhotoApp,
    RestorationApp,
    BackgroundApp,
    MockupApp,
    TrendCreatorApp,
    UpscalerApp,
    FaceAlignApp,
    FaceTransformApp,
    WrinkleEditorApp,
    HistoryApp,
    ColorCorrectionApp,
    DocumentRestorationApp,
    FashionDesignApp,
    ClothingChangeApp,
} from './features';
import {
    CleanBackgroundApp,
    ImageFilterApp,
    WeddingPhotoApp,
    FamilyFaceSwapApp,
    BirthdayPhotoApp,
} from './featureEditors';
import { FacialSymmetryEditor } from './features/symmetry/FacialSymmetryEditor';
import { LightingEditor } from './features/lighting/LightingEditor';
import { PresetColorApp } from './features/preset/PresetColorApp';


const html = htm.bind(h);

// Component to display the feature grid
const FeatureDashboard: FunctionalComponent<{ onSelectFeature: (id: string) => void }> = ({ onSelectFeature }) => {
  return html`
    <div class="dashboard-header">
      <h1 class="logo-text">TOOL IMAGES AI PRO</h1>
      <p class="subtitle">Công Cụ Hỗ Trợ Ảnh - Hotline hỗ trợ: 0353 295 337</p>
    </div>
    <div class="feature-dashboard-grid">
      ${TABS.map(tab => html`
        <div class="feature-card" onClick=${() => onSelectFeature(tab.id)} key=${tab.id}>
          <div class="feature-card-icon"><${tab.icon} /></div>
          <h3 class="feature-card-title">${tab.label}</h3>
        </div>
      `)}
    </div>
  `;
};


export const App: FunctionalComponent = () => {
    // Đã chuyển thành true để bỏ qua màn hình kích hoạt
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [activeFeature, setActiveFeature] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        const initialTheme = savedTheme || 'dark';
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const renderContent = () => {
        if (!activeFeature) return null;

        const activeTabData = TABS.find(t => t.id === activeFeature) || TABS[0];
        // Hide the header for features that have their own custom header
        const showHeader = activeFeature !== 'face-align' && activeFeature !== 'wedding-photo' && activeFeature !== 'face-transform' && activeFeature !== 'wrinkle-editor' && activeFeature !== 'history' && activeFeature !== 'restoration';
        const content = (() => {
            switch (activeFeature) {
                case 'id-photo':
                    return html`<${IdPhotoApp} key="id-photo" />`;
                case 'restoration':
                    return html`<${RestorationApp} key="restoration" onBack=${() => setActiveFeature(null)} />`;
                case 'document-restoration':
                    return html`<${DocumentRestorationApp} key="document-restoration" />`;
                case 'fashion-design':
                    return html`<${FashionDesignApp} key="fashion-design" />`;
                case 'clothing-change':
                    return html`<${ClothingChangeApp} key="clothing-change" />`;
                case 'face-transform':
                    return html`<${FaceTransformApp} key="face-transform" />`;
                case 'wrinkle-editor':
                    return html`<${WrinkleEditorApp} key="wrinkle-editor" />`;
                case 'image-filter':
                    return html`<${ImageFilterApp} key="image-filter" />`;
                case 'wedding-photo':
                    return html`<${WeddingPhotoApp} key="wedding-photo" />`;
                case 'birthday-photo':
                    return html`<${BirthdayPhotoApp} key="birthday-photo" />`;
                case 'upscaler':
                    return html`<${UpscalerApp} key="upscaler" />`;
                case 'family-face-swap':
                    return html`<${FamilyFaceSwapApp} key="family-face-swap" />`;
                case 'preset-color':
                    return html`<${PresetColorApp} key="preset-color" />`;
                case 'color-correction':
                    return html`<${ColorCorrectionApp} key="color-correction" />`;
                case 'face-align':
                    return html`<${FaceAlignApp} key="face-align" />`;
                case 'symmetry':
                    return html`<${FacialSymmetryEditor} key="symmetry" />`;
                case 'lighting':
                    return html`<${LightingEditor} key="lighting" />`;
                case 'background':
                    return html`<${BackgroundApp} key="background" />`;
                case 'clean-background':
                    return html`<${CleanBackgroundApp} key="clean-background" />`;
                case 'trend-creator':
                    return html`<${TrendCreatorApp} key="trend-creator" />`;
                case 'mockup':
                    return html`<${MockupApp} key="mockup" />`;
                case 'history':
                    return html`<${HistoryApp} key="history" />`;
                default:
                    return null;
            }
        })();
        
        return html`
            ${showHeader && html`
                <div class="page-header">
                    <h1>${activeTabData.label}</h1>
                    <p class="subtitle">${activeTabData.description}</p>
                </div>
            `}
            <div class="tab-content">
                ${content}
            </div>
        `;
    };

    const activeTabData = useMemo(() => {
        if (!activeFeature) return null;
        return TABS.find(t => t.id === activeFeature);
    }, [activeFeature]);

    const showDefaultHeaderButtons = activeFeature && activeFeature !== 'restoration';

    return html`
        <div class="app-container">
            <main class="main-content">
                ${!activeFeature ? html`
                    <${FeatureDashboard} onSelectFeature=${(id: string) => setActiveFeature(id)} />
                ` : html`
                    ${showDefaultHeaderButtons && html`
                        <button class="back-button" onClick=${() => setActiveFeature(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                            <span>Tất cả tính năng</span>
                        </button>
                    `}
                     ${showDefaultHeaderButtons && html`
                        <a href=${activeTabData?.guideLink || '#'} target="_blank" rel="noopener noreferrer" class="coffee-button" style=${{position: 'absolute', top: '1.5rem', right: '2rem'}}>
                            <${HelpIcon} />
                            <span>${activeTabData?.guideText || 'Hướng dẫn sử dụng'}</span>
                        </a>
                     `}
                    ${renderContent()}
                `}
            </main>
        </div>
    `;
};
