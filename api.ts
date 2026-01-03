/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Part, Modality, Type } from "@google/genai";
// FIX: Added all necessary settings types to support the new API functions.
import { IdPhotoSettings, RestorationSettings, SymmetrySettings, BackgroundSettings, MockupSettings, CleanBackgroundSettings, ImageFilterSettings, WrinkleEditorSettings, ColorCorrectionSettings, DocumentRestorationSettings, FashionDesignSettings, BirthdayPhotoSettings, FamilyFaceSwapSettings, HSLColor, ClothingChangeSettings } from "./types";

const getMimeType = (dataUrl: string): string => {
    const parts = dataUrl.split(',')[0].split(':')[1].split(';');
    return parts[0];
};

const getApiKey = (): string => {
    // 1. Prioritize user's custom key from localStorage
    const customApiKey = localStorage.getItem('gemini_api_key');
    if (customApiKey && customApiKey.trim() !== '') {
        return customApiKey;
    }

    // 2. Fallback to the default system key from environment variables
    const defaultApiKey = process.env.API_KEY;
    if (defaultApiKey && defaultApiKey.trim() !== '') {
        return defaultApiKey;
    }

    // 3. If neither is available, throw an error
    throw new Error("Không có API Key hợp lệ. Vui lòng vào tab Cài đặt để thêm hoặc kiểm tra lại khóa API Google Gemini của bạn.");
}

// Wrapper function to call Gemini API with retry logic using the SDK
// FIX: Modified callGeminiAPI to accept an optional customConfig object to support features like setting a seed.
export const callGeminiAPI = async (prompt: string, imageData?: string, additionalImages?: string[], customConfig?: Record<string, any>): Promise<string> => {
    const apiKey = getApiKey();
    // Retry logic with exponential backoff
    const maxRetries = 3;
    let lastError: Error | null = null;
    
    const parts: Part[] = [];

    // Add main image first, if available
    if (imageData) {
        parts.push({
            inlineData: {
                data: imageData.split(',')[1],
                mimeType: getMimeType(imageData),
            }
        });
    }
    
    // Add the text prompt
    parts.push({ text: prompt });

    // Add any additional images
    if (additionalImages && additionalImages.length > 0) {
        additionalImages.forEach(img => {
            parts.push({
                inlineData: {
                    data: img.split(',')[1],
                    mimeType: getMimeType(img),
                }
            });
        });
    }

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            console.log(`[callGeminiAPI] Attempt ${attempt + 1}/${maxRetries}`);
            const ai = new GoogleGenAI({ apiKey });

            const config = {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
                ...customConfig,
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts },
                config,
            });

            if (response.candidates && response.candidates.length > 0) {
                const candidate = response.candidates[0];
                if (candidate.content && Array.isArray(candidate.content.parts)) {
                    const imagePart = candidate.content.parts.find((p: Part) => p.inlineData);
                    if (imagePart && imagePart.inlineData) {
                        return `data:image/png;base64,${imagePart.inlineData.data}`;
                    }
                }
            }
            throw new Error('No image was generated via SDK');

        } catch (error) {
            lastError = error as Error;
            if (attempt < maxRetries - 1) {
                const waitTime = Math.pow(2, attempt) * 1000 + (Math.random() * 1000);
                const errorMsg = (error as Error).message || '';
                if (errorMsg.includes('429') || /rate limit/i.test(errorMsg) || /resource exhausted/i.test(errorMsg)) {
                    console.log(`Rate limit hit. Retrying in ${Math.ceil(waitTime/1000)}s... (${attempt + 1}/${maxRetries})`);
                } else {
                    console.log(`API call failed. Retrying in ${Math.ceil(waitTime/1000)}s... (${attempt + 1}/${maxRetries})`);
                }
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }

    throw lastError || new Error('All retry attempts failed');
};

export const testApiKey = async (apiKey: string): Promise<{ success: boolean; message: string; type: 'success' | 'warning' | 'error' }> => {
    if (!apiKey.trim()) {
        return { success: false, message: 'API key không được để trống.', type: 'error' };
    }
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Hi',
        });
        
        if (response.text) {
             return { success: true, message: 'Key hợp lệ và hoạt động!', type: 'success' };
        } else {
            throw new Error("Phản hồi API không hợp lệ.");
        }
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error("API Key Test Error:", errorMessage);

        if (errorMessage.includes("API key not valid")) {
            return { success: false, message: 'API key không hợp lệ. Vui lòng kiểm tra lại.', type: 'error' };
        } else if (errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
            return { success: true, message: 'Key hợp lệ, nhưng đã đạt đến giới hạn sử dụng.', type: 'warning' };
        } else {
            return { success: false, message: `Đã xảy ra lỗi: ${errorMessage}`, type: 'error' };
        }
    }
};

export async function analyzeImageForRestoration(imageData: string): Promise<Partial<RestorationSettings>> {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    
    const imagePart = {
        inlineData: {
            data: imageData.split(',')[1],
            mimeType: getMimeType(imageData),
        }
    };

    const prompt = `Analyze this old photo. Determine if it needs colorization (is black and white or sepia), high-quality enhancement (is blurry or low resolution), hair redraw (hair is unclear), clothing redraw (clothing is damaged), and background sharpening (background is blurry). Your output MUST be a valid JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        colorize: { type: Type.BOOLEAN, description: "True if the image is black and white or sepia and needs colorization." },
                        highQuality: { type: Type.BOOLEAN, description: "True if the image is blurry, has low resolution, or has significant noise." },
                        redrawHair: { type: Type.BOOLEAN, description: "True if the hair is poorly defined, damaged, or needs to be redrawn." },
                        redrawClothing: { type: Type.BOOLEAN, description: "True if clothing is damaged or indistinct." },
                        sharpenBackground: { type: Type.BOOLEAN, description: "True if the background is blurry and should be sharpened." },
                    }
                }
            }
        });
        
        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);

        const settings: Partial<RestorationSettings> = {};
        if (typeof parsed.colorize === 'boolean') settings.colorize = parsed.colorize;
        if (typeof parsed.highQuality === 'boolean') settings.highQuality = parsed.highQuality;
        if (typeof parsed.redrawHair === 'boolean') settings.redrawHair = parsed.redrawHair;
        if (typeof parsed.redrawClothing === 'boolean') settings.redrawClothing = parsed.redrawClothing;
        if (typeof parsed.sharpenBackground === 'boolean') settings.sharpenBackground = parsed.sharpenBackground;

        return settings;

    } catch (error) {
        console.error("Error in analyzeImageForRestoration:", error);
        throw new Error("Không thể phân tích ảnh. Vui lòng thử lại.");
    }
}

export async function describeImageForRestoration(imageData: string): Promise<string> {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    
    const imagePart = {
        inlineData: {
            data: imageData.split(',')[1],
            mimeType: getMimeType(imageData),
        }
    };

    const prompt = `Briefly describe this old photograph in Vietnamese, focusing on details relevant for photo restoration. For example, describe the subject, their clothing, the background, and any visible damage like scratches, spots, or fading. Keep the description concise, suitable for an advanced prompt field.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] }
        });

        return response.text;
    } catch (error) {
        console.error("Error in describeImageForRestoration:", error);
        throw new Error("Không thể tạo mô tả. Vui lòng thử lại.");
    }
}

// --- Feature-specific API Functions ---

export function generateIdPhoto(originalImage: string, settings: IdPhotoSettings): Promise<string> {
    const promptParts = [
        'Generate an ultra-high-resolution, professional ID photo with a 3:4 aspect ratio and crystal-clear quality. The subject must be centered, facing forward, with even, studio-quality lighting and photorealistic skin texture. The image must have sharp details and be free of any blur or digital artifacts.',
        'Critically, maintain the original framing of the subject from the source image. If the source image is a headshot, the result must also be a headshot. If it shows half the body, the result must also show half the body. Do not invent or add body parts that are not visible in the original photo.',
        'Crucially, preserve the subject\'s original facial features, structure, and identity. Do not alter their ethnicity, age, or key characteristics.'
    ];

    // Gender & Age
    const genderText = settings.gender === 'nu' ? 'female' : 'male';
    const ageText = {
        'nguoi-lon': 'an adult',
        'thanh-nien': 'a young adult',
        'tre-em': 'a child',
    }[settings.ageGroup];
    promptParts.push(`The subject is ${ageText} ${genderText}.`);

    // Background
    const bgColor = {
        'xanh': 'solid light blue (#E0E8F0)',
        'trang': 'solid pure white (#FFFFFF)',
        'xam': 'solid light gray (#D3D3D3)',
        'xanh-dam': 'solid bright royal blue (#0055FF)',
    }[settings.background];
    promptParts.push(`The background must be a ${bgColor}.`);

    // Hairstyle
    if (settings.hairStyle) {
        promptParts.push(`Hairstyle: ${settings.hairStyle}.`);
    }

    // Skin Beautification
    if (settings.beautifySkin) {
        promptParts.push(`Apply natural skin beautification: remove blemishes and smooth skin at an intensity of ${settings.beautifyLevel}%. The result must look realistic, not artificial.`);
    }
    
    const brightnessDiff = settings.brightnessLevel - 50;
    if (brightnessDiff > 5) { // Add a small dead zone
        promptParts.push(`Subtly increase skin brightness by ${brightnessDiff}%.`);
    } else if (brightnessDiff < -5) {
        promptParts.push(`Subtly decrease skin brightness by ${-brightnessDiff}%.`);
    }

    // Custom Prompt
    if (settings.customPrompt.trim()) {
        promptParts.push(`Additional user request: "${settings.customPrompt.trim()}".`);
    }

    let additionalImages: string[] | undefined = undefined;

    if (settings.customClothingImage) {
        // If a custom clothing image is provided
        promptParts.push('You MUST dress the subject in the clothing provided in the second image. The second image is SOLELY a reference for the clothing. Perfectly adapt the clothing to the subject\'s body and pose, ensuring a natural and photorealistic fit. Do not use the clothing from the original photo.');
        additionalImages = [settings.customClothingImage];
    } else if (settings.clothing) {
        // If a predefined clothing prompt is provided
        promptParts.push(`Clothing: ${settings.clothing}.`);
    } else {
        // If "Giữ nguyên" (Keep original) is selected
        promptParts.push('Keep the original clothing from the photo.');
    }


    const finalPrompt = promptParts.join(' ');

    return callGeminiAPI(finalPrompt, originalImage, additionalImages);
}


export function restoreImage(originalImage: string, settings: RestorationSettings): Promise<string> {
    const basePrompt = settings.customPrompt && settings.customPrompt.trim() !== ''
        ? settings.customPrompt
        : 'You are an expert AI photo restoration artist. Restore the provided old photo to an absolutely photorealistic standard, preserving the original aspect ratio and the subject\'s core identity and facial structure. Reconstruct fine details like skin pores and hair strands with maximum precision.';
    
    const promptParts = [basePrompt];

    if (settings.colorize) promptParts.push('Colorize the photo with extremely realistic and natural colors.');
    if (settings.highQuality) promptParts.push('Enhance the resolution to modern standards, remove all digital noise, and improve clarity to a professional, high-quality level.');
    if (settings.redrawHair) promptParts.push('Meticulously redraw the hair, ensuring every strand is clear, detailed, and naturally styled.');
    if (settings.sharpenBackground) promptParts.push('Enhance and sharpen the background details to match the quality of the foreground subject.');
    if (settings.adhereToFace) promptParts.push('Pay critical attention to preserving the exact facial details, structure, and unique characteristics of the person.');
    if (settings.sharpenWrinkles) promptParts.push('Subtly enhance the natural lines and wrinkles on the face to add character and realism, without making the person look older.');
    if (settings.isVietnamese) promptParts.push('The subject is Vietnamese; ensure the restored features are culturally and ethnically appropriate.');
    if (settings.redrawClothing) promptParts.push('Redraw the clothing with realistic fabric textures and details, ensuring it is period-appropriate if applicable.');
    
    if (settings.gender !== 'auto') promptParts.push(`The subject is identified as ${settings.gender}.`);
    if (settings.age !== 'auto') promptParts.push(`The subject's approximate age is ${settings.age}.`);
    if (settings.smile !== 'auto') {
        if (settings.smile === 'none') promptParts.push('Ensure the subject has a neutral expression.');
        else if (settings.smile === 'slight') promptParts.push('Introduce a subtle, slight, closed-mouth smile.');
    }

    if (settings.advancedPrompt) promptParts.push(`Follow this specific user instruction: "${settings.advancedPrompt}".`);
    
    const finalPrompt = promptParts.join(' ');

    return callGeminiAPI(finalPrompt, originalImage);
}

export function restoreDocument(originalImage: string, settings: DocumentRestorationSettings): Promise<string> {
    const promptParts = [
        'You are an expert AI document restoration specialist. Your task is to restore the provided image of an old document to a clean, legible, and high-quality state. Preserve the original aspect ratio.',
        'Crucially, you must NOT invent or hallucinate any text or details that are not visibly present or reasonably inferred from the damaged original. The goal is restoration, not fabrication.'
    ];

    if (settings.straighten) {
        promptParts.push('Straighten and de-skew the document so that its edges are perfectly rectangular, as if it were scanned flat.');
    }
    if (settings.removeStains) {
        promptParts.push('Remove all stains, water damage, mold, foxing (yellow/brown spots), and other discoloration from the paper background. The background should be clean and uniform in color.');
    }
    if (settings.flattenCreases) {
        promptParts.push('Digitally flatten all creases, folds, and tears. The paper should appear smooth.');
    }
    if (settings.enhanceText) {
        promptParts.push('Enhance the contrast and sharpness of all text, handwriting, and official stamps to make them crisp and highly legible. Reconstruct faded or blurred characters carefully.');
    }
    if (settings.restoreColors) {
        promptParts.push('Restore any faded colors in stamps, letterheads, or colored text to their original vibrancy.');
    }

    if (settings.outputStyle === 'new') {
        promptParts.push('The final output should look like a brand new, pristine version of the original document.');
    } else if (settings.outputStyle === 'vintage') {
        promptParts.push('The final output should retain a vintage feel, with clean paper but preserving the character of aged ink and classic typography. Do not make it brand new and sterile.');
    } else if (settings.outputStyle === 'preserve') {
        promptParts.push("Your primary goal is maximum preservation. Perform the selected restoration tasks with the absolute minimum necessary changes to maintain the original document's character, texture, paper grain, and inherent details. The result should feel authentic and carefully preserved, not heavily altered or modernized.");
    }

    if (settings.customPrompt.trim()) {
        promptParts.push(`Follow this specific user instruction: "${settings.customPrompt.trim()}".`);
    }
    
    promptParts.push('The output must be only the final, high-resolution restored document image.');

    const finalPrompt = promptParts.join(' ');
    return callGeminiAPI(finalPrompt, originalImage);
}

export async function describeDocumentForRestoration(imageData: string): Promise<string> {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    
    const imagePart = {
        inlineData: {
            data: imageData.split(',')[1],
            mimeType: getMimeType(imageData),
        }
    };

    const prompt = `Briefly describe this old document in Vietnamese. Focus on its condition and content type, suitable for a restoration prompt. Mention any visible damage like stains, tears, creases, faded text, or mold. For example: "Đây là một chứng chỉ cũ bị ố vàng nặng, có nhiều nếp gấp và chữ viết tay bị mờ." Keep the description concise.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] }
        });

        return response.text;
    } catch (error) {
        console.error("Error in describeDocumentForRestoration:", error);
        throw new Error("Không thể tạo mô tả cho tài liệu. Vui lòng thử lại.");
    }
}

// FIX: Added missing generateFashionDesign function.
// FIX: Completed implementation of generateFashionDesign and added a return statement.
export function generateFashionDesign(modelImage: string, outfitImage: string, settings: FashionDesignSettings): Promise<string> {
    const promptParts = [
        "You are a professional AI fashion designer and virtual try-on specialist.",
        "Your task is to take the person from the first image (the model) and realistically dress them in the clothing from the second image (the outfit).",
        "CRITICAL: The model's face, identity, body shape, and pose from the first image must be perfectly preserved. The outfit from the second image must be adapted to fit the model's body and pose naturally.",
        "The final image should be a photorealistic, high-fashion photograph.",
        `The final image must have a ${settings.aspectRatio} aspect ratio.`
    ];

    if (settings.prompt) {
        promptParts.push(`Main concept: "${settings.prompt}"`);
    }
    if (settings.cameraAngle && settings.cameraAngle !== 'Mặc định') {
        promptParts.push(`Camera Angle: ${settings.cameraAngle}.`);
    }
    if (settings.style && settings.style !== 'Mặc định') {
        promptParts.push(`Artistic Style: ${settings.style}.`);
    }
    if (settings.colorPalette && settings.colorPalette !== 'Mặc định') {
        promptParts.push(`Color Palette: ${settings.colorPalette}.`);
    }
    if (settings.lighting && settings.lighting !== 'Mặc định') {
        promptParts.push(`Lighting: ${settings.lighting}.`);
    }
    if (settings.skinTone && settings.skinTone !== 'Mặc định') {
        promptParts.push(`Ensure the model's skin tone is ${settings.skinTone}.`);
    }
    if (settings.lens && settings.lens !== 'Mặc định') {
        promptParts.push(`Shot with a ${settings.lens} lens effect.`);
    }

    const finalPrompt = promptParts.join(' ');
    const customConfig: Record<string, any> = {};
    const seed = parseInt(settings.seed, 10);
    if (!isNaN(seed)) {
        customConfig.seed = seed;
    }

    return callGeminiAPI(finalPrompt, modelImage, [outfitImage], customConfig);
}

export function changeClothing(originalImage: string, settings: ClothingChangeSettings): Promise<string> {
    const promptParts = [
        "// INSTRUCTION: You are a hyper-realistic virtual try-on AI. Your sole task is to change the clothing on the person in the primary input image.",
        "// PRESERVATION RULES (MANDATORY):",
        "// 1. IDENTITY & FACE: The subject's face, facial expression, hair, and all identifying features MUST remain UNCHANGED. This is the most critical rule.",
        "// 3. BACKGROUND: The background and all environmental elements MUST remain identical to the original image. DO NOT alter, add, or remove anything from the background.",
        "// 4. LIGHTING & SHADOWS: The new clothing must realistically integrate with the original scene's lighting. This includes matching the light direction, color temperature, and casting accurate shadows on the body and receiving shadows from the environment.",
    ];

    if (settings.poseOption === 'keep') {
        promptParts.push("// 2. BODY & POSE: The subject's body shape, proportions, and pose MUST be perfectly preserved.");
    } else {
        promptParts.push("// 2. BODY & POSE: The subject's body shape and proportions MUST be perfectly preserved. You have creative freedom to slightly and naturally change the subject's pose to better suit the new clothing, but the change must be subtle and realistic.");
    }
    
    promptParts.push(`// --- Subject Details ---`);
    promptParts.push(`The image contains ${settings.numberOfPeople === 'one' ? 'one person' : settings.numberOfPeople === 'two' ? 'two people' : 'multiple people'}. Apply the clothing change to the main subject(s).`);

    if (settings.sharpenSubject) {
        promptParts.push('Apply a professional sharpening pass to the main subject(s) to make them stand out, but keep the background as is.');
    }

    if (settings.lightingEffect !== 'none') {
        const direction = settings.lightingEffect.includes('left') ? 'from the left' : 'from the right';
        const strength = settings.lightingEffect.includes('strong') ? 'strong' : 'soft';
        promptParts.push(`Lighting Integration: Integrate the new clothing with a realistic ${strength} key light source coming ${direction}.`);
    }

    promptParts.push(`Ambient Lighting: Blend the environmental light from the original background onto the new clothing with an intensity of ${settings.lightingIntensity}%. This includes realistic color casting and light wrapping.`);


    let additionalImages: string[] | undefined = undefined;

    if (!settings.clothingImage && !settings.clothingPrompt.trim()) {
        return Promise.reject(new Error("Vui lòng cung cấp ảnh trang phục hoặc mô tả bằng văn bản."));
    }
    
    promptParts.push("// CLOTHING TASK:");

    if (settings.clothingImage) {
        promptParts.push(
            "// - PRIMARY GOAL: Use the provided second image (the clothing reference) as the main source for the new outfit.",
            "// - FITTING INSTRUCTIONS: Meticulously adapt the clothing from the reference image onto the model's body. The fit must be natural, respecting the model's pose and body contours. Re-render the fabric's texture, folds, and drapes to look completely realistic in the new context."
        );
        additionalImages = [settings.clothingImage];
    }
    
    if (settings.clothingPrompt.trim()) {
        if (settings.clothingImage) {
            promptParts.push(
                `// - ADDITIONAL DETAILS: While using the reference image, also incorporate these details from the text description: "${settings.clothingPrompt.trim()}". Use the description to modify or clarify aspects of the clothing reference (e.g., change color, add a detail).`
            );
        } else {
            promptParts.push(
                "// - GOAL: Dress the person based on the following text description.",
                `// - DESCRIPTION: "${settings.clothingPrompt.trim()}".`,
                "// - FITTING INSTRUCTIONS: Generate the described clothing realistically onto the model's body. The fabric, texture, folds, and fit must appear natural and photorealistic, conforming to the model's pose."
            );
        }
    }

    promptParts.push(
        "// FINAL OUTPUT: The output MUST be a single, photorealistic image showing the person with the new clothing, following all preservation rules."
    );

    const finalPrompt = promptParts.join('\n');
    return callGeminiAPI(finalPrompt, originalImage, additionalImages);
}


// FIX: Added missing upscaleImage function.
export const upscaleImage = (imageData: string, target: '4k' | '8k'): Promise<string> => {
    const prompt = `
    Your task is to upscale the provided image to a photorealistic ${target} resolution, emulating the quality of a state-of-the-art AI upscaler like Real-ESRGAN. This is a technical restoration and enhancement task, not a creative one.

    CRITICAL INSTRUCTIONS:
    1.  **DO NOT CHANGE CONTENT OR IDENTITY:** The subject, composition, colors, lighting, and especially the facial features and identity of any person in the image must be perfectly preserved. Do not alter the original content in any way.
    2.  **RESTORE & ENHANCE DETAILS:** Your primary goal is to enhance sharpness and restore fine, realistic details. Focus on textures like skin pores, hair strands, fabric weaves, and environmental details.
    3.  **REMOVE ARTIFACTS:** Clean up any compression artifacts, digital noise, and blur from the original image.
    4.  **NATURAL & PHOTOREALISTIC OUTPUT:** The final image must be crystal-clear and sharp, but it must look natural and photorealistic. Avoid creating an artificial, over-sharpened, or 'plastic' look. The result should feel like a higher-resolution photograph, not a digital painting.
    5.  **ADVANCED SHARPENING:** Increase the image's sharpness using edge-aware sharpening techniques to make details pop without creating halos or artifacts.

    The output must be the final upscaled image only.`;
    return callGeminiAPI(prompt, imageData);
};

// FIX: Added missing correctFacialSymmetry function.
export const correctFacialSymmetry = (originalImage: string, settings: SymmetrySettings): Promise<string> => {
    const promptParts = ['Subtly correct facial asymmetry in this portrait. Preserve the person\'s identity. The result must be extremely realistic and natural-looking. Apply the following adjustments:'];
    const enabledAdjustments = Object.entries(settings.adjustments)
        .filter(([, adj]) => adj.enabled)
        .map(([key, adj]) => {
            const label = key.replace(/([A-Z])/g, ' $1').toLowerCase(); // a better description
            return `${label} at ${adj.intensity}% intensity`;
        });
    
    if (enabledAdjustments.length === 0) {
        return Promise.resolve(originalImage); // No changes needed
    }
    promptParts.push(...enabledAdjustments);
    return callGeminiAPI(promptParts.join(', '), originalImage);
};

// FIX: Added missing changeImageLighting function.
export const changeImageLighting = (originalImage: string, prompt: string): Promise<string> => {
    return callGeminiAPI(prompt, originalImage);
};

// FIX: Added missing changeBackground function.
export const changeBackground = (originalImage: string, settings: BackgroundSettings): Promise<string> => {
    const promptParts = [
        `You are a world-class AI photo editor. Your task is to replace the background of the provided image. Adhere strictly to these parameters:`,

        `// --- Camera & Quality ---
        camera_emulation {
            brand_model: Phase One XF IQ4 150MP,
            lens: Schneider Kreuznach 80mm LS f2.8,
            medium_format: true,
            look: ultimate sharpness, maximum dynamic range, medium format 3D pop, cinematic rendering
        }`,
        
        `// --- Subject Integrity ---
        subject_constraints {
            keep_identity: true,
            lock_features: [eyes,nose,lips,eyebrows,jawline,face_shape,ears,hairline],
            expression_policy: preserve_original
        }`,

        `// --- Composition ---
        composition {
            framing: three-quarter body (from mid-thigh up),
            orientation: portrait,
            crop_policy: do_not_crop_face_or_hands,
            keep_pose: ${settings.poseOption === 'keep'},
            zoom: slight zoom-out for wider context
        }`,

        `// --- Scene Details ---
        The image contains ${settings.numberOfPeople === 'one' ? 'one person' : settings.numberOfPeople === 'two' ? 'two people' : 'multiple people'}. Ensure all subjects are perfectly preserved and extracted.`
    ];

    if (settings.prompt.trim()) {
        promptParts.push(`New Background Description: "${settings.prompt.trim()}".`);
    } else if (settings.referenceImage) {
        promptParts.push('Use the provided reference image to create a new background that matches its style, lighting, and environment.');
    }

    if (settings.sharpenSubject) {
        // This is a bit redundant given the camera_emulation, but serves as an extra reinforcement.
        promptParts.push('Apply an additional professional sharpening pass to the main subject(s) to make them stand out.');
    }
    
    promptParts.push(`// --- Advanced Sharpening ---
Increase the overall image sharpness using edge-aware sharpening techniques to make all details pop without creating halos or artifacts.`);

    if (settings.lightingEffect !== 'none') {
        const direction = settings.lightingEffect.includes('left') ? 'from the left' : 'from the right';
        const strength = settings.lightingEffect.includes('strong') ? 'strong' : 'soft';
        promptParts.push(`Lighting Integration: Integrate the subject with a realistic ${strength} key light source coming ${direction}.`);
    }

    promptParts.push(`Ambient Lighting: Blend the environmental light from the new background onto the subject with an intensity of ${settings.lightingIntensity}%. This includes realistic color casting and light wrapping.`);

    promptParts.push('The output must be only the final, high-resolution image.');

    const finalPrompt = promptParts.join('\n');
    const additionalImages = settings.referenceImage ? [settings.referenceImage] : undefined;
    return callGeminiAPI(finalPrompt, originalImage, additionalImages);
};

// FIX: Added missing createProductMockup function.
export const createProductMockup = (settings: MockupSettings): Promise<string> => {
    if (!settings.productImage) {
        return Promise.reject(new Error('Product image is required.'));
    }
    
    const promptParts = [
        'Create a realistic product mockup. The main focus is the product from the first image.'
    ];
    let mainImage = settings.productImage;
    let additionalImages: string[] = [];
    
    if (settings.characterImage) {
        promptParts.push('The person in the second image should be holding or interacting with the product.');
        additionalImages.push(settings.characterImage);
    } else if (settings.characterPrompt.trim()) {
        promptParts.push(`A character described as "${settings.characterPrompt.trim()}" should be holding or interacting with the product.`);
    }

    if (settings.scenePrompt.trim()) {
        promptParts.push(`The scene is: "${settings.scenePrompt.trim()}".`);
    }

    const finalPrompt = promptParts.join(' ');
    return callGeminiAPI(finalPrompt, mainImage, additionalImages);
};

// FIX: Added missing cleanBackground function.
export const cleanBackground = (originalImage: string, settings: CleanBackgroundSettings): Promise<string> => {
    const promptParts = ['Clean the background of this image without altering the main subject.'];
    if (settings.removeObjects) promptParts.push('Remove any distracting objects or people from the background.');
    if (settings.evenColor) promptParts.push('Make the background color smooth and even, removing shadows or gradients.');
    if (settings.denoise) promptParts.push('Apply denoising to the background to remove grain.');
    if (settings.sharpen) promptParts.push('Slightly sharpen the background details.');
    if (settings.customPrompt.trim()) promptParts.push(`Additional instructions: "${settings.customPrompt.trim()}".`);
    
    return callGeminiAPI(promptParts.join(' '), originalImage);
};

// FIX: Added missing applyImageFilters function.
export const applyImageFilters = (originalImage: string, settings: ImageFilterSettings): Promise<string> => {
    const promptParts = ['Apply the following image filters to the person in the photo, maintaining their identity:'];
    if (settings.smoothSkin) promptParts.push('smooth skin');
    if (settings.smartPortrait) promptParts.push('apply smart portrait enhancements (like studio lighting)');
    if (settings.makeupTransfer) promptParts.push('apply subtle, natural makeup');
    if (settings.styleTransfer) promptParts.push('apply a creative artistic style transfer');
    if (settings.colorize) promptParts.push('colorize the image');
    if (settings.superResolution) promptParts.push('enhance to super resolution');
    if (settings.removeJpegArtifacts) promptParts.push('remove JPEG artifacts');
    if (settings.denoise) promptParts.push('apply denoising');
    if (settings.happiness !== 0) promptParts.push(`adjust happiness by ${settings.happiness}%`);
    if (settings.surprise !== 0) promptParts.push(`adjust surprise by ${settings.surprise}%`);
    if (settings.anger !== 0) promptParts.push(`adjust anger by ${settings.anger}%`);
    if (settings.age !== 0) promptParts.push(`adjust age by ${settings.age} years`);
    if (settings.hairThickness !== 0) promptParts.push(`adjust hair thickness by ${settings.hairThickness}%`);

    if (promptParts.length === 1) {
        return Promise.resolve(originalImage); // No filters selected
    }

    return callGeminiAPI(promptParts.join(', '), originalImage);
};

// FIX: Added missing generateWeddingPhoto function.
export const generateWeddingPhoto = (brideImage: string, groomImage: string, conceptPrompt: string, customPrompt: string): Promise<string> => {
    const prompt = `Create a photorealistic wedding photo. The bride's face MUST match the first image. The groom's face MUST match the second image. The scene and concept is: "${conceptPrompt}". Additional user request: "${customPrompt}".`;
    return callGeminiAPI(prompt, brideImage, [groomImage]);
};

// FIX: Added missing swapFamilyFaces function.
export const swapFamilyFaces = (groupImage: string, portraitImages: { image: string; description: string }[]): Promise<string> => {
    const promptParts = ['In the main group photo (first image), replace faces based on the following instructions. Use the provided portrait images for the new faces. It is critical to maintain the original bodies, poses, and background.'];
    const additionalImages = portraitImages.map(p => p.image);
    
    portraitImages.forEach((p, index) => {
        promptParts.push(`For the person described as "${p.description}", use the face from portrait image #${index + 2}.`);
    });

    return callGeminiAPI(promptParts.join(' '), groupImage, additionalImages);
};

// FIX: Added missing applyColorPreset function.
export const applyColorPreset = (originalImage: string, prompt: string): Promise<string> => {
    const finalPrompt = `Apply a color grade to this image based on the following instruction, without changing the image content: "${prompt}"`;
    return callGeminiAPI(finalPrompt, originalImage);
};

// FIX: Added missing alignFace function.
export const alignFace = (originalImage: string): Promise<string> => {
    const prompt = "Adjust the person's head in this portrait so they are looking directly forward at the camera. Maintain a natural pose and preserve their identity. The result must be photorealistic.";
    return callGeminiAPI(prompt, originalImage);
};

// FIX: Added missing removeWrinkles function.
export const removeWrinkles = (originalImage: string, settings: WrinkleEditorSettings): Promise<string> => {
    const prompt = `Subtly and realistically remove wrinkles from the ${settings.targetArea} in this image. The result should look natural, not overly smoothed or artificial. Preserve the original skin or fabric texture.`;
    return callGeminiAPI(prompt, originalImage);
};

// FIX: Added missing correctColor function.
export const correctColor = (originalImage: string, settings: ColorCorrectionSettings): Promise<string> => {
    const promptParts = ['Perform a professional color correction on this image. Apply the following adjustments with values from -100 to 100:'];
    
    if (settings.exposure !== 0) promptParts.push(`exposure: ${settings.exposure}`);
    if (settings.contrast !== 0) promptParts.push(`contrast: ${settings.contrast}`);
    if (settings.highlights !== 0) promptParts.push(`highlights: ${settings.highlights}`);
    if (settings.shadows !== 0) promptParts.push(`shadows: ${settings.shadows}`);
    if (settings.whites !== 0) promptParts.push(`whites: ${settings.whites}`);
    if (settings.blacks !== 0) promptParts.push(`blacks: ${settings.blacks}`);

    const hslAdjustments = (type: 'hue' | 'saturation' | 'luminance') => {
        const parts: string[] = [];
        for (const key in settings[type]) {
            const value = settings[type][key as HSLColor];
            if (value !== 0) {
                parts.push(`${key.replace(/s$/, '')} ${value}`);
            }
        }
        if (parts.length > 0) {
            promptParts.push(`${type}: ${parts.join(', ')}`);
        }
    };
    
    hslAdjustments('hue');
    hslAdjustments('saturation');
    hslAdjustments('luminance');

    if (promptParts.length === 1) {
        return Promise.resolve(originalImage); // No adjustments
    }

    return callGeminiAPI(promptParts.join('; '), originalImage);
};

// FIX: Added missing analyzeAndSuggestColorSettings function.
export const analyzeAndSuggestColorSettings = async (originalImage: string): Promise<ColorCorrectionSettings> => {
     const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    
    const imagePart = {
        inlineData: {
            data: originalImage.split(',')[1],
            mimeType: getMimeType(originalImage),
        }
    };

    const prompt = `Analyze this image's lighting and color balance. Suggest adjustments for exposure, contrast, highlights, shadows, whites, blacks, and HSL (hue, saturation, luminance) values for all 8 color channels (reds, oranges, yellows, greens, aquas, blues, purples, magentas). All values must be integers between -100 and 100. Provide the output as a single, valid JSON object matching the provided schema.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        exposure: { type: Type.INTEGER },
                        contrast: { type: Type.INTEGER },
                        highlights: { type: Type.INTEGER },
                        shadows: { type: Type.INTEGER },
                        whites: { type: Type.INTEGER },
                        blacks: { type: Type.INTEGER },
                        hue: {
                            type: Type.OBJECT,
                            properties: {
                                reds: { type: Type.INTEGER }, oranges: { type: Type.INTEGER }, yellows: { type: Type.INTEGER }, greens: { type: Type.INTEGER },
                                aquas: { type: Type.INTEGER }, blues: { type: Type.INTEGER }, purples: { type: Type.INTEGER }, magentas: { type: Type.INTEGER }
                            }
                        },
                         saturation: {
                            type: Type.OBJECT,
                            properties: {
                                reds: { type: Type.INTEGER }, oranges: { type: Type.INTEGER }, yellows: { type: Type.INTEGER }, greens: { type: Type.INTEGER },
                                aquas: { type: Type.INTEGER }, blues: { type: Type.INTEGER }, purples: { type: Type.INTEGER }, magentas: { type: Type.INTEGER }
                            }
                        },
                         luminance: {
                            type: Type.OBJECT,
                            properties: {
                                reds: { type: Type.INTEGER }, oranges: { type: Type.INTEGER }, yellows: { type: Type.INTEGER }, greens: { type: Type.INTEGER },
                                aquas: { type: Type.INTEGER }, blues: { type: Type.INTEGER }, purples: { type: Type.INTEGER }, magentas: { type: Type.INTEGER }
                            }
                        },
                    }
                }
            }
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error in analyzeAndSuggestColorSettings:", error);
        throw new Error("Không thể phân tích ảnh để tự động điều chỉnh.");
    }
};