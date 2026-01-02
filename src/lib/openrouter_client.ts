/**
 * OpenRouter AI Client for MPN (Musical Psychometric Notation)
 * 
 * Model Configuration:
 * - Primary: google/gemini-3-flash-preview (fast, high-quality)
 * - Fallback: google/gemini-2.5-flash-lite (lightweight backup)
 * - Embeddings: google/gemini-embedding-001
 * 
 * HuggingFace Music Models (Future Integration):
 * - facebook/musicgen-large (Music generation from text)
 * - facebook/musicgen-melody (Melody-conditioned generation)
 * - meta-llama/Llama-2-70b (Fine-tuned for music theory analysis)
 * - Custom MPN models pending deployment
 * 
 * @see https://openrouter.ai/docs
 */

export interface OpenRouterConfig {
    apiKey: string;
    baseUrl?: string;
    primaryModel: string;
    fallbackModel: string;
    embeddingModel: string;
}

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface CompletionOptions {
    messages: ChatMessage[];
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    stream?: boolean;
}

export interface CompletionResponse {
    id: string;
    model: string;
    content: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface EmbeddingResponse {
    embedding: number[];
    model: string;
}

// Default configuration for MPN applications
export const MPN_AI_CONFIG: OpenRouterConfig = {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    baseUrl: 'https://openrouter.ai/api/v1',
    primaryModel: 'google/gemini-3-flash-preview',
    fallbackModel: 'google/gemini-2.5-flash-lite',
    embeddingModel: 'google/gemini-embedding-001',
};

/**
 * HuggingFace Music Models Reference
 * 
 * AUDIO GENERATION (HuggingFace Inference API Compatible):
 * These can be called via HF Inference API endpoints directly.
 * 
 * MIDI/SYMBOLIC GENERATION (Requires Local Hosting):
 * These require local deployment with custom tokenizers and trust_remote_code=True.
 */
export const HUGGINGFACE_MUSIC_MODELS = {
    // ===== AUDIO GENERATION (API Accessible) =====
    musicGenLarge: {
        id: 'facebook/musicgen-large',
        type: 'audio',
        apiAccessible: true,
        description: 'High-quality text-to-music audio generation (1.5B params)',
        useCase: 'Generate ambient background audio for MPN visualizations',
        endpoint: 'https://api-inference.huggingface.co/models/facebook/musicgen-large',
        example: { inputs: 'dramatic orchestral tension building to crisis' },
    },
    musicGenSmall: {
        id: 'facebook/musicgen-small',
        type: 'audio',
        apiAccessible: true,
        description: 'Fast text-to-music audio generation (300M params)',
        useCase: 'Quick audio previews for real-time score playback',
        endpoint: 'https://api-inference.huggingface.co/models/facebook/musicgen-small',
    },
    musicGenMelody: {
        id: 'facebook/musicgen-melody',
        type: 'audio',
        apiAccessible: true,
        description: 'Melody-conditioned music generation',
        useCase: 'Generate variations on detected leitmotifs from MPN analysis',
    },

    // ===== MIDI/SYMBOLIC GENERATION (Local Hosting Required) =====
    ariaMediumBase: {
        id: 'loubb/aria-medium-base',
        type: 'midi',
        apiAccessible: false,
        description: 'LLaMA 3.2-based (1B params) autoregressive MIDI generation for solo piano',
        useCase: 'Generate piano MIDI continuations from psychometric state',
        requirements: 'pip install git+https://github.com/EleutherAI/aria-utils.git, trust_remote_code=True',
    },
    giantMusicTransformer: {
        id: 'asigalov61/Giant-Music-Transformer',
        type: 'midi',
        apiAccessible: false,
        description: 'Transformer for full MIDI generation using Los Angeles MIDI Dataset',
        useCase: 'Complex multi-instrument MIDI score generation',
    },
    midiModel: {
        id: 'skytnt/midi-model',
        type: 'midi',
        apiAccessible: false,
        description: 'General-purpose MIDI generation model',
        useCase: 'Symbolic music output for MPN conductor scores',
    },
    midiModelMedium: {
        id: 'skytnt/midi-model-tv2o-medium',
        type: 'midi',
        apiAccessible: false,
        description: 'Medium-sized MIDI generation transformer',
        useCase: 'Balanced quality/speed MIDI generation',
    },
    rwkvMidiPiano: {
        id: 'brianflakes/rwkv-midi-piano',
        type: 'midi',
        apiAccessible: false,
        description: 'RWKV architecture (0.1B params) for piano MIDI',
        useCase: 'Lightweight piano-only MIDI for Real register expressions',
    },
    heptabitMusicTransformer: {
        id: 'asigalov61/Heptabit-Music-Transformer',
        type: 'midi',
        apiAccessible: false,
        description: 'Compact transformer for symbolic music generation',
        useCase: 'Low-latency MIDI generation for real-time MPN playback',
    },

    // ===== AUDIO UNDERSTANDING =====
    whisperLargeV3: {
        id: 'openai/whisper-large-v3',
        type: 'transcription',
        apiAccessible: true,
        description: 'Audio transcription and analysis',
        useCase: 'Analyze recorded meetings for psychometric signal extraction',
    },
} as const;

export class OpenRouterClient {
    private config: OpenRouterConfig;
    private static instance: OpenRouterClient | null = null;

    constructor(config: Partial<OpenRouterConfig> = {}) {
        this.config = { ...MPN_AI_CONFIG, ...config };
    }

    static getInstance(): OpenRouterClient {
        if (!OpenRouterClient.instance) {
            OpenRouterClient.instance = new OpenRouterClient();
        }
        return OpenRouterClient.instance;
    }

    /**
     * Create a chat completion using OpenRouter
     * Attempts primary model first, falls back to secondary on failure
     */
    async createCompletion(options: CompletionOptions): Promise<CompletionResponse | null> {
        const models = [this.config.primaryModel, this.config.fallbackModel];

        for (const model of models) {
            try {
                const response = await this.callOpenRouter(model, options);
                if (response) {
                    return response;
                }
            } catch (error) {
                console.warn(`[OpenRouter] Model ${model} failed, trying fallback...`, error);
            }
        }

        console.error('[OpenRouter] All models failed');
        return null;
    }

    private async callOpenRouter(model: string, options: CompletionOptions): Promise<CompletionResponse | null> {
        const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://oxot.io',
                'X-Title': 'AEON MPN Conductor',
            },
            body: JSON.stringify({
                model,
                messages: options.messages,
                temperature: options.temperature ?? 0.7,
                max_tokens: options.maxTokens ?? 1024,
                top_p: options.topP ?? 1,
                stream: options.stream ?? false,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return {
            id: data.id,
            model: data.model,
            content: data.choices?.[0]?.message?.content || '',
            usage: {
                promptTokens: data.usage?.prompt_tokens || 0,
                completionTokens: data.usage?.completion_tokens || 0,
                totalTokens: data.usage?.total_tokens || 0,
            },
        };
    }

    /**
     * Create an embedding using OpenRouter
     */
    async createEmbedding(text: string): Promise<EmbeddingResponse | null> {
        try {
            const response = await fetch(`${this.config.baseUrl}/embeddings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.config.embeddingModel,
                    input: text,
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenRouter embedding error: ${response.status}`);
            }

            const data = await response.json();

            return {
                embedding: data.data?.[0]?.embedding || [],
                model: this.config.embeddingModel,
            };
        } catch (error) {
            console.error('[OpenRouter] Embedding failed:', error);
            return null;
        }
    }

    /**
     * Check if the OpenRouter API is reachable
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(`${this.config.baseUrl}/models`, {
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Get current model configuration
     */
    getConfig(): OpenRouterConfig {
        return { ...this.config };
    }
}

// Export singleton for easy access
export const openRouterClient = OpenRouterClient.getInstance();
