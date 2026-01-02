/**
 * MPN Orchestration Options
 * Configurations for the 4 orchestration modes that layer on top of core reference
 * 
 * Each option inherits from the core reference but specializes instrument/voicing choices
 */

export enum OrchestrationOption {
    FULL_ORCHESTRA = 'full_orchestra',
    STRING_QUARTET = 'string_quartet',
    JAZZ_ENSEMBLE = 'jazz_ensemble',
    LEITMOTIF_WAGNERIAN = 'leitmotif_wagnerian'
}

export interface OrchestrationConfig {
    id: OrchestrationOption;
    name: string;
    description: string;
    pros: string[];
    cons: string[];
    recommended: boolean;
    maxActors: number | null;      // null = unlimited
    voiceConfiguration: VoiceConfig[];
    instrumentPalette: InstrumentPalette;
    harmonicStyle: HarmonicStyle;
    rhythmicStyle: RhythmicStyle;
}

export interface VoiceConfig {
    role: string;                  // e.g., "Protagonist", "Antagonist", "Confidant"
    discMapping: 'D' | 'I' | 'S' | 'C' | 'mixed';
    instruments: string[];
    register: 'high' | 'mid' | 'low' | 'full';
    priority: number;              // 1 = highest
}

export interface InstrumentPalette {
    brass: string[];
    woodwind: string[];
    strings: string[];
    keyboard: string[];
    percussion: string[];
    other: string[];
}

export interface HarmonicStyle {
    preferredProgressions: string[];
    chordVoicingDensity: 'sparse' | 'medium' | 'dense';
    dissonanceTolerance: number;  // 0-1
    modulation: 'rare' | 'moderate' | 'frequent';
}

export interface RhythmicStyle {
    baseTimeSignatures: string[];
    tempoRange: { min: number; max: number };
    syncopation: 'low' | 'medium' | 'high';
    polyrhythmEnabled: boolean;
}

// ============================================================================
// OPTION 1: FULL ORCHESTRA (Maximum Fidelity)
// ============================================================================

export const FULL_ORCHESTRA_CONFIG: OrchestrationConfig = {
    id: OrchestrationOption.FULL_ORCHESTRA,
    name: 'Full Orchestra',
    description: 'Each actor = unique instrument voice in polyphonic symphony. Maximum expressive range with richly layered orchestration.',
    pros: [
        'Maximum expressive range',
        'Richly layered textures',
        'Full dynamic envelope',
        'Complete timbral palette'
    ],
    cons: [
        'Complex synthesis',
        'Computationally heavy',
        'Requires larger cast differentiation'
    ],
    recommended: false,
    maxActors: null,  // Unlimited
    voiceConfiguration: [
        { role: 'Dominant Leader', discMapping: 'D', instruments: ['trumpet', 'horn', 'trombone'], register: 'high', priority: 1 },
        { role: 'Influencer', discMapping: 'I', instruments: ['flute', 'clarinet', 'oboe'], register: 'high', priority: 2 },
        { role: 'Stabilizer', discMapping: 'S', instruments: ['violin', 'viola', 'cello'], register: 'mid', priority: 3 },
        { role: 'Analyst', discMapping: 'C', instruments: ['piano', 'harp', 'celesta'], register: 'full', priority: 4 },
        { role: 'Background/Environment', discMapping: 'mixed', instruments: ['timpani', 'bass', 'organ'], register: 'low', priority: 5 }
    ],
    instrumentPalette: {
        brass: ['trumpet', 'horn', 'trombone', 'tuba'],
        woodwind: ['flute', 'oboe', 'clarinet', 'bassoon', 'piccolo'],
        strings: ['violin1', 'violin2', 'viola', 'cello', 'contrabass'],
        keyboard: ['piano', 'harp', 'celesta', 'organ'],
        percussion: ['timpani', 'snare', 'cymbals', 'glockenspiel', 'xylophone'],
        other: ['chimes', 'gong']
    },
    harmonicStyle: {
        preferredProgressions: ['I-IV-V-I', 'i-VI-III-VII', 'I-vi-IV-V'],
        chordVoicingDensity: 'dense',
        dissonanceTolerance: 0.8,
        modulation: 'frequent'
    },
    rhythmicStyle: {
        baseTimeSignatures: ['4/4', '3/4', '6/8', '5/4'],
        tempoRange: { min: 40, max: 180 },
        syncopation: 'medium',
        polyrhythmEnabled: true
    }
};

// ============================================================================
// OPTION 2: STRING QUARTET (Chamber)
// ============================================================================

export const STRING_QUARTET_CONFIG: OrchestrationConfig = {
    id: OrchestrationOption.STRING_QUARTET,
    name: 'String Quartet',
    description: '4 voices: Violin I (protagonist), Violin II (antagonist), Viola (confidant), Cello (stage/environment). Classic chamber sonata form.',
    pros: [
        'Simple and legible',
        'Classic sonata form structure',
        'Clear voice leading',
        'Intimate emotional expression'
    ],
    cons: [
        'Limited to 4 timbres',
        'Difficult for large casts',
        'Less textural variety'
    ],
    recommended: false,
    maxActors: 4,
    voiceConfiguration: [
        { role: 'Protagonist', discMapping: 'D', instruments: ['violin1'], register: 'high', priority: 1 },
        { role: 'Antagonist', discMapping: 'I', instruments: ['violin2'], register: 'high', priority: 2 },
        { role: 'Confidant', discMapping: 'S', instruments: ['viola'], register: 'mid', priority: 3 },
        { role: 'Stage/Environment', discMapping: 'C', instruments: ['cello'], register: 'low', priority: 4 }
    ],
    instrumentPalette: {
        brass: [],
        woodwind: [],
        strings: ['violin1', 'violin2', 'viola', 'cello'],
        keyboard: [],
        percussion: [],
        other: []
    },
    harmonicStyle: {
        preferredProgressions: ['I-V-vi-IV', 'i-iv-V-i', 'I-IV-I-V'],
        chordVoicingDensity: 'sparse',
        dissonanceTolerance: 0.5,
        modulation: 'moderate'
    },
    rhythmicStyle: {
        baseTimeSignatures: ['4/4', '3/4'],
        tempoRange: { min: 60, max: 120 },
        syncopation: 'low',
        polyrhythmEnabled: false
    }
};

// ============================================================================
// OPTION 3: JAZZ ENSEMBLE (Improvisational)
// ============================================================================

export const JAZZ_ENSEMBLE_CONFIG: OrchestrationConfig = {
    id: OrchestrationOption.JAZZ_ENSEMBLE,
    name: 'Jazz Ensemble',
    description: 'Chord changes are scripted; melody improvised. Solo regions when actor speaks. Natural dialogue metaphor with flexible phrasing.',
    pros: [
        'Natural dialogue metaphor',
        'Flexible expression',
        'Solo spotlight regions',
        'Rhythmic freedom'
    ],
    cons: [
        'Less symphonic feel',
        'Requires jazz harmony knowledge',
        'May feel informal for serious drama'
    ],
    recommended: false,
    maxActors: 6,
    voiceConfiguration: [
        { role: 'Lead Voice', discMapping: 'D', instruments: ['trumpet', 'saxophone'], register: 'high', priority: 1 },
        { role: 'Harmony Voice', discMapping: 'I', instruments: ['piano', 'guitar'], register: 'mid', priority: 2 },
        { role: 'Bass Line', discMapping: 'S', instruments: ['upright_bass', 'bass_guitar'], register: 'low', priority: 3 },
        { role: 'Rhythm Section', discMapping: 'C', instruments: ['drums', 'percussion'], register: 'full', priority: 4 },
        { role: 'Color/Fill', discMapping: 'mixed', instruments: ['vibraphone', 'clarinet'], register: 'mid', priority: 5 }
    ],
    instrumentPalette: {
        brass: ['trumpet', 'trombone', 'flugelhorn'],
        woodwind: ['alto_sax', 'tenor_sax', 'clarinet', 'flute'],
        strings: ['upright_bass', 'guitar'],
        keyboard: ['piano', 'rhodes', 'organ'],
        percussion: ['drums', 'congas', 'vibraphone'],
        other: ['bass_guitar']
    },
    harmonicStyle: {
        preferredProgressions: ['ii-V-I', 'I-vi-ii-V', 'iii-VI-ii-V'],
        chordVoicingDensity: 'medium',
        dissonanceTolerance: 0.9,  // Jazz tolerates more extensions
        modulation: 'frequent'
    },
    rhythmicStyle: {
        baseTimeSignatures: ['4/4', '3/4', '5/4', '7/4'],
        tempoRange: { min: 60, max: 200 },
        syncopation: 'high',
        polyrhythmEnabled: true
    }
};

// ============================================================================
// OPTION 4: LEITMOTIF/WAGNERIAN (RECOMMENDED)
// ============================================================================

export const LEITMOTIF_CONFIG: OrchestrationConfig = {
    id: OrchestrationOption.LEITMOTIF_WAGNERIAN,
    name: 'Leitmotif/Wagnerian',
    description: 'Each actor has a signature motif that transforms based on emotional state. Operatic feel with systematic, scalable approach.',
    pros: [
        'Operatic dramatic feel',
        'Systematic and scalable',
        'Clear character identification',
        'Rich transformation vocabulary'
    ],
    cons: [
        'Requires upfront motif definition',
        'More complex to implement',
        'Needs motif registry management'
    ],
    recommended: true,
    maxActors: null,  // Unlimited with motif system
    voiceConfiguration: [
        { role: 'Actor with Motif', discMapping: 'mixed', instruments: ['orchestral'], register: 'full', priority: 1 },
        { role: 'Harmonic Bed', discMapping: 'S', instruments: ['strings', 'woodwind'], register: 'mid', priority: 2 },
        { role: 'Environment', discMapping: 'C', instruments: ['percussion', 'low_strings'], register: 'low', priority: 3 }
    ],
    instrumentPalette: {
        brass: ['horn', 'trumpet', 'trombone', 'tuba', 'wagner_tuba'],
        woodwind: ['flute', 'oboe', 'clarinet', 'english_horn', 'bassoon'],
        strings: ['violin1', 'violin2', 'viola', 'cello', 'contrabass', 'harp'],
        keyboard: ['piano', 'celesta'],
        percussion: ['timpani', 'chimes', 'gong', 'triangle'],
        other: ['organ']
    },
    harmonicStyle: {
        preferredProgressions: ['chromatic', 'neo-riemannian', 'tritone-related'],
        chordVoicingDensity: 'dense',
        dissonanceTolerance: 0.85,
        modulation: 'frequent'
    },
    rhythmicStyle: {
        baseTimeSignatures: ['4/4', '3/4', '6/4', '9/8'],
        tempoRange: { min: 40, max: 160 },
        syncopation: 'medium',
        polyrhythmEnabled: true
    }
};

// ============================================================================
// LEITMOTIF TRANSFORMATION RULES
// ============================================================================

export interface LeitmotifTransformation {
    id: string;
    name: string;
    trigger: string;
    musicalOperation: string;
    description: string;
}

export const LEITMOTIF_TRANSFORMATIONS: LeitmotifTransformation[] = [
    {
        id: 'original',
        name: 'Original',
        trigger: 'trauma < 0.3, entropy < 0.3',
        musicalOperation: 'Play motif as written',
        description: 'Normal state - motif presented in its pure form'
    },
    {
        id: 'inverted',
        name: 'Inverted',
        trigger: 'trauma > 0.6',
        musicalOperation: 'Mirror intervals (ascending ↔ descending)',
        description: 'Trauma high - emotional mirror, distorted self-perception'
    },
    {
        id: 'retrograde',
        name: 'Retrograde',
        trigger: 'conflict active',
        musicalOperation: 'Play notes in reverse order',
        description: 'Conflict state - looking backward, opposition'
    },
    {
        id: 'fragmented',
        name: 'Fragmented',
        trigger: 'entropy > 0.6',
        musicalOperation: 'Random notes omitted, rests inserted',
        description: 'High entropy - coherence breaking down'
    },
    {
        id: 'augmented',
        name: 'Augmented',
        trigger: 'resolution approaching',
        musicalOperation: 'Double all note durations',
        description: 'Resolution - spacious, breathing room, conclusion'
    },
    {
        id: 'diminished',
        name: 'Diminished',
        trigger: 'dissociation high',
        musicalOperation: 'Halve all note durations',
        description: 'Dissociation - frantic, compressed, ungrounded'
    },
    {
        id: 'chromatic_descent',
        name: 'Chromatic Descent',
        trigger: 'Real dominant in RSI',
        musicalOperation: 'Add chromatic passing tones descending',
        description: 'Real intrusion - sinking into the unconscious'
    },
    {
        id: 'whole_tone_ascent',
        name: 'Whole-tone Ascent',
        trigger: 'Imaginary dominant in RSI',
        musicalOperation: 'Apply whole-tone scale ascending',
        description: 'Imaginary inflation - dreamlike, floating'
    }
];

// ============================================================================
// ORCHESTRATION OPTION REGISTRY
// ============================================================================

export const ORCHESTRATION_OPTIONS: Record<OrchestrationOption, OrchestrationConfig> = {
    [OrchestrationOption.FULL_ORCHESTRA]: FULL_ORCHESTRA_CONFIG,
    [OrchestrationOption.STRING_QUARTET]: STRING_QUARTET_CONFIG,
    [OrchestrationOption.JAZZ_ENSEMBLE]: JAZZ_ENSEMBLE_CONFIG,
    [OrchestrationOption.LEITMOTIF_WAGNERIAN]: LEITMOTIF_CONFIG
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getRecommendedOption(): OrchestrationConfig {
    return LEITMOTIF_CONFIG;
}

export function getOptionById(id: OrchestrationOption): OrchestrationConfig {
    return ORCHESTRATION_OPTIONS[id];
}

export function getAllOptions(): OrchestrationConfig[] {
    return Object.values(ORCHESTRATION_OPTIONS);
}

export function getInstrumentsForDisc(
    option: OrchestrationOption,
    disc: 'D' | 'I' | 'S' | 'C'
): string[] {
    const config = ORCHESTRATION_OPTIONS[option];
    const voice = config.voiceConfiguration.find(v => v.discMapping === disc);
    return voice?.instruments || [];
}
