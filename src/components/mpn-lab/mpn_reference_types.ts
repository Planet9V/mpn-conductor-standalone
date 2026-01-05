/**
 * MPN Reference Dictionary - Type Definitions
 * The authoritative source for all musical↔psychometric mappings
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum MPNCategory {
    TIMBRE = 'timbre',
    RHYTHM = 'rhythm',
    HARMONY = 'harmony',
    DYNAMICS = 'dynamics',
    MELODY = 'melody',
    TEXTURE = 'texture',
    MODE = 'mode',
    INTERVALS = 'intervals',
    ARTICULATION = 'articulation',
    SILENCE = 'silence'
}

export enum PsychometricDimension {
    DISC = 'disc',
    BIG_FIVE = 'bigFive',
    DARK_TRIAD = 'darkTriad',
    LACANIAN = 'lacanian',
    COGNITIVE_BIAS = 'cognitiveBias',
    EMOTION = 'emotion',
    TRAUMA = 'trauma',
    ENTROPY = 'entropy',
    RELATIONSHIP = 'relationship',
    STABILITY = 'stability',
    // McKenney-Lacan Physics Frameworks
    PHYSICS = 'physics',           // Hamiltonian, Ising, Granovetter, Lyapunov
    MCKENNEY_LACAN = 'mckenneyLacan'  // Unified theory: RSI calculus, phase transitions
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface MPNReferenceEntry {
    id: string;
    category: MPNCategory;
    subcategory: string;
    musicalElement: string;
    displayName: string;

    // Psychometric mappings
    psychometricMappings: PsychometricMapping[];

    // Implementation details
    implementation: ImplementationDetails;

    // Documentation
    theory: TheoryDocumentation;

    // Adjustability
    adjustable: boolean;
    defaultValue?: number | string;
    range?: { min: number; max: number; step?: number };
}

export interface PsychometricMapping {
    dimension: PsychometricDimension;
    trait?: string;           // e.g., "D" for DISC, "Openness" for Big Five
    condition?: string;       // e.g., "> 0.7" for trauma level
    strength: number;         // 0-1 correlation strength
    description: string;
}

export interface ImplementationDetails {
    midiValue?: number;
    midiRange?: { min: number; max: number };
    frequency?: number;
    frequencyRange?: { min: number; max: number };
    adsr?: ADSREnvelope;
    chordFormula?: number[];
    scaleFormula?: number[];
    bpmRange?: { min: number; max: number };
    velocityRange?: { min: number; max: number };
}

export interface ADSREnvelope {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
}

export interface TheoryDocumentation {
    description: string;
    rationale: string;
    source: string;           // RSCH-XX reference
    examples: string[];
}

// ============================================================================
// CATEGORY-SPECIFIC TYPES
// ============================================================================

export type TimbreSubcategory =
    | 'instrument_family'
    | 'timbre_modulation'
    | 'register'
    | 'adsr_envelope';

export type RhythmSubcategory =
    | 'time_signature'
    | 'tempo'
    | 'syncopation'
    | 'polyrhythm'
    | 'tempo_change';

export type HarmonySubcategory =
    | 'chord_type'
    | 'chord_progression'
    | 'voicing'
    | 'neo_riemannian';

export type DynamicsSubcategory =
    | 'volume_level'
    | 'dynamic_change'
    | 'accent';

export type MelodySubcategory =
    | 'contour'
    | 'leitmotif_transformation'
    | 'interval_profile';

export type TextureSubcategory =
    | 'orchestral_texture'
    | 'background_type'
    | 'density';

export type ModeSubcategory =
    | 'scale_mode'
    | 'chromaticism';

export type IntervalsSubcategory =
    | 'consonance'
    | 'dissonance';

export type ArticulationSubcategory =
    | 'attack_style'
    | 'phrasing';

export type SilenceSubcategory =
    | 'rest_type'
    | 'fermata'
    | 'general_pause';

// ============================================================================
// REFERENCE DICTIONARY INTERFACE
// ============================================================================

export interface MPNReferenceDictionary {
    version: string;
    lastUpdated: string;
    totalEntries: number;
    categories: {
        [key in MPNCategory]: MPNReferenceEntry[];
    };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface ReferenceFilter {
    categories?: MPNCategory[];
    dimensions?: PsychometricDimension[];
    adjustableOnly?: boolean;
    searchTerm?: string;
}

export interface ReferenceViewMode {
    mode: 'table' | 'card' | 'theory' | 'code';
}

// ============================================================================
// PARAMETER ADJUSTMENT TYPES
// ============================================================================

export interface ParameterAdjustment {
    id: string;
    tempo?: number;
    dynamics?: number;
    humanization?: number;
    midiValue?: number;
    velocityOffset?: number;
}
