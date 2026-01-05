/**
 * PSYCHOSCORE Client
 * 
 * TypeScript client for interacting with the PSYCHOSCORE inference server.
 * Generates MIDI from comprehensive psychometric profiles.
 * 
 * @see {@link ml/psychoscore/inference/server.py} for server implementation
 */

import type { PsychometricState } from './types';

// === TYPE DEFINITIONS ===

export interface DISCProfile {
    D: number;  // Dominance (0-1)
    I: number;  // Influence (0-1)
    S: number;  // Steadiness (0-1)
    C: number;  // Compliance (0-1)
}

export interface OCEANProfile {
    O: number;  // Openness (0-1)
    C: number;  // Conscientiousness (0-1)
    E: number;  // Extraversion (0-1)
    A: number;  // Agreeableness (0-1)
    N: number;  // Neuroticism (0-1)
}

export interface RSIProfile {
    real: number;       // Real register (0-1, sum to 1)
    symbolic: number;   // Symbolic register (0-1)
    imaginary: number;  // Imaginary register (0-1)
}

export interface DarkTriadProfile {
    machiavellianism: number;  // (0-1)
    narcissism: number;        // (0-1)
    psychopathy: number;       // (0-1)
}

export interface PhysicsState {
    hamiltonian_energy: number;      // (0-1)
    ising_spin: '+' | '-';           // Spin state
    granovetter_threshold: number;   // (0-1)
    lyapunov_exponent: number;       // (-0.5 to 0.5)
}

export interface PsychoscoreRequest {
    disc?: DISCProfile;
    ocean?: OCEANProfile;
    rsi?: RSIProfile;
    trauma?: number;                 // (0-1)
    entropy?: number;                // (0-1)
    dark_triad?: DarkTriadProfile;
    cognitive_biases?: string[];     // List of active biases
    physics?: PhysicsState;

    // Musical context (optional)
    key?: string;                    // e.g., 'C', 'D', 'Eb'
    mode?: string;                   // e.g., 'Ionian', 'Dorian'
    tempo?: number;                  // BPM (40-200)

    // Generation settings
    max_bars?: number;               // (1-128)
    temperature?: number;            // (0.1-2.0)
    top_p?: number;                  // (0.1-1.0)
}

export interface PsychoscoreResponse {
    success: boolean;
    midi_base64?: string;            // Base64-encoded MIDI file
    parameters?: {
        bars: number;
        temperature: number;
        rsi_dominant: string;
    };
    error?: string;
}

// === CLIENT CONFIGURATION ===

export interface PsychoscoreClientConfig {
    endpoint?: string;
    timeout?: number;
}

const DEFAULT_CONFIG: PsychoscoreClientConfig = {
    endpoint: process.env.NEXT_PUBLIC_PSYCHOSCORE_ENDPOINT || 'http://localhost:8001',
    timeout: 30000,
};

// === CLIENT IMPLEMENTATION ===

export class PsychoscoreClient {
    private endpoint: string;
    private timeout: number;
    private isConfigured: boolean;

    constructor(config: PsychoscoreClientConfig = {}) {
        const mergedConfig = { ...DEFAULT_CONFIG, ...config };
        this.endpoint = mergedConfig.endpoint!;
        this.timeout = mergedConfig.timeout!;
        this.isConfigured = !!this.endpoint;
    }

    /**
     * Check if PSYCHOSCORE server is available
     */
    async healthCheck(): Promise<boolean> {
        if (!this.isConfigured) return false;

        try {
            const response = await fetch(`${this.endpoint}/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000),
            });

            if (!response.ok) return false;

            const data = await response.json();
            return data.model_loaded === true;
        } catch {
            return false;
        }
    }

    /**
     * Generate MIDI from psychometric profile
     */
    async generate(request: PsychoscoreRequest): Promise<PsychoscoreResponse> {
        if (!this.isConfigured) {
            return { success: false, error: 'PSYCHOSCORE client not configured' };
        }

        try {
            const response = await fetch(`${this.endpoint}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
                signal: AbortSignal.timeout(this.timeout),
            });

            if (!response.ok) {
                const error = await response.text();
                return { success: false, error: `Server error: ${error}` };
            }

            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Generate MIDI and return as ArrayBuffer (for direct playback)
     */
    async generateMidi(request: PsychoscoreRequest): Promise<ArrayBuffer | null> {
        const response = await this.generate(request);

        if (!response.success || !response.midi_base64) {
            console.error('PSYCHOSCORE generation failed:', response.error);
            return null;
        }

        // Decode base64 to ArrayBuffer
        const binaryString = atob(response.midi_base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        return bytes.buffer;
    }

    /**
     * Generate from MPN PsychometricState (adapter method)
     */
    async generateFromPsychometrics(
        state: PsychometricState,
        maxBars: number = 32
    ): Promise<ArrayBuffer | null> {
        // Convert MPN PsychometricState to PsychoscoreRequest
        const request: PsychoscoreRequest = {
            disc: state.discProfile,
            ocean: state.oceanProfile,
            rsi: state.rsi,
            trauma: state.trauma ?? 0.3,
            entropy: state.entropy ?? 0.3,
            dark_triad: state.darkTriad,
            cognitive_biases: state.activeBiases ?? [],
            physics: state.physicsState,
            key: state.musicalContext?.key,
            mode: state.musicalContext?.mode,
            tempo: state.musicalContext?.tempo,
            max_bars: maxBars,
        };

        return this.generateMidi(request);
    }

    /**
     * Check if client is ready for use
     */
    isReady(): boolean {
        return this.isConfigured;
    }

    /**
     * Get client configuration
     */
    getConfig() {
        return {
            endpoint: this.endpoint,
            configured: this.isConfigured,
            timeout: this.timeout,
        };
    }
}

// === SINGLETON INSTANCE ===

let psychoscoreInstance: PsychoscoreClient | null = null;

export function getPsychoscoreClient(config?: PsychoscoreClientConfig): PsychoscoreClient {
    if (!psychoscoreInstance) {
        psychoscoreInstance = new PsychoscoreClient(config);
    }
    return psychoscoreInstance;
}

// === EXPORTS ===

export default PsychoscoreClient;
