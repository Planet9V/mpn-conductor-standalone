
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
     * Synthesize text to speech
     * @param text The text to speak
     * @param voiceId Optional voice ID (defaults to config default)
     * @param stability Optional stability setting (0.0 - 1.0)
     * @returns ArrayBuffer of audio data
     */
    async synthesize(
        text: string,
        voiceId?: string,
        stability: number = 0.5,
        similarityBoost: number = 0.75
    ): Promise<ArrayBuffer | null> {
        const key = `${voiceId || this.config.defaultVoiceId}:${text}:${stability}`;

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
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        stability,
                        similarity_boost: similarityBoost,
                    }
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`ElevenLabs API error ${response.status}: ${errorText}`);
            }

            const buffer = await response.arrayBuffer();

            // Cache result (simple LRU could be added, but map is fine for session)
            this.bufferCache.set(key, buffer);

            return buffer;
        } catch (error) {
            console.error('[VoiceClient] Synthesis failed:', error);
            return null;
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
