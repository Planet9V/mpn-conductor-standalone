/**
 * Professional Leitmotif Transformation Rules
 * Based on analysis of John Williams (Star Wars, Harry Potter) and Howard Shore (LOTR)
 * 
 * Techniques implemented:
 * 1. Modal Transformations (RSI → Mode mapping)
 * 2. Harmonic Recontextualization (same melody, different emotion)
 * 3. Fragmentation (theme breakdown under high trauma/entropy)
 * 4. Orchestration Evolution (instrument intensity curves)
 * 5. Contrapuntal Layering (multi-actor thematic interaction)
 */

import { RSIState } from './psychometric_calculus';
import { Leitmotif, NoteEvent } from '../components/mpn-lab/leitmotif_generator';

// ============================================================================
// TYPES
// ============================================================================

export type MusicalMode =
    | 'Ionian'     // Major - stable, happy
    | 'Dorian'     // Minor with raised 6th - noble, grounded
    | 'Phrygian'   // Minor with b2 - dark, exotic, anxious
    | 'Lydian'     // Major with #4 - magical, transcendent (Hedwig's Theme)
    | 'Mixolydian' // Major with b7 - heroic, driving
    | 'Aeolian'    // Natural minor - serious, melancholic
    | 'Locrian';   // Diminished - unstable, dissonant (corruption)

export type OrchestrationLevel =
    | 'SOLO'              // Single instrument, intimate
    | 'CHAMBER'           // Small ensemble (3-5 instruments)
    | 'SECTION'           // Full section (strings, brass, etc.)
    | 'FULL_ORCHESTRA'    // All sections
    | 'TUTTI_FORTISSIMO'; // Everyone, maximum intensity

export interface TransformationContext {
    trauma: number;
    entropy: number;
    rsi: RSIState;
    characterArc: 'introduction' | 'development' | 'crisis' | 'resolution';
    actorCount: number; // For contrapuntal decisions
}

export interface ChordTransformation {
    original: string;
    transformed: string;
    emotionalShift: string;
}

// ============================================================================
// A.1 MODAL TRANSFORMATION RULES
// Based on Williams' use of Lydian (#4) for magic and Shore's modal interchange
// ============================================================================

/**
 * Map RSI (Real-Symbolic-Imaginary) registers to professional modal choices
 * 
 * Technique Source: 
 * - Williams uses Lydian #4 for "magic" in Harry Potter
 * - Shore uses Aeolian/Dorian for "grounded reality" in LOTR Fellowship
 * - Phrygian b2 creates anxiety (Ring corruption motif)
 */
export function getModalTransformation(
    rsi: RSIState,
    trauma: number
): MusicalMode {
    // Determine dominant register
    const registers = [
        { name: 'real', value: rsi.real },
        { name: 'symbolic', value: rsi.symbolic },
        { name: 'imaginary', value: rsi.imaginary }
    ].sort((a, b) => b.value - a.value);

    const dominant = registers[0].name;

    if (dominant === 'real') {
        // Real: Grounded, reality-facing
        // High trauma = darker (Aeolian), low trauma = noble (Dorian)
        return trauma > 0.6 ? 'Aeolian' : 'Dorian';

    } else if (dominant === 'symbolic') {
        // Symbolic: Elevated, transcendent, magical
        // High trauma = unstable magic (Mixolydian), low = pure magic (Lydian)
        return trauma > 0.6 ? 'Mixolydian' : 'Lydian';

    } else {
        // Imaginary: Illusory, anxious, unstable
        // High trauma = complete dissolution (Locrian), low = uneasy (Phrygian)
        return trauma > 0.6 ? 'Locrian' : 'Phrygian';
    }
}

/**
 * Get scale degrees for a given mode (relative to Ionian)
 */
export function getModeScaleDegrees(mode: MusicalMode): number[] {
    const modes: Record<MusicalMode, number[]> = {
        'Ionian': [0, 2, 4, 5, 7, 9, 11], // Major
        'Dorian': [0, 2, 3, 5, 7, 9, 10],
        'Phrygian': [0, 1, 3, 5, 7, 8, 10], // b2 for tension
        'Lydian': [0, 2, 4, 6, 7, 9, 11], // #4 for magic
        'Mixolydian': [0, 2, 4, 5, 7, 9, 10], // b7 for drive
        'Aeolian': [0, 2, 3, 5, 7, 8, 10], // Natural minor
        'Locrian': [0, 1, 3, 5, 6, 8, 10]  // Diminished
    };
    return modes[mode];
}

// ============================================================================
// A.2 ORCHESTRATION EVOLUTION
// Williams: Celeste → Woodwinds → Full Brass → Full Orchestra
// ============================================================================

/**
 * Determine orchestration level based on trauma and entropy
 * 
 * Technique Source:
 * - Williams expands orchestration as Luke Skywalker grows (Force Theme)
 * - Shore fragments Fellowship theme as group splits
 */
export function getOrchestrationLevel(
    trauma: number,
    entropy: number
): OrchestrationLevel {
    const intensity = (trauma * 0.7) + (entropy * 0.3); // Weighted combination

    if (intensity < 0.2) return 'SOLO';              // Intimate, reflective
    if (intensity < 0.4) return 'CHAMBER';           // Small ensemble
    if (intensity < 0.6) return 'SECTION';           // Full section
    if (intensity < 0.85) return 'FULL_ORCHESTRA';   // All sections
    return 'TUTTI_FORTISSIMO';                        // Crisis peak with percussion
}

/**
 * Get recommended instruments for each orchestration level
 */
export function getInstrumentsForLevel(level: OrchestrationLevel): string[] {
    const levels: Record<OrchestrationLevel, string[]> = {
        'SOLO': ['piano', 'celeste', 'solo_violin'],
        'CHAMBER': ['violin', 'cello', 'clarinet', 'oboe', 'piano'],
        'SECTION': ['violin_section', 'cello_section', 'brass_section', 'woodwind_section'],
        'FULL_ORCHESTRA': ['strings', 'brass', 'woodwinds', 'percussion', 'harp'],
        'TUTTI_FORTISSIMO': ['strings', 'brass', 'woodwinds', 'percussion', 'timpani', 'cymbals', 'choir']
    };
    return levels[level];
}

// ============================================================================
// A.3 HARMONIC RECONTEXTUALIZATION
// Same melody over different chords creates emotional shift
// ============================================================================

/**
 * Transform a chord to create emotional shift
 * 
 * Technique Source:
 * - Williams: Force Theme over major = hope, over minor = loss
 * - Shore: Ring theme adds dissonance for corruption
 */
export function harmonicallyRecontextualize(
    chord: string,
    fromEmotion: 'hope' | 'innocence' | 'unity',
    toEmotion: 'despair' | 'corruption' | 'fragmentation'
): ChordTransformation {
    const transformations: Record<string, Record<string, string>> = {
        'hope_to_despair': {
            'Cmaj': 'Cm', 'Gmaj': 'Gm', 'Fmaj': 'Fm',
            'Amaj': 'Am', 'Dmaj': 'Dm', 'Emaj': 'Em'
        },
        'innocence_to_corruption': {
            'Cmaj7': 'Cdim7', 'Am7': 'Am7b5', 'Fmaj7': 'Fdim7',
            'Gmaj7': 'G7#9', 'Dm7': 'Dm7b5'
        },
        'unity_to_fragmentation': {
            'Cmaj': 'Csus2', 'Gmaj': 'Gsus4', 'Fmaj': 'Fsus2',
            'Am': 'Am/E', 'Dm': 'Dm/A'
        }
    };

    const key = `${fromEmotion}_to_${toEmotion}`;
    const transformed = transformations[key]?.[chord] || chord;

    return {
        original: chord,
        transformed,
        emotionalShift: `${fromEmotion} → ${toEmotion}`
    };
}

// ============================================================================
// A.4 FRAGMENTATION ALGORITHM
// Shore: Fellowship theme breaks into motifs as group splinters
// ============================================================================

export interface FragmentedTheme {
    level: 'full' | 'truncated' | 'core_motif' | 'interval_only' | 'dissolution';
    notes: NoteEvent[];
    description: string;
}

/**
 * Fragment a leitmotif based on entropy and trauma levels
 * Higher values = more fragmentation
 * 
 * Technique Source:
 * - Shore's Fellowship theme progressively breaks down through trilogy
 * - Williams fragments Luke's theme during Vader revelation
 */
export function fragmentLeitmotif(
    leitmotif: Leitmotif,
    entropy: number,
    trauma: number,
    fullNotes: NoteEvent[]
): FragmentedTheme {
    const fragmentationScore = (entropy * 0.6) + (trauma * 0.4);

    if (fragmentationScore < 0.25) {
        return {
            level: 'full',
            notes: fullNotes,
            description: 'Complete thematic statement'
        };
    }

    if (fragmentationScore < 0.5) {
        // Take first half of theme
        const truncated = fullNotes.slice(0, Math.ceil(fullNotes.length * 0.6));
        return {
            level: 'truncated',
            notes: truncated,
            description: 'Truncated theme - beginning only'
        };
    }

    if (fragmentationScore < 0.75) {
        // Extract core 4-note cell
        const coreMotif = fullNotes.slice(0, Math.min(4, fullNotes.length));
        return {
            level: 'core_motif',
            notes: coreMotif,
            description: 'Core motivic cell only'
        };
    }

    if (fragmentationScore < 0.9) {
        // Just the intervals, sparse with rests
        const sparse = fullNotes.filter((_, i) => i % 2 === 0);
        return {
            level: 'interval_only',
            notes: sparse,
            description: 'Sparse intervallic fragments'
        };
    }

    // Near-complete dissolution - single sustained note
    const dissolution = fullNotes.length > 0
        ? [{ ...fullNotes[0], duration: 4 }]
        : [];
    return {
        level: 'dissolution',
        notes: dissolution,
        description: 'Near dissolution - sustained fragments'
    };
}

// ============================================================================
// A.5 CONTRAPUNTAL LAYERING
// Multi-actor scenes: layer themes based on activation
// ============================================================================

export interface ContrapuntalVoice {
    actorId: string;
    voice: 'soprano' | 'alto' | 'tenor' | 'bass';
    octaveOffset: number;
    volumeDb: number;
    notes: NoteEvent[];
}

/**
 * Layer multiple actor themes contrapuntally
 * 
 * Technique Source:
 * - Shore layers Rohan + Fellowship themes during Helm's Deep
 * - Williams combines Force + Imperial March during Luke/Vader confrontation
 */
export function layerThemesContrapuntally(
    activeActors: Array<{
        actorId: string;
        activation: number;
        isSpeaking: boolean;
        notes: NoteEvent[];
    }>
): ContrapuntalVoice[] {
    // Sort by activation (speaking = highest)
    const sorted = [...activeActors].sort((a, b) => {
        if (a.isSpeaking !== b.isSpeaking) return a.isSpeaking ? -1 : 1;
        return b.activation - a.activation;
    });

    // Assign voices based on ranking
    const voiceAssignments: Array<'soprano' | 'alto' | 'tenor' | 'bass'> =
        ['soprano', 'alto', 'tenor', 'bass'];

    return sorted.map((actor, index): ContrapuntalVoice => {
        const voiceIndex = Math.min(index, voiceAssignments.length - 1);

        return {
            actorId: actor.actorId,
            voice: voiceAssignments[voiceIndex],
            octaveOffset: -index, // Spread across octaves (soprano highest)
            volumeDb: -6 * index, // Each layer -6dB quieter
            notes: actor.notes.map(note => ({
                ...note,
                velocity: Math.max(30, note.velocity - (20 * index)) // Reduce velocity for background
            }))
        };
    });
}

// ============================================================================
// MASTER TRANSFORMATION FUNCTION
// Applies all relevant transformations based on context
// ============================================================================

export interface TransformedLeitmotif {
    mode: MusicalMode;
    orchestrationLevel: OrchestrationLevel;
    instruments: string[];
    fragmentation: FragmentedTheme;
    harmonyContext: ChordTransformation | null;
}

export function applyProfessionalTransformations(
    leitmotif: Leitmotif,
    originalNotes: NoteEvent[],
    chord: string,
    context: TransformationContext
): TransformedLeitmotif {
    const { trauma, entropy, rsi, characterArc } = context;

    // 1. Modal transformation
    const mode = getModalTransformation(rsi, trauma);

    // 2. Orchestration level
    const orchestrationLevel = getOrchestrationLevel(trauma, entropy);
    const instruments = getInstrumentsForLevel(orchestrationLevel);

    // 3. Fragmentation
    const fragmentation = fragmentLeitmotif(leitmotif, entropy, trauma, originalNotes);

    // 4. Harmonic recontextualization (if crisis or resolution)
    let harmonyContext: ChordTransformation | null = null;
    if (characterArc === 'crisis') {
        harmonyContext = harmonicallyRecontextualize(chord, 'hope', 'despair');
    } else if (trauma > 0.7) {
        harmonyContext = harmonicallyRecontextualize(chord, 'innocence', 'corruption');
    }

    return {
        mode,
        orchestrationLevel,
        instruments,
        fragmentation,
        harmonyContext
    };
}
