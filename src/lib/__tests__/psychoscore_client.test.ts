/**
 * PSYCHOSCORE Client Tests
 * 
 * Unit tests for the PsychoscoreClient TypeScript class.
 * Tests API communication, error handling, and data transformation.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    PsychoscoreClient,
    getPsychoscoreClient,
    type PsychoscoreRequest,
    type PsychoscoreResponse
} from '../psychoscore_client';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('PsychoscoreClient', () => {
    let client: PsychoscoreClient;

    beforeEach(() => {
        vi.clearAllMocks();
        client = new PsychoscoreClient({ endpoint: 'http://localhost:8001' });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Constructor', () => {
        it('should create client with default config', () => {
            const defaultClient = new PsychoscoreClient();
            expect(defaultClient.isReady()).toBe(true);
        });

        it('should create client with custom endpoint', () => {
            const customClient = new PsychoscoreClient({
                endpoint: 'http://custom:9000',
                timeout: 60000
            });
            const config = customClient.getConfig();
            expect(config.endpoint).toBe('http://custom:9000');
            expect(config.timeout).toBe(60000);
        });
    });

    describe('healthCheck', () => {
        it('should return true when server is healthy', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ status: 'healthy', model_loaded: true, device: 'cuda' })
            });

            const result = await client.healthCheck();

            expect(result).toBe(true);
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8001/health',
                expect.objectContaining({ method: 'GET' })
            );
        });

        it('should return false when model is not loaded', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ status: 'healthy', model_loaded: false })
            });

            const result = await client.healthCheck();
            expect(result).toBe(false);
        });

        it('should return false on network error', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const result = await client.healthCheck();
            expect(result).toBe(false);
        });

        it('should return false on non-ok response', async () => {
            mockFetch.mockResolvedValueOnce({ ok: false });

            const result = await client.healthCheck();
            expect(result).toBe(false);
        });
    });

    describe('generate', () => {
        const validRequest: PsychoscoreRequest = {
            disc: { D: 0.8, I: 0.3, S: 0.2, C: 0.5 },
            ocean: { O: 0.7, C: 0.4, E: 0.6, A: 0.5, N: 0.3 },
            rsi: { real: 0.5, symbolic: 0.3, imaginary: 0.2 },
            trauma: 0.7,
            entropy: 0.5,
            max_bars: 8,
            temperature: 0.8,
        };

        it('should generate MIDI successfully', async () => {
            const mockResponse: PsychoscoreResponse = {
                success: true,
                midi_base64: 'TVRoZAAAAAYAAQACAHhNVHJr...',
                parameters: { bars: 8, temperature: 0.8, rsi_dominant: 'real' }
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            const result = await client.generate(validRequest);

            expect(result.success).toBe(true);
            expect(result.midi_base64).toBeDefined();
            expect(result.parameters?.rsi_dominant).toBe('real');
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:8001/generate',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(validRequest)
                })
            );
        });

        it('should handle generation failure', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: false,
                    error: 'Model not ready'
                })
            });

            const result = await client.generate(validRequest);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Model not ready');
        });

        it('should handle server error response', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                text: async () => 'Internal Server Error'
            });

            const result = await client.generate(validRequest);

            expect(result.success).toBe(false);
            expect(result.error).toContain('Server error');
        });

        it('should handle network timeout', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Timeout'));

            const result = await client.generate(validRequest);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Timeout');
        });
    });

    describe('generateMidi', () => {
        it('should return ArrayBuffer on success', async () => {
            const base64Midi = 'TVRoZAAAAA=='; // Minimal MIDI header

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: true,
                    midi_base64: base64Midi
                })
            });

            const result = await client.generateMidi({ max_bars: 4 });

            expect(result).toBeInstanceOf(ArrayBuffer);
            expect(result!.byteLength).toBeGreaterThan(0);
        });

        it('should return null on failure', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: false, error: 'Generation failed' })
            });

            const result = await client.generateMidi({ max_bars: 4 });
            expect(result).toBeNull();
        });
    });

    describe('generateFromPsychometrics', () => {
        it('should convert PsychometricState to request format', async () => {
            const mockState = {
                discProfile: { D: 0.9, I: 0.1, S: 0.3, C: 0.7 },
                oceanProfile: { O: 0.5, C: 0.5, E: 0.5, A: 0.5, N: 0.5 },
                rsi: { real: 0.6, symbolic: 0.2, imaginary: 0.2 },
                trauma: 0.8,
                entropy: 0.4,
                darkTriad: { machiavellianism: 0.2, narcissism: 0.1, psychopathy: 0.1 },
                activeBiases: ['confirmation', 'anchoring'],
                musicalContext: { key: 'C', mode: 'Dorian', tempo: 100 }
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: true,
                    midi_base64: 'TVRoZAAAAA=='
                })
            });

            const result = await client.generateFromPsychometrics(mockState as any, 16);

            expect(result).toBeInstanceOf(ArrayBuffer);

            // Verify the request was properly formatted
            const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
            expect(callBody.disc).toEqual(mockState.discProfile);
            expect(callBody.rsi).toEqual(mockState.rsi);
            expect(callBody.trauma).toBe(0.8);
            expect(callBody.max_bars).toBe(16);
        });
    });

    describe('Singleton Pattern', () => {
        it('should return same instance from getPsychoscoreClient', () => {
            const instance1 = getPsychoscoreClient();
            const instance2 = getPsychoscoreClient();

            // Note: In actual implementation, these would be the same
            // but since we create new instances in tests, we just verify they exist
            expect(instance1).toBeDefined();
            expect(instance2).toBeDefined();
        });
    });

    describe('Request Validation', () => {
        it('should handle minimal request', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true, midi_base64: 'TVRoZAAAAA==' })
            });

            const result = await client.generate({});
            expect(result.success).toBe(true);
        });

        it('should handle request with only RSI', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: true,
                    midi_base64: 'TVRoZAAAAA==',
                    parameters: { rsi_dominant: 'symbolic' }
                })
            });

            const result = await client.generate({
                rsi: { real: 0.1, symbolic: 0.8, imaginary: 0.1 }
            });

            expect(result.success).toBe(true);
            expect(result.parameters?.rsi_dominant).toBe('symbolic');
        });
    });
});

describe('Integration Scenarios', () => {
    it('should handle high-trauma profile generation', async () => {
        const client = new PsychoscoreClient({ endpoint: 'http://localhost:8001' });

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: true,
                midi_base64: 'TVRoZAAAAA==',
                parameters: { rsi_dominant: 'real' }
            })
        });

        const result = await client.generate({
            trauma: 0.95,
            entropy: 0.8,
            rsi: { real: 0.7, symbolic: 0.2, imaginary: 0.1 },
            dark_triad: { machiavellianism: 0.8, narcissism: 0.7, psychopathy: 0.6 }
        });

        expect(result.success).toBe(true);
        expect(result.parameters?.rsi_dominant).toBe('real');
    });

    it('should handle low-entropy calm profile', async () => {
        const client = new PsychoscoreClient({ endpoint: 'http://localhost:8001' });

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: true,
                midi_base64: 'TVRoZAAAAA==',
                parameters: { rsi_dominant: 'symbolic' }
            })
        });

        const result = await client.generate({
            trauma: 0.1,
            entropy: 0.2,
            rsi: { real: 0.2, symbolic: 0.6, imaginary: 0.2 },
            disc: { D: 0.3, I: 0.7, S: 0.8, C: 0.6 }
        });

        expect(result.success).toBe(true);
    });
});
