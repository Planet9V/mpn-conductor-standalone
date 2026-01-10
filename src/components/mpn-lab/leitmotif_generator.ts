/**
 * Leitmotif Generator
 * Generates signature musical motifs for actors based on their psychometric profiles
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ActorProfile {
    id: string;
    name: string;
    disc?: { D: number; I: number; S: number; C: number };
    bigFive?: { O: number; C: number; E: number; A: number; N: number };
    darkTriad?: { machiavellianism: number; narcissism: number; psychopathy: number };
    biases?: string[];
    archetype?: 'hero' | 'shadow' | 'mentor' | 'herald' | 'threshold_guardian' | 'shapeshifter' | 'trickster';
}

export interface Leitmotif {
    id: string;
    actorId: string;
    actorName: string;

    // Musical elements
    pitchClasses: number[];     // 0-11 (C=0, C#=1, D=2, etc.)
    intervals: number[];        // Semitones between notes
    rhythm: number[];           // Relative durations (1 = quarter note)
    baseOctave: number;         // 3-5 typically

    // Derived properties
    key: string;                // "C major", "D minor"
    mode: 'major' | 'minor' | 'diminished' | 'augmented';
    instrument: string;         // Assigned instrument
    tempo: number;              // Base tempo for this motif

    // Transformation state
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

// ============================================================================
// CONSTANTS
// ============================================================================

// Interval patterns by archetype
const ARCHETYPE_INTERVALS: Record<string, number[]> = {
    hero: [4, 3, 5],      // Major 3rd, minor 3rd, P4 (triumphant)
    shadow: [1, 6, 1],      // Minor 2nd, tritone, minor 2nd (menacing)
    mentor: [5, 4, 3],      // P4, Major 3rd, minor 3rd (wise)
    herald: [7, 5, 7],      // P5, P4, P5 (fanfare)
    threshold_guardian: [2, 2, 2], // Whole tones (mysterious)
    shapeshifter: [3, 4, 3, 4], // Alternating 3rds (ambiguous)
    trickster: [1, 11, 1, 11], // Chromatic zig-zag (chaotic)
    default: [4, 3, 5]       // Major arpeggio
};

// Base pitch by DISC dominance
const DISC_ROOT_PITCH: Record<string, number> = {
    D: 2,  // D (assertive)
    I: 0,  // C (bright)
    S: 7,  // G (stable)
    C: 9   // A (analytical)
};

// Instruments by archetype
const ARCHETYPE_INSTRUMENTS: Record<string, string> = {
    hero: 'french_horn',
    shadow: 'bass_clarinet',
    mentor: 'oboe',
    herald: 'trumpet',
    threshold_guardian: 'timpani',
    shapeshifter: 'viola',
    trickster: 'piccolo',
    default: 'piano'
};

// Rhythm patterns by Big Five Neuroticism
const RHYTHM_PATTERNS = {
    stable: [1, 1, 2],           // Steady
    moderate: [1, 0.5, 0.5, 1],  // Slight syncopation
    anxious: [0.5, 0.5, 0.25, 0.75, 1] // Irregular
};

// ============================================================================
// GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate a leitmotif from actor profile
 */
export function generateLeitmotif(profile: ActorProfile): Leitmotif {
    const archetype = profile.archetype || 'default';

    // Get base intervals from archetype
    const intervals = ARCHETYPE_INTERVALS[archetype] || ARCHETYPE_INTERVALS.default;

    // Calculate root pitch from DISC
    let rootPitch = 0;
    if (profile.disc) {
        const dominantDisc = Object.entries(profile.disc).reduce((a, b) => a[1] > b[1] ? a : b);
        rootPitch = DISC_ROOT_PITCH[dominantDisc[0]] || 0;
    }

    // Generate pitch sequence from intervals
    const pitchClasses: number[] = [rootPitch];
    let currentPitch = rootPitch;
    for (const interval of intervals) {
        currentPitch = (currentPitch + interval) % 12;
        pitchClasses.push(currentPitch);
    }

    // Determine rhythm from Big Five Neuroticism
    let rhythm = RHYTHM_PATTERNS.stable;
    if (profile.bigFive) {
        if (profile.bigFive.N > 0.7) rhythm = RHYTHM_PATTERNS.anxious;
        else if (profile.bigFive.N > 0.4) rhythm = RHYTHM_PATTERNS.moderate;
    }

    // Pad rhythm to match pitch count
    while (rhythm.length < pitchClasses.length) {
        rhythm = [...rhythm, ...rhythm];
    }
    rhythm = rhythm.slice(0, pitchClasses.length);

    // Determine key and mode
    const mode = intervals.includes(3) && !intervals.includes(4) ? 'minor' : 'major';
    const keyNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const key = `${keyNames[rootPitch]} ${mode}`;

    // Assign instrument
    const instrument = ARCHETYPE_INSTRUMENTS[archetype] || ARCHETYPE_INSTRUMENTS.default;

    // Determine octave from DISC (D=high, C=low)
    let baseOctave = 4;
    if (profile.disc) {
        if (profile.disc.D > 0.5) baseOctave = 5;
        else if (profile.disc.C > 0.5) baseOctave = 3;
    }

    // Determine tempo from Big Five Extraversion
    let tempo = 80;
    if (profile.bigFive) {
        tempo = 60 + (profile.bigFive.E * 60); // 60-120 BPM
    }

    return {
        id: `leitmotif_${profile.id}`,
        actorId: profile.id,
        actorName: profile.name,
        pitchClasses,
        intervals,
        rhythm,
        baseOctave,
        key,
        mode,
        instrument,
        tempo,
        currentTransformation: 'original'
    };
}

/**
 * Transform a leitmotif based on emotional state
 */
export function transformLeitmotif(
    motif: Leitmotif,
    transformation: LeitmotifTransformation
): Leitmotif {
    const transformed = { ...motif, currentTransformation: transformation };

    switch (transformation) {
        case 'inverted':
            // Flip intervals (negate)
            transformed.intervals = motif.intervals.map(i => -i);
            break;

        case 'retrograde':
            // Reverse the sequence
            transformed.pitchClasses = [...motif.pitchClasses].reverse();
            transformed.rhythm = [...motif.rhythm].reverse();
            break;

        case 'retrograde_inverted':
            transformed.pitchClasses = [...motif.pitchClasses].reverse();
            transformed.intervals = motif.intervals.map(i => -i);
            break;

        case 'fragmented':
            // Keep only every other note
            transformed.pitchClasses = motif.pitchClasses.filter((_, i) => i % 2 === 0);
            transformed.rhythm = motif.rhythm.filter((_, i) => i % 2 === 0);
            break;

        case 'augmented':
            // Double the rhythm durations
            transformed.rhythm = motif.rhythm.map(r => r * 2);
            break;

        case 'diminished':
            // Halve the rhythm durations
            transformed.rhythm = motif.rhythm.map(r => r / 2);
            break;

        case 'chromatic_descent':
            // All intervals become -1 (chromatic descent)
            transformed.intervals = motif.intervals.map(() => -1);
            break;

        case 'whole_tone_ascent':
            // All intervals become +2 (whole tone)
            transformed.intervals = motif.intervals.map(() => 2);
            break;
    }

    // Recalculate pitch classes if intervals changed
    if (['inverted', 'chromatic_descent', 'whole_tone_ascent', 'retrograde_inverted'].includes(transformation)) {
        const root = motif.pitchClasses[0];
        transformed.pitchClasses = [root];
        let current = root;
        for (const interval of transformed.intervals) {
            current = (current + interval + 12) % 12;
            transformed.pitchClasses.push(current);
        }
    }

    return transformed;
}

/**
 * Determine which transformation to apply based on psychometric state
 */
export function selectTransformation(
    trauma: number,
    entropy: number,
    rsi: { real: number; symbolic: number; imaginary: number }
): LeitmotifTransformation {
    // High trauma = inversion or fragmentation
    if (trauma > 0.8) return 'fragmented';
    if (trauma > 0.6) return 'inverted';

    // High entropy = retrograde or diminished
    if (entropy > 0.8) return 'retrograde';
    if (entropy > 0.6) return 'diminished';

    // Real dominant = chromatic descent
    if (rsi.real > 0.6) return 'chromatic_descent';

    // Imaginary dominant = whole tone ascent
    if (rsi.imaginary > 0.6) return 'whole_tone_ascent';

    // Moderate states = augmented (slower, contemplative)
    if (trauma > 0.3 && trauma < 0.6) return 'augmented';

    return 'original';
}

// ============================================================================
// REGISTRY
// ============================================================================

const leitmotifRegistry: Map<string, Leitmotif> = new Map();

/**
 * Register a leitmotif for an actor
 */
export function registerLeitmotif(profile: ActorProfile): Leitmotif {
    const motif = generateLeitmotif(profile);
    leitmotifRegistry.set(profile.id, motif);
    return motif;
}

/**
 * Get registered leitmotif
 */
export function getLeitmotif(actorId: string): Leitmotif | undefined {
    return leitmotifRegistry.get(actorId);
}

/**
 * Get or create leitmotif
 */
export function ensureLeitmotif(profile: ActorProfile): Leitmotif {
    return leitmotifRegistry.get(profile.id) || registerLeitmotif(profile);
}

/**
 * Clear all registered leitmotifs
 */
export function clearLeitmotifRegistry(): void {
    leitmotifRegistry.clear();
}
