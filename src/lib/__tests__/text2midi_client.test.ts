/**
 * Text2midi Client Test Suite
 * 
 * Tests the Text2midi client for HuggingFace symbolic MIDI generation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    psychometricsToText2midiPrompt,
    Text2midiClient,
    type PsychometricTextParams
} from '../text2midi_client';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Text2midi Client', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('psychometricsToText2midiPrompt', () => {
        it('should generate ethereal prompt for high imaginary RSI', () => {
            const params: PsychometricTextParams = {
                trauma: 0.3,
                entropy: 0.3,
                rsi: { real: 0.1, symbolic: 0.2, imaginary: 0.7 },
                musicalContext: { key: 'D', mode: 'minor' }
            };

            const prompt = psychometricsToText2midiPrompt(params);

            expect(prompt).toContain('ethereal');
            expect(prompt).toContain('dreamlike');
            expect(prompt).toContain('D minor');
        });

        it('should generate grounded prompt for high real RSI', () => {
            const params: PsychometricTextParams = {
                trauma: 0.3,
                entropy: 0.3,
                rsi: { real: 0.7, symbolic: 0.2, imaginary: 0.1 },
                musicalContext: { key: 'C', mode: 'major' }
            };

            const prompt = psychometricsToText2midiPrompt(params);

            expect(prompt).toContain('grounded');
            expect(prompt).toContain('earthy');
        });

        it('should generate structured prompt for high symbolic RSI', () => {
            const params: PsychometricTextParams = {
                trauma: 0.3,
                entropy: 0.3,
                rsi: { real: 0.1, symbolic: 0.7, imaginary: 0.2 },
                musicalContext: { key: 'G', mode: 'major' }
            };

            const prompt = psychometricsToText2midiPrompt(params);

            expect(prompt).toContain('structured');
            expect(prompt).toContain('classical');
        });

        it('should indicate intense drama for high trauma', () => {
            const params: PsychometricTextParams = {
                trauma: 0.85,
                entropy: 0.3,
                rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 },
                musicalContext: { key: 'E', mode: 'minor' }
            };

            const prompt = psychometricsToText2midiPrompt(params);

            expect(prompt).toContain('intense');
            expect(prompt).toContain('dramatic');
        });

        it('should indicate calm for low trauma', () => {
            const params: PsychometricTextParams = {
                trauma: 0.1,
                entropy: 0.3,
                rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 },
                musicalContext: { key: 'F', mode: 'major' }
            };

            const prompt = psychometricsToText2midiPrompt(params);

            expect(prompt).toContain('calm');
            expect(prompt).toContain('peaceful');
        });

        it('should indicate chaos for high entropy', () => {
            const params: PsychometricTextParams = {
                trauma: 0.3,
                entropy: 0.85,
                rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 },
                musicalContext: { key: 'Bb', mode: 'minor' }
            };

            const prompt = psychometricsToText2midiPrompt(params);

            expect(prompt).toContain('chaotic');
            expect(prompt).toContain('experimental');
        });

        it('should include tempo descriptor when provided', () => {
            const params: PsychometricTextParams = {
                trauma: 0.3,
                entropy: 0.3,
                rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 },
                musicalContext: { key: 'A', mode: 'minor', tempo: 160 }
            };

            const prompt = psychometricsToText2midiPrompt(params);

            expect(prompt).toContain('fast tempo');
            expect(prompt).toContain('160 BPM');
        });
    });

    describe('Text2midiClient', () => {
        it('should be a singleton', () => {
            const instance1 = Text2midiClient.getInstance();
            const instance2 = Text2midiClient.getInstance();

            expect(instance1).toBe(instance2);
        });

        it('should report unconfigured without API key', () => {
            const client = Text2midiClient.getInstance();
            // In test environment, no API key is set
            expect(client.isConfigured()).toBe(false);
        });

        it('should parse valid MIDI header', () => {
            const client = Text2midiClient.getInstance();

            // Create a minimal valid MIDI file (MThd header only)
            // MThd = 4D 54 68 64
            const midiBytes = new Uint8Array([
                0x4D, 0x54, 0x68, 0x64, // "MThd"
                0x00, 0x00, 0x00, 0x06, // Header length = 6
                0x00, 0x01, // Format type 1
                0x00, 0x01, // 1 track
                0x00, 0x60, // 96 ticks per beat
            ]);

            const base64 = btoa(String.fromCharCode(...midiBytes));
            const notes = client.parseMidiToNotes(base64);

            // Should return empty array for header-only MIDI
            expect(notes).toEqual([]);
        });

        it('should return empty array for invalid MIDI', () => {
            const client = Text2midiClient.getInstance();

            const notes = client.parseMidiToNotes('not-valid-base64-midi');

            expect(notes).toEqual([]);
        });
    });

    describe('API Integration (Mocked)', () => {
        it('should call HuggingFace API with correct format', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({
                    midi: 'TVRoZA=='  // "MThd" in base64
                })
            });

            const client = Text2midiClient.getInstance();
            // Override API key for test
            (client as any).apiKey = 'test-key';

            const result = await client.generate({ prompt: 'test prompt' });

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('huggingface.co'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer test-key'
                    })
                })
            );
        });

        it('should handle API errors gracefully', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const client = Text2midiClient.getInstance();

            const result = await client.generate({ prompt: 'test' });

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });
});
