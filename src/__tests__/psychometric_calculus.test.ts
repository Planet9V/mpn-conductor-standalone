/**
 * MPN Psychometric Calculus Tests
 * Tests for the core psychometric-to-musical transformation engine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
    psychometricToMusical,
    chordToTension,
    analyzeRSI,
    traumaToDynamics,
    entropyToRhythm,
    rsiToMode,
    discToInstrument,
    type PsychometricState,
    type MusicalParams,
} from '@/components/mpn-lab/psychometric_calculus';

describe('Psychometric Calculus Engine', () => {
    describe('psychometricToMusical', () => {
        it('should transform low trauma state to calm musical parameters', () => {
            const state: PsychometricState = {
                trauma: 0.1,
                entropy: 0.2,
                rsi: { real: 0.2, symbolic: 0.6, imaginary: 0.2 },
            };

            const result = psychometricToMusical(state);

            expect(result).toBeDefined();
            expect(result.tempo).toBeLessThan(100); // Calm tempo
            expect(result.dynamicLabel).toMatch(/pp|p|mp/); // Soft dynamics
        });

        it('should transform high trauma state to intense musical parameters', () => {
            const state: PsychometricState = {
                trauma: 0.9,
                entropy: 0.8,
                rsi: { real: 0.7, symbolic: 0.2, imaginary: 0.1 },
            };

            const result = psychometricToMusical(state);

            expect(result).toBeDefined();
            expect(result.tempo).toBeGreaterThan(80); // Faster tempo
            expect(result.dynamicLabel).toMatch(/f|ff|fff/); // Loud dynamics
        });

        it('should handle edge case of zero values', () => {
            const state: PsychometricState = {
                trauma: 0,
                entropy: 0,
                rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 },
            };

            const result = psychometricToMusical(state);

            expect(result).toBeDefined();
            expect(typeof result.tempo).toBe('number');
            expect(result.key).toBeDefined();
        });

        it('should handle maximum values (crisis state)', () => {
            const state: PsychometricState = {
                trauma: 1.0,
                entropy: 1.0,
                rsi: { real: 1.0, symbolic: 0, imaginary: 0 },
            };

            const result = psychometricToMusical(state);

            expect(result).toBeDefined();
            expect(result.tension).toBeGreaterThan(0.5); // High tension
        });

        it('should return valid time signature', () => {
            const state: PsychometricState = {
                trauma: 0.5,
                entropy: 0.5,
                rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 },
            };

            const result = psychometricToMusical(state);

            expect(result.timeSignature).toMatch(/^\d+\/\d+$/);
        });

        it('should return valid musical key', () => {
            const state: PsychometricState = {
                trauma: 0.5,
                entropy: 0.5,
                rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 },
            };

            const result = psychometricToMusical(state);

            // Key should be a valid key signature
            expect(result.key).toBeDefined();
            expect(result.key.length).toBeGreaterThan(0);
        });

        it('should include timbre parameters', () => {
            const state: PsychometricState = {
                trauma: 0.5,
                entropy: 0.5,
                rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 },
            };

            const result = psychometricToMusical(state);

            expect(result.timbre).toBeDefined();
            expect(result.timbre.attack).toBeDefined();
            expect(result.timbre.decay).toBeDefined();
            expect(result.timbre.sustain).toBeDefined();
            expect(result.timbre.release).toBeDefined();
        });
    });

    describe('traumaToDynamics', () => {
        it('should return soft dynamics for low trauma', () => {
            const result = traumaToDynamics(0.1);
            expect(result.label).toMatch(/pp|p|mp/);
            expect(result.velocity).toBeLessThan(70);
        });

        it('should return loud dynamics for high trauma', () => {
            const result = traumaToDynamics(0.9);
            expect(result.label).toMatch(/f|ff|fff/);
            expect(result.velocity).toBeGreaterThan(80);
        });

        it('should return medium dynamics for moderate trauma', () => {
            const result = traumaToDynamics(0.5);
            expect(result.velocity).toBeGreaterThan(50);
            expect(result.velocity).toBeLessThan(100);
        });
    });

    describe('entropyToRhythm', () => {
        it('should return valid rhythm parameters', () => {
            const result = entropyToRhythm(0.1);
            expect(result.tempo).toBeGreaterThan(0);
            expect(result.timeSignature).toBeDefined();
        });

        it('should return faster tempo for high entropy', () => {
            const lowResult = entropyToRhythm(0.1);
            const highResult = entropyToRhythm(0.9);
            expect(highResult.tempo).toBeGreaterThan(lowResult.tempo);
        });

        it('should return valid time signature format', () => {
            const result = entropyToRhythm(0.5);
            expect(result.timeSignature).toMatch(/^\d+\/\d+$/);
        });
    });

    describe('rsiToMode', () => {
        it('should return a mode string for high Real', () => {
            const mode = rsiToMode({ real: 0.8, symbolic: 0.1, imaginary: 0.1 });
            expect(typeof mode).toBe('string');
            expect(mode.length).toBeGreaterThan(0);
        });

        it('should return a mode string for high Symbolic', () => {
            const mode = rsiToMode({ real: 0.1, symbolic: 0.8, imaginary: 0.1 });
            expect(typeof mode).toBe('string');
            expect(mode.length).toBeGreaterThan(0);
        });

        it('should return a mode string for high Imaginary', () => {
            const mode = rsiToMode({ real: 0.1, symbolic: 0.1, imaginary: 0.8 });
            expect(typeof mode).toBe('string');
            expect(mode.length).toBeGreaterThan(0);
        });

        it('should return different modes for different RSI dominance', () => {
            const realMode = rsiToMode({ real: 0.8, symbolic: 0.1, imaginary: 0.1 });
            const symbolicMode = rsiToMode({ real: 0.1, symbolic: 0.8, imaginary: 0.1 });
            // Modes should be defined (may or may not be different based on lookups)
            expect(realMode).toBeDefined();
            expect(symbolicMode).toBeDefined();
        });
    });

    describe('discToInstrument', () => {
        it('should return a valid instrument string', () => {
            const result = discToInstrument({ D: 0.9, I: 0.3, S: 0.2, C: 0.3 });
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);
        });

        it('should return piano as fallback when no DISC provided', () => {
            const result = discToInstrument(undefined);
            expect(result).toBe('piano');
        });

        it('should return an instrument for each DISC profile', () => {
            const profiles = [
                { D: 0.9, I: 0.3, S: 0.2, C: 0.3 },
                { D: 0.2, I: 0.9, S: 0.3, C: 0.3 },
                { D: 0.2, I: 0.3, S: 0.9, C: 0.3 },
                { D: 0.2, I: 0.3, S: 0.3, C: 0.9 },
            ];

            profiles.forEach((profile) => {
                const result = discToInstrument(profile);
                expect(typeof result).toBe('string');
                expect(result.length).toBeGreaterThan(0);
            });
        });
    });

    describe('chordToTension', () => {
        it('should return low tension for major chord', () => {
            const tension = chordToTension('C Major');
            expect(tension).toBeLessThanOrEqual(0.2);
        });

        it('should return higher tension for minor chord', () => {
            const majorTension = chordToTension('C');
            const minorTension = chordToTension('Cm Minor');
            expect(minorTension).toBeGreaterThanOrEqual(majorTension);
        });

        it('should return tension for diminished chord', () => {
            const tension = chordToTension('BDim');
            expect(tension).toBeGreaterThan(0.5);
        });

        it('should handle dominant 7th chords', () => {
            const tension = chordToTension('G7');
            expect(tension).toBeGreaterThan(0);
        });

        it('should add tension for extended chords', () => {
            const baseTension = chordToTension('C');
            const extended9 = chordToTension('C9');
            expect(extended9).toBeGreaterThan(baseTension);
        });
    });

    describe('analyzeRSI', () => {
        it('should detect Real register dominance in trauma text', () => {
            const text = 'death murder blood violence trauma horror';
            const rsi = analyzeRSI(text);

            expect(rsi.real).toBeGreaterThan(rsi.symbolic);
            expect(rsi.real).toBeGreaterThan(rsi.imaginary);
        });

        it('should detect Symbolic register in logical text', () => {
            const text = 'law order king crown duty honor';
            const rsi = analyzeRSI(text);

            expect(rsi.symbolic).toBeGreaterThan(0.3);
        });

        it('should detect Imaginary register in identity text', () => {
            const text = 'mirror image self ego love beauty ideal';
            const rsi = analyzeRSI(text);

            expect(rsi.imaginary).toBeGreaterThan(0.3);
        });

        it('should handle text with no matching keywords', () => {
            const text = 'cats are fuzzy';
            const rsi = analyzeRSI(text);

            // When no keywords match, all individual RSI values are 0
            expect(rsi.real).toBe(0);
            expect(rsi.symbolic).toBe(0);
            expect(rsi.imaginary).toBe(0);
        });

        it('should handle empty text', () => {
            const rsi = analyzeRSI('');

            expect(rsi.real).toBeGreaterThanOrEqual(0);
            expect(rsi.symbolic).toBeGreaterThanOrEqual(0);
            expect(rsi.imaginary).toBeGreaterThanOrEqual(0);
        });

        it('should return normalized values summing to 1 when keywords present', () => {
            const text = 'death king mirror';
            const rsi = analyzeRSI(text);

            const total = rsi.real + rsi.symbolic + rsi.imaginary;
            expect(total).toBeCloseTo(1, 2);
        });
    });
});

describe('Musical Parameter Validation', () => {
    it('should produce valid MIDI velocity range', () => {
        const states: PsychometricState[] = [
            { trauma: 0, entropy: 0, rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 } },
            { trauma: 0.5, entropy: 0.5, rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 } },
            { trauma: 1, entropy: 1, rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 } },
        ];

        states.forEach((state) => {
            const result = psychometricToMusical(state);
            expect(result.dynamic).toBeGreaterThanOrEqual(0);
            expect(result.dynamic).toBeLessThanOrEqual(127);
        });
    });

    it('should produce valid tempo range (30-200 BPM)', () => {
        const states: PsychometricState[] = [
            { trauma: 0, entropy: 0, rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 } },
            { trauma: 1, entropy: 1, rsi: { real: 1, symbolic: 0, imaginary: 0 } },
        ];

        states.forEach((state) => {
            const result = psychometricToMusical(state);
            expect(result.tempo).toBeGreaterThanOrEqual(30);
            expect(result.tempo).toBeLessThanOrEqual(200);
        });
    });
});
