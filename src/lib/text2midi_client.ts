/**
 * Text2midi Client for MPN (Musical Psychometric Notation)
 * 
 * Integrates with amaai-lab/text2midi HuggingFace model for symbolic MIDI generation.
 * This is the first end-to-end model for generating MIDI files from textual descriptions
 * (AAAI 2025).
 * 
 * @see https://huggingface.co/spaces/amaai-lab/text2midi
 * @see https://github.com/AMAAI-Lab/Text2midi
 */

export interface Text2midiRequest {
    prompt: string;           // e.g. "melancholic piano, 100 BPM, D minor, slow tempo"
    max_new_tokens?: number;  // Token limit for generation (default: 512)
    temperature?: number;     // Generation diversity 0.1-1.0 (default: 0.7)
    top_p?: number;          // Nucleus sampling (default: 0.9)
    seed?: number;           // For reproducible generation
}

export interface Text2midiResponse {
    midi_base64: string;      // Base64-encoded MIDI file
    success: boolean;
    error?: string;
    tokens_used?: number;
    generation_time_ms?: number;
}

export interface ParsedMidiNote {
    pitch: number;            // MIDI note number 0-127
    startTime: number;        // Start time in beats
    duration: number;         // Duration in beats
    velocity: number;         // Velocity 0-127
    channel: number;          // MIDI channel 0-15
}

export interface PsychometricTextParams {
    trauma: number;           // 0-1
    entropy: number;          // 0-1
    rsi: {
        real: number;         // 0-1 (grounded, physical)
        symbolic: number;     // 0-1 (law, order, structure)
        imaginary: number;    // 0-1 (fantasy, desire, wonder)
    };
    musicalContext: {
        key: string;          // e.g. "C", "Bb", "F#"
        mode: string;         // e.g. "major", "minor", "dorian"
        tempo?: number;       // BPM
    };
}

// HuggingFace Inference API configuration
const HF_API_ENDPOINT = 'https://api-inference.huggingface.co/models/amaai-lab/text2midi';
const HF_SPACE_ENDPOINT = 'https://amaai-lab-text2midi.hf.space/run/predict';

/**
 * Convert psychometric state to a natural language prompt for Text2midi
 */
export function psychometricsToText2midiPrompt(params: PsychometricTextParams): string {
    const parts: string[] = [];

    // RSI Register → Genre/Mood/Instrumentation
    if (params.rsi.imaginary > 0.5) {
        parts.push('ethereal', 'dreamlike', 'mysterious');
        if (params.rsi.imaginary > 0.7) {
            parts.push('fantasy', 'magical celesta');
        }
    } else if (params.rsi.real > 0.5) {
        parts.push('grounded', 'earthy', 'acoustic');
        if (params.rsi.real > 0.7) {
            parts.push('folk', 'natural');
        }
    } else if (params.rsi.symbolic > 0.5) {
        parts.push('structured', 'classical', 'formal');
        if (params.rsi.symbolic > 0.7) {
            parts.push('baroque', 'counterpoint');
        }
    }

    // Trauma Level → Emotional Intensity
    if (params.trauma > 0.7) {
        parts.push('intense', 'dramatic', 'turbulent', 'tension');
    } else if (params.trauma > 0.4) {
        parts.push('moderately emotional', 'melancholic', 'wistful');
    } else if (params.trauma < 0.2) {
        parts.push('calm', 'peaceful', 'serene', 'gentle');
    }

    // Entropy → Structure/Chaos
    if (params.entropy > 0.6) {
        parts.push('free-form', 'experimental', 'unpredictable');
        if (params.entropy > 0.8) {
            parts.push('chaotic', 'dissonant');
        }
    } else if (params.entropy > 0.3) {
        parts.push('loosely structured', 'jazz-like', 'improvisational');
    } else {
        parts.push('strictly composed', 'clean', 'organized');
    }

    // Musical Context
    const key = params.musicalContext.key || 'C';
    const mode = params.musicalContext.mode || 'major';
    parts.push(`${key} ${mode}`);

    if (params.musicalContext.tempo) {
        const tempoDesc = params.musicalContext.tempo < 80 ? 'slow tempo' :
            params.musicalContext.tempo > 140 ? 'fast tempo' :
                'moderate tempo';
        parts.push(tempoDesc, `${params.musicalContext.tempo} BPM`);
    }

    return parts.join(', ');
}

/**
 * Text2midi Client - generates symbolic MIDI from text descriptions
 */
export class Text2midiClient {
    private static instance: Text2midiClient | null = null;
    private apiKey: string;
    private useSpacesFallback: boolean = true;
    private lastRequestTime: number = 0;
    private minRequestInterval: number = 1000; // Rate limit: 1 request per second

    private constructor() {
        this.apiKey = process.env.HUGGINGFACE_API_KEY || '';
    }

    static getInstance(): Text2midiClient {
        if (!Text2midiClient.instance) {
            Text2midiClient.instance = new Text2midiClient();
        }
        return Text2midiClient.instance;
    }

    /**
     * Generate MIDI from a text prompt
     */
    async generate(request: Text2midiRequest): Promise<Text2midiResponse> {
        // Rate limiting
        const now = Date.now();
        if (now - this.lastRequestTime < this.minRequestInterval) {
            await new Promise(r => setTimeout(r, this.minRequestInterval - (now - this.lastRequestTime)));
        }
        this.lastRequestTime = Date.now();

        const startTime = performance.now();

        try {
            // Try HuggingFace Inference API first
            const response = await this.callHuggingFaceAPI(request);

            return {
                ...response,
                generation_time_ms: Math.round(performance.now() - startTime)
            };
        } catch (error) {
            console.warn('[Text2midi] HF API failed, trying Spaces fallback...', error);

            if (this.useSpacesFallback) {
                try {
                    const spaceResponse = await this.callSpacesAPI(request);
                    return {
                        ...spaceResponse,
                        generation_time_ms: Math.round(performance.now() - startTime)
                    };
                } catch (spaceError) {
                    console.error('[Text2midi] Spaces fallback also failed:', spaceError);
                }
            }

            return {
                midi_base64: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                generation_time_ms: Math.round(performance.now() - startTime)
            };
        }
    }

    /**
     * Generate MIDI from psychometric state
     */
    async generateFromPsychometrics(params: PsychometricTextParams): Promise<Text2midiResponse> {
        const prompt = psychometricsToText2midiPrompt(params);
        console.log('[Text2midi] Generated prompt:', prompt);
        return this.generate({ prompt });
    }

    private async callHuggingFaceAPI(request: Text2midiRequest): Promise<Text2midiResponse> {
        const response = await fetch(HF_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: request.prompt,
                parameters: {
                    max_new_tokens: request.max_new_tokens || 512,
                    temperature: request.temperature || 0.7,
                    top_p: request.top_p || 0.9,
                    do_sample: true,
                    ...(request.seed !== undefined && { seed: request.seed })
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HuggingFace API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        // Handle different response formats
        if (Array.isArray(data) && data[0]?.generated_text) {
            // Text generation response - need to parse MIDI tokens
            return {
                midi_base64: this.tokensToMidiBase64(data[0].generated_text),
                success: true,
                tokens_used: data[0].generated_text.length
            };
        } else if (data.error) {
            throw new Error(data.error);
        }

        return {
            midi_base64: data.midi || '',
            success: true
        };
    }

    private async callSpacesAPI(request: Text2midiRequest): Promise<Text2midiResponse> {
        const response = await fetch(HF_SPACE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: [
                    request.prompt,
                    request.temperature || 0.7,
                    request.max_new_tokens || 512
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Spaces API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.data && data.data[0]) {
            return {
                midi_base64: data.data[0],
                success: true
            };
        }

        throw new Error('Invalid Spaces response format');
    }

    /**
     * Convert Text2midi token output to base64 MIDI
     * Note: This is a placeholder - actual implementation depends on Token format
     */
    private tokensToMidiBase64(tokens: string): string {
        // Text2midi uses a specific tokenization scheme
        // For now, return the raw output which may already be base64
        if (tokens.startsWith('TVRo')) {
            // Likely already base64 MIDI (starts with "MThd" magic number)
            return tokens;
        }

        // If it's a token sequence, we need to decode it
        // This would require the text2midi tokenizer
        console.warn('[Text2midi] Token decoding not yet implemented, returning raw');
        return btoa(tokens);
    }

    /**
     * Parse base64 MIDI into note events
     */
    parseMidiToNotes(midiBase64: string): ParsedMidiNote[] {
        if (!midiBase64) return [];

        try {
            const midiBytes = Uint8Array.from(atob(midiBase64), c => c.charCodeAt(0));
            return this.parseMidiBinary(midiBytes);
        } catch (error) {
            console.error('[Text2midi] MIDI parsing failed:', error);
            return [];
        }
    }

    /**
     * Simple MIDI parser for note events
     */
    private parseMidiBinary(data: Uint8Array): ParsedMidiNote[] {
        const notes: ParsedMidiNote[] = [];

        // Validate MIDI header
        if (String.fromCharCode(data[0], data[1], data[2], data[3]) !== 'MThd') {
            console.warn('[Text2midi] Invalid MIDI header');
            return notes;
        }

        // Basic MIDI parsing - extract note on/off events
        let pos = 8; // Skip header
        const headerLength = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];
        pos = 8 + headerLength;

        const activeNotes: Map<number, { startTime: number; velocity: number }> = new Map();
        let currentTime = 0;
        const ticksPerBeat = (data[12] << 8) | data[13];

        while (pos < data.length) {
            // Look for track marker
            if (String.fromCharCode(data[pos], data[pos + 1], data[pos + 2], data[pos + 3]) === 'MTrk') {
                pos += 8; // Skip track header

                while (pos < data.length) {
                    // Read delta time (variable length)
                    let deltaTime = 0;
                    let byte;
                    do {
                        byte = data[pos++];
                        deltaTime = (deltaTime << 7) | (byte & 0x7F);
                    } while (byte & 0x80);

                    currentTime += deltaTime / ticksPerBeat;

                    const status = data[pos++];

                    // Note On (0x9n)
                    if ((status & 0xF0) === 0x90) {
                        const pitch = data[pos++];
                        const velocity = data[pos++];

                        if (velocity > 0) {
                            activeNotes.set(pitch, { startTime: currentTime, velocity });
                        } else {
                            // Note off (velocity 0)
                            const noteStart = activeNotes.get(pitch);
                            if (noteStart) {
                                notes.push({
                                    pitch,
                                    startTime: noteStart.startTime,
                                    duration: currentTime - noteStart.startTime,
                                    velocity: noteStart.velocity,
                                    channel: status & 0x0F
                                });
                                activeNotes.delete(pitch);
                            }
                        }
                    }
                    // Note Off (0x8n)
                    else if ((status & 0xF0) === 0x80) {
                        const pitch = data[pos++];
                        pos++; // Skip velocity

                        const noteStart = activeNotes.get(pitch);
                        if (noteStart) {
                            notes.push({
                                pitch,
                                startTime: noteStart.startTime,
                                duration: currentTime - noteStart.startTime,
                                velocity: noteStart.velocity,
                                channel: status & 0x0F
                            });
                            activeNotes.delete(pitch);
                        }
                    }
                    // End of track
                    else if (status === 0xFF && data[pos] === 0x2F) {
                        break;
                    }
                    // Skip other events
                    else if ((status & 0xF0) >= 0x80) {
                        pos += this.getEventLength(status, data, pos);
                    }
                }
            } else {
                pos++;
            }
        }

        return notes;
    }

    private getEventLength(status: number, data: Uint8Array, pos: number): number {
        const type = status & 0xF0;
        switch (type) {
            case 0x80: case 0x90: case 0xA0: case 0xB0: case 0xE0:
                return 2;
            case 0xC0: case 0xD0:
                return 1;
            case 0xF0:
                if (status === 0xFF) {
                    pos++; // Skip type
                    let length = 0;
                    let byte;
                    do {
                        byte = data[pos++];
                        length = (length << 7) | (byte & 0x7F);
                    } while (byte & 0x80);
                    return length + 2;
                }
                return 0;
            default:
                return 0;
        }
    }

    /**
     * Check if the client is configured
     */
    isConfigured(): boolean {
        return Boolean(this.apiKey);
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(HF_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: 'test' })
            });
            return response.ok || response.status === 503; // 503 = model loading, but endpoint reachable
        } catch {
            return false;
        }
    }
}

// Export singleton
export const text2midiClient = Text2midiClient.getInstance();
