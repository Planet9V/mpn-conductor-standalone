
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { AIMusicClient } from '../ai_music_client';
import { HUGGINGFACE_MUSIC_MODELS } from '../openrouter_client';

// Mock OpenRouterClient to avoid real calls
vi.mock('../openrouter_client', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../openrouter_client')>();
    return {
        ...actual,
        OpenRouterClient: class {
            static instance: any;
            static getInstance() {
                if (!this.instance) this.instance = new this();
                return this.instance;
            }
            createCompletion = vi.fn();
            getConfig = () => ({});
            constructor() { }
        }
    };
});

describe('AIMusicClient', () => {
    let client: AIMusicClient;

    beforeEach(() => {
        // Reset singleton (if possible, but getInstance is static)
        // Accessing private instance via 'any' hack if needed, or just relying on getInstance
        client = AIMusicClient.getInstance();

        // Mock global fetch
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return null for generateAudio if no API key is set', async () => {
        // Unset env var
        vi.stubEnv('HUGGINGFACE_API_KEY', '');

        const result = await client.generateAudio('test prompt');
        expect(result).toBeNull();
        // expect(global.fetch).not.toHaveBeenCalled(); // Actually it logs warn, doesn't fetch
    });

    it('should call HuggingFace API with correct parameters when key is available', async () => {
        vi.stubEnv('HUGGINGFACE_API_KEY', 'hf_mock_key');

        const mockBuffer = new ArrayBuffer(8);
        (global.fetch as any).mockResolvedValue({
            ok: true,
            arrayBuffer: async () => mockBuffer
        });

        const result = await client.generateAudio('epic orchestral build', 5);

        expect(result).toBe(mockBuffer);
        expect(global.fetch).toHaveBeenCalledWith(
            HUGGINGFACE_MUSIC_MODELS.musicGenSmall.endpoint,
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Authorization': 'Bearer hf_mock_key',
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    inputs: 'epic orchestral build',
                    parameters: { duration_seconds: 5 }
                })
            })
        );
    });

    it('should handle API errors gracefully', async () => {
        vi.stubEnv('HUGGINGFACE_API_KEY', 'hf_mock_key');

        (global.fetch as any).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error'
        });

        const result = await client.generateAudio('fail test');
        expect(result).toBeNull();
    });
});
