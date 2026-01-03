/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// General types
export type Theme = 'light' | 'dark';

export interface ImageItem {
    id: number;
    file: File;
    original: string;
    generated: string | null;
    status: 'pending' | 'processing' | 'done' | 'error';
}

export interface HistoryItem {
  id: number;
  timestamp: number;
  original: string;
  generated: string;
  feature: string;
  featureLabel: string;
}

// Settings for ID Photo feature
export interface IdPhotoSettings {
    gender: 'nu' | 'nam';
    ageGroup: 'nguoi-lon' | 'thanh-nien' | 'tre-em';
    clothing: string;
    customClothingImage: string | null;
    hairStyle: string;
    background: 'xanh' | 'trang' | 'xam';
    beautifySkin: boolean;
    beautifyLevel: number;
    brightnessLevel: number;
    customPrompt: string;
}

// Settings for Restoration feature
export interface RestorationSettings {
  colorize: boolean;
  highQuality: boolean;
  redrawHair: boolean;
  sharpenBackground: boolean;
  adhereToFace: boolean;
  sharpenWrinkles: boolean;
  isVietnamese: boolean;
  redrawClothing: boolean;
  gender: string;
  age: string;
  smile: string;
  advancedPrompt: string;
  customPrompt: string;
  numResults: number;
}

// Settings for Document Restoration feature
export interface DocumentRestorationSettings {
    removeStains: boolean;
    flattenCreases: boolean;
    enhanceText: boolean;
    restoreColors: boolean;
    outputStyle: 'new' | 'vintage' | 'preserve';
    straighten: boolean;
    customPrompt: string;
}

// Settings for Fashion Design feature
export interface FashionDesignSettings {
    aspectRatio: '9:16' | '16:9';
    prompt: string;
    cameraAngle: string;
    style: string;
    colorPalette: string;
    lighting: string;
    skinTone: string;
    lens: string;
    seed: string;
    numVariants: number;
}

// Settings for Clothing Change feature
export interface ClothingChangeSettings {
    clothingImage: string | null;
    clothingPrompt: string;
    poseOption: 'keep' | 'change';
    lightingEffect: string;
    numImages: number;
    numberOfPeople: 'one' | 'two' | 'multiple';
    sharpenSubject: boolean;
    lightingIntensity: number;
}


// Settings for Symmetry feature
export interface SymmetryAdjustment {
    enabled: boolean;
    intensity: number;
}

export interface SymmetrySettings {
    adjustments: {
        [key: string]: SymmetryAdjustment;
    };
}

// Settings for Lighting feature
export interface LightingSettings {
    selectedStyles: string[];
    customPrompt: string;
}

// Settings for Background feature
export interface BackgroundSettings {
    prompt: string;
    referenceImage: string | null;
    poseOption: 'keep' | 'change';
    lightingEffect: string;
    numImages: number;
    numberOfPeople: 'one' | 'two' | 'multiple';
    sharpenSubject: boolean;
    lightingIntensity: number;
}

// Settings for Mockup feature
export interface MockupSettings {
    productImage: string | null;
    characterImage: string | null;
    characterPrompt: string;
    scenePrompt: string;
}

// Settings for Trend Creator feature
export interface TrendCreatorSettings {
    subjectImage: string | null;
    selectedTrends: string[];
    prompt: string;
    numImages: number;
}

// Settings for Clean Background feature
export interface CleanBackgroundSettings {
    removeObjects: boolean;
    evenColor: boolean;
    denoise: boolean;
    sharpen: boolean;
    customPrompt: string;
}

// Settings for Image Filter feature
export interface ImageFilterSettings {
    allFilters: boolean;
    // Portrait
    smoothSkin: boolean;
    smartPortrait: boolean;
    makeupTransfer: boolean;
    // Creative
    styleTransfer: boolean;
    // Color
    colorize: boolean;
    // Photography
    superResolution: boolean;
    // Restoration
    removeJpegArtifacts: boolean;
    denoise: boolean;
    // Sliders
    happiness: number;
    surprise: number;
    anger: number;
    age: number;
    hairThickness: number;
    // Output
    numResults: number;
}

// Settings for AI Wedding Photo feature
export interface WeddingPhotoSettings {
    brideImage: string | null;
    groomImage: string | null;
    selectedConcepts: string[];
    customPrompt: string;
}

// Settings for AI Birthday Photo feature
export interface BirthdayPhotoSettings {
    selectedConcepts: string[];
    customPrompt: string;
    numImages: number;
}

// Settings for Family Face Swap feature
export interface FamilyFaceSwapSettings {
    groupImage: string | null;
    portraitImages: { image: string | null; description: string }[];
}

// Settings for Preset Color feature
export interface PresetColorSettings {
    selectedPreset: string | null;
    customPrompt: string;
}

// Define HSL color names for type safety
export type HSLColor = 'reds' | 'oranges' | 'yellows' | 'greens' | 'aquas' | 'blues' | 'purples' | 'magentas';

// Define HSL adjustment types
export type HSLAdjustmentType = 'hue' | 'saturation' | 'luminance';

// Settings for Color Correction feature
export interface ColorCorrectionSettings {
    // Light
    exposure: number;
    contrast: number;
    highlights: number;
    shadows: number;
    whites: number;
    blacks: number;

    // HSL Color adjustments
    hue: Record<HSLColor, number>;
    saturation: Record<HSLColor, number>;
    luminance: Record<HSLColor, number>;
}


// Settings for Face Transform feature
export interface FaceTransformSettings {
    style: string[];
    customStyle: string;
    context: string[];
    customContext: string;
    cameraAngle: string[];
    customCameraAngle: string;
    lighting: string[];
    customLighting: string;
    aspectRatio: string;
}

// Settings for Wrinkle Editor feature
export interface WrinkleEditorSettings {
    targetArea: 'face' | 'clothes';
    processMode: 'single' | 'batch';
}


// Props for common components
export interface CommonSettingsPanelProps {
    onGenerate: () => void;
    generating: boolean;
    hasImage: boolean;
    buttonText?: string;
}