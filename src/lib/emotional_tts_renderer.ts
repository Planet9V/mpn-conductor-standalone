/**
 * Emotional Text-to-Speech Renderer
 * Multi-provider architecture with SSML emotion control
 * 
 * Scientific Foundation: Global Style Tokens (GST-Tacotron)
 * 
 * Supports:
 * - Microsoft Azure Speech (native emotion styles)
 * - ElevenLabs (baseline, high quality)
 * - Bark/Suno (open-source, experimental)
 */

import { ElevenLabsClient } from './voice_client';

// ============================================================================
// TYPES
// ============================================================================

export interface EmotionStyle {
    style: 'default' | 'cheerful' | 'angry' | 'sad' | 'fearful' | 'excited' | 'friendly' | 'hopeful' | 'shouting' | 'whispering';
    rate: string;      // "0.8" to "1.5"
    pitch: string;     // "-10%" to "+10%"
    intensity: number; // 0-1, how strongly to apply
}

export interface PsychometricState {
    trauma: number;
    entropy: number;
    rsi: { real: number; symbolic: number; imaginary: number };
}

export type TTSProvider = 'azure' | 'elevenlabs' | 'bark';

// ============================================================================
// EMOTION MAPPING
// Based on the dimensional emotion model (arousal-valence) from GST research
// ============================================================================

/**
 * Map psychometric state to emotion style for TTS
 * 
 * This uses the arousal-valence model:
 * - High Trauma + High Entropy = High Arousal, Negative Valence → Fear/Anger
 * - High Trauma + Low Entropy = Low Arousal, Negative Valence → Sad
 * - Low Trauma + High Entropy = High Arousal, Positive Valence → Excited
 * - Low Trauma + Low Entropy = Low Arousal, Positive Valence → Calm/Friendly
 */
export function mapPsychometricsToEmotion(p: PsychometricState): EmotionStyle {
    const { trauma, entropy, rsi } = p;

    // High trauma states
    if (trauma > 0.8 && entropy > 0.6) {
        return {
            style: 'fearful',
            rate: '1.2',      // Faster when afraid
            pitch: '+15%',    // Higher pitch
            intensity: 0.9
        };
    }

    if (trauma > 0.7 && entropy < 0.4) {
        return {
            style: 'sad',
            rate: '0.85',     // Slower when sad
            pitch: '-8%',     // Lower pitch
            intensity: 0.8
        };
    }

    if (trauma > 0.6) {
        return {
            style: 'angry',
            rate: '1.1',
            pitch: '+5%',
            intensity: trauma
        };
    }

    // High entropy (chaotic) states
    if (entropy > 0.7) {
        return {
            style: 'excited',
            rate: '1.15',
            pitch: '+8%',
            intensity: entropy
        };
    }

    // Dominant register influences
    if (rsi.symbolic > rsi.real && rsi.symbolic > rsi.imaginary) {
        return {
            style: 'hopeful',
            rate: '1.0',
            pitch: '+3%',
            intensity: 0.6
        };
    }

    if (rsi.imaginary > 0.5) {
        return {
            style: 'whispering',
            rate: '0.9',
            pitch: '-3%',
            intensity: 0.5
        };
    }

    // Default calm/friendly state
    return {
        style: 'friendly',
        rate: '1.0',
        pitch: '0%',
        intensity: 0.4
    };
}

// ============================================================================
// AZURE SPEECH SERVICE (SSML)
// Native emotion support via <mstts:express-as>
// ============================================================================

/**
 * Build Azure SSML with emotion markers
 * 
 * Example output:
 * <speak version="1.0" xmlns="..." xmlns:mstts="...">
 *   <voice name="en-US-JennyNeural">
 *     <mstts:express-as style="fearful" styledegree="1.5">
 *       <prosody rate="1.2" pitch="+15%">
 *         The ring... I can feel it calling to me.
 *       </prosody>
 *     </mstts:express-as>
 *   </voice>
 * </speak>
 */
export function buildAzureSSML(
    text: string,
    emotion: EmotionStyle,
    voiceName: string = 'en-US-JennyNeural'
): string {
    const styleDegree = Math.min(2, 0.5 + (emotion.intensity * 1.5)); // 0.5 to 2.0

    return `
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts"
       xml:lang="en-US">
  <voice name="${voiceName}">
    <mstts:express-as style="${emotion.style}" styledegree="${styleDegree.toFixed(1)}">
      <prosody rate="${emotion.rate}" pitch="${emotion.pitch}">
        ${escapeXML(text)}
      </prosody>
    </mstts:express-as>
  </voice>
</speak>`.trim();
}

function escapeXML(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Azure Speech Service synthesis
 * Requires AZURE_SPEECH_KEY and AZURE_SPEECH_REGION env vars
 */
export async function synthesizeWithAzure(
    ssml: string
): Promise<ArrayBuffer> {
    const key = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION || 'eastus';

    if (!key) {
        throw new Error('AZURE_SPEECH_KEY not configured');
    }

    const response = await fetch(
        `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
        {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3'
            },
            body: ssml
        }
    );

    if (!response.ok) {
        throw new Error(`Azure Speech error: ${response.status}`);
    }

    return response.arrayBuffer();
}

// ============================================================================
// BARK (SUNO) - OPEN SOURCE
// Uses [emotion] tokens for control
// ============================================================================

/**
 * Build Bark prompt with emotion tokens
 * 
 * Example: "[fearful] The ring... I can feel it calling to me."
 */
export function buildBarkPrompt(
    text: string,
    emotion: EmotionStyle
): string {
    const emotionToken = `[${emotion.style}]`;
    return `${emotionToken} ${text}`;
}

// Note: Bark synthesis requires local model or API endpoint
// This is a placeholder for future integration

// ============================================================================
// MAIN RENDERER CLASS
// ============================================================================

export class EmotionalTTSRenderer {
    private elevenLabsClient: ElevenLabsClient | null = null;
    private preferredProvider: TTSProvider = 'elevenlabs';

    constructor(preferredProvider: TTSProvider = 'elevenlabs') {
        this.preferredProvider = preferredProvider;

        if (preferredProvider === 'elevenlabs' || !process.env.AZURE_SPEECH_KEY) {
            this.elevenLabsClient = new ElevenLabsClient();
        }
    }

    /**
     * Render emotional speech based on psychometric state
     */
    async render(
        text: string,
        speaker: string,
        psychometrics: PsychometricState
    ): Promise<ArrayBuffer> {
        const emotion = mapPsychometricsToEmotion(psychometrics);

        // High intensity emotions → use Azure for best emotion support
        if (emotion.intensity > 0.7 && process.env.AZURE_SPEECH_KEY) {
            console.log(`[TTS] Using Azure for high-intensity emotion: ${emotion.style}`);
            const ssml = buildAzureSSML(text, emotion);
            return synthesizeWithAzure(ssml);
        }

        // Default to ElevenLabs for natural baseline
        if (this.elevenLabsClient) {
            console.log(`[TTS] Using ElevenLabs with stability adjustment`);
            // Map emotion to ElevenLabs parameters
            const stability = emotion.style === 'fearful' || emotion.style === 'excited'
                ? 0.3
                : 0.7;

            return this.elevenLabsClient.synthesize(text, speaker, {
                stability,
                similarityBoost: 0.75,
                speakerStyle: emotion.style
            });
        }

        throw new Error('No TTS provider available');
    }

    /**
     * Get emotion preview (for UI display)
     */
    getEmotionPreview(psychometrics: PsychometricState): {
        style: string;
        description: string;
        intensity: number;
    } {
        const emotion = mapPsychometricsToEmotion(psychometrics);

        const descriptions: Record<string, string> = {
            'default': 'Neutral, calm delivery',
            'cheerful': 'Bright, upbeat tone',
            'angry': 'Tense, forceful delivery',
            'sad': 'Slow, melancholic tone',
            'fearful': 'Nervous, trembling voice',
            'excited': 'Energetic, enthusiastic',
            'friendly': 'Warm, approachable tone',
            'hopeful': 'Optimistic, rising intonation',
            'shouting': 'Loud, urgent delivery',
            'whispering': 'Quiet, intimate tone'
        };

        return {
            style: emotion.style,
            description: descriptions[emotion.style] || 'Standard delivery',
            intensity: emotion.intensity
        };
    }
}

// ============================================================================
// UTILITY: Word-Level Emotion Markup
// For advanced use cases where different parts of a sentence have different emotions
// ============================================================================

export interface WordEmotion {
    word: string;
    emotion: EmotionStyle;
}

/**
 * Build SSML with word-level emotion changes
 * 
 * Example input:
 * [
 *   { word: "I'm", emotion: { style: "sad", ... } },
 *   { word: "fine", emotion: { style: "angry", ... } }
 * ]
 */
export function buildWordLevelSSML(
    words: WordEmotion[],
    voiceName: string = 'en-US-JennyNeural'
): string {
    const segments = words.map(({ word, emotion }) => {
        const styleDegree = Math.min(2, 0.5 + (emotion.intensity * 1.5));
        return `
      <mstts:express-as style="${emotion.style}" styledegree="${styleDegree.toFixed(1)}">
        <prosody rate="${emotion.rate}" pitch="${emotion.pitch}">
          ${escapeXML(word)}
        </prosody>
      </mstts:express-as>`;
    }).join(' ');

    return `
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts"
       xml:lang="en-US">
  <voice name="${voiceName}">
    ${segments}
  </voice>
</speak>`.trim();
}
