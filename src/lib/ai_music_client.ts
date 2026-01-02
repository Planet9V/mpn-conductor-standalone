/**
 * AI Music Client for MPN (Musical Psychometric Notation)
 * 
 * Uses OpenRouter with Gemini models for production, with local LM Studio fallback for development.
 * 
 * Model Priority:
 * 1. OpenRouter: google/gemini-3-flash-preview (primary)
 * 2. OpenRouter: google/gemini-2.5-flash-lite (fallback)
 * 3. Local LM Studio: scrapegoat-music-stage2 (dev only)
 * 
 * HuggingFace Integration (Planned):
 * - facebook/musicgen-large for actual audio generation
 * - facebook/musicgen-melody for melody-conditioned outputs
 */

import { OpenRouterClient, MPN_AI_CONFIG, HUGGINGFACE_MUSIC_MODELS } from './openrouter_client';

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
    private isLocalConnected: boolean = false;

    private constructor() {
        this.openRouter = new OpenRouterClient(MPN_AI_CONFIG);
    }

    static getInstance(): AIMusicClient {
        if (!AIMusicClient.instance) {
            AIMusicClient.instance = new AIMusicClient();
        }
        return AIMusicClient.instance;
    }

    async checkConnection(): Promise<boolean> {
        // Check OpenRouter first
        const openRouterOk = await this.openRouter.healthCheck();
        if (openRouterOk) return true;

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

        const userPrompt = `
Psychometrics: ${JSON.stringify(params.psychometrics)}
Context: ${JSON.stringify(params.musicalContext)}
Generate a 1-bar melody for ${params.musicalContext.instrument}.
Apply McKenney-Lacan MPN transformation based on the RSI balance.`;

        // Try OpenRouter first
        const response = await this.openRouter.createCompletion({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: params.temperature || 0.7,
            maxTokens: 500,
        });

        if (response?.content) {
            return this.parseAIResponse(response.content);
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
        };
    }
}

