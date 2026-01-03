/**
 * Genius Composer Engine
 * 
 * Takes raw musical parameters and psychometric state, and applies 
 * advanced music theory (counterpoint, voice leading, melodic contour)
 * to generate "genius-level" musical output.
 */

import { MusicalParams } from './psychometric_calculus';
import { NoteEvent } from './score_orchestrator';
import { Leitmotif, transformLeitmotif, LeitmotifTransformation } from './leitmotif_generator';

// ============================================================================
// TYPES
// ============================================================================

export type OrchestrationMode =
    | 'FULL_ORCHESTRA'
    | 'CHAMBER_DEATH'
    | 'JAZZ_NOIR'
    | 'WAGNERIAN'
    | 'MINIMALIST_VOID'
    | 'CYBER_GLITCH';

export const ORCHESTRATION_MODES: OrchestrationMode[] = [
    'FULL_ORCHESTRA',
    'CHAMBER_DEATH',
    'JAZZ_NOIR',
    'WAGNERIAN',
    'MINIMALIST_VOID',
    'CYBER_GLITCH'
];

interface VoiceLeadingState {
    lastNote: number; // MIDI note
    direction: 1 | -1 | 0; // Pitch direction
    active: boolean;
}

// ============================================================================
// GENIUS COMPOSER CLASS
// ============================================================================

import { AIMusicClient, AIMelodyResponse } from '@/lib/ai_music_client';

export class GeniusComposer {
    private mode: OrchestrationMode = 'FULL_ORCHESTRA';
    private voices: Map<string, VoiceLeadingState> = new Map();
    private history: NoteEvent[] = [];

    // AI State
    private useAI: boolean = false;
    private aiTemperature: number = 0.7;
    private aiClient: AIMusicClient;

    constructor() {
        this.aiClient = AIMusicClient.getInstance();
    }

    setMode(mode: OrchestrationMode) {
        this.mode = mode;
    }

    setAIEnabled(enabled: boolean, temperature: number = 0.7) {
        this.useAI = enabled;
        this.aiTemperature = temperature;
        if (enabled) this.aiClient.checkConnection();
    }

    /**
     * Generate a melody line for an actor based on their leitmotif and current state
     */
    /**
     * Generate a melody line for an actor based on their leitmotif and current state
     */
    async composeMelody(
        leitmotif: Leitmotif,
        params: MusicalParams,
        duration: number, // in beats
        startBeat: number,
        intensity: number // 0-1 (derived from trauma/entropy)
    ): Promise<NoteEvent[]> {
        // AI GENERATION PATH
        if (this.useAI) {
            const aiResult = await this.aiClient.generateMelody({
                psychometrics: {
                    trauma: intensity, // approximation
                    entropy: 0.5, // placeholder, pass real entropy if avail in params
                    cognitiveBias: 'Unknown',
                    rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.33 }
                },
                musicalContext: {
                    key: 'C Major', // TODO: Pass from params
                    mode: 'Ionian',
                    currentChord: 'C',
                    instrument: 'Unknown'
                },
                temperature: this.aiTemperature
            });

            if (aiResult && aiResult.notes.length > 0) {
                // Convert AI notes to NoteEvents
                let currentBeat = startBeat;
                return aiResult.notes.map(n => {
                    const evt: NoteEvent = {
                        pitch: n.pitch,
                        midiNote: this.noteNameToMidi(n.pitch),
                        duration: n.duration,
                        startBeat: currentBeat,
                        velocity: n.velocity,
                        articulation: params.articulation
                    };
                    currentBeat += n.duration;
                    return evt;
                });
            }
        }

        // --- ENHANCED ALGORITHMIC LOGIC WITH RHYTHMIC VARIETY ---
        const melody: NoteEvent[] = [];

        // 1. Get rhythm pattern from leitmotif or generate based on psychometrics
        const rhythmPattern = this.selectRhythmPattern(leitmotif, intensity);

        // 2. Get pitch sequence from leitmotif
        let pitches = leitmotif.pitchClasses.map(pc => pc + (leitmotif.baseOctave + 1) * 12);
        if (pitches.length === 0) {
            pitches = [60, 62, 64, 65, 67]; // Default C major scale
        }

        // 3. Calculate how many complete pattern cycles fit in duration
        const patternDuration = rhythmPattern.reduce((sum, d) => sum + d, 0);
        const cycles = Math.max(1, Math.floor(duration / patternDuration));

        let currentBeat = startBeat;
        let noteIndex = 0;

        for (let cycle = 0; cycle < cycles; cycle++) {
            for (let i = 0; i < rhythmPattern.length; i++) {
                const noteDuration = rhythmPattern[i];

                // Check for rest (negative duration indicates rest)
                if (noteDuration < 0) {
                    currentBeat += Math.abs(noteDuration);
                    continue;
                }

                // Select pitch from leitmotif sequence
                const pitchIdx = noteIndex % pitches.length;
                let note = pitches[pitchIdx];

                // Variation: Octave jumps for high intensity
                if (intensity > 0.7 && Math.random() > 0.6) {
                    note += 12;
                }

                // Variation: Lower octave for low intensity
                if (intensity < 0.3 && Math.random() > 0.7) {
                    note -= 12;
                }

                // Passing tones between structural notes
                if (i > 0 && Math.random() > 0.7 && intensity > 0.4) {
                    const prevNote = pitches[(pitchIdx - 1 + pitches.length) % pitches.length];
                    note = Math.round((note + prevNote) / 2);
                }

                melody.push({
                    pitch: this.midiToNoteName(note),
                    midiNote: note,
                    duration: noteDuration,
                    startBeat: currentBeat,
                    velocity: params.dynamic * (0.8 + Math.random() * 0.2),
                    articulation: this.selectArticulation(intensity, i, rhythmPattern.length)
                });

                currentBeat += noteDuration;
                noteIndex++;
            }
        }

        return melody;
    }

    /**
     * Select rhythm pattern based on leitmotif or psychometric state
     */
    private selectRhythmPattern(leitmotif: Leitmotif, intensity: number): number[] {
        // First, try to use leitmotif's rhythm if defined
        if (leitmotif.rhythm && leitmotif.rhythm.length > 0) {
            return leitmotif.rhythm;
        }

        // Generate pattern based on intensity (trauma/entropy)
        if (intensity > 0.8) {
            // Very high intensity: fragmented, rapid 16th notes with syncopation
            return [0.125, 0.125, 0.25, 0.125, 0.125, 0.125, 0.125];
        } else if (intensity > 0.6) {
            // High intensity: driving 8th notes with occasional 16ths
            return [0.25, 0.125, 0.125, 0.25, 0.25];
        } else if (intensity > 0.4) {
            // Medium intensity: mixed rhythm with dotted patterns
            return [0.375, 0.125, 0.25, 0.25];
        } else if (intensity > 0.2) {
            // Low-medium: steady quarter notes with some 8ths
            return [0.25, 0.25, 0.5];
        } else {
            // Very low intensity: long sustained notes
            return [0.5, 0.5, 1.0];
        }
    }

    /**
     * Select articulation based on context
     */
    private selectArticulation(intensity: number, noteIndex: number, patternLength: number): string {
        if (intensity > 0.7) {
            // High intensity: marcato or staccato
            return noteIndex === 0 ? 'marcato' : 'staccato';
        } else if (noteIndex === patternLength - 1) {
            // Last note of pattern: tenuto
            return 'tenuto';
        } else if (intensity < 0.3) {
            // Low intensity: legato
            return 'legato';
        }
        return 'normal';
    }

    /**
     * Generate Counterpoint (Harmony) for a melody
     * Uses simple Species Counterpoint rules
     */
    composeCounterpoint(
        cantusFirmus: NoteEvent[],
        params: MusicalParams,
        intervalOffset: number = -12 // Octave below by default
    ): NoteEvent[] {
        return cantusFirmus.map(note => {
            // 1. Determine consonant interval (3rd, 5th, 6th, 8th)
            const validIntervals = [3, 4, 5, 7, 8, 9, 12]; // Semitones roughly
            // This is a naive implementation; true counterpoint requires awareness of key

            // Just drop an octave for now to ensure foundational support
            const counterNote = note.midiNote + intervalOffset;

            return {
                ...note,
                pitch: this.midiToNoteName(counterNote),
                midiNote: counterNote,
                velocity: note.velocity * 0.7 // Softer than melody
            };
        });
    }

    /**
     * Orchestrate a chord voicing based on the mode
     */
    orchestrateChord(
        chordRoot: string,
        chordType: string,
        params: MusicalParams,
        startBeat: number,
        duration: number
    ): NoteEvent[] {
        // Basic chord tones ( Root, 3rd, 5th, 7th )
        const rootMidi = this.noteNameToMidi(chordRoot + "4"); // Default to middle register
        let offsets = [0, 4, 7]; // Major triad

        if (chordType.includes('minor')) offsets = [0, 3, 7];
        if (chordType.includes('diminished')) offsets = [0, 3, 6];
        if (chordType.includes('augmented')) offsets = [0, 4, 8];
        if (chordType.includes('7')) offsets.push(10); // Dominant 7 usually
        if (chordType.includes('maj7')) offsets.push(11);

        const chordNotes: NoteEvent[] = [];

        // Distribute voices based on Orchestration Mode
        if (this.mode === 'FULL_ORCHESTRA') {
            // Wide voicing: Root (Bass), Root+5 (Tenor), 3rd+7th (Alto), Melody (Soprano)
            // This method just returns abstract note events, Orchestrator assigns instruments

            // Bass
            chordNotes.push(this.createNote(rootMidi - 12, duration, startBeat, params));
            // Harmony
            offsets.forEach(offset => {
                chordNotes.push(this.createNote(rootMidi + offset, duration, startBeat, params));
            });
        }
        else if (this.mode === 'MINIMALIST_VOID') {
            // Just Root and 5th, very sparse
            chordNotes.push(this.createNote(rootMidi - 12, duration, startBeat, params));
            chordNotes.push(this.createNote(rootMidi + 7, duration, startBeat, params));
        }
        else if (this.mode === 'JAZZ_NOIR') {
            // Cluster voicing, rootless?
            // Add extensions (9th, 11th)
            offsets.push(14); // 9th
            offsets.forEach(offset => {
                chordNotes.push(this.createNote(rootMidi + offset, duration, startBeat, params));
            });
        }
        else {
            // Default
            offsets.forEach(offset => {
                chordNotes.push(this.createNote(rootMidi + offset, duration, startBeat, params));
            });
        }

        return chordNotes;
    }

    // --- Helpers ---

    private createNote(midi: number, duration: number, startBeat: number, params: MusicalParams): NoteEvent {
        return {
            pitch: this.midiToNoteName(midi),
            midiNote: midi,
            duration: duration,
            startBeat: startBeat,
            velocity: params.dynamic,
            articulation: params.articulation
        };
    }

    private midiToNoteName(midi: number): string {
        const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(midi / 12) - 1;
        const pc = midi % 12;
        return names[pc] + octave;
    }

    private noteNameToMidi(noteName: string): number {
        // Simple parser
        const match = noteName.match(/([A-G][#b]?)(-?\d+)/);
        if (!match) return 60; // Default C4

        const pcStr = match[1];
        const octStr = match[2];
        const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        let pc = names.indexOf(pcStr);
        if (pc === -1) pc = 0; // fallback

        return (parseInt(octStr) + 1) * 12 + pc;
    }
}
