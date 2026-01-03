/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { h, FunctionalComponent } from 'preact';
import { useState, useMemo, useRef } from 'preact/hooks';
import htm from 'htm';
import type { TargetedEvent } from 'preact/compat';
import { 
    IdPhotoSettings,
    RestorationSettings,
    SymmetrySettings,
    LightingSettings,
    BackgroundSettings,
    MockupSettings,
    CommonSettingsPanelProps,
    SymmetryAdjustment,
    TrendCreatorSettings,
    CleanBackgroundSettings,
    ImageFilterSettings,
    WeddingPhotoSettings,
    BirthdayPhotoSettings,
} from './types';
// FIX: Import GENDER_OPTIONS, AGE_GROUP_OPTIONS, HAIR_STYLE_OPTIONS, BACKGROUND_COLOR_OPTIONS for the refactored IdPhotoSettingsPanel
import { CLOTHING_OPTIONS, LIGHTING_STYLES, PREDEFINED_TRENDS, GENDER_OPTIONS, AGE_GROUP_OPTIONS, HAIR_STYLE_OPTIONS, BACKGROUND_COLOR_OPTIONS, WEDDING_CONCEPTS, BIRTHDAY_CONCEPTS } from './constants';
import { MicIcon, UploadIcon, CloseIcon } from './components';

const html = htm.bind(h);

interface IdPhotoSettingsPanelProps extends CommonSettingsPanelProps {
    settings: IdPhotoSettings;
    setSettings: (updater: (s: IdPhotoSettings) => IdPhotoSettings) => void;
}

// FIX: Rewrote the IdPhotoSettingsPanel to be consistent with the IdPhotoSettings type.
// This resolves the original '.map' error by correctly processing the CLOTHING_OPTIONS array,
// and fixes numerous other bugs related to incorrect state management and UI controls.
export const IdPhotoSettingsPanel: FunctionalComponent<IdPhotoSettingsPanelProps> = ({ settings, setSettings, onGenerate, generating, hasImage, buttonText }) => {
    
    const handleClothingSelect = (option: typeof CLOTHING_OPTIONS[0]) => {
        setSettings(s => ({ ...s, clothing: option.id === 'giu-nguyen' ? '' : option.prompt }));
    };
    
    const handleHairSelect = (option: typeof HAIR_STYLE_OPTIONS[0]) => {
        setSettings(s => ({ ...s, hairStyle: option.id === 'giu-nguyen' ? '' : option.prompt }));
    };

    const findActiveClothingId = () => {
        if (!settings.clothing) return 'giu-nguyen';
        const found = CLOTHING_OPTIONS.find(opt => opt.prompt === settings.clothing);
        return found ? found.id : '';
    };

    const findActiveHairId = () => {
        if (!settings.hairStyle) return 'giu-nguyen';
        const found = HAIR_STYLE_OPTIONS.find(opt => opt.prompt === settings.hairStyle);
        return found ? found.id : '';
    };

    return html`
        <div class="settings-panel id-photo-settings-panel">
            <div class="form-section">
                <h3 class="form-section-title">Tùy chỉnh ảnh</h3>
                
                <div class="form-group">
                    <label class="form-section-label">Giới tính</label>
                    <div class="toggle-group">
                        ${GENDER_OPTIONS.map(opt => html`
                            <button 
                                class="toggle-btn ${settings.gender === opt.id ? 'active' : ''}"
                                onClick=${() => setSettings(s => ({...s, gender: opt.id as IdPhotoSettings['gender']}))}
                            >
                                ${opt.label}
                            </button>
                        `)}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-section-label">Đối tượng</label>
                    <div class="toggle-group">
                        ${AGE_GROUP_OPTIONS.map(opt => html`
                            <button 
                                class="toggle-btn ${settings.ageGroup === opt.id ? 'active' : ''}"
                                onClick=${() => setSettings(s => ({...s, ageGroup: opt.id as IdPhotoSettings['ageGroup']}))}
                            >
                                ${opt.label}
                            </button>
                        `)}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-section-label">Trang phục</label>
                    <div class="option-grid">
                        ${CLOTHING_OPTIONS.map(opt => html`
                             <button 
                                class="option-btn ${findActiveClothingId() === opt.id ? 'active' : ''}"
                                onClick=${() => handleClothingSelect(opt)}
                                title=${opt.label}
                            >
                                ${opt.label}
                            </button>
                        `)}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-section-label">Kiểu tóc</label>
                    <div class="option-grid">
                        ${HAIR_STYLE_OPTIONS.map(opt => html`
                             <button 
                                class="option-btn ${findActiveHairId() === opt.id ? 'active' : ''}"
                                onClick=${() => handleHairSelect(opt)}
                                title=${opt.label}
                            >
                                ${opt.label}
                            </button>
                        `)}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-section-label">Màu nền</label>
                    <div class="toggle-group">
                        ${BACKGROUND_COLOR_OPTIONS.map(opt => html`
                            <button 
                                class="toggle-btn ${settings.background === opt.id ? 'active' : ''}"
                                onClick=${() => setSettings(s => ({...s, background: opt.id as IdPhotoSettings['background']}))}
                            >
                                ${opt.label}
                            </button>
                        `)}
                    </div>
                </div>

                <div class="slider-group">
                    <div class="switch-group">
                         <label>Làm đẹp da (mịn da, xóa mụn)</label>
                         <label class="switch">
                            <input type="checkbox" checked=${settings.beautifySkin} onChange=${(e: TargetedEvent<HTMLInputElement>) => setSettings(s => ({...s, beautifySkin: e.currentTarget.checked}))} />
                            <span class="slider-switch"></span>
                        </label>
                    </div>

                     <div class="slider-control">
                        <div class="slider-label">
                            <span>Mức độ làm đẹp</span>
                            <span class="value">${settings.beautifyLevel}%</span>
                        </div>
                        <input type="range" min="0" max="100" value=${settings.beautifyLevel} onInput=${(e: TargetedEvent<HTMLInputElement>) => setSettings(s => ({...s, beautifyLevel: parseInt(e.currentTarget.value, 10)}))}/>
                    </div>

                     <div class="slider-control">
                        <div class="slider-label">
                            <span>Mức độ sáng da</span>
                             <span class="value">${settings.brightnessLevel}%</span>
                        </div>
                        <input type="range" min="0" max="100" value=${settings.brightnessLevel} onInput=${(e: TargetedEvent<HTMLInputElement>) => setSettings(s => ({...s, brightnessLevel: parseInt(e.currentTarget.value, 10)}))}/>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-section-label">Mô tả tùy chỉnh (Tùy chọn)</label>
                    <textarea
                        placeholder="Ví dụ: thêm một nốt ruồi nhỏ dưới mắt trái"
                        value=${settings.customPrompt}
                        onInput=${(e: TargetedEvent<HTMLTextAreaElement>) => setSettings(s => ({ ...s, customPrompt: e.currentTarget.value }))}
                    ></textarea>
                </div>
            </div>

            <button class="btn btn-primary" onClick=${onGenerate} disabled=${generating || !hasImage} style=${{width: '100%'}}>
                ${generating ? 'Đang xử lý...' : (buttonText || 'Tạo ảnh')}
            </button>
        </div>
    `;
};

interface RestorationSettingsPanelProps extends CommonSettingsPanelProps {
    settings: RestorationSettings;
    setSettings: (updater: (s: RestorationSettings) => RestorationSettings) => void;
}

export const RestorationSettingsPanel: FunctionalComponent<RestorationSettingsPanelProps> = ({ settings, setSettings, onGenerate, generating, hasImage }) => {
    
    const handleCheckboxChange = (e: TargetedEvent<HTMLInputElement>) => {
        const { name, checked } = e.currentTarget;
        setSettings(s => ({ ...s, [name]: checked }));
    };

    const handlePreset = (preset: string) => {
        const defaults = {
            colorize: false, highQuality: false, redrawHair: false, sharpenBackground: false,
            adhereToFace: false, sharpenWrinkles: false, isVietnamese: false, redrawClothing: false,
        };
        switch(preset) {
            case 'hq':
                setSettings(s => ({ ...s, ...defaults, highQuality: true, adhereToFace: true, isVietnamese: true }));
                break;
            case 'color':
                setSettings(s => ({ ...s, ...defaults, colorize: true, highQuality: true, adhereToFace: true, isVietnamese: true }));
                break;
            case 'heavy_damage':
                setSettings(s => ({ ...s, ...defaults, highQuality: true, redrawHair: true, redrawClothing: true, adhereToFace: true }));
                break;
            case 'deyellow':
                 setSettings(s => ({ ...s, ...defaults, highQuality: true, advancedPrompt: 'Khử ố vàng và phai màu' }));
                 break;
            case 'advanced_portrait':
                 setSettings(s => ({ ...s, ...defaults, highQuality: true, redrawHair: true, adhereToFace: true, sharpenWrinkles: true }));
                 break;
            case 'painting':
                 setSettings(s => ({ ...s, ...defaults, highQuality: true, advancedPrompt: 'Phục hồi bức tranh vẽ' }));
                 break;
            case 'detailed':
                setSettings(s => ({ ...s, ...defaults, highQuality: true, redrawHair: true, redrawClothing: true, sharpenBackground: true, adhereToFace: true }));
                break;
            case 'colorize_bw':
                 setSettings(s => ({ ...s, ...defaults, colorize: true, advancedPrompt: 'Làm màu cho ảnh đen trắng' }));
                 break;
        }
    };
    
    const presets = [
        { id: 'hq', label: 'Phục chế chất lượng cao' },
        { id: 'color', label: 'Phục chế & Tô màu' },
        { id: 'heavy_damage', label: 'Tái tạo ảnh hỏng nặng' },
        { id: 'deyellow', label: 'Khử ố vàng & Phai màu' },
        { id: 'advanced_portrait', label: 'Phục chế chân dung nâng cao' },
        { id: 'painting', label: 'Phục hồi bức tranh vẽ' },
        { id: 'detailed', label: 'Phục hồi và vẽ lại thật chi tiết' },
        { id: 'colorize_bw', label: 'Làm màu cho ảnh đen trắng' },
    ];

    return html`
        <div class="settings-panel">
            <div class="form-group">
                <div class="btn-group" style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary" style="flex:1;">Tự động phân tích</button>
                    <button class="btn btn-secondary" style="flex:1;">Tạo mô tả</button>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-section-title">Tùy chọn phục hồi</label>
                <div class="checkbox-grid-restoration">
                    <label><input type="checkbox" name="colorize" checked=${settings.colorize} onChange=${handleCheckboxChange} /> Tô màu</label>
                    <label><input type="checkbox" name="adhereToFace" checked=${settings.adhereToFace} onChange=${handleCheckboxChange} /> Bám theo chi tiết khuôn mặt</label>
                    <label><input type="checkbox" name="highQuality" checked=${settings.highQuality} onChange=${handleCheckboxChange} /> Chất lượng cao</label>
                    <label><input type="checkbox" name="sharpenWrinkles" checked=${settings.sharpenWrinkles} onChange=${handleCheckboxChange} /> Làm nét nếp nhăn</label>
                    <label><input type="checkbox" name="redrawHair" checked=${settings.redrawHair} onChange=${handleCheckboxChange} /> Vẽ lại tóc chi tiết</label>
                    <label><input type="checkbox" name="isVietnamese" checked=${settings.isVietnamese} onChange=${handleCheckboxChange} /> Người Việt Nam</label>
                    <label><input type="checkbox" name="sharpenBackground" checked=${settings.sharpenBackground} onChange=${handleCheckboxChange} /> Làm rõ nét hậu cảnh</label>
                    <label><input type="checkbox" name="redrawClothing" checked=${settings.redrawClothing} onChange=${handleCheckboxChange} /> Vẽ lại trang phục</label>
                </div>
            </div>

             <div class="form-group-row">
                <div class="form-group">
                    <label for="gender">Giới tính</label>
                    <select id="gender" value=${settings.gender} onChange=${(e: TargetedEvent<HTMLSelectElement>) => setSettings(s => ({...s, gender: e.currentTarget.value}))}>
                        <option value="auto">Tự động</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="age">Độ tuổi</label>
                    <select id="age" value=${settings.age} onChange=${(e: TargetedEvent<HTMLSelectElement>) => setSettings(s => ({...s, age: e.currentTarget.value}))}>
                        <option value="auto">Tự động</option>
                        <option value="child">Trẻ em</option>
                        <option value="young-adult">Thanh niên</option>
                        <option value="adult">Trung niên</option>
                        <option value="senior">Lớn tuổi</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="smile">Nụ cười</label>
                <select id="smile" value=${settings.smile} onChange=${(e: TargetedEvent<HTMLSelectElement>) => setSettings(s => ({...s, smile: e.currentTarget.value}))}>
                    <option value="auto">Tự động</option>
                    <option value="none">Không cười</option>
                    <option value="slight">Cười nhẹ</option>
                </select>
            </div>

             <div class="form-group">
                <label class="form-section-title">Hoặc chọn một mẫu có sẵn</label>
                <div class="preset-grid">
                    ${presets.map(p => html`<button class="preset-btn" onClick=${() => handlePreset(p.id)}>${p.label}</button>`)}
                </div>
            </div>
            
             <div class="form-group">
                <label for="advanced-prompt">Yêu cầu nâng cao (Tùy chọn)</label>
                <textarea 
                    id="advanced-prompt" 
                    value=${settings.advancedPrompt}
                    onInput=${(e: TargetedEvent<HTMLTextAreaElement>) => setSettings(s => ({ ...s, advancedPrompt: e.currentTarget.value }))}
                ></textarea>
            </div>
            
            <div class="form-group">
                <label for="num-results">Số lượng kết quả (tối đa 5)</label>
                <input class="number-input" type="number" id="num-results" min="1" max="5" value=${settings.numResults} onInput=${(e: TargetedEvent<HTMLInputElement>) => setSettings(s => ({...s, numResults: parseInt(e.currentTarget.value, 10) || 1}))} />
            </div>

            <button class="btn btn-primary" onClick=${onGenerate} disabled=${generating || !hasImage} style=${{width: '100%', marginTop: '0.5rem', padding: '0.85rem'}}>
                ${generating ? 'Đang phục hồi...' : 'PHỤC HỒI ẢNH'}
            </button>
        </div>
    `;
};

interface BackgroundSettingsPanelProps extends CommonSettingsPanelProps {
    settings: BackgroundSettings;
    setSettings: (updater: (s: BackgroundSettings) => BackgroundSettings) => void;
    isBatch?: boolean;
}

export const BackgroundSettingsPanel: FunctionalComponent<BackgroundSettingsPanelProps> = ({ settings, setSettings, onGenerate, generating, hasImage, isBatch = false }) => {
    const [isRecording, setIsRecording] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Trình duyệt không hỗ trợ nhập liệu giọng nói.");
            return;
        }
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setSettings(s => ({ ...s, prompt: s.prompt ? `${s.prompt} ${transcript}` : transcript }));
        };
        isRecording ? recognition.stop() : recognition.start();
    };

    const handleReferenceImageUpload = (e: TargetedEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                if (loadEvent.target) {
                    setSettings(s => ({ ...s, referenceImage: loadEvent.target!.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const canGenerate = useMemo(() => {
        return hasImage && (settings.prompt.trim() !== '' || settings.referenceImage !== null);
    }, [hasImage, settings.prompt, settings.referenceImage]);

    const lightingEffects = {
        'none': 'Mặc định',
        'left-light': 'Ngược nắng nhẹ (trái)',
        'left-strong': 'Ngược nắng mạnh (trái)',
        'right-light': 'Ngược nắng nhẹ (phải)',
        'right-strong': 'Ngược nắng mạnh (phải)',
    };
    
    return html`
        <div class="settings-panel">
            <div class="form-group">
                <label for="bg-prompt">Mô tả nền (Text)</label>
                <div class="voice-input-container">
                    <textarea 
                        id="bg-prompt" 
                        placeholder="VD: một bãi biển nhiệt đới với cát trắng và biển xanh..."
                        value=${settings.prompt}
                        onInput=${(e: TargetedEvent<HTMLTextAreaElement>) => setSettings(s => ({ ...s, prompt: e.currentTarget.value }))}
                    ></textarea>
                    <button class="voice-btn ${isRecording ? 'recording' : ''}" onClick=${handleVoiceInput} title="Nhập bằng giọng nói">
                        <${MicIcon} recording=${isRecording} />
                    </button>
                </div>
            </div>

            <div class="form-group">
                <label>Ảnh tham chiếu (Reference)</label>
                <input type="file" ref=${fileInputRef} onChange=${handleReferenceImageUpload} accept="image/*" style=${{ display: 'none' }} />
                <div class="reference-uploader" onClick=${() => fileInputRef.current?.click()}>
                    ${settings.referenceImage ? html`
                        <img src=${settings.referenceImage} alt="Reference" class="reference-preview"/>
                        <button class="remove-reference-btn" onClick=${(e: MouseEvent) => { e.stopPropagation(); setSettings(s => ({ ...s, referenceImage: null })); }} title="Xóa ảnh tham chiếu"><${CloseIcon}/></button>
                    ` : html`
                        <div class="reference-placeholder">
                           <${UploadIcon} />
                           <span>Nhấp để tải lên</span>
                        </div>
                    `}
                </div>
            </div>

            <div class="form-group">
                <label>Tùy chọn tư thế</label>
                <div class="radio-group">
                    <label>
                        <input type="radio" name="pose" value="keep" checked=${settings.poseOption === 'keep'} onChange=${(e: TargetedEvent<HTMLInputElement>) => setSettings(s => ({...s, poseOption: e.currentTarget.value as BackgroundSettings['poseOption']}))} />
                        Giữ nguyên
                    </label>
                    <label>
                        <input type="radio" name="pose" value="change" checked=${settings.poseOption === 'change'} onChange=${(e: TargetedEvent<HTMLInputElement>) => setSettings(s => ({...s, poseOption: e.currentTarget.value as BackgroundSettings['poseOption']}))} />
                        Thay đổi dáng
                    </label>
                </div>
            </div>

            <div class="form-group">
                <label>Hiệu ứng ánh sáng</label>
                <select value=${settings.lightingEffect} onChange=${(e: TargetedEvent<HTMLSelectElement>) => setSettings(s => ({ ...s, lightingEffect: e.currentTarget.value }))}>
                    ${Object.entries(lightingEffects).map(([key, value]) => html`
                        <option value=${key}>${value}</option>
                    `)}
                </select>
            </div>
            
            ${!isBatch && html`
                <div class="form-group">
                    <label>Số lượng ảnh tạo</label>
                    <input type="number" min="1" max="3" class="number-input" value=${settings.numImages} onInput=${(e: TargetedEvent<HTMLInputElement>) => setSettings(s => ({ ...s, numImages: Math.max(1, Math.min(3, parseInt(e.currentTarget.value, 10))) }))} />
                </div>
            `}

            <button class="btn btn-primary" onClick=${onGenerate} disabled=${generating || !canGenerate} style=${{width: '100%'}}>
                ${generating ? 'Đang thay đổi...' : 'Tạo ảnh'}
            </button>
        </div>
    `;
};

interface MockupSettingsPanelProps {
    settings: MockupSettings;
    setSettings: (updater: (s: MockupSettings) => MockupSettings) => void;
    onGenerate: () => void;
    generating: boolean;
}

export const MockupSettingsPanel: FunctionalComponent<MockupSettingsPanelProps> = ({ settings, setSettings, onGenerate, generating }) => {
    const productFileInputRef = useRef<HTMLInputElement>(null);
    const characterFileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (file: File | undefined, field: keyof MockupSettings) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                if (loadEvent.target) {
                    setSettings(s => ({ ...s, [field]: loadEvent.target!.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const canGenerate = useMemo(() => {
        return settings.productImage && (settings.characterImage || settings.characterPrompt.trim() !== '');
    }, [settings.productImage, settings.characterImage, settings.characterPrompt]);

    return html`
        <div class="settings-panel">
            <div class="form-group">
                <label class="uploader-label">Ảnh sản phẩm (Bắt buộc)</label>
                <input type="file" ref=${productFileInputRef} onChange=${(e: TargetedEvent<HTMLInputElement>) => handleImageUpload(e.currentTarget.files?.[0], 'productImage')} accept="image/*" style=${{ display: 'none' }} />
                <div class="reference-uploader" onClick=${() => productFileInputRef.current?.click()}>
                    ${settings.productImage ? html`
                        <img src=${settings.productImage} alt="Product" class="reference-preview"/>
                        <button class="remove-reference-btn" onClick=${(e: MouseEvent) => { e.stopPropagation(); setSettings(s => ({ ...s, productImage: null })); }} title="Xóa ảnh sản phẩm"><${CloseIcon}/></button>
                    ` : html`
                        <div class="reference-placeholder">
                           <${UploadIcon} />
                           <span>Nhấp để tải lên</span>
                        </div>
                    `}
                </div>
            </div>

             <div class="form-group">
                <label class="uploader-label">Ảnh nhân vật (Tùy chọn)</label>
                <input type="file" ref=${characterFileInputRef} onChange=${(e: TargetedEvent<HTMLInputElement>) => handleImageUpload(e.currentTarget.files?.[0], 'characterImage')} accept="image/*" style=${{ display: 'none' }} />
                <div class="reference-uploader" onClick=${() => characterFileInputRef.current?.click()}>
                    ${settings.characterImage ? html`
                        <img src=${settings.characterImage} alt="Character" class="reference-preview"/>
                        <button class="remove-reference-btn" onClick=${(e: MouseEvent) => { e.stopPropagation(); setSettings(s => ({ ...s, characterImage: null })); }} title="Xóa ảnh nhân vật"><${CloseIcon}/></button>
                    ` : html`
                        <div class="reference-placeholder">
                           <${UploadIcon} />
                           <span>Nhấp để tải lên</span>
                        </div>
                    `}
                </div>
            </div>

            <div class="form-group">
                <label for="character-prompt">Mô tả nhân vật (nếu không tải ảnh)</label>
                <textarea 
                    id="character-prompt" 
                    placeholder="VD: một người phụ nữ châu Á, tóc dài, đang mỉm cười..."
                    value=${settings.characterPrompt}
                    onInput=${(e: TargetedEvent<HTMLTextAreaElement>) => setSettings(s => ({ ...s, characterPrompt: e.currentTarget.value }))}
                    disabled=${!!settings.characterImage}
                ></textarea>
            </div>

            <div class="form-group">
                <label for="scene-prompt">Mô tả bối cảnh & Tư thế</label>
                <textarea 
                    id="scene-prompt" 
                    placeholder="VD: đứng trong một quán cafe hiện đại, ánh sáng tự nhiên, cầm sản phẩm bằng hai tay..."
                    value=${settings.scenePrompt}
                    onInput=${(e: TargetedEvent<HTMLTextAreaElement>) => setSettings(s => ({ ...s, scenePrompt: e.currentTarget.value }))}
                ></textarea>
            </div>
            
            <button class="btn btn-primary" onClick=${onGenerate} disabled=${generating || !canGenerate} style=${{width: '100%'}}>
                ${generating ? 'Đang tạo mockup...' : 'Tạo ảnh'}
            </button>
        </div>
    `;
};

interface TrendCreatorSettingsPanelProps extends CommonSettingsPanelProps {
    settings: TrendCreatorSettings;
    setSettings: (updater: (s: TrendCreatorSettings) => TrendCreatorSettings) => void;
}

export const TrendCreatorSettingsPanel: FunctionalComponent<TrendCreatorSettingsPanelProps> = ({ settings, setSettings, onGenerate, generating, hasImage: hasSubjectImage }) => {
    const subjectImageFileInputRef = useRef<HTMLInputElement>(null);
    const [isRecording, setIsRecording] = useState(false);

    const handleSubjectImageUpload = (e: TargetedEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                if (loadEvent.target) {
                    setSettings(s => ({ ...s, subjectImage: loadEvent.target!.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelectPredefinedTrend = (trendKey: string) => {
        const newSelectedTrends = settings.selectedTrends.includes(trendKey)
            ? settings.selectedTrends.filter(k => k !== trendKey)
            : [...settings.selectedTrends, trendKey];

        const combinedPrompt = newSelectedTrends
            .map(key => PREDEFINED_TRENDS[key as keyof typeof PREDEFINED_TRENDS].prompt)
            .join('\n\n---\n\n');

        setSettings(s => ({
            ...s,
            selectedTrends: newSelectedTrends,
            prompt: combinedPrompt,
        }));
    };

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Trình duyệt không hỗ trợ nhập liệu giọng nói.");
            return;
        }
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setSettings(s => ({ ...s, prompt: s.prompt ? `${s.prompt} ${transcript}` : transcript }));
        };
        isRecording ? recognition.stop() : recognition.start();
    };

    const canGenerate = useMemo(() => hasSubjectImage && settings.prompt.trim() !== '', [hasSubjectImage, settings.prompt]);

    return html`
        <div class="settings-panel">
            <div class="form-group">
                <label class="uploader-label">1. Ảnh của bạn (Chủ thể)</label>
                <input type="file" ref=${subjectImageFileInputRef} onChange=${handleSubjectImageUpload} accept="image/*" style=${{ display: 'none' }} />
                <div class="reference-uploader" onClick=${() => subjectImageFileInputRef.current?.click()}>
                    ${settings.subjectImage ? html`
                        <img src=${settings.subjectImage} alt="Subject" class="reference-preview"/>
                        <button class="remove-reference-btn" onClick=${(e: MouseEvent) => { e.stopPropagation(); setSettings(s => ({ ...s, subjectImage: null })); }} title="Xóa ảnh chủ thể"><${CloseIcon}/></button>
                    ` : html`
                        <div class="reference-placeholder">
                           <${UploadIcon} />
                           <span>Nhấp để tải lên</span>
                        </div>
                    `}
                </div>
            </div>

            <div class="form-group">
                <label>2. Chọn Trend có sẵn (có thể chọn nhiều)</label>
                <div class="lighting-styles-grid">
                    ${Object.entries(PREDEFINED_TRENDS).map(([key, trend]) => html`
                        <button key=${key} onClick=${() => handleSelectPredefinedTrend(key)} class="style-button ${settings.selectedTrends.includes(key) ? 'active' : ''}">
                            ${trend.label}
                        </button>
                    `)}
                </div>
            </div>

            <div class="form-group">
                <label for="trend-prompt">3. Prompt (có thể chỉnh sửa)</label>
                <div class="voice-input-container">
                    <textarea id="trend-prompt" value=${settings.prompt} onInput=${(e: TargetedEvent<HTMLTextAreaElement>) => setSettings(s => ({ ...s, prompt: e.currentTarget.value }))} placeholder="Chọn một trend có sẵn hoặc tự viết prompt của bạn." rows="6"></textarea>
                    <button class="voice-btn ${isRecording ? 'recording' : ''}" onClick=${handleVoiceInput} title="Nhập bằng giọng nói"><${MicIcon} recording=${isRecording} /></button>
                </div>
            </div>
            
            <div class="form-group">
                <label>4. Số lượng ảnh (cho mỗi trend)</label>
                <div class="radio-group">${[1, 2, 3, 4].map(num => html`<label><input type="radio" name="numImages" value=${num} checked=${settings.numImages === num} onChange=${() => setSettings(s => ({ ...s, numImages: num }))}/> ${num}</label>`)}</div>
            </div>

            <button class="btn btn-primary" onClick=${onGenerate} disabled=${generating || !canGenerate} style=${{width: '100%'}}>
                ${generating ? 'Đang tạo...' : `Tạo ảnh`}
            </button>
        </div>
    `;
};

interface CleanBackgroundSettingsPanelProps extends CommonSettingsPanelProps {
    settings: CleanBackgroundSettings;
    setSettings: (updater: (s: CleanBackgroundSettings) => CleanBackgroundSettings) => void;
}

export const CleanBackgroundSettingsPanel: FunctionalComponent<CleanBackgroundSettingsPanelProps> = ({ settings, setSettings, onGenerate, generating, hasImage }) => {
    const [isRecording, setIsRecording] = useState(false);

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Trình duyệt không hỗ trợ nhập liệu giọng nói.");
            return;
        }
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setSettings(s => ({ ...s, customPrompt: s.customPrompt ? `${s.customPrompt} ${transcript}` : transcript }));
        };
        isRecording ? recognition.stop() : recognition.start();
    };
    
    const canGenerate = useMemo(() => {
        return hasImage && (settings.removeObjects || settings.evenColor || settings.denoise || settings.sharpen || settings.customPrompt.trim() !== '');
    }, [hasImage, settings.removeObjects, settings.evenColor, settings.denoise, settings.sharpen, settings.customPrompt]);

    return html`
        <div class="settings-panel">
            <div class="form-group">
                <label>Công cụ chỉnh sửa chuyên nghiệp</label>
                <div class="checkbox-group">
                    <label>
                        <input type="checkbox" checked=${settings.removeObjects} onChange=${(e: TargetedEvent<HTMLInputElement>) => setSettings(s => ({...s, removeObjects: e.currentTarget.checked}))}/>
                        Tẩy các chi tiết thừa
                    </label>
                    <label>
                        <input type="checkbox" checked=${settings.evenColor} onChange=${(e: TargetedEvent<HTMLInputElement>) => setSettings(s => ({...s, evenColor: e.currentTarget.checked}))}/>
                        Làm đều màu phông
                    </label>
                     <label>
                        <input type="checkbox" checked=${settings.denoise} onChange=${(e: TargetedEvent<HTMLInputElement>) => setSettings(s => ({...s, denoise: e.currentTarget.checked}))}/>
                        Giảm Noise/Nhiễu hạt
                    </label>
                     <label>
                        <input type="checkbox" checked=${settings.sharpen} onChange=${(e: TargetedEvent<HTMLInputElement>) => setSettings(s => ({...s, sharpen: e.currentTarget.checked}))}/>
                        Tăng độ nét phông
                    </label>
                </div>
            </div>

            <div class="form-group">
                <label for="clean-bg-prompt">Tùy chỉnh thêm</label>
                <div class="voice-input-container">
                    <textarea 
                        id="clean-bg-prompt" 
                        placeholder="VD: làm cho màu xanh của nền đậm hơn một chút..."
                        value=${settings.customPrompt}
                        onInput=${(e: TargetedEvent<HTMLTextAreaElement>) => setSettings(s => ({ ...s, customPrompt: e.currentTarget.value }))}
                    ></textarea>
                    <button class="voice-btn ${isRecording ? 'recording' : ''}" onClick=${handleVoiceInput} title="Nhập bằng giọng nói">
                        <${MicIcon} recording=${isRecording} />
                    </button>
                </div>
            </div>
            
            <button class="btn btn-primary" onClick=${onGenerate} disabled=${generating || !canGenerate} style=${{width: '100%'}}>
                ${generating ? 'Đang xử lý...' : 'Làm sạch nền'}
            </button>
        </div>
    `;
};

interface ImageFilterSettingsPanelProps extends CommonSettingsPanelProps {
    settings: ImageFilterSettings;
    setSettings: (updater: (s: ImageFilterSettings) => ImageFilterSettings) => void;
    onCancel: () => void;
}

export const ImageFilterSettingsPanel: FunctionalComponent<ImageFilterSettingsPanelProps> = ({ settings, setSettings, onGenerate, generating, hasImage, onCancel }) => {

    const handleToggle = (key: keyof ImageFilterSettings) => {
        setSettings(s => ({ ...s, [key]: !s[key] }));
    };

    const handleSlider = (key: keyof ImageFilterSettings, value: string) => {
        setSettings(s => ({...s, [key]: parseInt(value, 10) }));
    };

    const FilterToggle = ({ label, settingKey, beta = false }: { label: string, settingKey: keyof ImageFilterSettings, beta?: boolean }) => html`
        <div class="switch-group">
            <label>${label} ${beta && html`<span class="beta-tag">Beta</span>`}</label>
            <label class="switch">
                <input type="checkbox" checked=${settings[settingKey]} onChange=${() => handleToggle(settingKey)} disabled=${!settings.allFilters} />
                <span class="slider-switch"></span>
            </label>
        </div>
    `;

    const FilterSlider = ({ label, settingKey, min, max }: { label: string, settingKey: keyof ImageFilterSettings, min: number, max: number }) => html`
        <div class="slider-control">
            <div class="slider-label">
                <span>${label}</span>
                <span class="value">${settings[settingKey]}</span>
            </div>
            <input type="range" min=${min} max=${max} value=${settings[settingKey]} onInput=${(e: TargetedEvent<HTMLInputElement>) => handleSlider(settingKey, e.currentTarget.value)} disabled=${!settings.allFilters} />
        </div>
    `;

    return html`
        <div class="settings-panel">
            <h3 class="form-section-title" style=${{marginBottom: '1rem', border: 'none', padding: 0}}>Bộ lọc Hình ảnh</h3>
            
            <${FilterToggle} label="Tất cả bộ lọc" settingKey="allFilters" />

            <div class="form-section" style=${{opacity: settings.allFilters ? 1 : 0.5, transition: 'opacity 0.3s', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <h4 class="form-section-title">CHÂN DUNG</h4>
                <${FilterToggle} label="Làm mịn da" settingKey="smoothSkin" />
                <${FilterToggle} label="Chân dung Thông minh" settingKey="smartPortrait" />
                <${FilterToggle} label="Chuyển đổi Trang điểm" settingKey="makeupTransfer" />

                <h4 class="form-section-title">SÁNG TẠO</h4>
                <${FilterToggle} label="Chuyển đổi Phong cách" settingKey="styleTransfer" beta=${true} />

                <h4 class="form-section-title">MÀU SẮC</h4>
                <${FilterToggle} label="Tô màu" settingKey="colorize" beta=${true} />
                
                <h4 class="form-section-title">NHIẾP ẢNH</h4>
                <${FilterToggle} label="Siêu phóng đại" settingKey="superResolution" />

                <h4 class="form-section-title">PHỤC HỒI</h4>
                <${FilterToggle} label="Loại bỏ Nhiễu JPEG" settingKey="removeJpegArtifacts" />
                <${FilterToggle} label="Khử Noise Hạt" settingKey="denoise" />

                <div class="slider-group" style=${{marginTop: '1.5rem'}}>
                    <${FilterSlider} label="Hạnh phúc" settingKey="happiness" min="-100" max="100" />
                    <${FilterSlider} label="Ngạc nhiên" settingKey="surprise" min="-100" max="100" />
                    <${FilterSlider} label="Tức giận" settingKey="anger" min="-100" max="100" />
                    <${FilterSlider} label="Tuổi tác" settingKey="age" min="-50" max="50" />
                    <${FilterSlider} label="Độ dày tóc" settingKey="hairThickness" min="0" max="100" />
                </div>

                <div class="form-group" style=${{marginTop: '1.5rem'}}>
                    <label for="num-results-filter">Số lượng ảnh đầu ra</label>
                    <select id="num-results-filter" value=${settings.numResults} onChange=${(e: TargetedEvent<HTMLSelectElement>) => setSettings(s => ({...s, numResults: parseInt(e.currentTarget.value, 10)}))} disabled=${!settings.allFilters}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
            </div>

            <div class="form-group-row" style=${{marginTop: 'auto', paddingTop: '1rem'}}>
                <button class="btn btn-secondary" style=${{flex: 1}} onClick=${onCancel}>Hủy</button>
                <button class="btn btn-primary" style=${{flex: 1}} onClick=${onGenerate} disabled=${generating || !hasImage}>OK</button>
            </div>
        </div>
    `;
};

interface WeddingPhotoSettingsPanelProps {
    settings: WeddingPhotoSettings;
    setSettings: (updater: (s: WeddingPhotoSettings) => WeddingPhotoSettings) => void;
    onGenerate: () => void;
    generating: boolean;
}

export const WeddingPhotoSettingsPanel: FunctionalComponent<WeddingPhotoSettingsPanelProps> = ({ settings, setSettings, onGenerate, generating }) => {
    const handleImageUpload = (file: File | undefined, field: keyof WeddingPhotoSettings) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                if (loadEvent.target?.result) {
                    setSettings(s => ({ ...s, [field]: loadEvent.target.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleConceptToggle = (conceptId: string) => {
        setSettings(s => {
            const selected = s.selectedConcepts;
            const newSelected = selected.includes(conceptId)
                ? selected.filter(id => id !== conceptId)
                : [...selected, conceptId];
            return { ...s, selectedConcepts: newSelected };
        });
    };

    const canGenerate = useMemo(() => {
        return !!settings.brideImage && !!settings.groomImage && settings.selectedConcepts.length > 0;
    }, [settings.brideImage, settings.groomImage, settings.selectedConcepts]);

    const CheckboxIcon = () => html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`;

    return html`
        <div class="settings-panel wedding-settings-panel">
            <div class="form-section">
                <h3 class="form-section-title">1. Tải lên ảnh chân dung</h3>
                <p style=${{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem'}}>Tải lên ảnh rõ mặt, đủ sáng của cô dâu và chú rể.</p>
                <div class="portrait-uploaders">
                    <div class="portrait-uploader">
                        <h4>Ảnh Cô Dâu</h4>
                        <div class="portrait-preview-wrapper" onClick=${() => document.getElementById('bride-input')?.click()}>
                            ${settings.brideImage ? html`<img src=${settings.brideImage} />` : html`<${UploadIcon} class="upload-icon" />`}
                        </div>
                        <input type="file" id="bride-input" accept="image/*" style=${{display: 'none'}} onChange=${(e: TargetedEvent<HTMLInputElement>) => handleImageUpload(e.currentTarget.files?.[0], 'brideImage')} />
                        <button class="btn portrait-upload-btn" onClick=${() => document.getElementById('bride-input')?.click()}>↑ Chọn tệp</button>
                    </div>
                     <div class="portrait-uploader">
                        <h4>Ảnh Chú Rể</h4>
                        <div class="portrait-preview-wrapper" onClick=${() => document.getElementById('groom-input')?.click()}>
                             ${settings.groomImage ? html`<img src=${settings.groomImage} />` : html`<${UploadIcon} class="upload-icon" />`}
                        </div>
                         <input type="file" id="groom-input" accept="image/*" style=${{display: 'none'}} onChange=${(e: TargetedEvent<HTMLInputElement>) => handleImageUpload(e.currentTarget.files?.[0], 'groomImage')} />
                        <button class="btn portrait-upload-btn" onClick=${() => document.getElementById('groom-input')?.click()}>↑ Chọn tệp</button>
                    </div>
                </div>
                 <div class="wedding-note" style=${{marginTop: '1rem'}}>
                    <strong>Lưu ý:</strong> AI sẽ nỗ lực tối đa để giữ nguyên vẹn khuôn mặt gốc từ ảnh bạn tải lên, chỉ thay đổi trang phục và bối cảnh.
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">2. Chọn concept ảnh cưới</h3>
                <p style=${{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Bạn có thể chọn một hoặc nhiều concept để tạo ảnh cùng lúc.</p>
                <p style=${{color: 'var(--wedding-gold)', fontSize: '0.9rem', marginBottom: '1rem'}}>★ AI gợi ý một vài concept phù hợp với bạn!</p>
                <div class="concept-grid">
                    ${WEDDING_CONCEPTS.map(concept => html`
                        <button 
                            class="concept-btn ${settings.selectedConcepts.includes(concept.id) ? 'active' : ''}"
                            onClick=${() => handleConceptToggle(concept.id)}
                        >
                            <span class="concept-checkbox"><${CheckboxIcon} /></span>
                            <span class="concept-label">${concept.label} ${concept.recommended && html`<span class="star">★</span>`}</span>
                        </button>
                    `)}
                </div>
            </div>
            <div class="form-section">
                <h3 class="form-section-title">3. Mô tả tùy chỉnh (Tùy chọn)</h3>
                <p style=${{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem'}}>Thêm các chi tiết bạn muốn, ví dụ: "cô dâu mặc váy cưới màu hồng" hoặc "chú rể không đeo kính".</p>
                <textarea
                    placeholder="Nhập mô tả của bạn ở đây..."
                    value=${settings.customPrompt}
                    onInput=${(e: TargetedEvent<HTMLTextAreaElement>) => setSettings(s => ({ ...s, customPrompt: e.currentTarget.value }))}
                    rows="3"
                ></textarea>
            </div>
            <button class="btn wedding-generate-btn" onClick=${onGenerate} disabled=${generating || !canGenerate}>
                ${generating ? 'Đang tạo ảnh...' : `Tạo ảnh (${settings.selectedConcepts.length} concept) →`}
            </button>
        </div>
    `;
};

interface BirthdayPhotoSettingsPanelProps extends CommonSettingsPanelProps {
    settings: BirthdayPhotoSettings;
    setSettings: (updater: (s: BirthdayPhotoSettings) => BirthdayPhotoSettings) => void;
}

export const BirthdayPhotoSettingsPanel: FunctionalComponent<BirthdayPhotoSettingsPanelProps> = ({ settings, setSettings, onGenerate, generating, hasImage }) => {
    const handleConceptToggle = (conceptId: string) => {
        setSettings(s => {
            const newSelected = s.selectedConcepts.includes(conceptId)
                ? s.selectedConcepts.filter(id => id !== conceptId)
                : [...s.selectedConcepts, conceptId];
            return { ...s, selectedConcepts: newSelected };
        });
    };

    const canGenerate = useMemo(() => hasImage && (settings.selectedConcepts.length > 0 || settings.customPrompt.trim() !== ''), [hasImage, settings.selectedConcepts, settings.customPrompt]);

    return html`
        <div class="form-section">
            <h3 class="form-section-title">2. Chọn một hoặc nhiều concept</h3>
            <div class="birthday-concept-grid">
                ${BIRTHDAY_CONCEPTS.map(concept => html`
                    <button
                        key=${concept.id}
                        class="birthday-concept-btn ${settings.selectedConcepts.includes(concept.id) ? 'active' : ''}"
                        onClick=${() => handleConceptToggle(concept.id)}
                    >
                        ${concept.label}
                    </button>
                `)}
            </div>
        </div>

        <div class="form-group">
            <label for="custom-prompt-birthday">Nhập Concept Mong Muốn</label>
            <textarea
                id="custom-prompt-birthday"
                placeholder="Ví dụ: tạo ảnh phong cách vintage thập niên 90..."
                value=${settings.customPrompt}
                onInput=${(e: TargetedEvent<HTMLTextAreaElement>) => setSettings(s => ({ ...s, customPrompt: e.currentTarget.value }))}
            ></textarea>
        </div>

        <div class="slider-control">
            <div class="slider-label">
                <span>Số lượng ảnh muốn tạo:</span>
                <span class="value">${settings.numImages}</span>
            </div>
            <input
                type="range"
                min="1"
                max="4"
                value=${settings.numImages}
                onInput=${(e: TargetedEvent<HTMLInputElement>) => setSettings(s => ({ ...s, numImages: parseInt(e.currentTarget.value, 10) }))}
            />
        </div>
        
        <button
            class="btn btn-primary"
            onClick=${onGenerate}
            disabled=${generating || !canGenerate}
            style=${{ width: '100%', marginTop: '1.5rem', padding: '0.85rem' }}
        >
            ${generating ? 'Đang tạo...' : 'Tạo ảnh sinh nhật'}
        </button>
    `;
};