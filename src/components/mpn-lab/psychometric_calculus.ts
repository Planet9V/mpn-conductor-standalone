/**
 * Psychometric-to-Musical Calculus Engine v2
 * Translates psychological states into musical parameters
 * 
 * Based on MPN Canon (mpn_canon.md)
 */

import { Vector3 } from 'three';
import {
    lookupDynamics,
    lookupTimeSignature,
    lookupTempoRange,
    lookupModeName,
    lookupInstrument,
    lookupArticulation
} from './mpn_reference_lookup';

// ============================================================================
// TYPES
// ============================================================================

import { ParameterAdjustment } from './mpn_reference_types';

export interface PsychometricState {
    trauma: number;     // 0-1
    entropy: number;    // 0-1
    rsi: {
        real: number;       // 0-1
        symbolic: number;   // 0-1
        imaginary: number;  // 0-1
    };
    disc?: {
        D: number;  // Dominance
        I: number;  // Influence
        S: number;  // Steadiness
        C: number;  // Compliance
    };
    darkTriad?: {
        machiavellianism: number;
        narcissism: number;
        psychopathy: number;
    };
    biases?: string[];  // Active bias names
}

export interface MusicalParams {
    // Global
    tempo: number;          // BPM (60-180)
    timeSignature: string;  // "4/4", "3/4", etc.
    key: string;            // "C Major", "D minor", etc.
    mode: string;           // "ionian", "phrygian", etc.

    // Dynamics
    dynamic: number;        // MIDI velocity 0-127
    dynamicLabel: string;   // "pp", "mf", "ff", etc.

    // Articulation
    articulation: 'legato' | 'staccato' | 'marcato' | 'tenuto' | 'sforzando';

    // Timbre modulation
    timbre: {
        attack: number;     // 0-1
        decay: number;      // 0-1
        sustain: number;    // 0-1
        release: number;    // 0-1
        vibrato: number;    // 0-1
        detuning: number;   // cents (-50 to +50)
        filterCutoff: number; // Hz
    };

    // Harmony
    chordType: string;      // "major7", "minor", "dim", etc.
    chordRoot: string;      // "C", "D", etc.
    tension: number;        // 0-1

    // Instrument suggestion
    instrumentFamily: 'brass' | 'woodwind' | 'strings' | 'keyboard' | 'percussion';
}

export interface LeitmotifSpec {
    id: string;
    actorId: string;
    pitchClasses: number[];     // 0-11 (C=0, C#=1, etc.)
    intervals: number[];        // Semitones between notes
    rhythm: number[];           // Relative durations
    baseOctave: number;
    instrument: string;
}

// Legacy interface for backwards compatibility
export interface PsychometricForce {
    tension: number;
    libido: number;
    attractors: {
        real: number;
        symbolic: number;
        imaginary: number;
    };
    forceVector: Vector3;
}

// ============================================================================
// CONSTANTS - THE CANON
// ============================================================================

const MODES = {
    real: ['phrygian', 'locrian'],
    symbolic: ['ionian', 'mixolydian'],
    imaginary: ['lydian', 'whole-tone']
};

const KEYS_BY_EMOTION = {
    heroic: ['C Major', 'D Major', 'G Major'],
    tragic: ['D minor', 'C minor', 'F minor'],
    mystical: ['Eb Major', 'Ab Major'],
    tense: ['F# minor', 'B minor']
};

const INSTRUMENTS_BY_DISC = {
    D: ['trumpet', 'trombone', 'french_horn'],
    I: ['flute', 'clarinet', 'oboe'],
    S: ['violin', 'cello', 'viola'],
    C: ['piano', 'harp', 'celesta']
};

const DARK_TRIAD_MODULATION = {
    machiavellianism: { detuning: -10, attack: 0.3, filterCutoff: 2000 },
    narcissism: { detuning: 0, attack: 0.05, filterCutoff: 8000 },
    psychopathy: { detuning: 0, attack: 0.01, filterCutoff: 4000 }
};

const BIAS_ARTICULATIONS: Record<string, Partial<MusicalParams>> = {
    'confirmation_bias': { articulation: 'staccato' },
    'dunning_kruger': { timbre: { detuning: 20 } } as any,
    'anchoring': { articulation: 'tenuto' },
    'bandwagon': { articulation: 'legato' },
    'loss_aversion': { mode: 'minor' } as any
};

const KEYWORDS_REAL = ['death', 'trauma', 'drive', 'void', 'chaos', 'abject', 'blood', 'ghost', 'prophecy', 'impossible', 'real', 'murder', 'kill', 'die'];
const KEYWORDS_SYMBOLIC = ['law', 'order', 'signifier', 'father', 'king', 'crown', 'word', 'name', 'debt', 'oath', 'symbolic', 'duty', 'honor', 'prince'];
const KEYWORDS_IMAGINARY = ['ego', 'mirror', 'self', 'image', 'double', 'shadow', 'love', 'ideal', 'wholeness', 'imaginary', 'beauty', 'adore'];

const DISSONANCE_MAP: Record<string, number> = {
    'Major': 0.1, 'Minor': 0.4, 'Dim': 0.8, 'Aug': 0.7, 'Tritone': 0.9,
    'Cluster': 1.0, 'Dissonant': 0.9, 'Atonal': 0.95, 'Silence': 0.0, 'Hollow': 0.6, 'Pedal': 0.3
};

// ============================================================================
// CORE CALCULUS FUNCTIONS
// ============================================================================

/**
 * Convert trauma level to dynamics
 */
export function traumaToDynamics(trauma: number, adjustments?: Record<string, ParameterAdjustment>): { velocity: number; label: string } {
    return lookupDynamics(trauma, adjustments);
}

/**
 * Convert entropy to time signature and tempo
 */
export function entropyToRhythm(entropy: number, adjustments?: Record<string, ParameterAdjustment>): { tempo: number; timeSignature: string } {
    // Map entropy to stability for tempo lookup
    let stability: 'strategic' | 'operational' | 'crisis' = 'strategic';
    if (entropy > 0.4) stability = 'operational';
    if (entropy > 0.7) stability = 'crisis';

    const range = lookupTempoRange(stability, adjustments);
    // Calculate precise tempo within range based on entropy
    const tempo = range.min + (entropy * (range.max - range.min));

    const timeSignature = lookupTimeSignature(entropy);

    return { tempo: Math.round(tempo), timeSignature };
}

/**
 * Convert RSI attractors to mode/scale
 */
export function rsiToMode(rsi: { real: number; symbolic: number; imaginary: number }): string {
    const dominant = Math.max(rsi.real, rsi.symbolic, rsi.imaginary);
    let register: 'real' | 'symbolic' | 'imaginary' = 'symbolic';

    if (dominant === rsi.real) register = 'real';
    else if (dominant === rsi.imaginary) register = 'imaginary';

    return lookupModeName(register);
}

/**
 * Convert DISC profile to instrument
 */
export function discToInstrument(disc?: { D: number; I: number; S: number; C: number }): string {
    if (!disc) return 'piano';

    const dominant = Object.entries(disc).reduce((a, b) => a[1] > b[1] ? a : b);
    const trait = dominant[0] as 'D' | 'I' | 'S' | 'C';

    // Use lookupInstrument - note: returns array, we pick random
    const instruments = lookupInstrument(trait);
    if (instruments.length === 0) return 'piano';

    return instruments[Math.floor(Math.random() * instruments.length)];
}

/**
 * Calculate tension from chord symbol
 */
export function chordToTension(chord: string): number {
    let tension = 0.2;
    Object.entries(DISSONANCE_MAP).forEach(([key, val]) => {
        if (chord.includes(key)) tension = val;
    });
    if (chord.includes('7')) tension += 0.1;
    if (chord.includes('9') || chord.includes('11')) tension += 0.15;
    if (chord.includes('Pure') || chord.includes('C Major')) tension = 0.0;
    return Math.min(tension, 1);
}

/**
 * Calculate RSI attractors from text analysis
 */
export function analyzeRSI(text: string): { real: number; symbolic: number; imaginary: number } {
    const lowerText = text.toLowerCase();
    const attractors = { real: 0, symbolic: 0, imaginary: 0 };

    KEYWORDS_REAL.forEach(k => { if (lowerText.includes(k)) attractors.real += 1; });
    KEYWORDS_SYMBOLIC.forEach(k => { if (lowerText.includes(k)) attractors.symbolic += 1; });
    KEYWORDS_IMAGINARY.forEach(k => { if (lowerText.includes(k)) attractors.imaginary += 1; });

    const total = attractors.real + attractors.symbolic + attractors.imaginary || 1;
    return {
        real: attractors.real / total,
        symbolic: attractors.symbolic / total,
        imaginary: attractors.imaginary / total
    };
}

/**
 * Apply Dark Triad modulation to timbre
 */
export function applyDarkTriadTimbre(
    darkTriad: { machiavellianism: number; narcissism: number; psychopathy: number }
): Partial<MusicalParams['timbre']> {
    const maxTrait = Object.entries(darkTriad).reduce((a, b) => a[1] > b[1] ? a : b);
    const traitName = maxTrait[0] as keyof typeof DARK_TRIAD_MODULATION;
    const intensity = maxTrait[1];

    const mod = DARK_TRIAD_MODULATION[traitName];
    return {
        detuning: mod.detuning * intensity,
        attack: mod.attack,
        filterCutoff: mod.filterCutoff
    };
}

/**
 * Select chord type based on tension level
 */
export function tensionToChordType(tension: number): string {
    if (tension < 0.2) return 'major7';
    if (tension < 0.4) return 'minor7';
    if (tension < 0.6) return 'dominant7';
    if (tension < 0.8) return 'diminished';
    return 'augmented';
}

// ============================================================================
// MAIN CALCULUS FUNCTION
// ============================================================================

/**
 * Full psychometric state to musical parameters conversion
 */
export function psychometricToMusical(state: PsychometricState, adjustments?: Record<string, ParameterAdjustment>): MusicalParams {
    const dynamics = traumaToDynamics(state.trauma, adjustments);
    const rhythm = entropyToRhythm(state.entropy, adjustments);
    const mode = rsiToMode(state.rsi);
    const instrument = discToInstrument(state.disc);
    const tension = (state.rsi.real * 0.8) + (state.entropy * 0.2);
    const chordType = tensionToChordType(tension);

    // Base timbre
    let timbre: MusicalParams['timbre'] = {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.7,
        release: 0.4,
        vibrato: 0.3,
        detuning: 0,
        filterCutoff: 5000
    };

    // Apply Dark Triad if present
    if (state.darkTriad) {
        const dtMod = applyDarkTriadTimbre(state.darkTriad);
        timbre = { ...timbre, ...dtMod };
    }

    // Determine articulation from trauma using lookup
    let articulationTrait = 'Conformity'; // Low trauma
    if (state.trauma > 0.7) articulationTrait = 'Fragility';
    else if (state.trauma > 0.5) articulationTrait = 'Resistance';

    // Map trait to articulation via lookup (needs trait name from reference dict)
    // For now, simpler mapping:
    let articulation: MusicalParams['articulation'] = 'legato';
    if (state.trauma > 0.7) articulation = 'sforzando';
    else if (state.trauma > 0.4) articulation = 'marcato';
    else articulation = 'legato';
    // Ideally we'd use lookupArticulation, but it requires specific trait keys matching the dictionary entries

    // Determine key from RSI balance
    let key = 'C Major';
    if (state.rsi.real > 0.5) key = 'D minor';
    else if (state.rsi.imaginary > 0.5) key = 'Eb Major';
    else if (state.rsi.symbolic > 0.5) key = 'G Major';

    // Determine instrument family
    let instrumentFamily: MusicalParams['instrumentFamily'] = 'keyboard';
    if (instrument.includes('trumpet') || instrument.includes('trombone') || instrument.includes('horn')) {
        instrumentFamily = 'brass';
    } else if (instrument.includes('flute') || instrument.includes('clarinet') || instrument.includes('oboe')) {
        instrumentFamily = 'woodwind';
    } else if (instrument.includes('violin') || instrument.includes('cello') || instrument.includes('viola')) {
        instrumentFamily = 'strings';
    }

    return {
        tempo: rhythm.tempo,
        timeSignature: rhythm.timeSignature,
        key,
        mode,
        dynamic: dynamics.velocity,
        dynamicLabel: dynamics.label,
        articulation,
        timbre,
        chordType,
        chordRoot: key.split(' ')[0],
        tension,
        instrumentFamily
    };
}

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================

/**
 * Original function signature for backwards compatibility
 */
export function calculatePsychometricForce(script: { chord: string; analysis: string } | undefined): PsychometricForce {
    if (!script) {
        return {
            tension: 0.1,
            libido: 0.1,
            attractors: { real: 0, symbolic: 0.5, imaginary: 0 },
            forceVector: new Vector3(0, 0, 0)
        };
    }

    const { chord, analysis } = script;
    const tension = chordToTension(chord);
    const attractors = analyzeRSI(analysis);

    // Calculate libido
    let libido = 0.3;
    if (chord.includes('ff')) libido = 0.9;
    if (chord.includes('pp')) libido = 0.1;
    if (chord.includes('Tutti')) libido = 1.0;
    if (chord.includes('Silence')) libido = 0.0;
    if (chord.includes('Swell') || chord.includes('Rise')) libido += 0.2;

    const forceVector = new Vector3(
        (Math.random() - 0.5) * tension,
        (attractors.symbolic - attractors.real) * libido,
        attractors.imaginary * libido
    );

    return {
        tension: Math.min(tension, 1),
        libido: Math.min(libido, 1),
        attractors,
        forceVector
    };
}
