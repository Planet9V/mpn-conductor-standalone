/**
 * AI Music Client for MPN (Musical Psychometric Notation)
 * 
 * Uses OpenRouter with Gemini models for production, with local LM Studio fallback for development.
 * 
 * Model Priority (Symbolic MIDI Generation):
 * 1. PSYCHOSCORE: Custom-trained 57D psychometric→MIDI model (highest priority)
 * 2. Text2midi: HuggingFace amaai-lab/text2midi
 * 3. OpenRouter: google/gemini-3-flash-preview (LLM fallback)
 * 
 * HuggingFace Integration:
 * - facebook/musicgen-large for actual audio generation
 * - facebook/musicgen-melody for melody-conditioned outputs
 * - amaai-lab/text2midi for symbolic MIDI generation
 * 
 * PSYCHOSCORE Integration:
 * - Custom 57-dimension psychometric input (DISC, OCEAN, RSI, Dark Triad, Biases, Physics)
 * - REMI tokenization with 1,700+ psychometric prefix tokens
 * - Trained on RTX 5070 Ti with QLoRA
 */

import { OpenRouterClient, MPN_AI_CONFIG, HUGGINGFACE_MUSIC_MODELS } from './openrouter_client';
import {
    Text2midiClient,
    text2midiClient,
    psychometricsToText2midiPrompt,
    type PsychometricTextParams,
    type ParsedMidiNote
} from './text2midi_client';
import { PsychoscoreClient, getPsychoscoreClient, type PsychoscoreRequest } from './psychoscore_client';

export interface AICompostionParams {
    psychometrics: {
        trauma: number;
        entropy: number;
        cognitiveBias: string;
        rsi: { real: number; symbolic: number; imaginary: number };
    };
    musicalContext: {
        key: string;
        mode: string;
        currentChord: string;
        instrument: string;
    };
    temperature: number;
}

export interface AIMelodyResponse {
    notes: {
        pitch: string; // e.g. "C#4"
        duration: number; // in beats
        velocity: number; // 0-1
    }[];
    reasoning: string;
}

// Local development endpoint (LM Studio)
const LM_STUDIO_ENDPOINT = 'http://100.113.4.39:1234/v1/chat/completions';
const USE_LOCAL_LM = process.env.NODE_ENV === 'development' && process.env.USE_LOCAL_LM === 'true';

export class AIMusicClient {
    private static instance: AIMusicClient;
    private openRouter: OpenRouterClient;
    private text2midi: Text2midiClient;
    private psychoscore: PsychoscoreClient;
    private isLocalConnected: boolean = false;

    private constructor() {
        this.openRouter = new OpenRouterClient(MPN_AI_CONFIG);
        this.text2midi = Text2midiClient.getInstance();
        this.psychoscore = getPsychoscoreClient();
    }

    static getInstance(): AIMusicClient {
        if (!AIMusicClient.instance) {
            AIMusicClient.instance = new AIMusicClient();
        }
        return AIMusicClient.instance;
    }

    async checkConnection(): Promise<boolean> {
        // Check PSYCHOSCORE first (highest priority for symbolic MIDI)
        const psychoscoreOk = await this.psychoscore.healthCheck();
        if (psychoscoreOk) return true;

        // Check OpenRouter for LLM fallback
        const openRouterOk = await this.openRouter.healthCheck();
        if (openRouterOk) return true;

        // Check Text2midi
        const text2midiOk = await this.text2midi.healthCheck();
        if (text2midiOk) return true;

        // Fall back to local LM Studio if configured
        if (USE_LOCAL_LM) {
            try {
                const res = await fetch('http://100.113.4.39:1234/v1/models');
                this.isLocalConnected = res.ok;
                return res.ok;
            } catch {
                this.isLocalConnected = false;
            }
        }

        return false;
    }

    async generateMelody(params: AICompostionParams): Promise<AIMelodyResponse | null> {
        const systemPrompt = `You are a Genius Composer AI implementing McKenney-Lacan Musical Psychometric Notation (MPN).
        
Your task is to generate a short musical phrase (melody) based on the provided PSYCHOMETRIC STATE.
The output maps Lacanian registers (Real-Symbolic-Imaginary) to Neo-Riemannian transformations.

Output Format: JSON only.
Structure:
{
    "notes": [ { "pitch": "NoteName+Octave", "duration": float_beats, "velocity": 0.0-1.0 } ],
    "reasoning": "Short explanation of how psychometrics influenced this via R-S-I registers."
}

MPN Calculus Rules:
- High Trauma (>0.8) → P (Parallel) transformations, erratic rhythms, tritone tension
- High Entropy → R (Relative) motion, randomized intervals, unstable tempo
- High Symbolic RSI → L (Leading-tone exchange), structured leitmotif patterns
- High Real RSI → Dissonance, unresolved suspensions, raw physicality
- High Imaginary RSI → Consonance, ego-flattering melodies, major mode bias

Dark Triad Influence:
- Machiavellianism → Deceptive cadences, chromatic approach
- Narcissism → Prominent melodic lines, virtuosic passages
- Psychopathy → Sudden dynamic changes, unpredictable accents`;

        const userPrompt = JSON.stringify(params, null, 2);

        // Try OpenRouter first
        const response = await this.openRouter.createCompletion({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: params.temperature,
            maxTokens: 1000
        });

        if (response && response.content) {
            try {
                // Strip markdown formatting if present
                const cleanJson = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(cleanJson);
            } catch (e) {
                console.error('Failed to parse AI response:', e);
                return null;
            }
        }

        // Fall back to local LM Studio if OpenRouter fails
        if (USE_LOCAL_LM && this.isLocalConnected) {
            return this.generateMelodyLocal(params, systemPrompt, userPrompt);
        }

        return null;
    }

    private async generateMelodyLocal(
        params: AICompostionParams,
        systemPrompt: string,
        userPrompt: string
    ): Promise<AIMelodyResponse | null> {
        try {
            const response = await fetch(LM_STUDIO_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'scrapegoat-music-stage2',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: params.temperature || 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) return null;

            const data = await response.json();
            return this.parseAIResponse(data.choices[0].message.content);
        } catch (error) {
            console.error('[AIMusicClient] Local LM generation failed:', error);
            return null;
        }
    }

    private parseAIResponse(content: string): AIMelodyResponse | null {
        try {
            // Attempt to parse JSON from content (it might be wrapped in markdown blocks)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]) as AIMelodyResponse;
            }
            return JSON.parse(content);
        } catch (error) {
            console.error('[AIMusicClient] Failed to parse AI response:', error);
            return null;
        }
    }

    /**
     * Generate actual audio using HuggingFace MusicGen
     * @param prompt Text description of the music
     * @param duration Duration in seconds (default 10)
     */
    async generateAudio(prompt: string, duration: number = 10): Promise<ArrayBuffer | null> {
        const apiKey = process.env.HUGGINGFACE_API_KEY;
        if (!apiKey) {
            console.warn('[AIMusicClient] No HuggingFace API key found');
            return null;
        }

        const model = HUGGINGFACE_MUSIC_MODELS.musicGenSmall; // Use small for speed/reliability

        try {
            const response = await fetch(model.endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        duration_seconds: duration,
                    }
                }),
            });

            if (!response.ok) {
                throw new Error(`HF API error: ${response.status} ${response.statusText}`);
            }

            const buffer = await response.arrayBuffer();
            return buffer;

        } catch (error) {
            console.error('[AIMusicClient] Audio generation failed:', error);
            return null;
        }
    }

    /**
     * Generate symbolic MIDI from psychometric state using Text2midi
     * This produces MIDI note events that can be directly integrated into the score.
     * 
     * @param params Psychometric state parameters
     * @returns Parsed MIDI notes or null on failure
     */
    async generateSymbolicMidi(params: PsychometricTextParams): Promise<ParsedMidiNote[] | null> {
        // Try PSYCHOSCORE first (custom trained model - highest quality)
        try {
            const psychoscoreAvailable = await this.psychoscore.healthCheck();

            if (psychoscoreAvailable) {
                console.log('[AIMusicClient] Using PSYCHOSCORE for generation');

                // Convert params to PsychometricState format for PSYCHOSCORE
                const psychoState = {
                    discProfile: params.disc,
                    oceanProfile: params.ocean,
                    rsi: params.rsi,
                    trauma: params.trauma ?? 0.3,
                    entropy: params.entropy ?? 0.3,
                    darkTriad: params.darkTriad,
                    activeBiases: [],
                    physicsState: undefined,
                    musicalContext: undefined,
                };

                const midiBuffer = await this.psychoscore.generateFromPsychometrics(
                    psychoState as any,
                    32 // bars
                );

                if (midiBuffer) {
                    // Parse MIDI buffer to notes using text2midi's parser
                    const base64 = btoa(
                        String.fromCharCode(...new Uint8Array(midiBuffer))
                    );
                    const notes = this.text2midi.parseMidiToNotes(base64);
                    console.log(`[AIMusicClient] PSYCHOSCORE generated ${notes.length} notes`);
                    return notes;
                }
            }
        } catch (error) {
            console.warn('[AIMusicClient] PSYCHOSCORE failed, falling back to text2midi:', error);
        }

        // Fallback to Text2midi
        try {
            const response = await this.text2midi.generateFromPsychometrics(params);

            if (!response.success || !response.midi_base64) {
                console.warn('[AIMusicClient] Text2midi generation failed:', response.error);
                return null;
            }

            // Parse MIDI binary to note events
            const notes = this.text2midi.parseMidiToNotes(response.midi_base64);

            console.log(`[AIMusicClient] Generated ${notes.length} notes from Text2midi`);
            return notes;

        } catch (error) {
            console.error('[AIMusicClient] Symbolic MIDI generation failed:', error);
            return null;
        }
    }

    /**
     * Generate symbolic MIDI from a direct text prompt
     */
    async generateSymbolicMidiFromPrompt(prompt: string): Promise<ParsedMidiNote[] | null> {
        try {
            const response = await this.text2midi.generate({ prompt });

            if (!response.success || !response.midi_base64) {
                return null;
            }

            return this.text2midi.parseMidiToNotes(response.midi_base64);
        } catch (error) {
            console.error('[AIMusicClient] Prompt-based MIDI generation failed:', error);
            return null;
        }
    }

    /**
     * Get information about available HuggingFace music models for future integration
     */
    static getHuggingFaceModels() {
        return HUGGINGFACE_MUSIC_MODELS;
    }

    /**
     * Get current AI configuration
     */
    getConfig() {
        return {
            openRouter: this.openRouter.getConfig(),
            localLM: USE_LOCAL_LM ? LM_STUDIO_ENDPOINT : null,
            huggingFace: HUGGINGFACE_MUSIC_MODELS,
            text2midi: {
                configured: this.text2midi.isConfigured(),
                model: 'amaai-lab/text2midi'
            },
            psychoscore: {
                configured: this.psychoscore.isReady(),
                endpoint: this.psychoscore.getConfig().endpoint,
                model: 'PSYCHOSCORE v1.0 (57D psychometric→MIDI)'
            }
        };
    }

    /**
     * Check if Text2midi is configured and ready
     */
    isText2midiReady(): boolean {
        return this.text2midi.isConfigured();
    }

    /**
     * Check if PSYCHOSCORE is configured and ready (highest priority)
     */
    isPsychoscoreReady(): boolean {
        return this.psychoscore.isReady();
    }

    /**
     * Generate symbolic MIDI from PSYCHOSCORE (highest priority AI path)
     * Uses custom 57-dimension psychometric input.
     */
    async generateFromPsychoscore(params: PsychometricTextParams): Promise<ArrayBuffer | null> {
        if (!this.psychoscore.isReady()) {
            console.warn('[AIMusicClient] PSYCHOSCORE not ready, skipping');
            return null;
        }

        try {
            // Convert PsychometricTextParams to PsychoscoreRequest
            const request: PsychoscoreRequest = {
                rsi: params.rsi,
                trauma: params.trauma,
                entropy: params.entropy,
                key: params.key,
                mode: params.mode,
                tempo: params.tempo,
                max_bars: 32,
                temperature: 0.8,
            };

            const midiBuffer = await this.psychoscore.generateMidi(request);

            if (midiBuffer) {
                console.log(`[AIMusicClient] PSYCHOSCORE generated ${midiBuffer.byteLength} bytes`);
            }

            return midiBuffer;
        } catch (error) {
            console.error('[AIMusicClient] PSYCHOSCORE generation failed:', error);
            return null;
        }
    }
}


