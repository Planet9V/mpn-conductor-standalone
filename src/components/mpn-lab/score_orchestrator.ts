/**
 * Psychometric Score Orchestrator
 * Combines actor staves, applies counterpoint rules, manages global harmony
 */

import { GeniusComposer, OrchestrationMode } from './GeniusComposer';
import { Leitmotif, transformLeitmotif, LeitmotifTransformation, generateLeitmotif, ActorProfile, selectTransformation } from './leitmotif_generator';
import {
    psychometricToMusical,
    chordToTension,
    analyzeRSI,
    PsychometricState,
    MusicalParams
} from './psychometric_calculus';

import { ParameterAdjustment } from './mpn_reference_types';

// ============================================================================
// TYPES
// ============================================================================

export interface ScriptFrame {
    speaker: string;
    text: string;
    chord: string;
    analysis: string;
}

export interface ActorStave {
    actorId: string;
    actorName: string;
    instrument: string;
    leitmotif: Leitmotif;
    notes: NoteEvent[];
    musicParams: MusicalParams;
    isSpeaking: boolean;
    activation: number;
}

export interface NoteEvent {
    pitch: string;          // "C4", "D#5"
    midiNote: number;       // 60, 75, etc.
    duration: number;       // beats
    startBeat: number;      // position in measure
    velocity: number;       // 0-127
    articulation: string;
}

export interface HarmonyState {
    chord: string;          // "Dm7"
    chordRoot: string;      // "D"
    chordType: string;      // "minor7"
    romanNumeral: string;   // "ii7"
    tension: number;        // 0-1
    function: 'tonic' | 'subdominant' | 'dominant';
}

export interface OrchestratorOutput {
    frameIndex: number;
    timestamp: number;

    global: {
        tempo: number;
        timeSignature: string;
        key: string;
        dynamics: string;
    };

    staves: ActorStave[];

    harmony: HarmonyState;

    graph: {
        nodes: GraphNode[];
        edges: GraphEdge[];
    };
}

export interface GraphNode {
    id: string;
    label: string;
    x: number;
    y: number;
    activation: number;
    type: 'actor' | 'concept';
}

export interface GraphEdge {
    source: string;
    target: string;
    type: 'speech' | 'reference' | 'tension' | 'harmony';
    weight: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Chord function by Roman Numeral
const CHORD_FUNCTIONS: Record<string, 'tonic' | 'subdominant' | 'dominant'> = {
    'I': 'tonic', 'i': 'tonic', 'vi': 'tonic', 'VI': 'tonic',
    'IV': 'subdominant', 'iv': 'subdominant', 'ii': 'subdominant', 'II': 'subdominant',
    'V': 'dominant', 'v': 'dominant', 'vii': 'dominant', 'VII': 'dominant'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function pitchClassToNoteName(pitchClass: number, octave: number): string {
    return `${NOTE_NAMES[pitchClass]}${octave}`;
}

function pitchClassToMidi(pitchClass: number, octave: number): number {
    return (octave + 1) * 12 + pitchClass;
}

function chordTypeToRomanNumeral(chordType: string, key: string): string {
    const isMinor = key.toLowerCase().includes('minor');
    switch (chordType) {
        case 'major7': return isMinor ? 'III' : 'I';
        case 'minor7': return isMinor ? 'i' : 'ii';
        case 'dominant7': return 'V';
        case 'diminished': return isMinor ? 'vii°' : 'vii°';
        case 'augmented': return 'III+';
        default: return 'I';
    }
}

// ============================================================================
// ORCHESTRATOR CLASS
// ============================================================================

export class ScoreOrchestrator {
    private actors: Map<string, ActorProfile> = new Map();
    private staves: Map<string, ActorStave> = new Map();
    private frameIndex: number = 0;
    private globalKey: string = 'C Major';
    private globalTempo: number = 80;
    private activeAdjustments: Record<string, ParameterAdjustment> = {};

    private composer: GeniusComposer;

    constructor(actorProfiles?: ActorProfile[]) {
        this.composer = new GeniusComposer();
        if (actorProfiles) {
            actorProfiles.forEach(p => this.registerActor(p));
        }
    }

    setOrchestrationMode(mode: OrchestrationMode) {
        this.composer.setMode(mode);
    }

    setAIConfig(enabled: boolean, temperature: number) {
        this.composer.setAIEnabled(enabled, temperature);
    }

    updateAdjustments(adjustments: Record<string, ParameterAdjustment>) {
        this.activeAdjustments = { ...this.activeAdjustments, ...adjustments };
    }

    registerActor(profile: ActorProfile) {
        this.actors.set(profile.id, profile);

        // Generate or ensure leitmotif
        const leitmotif = generateLeitmotif(profile);

        const stave: ActorStave = {
            actorId: profile.id,
            actorName: profile.name,
            instrument: leitmotif.instrument,
            leitmotif: leitmotif,
            notes: [],
            musicParams: {
                tempo: 80,
                timeSignature: '4/4',
                key: 'C Major',
                mode: 'Ionian',
                dynamic: 72,
                dynamicLabel: 'mf',
                timbre: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 0.4, vibrato: 0.3, detuning: 0, filterCutoff: 5000 },
                instrumentFamily: 'keyboard',
                chordRoot: 'C',
                chordType: 'Major',
                tension: 0,

                articulation: 'legato'
            },
            isSpeaking: false,
            activation: 0
        };

        this.staves.set(profile.id, stave);
    }

    // ... existing methods ...

    /**
     * Process a script frame and generate orchestral output
     */
    async processFrame(frame: ScriptFrame, trauma: number, entropy: number): Promise<OrchestratorOutput> {
        const timestamp = this.frameIndex * 4000;

        // ... existing analysis ...
        const rsi = analyzeRSI(frame.analysis);

        // Build psychometric state
        const state: PsychometricState = { trauma, entropy, rsi };

        // Get global params (scale/mode updated by lookupMode)
        const globalParams = psychometricToMusical(state, this.activeAdjustments);
        this.globalKey = globalParams.key;
        this.globalTempo = globalParams.tempo;

        const speakerId = frame.speaker.toLowerCase().replace(/\s+/g, '_');
        const outputStaves: ActorStave[] = [];

        // 1. Generate Harmony (Chords) via Genius Composer
        // This effectively creates the 'rhythm section' or backing texture
        // We'll expose this via a 'Harmony' stave or distributed across ensemble in `mpn-conductor/page.tsx`
        const chordNotes = this.composer.orchestrateChord(
            globalParams.chordRoot,
            globalParams.chordType,
            globalParams,
            0,
            4 // Full measure
        );

        // Update Staves

        const staveUpdates = Array.from(this.staves.entries()).map(async ([actorId, stave]) => {
            const isSpeaking = actorId === speakerId ||
                stave.actorName.toLowerCase() === frame.speaker.toLowerCase();

            // Update activation
            stave.activation = isSpeaking ? 1.0 : Math.max(0, stave.activation - 0.1);
            stave.isSpeaking = isSpeaking;

            const transformation = selectTransformation(trauma, entropy, rsi);
            const transformedMotif = transformLeitmotif(stave.leitmotif, transformation);

            let notes: NoteEvent[] = [];

            if (isSpeaking) {
                // LEAD MELODY via Genius Composer
                notes = await this.composer.composeMelody(
                    transformedMotif,
                    globalParams,
                    4, // duration
                    0, // startBeat
                    trauma // intensity
                );
            } else if (stave.activation > 0.3) {
                // COUNTERPOINT / HARMONIC SUPPORT
                // If high entropy, maybe counterpoint. If low, just backing harmony.
                // For now, let's give them a simple counterpoint to the speaker's motif if known,
                // or just play their own motif quietly? 
                // Let's use the Composer to generate a 'Counter Melody' based on own motif
                notes = await this.composer.composeMelody(
                    transformedMotif,
                    { ...globalParams, dynamic: globalParams.dynamic * 0.5 },
                    4,
                    0,
                    trauma * 0.5 // Lower intensity
                );
            }

            stave.notes = notes;
            stave.musicParams = globalParams;
            stave.leitmotif = transformedMotif;

            return { ...stave };
        });

        const updatedStaves = await Promise.all(staveUpdates);
        outputStaves.push(...updatedStaves);

        // Global Harmony Stave
        outputStaves.push({
            actorId: 'global_harmony',
            actorName: 'Global Harmony',
            instrument: 'pad_synth',
            leitmotif: { instrument: 'pad_synth', pitchClasses: [], baseOctave: 3, rhythm: [], transformationHistory: [] } as any,
            notes: chordNotes,
            musicParams: globalParams,
            isSpeaking: false,
            activation: 0.5
        });

        // ... rest of method ...

        // Calculate harmony
        const romanNumeral = chordTypeToRomanNumeral(globalParams.chordType, this.globalKey);
        const harmony: HarmonyState = {
            chord: `${globalParams.chordRoot}${globalParams.chordType === 'major7' ? 'maj7' : globalParams.chordType === 'minor7' ? 'm7' : globalParams.chordType}`,
            chordRoot: globalParams.chordRoot,
            chordType: globalParams.chordType,
            romanNumeral,
            tension: globalParams.tension,
            function: CHORD_FUNCTIONS[romanNumeral] || 'tonic'
        };

        // Generate graph data
        const graphNodes: GraphNode[] = [];
        const graphEdges: GraphEdge[] = [];

        // Actor nodes
        outputStaves.forEach((stave, i) => {
            const angle = (i / outputStaves.length) * Math.PI * 2;
            graphNodes.push({
                id: stave.actorId,
                label: stave.actorName,
                x: Math.cos(angle) * 5,
                y: Math.sin(angle) * 5,
                activation: stave.activation,
                type: 'actor'
            });
        });

        // Concept nodes
        ['Real', 'Symbolic', 'Imaginary'].forEach((concept, i) => {
            graphNodes.push({
                id: concept.toLowerCase(),
                label: concept,
                x: i === 0 ? 0 : (i === 1 ? -4 : 4),
                y: i === 0 ? 5 : -3,
                activation: rsi[concept.toLowerCase() as keyof typeof rsi],
                type: 'concept'
            });
        });

        // Edges from speaker to concepts
        if (speakerId) {
            Object.entries(rsi).forEach(([concept, weight]) => {
                if (weight > 0.2) {
                    graphEdges.push({
                        source: speakerId,
                        target: concept,
                        type: 'reference',
                        weight
                    });
                }
            });
        }

        const output: OrchestratorOutput = {
            frameIndex: this.frameIndex,
            timestamp,
            global: {
                tempo: this.globalTempo,
                timeSignature: globalParams.timeSignature,
                key: this.globalKey,
                dynamics: globalParams.dynamicLabel
            },
            staves: outputStaves,
            harmony,
            graph: {
                nodes: graphNodes,
                edges: graphEdges
            }
        };

        this.frameIndex++;

        return output;
    }

    /**
     * Reset the orchestrator
     */
    reset(): void {
        this.frameIndex = 0;
        this.staves.forEach(stave => {
            stave.notes = [];
            stave.activation = 0;
            stave.isSpeaking = false;
        });
    }

    /**
     * Get current frame index
     */
    getFrameIndex(): number {
        return this.frameIndex;
    }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let orchestratorInstance: ScoreOrchestrator | null = null;

export function getOrchestrator(): ScoreOrchestrator {
    if (!orchestratorInstance) {
        orchestratorInstance = new ScoreOrchestrator();
    }
    return orchestratorInstance;
}

export function resetOrchestrator(): void {
    orchestratorInstance = null;
}
