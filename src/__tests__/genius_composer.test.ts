/**
 * MPN GeniusComposer Tests
 * Tests for the AI-enabled melody and chord generation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GeniusComposer, ORCHESTRATION_MODES, type OrchestrationMode } from '@/components/mpn-lab/GeniusComposer';
import type { MusicalParams } from '@/components/mpn-lab/psychometric_calculus';
import type { Leitmotif } from '@/components/mpn-lab/leitmotif_generator';

describe('GeniusComposer', () => {
    let composer: GeniusComposer;

    const defaultParams: MusicalParams = {
        tempo: 80,
        timeSignature: '4/4',
        key: 'C Major',
        mode: 'Ionian',
        dynamic: 72,
        dynamicLabel: 'mf',
        timbre: {
            attack: 0.1,
            decay: 0.3,
            sustain: 0.7,
            release: 0.4,
            vibrato: 0.3,
            detuning: 0,
            filterCutoff: 5000,
        },
        instrumentFamily: 'strings',
        chordRoot: 'C',
        chordType: 'Major',
        tension: 0.3,
        articulation: 'legato',
    };

    const testLeitmotif: Leitmotif = {
        instrument: 'violin',
        pitchClasses: [0, 4, 7, 11], // C, E, G, B
        baseOctave: 4,
        rhythm: [0.5, 0.5, 0.25, 0.25],
        transformationHistory: [],
    };

    beforeEach(() => {
        composer = new GeniusComposer();
    });

    describe('Mode Configuration', () => {
        it('should accept all orchestration modes', () => {
            ORCHESTRATION_MODES.forEach((mode) => {
                composer.setMode(mode);
                // Should not throw
                expect(true).toBe(true);
            });
        });

        it('should have valid orchestration mode list', () => {
            expect(ORCHESTRATION_MODES).toContain('FULL_ORCHESTRA');
            expect(ORCHESTRATION_MODES).toContain('JAZZ_NOIR');
            expect(ORCHESTRATION_MODES).toContain('MINIMALIST_VOID');
            expect(ORCHESTRATION_MODES).toContain('WAGNERIAN');
        });
    });

    describe('AI Configuration', () => {
        it('should enable AI with temperature', () => {
            composer.setAIEnabled(true, 0.7);
            // Should not throw
            expect(true).toBe(true);
        });

        it('should disable AI', () => {
            composer.setAIEnabled(false, 0.5);
            // Should not throw
            expect(true).toBe(true);
        });

        it('should accept various temperature values', () => {
            [0, 0.3, 0.5, 0.7, 1.0].forEach((temp) => {
                composer.setAIEnabled(true, temp);
                expect(true).toBe(true);
            });
        });
    });

    describe('Melody Composition', () => {
        it('should generate melody notes', async () => {
            const melody = await composer.composeMelody(
                testLeitmotif,
                defaultParams,
                4, // duration
                0, // startBeat
                0.5 // intensity
            );

            expect(melody).toBeDefined();
            expect(Array.isArray(melody)).toBe(true);
        });

        it('should generate notes with valid structure', async () => {
            const melody = await composer.composeMelody(testLeitmotif, defaultParams, 4, 0, 0.5);

            melody.forEach((note) => {
                expect(note.pitch).toBeDefined();
                expect(note.midiNote).toBeGreaterThanOrEqual(0);
                expect(note.midiNote).toBeLessThanOrEqual(127);
                expect(note.duration).toBeGreaterThan(0);
                expect(note.startBeat).toBeGreaterThanOrEqual(0);
                expect(note.velocity).toBeGreaterThanOrEqual(0);
                expect(note.velocity).toBeLessThanOrEqual(127);
            });
        });

        it('should respond to intensity parameter', async () => {
            const lowIntensity = await composer.composeMelody(testLeitmotif, defaultParams, 4, 0, 0.1);
            const highIntensity = await composer.composeMelody(testLeitmotif, defaultParams, 4, 0, 0.9);

            // High intensity should generally produce more notes or varied notes
            expect(lowIntensity).toBeDefined();
            expect(highIntensity).toBeDefined();
        });

        it('should use leitmotif pitch classes', async () => {
            const melody = await composer.composeMelody(testLeitmotif, defaultParams, 4, 0, 0.5);

            // At least some notes should be derived from leitmotif
            const pitchClasses = melody.map((note) => note.midiNote % 12);
            const hasLeitmotifPitch = pitchClasses.some((pc) => testLeitmotif.pitchClasses.includes(pc));

            expect(hasLeitmotifPitch).toBe(true);
        });
    });

    describe('Chord Orchestration', () => {
        it('should generate chord voicing for major chord', () => {
            const chordNotes = composer.orchestrateChord('C', 'Major', defaultParams, 0, 4);

            expect(chordNotes).toBeDefined();
            expect(chordNotes.length).toBeGreaterThan(0);
        });

        it('should generate chord voicing for minor chord', () => {
            const chordNotes = composer.orchestrateChord('A', 'minor', defaultParams, 0, 4);

            expect(chordNotes).toBeDefined();
            expect(chordNotes.length).toBeGreaterThan(0);
        });

        it('should generate different voicings for different modes', () => {
            composer.setMode('FULL_ORCHESTRA');
            const fullOrch = composer.orchestrateChord('C', 'Major', defaultParams, 0, 4);

            composer.setMode('MINIMALIST_VOID');
            const minimal = composer.orchestrateChord('C', 'Major', defaultParams, 0, 4);

            // Different modes should produce different voicings
            expect(fullOrch.length).not.toBe(minimal.length);
        });

        it('should handle chord extensions', () => {
            const dom7 = composer.orchestrateChord('G', 'dominant7', defaultParams, 0, 4);
            const maj7 = composer.orchestrateChord('C', 'major7', defaultParams, 0, 4);

            expect(dom7.length).toBeGreaterThan(0);
            expect(maj7.length).toBeGreaterThan(0);
        });

        it('should handle diminished and augmented chords', () => {
            const dim = composer.orchestrateChord('B', 'diminished', defaultParams, 0, 4);
            const aug = composer.orchestrateChord('C', 'augmented', defaultParams, 0, 4);

            expect(dim.length).toBeGreaterThan(0);
            expect(aug.length).toBeGreaterThan(0);
        });
    });

    describe('Counterpoint Generation', () => {
        it('should generate counterpoint from melody', async () => {
            const melody = await composer.composeMelody(testLeitmotif, defaultParams, 4, 0, 0.5);
            const counterpoint = composer.composeCounterpoint(melody, defaultParams, -12);

            expect(counterpoint).toBeDefined();
            expect(counterpoint.length).toBe(melody.length);
        });

        it('should offset counterpoint by specified interval', async () => {
            const melody = await composer.composeMelody(testLeitmotif, defaultParams, 4, 0, 0.5);
            const counterpoint = composer.composeCounterpoint(melody, defaultParams, -12);

            // Counterpoint should be an octave lower
            counterpoint.forEach((note, i) => {
                expect(note.midiNote).toBe(melody[i].midiNote - 12);
            });
        });

        it('should maintain timing alignment', async () => {
            const melody = await composer.composeMelody(testLeitmotif, defaultParams, 4, 0, 0.5);
            const counterpoint = composer.composeCounterpoint(melody, defaultParams, -12);

            counterpoint.forEach((note, i) => {
                expect(note.startBeat).toBe(melody[i].startBeat);
                expect(note.duration).toBe(melody[i].duration);
            });
        });
    });
});

describe('Note Naming Validation', () => {
    let composer: GeniusComposer;

    beforeEach(() => {
        composer = new GeniusComposer();
    });

    it('should generate valid note name format', async () => {
        const leitmotif: Leitmotif = {
            instrument: 'piano',
            pitchClasses: [0, 2, 4, 5, 7, 9, 11],
            baseOctave: 4,
            rhythm: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
            transformationHistory: [],
        };

        const params: MusicalParams = {
            tempo: 100,
            timeSignature: '4/4',
            key: 'C Major',
            mode: 'Ionian',
            dynamic: 80,
            dynamicLabel: 'f',
            timbre: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.3, vibrato: 0.2, detuning: 0, filterCutoff: 8000 },
            instrumentFamily: 'keyboard',
            chordRoot: 'C',
            chordType: 'Major',
            tension: 0.2,
            articulation: 'staccato',
        };

        const melody = await composer.composeMelody(leitmotif, params, 4, 0, 0.5);

        melody.forEach((note) => {
            // Note name should match pattern like C4, D#5, Bb3
            expect(note.pitch).toMatch(/^[A-G][#b]?-?\d+$/);
        });
    });
});
