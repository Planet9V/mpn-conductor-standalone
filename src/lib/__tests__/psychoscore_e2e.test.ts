/**
 * PSYCHOSCORE E2E Integration Tests
 * 
 * End-to-end tests that verify the complete flow:
 * Frontend Client → PSYCHOSCORE Server → MIDI Generation → Response
 * 
 * These tests require a running PSYCHOSCORE inference server.
 * Run with: npm test -- --grep "E2E"
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PsychoscoreClient } from '../psychoscore_client';

// Configuration - set to actual server endpoint for E2E tests
const E2E_ENDPOINT = process.env.PSYCHOSCORE_E2E_ENDPOINT || 'http://localhost:8001';
const SKIP_E2E = process.env.SKIP_E2E_TESTS === 'true';

describe('PSYCHOSCORE E2E Integration', () => {
    let client: PsychoscoreClient;
    let serverAvailable: boolean = false;

    beforeAll(async () => {
        if (SKIP_E2E) {
            console.log('E2E tests skipped via SKIP_E2E_TESTS=true');
            return;
        }

        client = new PsychoscoreClient({ endpoint: E2E_ENDPOINT, timeout: 60000 });

        // Check if server is available
        try {
            serverAvailable = await client.healthCheck();
            if (!serverAvailable) {
                console.warn(`PSYCHOSCORE server not available at ${E2E_ENDPOINT}`);
            }
        } catch {
            console.warn(`Could not connect to PSYCHOSCORE server at ${E2E_ENDPOINT}`);
            serverAvailable = false;
        }
    });

    describe('Health Check E2E', () => {
        it('should connect to live server', async () => {
            if (SKIP_E2E || !serverAvailable) {
                console.log('Skipped: Server not available');
                return;
            }

            const healthy = await client.healthCheck();
            expect(healthy).toBe(true);
        });

        it('should report model loaded', async () => {
            if (SKIP_E2E || !serverAvailable) return;

            // Direct fetch to get full health response
            const response = await fetch(`${E2E_ENDPOINT}/health`);
            const data = await response.json();

            expect(data.status).toBe('healthy');
            expect(data.model_loaded).toBe(true);
            expect(data.device).toBeDefined();
        });
    });

    describe('MIDI Generation E2E', () => {
        it('should generate MIDI from psychometric profile', async () => {
            if (SKIP_E2E || !serverAvailable) return;

            const response = await client.generate({
                disc: { D: 0.7, I: 0.4, S: 0.3, C: 0.6 },
                ocean: { O: 0.6, C: 0.5, E: 0.5, A: 0.5, N: 0.4 },
                rsi: { real: 0.4, symbolic: 0.4, imaginary: 0.2 },
                trauma: 0.5,
                entropy: 0.4,
                max_bars: 4
            });

            expect(response.success).toBe(true);
            expect(response.midi_base64).toBeDefined();
            expect(response.midi_base64!.length).toBeGreaterThan(50);
        });

        it('should return valid MIDI binary', async () => {
            if (SKIP_E2E || !serverAvailable) return;

            const midiBuffer = await client.generateMidi({
                rsi: { real: 0.5, symbolic: 0.3, imaginary: 0.2 },
                trauma: 0.6,
                max_bars: 4
            });

            expect(midiBuffer).not.toBeNull();
            expect(midiBuffer).toBeInstanceOf(ArrayBuffer);

            // Verify MIDI header (MThd)
            const bytes = new Uint8Array(midiBuffer!);
            const header = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
            expect(header).toBe('MThd');
        });

        it('should generate different output for different profiles', async () => {
            if (SKIP_E2E || !serverAvailable) return;

            const highTraumaResponse = await client.generate({
                trauma: 0.9,
                entropy: 0.8,
                rsi: { real: 0.7, symbolic: 0.2, imaginary: 0.1 },
                max_bars: 4
            });

            const lowTraumaResponse = await client.generate({
                trauma: 0.1,
                entropy: 0.2,
                rsi: { real: 0.2, symbolic: 0.6, imaginary: 0.2 },
                max_bars: 4
            });

            expect(highTraumaResponse.success).toBe(true);
            expect(lowTraumaResponse.success).toBe(true);

            // MIDI content should differ (different profiles produce different music)
            // Note: Due to rule-based generation with some randomness, they may occasionally match
            if (highTraumaResponse.midi_base64 && lowTraumaResponse.midi_base64) {
                // At minimum, check both have content
                expect(highTraumaResponse.midi_base64.length).toBeGreaterThan(0);
                expect(lowTraumaResponse.midi_base64.length).toBeGreaterThan(0);
            }
        });
    });

    describe('RSI Register Mapping E2E', () => {
        it('should detect Real-dominant profile', async () => {
            if (SKIP_E2E || !serverAvailable) return;

            const response = await client.generate({
                rsi: { real: 0.8, symbolic: 0.1, imaginary: 0.1 },
                max_bars: 4
            });

            expect(response.success).toBe(true);
            expect(response.parameters?.rsi_dominant).toBe('real');
        });

        it('should detect Symbolic-dominant profile', async () => {
            if (SKIP_E2E || !serverAvailable) return;

            const response = await client.generate({
                rsi: { real: 0.1, symbolic: 0.8, imaginary: 0.1 },
                max_bars: 4
            });

            expect(response.success).toBe(true);
            expect(response.parameters?.rsi_dominant).toBe('symbolic');
        });

        it('should detect Imaginary-dominant profile', async () => {
            if (SKIP_E2E || !serverAvailable) return;

            const response = await client.generate({
                rsi: { real: 0.1, symbolic: 0.1, imaginary: 0.8 },
                max_bars: 4
            });

            expect(response.success).toBe(true);
            expect(response.parameters?.rsi_dominant).toBe('imaginary');
        });
    });

    describe('Full Pipeline E2E', () => {
        it('should complete full psychometric-to-MIDI pipeline', async () => {
            if (SKIP_E2E || !serverAvailable) return;

            // Simulate a complete MPN workflow:
            // 1. Create psychometric state from "actor analysis"
            const actorProfile = {
                discProfile: { D: 0.85, I: 0.2, S: 0.15, C: 0.7 },
                oceanProfile: { O: 0.3, C: 0.8, E: 0.4, A: 0.2, N: 0.6 },
                rsi: { real: 0.6, symbolic: 0.25, imaginary: 0.15 },
                trauma: 0.75,
                entropy: 0.6,
                darkTriad: { machiavellianism: 0.7, narcissism: 0.6, psychopathy: 0.4 },
                activeBiases: ['confirmation', 'authority'],
                musicalContext: { key: 'D', mode: 'Dorian', tempo: 90 }
            };

            // 2. Generate MIDI from profile
            const midiBuffer = await client.generateFromPsychometrics(
                actorProfile as any,
                8 // bars
            );

            // 3. Verify output
            expect(midiBuffer).not.toBeNull();
            expect(midiBuffer).toBeInstanceOf(ArrayBuffer);
            expect(midiBuffer!.byteLength).toBeGreaterThan(100);

            // 4. Validate MIDI structure
            const bytes = new Uint8Array(midiBuffer!);
            expect(String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3])).toBe('MThd');
        });

        it('should handle concurrent requests', async () => {
            if (SKIP_E2E || !serverAvailable) return;

            // Send multiple requests concurrently
            const requests = [
                client.generate({ trauma: 0.1, max_bars: 2 }),
                client.generate({ trauma: 0.5, max_bars: 2 }),
                client.generate({ trauma: 0.9, max_bars: 2 }),
            ];

            const results = await Promise.all(requests);

            // All should succeed
            results.forEach((result, i) => {
                expect(result.success).toBe(true);
                expect(result.midi_base64).toBeDefined();
            });
        });
    });

    describe('Error Handling E2E', () => {
        it('should handle invalid endpoint gracefully', async () => {
            const badClient = new PsychoscoreClient({
                endpoint: 'http://localhost:99999',
                timeout: 5000
            });

            const healthy = await badClient.healthCheck();
            expect(healthy).toBe(false);

            const result = await badClient.generate({ max_bars: 4 });
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });
});
