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
import { STYLE_PRESETS, MusicalStyle } from './styles';
import {
    getModalTransformation,
    getOrchestrationLevel,
    fragmentLeitmotif,
    applyProfessionalTransformations,
    getModeScaleDegrees,
    type MusicalMode,
    type OrchestrationLevel as ProfessionalOrchLevel,
    type TransformationContext
} from '@/lib/leitmotif_transformation_rules';

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

    // Style Configuration
    private currentStyleId: string = 'orchestral'; // Default style
    private currentStyle: MusicalStyle = STYLE_PRESETS['orchestral'];

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

    /**
     * Set musical style for composition
     */
    setStyle(styleId: string) {
        if (STYLE_PRESETS[styleId]) {
            this.currentStyleId = styleId;
            this.currentStyle = STYLE_PRESETS[styleId];
            // Update orchestration mode if style has one
            if (this.currentStyle.orchestrationMode) {
                this.mode = this.currentStyle.orchestrationMode as OrchestrationMode;
            }
        }
    }

    /**
     * Get current style
     */
    getStyle(): MusicalStyle {
        return this.currentStyle;
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
        intensity: number, // 0-1 (derived from trauma/entropy)
        trauma: number = intensity, // Explicit trauma for transformations
        entropy: number = 0.5 // Explicit entropy for transformations
    ): Promise<NoteEvent[]> {
        // ==================================================================
        // APPLY PROFESSIONAL LEITMOTIF TRANSFORMATIONS (Williams/Shore)
        // ==================================================================
        const rsi = { real: 0.33, symbolic: 0.33, imaginary: 0.34 }; // Default RSI
        const transformContext: TransformationContext = {
            trauma,
            entropy,
            rsi,
            characterArc: trauma > 0.7 ? 'crisis' : trauma > 0.4 ? 'development' : 'introduction',
            actorCount: 1
        };

        // Get professional transformations based on psychometric state
        const professionalNotes = leitmotif.pitchClasses.map((pc, i) => ({
            pitch: this.midiToNoteName(pc + (leitmotif.baseOctave + 1) * 12),
            midiNote: pc + (leitmotif.baseOctave + 1) * 12,
            duration: leitmotif.rhythm?.[i] || 1,
            startBeat: startBeat + i,
            velocity: params.dynamic,
            articulation: params.articulation
        }));

        const transformations = applyProfessionalTransformations(
            leitmotif,
            professionalNotes,
            'Cm', // Default chord, could be passed from params
            transformContext
        );

        // Apply modal transformation to scale
        const targetMode = transformations.mode;
        const modeScaleDegrees = getModeScaleDegrees(targetMode);

        // Log transformation for debugging
        console.log(`[GeniusComposer] Professional Transform: mode=${targetMode}, orch=${transformations.orchestrationLevel}, frag=${transformations.fragmentation.level}`);

        // AI GENERATION PATH - TRY TEXT2MIDI FIRST, THEN LLM FALLBACK
        if (this.useAI) {
            // === TEXT2MIDI PATH: Symbolic MIDI from psychometric state ===
            if (this.aiClient.isText2midiReady()) {
                const symbolicNotes = await this.aiClient.generateSymbolicMidi({
                    trauma,
                    entropy,
                    rsi,
                    musicalContext: {
                        key: params.key?.replace(/m$/, '') || 'C',
                        mode: targetMode,
                        tempo: params.tempo || 120
                    }
                });

                if (symbolicNotes && symbolicNotes.length > 0) {
                    console.log(`[GeniusComposer] Text2midi generated ${symbolicNotes.length} notes`);
                    // Convert ParsedMidiNote to NoteEvent with leitmotif context
                    return symbolicNotes.map(n => ({
                        pitch: this.midiToNoteName(n.pitch),
                        midiNote: n.pitch,
                        duration: n.duration,
                        startBeat: startBeat + n.startTime,
                        velocity: n.velocity / 127, // Convert MIDI velocity to 0-1
                        articulation: params.articulation
                    }));
                }
            }

            // === LLM FALLBACK: Use OpenRouter/Gemini for melody generation ===
            const aiResult = await this.aiClient.generateMelody({
                psychometrics: {
                    trauma,
                    entropy,
                    cognitiveBias: 'Unknown',
                    rsi
                },
                musicalContext: {
                    key: params.key || 'C Major',
                    mode: targetMode,
                    currentChord: 'C',
                    instrument: 'Orchestra'
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

        // 2. Get pitch sequence from leitmotif WITH MODAL TRANSFORMATION
        let pitches = leitmotif.pitchClasses.map((pc, idx) => {
            // Apply mode scale degrees to transform pitches
            const scaleIdx = idx % modeScaleDegrees.length;
            const modeOffset = modeScaleDegrees[scaleIdx];
            // Base note + mode adjustment + octave
            return (pc % 12) + modeOffset + (leitmotif.baseOctave + 1) * 12;
        });
        if (pitches.length === 0) {
            pitches = [60, 62, 64, 65, 67]; // Default C major scale
        }

        // 3. Apply FRAGMENTATION if high trauma/entropy (Shore technique)
        if (transformations.fragmentation.level !== 'full') {
            // Use the fragmented subset of pitches
            const fragmentLevel = transformations.fragmentation.level;
            if (fragmentLevel === 'truncated') {
                pitches = pitches.slice(0, Math.ceil(pitches.length * 0.6));
            } else if (fragmentLevel === 'core_motif') {
                pitches = pitches.slice(0, Math.min(4, pitches.length));
            } else if (fragmentLevel === 'interval_only') {
                pitches = pitches.filter((_, i) => i % 2 === 0);
            }
            console.log(`[GeniusComposer] Fragmentation applied: ${pitches.length} notes remaining`);
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
     * NOW WITH STYLE INTEGRATION
     */
    private selectRhythmPattern(leitmotif: Leitmotif, intensity: number): number[] {
        // First, try to use leitmotif's rhythm if defined
        if (leitmotif.rhythm && leitmotif.rhythm.length > 0) {
            return leitmotif.rhythm;
        }

        // Get style rhythm parameters
        const style = this.currentStyle.rhythm;
        const baseDivision = style.base_division; // 4, 8, 16, or 32
        const syncopation = style.syncopation_weight; // 0-1
        const swing = style.swing;

        // Convert base division to beat duration
        const baseDuration = 4.0 / baseDivision; // 4->1.0, 8->0.5, 16->0.25, 32->0.125

        // Generate pattern based on style + intensity
        const patternLength = Math.floor(4 + Math.random() * 4); // 4-8 notes
        const pattern: number[] = [];

        for (let i = 0; i < patternLength; i++) {
            let duration = baseDuration;

            // Intensity modulation
            if (intensity > 0.7 && Math.random() < 0.4) {
                // Higher intensity = faster notes
                duration = baseDuration / 2;
            } else if (intensity < 0.3 && Math.random() < 0.3) {
                // Lower intensity = longer notes
                duration = baseDuration * 2;
            }

            // Apply syncopation
            if (syncopation > Math.random()) {
                // Off-beat emphasis: shorten this note, lengthen next
                duration *= 0.75;
                if (i < patternLength - 1) {
                    pattern.push(duration);
                    pattern.push(baseDuration * 1.5); // Lengthened next note
                    i++; // Skip next iteration
                    continue;
                }
            }

            // Swing feel (triplet subdivision for jazz)
            if (swing && i % 2 === 0 && i < patternLength - 1) {
                pattern.push(baseDuration * 0.67); // Long
                pattern.push(baseDuration * 0.33); // Short
                i++; // Skip next iteration
                continue;
            }

            pattern.push(duration);
        }

        return pattern.length > 0 ? pattern : [baseDuration, baseDuration, baseDuration, baseDuration];
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
     * Apply harmony rules based on style parameters
     * Returns chord offsets (intervals from root) with extensions
     */
    private applyHarmonyRules(chordType: string, params: MusicalParams): number[] {
        const style = this.currentStyle.harmony;
        let offsets: number[] = [];

        // Base triad selection
        if (chordType.includes('minor')) {
            offsets = [0, 3, 7]; // Minor triad
        } else if (chordType.includes('diminished')) {
            offsets = [0, 3, 6]; // Diminished triad
        } else if (chordType.includes('augmented')) {
            offsets = [0, 4, 8]; // Augmented triad
        } else {
            offsets = [0, 4, 7]; // Major triad (default)
        }

        // Apply complexity for extensions
        // complexity 0.0-0.3: Triads only
        // complexity 0.3-0.6: Add 7ths
        // complexity 0.6-0.9: Add 9ths, 11ths
        // complexity 0.9-1.0: Add all extensions (13ths, altered tones)

        if (style.complexity > 0.3) {
            // Add 7th
            if (chordType.includes('maj7')) {
                offsets.push(11); // Major 7th
            } else if (chordType.includes('7') || style.complexity > 0.5) {
                offsets.push(10); // Dominant 7th
            }
        }

        if (style.complexity > 0.6) {
            // Add 9th
            offsets.push(14); // 9th (2 + octave)

            if (style.complexity > 0.7) {
                // Add 11th
                offsets.push(17); // 11th (5 + octave)
            }
        }

        if (style.complexity > 0.9) {
            // Add 13th for maximum complexity
            offsets.push(21); // 13th (9 + octave)
        }

        // Apply dissonance tolerance for alterations
        if (style.dissonance_tolerance > 0.6) {
            // Add chromatic tensions
            if (Math.random() < style.dissonance_tolerance - 0.5) {
                // Flatten 9th (dark jazz sound)
                const ninthIndex = offsets.indexOf(14);
                if (ninthIndex > -1) {
                    offsets[ninthIndex] = 13; // b9
                }
            }

            if (style.dissonance_tolerance > 0.8) {
                // Sharp 11th (lydian sound)
                const eleventhIndex = offsets.indexOf(17);
                if (eleventhIndex > -1) {
                    offsets[eleventhIndex] = 18; // #11
                }
            }
        }

        // Remove duplicates and sort
        return [...new Set(offsets)].sort((a, b) => a - b);
    }

    /**
     * Orchestrate a chord voicing based on the mode
     * NOW WITH STYLE HARMONY INTEGRATION
     */
    orchestrateChord(
        chordRoot: string,
        chordType: string,
        params: MusicalParams,
        startBeat: number,
        duration: number
    ): NoteEvent[] {
        // Get chord offsets using harmony rules
        const offsets = this.applyHarmonyRules(chordType, params);
        const rootMidi = this.noteNameToMidi(chordRoot + "4"); // Middle register
        const chordNotes: NoteEvent[] = [];

        // Apply texture density from style
        const density = this.currentStyle.texture.density;

        // Distribute voices based on Orchestration Mode + Texture Density
        if (this.mode === 'FULL_ORCHESTRA') {
            // Wide voicing: Bass + full chord
            chordNotes.push(this.createNote(rootMidi - 12, duration, startBeat, params)); // Bass

            // Add chord tones based on density
            const voicesToAdd = Math.floor(offsets.length * density);
            offsets.slice(0, Math.max(3, voicesToAdd)).forEach(offset => {
                chordNotes.push(this.createNote(rootMidi + offset, duration, startBeat, params));
            });
        }
        else if (this.mode === 'MINIMALIST_VOID' || this.mode === 'MINIMALIST_GLASS') {
            // Sparse voicing: Root and 5th only (or just root if very sparse)
            chordNotes.push(this.createNote(rootMidi - 12, duration, startBeat, params));
            if (density > 0.2) {
                chordNotes.push(this.createNote(rootMidi + 7, duration, startBeat, params)); // Perfect 5th
            }
        }
        else if (this.mode === 'JAZZ_NOIR' || this.mode === 'BRASS_ENSEMBLE') {
            // Jazz voicing: Rootless with extensions
            // Skip root in upper voices, emphasize color tones (3rd, 7th, extensions)
            offsets.filter(o => o > 0).forEach(offset => {
                chordNotes.push(this.createNote(rootMidi + offset, duration, startBeat, params));
            });
            // Bass plays root
            if (density > 0.3) {
                chordNotes.push(this.createNote(rootMidi - 12, duration, startBeat, params));
            }
        }
        else if (this.mode === 'CHAMBER_DEATH' || this.mode === 'CHAMBER_QUARTET') {
            // Chamber: Close voicing, emphasize dissonance
            // Use all offsets but in narrow range
            const maxVoices = Math.floor(4 * density); // Max 4 voices for chamber
            offsets.slice(0, maxVoices).forEach(offset => {
                chordNotes.push(this.createNote(rootMidi + offset, duration, startBeat, params));
            });
        }
        else {
            // Default: Use all chord tones based on density
            const voicesToAdd = Math.ceil(offsets.length * Math.max(0.5, density));
            offsets.slice(0, voicesToAdd).forEach(offset => {
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
