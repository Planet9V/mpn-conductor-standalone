/**
 * MPN Leitmotif Generator Tests
 * Tests for the leitmotif generation and transformation system
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
    generateLeitmotif,
    transformLeitmotif,
    selectTransformation,
    registerLeitmotif,
    getLeitmotif,
    ensureLeitmotif,
    clearLeitmotifRegistry,
    type ActorProfile,
    type Leitmotif,
    type LeitmotifTransformation,
} from '@/components/mpn-lab/leitmotif_generator';

describe('Leitmotif Generator', () => {
    beforeEach(() => {
        clearLeitmotifRegistry();
    });

    describe('generateLeitmotif', () => {
        it('should generate a leitmotif for a Dominance profile', () => {
            const profile: ActorProfile = {
                id: 'test-actor-1',
                name: 'Commander',
                disc: { D: 0.9, I: 0.3, S: 0.2, C: 0.4 },
            };

            const leitmotif = generateLeitmotif(profile);

            expect(leitmotif).toBeDefined();
            expect(leitmotif.pitchClasses.length).toBeGreaterThan(0);
            expect(leitmotif.rhythm.length).toBeGreaterThan(0);
            expect(leitmotif.baseOctave).toBeGreaterThanOrEqual(2);
            expect(leitmotif.baseOctave).toBeLessThanOrEqual(6);
        });

        it('should include actor name in generated leitmotif', () => {
            const profile: ActorProfile = {
                id: 'hamlet',
                name: 'Prince Hamlet',
                disc: { D: 0.5, I: 0.6, S: 0.4, C: 0.7 },
            };

            const leitmotif = generateLeitmotif(profile);

            expect(leitmotif.actorId).toBe(profile.id);
            expect(leitmotif.actorName).toBe(profile.name);
        });

        it('should assign an instrument based on profile', () => {
            const profile: ActorProfile = {
                id: 'high-d',
                name: 'Leader',
                disc: { D: 0.95, I: 0.2, S: 0.1, C: 0.3 },
            };

            const leitmotif = generateLeitmotif(profile);

            expect(leitmotif.instrument).toBeDefined();
            expect(typeof leitmotif.instrument).toBe('string');
        });

        it('should generate unique IDs for leitmotifs', () => {
            const profile1: ActorProfile = { id: 'a1', name: 'Actor 1' };
            const profile2: ActorProfile = { id: 'a2', name: 'Actor 2' };

            const l1 = generateLeitmotif(profile1);
            const l2 = generateLeitmotif(profile2);

            expect(l1.id).toBeDefined();
            expect(l2.id).toBeDefined();
            expect(l1.id).not.toBe(l2.id);
        });
    });

    describe('transformLeitmotif', () => {
        let baseLeitmotif: Leitmotif;

        beforeEach(() => {
            const profile: ActorProfile = { id: 'test', name: 'Test Actor' };
            baseLeitmotif = generateLeitmotif(profile);
        });

        it('should apply inverted transformation', () => {
            const transformed = transformLeitmotif(baseLeitmotif, 'inverted');

            expect(transformed).toBeDefined();
            expect(transformed.currentTransformation).toBe('inverted');
        });

        it('should apply retrograde transformation', () => {
            const transformed = transformLeitmotif(baseLeitmotif, 'retrograde');

            expect(transformed).toBeDefined();
            expect(transformed.currentTransformation).toBe('retrograde');
        });

        it('should apply augmented transformation', () => {
            const transformed = transformLeitmotif(baseLeitmotif, 'augmented');

            expect(transformed).toBeDefined();
            expect(transformed.currentTransformation).toBe('augmented');
        });

        it('should apply diminished transformation', () => {
            const transformed = transformLeitmotif(baseLeitmotif, 'diminished');

            expect(transformed).toBeDefined();
            expect(transformed.currentTransformation).toBe('diminished');
        });

        it('should apply fragmented transformation', () => {
            const transformed = transformLeitmotif(baseLeitmotif, 'fragmented');

            expect(transformed).toBeDefined();
            expect(transformed.currentTransformation).toBe('fragmented');
        });

        it('should preserve original leitmotif with original transformation', () => {
            const transformed = transformLeitmotif(baseLeitmotif, 'original');

            expect(transformed.currentTransformation).toBe('original');
        });
    });

    describe('selectTransformation', () => {
        it('should select original for low trauma/entropy', () => {
            const transformation = selectTransformation(0.1, 0.1, { real: 0.3, symbolic: 0.4, imaginary: 0.3 });

            expect(transformation).toBe('original');
        });

        it('should select fragmented for very high trauma', () => {
            const transformation = selectTransformation(0.9, 0.5, { real: 0.5, symbolic: 0.3, imaginary: 0.2 });

            expect(transformation).toBe('fragmented');
        });

        it('should select inverted for high trauma', () => {
            const transformation = selectTransformation(0.7, 0.3, { real: 0.3, symbolic: 0.4, imaginary: 0.3 });

            expect(transformation).toBe('inverted');
        });

        it('should select retrograde for very high entropy', () => {
            const transformation = selectTransformation(0.3, 0.9, { real: 0.3, symbolic: 0.4, imaginary: 0.3 });

            expect(transformation).toBe('retrograde');
        });

        it('should return valid transformation type', () => {
            const validTransformations: LeitmotifTransformation[] = [
                'original', 'inverted', 'retrograde', 'augmented',
                'diminished', 'fragmented', 'chromatic_descent', 'whole_tone_ascent'
            ];

            const transformation = selectTransformation(0.5, 0.5, { real: 0.33, symbolic: 0.33, imaginary: 0.34 });

            expect(validTransformations).toContain(transformation);
        });
    });

    describe('Registry Functions', () => {
        it('should register a leitmotif', () => {
            const profile: ActorProfile = { id: 'reg-test', name: 'Registry Test' };
            const leitmotif = registerLeitmotif(profile);

            expect(leitmotif).toBeDefined();
            expect(leitmotif.actorId).toBe(profile.id);
        });

        it('should retrieve registered leitmotif', () => {
            const profile: ActorProfile = { id: 'retrieve-test', name: 'Retrieve Test' };
            registerLeitmotif(profile);

            const retrieved = getLeitmotif(profile.id);

            expect(retrieved).toBeDefined();
            expect(retrieved?.actorId).toBe(profile.id);
        });

        it('should return undefined for unregistered actor', () => {
            const retrieved = getLeitmotif('non-existent-id');

            expect(retrieved).toBeUndefined();
        });

        it('should clear registry', () => {
            const profile: ActorProfile = { id: 'clear-test', name: 'Clear Test' };
            registerLeitmotif(profile);

            clearLeitmotifRegistry();

            const retrieved = getLeitmotif(profile.id);
            expect(retrieved).toBeUndefined();
        });

        it('should ensure leitmotif exists or create new', () => {
            const profile: ActorProfile = { id: 'ensure-test', name: 'Ensure Test' };

            const ensured = ensureLeitmotif(profile);
            expect(ensured).toBeDefined();

            // Second call should return same leitmotif
            const ensured2 = ensureLeitmotif(profile);
            expect(ensured2.id).toBe(ensured.id);
        });
    });
});

describe('Pitch Class Validation', () => {
    it('should only generate valid pitch classes (0-11)', () => {
        const profiles: ActorProfile[] = [
            { id: '1', name: 'A', disc: { D: 1, I: 0, S: 0, C: 0 } },
            { id: '2', name: 'B', disc: { D: 0, I: 1, S: 0, C: 0 } },
            { id: '3', name: 'C', disc: { D: 0, I: 0, S: 1, C: 0 } },
            { id: '4', name: 'D', disc: { D: 0, I: 0, S: 0, C: 1 } },
        ];

        profiles.forEach((profile) => {
            const leitmotif = generateLeitmotif(profile);
            leitmotif.pitchClasses.forEach((pc) => {
                expect(pc).toBeGreaterThanOrEqual(0);
                expect(pc).toBeLessThanOrEqual(11);
            });
        });
    });

    it('should generate valid rhythm values (positive numbers)', () => {
        const profile: ActorProfile = {
            id: 'rhythm-test',
            name: 'Test',
            disc: { D: 0.5, I: 0.5, S: 0.5, C: 0.5 },
        };

        const leitmotif = generateLeitmotif(profile);

        leitmotif.rhythm.forEach((r) => {
            expect(r).toBeGreaterThan(0);
        });
    });
});
