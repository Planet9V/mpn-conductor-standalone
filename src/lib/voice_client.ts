
/**
 * ElevenLabs Voice Client for MPN Conductor
 * 
 * Handles text-to-speech synthesis for Lead Voice actors.
 */

export interface VoiceConfig {
    apiKey: string;
    baseUrl: string;
    defaultVoiceId: string;
}

export const ELEVENLABS_CONFIG: VoiceConfig = {
    apiKey: process.env.ELEVENLABS_API_KEY || '',
    baseUrl: 'https://api.elevenlabs.io/v1',
    defaultVoiceId: '21m00Tcm4TlvDq8ikWAM', // Default "Rachel"
};

export class ElevenLabsClient {
    private static instance: ElevenLabsClient;
    private config: VoiceConfig;
    private bufferCache: Map<string, ArrayBuffer> = new Map();

    private constructor() {
        this.config = ELEVENLABS_CONFIG;
    }

    static getInstance(): ElevenLabsClient {
        if (!ElevenLabsClient.instance) {
            ElevenLabsClient.instance = new ElevenLabsClient();
        }
        return ElevenLabsClient.instance;
    }

    /**
     * Synthesize text to speech with optional emotion styling
     * @param text The text to speak
     * @param voiceId Optional voice ID (defaults to config default)
     * @param options Optional synthesis options including emotion style
     * @returns ArrayBuffer of audio data
     */
    async synthesize(
        text: string,
        voiceId?: string,
        options?: {
            stability?: number;
            similarityBoost?: number;
            speakerStyle?: string;
        }
    ): Promise<ArrayBuffer | null> {
        const stability = options?.stability ?? 0.5;
        const similarityBoost = options?.similarityBoost ?? 0.75;
        const speakerStyle = options?.speakerStyle;

        // Adjust voice settings based on emotion style
        const emotionAdjustments = this.getEmotionAdjustments(speakerStyle);
        const finalStability = emotionAdjustments.stability ?? stability;
        const finalSimilarityBoost = emotionAdjustments.similarityBoost ?? similarityBoost;

        const key = `${voiceId || this.config.defaultVoiceId}:${text}:${finalStability}:${speakerStyle || 'default'}`;

        // Return cached if available
        if (this.bufferCache.has(key)) {
            console.log(`[VoiceClient] Using cached audio for: "${text.substring(0, 20)}..."`);
            return this.bufferCache.get(key)!;
        }

        const apiKey = this.config.apiKey;
        if (!apiKey) {
            console.warn('[VoiceClient] No ElevenLabs API key found');
            return null;
        }

        const targetVoiceId = voiceId || this.config.defaultVoiceId;
        const url = `${this.config.baseUrl}/text-to-speech/${targetVoiceId}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'xi-api-key': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: finalStability,
                        similarity_boost: finalSimilarityBoost,
                        style: emotionAdjustments.style ?? 0,
                        use_speaker_boost: true
                    }
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`ElevenLabs API error ${response.status}: ${errorText}`);
            }

            const buffer = await response.arrayBuffer();

            // Cache result
            this.bufferCache.set(key, buffer);
            console.log(`[VoiceClient] Synthesized with emotion: ${speakerStyle || 'default'}`);

            return buffer;
        } catch (error) {
            console.error('[VoiceClient] Synthesis failed:', error);
            return null;
        }
    }

    /**
     * Map emotion style names to ElevenLabs voice settings adjustments
     */
    private getEmotionAdjustments(speakerStyle?: string): {
        stability?: number;
        similarityBoost?: number;
        style?: number; // 0-1 for ElevenLabs style parameter
    } {
        const emotionMap: Record<string, { stability: number; similarityBoost: number; style: number }> = {
            'fearful': { stability: 0.25, similarityBoost: 0.8, style: 0.7 },
            'excited': { stability: 0.3, similarityBoost: 0.8, style: 0.9 },
            'sad': { stability: 0.8, similarityBoost: 0.6, style: 0.3 },
            'angry': { stability: 0.4, similarityBoost: 0.85, style: 0.8 },
            'cheerful': { stability: 0.5, similarityBoost: 0.75, style: 0.6 },
            'hopeful': { stability: 0.6, similarityBoost: 0.7, style: 0.5 },
            'whispering': { stability: 0.9, similarityBoost: 0.5, style: 0.2 },
            'shouting': { stability: 0.2, similarityBoost: 0.9, style: 1.0 },
            'friendly': { stability: 0.6, similarityBoost: 0.7, style: 0.4 },
            'default': { stability: 0.5, similarityBoost: 0.75, style: 0 }
        };

        return emotionMap[speakerStyle || 'default'] || emotionMap['default'];
    }

    /**
     * Fetch all available voices from ElevenLabs
     */
    async getVoices(): Promise<any[]> {
        const apiKey = this.config.apiKey;
        if (!apiKey) {
            console.warn('[VoiceClient] No ElevenLabs API key found for voice listing');
            return [];
        }

        try {
            const response = await fetch(`${this.config.baseUrl}/voices`, {
                method: 'GET',
                headers: {
                    'xi-api-key': apiKey,
                },
            });

            if (!response.ok) {
                throw new Error(`ElevenLabs API error ${response.status}: ${await response.text()}`);
            }

            const data = await response.json();
            return data.voices || [];
        } catch (error) {
            console.error('[VoiceClient] Failed to fetch voices:', error);
            return [];
        }
    }

    /**
     * Clear the audio cache
     */
    clearCache() {
        this.bufferCache.clear();
    }
}

export const voiceClient = ElevenLabsClient.getInstance();
