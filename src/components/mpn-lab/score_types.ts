/**
 * Psychometric Score Types
 * Complete type definitions for the MPN score output format
 */

// ============================================================================
// ACTOR PROFILES
// ============================================================================

export interface ActorProfile {
    id: string;
    name: string;

    // DISC Assessment
    disc?: {
        D: number;  // Dominance (0-1)
        I: number;  // Influence (0-1)
        S: number;  // Steadiness (0-1)
        C: number;  // Compliance (0-1)
    };

    // Big Five (OCEAN)
    bigFive?: {
        O: number;  // Openness
        C: number;  // Conscientiousness
        E: number;  // Extraversion
        A: number;  // Agreeableness
        N: number;  // Neuroticism
    };

    // Dark Triad
    darkTriad?: {
        machiavellianism: number;
        narcissism: number;
        psychopathy: number;
    };

    // Jungian Archetype
    archetype?: 'hero' | 'shadow' | 'mentor' | 'herald' | 'threshold_guardian' | 'shapeshifter' | 'trickster';

    // Active Biases (from 100+ list)
    biases?: string[];
}

// ============================================================================
// MUSICAL ELEMENTS
// ============================================================================

export interface NoteEvent {
    pitch: string;              // "C4", "D#5"
    midiNote: number;           // 60, 75
    duration: number;           // beats
    startBeat: number;          // position in measure
    velocity: number;           // 0-127
    articulation: string;       // legato, staccato, marcato, etc.
}

export interface LeitmotifSpec {
    id: string;
    actorId: string;
    actorName: string;
    pitchClasses: number[];     // 0-11
    intervals: number[];        // Semitones
    rhythm: number[];           // Relative durations
    baseOctave: number;
    key: string;
    mode: 'major' | 'minor' | 'diminished' | 'augmented';
    instrument: string;
    tempo: number;
    currentTransformation: LeitmotifTransformation;
}

export type LeitmotifTransformation =
    | 'original'
    | 'inverted'
    | 'retrograde'
    | 'retrograde_inverted'
    | 'fragmented'
    | 'augmented'
    | 'diminished'
    | 'chromatic_descent'
    | 'whole_tone_ascent';

export interface TimbreModulation {
    attack: number;         // 0-1
    decay: number;          // 0-1
    sustain: number;        // 0-1
    release: number;        // 0-1
    vibrato: number;        // 0-1
    detuning: number;       // cents (-50 to +50)
    filterCutoff: number;   // Hz
}

// ============================================================================
// STAVES
// ============================================================================

export interface ActorStaveData {
    actorId: string;
    actorName: string;
    instrument: string;
    instrumentFamily: 'brass' | 'woodwind' | 'strings' | 'keyboard' | 'percussion';

    leitmotif: LeitmotifSpec;
    notes: NoteEvent[];

    timbre: TimbreModulation;
    dynamic: number;
    articulation: string;

    isSpeaking: boolean;
    activation: number;     // 0-1

    psychometricState: {
        trauma: number;
        entropy: number;
        rsi: { real: number; symbolic: number; imaginary: number };
    };
}

export interface EnvironmentStave {
    type: 'environment' | 'stage' | 'chorus';
    instrument: string;
    notes: NoteEvent[];
    mood: 'neutral' | 'tense' | 'peaceful' | 'chaotic' | 'ominous';
}

// ============================================================================
// HARMONY
// ============================================================================

export interface HarmonyData {
    chord: string;              // "Dm7", "G7#9"
    chordRoot: string;          // "D"
    chordType: string;          // "minor7", "dominant7"
    romanNumeral: string;       // "ii7", "V7"
    tension: number;            // 0-1
    function: 'tonic' | 'subdominant' | 'dominant';
    voicing?: number[];         // MIDI notes in chord
}

// ============================================================================
// GRAPH
// ============================================================================

export interface GraphNode {
    id: string;
    label: string;
    x: number;
    y: number;
    z?: number;
    activation: number;
    type: 'actor' | 'concept' | 'event';
    color?: string;
}

export interface GraphEdge {
    source: string;
    target: string;
    type: 'speech' | 'reference' | 'tension' | 'harmony' | 'alliance' | 'conflict';
    weight: number;
    label?: string;
}

// ============================================================================
// SCORE FRAME (Main Output)
// ============================================================================

export interface PsychometricScoreFrame {
    // Metadata
    frameIndex: number;
    timestamp: number;          // ms from start
    scriptLine?: string;
    speaker?: string;

    // Global Parameters
    global: {
        tempo: number;          // BPM
        timeSignature: string;  // "4/4"
        key: string;            // "D minor"
        mode: string;           // "phrygian"
        dynamics: string;       // "mf"
    };

    // Actor Staves
    staves: ActorStaveData[];

    // Environment Stave (optional)
    environment?: EnvironmentStave;

    // Harmony Analysis
    harmony: HarmonyData;

    // Graph Topology
    graph: {
        nodes: GraphNode[];
        edges: GraphEdge[];
    };
}

// ============================================================================
// FULL SCORE (Collection of Frames)
// ============================================================================

export interface PsychometricScore {
    // Metadata
    id: string;
    title: string;
    source: string;             // "Hamlet", "Oedipus Rex"
    generatedAt: string;        // ISO timestamp
    version: string;

    // Cast
    actors: ActorProfile[];

    // Leitmotif Registry
    leitmotifs: Record<string, LeitmotifSpec>;

    // Frames
    frames: PsychometricScoreFrame[];

    // Summary Statistics
    statistics: {
        totalFrames: number;
        duration: number;       // ms
        averageTrauma: number;
        averageEntropy: number;
        dominantKey: string;
        dominantMode: string;
    };
}

// ============================================================================
// EXPORT FORMATS
// ============================================================================

export interface MIDIExportOptions {
    tracksPerActor: boolean;    // Each actor = separate MIDI track
    includeTempoChanges: boolean;
    velocityScaling: number;    // Multiplier
}

export interface NotationExportOptions {
    format: 'vexflow' | 'musicxml' | 'abc';
    stavesPerPage: number;
    showLyrics: boolean;        // Show script text as lyrics
    showChordSymbols: boolean;
}

// ============================================================================
// PROJECT VARIATIONS (Phase 11)
// ============================================================================

export interface ScoreVariant {
    id: string; // UUID
    play_id: string;
    name: string;
    ai_model: 'psychoscore' | 'text2midi' | 'hybrid';
    musical_style_id: string; // e.g., 'LEITMOTIF_WAGNERIAN'
    voice_overrides: Record<string, { voiceId: string; stability: number }>;
    parameter_overrides: Record<string, any>;
    is_generated: boolean;
    generated_score?: PsychometricScore;
    created_at: string;
}
