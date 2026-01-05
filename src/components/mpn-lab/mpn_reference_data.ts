/**
 * MPN Reference Dictionary - Data Entries
 * The authoritative source for all musical↔psychometric mappings
 * 
 * IMPORTANT: Changes to this file directly impact script→JSON conversion
 */

import {
    MPNCategory,
    PsychometricDimension,
    MPNReferenceEntry,
    MPNReferenceDictionary
} from './mpn_reference_types';

// ============================================================================
// CATEGORY 1: TIMBRE (Instrument Sound Quality)
// ============================================================================

const TIMBRE_ENTRIES: MPNReferenceEntry[] = [
    // Instrument Family → DISC
    {
        id: 'timbre-001',
        category: MPNCategory.TIMBRE,
        subcategory: 'instrument_family',
        musicalElement: 'Brass (Trumpet, Trombone, Horn)',
        displayName: 'Brass Family',
        psychometricMappings: [{
            dimension: PsychometricDimension.DISC,
            trait: 'D',
            strength: 0.9,
            description: 'Bold, commanding, penetrating sound reflects Dominance'
        }],
        implementation: {
            midiRange: { min: 56, max: 63 }, // GM Brass range
            frequencyRange: { min: 200, max: 2000 }
        },
        theory: {
            description: 'Brass instruments produce bold, penetrating tones that naturally command attention',
            rationale: 'The physical properties of brass vibration create sound waves that cut through orchestral texture, mirroring assertive personality traits',
            source: 'RSCH-40',
            examples: ['Trumpet fanfare for arrival', 'Horn calls for authority']
        },
        adjustable: false
    },
    {
        id: 'timbre-002',
        category: MPNCategory.TIMBRE,
        subcategory: 'instrument_family',
        musicalElement: 'Woodwinds (Flute, Clarinet, Oboe)',
        displayName: 'Woodwind Family',
        psychometricMappings: [{
            dimension: PsychometricDimension.DISC,
            trait: 'I',
            strength: 0.85,
            description: 'Expressive, soaring melodies reflect Influence'
        }],
        implementation: {
            midiRange: { min: 72, max: 79 }
        },
        theory: {
            description: 'Woodwinds produce warm, singing tones ideal for expressive melodies',
            rationale: 'The breath-driven nature creates human-like phrasing that connects emotionally',
            source: 'RSCH-40',
            examples: ['Flute solo for charm', 'Clarinet for persuasion']
        },
        adjustable: false
    },
    {
        id: 'timbre-003',
        category: MPNCategory.TIMBRE,
        subcategory: 'instrument_family',
        musicalElement: 'Strings (Violin, Viola, Cello)',
        displayName: 'String Family',
        psychometricMappings: [{
            dimension: PsychometricDimension.DISC,
            trait: 'S',
            strength: 0.9,
            description: 'Warm, sustained tones reflect Steadiness'
        }],
        implementation: {
            midiRange: { min: 40, max: 52 }
        },
        theory: {
            description: 'Strings provide the emotional foundation of the orchestra',
            rationale: 'Continuous bow technique allows infinite sustain, representing stability',
            source: 'RSCH-40',
            examples: ['Cello for support', 'Violin for emotional continuity']
        },
        adjustable: false
    },
    {
        id: 'timbre-004',
        category: MPNCategory.TIMBRE,
        subcategory: 'instrument_family',
        musicalElement: 'Keyboard (Piano, Harp, Celesta)',
        displayName: 'Keyboard Family',
        psychometricMappings: [{
            dimension: PsychometricDimension.DISC,
            trait: 'C',
            strength: 0.85,
            description: 'Precise, measured tones reflect Compliance'
        }],
        implementation: {
            midiRange: { min: 0, max: 8 }
        },
        theory: {
            description: 'Keyboard instruments offer precise pitch and dynamic control',
            rationale: 'Equal temperament and mechanical action provide analytical clarity',
            source: 'RSCH-40',
            examples: ['Piano for analysis', 'Harp for structured beauty']
        },
        adjustable: false
    },
    // Dark Triad → Timbre Modulation
    {
        id: 'timbre-005',
        category: MPNCategory.TIMBRE,
        subcategory: 'timbre_modulation',
        musicalElement: 'Muted/Subversive (-10 cents)',
        displayName: 'Machiavellian Timbre',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Machiavellianism',
            condition: '> 0.5',
            strength: 0.95,
            description: 'Slightly flat, muted sound suggests hidden agenda'
        }],
        implementation: {
            adsr: { attack: 0.3, decay: 0.2, sustain: 0.8, release: 0.5 }
        },
        theory: {
            description: 'Detuning and muting create an unsettling, manipulative quality',
            rationale: 'The subtle wrongness mirrors psychological manipulation',
            source: 'RSCH-40',
            examples: ['Muted trumpet for scheming', 'Slightly flat strings for deception']
        },
        adjustable: true,
        defaultValue: -10,
        range: { min: -25, max: 0, step: 1 }
    },
    {
        id: 'timbre-006',
        category: MPNCategory.TIMBRE,
        subcategory: 'timbre_modulation',
        musicalElement: 'Overpowering/Brittle (+5 cents)',
        displayName: 'Narcissistic Timbre',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Narcissism',
            condition: '> 0.5',
            strength: 0.9,
            description: 'Loud, ignores ensemble, slightly sharp'
        }],
        implementation: {
            adsr: { attack: 0.0, decay: 0.1, sustain: 1.0, release: 0.0 },
            velocityRange: { min: 100, max: 127 }
        },
        theory: {
            description: 'Narcissism manifests as dominating the sonic space without regard for others',
            rationale: 'Self-aggrandizement expressed through volume and pitch elevation',
            source: 'RSCH-40',
            examples: ['Solo that drowns out ensemble', 'Ignoring rests']
        },
        adjustable: true,
        defaultValue: 5,
        range: { min: 0, max: 25, step: 1 }
    },
    {
        id: 'timbre-007',
        category: MPNCategory.TIMBRE,
        subcategory: 'timbre_modulation',
        musicalElement: 'Cold/Mechanical (no vibrato)',
        displayName: 'Psychopathic Timbre',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Psychopathy',
            condition: '> 0.5',
            strength: 0.95,
            description: 'Staccato, no vibrato, instant attack/decay'
        }],
        implementation: {
            adsr: { attack: 0.0, decay: 0.5, sustain: 0.0, release: 0.1 }
        },
        theory: {
            description: 'Absence of musical expression mirrors emotional flatness',
            rationale: 'Lack of vibrato and legato suggests absence of empathy',
            source: 'RSCH-40',
            examples: ['Machine-like precision', 'No rubato or phrasing']
        },
        adjustable: false
    },
    // Register → Power hierarchy
    {
        id: 'timbre-008',
        category: MPNCategory.TIMBRE,
        subcategory: 'register',
        musicalElement: 'High Register (2048-4096+ Hz)',
        displayName: 'High Register',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Symbolic',
            strength: 0.7,
            description: 'Upper frequencies suggest authority and vision'
        }],
        implementation: {
            frequencyRange: { min: 2048, max: 8000 }
        },
        theory: {
            description: 'High register carries symbolic authority and prophetic voice',
            rationale: 'Physically higher = socially higher in many cultures',
            source: 'RSCH-41',
            examples: ['Piccolo for proclamations', 'High violin for ideals']
        },
        adjustable: false
    },
    {
        id: 'timbre-009',
        category: MPNCategory.TIMBRE,
        subcategory: 'register',
        musicalElement: 'Low Register (16-256 Hz)',
        displayName: 'Low Register',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Real',
            strength: 0.8,
            description: 'Bass frequencies suggest the unconscious, threat, foundation'
        }],
        implementation: {
            frequencyRange: { min: 16, max: 256 }
        },
        theory: {
            description: 'Low register represents the Real - what lies beneath consciousness',
            rationale: 'Infrasound affects body before mind, like trauma',
            source: 'RSCH-41',
            examples: ['Contrabass for threat', 'Organ pedal for death']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 2: RHYTHM (Beat, Tempo, Time)
// ============================================================================

const RHYTHM_ENTRIES: MPNReferenceEntry[] = [
    // Time Signature → Stability
    {
        id: 'rhythm-001',
        category: MPNCategory.RHYTHM,
        subcategory: 'time_signature',
        musicalElement: '4/4 Common Time',
        displayName: '4/4 Time',
        psychometricMappings: [{
            dimension: PsychometricDimension.ENTROPY,
            condition: '< 0.3',
            strength: 0.9,
            description: 'Stable, predictable rhythm for low entropy'
        }],
        implementation: {},
        theory: {
            description: 'Standard Western meter suggesting normalcy and stability',
            rationale: 'The most common time signature creates expectations of order',
            source: 'RSCH-39',
            examples: ['Normal operations', 'Routine dialogue']
        },
        adjustable: false
    },
    {
        id: 'rhythm-002',
        category: MPNCategory.RHYTHM,
        subcategory: 'time_signature',
        musicalElement: '3/4 Waltz Time',
        displayName: '3/4 Time',
        psychometricMappings: [{
            dimension: PsychometricDimension.ENTROPY,
            condition: '0.3-0.5',
            strength: 0.75,
            description: 'Gentle irregularity, strategic thinking'
        }],
        implementation: {},
        theory: {
            description: 'Triple meter creates gentle forward motion with slight unpredictability',
            rationale: 'The asymmetry introduces mild cognitive engagement',
            source: 'RSCH-39',
            examples: ['Strategic planning', 'Reflective moments']
        },
        adjustable: false
    },
    {
        id: 'rhythm-003',
        category: MPNCategory.RHYTHM,
        subcategory: 'time_signature',
        musicalElement: '5/4 or 7/8 Irregular',
        displayName: 'Irregular Time',
        psychometricMappings: [{
            dimension: PsychometricDimension.ENTROPY,
            condition: '0.6-0.8',
            strength: 0.85,
            description: 'Asymmetric meter creates anxiety'
        }],
        implementation: {},
        theory: {
            description: 'Odd meters disrupt expectations and create unease',
            rationale: 'The brain struggles to predict irregular patterns',
            source: 'Canon Section 6',
            examples: ['Anxiety', 'Hybrid situations', 'Dilemmas']
        },
        adjustable: false
    },
    {
        id: 'rhythm-004',
        category: MPNCategory.RHYTHM,
        subcategory: 'time_signature',
        musicalElement: 'Free/Aleatoric Meter',
        displayName: 'Free Meter',
        psychometricMappings: [{
            dimension: PsychometricDimension.ENTROPY,
            condition: '> 0.8',
            strength: 0.95,
            description: 'Chaotic, unpredictable rhythm for crisis'
        }],
        implementation: {},
        theory: {
            description: 'Absence of regular meter mirrors psychological chaos',
            rationale: 'No predictable pulse = no sense of control',
            source: 'Canon Section 6',
            examples: ['Seldon Crisis', 'Mental breakdown', 'Extreme trauma']
        },
        adjustable: false
    },
    // Tempo → OODA Speed
    {
        id: 'rhythm-005',
        category: MPNCategory.RHYTHM,
        subcategory: 'tempo',
        musicalElement: '40-60 BPM (Largo/Adagio)',
        displayName: 'Slow Tempo',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Strategic',
            strength: 0.8,
            description: 'Slow tempo for boardroom/strategic thinking'
        }],
        implementation: {
            bpmRange: { min: 40, max: 60 }
        },
        theory: {
            description: 'Slow tempo allows for deliberation and long-term planning',
            rationale: 'OODA loops measured in hours or days',
            source: 'RSCH-39',
            examples: ['Executive decisions', 'Long-term strategy']
        },
        adjustable: true,
        defaultValue: 50,
        range: { min: 40, max: 60, step: 2 }
    },
    {
        id: 'rhythm-006',
        category: MPNCategory.RHYTHM,
        subcategory: 'tempo',
        musicalElement: '80-100 BPM (Andante/Moderato)',
        displayName: 'Normal Tempo',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Operational',
            strength: 0.85,
            description: 'Normal tempo for ops floor operations'
        }],
        implementation: {
            bpmRange: { min: 80, max: 100 }
        },
        theory: {
            description: 'Medium tempo reflects normal conversational pace',
            rationale: 'Matches human walking speed and natural dialogue',
            source: 'RSCH-39',
            examples: ['Normal operations', 'Routine work']
        },
        adjustable: true,
        defaultValue: 90,
        range: { min: 80, max: 100, step: 2 }
    },
    {
        id: 'rhythm-007',
        category: MPNCategory.RHYTHM,
        subcategory: 'tempo',
        musicalElement: '120-180 BPM (Allegro/Presto)',
        displayName: 'Fast Tempo',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Crisis',
            strength: 0.9,
            description: 'Fast tempo for war room/crisis response'
        }],
        implementation: {
            bpmRange: { min: 120, max: 180 }
        },
        theory: {
            description: 'Fast tempo creates urgency and stress',
            rationale: 'OODA loops measured in seconds/minutes',
            source: 'RSCH-39',
            examples: ['Incident response', 'Active threats']
        },
        adjustable: true,
        defaultValue: 140,
        range: { min: 120, max: 180, step: 5 }
    },
    // Tempo Changes
    {
        id: 'rhythm-008',
        category: MPNCategory.RHYTHM,
        subcategory: 'tempo_change',
        musicalElement: 'Accelerando',
        displayName: 'Accelerando',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            condition: 'increasing',
            strength: 0.85,
            description: 'Speeding up indicates escalating tension'
        }],
        implementation: {},
        theory: {
            description: 'Gradual tempo increase creates mounting pressure',
            rationale: 'Mimics increasing heart rate under stress',
            source: 'Canon Section 6',
            examples: ['Escalation', 'Approaching climax']
        },
        adjustable: false
    },
    {
        id: 'rhythm-009',
        category: MPNCategory.RHYTHM,
        subcategory: 'tempo_change',
        musicalElement: 'Ritardando',
        displayName: 'Ritardando',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            condition: 'decreasing',
            strength: 0.8,
            description: 'Slowing down indicates resolution or exhaustion'
        }],
        implementation: {},
        theory: {
            description: 'Gradual tempo decrease signals winding down',
            rationale: 'Like slowing breath after exertion',
            source: 'Canon Section 6',
            examples: ['Resolution', 'Post-crisis calm']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 3: HARMONY (Chords, Progressions)
// ============================================================================

const HARMONY_ENTRIES: MPNReferenceEntry[] = [
    // Chord Types → Tension
    {
        id: 'harmony-001',
        category: MPNCategory.HARMONY,
        subcategory: 'chord_type',
        musicalElement: 'Major / Major 7',
        displayName: 'Major Chord',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Joy/Peace',
            strength: 0.9,
            description: 'Resolution, peace, positive state'
        }],
        implementation: {
            chordFormula: [0, 4, 7]
        },
        theory: {
            description: 'Major chords create a sense of resolution and positivity',
            rationale: 'Natural overtone series creates consonance',
            source: 'Canon Section 7',
            examples: ['Happy endings', 'Victory', 'Affirmation']
        },
        adjustable: false
    },
    {
        id: 'harmony-002',
        category: MPNCategory.HARMONY,
        subcategory: 'chord_type',
        musicalElement: 'Minor / Minor 7',
        displayName: 'Minor Chord',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Sadness/Introspection',
            strength: 0.85,
            description: 'Sadness, depth, introspection'
        }],
        implementation: {
            chordFormula: [0, 3, 7]
        },
        theory: {
            description: 'Minor chords create emotional depth and melancholy',
            rationale: 'Lowered third creates tension against expectations',
            source: 'Canon Section 7',
            examples: ['Loss', 'Reflection', 'Memory']
        },
        adjustable: false
    },
    {
        id: 'harmony-003',
        category: MPNCategory.HARMONY,
        subcategory: 'chord_type',
        musicalElement: 'Dominant 7/9',
        displayName: 'Dominant 7th',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Anticipation',
            strength: 0.9,
            description: 'Strong pull, need for resolution'
        }],
        implementation: {
            chordFormula: [0, 4, 7, 10]
        },
        theory: {
            description: 'Dominant seventh creates strong expectation of resolution',
            rationale: 'Tritone interval demands resolution to tonic',
            source: 'Canon Section 7',
            examples: ['Dramatic pause before revelation', 'Cliffhanger']
        },
        adjustable: false
    },
    {
        id: 'harmony-004',
        category: MPNCategory.HARMONY,
        subcategory: 'chord_type',
        musicalElement: 'Diminished / Half-diminished',
        displayName: 'Diminished Chord',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Anxiety/Unease',
            strength: 0.9,
            description: 'Anxiety, instability, approaching danger'
        }],
        implementation: {
            chordFormula: [0, 3, 6]
        },
        theory: {
            description: 'Diminished chords create instability and tension',
            rationale: 'Symmetric structure provides no tonal center',
            source: 'Canon Section 7',
            examples: ['Approaching threat', 'Uncertainty', 'Fear']
        },
        adjustable: false
    },
    {
        id: 'harmony-005',
        category: MPNCategory.HARMONY,
        subcategory: 'chord_type',
        musicalElement: 'Augmented / Tritone',
        displayName: 'Tritone/Crisis Chord',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Crisis',
            strength: 0.95,
            description: 'Maximum tension, rupture, Seldon Crisis'
        }],
        implementation: {
            chordFormula: [0, 4, 8]
        },
        theory: {
            description: 'Tritone is the "diabolus in musica" - maximum harmonic tension',
            rationale: 'Exactly half the octave, provides no direction',
            source: 'Canon Section 7',
            examples: ['Breach', 'Zero-day', 'Catastrophe']
        },
        adjustable: false
    },
    // Neo-Riemannian → Lacanian
    {
        id: 'harmony-006',
        category: MPNCategory.HARMONY,
        subcategory: 'neo_riemannian',
        musicalElement: 'P (Parallel): Major ↔ Minor',
        displayName: 'Parallel Transform',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Real',
            strength: 0.9,
            description: 'Real intrusion - trauma, darkening'
        }],
        implementation: {},
        theory: {
            description: 'Parallel transformation switches mode while maintaining root',
            rationale: 'Same note, different emotional color = trauma intrusion',
            source: 'RSCH-39, Canon Section 11',
            examples: ['C Major → C minor when trauma surfaces']
        },
        adjustable: false
    },
    {
        id: 'harmony-007',
        category: MPNCategory.HARMONY,
        subcategory: 'neo_riemannian',
        musicalElement: 'R (Relative): Major → Relative Minor',
        displayName: 'Relative Transform',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Symbolic',
            strength: 0.85,
            description: 'Symbolic order - lawful, protocol-following'
        }],
        implementation: {},
        theory: {
            description: 'Relative transformation moves to related key',
            rationale: 'Maintaining tonal relationship = following the rules',
            source: 'RSCH-39',
            examples: ['C Major → A minor for structured reflection']
        },
        adjustable: false
    },
    {
        id: 'harmony-008',
        category: MPNCategory.HARMONY,
        subcategory: 'neo_riemannian',
        musicalElement: 'L (Leading-tone): C → Em',
        displayName: 'Leading-tone Transform',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Imaginary',
            strength: 0.8,
            description: 'Imaginary register - interface, appearance'
        }],
        implementation: {},
        theory: {
            description: 'Leading-tone transformation creates chromatic voice motion',
            rationale: 'Subtle shift suggests surface appearance change',
            source: 'RSCH-39',
            examples: ['C Major → E minor for ego/mirror stage']
        },
        adjustable: false
    },
    {
        id: 'harmony-009',
        category: MPNCategory.HARMONY,
        subcategory: 'neo_riemannian',
        musicalElement: 'PLP (Compound): C → D♭',
        displayName: 'PLP Crisis Transform',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Seldon Crisis',
            strength: 0.98,
            description: 'Extreme shift indicating Seldon Crisis'
        }],
        implementation: {},
        theory: {
            description: 'Compound PLP operation creates tritone-related key shift',
            rationale: 'Maximum distance in tonal space = maximum crisis',
            source: 'RSCH-39, Canon Section 16',
            examples: ['Catastrophic revelation', 'Complete paradigm shift']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 4: DYNAMICS (Volume, Accents)
// ============================================================================

const DYNAMICS_ENTRIES: MPNReferenceEntry[] = [
    {
        id: 'dynamics-001',
        category: MPNCategory.DYNAMICS,
        subcategory: 'volume_level',
        musicalElement: 'ppp/pp (pianissimo)',
        displayName: 'Very Soft',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            condition: '0.0-0.2',
            strength: 0.9,
            description: 'Low trauma, peace, rest'
        }],
        implementation: {
            velocityRange: { min: 20, max: 45 }
        },
        theory: {
            description: 'Very soft dynamics indicate peace and minimal disturbance',
            rationale: 'Low energy state mirrors low trauma activation',
            source: 'Canon Section 5',
            examples: ['Calm scenes', 'Sleep', 'Meditation']
        },
        adjustable: true,
        defaultValue: 30,
        range: { min: 1, max: 45, step: 1 }
    },
    {
        id: 'dynamics-002',
        category: MPNCategory.DYNAMICS,
        subcategory: 'volume_level',
        musicalElement: 'mf (mezzo-forte)',
        displayName: 'Medium',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            condition: '0.4-0.6',
            strength: 0.85,
            description: 'Normal engagement, medium trauma'
        }],
        implementation: {
            velocityRange: { min: 60, max: 85 }
        },
        theory: {
            description: 'Medium dynamics for normal conversational engagement',
            rationale: 'Standard activation level for dialogue',
            source: 'Canon Section 5',
            examples: ['Normal dialogue', 'Work scenes']
        },
        adjustable: true,
        defaultValue: 72,
        range: { min: 60, max: 85, step: 1 }
    },
    {
        id: 'dynamics-003',
        category: MPNCategory.DYNAMICS,
        subcategory: 'volume_level',
        musicalElement: 'fff (fortissimo)',
        displayName: 'Very Loud',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            condition: '> 0.8',
            strength: 0.95,
            description: 'Extreme trauma, crisis, explosion'
        }],
        implementation: {
            velocityRange: { min: 110, max: 127 }
        },
        theory: {
            description: 'Maximum dynamics indicate peak emotional/crisis state',
            rationale: 'Fight-or-flight activation at maximum',
            source: 'Canon Section 5',
            examples: ['Confrontation', 'Revelation', 'Violence']
        },
        adjustable: true,
        defaultValue: 118,
        range: { min: 110, max: 127, step: 1 }
    },
    {
        id: 'dynamics-004',
        category: MPNCategory.DYNAMICS,
        subcategory: 'dynamic_change',
        musicalElement: 'Crescendo (< )',
        displayName: 'Crescendo',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            condition: 'increasing',
            strength: 0.9,
            description: 'Rising tension, building threat'
        }],
        implementation: {},
        theory: {
            description: 'Gradual volume increase creates mounting tension',
            rationale: 'Escalation pattern mirrors threat approach',
            source: 'Canon Section 5',
            examples: ['Approaching danger', 'Building argument']
        },
        adjustable: false
    },
    {
        id: 'dynamics-005',
        category: MPNCategory.DYNAMICS,
        subcategory: 'dynamic_change',
        musicalElement: 'Decrescendo (> )',
        displayName: 'Decrescendo',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            condition: 'decreasing',
            strength: 0.85,
            description: 'Fading tension, withdrawal'
        }],
        implementation: {},
        theory: {
            description: 'Gradual volume decrease indicates resolution or retreat',
            rationale: 'De-escalation pattern',
            source: 'Canon Section 5',
            examples: ['Resolution', 'Withdrawal', 'Ending']
        },
        adjustable: false
    },
    {
        id: 'dynamics-006',
        category: MPNCategory.DYNAMICS,
        subcategory: 'accent',
        musicalElement: 'Sforzando (sfz)',
        displayName: 'Sforzando',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Shock/Trigger',
            strength: 0.95,
            description: 'Sudden impact, traumatic trigger'
        }],
        implementation: {},
        theory: {
            description: 'Sudden loud accent creates startle response',
            rationale: 'Mimics sudden trauma activation',
            source: 'Canon Section 5',
            examples: ['Gunshot', 'Revelation', 'Betrayal']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 5: MELODY (Leitmotif, Contour)
// ============================================================================

const MELODY_ENTRIES: MPNReferenceEntry[] = [
    {
        id: 'melody-001',
        category: MPNCategory.MELODY,
        subcategory: 'contour',
        musicalElement: 'Ascending Contour',
        displayName: 'Ascending Melody',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Hope/Ambition',
            strength: 0.85,
            description: 'Rising pitch indicates hope, growth, ambition'
        }],
        implementation: {},
        theory: {
            description: 'Ascending melodic lines create sense of aspiration and positive energy',
            rationale: 'Physical metaphor: rising = improving, growing, ascending',
            source: 'Canon Section 8',
            examples: ['Character revelation', 'Victory moment', 'Epiphany']
        },
        adjustable: false
    },
    {
        id: 'melody-002',
        category: MPNCategory.MELODY,
        subcategory: 'contour',
        musicalElement: 'Descending Contour',
        displayName: 'Descending Melody',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Sadness/Resignation',
            strength: 0.85,
            description: 'Falling pitch indicates decline, sadness, resignation'
        }],
        implementation: {},
        theory: {
            description: 'Descending lines create sense of loss, decline, or resolution',
            rationale: 'Physical metaphor: falling = declining, ending, gravity',
            source: 'Canon Section 8',
            examples: ['Loss', 'Death', 'Farewell', 'Defeat']
        },
        adjustable: false
    },
    {
        id: 'melody-003',
        category: MPNCategory.MELODY,
        subcategory: 'leitmotif_transformation',
        musicalElement: 'Original Motif',
        displayName: 'Original Leitmotif',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            condition: '< 0.3',
            strength: 0.9,
            description: 'Normal state - motif in pure form'
        }],
        implementation: {},
        theory: {
            description: 'Actor motif presented in original form indicates stable state',
            rationale: 'No transformation = no disturbance',
            source: 'Canon Section 8',
            examples: ['Character introduction', 'Normal dialogue']
        },
        adjustable: false
    },
    {
        id: 'melody-004',
        category: MPNCategory.MELODY,
        subcategory: 'leitmotif_transformation',
        musicalElement: 'Inverted Motif (mirror)',
        displayName: 'Inverted Leitmotif',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            condition: '> 0.6',
            strength: 0.9,
            description: 'High trauma - mirror intervals'
        }],
        implementation: {},
        theory: {
            description: 'Motif with all intervals inverted (up becomes down)',
            rationale: 'Inversion represents distorted self-perception under trauma',
            source: 'Canon Section 8',
            examples: ['Trauma surfacing', 'Identity crisis', 'Revelation']
        },
        adjustable: false
    },
    {
        id: 'melody-005',
        category: MPNCategory.MELODY,
        subcategory: 'leitmotif_transformation',
        musicalElement: 'Fragmented Motif (gaps)',
        displayName: 'Fragmented Leitmotif',
        psychometricMappings: [{
            dimension: PsychometricDimension.ENTROPY,
            condition: '> 0.6',
            strength: 0.9,
            description: 'High entropy - notes omitted randomly'
        }],
        implementation: {},
        theory: {
            description: 'Motif with random notes omitted and rests inserted',
            rationale: 'Fragmentation represents breakdown of coherent identity',
            source: 'Canon Section 8',
            examples: ['Dissociation', 'Chaos', 'Mental breakdown']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 6: TEXTURE (Orchestration, Background)
// ============================================================================

const TEXTURE_ENTRIES: MPNReferenceEntry[] = [
    {
        id: 'texture-001',
        category: MPNCategory.TEXTURE,
        subcategory: 'orchestral_texture',
        musicalElement: 'Monophonic (single voice)',
        displayName: 'Monophonic Texture',
        psychometricMappings: [{
            dimension: PsychometricDimension.RELATIONSHIP,
            trait: 'Isolation',
            strength: 0.9,
            description: 'Solo voice indicates isolated action or solitude'
        }],
        implementation: {},
        theory: {
            description: 'Single melodic line without accompaniment',
            rationale: 'One voice = one perspective, isolation, solo action',
            source: 'RSCH-41',
            examples: ['Soliloquy', 'Internal monologue', 'Isolation']
        },
        adjustable: false
    },
    {
        id: 'texture-002',
        category: MPNCategory.TEXTURE,
        subcategory: 'orchestral_texture',
        musicalElement: 'Homophonic (melody + chords)',
        displayName: 'Homophonic Texture',
        psychometricMappings: [{
            dimension: PsychometricDimension.RELATIONSHIP,
            trait: 'Group Consensus',
            strength: 0.85,
            description: 'Unified group moving together'
        }],
        implementation: {},
        theory: {
            description: 'One dominant melody supported by harmonic accompaniment',
            rationale: 'Leader with followers = consensus, agreement',
            source: 'RSCH-41',
            examples: ['Team alignment', 'Unified action', 'Agreement']
        },
        adjustable: false
    },
    {
        id: 'texture-003',
        category: MPNCategory.TEXTURE,
        subcategory: 'orchestral_texture',
        musicalElement: 'Polyphonic (multiple voices)',
        displayName: 'Polyphonic Texture',
        psychometricMappings: [{
            dimension: PsychometricDimension.RELATIONSHIP,
            trait: 'Competing Voices',
            strength: 0.9,
            description: 'Multiple independent voices in counterpoint'
        }],
        implementation: {},
        theory: {
            description: 'Multiple independent melodic lines interweaving',
            rationale: 'Multiple equal voices = competing perspectives, debate',
            source: 'RSCH-41',
            examples: ['Argument', 'Debate', 'Multiple agendas']
        },
        adjustable: false
    },
    {
        id: 'texture-004',
        category: MPNCategory.TEXTURE,
        subcategory: 'background_type',
        musicalElement: 'Drone (sustained note)',
        displayName: 'Drone Background',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Oppression/Foundation',
            strength: 0.8,
            description: 'Unchanging foundation or oppressive weight'
        }],
        implementation: {},
        theory: {
            description: 'Single sustained note underlying all activity',
            rationale: 'Unchanging element represents foundation or oppression',
            source: 'Canon Section 10',
            examples: ['Prison scene', 'Institutional setting', 'Fatalism']
        },
        adjustable: false
    },
    {
        id: 'texture-005',
        category: MPNCategory.TEXTURE,
        subcategory: 'background_type',
        musicalElement: 'Ostinato (repeating pattern)',
        displayName: 'Ostinato Background',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Obsession/Rumination',
            strength: 0.85,
            description: 'Repeating pattern indicates obsessive thinking'
        }],
        implementation: {},
        theory: {
            description: 'Short melodic or rhythmic pattern repeated continuously',
            rationale: 'Repetition mirrors obsessive or intrusive thoughts',
            source: 'Canon Section 10',
            examples: ['Obsessive thoughts', 'Anxiety loop', 'Fixation']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 7: MODE/SCALE
// ============================================================================

const MODE_ENTRIES: MPNReferenceEntry[] = [
    {
        id: 'mode-001',
        category: MPNCategory.MODE,
        subcategory: 'scale_mode',
        musicalElement: 'Ionian (Major Scale)',
        displayName: 'Major/Ionian Mode',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Symbolic',
            strength: 0.9,
            description: 'Symbolic register - law, order, structure'
        }],
        implementation: {
            scaleFormula: [0, 2, 4, 5, 7, 9, 11]
        },
        theory: {
            description: 'Standard major scale represents order and the Symbolic register',
            rationale: 'Most "normal" Western scale = established order',
            source: 'Canon Section 2',
            examples: ['Authority figure speaking', 'Institutional scenes']
        },
        adjustable: false
    },
    {
        id: 'mode-002',
        category: MPNCategory.MODE,
        subcategory: 'scale_mode',
        musicalElement: 'Phrygian/Locrian (dark modes)',
        displayName: 'Phrygian/Locrian Mode',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Real',
            strength: 0.9,
            description: 'Real register - trauma, the unspeakable'
        }],
        implementation: {
            scaleFormula: [0, 1, 3, 5, 7, 8, 10]
        },
        theory: {
            description: 'Dark modes with lowered 2nd represent the Real breaking through',
            rationale: 'Dissonant, "wrong" quality mirrors trauma intrusion',
            source: 'Canon Section 2',
            examples: ['Trauma flashback', 'Horror', 'Death']
        },
        adjustable: false
    },
    {
        id: 'mode-003',
        category: MPNCategory.MODE,
        subcategory: 'scale_mode',
        musicalElement: 'Lydian/Whole-tone (bright/dreamy)',
        displayName: 'Lydian/Whole-tone Mode',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Imaginary',
            strength: 0.85,
            description: 'Imaginary register - ego, fantasy, appearance'
        }],
        implementation: {
            scaleFormula: [0, 2, 4, 6, 8, 10]
        },
        theory: {
            description: 'Ethereal scales represent the Imaginary realm of fantasy',
            rationale: 'Floating, ambiguous quality = dreamlike, ungrounded',
            source: 'Canon Section 2',
            examples: ['Fantasy sequence', 'Ego inflation', 'Delusion']
        },
        adjustable: false
    },
    {
        id: 'mode-004',
        category: MPNCategory.MODE,
        subcategory: 'chromaticism',
        musicalElement: 'Chromatic Scale (all 12 notes)',
        displayName: 'Chromatic',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Transitional',
            strength: 0.85,
            description: 'All semitones - maximum instability, transition'
        }],
        implementation: {
            scaleFormula: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        },
        theory: {
            description: 'No tonal center when all 12 notes are used equally',
            rationale: 'No hierarchy = no stability, constant movement',
            source: 'Canon Section 7',
            examples: ['Transition scene', 'Search/uncertainty', 'Build-up']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 8: INTERVALS
// ============================================================================

const INTERVALS_ENTRIES: MPNReferenceEntry[] = [
    {
        id: 'intervals-001',
        category: MPNCategory.INTERVALS,
        subcategory: 'consonance',
        musicalElement: 'Perfect 5th / Octave',
        displayName: 'Perfect Consonance',
        psychometricMappings: [{
            dimension: PsychometricDimension.RELATIONSHIP,
            trait: 'Total Alignment',
            strength: 0.95,
            description: 'Complete agreement, perfect harmony'
        }],
        implementation: {},
        theory: {
            description: 'Most consonant intervals in Western music',
            rationale: 'Simple frequency ratios = maximum agreement',
            source: 'Canon Section 7',
            examples: ['Allied actors', 'Mentor-student', 'Love duet']
        },
        adjustable: false
    },
    {
        id: 'intervals-002',
        category: MPNCategory.INTERVALS,
        subcategory: 'consonance',
        musicalElement: 'Major/Minor 3rd, 6th',
        displayName: 'Imperfect Consonance',
        psychometricMappings: [{
            dimension: PsychometricDimension.RELATIONSHIP,
            trait: 'Harmony with Individuality',
            strength: 0.8,
            description: 'Agreement while maintaining distinct identity'
        }],
        implementation: {},
        theory: {
            description: 'Consonant but with more color than perfect intervals',
            rationale: 'Sweet but not empty = cooperation with personality',
            source: 'Canon Section 7',
            examples: ['Friendly dialogue', 'Collaboration', 'Partnership']
        },
        adjustable: false
    },
    {
        id: 'intervals-003',
        category: MPNCategory.INTERVALS,
        subcategory: 'dissonance',
        musicalElement: 'Major/Minor 2nd, 7th',
        displayName: 'Mild Dissonance',
        psychometricMappings: [{
            dimension: PsychometricDimension.RELATIONSHIP,
            trait: 'Creative Tension',
            strength: 0.75,
            description: 'Productive disagreement, creative friction'
        }],
        implementation: {},
        theory: {
            description: 'Mild dissonance creates tension that wants resolution',
            rationale: 'Tension without rupture = productive conflict',
            source: 'Canon Section 7',
            examples: ['Debate', 'Friendly argument', 'Creative friction']
        },
        adjustable: false
    },
    {
        id: 'intervals-004',
        category: MPNCategory.INTERVALS,
        subcategory: 'dissonance',
        musicalElement: 'Tritone (augmented 4th)',
        displayName: 'Tritone/Diabolus',
        psychometricMappings: [{
            dimension: PsychometricDimension.RELATIONSHIP,
            trait: 'Rupture/Conflict',
            strength: 0.95,
            description: 'Maximum tension, diabolus in musica'
        }],
        implementation: {},
        theory: {
            description: 'The "devil in music" - maximum harmonic tension',
            rationale: 'Exactly half octave = no direction, maximum conflict',
            source: 'Canon Section 7',
            examples: ['Enemy confrontation', 'Betrayal', 'Irreconcilable conflict']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 9: ARTICULATION
// ============================================================================

const ARTICULATION_ENTRIES: MPNReferenceEntry[] = [
    {
        id: 'articulation-001',
        category: MPNCategory.ARTICULATION,
        subcategory: 'attack_style',
        musicalElement: 'Legato (connected)',
        displayName: 'Legato',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Agreeableness',
            strength: 0.85,
            description: 'Smooth, diplomatic, connected speech'
        }],
        implementation: {},
        theory: {
            description: 'Smooth connection between notes with no breaks',
            rationale: 'Connected = diplomatic, flowing, empathetic',
            source: 'Canon Section 9',
            examples: ['Diplomatic speech', 'Persuasion', 'Empathy']
        },
        adjustable: false
    },
    {
        id: 'articulation-002',
        category: MPNCategory.ARTICULATION,
        subcategory: 'attack_style',
        musicalElement: 'Staccato (detached)',
        displayName: 'Staccato',
        psychometricMappings: [{
            dimension: PsychometricDimension.DISC,
            trait: 'D',
            strength: 0.85,
            description: 'Sharp, decisive, commanding speech'
        }],
        implementation: {},
        theory: {
            description: 'Short, separated notes with silence between',
            rationale: 'Detached = decisive, commanding, efficient',
            source: 'Canon Section 9',
            examples: ['Orders', 'Commands', 'Decisive action']
        },
        adjustable: false
    },
    {
        id: 'articulation-003',
        category: MPNCategory.ARTICULATION,
        subcategory: 'attack_style',
        musicalElement: 'Marcato (emphatic)',
        displayName: 'Marcato',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Emphasis/Assertion',
            strength: 0.9,
            description: 'Strong emphasis on each note'
        }],
        implementation: {},
        theory: {
            description: 'Each note strongly accented',
            rationale: 'Emphatic = assertive, important, demanding attention',
            source: 'Canon Section 9',
            examples: ['Key pronouncements', 'Ultimatums', 'Declarations']
        },
        adjustable: false
    },
    {
        id: 'articulation-004',
        category: MPNCategory.ARTICULATION,
        subcategory: 'attack_style',
        musicalElement: 'Tenuto (sustained)',
        displayName: 'Tenuto',
        psychometricMappings: [{
            dimension: PsychometricDimension.DISC,
            trait: 'C',
            strength: 0.8,
            description: 'Deliberate, thoughtful, considered'
        }],
        implementation: {},
        theory: {
            description: 'Notes held for full value with slight emphasis',
            rationale: 'Deliberate = thoughtful, careful, analytical',
            source: 'Canon Section 9',
            examples: ['Careful explanation', 'Analysis', 'Consideration']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 10: SILENCE
// ============================================================================

const SILENCE_ENTRIES: MPNReferenceEntry[] = [
    {
        id: 'silence-001',
        category: MPNCategory.SILENCE,
        subcategory: 'rest_type',
        musicalElement: 'Short Rest (1-2 beats)',
        displayName: 'Short Rest',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Pause/Breath',
            strength: 0.7,
            description: 'Natural breathing pause in dialogue'
        }],
        implementation: {},
        theory: {
            description: 'Brief silence for natural phrasing',
            rationale: 'Breathing room between thoughts',
            source: 'Canon Section 10',
            examples: ['Sentence break', 'Thought pause', 'Breath']
        },
        adjustable: false
    },
    {
        id: 'silence-002',
        category: MPNCategory.SILENCE,
        subcategory: 'rest_type',
        musicalElement: 'Long Rest (4+ beats)',
        displayName: 'Long Rest',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Contemplation/Absence',
            strength: 0.85,
            description: 'Extended silence for contemplation or absence'
        }],
        implementation: {},
        theory: {
            description: 'Extended silence creates tension or reflection',
            rationale: 'Absence = contemplation, weight, significance',
            source: 'Canon Section 10',
            examples: ['Moment of reflection', 'Weighted pause', 'Absence felt']
        },
        adjustable: false
    },
    {
        id: 'silence-003',
        category: MPNCategory.SILENCE,
        subcategory: 'fermata',
        musicalElement: 'Fermata (suspended time)',
        displayName: 'Fermata',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Suspended Decision',
            strength: 0.9,
            description: 'Time suspended at critical moment'
        }],
        implementation: {},
        theory: {
            description: 'Note or rest held beyond normal duration',
            rationale: 'Time stops = decision point, critical moment',
            source: 'Canon Section 10',
            examples: ['Decision moment', 'Revelation', 'Before the fall']
        },
        adjustable: false
    },
    {
        id: 'silence-004',
        category: MPNCategory.SILENCE,
        subcategory: 'general_pause',
        musicalElement: 'General Pause (G.P.)',
        displayName: 'General Pause',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            trait: 'Shock/Rupture',
            strength: 0.95,
            description: 'Complete silence - shock, rupture, revelation'
        }],
        implementation: {},
        theory: {
            description: 'All voices stop simultaneously',
            rationale: 'Complete silence = maximum impact, world stops',
            source: 'Canon Section 10',
            examples: ['Shocking revelation', 'Death', 'Catastrophe']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 11: OCEAN (BIG FIVE) PERSONALITY MAPPINGS
// Based on RSCH-39 Musical Psychometric Notation Specification
// ============================================================================

const OCEAN_ENTRIES: MPNReferenceEntry[] = [
    // OPENNESS → Harmonic Complexity
    {
        id: 'ocean-001',
        category: MPNCategory.HARMONY,
        subcategory: 'chord_complexity',
        musicalElement: 'Simple Triads (Major/Minor)',
        displayName: 'Low Openness Harmony',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Openness',
            condition: '< 0.3',
            strength: 0.9,
            description: 'Low openness prefers conventional, simple harmonies'
        }],
        implementation: { chordFormula: [0, 4, 7] },
        theory: {
            description: 'Simple triadic harmony reflects preference for convention',
            rationale: 'Low openness = preference for familiar, traditional structures',
            source: 'RSCH-39',
            examples: ['Traditional dialogue', 'Routine operations']
        },
        adjustable: false
    },
    {
        id: 'ocean-002',
        category: MPNCategory.HARMONY,
        subcategory: 'chord_complexity',
        musicalElement: 'Seventh Chords (Maj7, m7, Dom7)',
        displayName: 'Medium Openness Harmony',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Openness',
            condition: '0.3-0.7',
            strength: 0.85,
            description: 'Moderate openness accepts some harmonic color'
        }],
        implementation: { chordFormula: [0, 4, 7, 11] },
        theory: {
            description: 'Extended triads add richness without excess complexity',
            rationale: 'Balanced openness welcomes some novelty within structure',
            source: 'RSCH-39',
            examples: ['Creative discussion', 'Problem-solving']
        },
        adjustable: false
    },
    {
        id: 'ocean-003',
        category: MPNCategory.HARMONY,
        subcategory: 'chord_complexity',
        musicalElement: 'Extended Chords (9th, 11th, 13th)',
        displayName: 'High Openness Harmony',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Openness',
            condition: '> 0.7',
            strength: 0.95,
            description: 'High openness embraces complex, novel harmonies'
        }],
        implementation: { chordFormula: [0, 4, 7, 11, 14, 17, 21] },
        theory: {
            description: 'Highly extended harmonies reflect intellectual curiosity',
            rationale: 'High openness = embrace of complexity and novelty',
            source: 'RSCH-39',
            examples: ['Innovation', 'Artistic expression', 'Paradigm shifts']
        },
        adjustable: false
    },
    // CONSCIENTIOUSNESS → Articulation
    {
        id: 'ocean-004',
        category: MPNCategory.ARTICULATION,
        subcategory: 'precision',
        musicalElement: 'Legato/Rubato (flowing, flexible)',
        displayName: 'Low Conscientiousness Articulation',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Conscientiousness',
            condition: '< 0.3',
            strength: 0.85,
            description: 'Low conscientiousness: flexible, flowing, less structured'
        }],
        implementation: {},
        theory: {
            description: 'Legato with rubato reflects flexible, spontaneous approach',
            rationale: 'Low conscientiousness = less rigid adherence to structure',
            source: 'RSCH-39',
            examples: ['Improvisation', 'Casual conversation', 'Brainstorming']
        },
        adjustable: false
    },
    {
        id: 'ocean-005',
        category: MPNCategory.ARTICULATION,
        subcategory: 'precision',
        musicalElement: 'Portato (semi-detached)',
        displayName: 'Medium Conscientiousness Articulation',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Conscientiousness',
            condition: '0.3-0.7',
            strength: 0.8,
            description: 'Moderate conscientiousness: balanced precision'
        }],
        implementation: {},
        theory: {
            description: 'Portato represents balanced approach to structure',
            rationale: 'Moderate conscientiousness balances flow with clarity',
            source: 'RSCH-39',
            examples: ['Normal operations', 'Standard meetings']
        },
        adjustable: false
    },
    {
        id: 'ocean-006',
        category: MPNCategory.ARTICULATION,
        subcategory: 'precision',
        musicalElement: 'Staccato/Marcato (precise, separated)',
        displayName: 'High Conscientiousness Articulation',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Conscientiousness',
            condition: '> 0.7',
            strength: 0.9,
            description: 'High conscientiousness: precise, measured, exact'
        }],
        implementation: {},
        theory: {
            description: 'Sharp articulation reflects methodical, detail-oriented approach',
            rationale: 'High conscientiousness = precision and clear boundaries',
            source: 'RSCH-39',
            examples: ['Protocol adherence', 'Audit', 'Precise instructions']
        },
        adjustable: false
    },
    // EXTRAVERSION → Volume/Dynamics
    {
        id: 'ocean-007',
        category: MPNCategory.DYNAMICS,
        subcategory: 'volume_level',
        musicalElement: 'Pianissimo (pp) - Very Soft',
        displayName: 'Low Extraversion Dynamics',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Extraversion',
            condition: '< 0.3',
            strength: 0.9,
            description: 'Low extraversion: quiet, reserved, internal'
        }],
        implementation: { velocityRange: { min: 20, max: 40 } },
        theory: {
            description: 'Soft dynamics reflect introverted, reserved energy',
            rationale: 'Low extraversion = less outward projection of energy',
            source: 'RSCH-39',
            examples: ['Internal reflection', 'Solo work', 'Quiet observation']
        },
        adjustable: true,
        defaultValue: 30,
        range: { min: 1, max: 50, step: 1 }
    },
    {
        id: 'ocean-008',
        category: MPNCategory.DYNAMICS,
        subcategory: 'volume_level',
        musicalElement: 'Mezzo-forte (mf) - Medium',
        displayName: 'Medium Extraversion Dynamics',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Extraversion',
            condition: '0.3-0.7',
            strength: 0.85,
            description: 'Moderate extraversion: balanced social energy'
        }],
        implementation: { velocityRange: { min: 60, max: 80 } },
        theory: {
            description: 'Medium dynamics reflect balanced social engagement',
            rationale: 'Ambiversion expressed through moderate projection',
            source: 'RSCH-39',
            examples: ['Normal dialogue', 'Team collaboration']
        },
        adjustable: true,
        defaultValue: 70,
        range: { min: 50, max: 90, step: 1 }
    },
    {
        id: 'ocean-009',
        category: MPNCategory.DYNAMICS,
        subcategory: 'volume_level',
        musicalElement: 'Fortissimo (ff) - Very Loud',
        displayName: 'High Extraversion Dynamics',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Extraversion',
            condition: '> 0.7',
            strength: 0.9,
            description: 'High extraversion: assertive, outgoing, dominant'
        }],
        implementation: { velocityRange: { min: 100, max: 127 } },
        theory: {
            description: 'Loud dynamics reflect extroverted, assertive presence',
            rationale: 'High extraversion = strong outward energy projection',
            source: 'RSCH-39',
            examples: ['Public speaking', 'Leadership presence', 'Enthusiastic engagement']
        },
        adjustable: true,
        defaultValue: 110,
        range: { min: 90, max: 127, step: 1 }
    },
    // AGREEABLENESS → Interval Preference
    {
        id: 'ocean-010',
        category: MPNCategory.INTERVALS,
        subcategory: 'consonance',
        musicalElement: 'Perfect Consonance (Unison, 5th, 8ve)',
        displayName: 'High Agreeableness Intervals',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Agreeableness',
            condition: '> 0.7',
            strength: 0.9,
            description: 'High agreeableness: seeks harmony, avoids conflict'
        }],
        implementation: {},
        theory: {
            description: 'Perfect intervals reflect desire for harmony and agreement',
            rationale: 'High agreeableness = strong preference for consonance',
            source: 'RSCH-39',
            examples: ['Consensus building', 'Supportive dialogue', 'Cooperation']
        },
        adjustable: false
    },
    {
        id: 'ocean-011',
        category: MPNCategory.INTERVALS,
        subcategory: 'consonance',
        musicalElement: 'Imperfect Consonance (3rds, 6ths)',
        displayName: 'Medium Agreeableness Intervals',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Agreeableness',
            condition: '0.3-0.7',
            strength: 0.8,
            description: 'Moderate agreeableness: balanced with individual perspective'
        }],
        implementation: {},
        theory: {
            description: 'Imperfect consonance balances harmony with individuality',
            rationale: 'Moderate agreeableness accepts some tension',
            source: 'RSCH-39',
            examples: ['Collaborative work', 'Healthy debate', 'Partnership']
        },
        adjustable: false
    },
    {
        id: 'ocean-012',
        category: MPNCategory.INTERVALS,
        subcategory: 'dissonance',
        musicalElement: 'Dissonance Tolerance (2nds, 7ths, tritones)',
        displayName: 'Low Agreeableness Intervals',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Agreeableness',
            condition: '< 0.3',
            strength: 0.85,
            description: 'Low agreeableness: comfortable with friction, conflict'
        }],
        implementation: {},
        theory: {
            description: 'Dissonance tolerance reflects comfort with conflict',
            rationale: 'Low agreeableness = willingness to challenge and disagree',
            source: 'RSCH-39',
            examples: ['Challenging authority', 'Confrontation', 'Critical feedback']
        },
        adjustable: false
    },
    // NEUROTICISM → Texture/Vibrato
    {
        id: 'ocean-013',
        category: MPNCategory.TEXTURE,
        subcategory: 'tone_quality',
        musicalElement: 'Clean, Stable Tone (no vibrato)',
        displayName: 'Low Neuroticism Texture',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Neuroticism',
            condition: '< 0.3',
            strength: 0.9,
            description: 'Low neuroticism: emotionally stable, calm, steady'
        }],
        implementation: {},
        theory: {
            description: 'Stable tone reflects emotional equilibrium',
            rationale: 'Low neuroticism = calm, unflappable demeanor',
            source: 'RSCH-39',
            examples: ['Crisis leadership', 'Calm under pressure', 'Steady performance']
        },
        adjustable: false
    },
    {
        id: 'ocean-014',
        category: MPNCategory.TEXTURE,
        subcategory: 'tone_quality',
        musicalElement: 'Moderate Vibrato',
        displayName: 'Medium Neuroticism Texture',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Neuroticism',
            condition: '0.3-0.7',
            strength: 0.8,
            description: 'Moderate neuroticism: normal emotional range'
        }],
        implementation: {},
        theory: {
            description: 'Natural vibrato reflects normal emotional responsiveness',
            rationale: 'Moderate neuroticism = healthy emotional expression',
            source: 'RSCH-39',
            examples: ['Normal stress response', 'Appropriate concern']
        },
        adjustable: false
    },
    {
        id: 'ocean-015',
        category: MPNCategory.TEXTURE,
        subcategory: 'tone_quality',
        musicalElement: 'Wide Vibrato/Tremolo',
        displayName: 'High Neuroticism Texture',
        psychometricMappings: [{
            dimension: PsychometricDimension.BIG_FIVE,
            trait: 'Neuroticism',
            condition: '> 0.7',
            strength: 0.9,
            description: 'High neuroticism: anxious, emotionally volatile'
        }],
        implementation: {},
        theory: {
            description: 'Wide vibrato/tremolo reflects emotional instability',
            rationale: 'High neuroticism = visible anxiety and stress response',
            source: 'RSCH-39',
            examples: ['Anxiety', 'Stress', 'Emotional overwhelm']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 12: COGNITIVE BIASES MUSICAL MAPPINGS
// Based on RSCH-34 Cognitive Bias Catalog & Kahneman-Tversky Framework
// ============================================================================

const COGNITIVE_BIAS_ENTRIES: MPNReferenceEntry[] = [
    // TIER 1: HIGH SECURITY IMPACT BIASES
    {
        id: 'bias-001',
        category: MPNCategory.TIMBRE,
        subcategory: 'authority_cue',
        musicalElement: 'Deep Brass/Organ Pedal',
        displayName: 'Authority Bias Timbre',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Authority',
            strength: 0.95,
            description: 'Deep, institutional tones signal authority presence'
        }],
        implementation: { midiRange: { min: 24, max: 48 } },
        theory: {
            description: 'Low brass and organ pedal convey institutional weight',
            rationale: 'Authority bias triggered by cues of power and status',
            source: 'RSCH-34',
            examples: ['CEO communication', 'Executive presence', 'Institutional announcements']
        },
        adjustable: false
    },
    {
        id: 'bias-002',
        category: MPNCategory.RHYTHM,
        subcategory: 'tempo_change',
        musicalElement: 'Accelerando (speeding up)',
        displayName: 'Scarcity Bias Tempo',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Scarcity',
            strength: 0.9,
            description: 'Increasing tempo creates urgency, triggers scarcity response'
        }],
        implementation: {},
        theory: {
            description: 'Accelerating tempo mirrors time pressure psychology',
            rationale: 'Scarcity bias exploits urgency and fear of missing out',
            source: 'RSCH-34',
            examples: ['Limited time offers', 'Deadline pressure', 'Urgency manipulation']
        },
        adjustable: false
    },
    {
        id: 'bias-003',
        category: MPNCategory.TEXTURE,
        subcategory: 'orchestral_texture',
        musicalElement: 'Tutti/Unison Passage',
        displayName: 'Social Proof Texture',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'SocialProof',
            strength: 0.9,
            description: 'All voices united signals group consensus'
        }],
        implementation: {},
        theory: {
            description: 'Unison represents everyone moving together',
            rationale: 'Social proof bias: following the crowd feels safe',
            source: 'RSCH-34',
            examples: ['Herd behavior', 'Bandwagon effect', 'Group conformity']
        },
        adjustable: false
    },
    {
        id: 'bias-004',
        category: MPNCategory.HARMONY,
        subcategory: 'pedal_point',
        musicalElement: 'Sustained Pedal Tone',
        displayName: 'Anchoring Bias Harmony',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Anchoring',
            strength: 0.85,
            description: 'Unchanging bass note = fixation on first information'
        }],
        implementation: {},
        theory: {
            description: 'Pedal tone represents fixation on initial anchor',
            rationale: 'Anchoring bias: first information dominates judgment',
            source: 'RSCH-34',
            examples: ['Initial price anchor', 'First impression', 'Reference point bias']
        },
        adjustable: false
    },
    {
        id: 'bias-005',
        category: MPNCategory.MELODY,
        subcategory: 'repetition',
        musicalElement: 'Ostinato Pattern (repeating)',
        displayName: 'Confirmation Bias Melody',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Confirmation',
            strength: 0.9,
            description: 'Repetitive pattern = seeking confirming information'
        }],
        implementation: {},
        theory: {
            description: 'Ostinato represents cognitive loops and confirmation seeking',
            rationale: 'Confirmation bias: revisiting same patterns, ignoring disconfirmation',
            source: 'RSCH-34',
            examples: ['Echo chambers', 'Selective attention', 'Belief persistence']
        },
        adjustable: false
    },
    {
        id: 'bias-006',
        category: MPNCategory.DYNAMICS,
        subcategory: 'accent',
        musicalElement: 'Sforzando (sudden loud accent)',
        displayName: 'Availability Heuristic Dynamics',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Availability',
            strength: 0.85,
            description: 'Sudden emphasis = overweighting vivid/recent events'
        }],
        implementation: {},
        theory: {
            description: 'Sforzando mirrors the psychological weight of vivid events',
            rationale: 'Availability heuristic: recent/dramatic events seem more common',
            source: 'RSCH-34',
            examples: ['Recent breach fear', 'Vivid threat memory', 'News-driven anxiety']
        },
        adjustable: false
    },
    // TIER 2: MEDIUM IMPACT BIASES
    {
        id: 'bias-007',
        category: MPNCategory.MELODY,
        subcategory: 'call_response',
        musicalElement: 'Call and Response Pattern',
        displayName: 'Reciprocity Bias Melody',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Reciprocity',
            strength: 0.8,
            description: 'Musical exchange mirrors social obligation to reciprocate'
        }],
        implementation: {},
        theory: {
            description: 'Call-response represents give-and-take dynamic',
            rationale: 'Reciprocity bias: feeling obligated to return favors',
            source: 'RSCH-34',
            examples: ['Social engineering favors', 'Quid pro quo', 'Gift-then-request']
        },
        adjustable: false
    },
    {
        id: 'bias-008',
        category: MPNCategory.RHYTHM,
        subcategory: 'tempo',
        musicalElement: 'Strict Tempo (no rubato)',
        displayName: 'Commitment Bias Rhythm',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Commitment',
            strength: 0.8,
            description: 'Unyielding tempo = sticking to prior commitments'
        }],
        implementation: {},
        theory: {
            description: 'Metronomic tempo represents rigid adherence to past decisions',
            rationale: 'Commitment bias: consistency over rationality',
            source: 'RSCH-34',
            examples: ['Escalation of commitment', 'Consistency traps', 'Prior investment loyalty']
        },
        adjustable: false
    },
    {
        id: 'bias-009',
        category: MPNCategory.HARMONY,
        subcategory: 'chord_type',
        musicalElement: 'Warm Major Chords with Richer Voicing',
        displayName: 'Liking Bias Harmony',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Liking',
            strength: 0.75,
            description: 'Pleasant harmonies for trusted/liked sources'
        }],
        implementation: { chordFormula: [0, 4, 7, 11] },
        theory: {
            description: 'Warm harmony represents favorable treatment of liked sources',
            rationale: 'Liking bias: we trust those we find pleasant',
            source: 'RSCH-34',
            examples: ['Attractive sender phishing', 'Friend impersonation', 'Familiar face trust']
        },
        adjustable: false
    },
    {
        id: 'bias-010',
        category: MPNCategory.MODE,
        subcategory: 'scale_mode',
        musicalElement: 'Major Mode (same data, positive frame)',
        displayName: 'Framing Effect (Positive)',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Framing',
            condition: 'positive',
            strength: 0.9,
            description: 'Major mode for positively framed information'
        }],
        implementation: { scaleFormula: [0, 2, 4, 5, 7, 9, 11] },
        theory: {
            description: 'Major mode signals positive interpretation',
            rationale: 'Framing effect: same info perceived differently by presentation',
            source: 'RSCH-34',
            examples: ['95% effective vs 5% failure rate', 'Gain vs loss framing']
        },
        adjustable: false
    },
    {
        id: 'bias-011',
        category: MPNCategory.MODE,
        subcategory: 'scale_mode',
        musicalElement: 'Minor Mode (same data, negative frame)',
        displayName: 'Framing Effect (Negative)',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Framing',
            condition: 'negative',
            strength: 0.9,
            description: 'Minor mode for negatively framed information'
        }],
        implementation: { scaleFormula: [0, 2, 3, 5, 7, 8, 10] },
        theory: {
            description: 'Minor mode signals negative interpretation',
            rationale: 'Same data feels threatening in minor mode',
            source: 'RSCH-34',
            examples: ['Loss framing', 'Risk emphasis', 'Threat highlighting']
        },
        adjustable: false
    },
    {
        id: 'bias-012',
        category: MPNCategory.MELODY,
        subcategory: 'contour',
        musicalElement: 'Ascending Melody with Crescendo',
        displayName: 'Optimism Bias Melody',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Optimism',
            strength: 0.85,
            description: 'Rising melody = underestimating personal risk'
        }],
        implementation: {},
        theory: {
            description: 'Ascending contour represents unfounded optimism',
            rationale: 'Optimism bias: believing bad things happen to others',
            source: 'RSCH-34',
            examples: ['It wont happen to me', 'Overconfidence in security', 'Risk blindness']
        },
        adjustable: false
    },
    {
        id: 'bias-013',
        category: MPNCategory.TEXTURE,
        subcategory: 'solo_vs_ensemble',
        musicalElement: 'Solo Dominating Over Ensemble',
        displayName: 'Dunning-Kruger Texture',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'DunningKruger',
            strength: 0.9,
            description: 'Solo overwhelming others = overconfidence from incompetence'
        }],
        implementation: {},
        theory: {
            description: 'Dominant solo ignoring ensemble represents false expertise',
            rationale: 'Dunning-Kruger: low ability paired with high confidence',
            source: 'RSCH-34',
            examples: ['I can spot phishing (cant)', 'Overconfident security claims']
        },
        adjustable: false
    },
    {
        id: 'bias-014',
        category: MPNCategory.HARMONY,
        subcategory: 'modulation',
        musicalElement: 'No Modulation (stays in tonic)',
        displayName: 'Status Quo Bias Harmony',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'StatusQuo',
            strength: 0.85,
            description: 'Avoiding key change = resistance to change'
        }],
        implementation: {},
        theory: {
            description: 'Remaining in home key represents preference for current state',
            rationale: 'Status quo bias: change feels risky, current feels safe',
            source: 'RSCH-34',
            examples: ['Resisting security updates', 'Sticking with legacy systems']
        },
        adjustable: false
    },
    {
        id: 'bias-015',
        category: MPNCategory.MELODY,
        subcategory: 'development',
        musicalElement: 'Forced Motif Development Despite Dissonance',
        displayName: 'Sunk Cost Melody',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'SunkCost',
            strength: 0.8,
            description: 'Continuing motif despite poor fit = honoring past investment'
        }],
        implementation: {},
        theory: {
            description: 'Forced development represents continuing bad investments',
            rationale: 'Sunk cost fallacy: past costs shouldnt affect future decisions',
            source: 'RSCH-34',
            examples: ['Already entered password...continue', 'Cant stop now effect']
        },
        adjustable: false
    },
    {
        id: 'bias-016',
        category: MPNCategory.RHYTHM,
        subcategory: 'note_values',
        musicalElement: 'Short Notes for Immediate, Long for Future',
        displayName: 'Hyperbolic Discounting Rhythm',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'HyperbolicDiscounting',
            strength: 0.8,
            description: 'Rhythmic imbalance favoring present over future'
        }],
        implementation: {},
        theory: {
            description: 'Short notes for immediate rewards, long for future consequences',
            rationale: 'Present-bias: immediate small reward > larger future benefit',
            source: 'RSCH-34',
            examples: ['Free gift now vs security later', 'Immediate convenience']
        },
        adjustable: false
    },
    {
        id: 'bias-017',
        category: MPNCategory.DYNAMICS,
        subcategory: 'dynamic_change',
        musicalElement: 'Extreme Dynamic Swings',
        displayName: 'Affect Heuristic Dynamics',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Affect',
            strength: 0.85,
            description: 'Emotion-driven dynamics = decisions based on feeling'
        }],
        implementation: {},
        theory: {
            description: 'Volatile dynamics reflect emotion-driven judgments',
            rationale: 'Affect heuristic: current mood overrides analysis',
            source: 'RSCH-34',
            examples: ['Fear-based decisions', 'Anger-driven responses', 'Mood manipulation']
        },
        adjustable: false
    },
    {
        id: 'bias-018',
        category: MPNCategory.RHYTHM,
        subcategory: 'complexity',
        musicalElement: 'Overcomplex Polyrhythms',
        displayName: 'Illusion of Control Rhythm',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'IllusionOfControl',
            strength: 0.75,
            description: 'Overcomplicated patterns = false sense of mastery'
        }],
        implementation: {},
        theory: {
            description: 'Complex rhythms suggest belief in control over random events',
            rationale: 'Illusion of control: believing we influence uncontrollable outcomes',
            source: 'RSCH-34',
            examples: ['I can handle any threat', 'Overestimating defensive capability']
        },
        adjustable: false
    },
    // TIER 3: ADDITIONAL BIASES
    {
        id: 'bias-019',
        category: MPNCategory.MODE,
        subcategory: 'chromaticism',
        musicalElement: 'Chromatic Uncertainty',
        displayName: 'Ambiguity Effect',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Ambiguity',
            strength: 0.8,
            description: 'Chromatic passages = avoidance of unknown risks'
        }],
        implementation: { scaleFormula: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
        theory: {
            description: 'Chromaticism represents uncertainty and ambiguity aversion',
            rationale: 'People prefer known risks over unknown ones',
            source: 'RSCH-34',
            examples: ['Preferring familiar threats', 'Avoiding novel situations']
        },
        adjustable: false
    },
    {
        id: 'bias-020',
        category: MPNCategory.TEXTURE,
        subcategory: 'crescendo',
        musicalElement: 'Tutti Crescendo (everyone getting louder)',
        displayName: 'Bandwagon Effect',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Bandwagon',
            strength: 0.85,
            description: 'Growing ensemble = joining the crowd'
        }],
        implementation: {},
        theory: {
            description: 'Growing orchestral force represents momentum of crowd joining',
            rationale: 'Bandwagon: doing something because others are doing it',
            source: 'RSCH-34',
            examples: ['Viral trends', 'Group panic', 'Mass behavior']
        },
        adjustable: false
    },
    {
        id: 'bias-021',
        category: MPNCategory.TEXTURE,
        subcategory: 'density',
        musicalElement: 'Cluttered Polyphonic Density',
        displayName: 'Choice Overload Texture',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'ChoiceOverload',
            strength: 0.8,
            description: 'Dense texture = overwhelmed by too many options'
        }],
        implementation: {},
        theory: {
            description: 'Overcrowded texture represents decision paralysis',
            rationale: 'Too many options leads to poor decisions or inaction',
            source: 'RSCH-34',
            examples: ['Too many security tools', 'Alert fatigue', 'Option paralysis']
        },
        adjustable: false
    },
    {
        id: 'bias-022',
        category: MPNCategory.INTERVALS,
        subcategory: 'dissonance',
        musicalElement: 'Unresolved Dissonance',
        displayName: 'Cognitive Dissonance Interval',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'CognitiveDissonance',
            strength: 0.9,
            description: 'Unresolved clashing intervals = conflicting beliefs'
        }],
        implementation: {},
        theory: {
            description: 'Dissonance without resolution represents mental conflict',
            rationale: 'Cognitive dissonance: discomfort from contradictory beliefs',
            source: 'RSCH-34',
            examples: ['Knowing password reuse is bad but doing it anyway']
        },
        adjustable: false
    },
    {
        id: 'bias-023',
        category: MPNCategory.RHYTHM,
        subcategory: 'tempo_change',
        musicalElement: 'Ritardando from Fatigue',
        displayName: 'Decision Fatigue Rhythm',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'DecisionFatigue',
            strength: 0.8,
            description: 'Slowing tempo = degraded decision quality from exhaustion'
        }],
        implementation: {},
        theory: {
            description: 'Ritardando represents mental exhaustion and declining judgment',
            rationale: 'Decision fatigue: quality degrades after many decisions',
            source: 'RSCH-34',
            examples: ['End-of-day security lapses', 'Alert fatigue clicks']
        },
        adjustable: false
    },
    {
        id: 'bias-024',
        category: MPNCategory.MELODY,
        subcategory: 'inversion',
        musicalElement: 'Mirror Inversion (self-blind)',
        displayName: 'Bias Blind Spot',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'BiasBlindSpot',
            strength: 0.85,
            description: 'Mirror reflection = seeing bias in others but not self'
        }],
        implementation: {},
        theory: {
            description: 'Inverted melody represents inability to see own distortions',
            rationale: 'Bias blind spot: recognizing bias in others, not in ourselves',
            source: 'RSCH-34',
            examples: ['Others click phishing, not me', 'Self-exemption']
        },
        adjustable: false
    },
    {
        id: 'bias-025',
        category: MPNCategory.DYNAMICS,
        subcategory: 'dynamic_change',
        musicalElement: 'Gradual Decrescendo (fading compassion)',
        displayName: 'Compassion Fade',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'CompassionFade',
            strength: 0.75,
            description: 'Fading dynamics = less empathy for larger groups'
        }],
        implementation: {},
        theory: {
            description: 'Decrescendo represents emotional numbing to scale',
            rationale: 'One death is tragedy, million is statistic',
            source: 'RSCH-34',
            examples: ['Breach affects 1 vs 10000 users perception']
        },
        adjustable: false
    },
    {
        id: 'bias-026',
        category: MPNCategory.RHYTHM,
        subcategory: 'action_preference',
        musicalElement: 'Continuous Fast Notes (no rests)',
        displayName: 'Action Bias Rhythm',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'ActionBias',
            strength: 0.8,
            description: 'Constant activity = preference for action over inaction'
        }],
        implementation: {},
        theory: {
            description: 'Restless rhythm represents compulsion to act',
            rationale: 'Doing something feels better than waiting, even if suboptimal',
            source: 'RSCH-34',
            examples: ['Panic patching', 'Reactive responses', 'Futile activity']
        },
        adjustable: false
    },
    {
        id: 'bias-027',
        category: MPNCategory.HARMONY,
        subcategory: 'cadence',
        musicalElement: 'Strong Perfect Cadence (I know how it ends)',
        displayName: 'Hindsight Bias',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Hindsight',
            strength: 0.8,
            description: 'Predictable resolution = I knew it all along'
        }],
        implementation: {},
        theory: {
            description: 'Perfect cadence represents the inevitability of hindsight',
            rationale: 'Hindsight bias: outcomes seem predictable after the fact',
            source: 'RSCH-34',
            examples: ['I knew that breach was coming', 'Post-incident rationalization']
        },
        adjustable: false
    },
    {
        id: 'bias-028',
        category: MPNCategory.TEXTURE,
        subcategory: 'solo_vs_ensemble',
        musicalElement: 'Solo Success, Ensemble Failure Attribution',
        displayName: 'Fundamental Attribution Error',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'FundamentalAttribution',
            strength: 0.8,
            description: 'Solo credit, ensemble blame distribution'
        }],
        implementation: {},
        theory: {
            description: 'Asymmetric texture represents attribution asymmetry',
            rationale: 'Attributing others failures to character, own to circumstances',
            source: 'RSCH-34',
            examples: ['User clicked because careless vs I clicked because busy']
        },
        adjustable: false
    },
    {
        id: 'bias-029',
        category: MPNCategory.DYNAMICS,
        subcategory: 'volume_level',
        musicalElement: 'Crescendo on First Mention Only',
        displayName: 'Primacy Effect',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Primacy',
            strength: 0.8,
            description: 'First appearance emphasized = primacy in memory'
        }],
        implementation: {},
        theory: {
            description: 'Strongest dynamics on first occurrence represents primacy',
            rationale: 'First information has disproportionate influence',
            source: 'RSCH-34',
            examples: ['First impression dominance', 'Initial briefing weight']
        },
        adjustable: false
    },
    {
        id: 'bias-030',
        category: MPNCategory.MELODY,
        subcategory: 'ending',
        musicalElement: 'Strong Final Note Emphasis',
        displayName: 'Recency Effect',
        psychometricMappings: [{
            dimension: PsychometricDimension.COGNITIVE_BIAS,
            trait: 'Recency',
            strength: 0.8,
            description: 'Last note most memorable = recency in memory'
        }],
        implementation: {},
        theory: {
            description: 'Emphasized final note represents recency dominance',
            rationale: 'Most recent information remembered best',
            source: 'RSCH-34',
            examples: ['Last threat seen dominates risk perception']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 13: DARK TRIAD EXPANSION
// Extended mappings for Machiavellianism, Narcissism, Psychopathy
// Based on RSCH-33
// ============================================================================

const DARK_TRIAD_EXPANSION: MPNReferenceEntry[] = [
    // MACHIAVELLIANISM Extensions
    {
        id: 'darkt-001',
        category: MPNCategory.RHYTHM,
        subcategory: 'syncopation',
        musicalElement: 'Syncopated Off-beat Accents',
        displayName: 'Machiavellian Rhythm',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Machiavellianism',
            condition: '> 0.6',
            strength: 0.85,
            description: 'Off-beat emphasis = strategic timing, calculated moves'
        }],
        implementation: {},
        theory: {
            description: 'Syncopation represents strategic, calculated timing',
            rationale: 'Machiavellian actors move when others least expect',
            source: 'RSCH-33',
            examples: ['Strategic pause before action', 'Delayed response']
        },
        adjustable: false
    },
    {
        id: 'darkt-002',
        category: MPNCategory.MELODY,
        subcategory: 'approach',
        musicalElement: 'Chromatic Approach Notes',
        displayName: 'Machiavellian Melody',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Machiavellianism',
            condition: '> 0.6',
            strength: 0.8,
            description: 'Chromatic leading tones = subtle manipulation'
        }],
        implementation: {},
        theory: {
            description: 'Chromatic approaches suggest subtle, indirect movement',
            rationale: 'Never approaching goals directly, always obliquely',
            source: 'RSCH-33',
            examples: ['Indirect requests', 'Hidden agenda', 'Subtle manipulation']
        },
        adjustable: false
    },
    {
        id: 'darkt-003',
        category: MPNCategory.TEXTURE,
        subcategory: 'hidden_voice',
        musicalElement: 'Hidden Inner Voice (covert countermelody)',
        displayName: 'Machiavellian Texture',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Machiavellianism',
            condition: '> 0.6',
            strength: 0.9,
            description: 'Hidden line in texture = secret agenda'
        }],
        implementation: {},
        theory: {
            description: 'Hidden countermelody represents covert objectives',
            rationale: 'A second agenda running beneath the surface',
            source: 'RSCH-33',
            examples: ['Hidden motives', 'Parallel objectives', 'Secret plans']
        },
        adjustable: false
    },
    {
        id: 'darkt-004',
        category: MPNCategory.DYNAMICS,
        subcategory: 'sudden_change',
        musicalElement: 'Subito Piano (sudden soft)',
        displayName: 'Machiavellian Dynamics',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Machiavellianism',
            condition: '> 0.6',
            strength: 0.85,
            description: 'Sudden softness = withdrawing to observe, mask intentions'
        }],
        implementation: {},
        theory: {
            description: 'Sudden dynamic drop represents strategic withdrawal',
            rationale: 'Going quiet to observe and plan next move',
            source: 'RSCH-33',
            examples: ['Strategic silence', 'Information gathering', 'Playing possum']
        },
        adjustable: false
    },
    // NARCISSISM Extensions
    {
        id: 'darkt-005',
        category: MPNCategory.DYNAMICS,
        subcategory: 'ensemble_relationship',
        musicalElement: 'Always Fortissimo (ignoring ensemble dynamics)',
        displayName: 'Narcissistic Dynamics',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Narcissism',
            condition: '> 0.6',
            strength: 0.95,
            description: 'Constant loud = dominating sonic space'
        }],
        implementation: { velocityRange: { min: 100, max: 127 } },
        theory: {
            description: 'Narcissism expressed as perpetual dominance in volume',
            rationale: 'Never yielding space to other voices',
            source: 'RSCH-33',
            examples: ['Talking over others', 'Monopolizing attention']
        },
        adjustable: false
    },
    {
        id: 'darkt-006',
        category: MPNCategory.TEXTURE,
        subcategory: 'solo_dominance',
        musicalElement: 'Solo Despite Tutti Marking',
        displayName: 'Narcissistic Texture',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Narcissism',
            condition: '> 0.6',
            strength: 0.9,
            description: 'Playing solo when ensemble expected = self-centeredness'
        }],
        implementation: {},
        theory: {
            description: 'Ignoring tutti to play as soloist',
            rationale: 'Believing oneself is the star regardless of context',
            source: 'RSCH-33',
            examples: ['Interrupting others', 'Main character syndrome']
        },
        adjustable: false
    },
    {
        id: 'darkt-007',
        category: MPNCategory.RHYTHM,
        subcategory: 'duration',
        musicalElement: 'Prolonged Notes Beyond Measure',
        displayName: 'Narcissistic Rhythm',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Narcissism',
            condition: '> 0.6',
            strength: 0.85,
            description: 'Holding notes too long = taking more than share'
        }],
        implementation: {},
        theory: {
            description: 'Extending notes beyond their written value',
            rationale: 'Entitlement to more time and attention than allocated',
            source: 'RSCH-33',
            examples: ['Overstaying welcome', 'Not yielding floor', 'Time entitlement']
        },
        adjustable: false
    },
    {
        id: 'darkt-008',
        category: MPNCategory.MELODY,
        subcategory: 'self_quotation',
        musicalElement: 'Leitmotif Self-Quotation',
        displayName: 'Narcissistic Melody',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Narcissism',
            condition: '> 0.6',
            strength: 0.8,
            description: 'Constantly quoting own theme = self-reference'
        }],
        implementation: {},
        theory: {
            description: 'Excessive quotation of own leitmotif',
            rationale: 'Constantly bringing attention back to self',
            source: 'RSCH-33',
            examples: ['Self-promotion', 'Anecdote recycling', 'Name dropping self']
        },
        adjustable: false
    },
    // PSYCHOPATHY Extensions
    {
        id: 'darkt-009',
        category: MPNCategory.ARTICULATION,
        subcategory: 'uniformity',
        musicalElement: 'Completely Uniform Velocity',
        displayName: 'Psychopathic Articulation',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Psychopathy',
            condition: '> 0.6',
            strength: 0.95,
            description: 'No dynamic variation = no emotional modulation'
        }],
        implementation: {},
        theory: {
            description: 'Robotic uniformity in expression',
            rationale: 'Absence of emotional micro-expressions in performance',
            source: 'RSCH-33',
            examples: ['Flat affect', 'Emotional masking', 'Chilling calm']
        },
        adjustable: false
    },
    {
        id: 'darkt-010',
        category: MPNCategory.HARMONY,
        subcategory: 'harmonic_violation',
        musicalElement: 'Ignoring Harmonic Function',
        displayName: 'Psychopathic Harmony',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Psychopathy',
            condition: '> 0.6',
            strength: 0.9,
            description: 'Playing wrong chords = disregard for social rules'
        }],
        implementation: {},
        theory: {
            description: 'Playing notes that violate harmonic expectations',
            rationale: 'Complete disregard for the rules that bind others',
            source: 'RSCH-33',
            examples: ['Rule breaking', 'Boundary violation', 'Social norm defiance']
        },
        adjustable: false
    },
    {
        id: 'darkt-011',
        category: MPNCategory.RHYTHM,
        subcategory: 'meter_change',
        musicalElement: 'Sudden Meter Changes (unpredictable)',
        displayName: 'Psychopathic Rhythm',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Psychopathy',
            condition: '> 0.6',
            strength: 0.9,
            description: 'Unpredictable meter = impulsive, unpredictable behavior'
        }],
        implementation: {},
        theory: {
            description: 'Random meter changes without pattern',
            rationale: 'Impulsivity expressed as rhythmic unpredictability',
            source: 'RSCH-33',
            examples: ['Impulsive actions', 'Erratic behavior', 'Unpredictability']
        },
        adjustable: false
    },
    {
        id: 'darkt-012',
        category: MPNCategory.SILENCE,
        subcategory: 'general_pause',
        musicalElement: 'Unexpected Long Pause (callous silence)',
        displayName: 'Psychopathic Silence',
        psychometricMappings: [{
            dimension: PsychometricDimension.DARK_TRIAD,
            trait: 'Psychopathy',
            condition: '> 0.6',
            strength: 0.85,
            description: 'Jarring silence = callous disregard for impact'
        }],
        implementation: {},
        theory: {
            description: 'Unexplained, uncomfortable silences',
            rationale: 'Callous indifference to others discomfort',
            source: 'RSCH-33',
            examples: ['Cruel withholding', 'Making others wait', 'Power silence']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 12: LACANIAN ENHANCEMENT (Additional RSI entries)
// ============================================================================

const LACANIAN_ENHANCEMENT: MPNReferenceEntry[] = [
    // Real Register
    {
        id: 'lacan-real-001',
        category: MPNCategory.DYNAMICS,
        subcategory: 'sudden_changes',
        musicalElement: 'Subito Fortissimo',
        displayName: 'Trauma Intrusion (Real)',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Real',
            condition: '> 0.7',
            strength: 0.95,
            description: 'Sudden loud = Real breaking through Symbolic'
        }],
        implementation: { midiVelocityChange: 60 },
        theory: {
            description: 'Sudden fortissimo ruptures the symbolic order',
            rationale: 'The Real irrupts as trauma into conscious experience',
            source: 'RSCH-40',
            examples: ['Sudden crash', 'Unexpected loud chord', 'Traumatic memory']
        },
        adjustable: false
    },
    {
        id: 'lacan-real-002',
        category: MPNCategory.RHYTHM,
        subcategory: 'meter_changes',
        musicalElement: 'Sudden Meter Change',
        displayName: 'Symbolic Disruption (Real)',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Real',
            condition: '> 0.6',
            strength: 0.85,
            description: 'Metric disruption = symbolic order breakdown'
        }],
        implementation: {},
        theory: {
            description: 'Unexpected time signature change',
            rationale: 'The regular pulse represents the Symbolic; its disruption is the Real',
            source: 'RSCH-40',
            examples: ['4/4 to 7/8', 'Rhythmic breakdown', 'Lost pulse']
        },
        adjustable: false
    },
    // Imaginary Register
    {
        id: 'lacan-imag-001',
        category: MPNCategory.MELODY,
        subcategory: 'inversion',
        musicalElement: 'Mirror Inversion',
        displayName: 'Mirror Stage (Imaginary)',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Imaginary',
            condition: '> 0.6',
            strength: 0.85,
            description: 'Melodic inversion = ego reflection'
        }],
        implementation: {},
        theory: {
            description: 'Melody inverted around axis',
            rationale: 'The mirror stage creates the ego through reflected image',
            source: 'RSCH-40',
            examples: ['Retrograde inversion', 'Mirrored phrase', 'Self-reflection']
        },
        adjustable: false
    },
    {
        id: 'lacan-imag-002',
        category: MPNCategory.TEXTURE,
        subcategory: 'effects',
        musicalElement: 'Echo/Reverb',
        displayName: 'Self-Reflection (Imaginary)',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Imaginary',
            condition: '> 0.5',
            strength: 0.75,
            description: 'Echo = narcissistic self-reflection'
        }],
        implementation: {},
        theory: {
            description: 'Heavy reverb or echo effect',
            rationale: 'Sound reflecting back represents imaginary self-relation',
            source: 'RSCH-40',
            examples: ['Cathedral reverb', 'Delayed echo', 'Self-hearing']
        },
        adjustable: true,
        defaultValue: 0.3,
        range: { min: 0, max: 1, step: 0.1 }
    },
    // Symbolic Register
    {
        id: 'lacan-symb-001',
        category: MPNCategory.TEXTURE,
        subcategory: 'counterpoint',
        musicalElement: 'Fugal Counterpoint',
        displayName: 'Structured Discourse (Symbolic)',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Symbolic',
            condition: '> 0.7',
            strength: 0.9,
            description: 'Strict counterpoint = rule-governed discourse'
        }],
        implementation: {},
        theory: {
            description: 'Fugal texture with strict voice leading',
            rationale: 'The Symbolic is the realm of law and language',
            source: 'RSCH-40',
            examples: ['Bach fugue', 'Canon', 'Structured imitation']
        },
        adjustable: false
    },
    {
        id: 'lacan-symb-002',
        category: MPNCategory.MELODY,
        subcategory: 'phrasing',
        musicalElement: 'Consistent Phrasing',
        displayName: 'Rule-Following (Symbolic)',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'Symbolic',
            condition: '> 0.6',
            strength: 0.8,
            description: 'Regular phrases = adherence to law'
        }],
        implementation: {},
        theory: {
            description: 'Regular 4-bar or 8-bar phrases',
            rationale: 'Predictable structure represents internalized rules',
            source: 'RSCH-40',
            examples: ['Classical periodicity', 'Question-answer phrases']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 13: SUPPORTING DIMENSIONS
// ============================================================================

const SUPPORTING_DIMENSION_ENTRIES: MPNReferenceEntry[] = [
    // DISC Hybrids (4 entries)
    {
        id: 'disc-hybrid-001',
        category: MPNCategory.TIMBRE,
        subcategory: 'hybrid_voice',
        musicalElement: 'Brass + Woodwind Doubling',
        displayName: 'D+I Hybrid Voice',
        psychometricMappings: [{
            dimension: PsychometricDimension.DISC,
            trait: 'D+I',
            strength: 0.8,
            description: 'Dominant + Influential = bold yet expressive'
        }],
        implementation: {},
        theory: {
            description: 'Trumpet doubled by clarinet or oboe',
            rationale: 'Combines assertive brass with expressive woodwind',
            source: 'RSCH-39',
            examples: ['Heroic themes', 'Charismatic leadership']
        },
        adjustable: false
    },
    {
        id: 'disc-hybrid-002',
        category: MPNCategory.TIMBRE,
        subcategory: 'hybrid_voice',
        musicalElement: 'Strings + Woodwinds',
        displayName: 'S+C Hybrid Voice',
        psychometricMappings: [{
            dimension: PsychometricDimension.DISC,
            trait: 'S+C',
            strength: 0.8,
            description: 'Steady + Conscientious = warm yet precise'
        }],
        implementation: {},
        theory: {
            description: 'Cello with bassoon doubling',
            rationale: 'Combines emotional depth with analytical precision',
            source: 'RSCH-39',
            examples: ['Thoughtful themes', 'Careful consideration']
        },
        adjustable: false
    },
    {
        id: 'disc-hybrid-003',
        category: MPNCategory.TIMBRE,
        subcategory: 'hybrid_voice',
        musicalElement: 'Brass + Timpani',
        displayName: 'D+C Hybrid Voice',
        psychometricMappings: [{
            dimension: PsychometricDimension.DISC,
            trait: 'D+C',
            strength: 0.85,
            description: 'Dominant + Conscientious = commanding authority'
        }],
        implementation: {},
        theory: {
            description: 'Horn with timpani reinforcement',
            rationale: 'Assertive yet methodical power',
            source: 'RSCH-39',
            examples: ['Executive decisions', 'Strategic leadership']
        },
        adjustable: false
    },
    {
        id: 'disc-hybrid-004',
        category: MPNCategory.TIMBRE,
        subcategory: 'hybrid_voice',
        musicalElement: 'Woodwinds + Strings Ensemble',
        displayName: 'I+S Hybrid Voice',
        psychometricMappings: [{
            dimension: PsychometricDimension.DISC,
            trait: 'I+S',
            strength: 0.8,
            description: 'Influential + Steady = warm social connection'
        }],
        implementation: {},
        theory: {
            description: 'Flute with viola accompaniment',
            rationale: 'Expressive communication with emotional support',
            source: 'RSCH-39',
            examples: ['Team building', 'Supportive relationships']
        },
        adjustable: false
    },
    // Emotion Granularity (6 entries)
    {
        id: 'emotion-anger-001',
        category: MPNCategory.DYNAMICS,
        subcategory: 'emotional_dynamics',
        musicalElement: 'Sforzando Accents',
        displayName: 'Anger Expression',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Anger',
            strength: 0.9,
            description: 'Explosive accents = anger outburst'
        }],
        implementation: { midiVelocity: 120 },
        theory: {
            description: 'Sharp sforzando accents throughout',
            rationale: 'Anger manifests as explosive, punctuated expression',
            source: 'RSCH-39',
            examples: ['Rage', 'Frustration', 'Aggression']
        },
        adjustable: true,
        range: { min: 0, max: 1, step: 0.1 }
    },
    {
        id: 'emotion-fear-001',
        category: MPNCategory.HARMONY,
        subcategory: 'emotional_harmony',
        musicalElement: 'Tritone Tremolo',
        displayName: 'Fear Expression',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Fear',
            strength: 0.85,
            description: 'Tritone + tremolo = dread and anxiety'
        }],
        implementation: {},
        theory: {
            description: 'Sustained tritone with tremolo strings',
            rationale: 'The diabolus in musica creates primal unease',
            source: 'RSCH-39',
            examples: ['Terror', 'Anxiety', 'Dread']
        },
        adjustable: false
    },
    {
        id: 'emotion-surprise-001',
        category: MPNCategory.DYNAMICS,
        subcategory: 'emotional_dynamics',
        musicalElement: 'Subito Piano',
        displayName: 'Surprise Expression',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Surprise',
            strength: 0.8,
            description: 'Sudden quiet = unexpected turn'
        }],
        implementation: {},
        theory: {
            description: 'Sudden drop to piano after loud passage',
            rationale: 'Surprise disrupts expectations',
            source: 'RSCH-39',
            examples: ['Unexpected news', 'Twist', 'Revelation']
        },
        adjustable: false
    },
    {
        id: 'emotion-disgust-001',
        category: MPNCategory.HARMONY,
        subcategory: 'emotional_harmony',
        musicalElement: 'Cluster Chord',
        displayName: 'Disgust Expression',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Disgust',
            strength: 0.85,
            description: 'Dissonant cluster = revulsion'
        }],
        implementation: {},
        theory: {
            description: 'Dense chromatic cluster',
            rationale: 'Maximum dissonance represents rejection',
            source: 'RSCH-39',
            examples: ['Revulsion', 'Rejection', 'Contamination']
        },
        adjustable: false
    },
    {
        id: 'emotion-contempt-001',
        category: MPNCategory.ARTICULATION,
        subcategory: 'emotional_articulation',
        musicalElement: 'Marcato Staccato',
        displayName: 'Contempt Expression',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Contempt',
            strength: 0.8,
            description: 'Clipped, dismissive articulation'
        }],
        implementation: {},
        theory: {
            description: 'Short, accented, and dismissive notes',
            rationale: 'Contempt is brief and cutting',
            source: 'RSCH-39',
            examples: ['Disdain', 'Scorn', 'Dismissal']
        },
        adjustable: false
    },
    {
        id: 'emotion-trust-001',
        category: MPNCategory.HARMONY,
        subcategory: 'emotional_harmony',
        musicalElement: 'Plagal Cadence',
        displayName: 'Trust Expression',
        psychometricMappings: [{
            dimension: PsychometricDimension.EMOTION,
            trait: 'Trust',
            strength: 0.75,
            description: 'Amen cadence = faith and trust'
        }],
        implementation: {},
        theory: {
            description: 'IV-I plagal (amen) cadence',
            rationale: 'The church cadence represents faith',
            source: 'RSCH-39',
            examples: ['Faith', 'Security', 'Reliability']
        },
        adjustable: false
    },
    // Trauma Gradations (4 entries)
    {
        id: 'trauma-subtle-001',
        category: MPNCategory.HARMONY,
        subcategory: 'trauma_level',
        musicalElement: 'Added 6th Chords',
        displayName: 'Subtle Trauma',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            condition: '0.1-0.3',
            strength: 0.5,
            description: 'Minor dissonance = unease'
        }],
        implementation: {},
        theory: {
            description: 'Major chords with added 6th',
            rationale: 'Sweet but with slight tension',
            source: 'RSCH-40',
            examples: ['Mild anxiety', 'Background stress']
        },
        adjustable: false
    },
    {
        id: 'trauma-moderate-001',
        category: MPNCategory.HARMONY,
        subcategory: 'trauma_level',
        musicalElement: 'Minor 7th Chords',
        displayName: 'Moderate Trauma',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            condition: '0.3-0.5',
            strength: 0.65,
            description: 'Melancholic tension'
        }],
        implementation: {},
        theory: {
            description: 'Minor 7th chord progressions',
            rationale: 'Sadness with unresolved tension',
            source: 'RSCH-40',
            examples: ['Grief', 'Lingering pain']
        },
        adjustable: false
    },
    {
        id: 'trauma-severe-001',
        category: MPNCategory.HARMONY,
        subcategory: 'trauma_level',
        musicalElement: 'Diminished 7th Chords',
        displayName: 'Severe Trauma',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            condition: '0.5-0.7',
            strength: 0.85,
            description: 'Crisis-level dissonance'
        }],
        implementation: {},
        theory: {
            description: 'Fully diminished 7th chords',
            rationale: 'Maximum instability without resolution',
            source: 'RSCH-40',
            examples: ['Active crisis', 'Acute distress']
        },
        adjustable: false
    },
    {
        id: 'trauma-catastrophic-001',
        category: MPNCategory.HARMONY,
        subcategory: 'trauma_level',
        musicalElement: 'Chromatic Cluster',
        displayName: 'Catastrophic Trauma',
        psychometricMappings: [{
            dimension: PsychometricDimension.TRAUMA,
            condition: '> 0.7',
            strength: 0.95,
            description: 'Complete harmonic breakdown'
        }],
        implementation: {},
        theory: {
            description: 'Dense chromatic note cluster',
            rationale: 'Total dissolution of tonal center',
            source: 'RSCH-40',
            examples: ['System failure', 'Complete breakdown']
        },
        adjustable: false
    },
    // Entropy Levels (4 entries)
    {
        id: 'entropy-ordered-001',
        category: MPNCategory.RHYTHM,
        subcategory: 'entropy_level',
        musicalElement: 'Steady Pulse',
        displayName: 'Ordered State',
        psychometricMappings: [{
            dimension: PsychometricDimension.ENTROPY,
            condition: '< 0.2',
            strength: 0.3,
            description: 'Predictable, regular pulse'
        }],
        implementation: {},
        theory: {
            description: 'Rock-steady quarter note pulse',
            rationale: 'Low entropy = high predictability',
            source: 'RSCH-40',
            examples: ['Stability', 'Routine', 'Control']
        },
        adjustable: false
    },
    {
        id: 'entropy-fluctuating-001',
        category: MPNCategory.RHYTHM,
        subcategory: 'entropy_level',
        musicalElement: 'Rubato',
        displayName: 'Fluctuating State',
        psychometricMappings: [{
            dimension: PsychometricDimension.ENTROPY,
            condition: '0.2-0.5',
            strength: 0.55,
            description: 'Flexible tempo = normal variation'
        }],
        implementation: {},
        theory: {
            description: 'Expressive tempo fluctuation',
            rationale: 'Healthy entropy = adaptability',
            source: 'RSCH-40',
            examples: ['Flexibility', 'Adaptation', 'Growth']
        },
        adjustable: false
    },
    {
        id: 'entropy-chaotic-001',
        category: MPNCategory.RHYTHM,
        subcategory: 'entropy_level',
        musicalElement: 'Polyrhythm',
        displayName: 'Chaotic State',
        psychometricMappings: [{
            dimension: PsychometricDimension.ENTROPY,
            condition: '0.5-0.8',
            strength: 0.8,
            description: 'Competing rhythms = disorder'
        }],
        implementation: {},
        theory: {
            description: 'Multiple conflicting rhythmic layers',
            rationale: 'High entropy = unpredictability',
            source: 'RSCH-40',
            examples: ['Turbulence', 'Conflict', 'Disorder']
        },
        adjustable: false
    },
    {
        id: 'entropy-critical-001',
        category: MPNCategory.RHYTHM,
        subcategory: 'entropy_level',
        musicalElement: 'Metric Modulation Cascade',
        displayName: 'Critical State',
        psychometricMappings: [{
            dimension: PsychometricDimension.ENTROPY,
            condition: '> 0.8',
            strength: 0.95,
            description: 'Constant metric shifts = breakdown'
        }],
        implementation: {},
        theory: {
            description: 'Rapid successive meter changes',
            rationale: 'Maximum entropy = Seldon Crisis imminent',
            source: 'RSCH-40',
            examples: ['System collapse', 'Critical failure', 'Edge of chaos']
        },
        adjustable: false
    },
    // Relationship Dynamics (4 entries)
    {
        id: 'relation-compete-001',
        category: MPNCategory.TEXTURE,
        subcategory: 'relationship',
        musicalElement: 'Competing Voices',
        displayName: 'Competition Dynamic',
        psychometricMappings: [{
            dimension: PsychometricDimension.RELATIONSHIP,
            trait: 'Competition',
            strength: 0.8,
            description: 'Voices fighting for dominance'
        }],
        implementation: {},
        theory: {
            description: 'Two or more voices in similar register competing',
            rationale: 'Territorial overlap = conflict',
            source: 'RSCH-40',
            examples: ['Rivalry', 'Contest', 'Power struggle']
        },
        adjustable: false
    },
    {
        id: 'relation-collab-001',
        category: MPNCategory.TEXTURE,
        subcategory: 'relationship',
        musicalElement: 'Parallel Motion',
        displayName: 'Collaboration Dynamic',
        psychometricMappings: [{
            dimension: PsychometricDimension.RELATIONSHIP,
            trait: 'Collaboration',
            strength: 0.75,
            description: 'Voices moving together'
        }],
        implementation: {},
        theory: {
            description: 'Voices in parallel thirds or sixths',
            rationale: 'Harmonic agreement = cooperation',
            source: 'RSCH-40',
            examples: ['Partnership', 'Alliance', 'Teamwork']
        },
        adjustable: false
    },
    {
        id: 'relation-confront-001',
        category: MPNCategory.TEXTURE,
        subcategory: 'relationship',
        musicalElement: 'Contrary Motion',
        displayName: 'Confrontation Dynamic',
        psychometricMappings: [{
            dimension: PsychometricDimension.RELATIONSHIP,
            trait: 'Confrontation',
            strength: 0.85,
            description: 'Voices moving in opposite directions'
        }],
        implementation: {},
        theory: {
            description: 'Strict contrary motion between voices',
            rationale: 'Opposition of direction = confrontation',
            source: 'RSCH-40',
            examples: ['Argument', 'Debate', 'Opposition']
        },
        adjustable: false
    },
    {
        id: 'relation-avoid-001',
        category: MPNCategory.TEXTURE,
        subcategory: 'relationship',
        musicalElement: 'Wide Register Separation',
        displayName: 'Avoidance Dynamic',
        psychometricMappings: [{
            dimension: PsychometricDimension.RELATIONSHIP,
            trait: 'Avoidance',
            strength: 0.7,
            description: 'Voices in distant registers'
        }],
        implementation: {},
        theory: {
            description: 'Voices separated by 2+ octaves',
            rationale: 'Maximum distance = avoidance',
            source: 'RSCH-40',
            examples: ['Estrangement', 'Disconnection', 'Isolation']
        },
        adjustable: false
    },
    // Stability States (3 entries)
    {
        id: 'stability-foundation-001',
        category: MPNCategory.HARMONY,
        subcategory: 'stability',
        musicalElement: 'Pedal Point',
        displayName: 'Foundation State',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Foundation',
            strength: 0.85,
            description: 'Sustained bass = solid ground'
        }],
        implementation: {},
        theory: {
            description: 'Sustained tonic pedal throughout',
            rationale: 'Unmovable bass = psychological stability',
            source: 'RSCH-40',
            examples: ['Security', 'Grounding', 'Base']
        },
        adjustable: false
    },
    {
        id: 'stability-transition-001',
        category: MPNCategory.HARMONY,
        subcategory: 'stability',
        musicalElement: 'Modulating Sequence',
        displayName: 'Transition State',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Transition',
            strength: 0.65,
            description: 'Key changes = transformation'
        }],
        implementation: {},
        theory: {
            description: 'Sequential modulation through keys',
            rationale: 'Controlled change = healthy transition',
            source: 'RSCH-40',
            examples: ['Growth', 'Change', 'Development']
        },
        adjustable: false
    },
    {
        id: 'stability-collapse-001',
        category: MPNCategory.HARMONY,
        subcategory: 'stability',
        musicalElement: 'Chromatic Descent',
        displayName: 'Collapse State',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Collapse',
            strength: 0.95,
            description: 'Descending chromaticism = falling apart'
        }],
        implementation: {},
        theory: {
            description: 'Chromatic bass descending to dominant',
            rationale: 'Inexorable descent = structural failure',
            source: 'RSCH-40',
            examples: ['Breakdown', 'Failure', 'Disintegration']
        },
        adjustable: false
    },
    // Borromean Knot - 3 entries
    {
        id: 'borromean-tight-001',
        category: MPNCategory.TEXTURE,
        subcategory: 'borromean',
        musicalElement: 'Tight Three-Voice Canon',
        displayName: 'Borromean Tight Knot',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Borromean',
            condition: 'BSI > 0.8',
            strength: 0.9,
            description: 'Three interlocked voices = Borromean stability'
        }],
        implementation: {},
        theory: {
            description: 'Three voices in strict canon at close intervals',
            rationale: 'The Borromean knot requires all three registers',
            source: 'RSCH-40',
            examples: ['Psychological integration', 'Healthy RSI balance']
        },
        adjustable: false
    },
    {
        id: 'borromean-loose-001',
        category: MPNCategory.TEXTURE,
        subcategory: 'borromean',
        musicalElement: 'Loose Polyphony',
        displayName: 'Borromean Loose Knot',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Borromean',
            condition: 'BSI 0.4-0.8',
            strength: 0.6,
            description: 'Loosely connected voices = weakened integration'
        }],
        implementation: {},
        theory: {
            description: 'Three voices with irregular connections',
            rationale: 'Loose Borromean = beginning disintegration',
            source: 'RSCH-40',
            examples: ['Stress', 'Partial breakdown', 'Recovery phase']
        },
        adjustable: false
    },
    {
        id: 'borromean-broken-001',
        category: MPNCategory.TEXTURE,
        subcategory: 'borromean',
        musicalElement: 'Voice Dropout',
        displayName: 'Borromean Broken Knot',
        psychometricMappings: [{
            dimension: PsychometricDimension.STABILITY,
            trait: 'Borromean',
            condition: 'BSI < 0.4',
            strength: 0.9,
            description: 'Voice drops out = Borromean collapse'
        }],
        implementation: {},
        theory: {
            description: 'One voice suddenly silent',
            rationale: 'Remove any ring and all fall apart',
            source: 'RSCH-40',
            examples: ['Crisis', 'Psychotic break', 'System failure']
        },
        adjustable: false
    },
    {
        id: 'rsi-oscillation-001',
        category: MPNCategory.RHYTHM,
        subcategory: 'rsi_dynamics',
        musicalElement: 'Metric Oscillation',
        displayName: 'RSI Oscillation',
        psychometricMappings: [{
            dimension: PsychometricDimension.LACANIAN,
            trait: 'RSI Balance',
            strength: 0.75,
            description: 'Shifting meter = RSI oscillation'
        }],
        implementation: {},
        theory: {
            description: 'Regular alternation between two time signatures',
            rationale: 'Pendulum between registers',
            source: 'RSCH-40',
            examples: ['Ambivalence', 'Internal conflict', 'Decision making']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 14: PHYSICS FRAMEWORK (Hamiltonian, Ising, Granovetter, Lyapunov)
// ============================================================================

const PHYSICS_FRAMEWORK_ENTRIES: MPNReferenceEntry[] = [
    // Hamiltonian Mechanics
    {
        id: 'physics-hamiltonian-001',
        category: MPNCategory.DYNAMICS,
        subcategory: 'phase_space',
        musicalElement: 'Continuous Crescendo/Decrescendo',
        displayName: 'Hamiltonian Phase Evolution',
        psychometricMappings: [{
            dimension: PsychometricDimension.PHYSICS,
            trait: 'Hamiltonian',
            strength: 0.9,
            description: 'Smooth dynamics = energy-conserving phase space trajectory'
        }],
        implementation: { velocityRange: { min: 30, max: 100 } },
        theory: {
            description: 'Gradual dynamic changes following Hamilton equations dq/dt = ∂H/∂p',
            rationale: 'Psychological states evolve in phase space with conserved emotional energy',
            source: 'MCKENNEY-LACAN-01',
            examples: ['Character growth arc', 'Tension building', 'Resolution trajectory']
        },
        adjustable: true,
        defaultValue: 0.5,
        range: { min: 0, max: 1, step: 0.1 }
    },
    {
        id: 'physics-hamiltonian-002',
        category: MPNCategory.TEMPO,
        subcategory: 'momentum',
        musicalElement: 'Tempo Momentum',
        displayName: 'Psychological Momentum (p)',
        psychometricMappings: [{
            dimension: PsychometricDimension.PHYSICS,
            trait: 'Momentum',
            strength: 0.85,
            description: 'Tempo changes = psychological momentum in phase space'
        }],
        implementation: { bpmRange: { min: 40, max: 180 } },
        theory: {
            description: 'Rate of change represents momentum in Hamiltonian H = T(p) + V(q)',
            rationale: 'Fast tempo = high momentum, slow tempo = low momentum state',
            source: 'MCKENNEY-LACAN-02',
            examples: ['Accelerando during conflict', 'Ritardando during reflection']
        },
        adjustable: true
    },
    // Ising Model
    {
        id: 'physics-ising-001',
        category: MPNCategory.TEXTURE,
        subcategory: 'ensemble',
        musicalElement: 'Ensemble Alignment',
        displayName: 'Ising Spin Alignment',
        psychometricMappings: [{
            dimension: PsychometricDimension.PHYSICS,
            trait: 'Ising',
            strength: 0.9,
            description: 'Orchestral unison = ferromagnetic alignment (J > 0)'
        }],
        implementation: {},
        theory: {
            description: 'Full ensemble playing in unison represents aligned spins',
            rationale: 'Ising model H = -J Σσᵢσⱼ: positive J favors alignment',
            source: 'MCKENNEY-LACAN-03',
            examples: ['Group consensus', 'Collective determination', 'Unity moment']
        },
        adjustable: false
    },
    {
        id: 'physics-ising-002',
        category: MPNCategory.TEXTURE,
        subcategory: 'disorder',
        musicalElement: 'Polytonal Chaos',
        displayName: 'Ising Disorder (T > Tc)',
        psychometricMappings: [{
            dimension: PsychometricDimension.PHYSICS,
            trait: 'Ising',
            condition: 'entropy > 0.7',
            strength: 0.85,
            description: 'Polytonal chaos = high temperature paramagnetic state'
        }],
        implementation: {},
        theory: {
            description: 'Multiple simultaneous keys = disordered spin state above Tc',
            rationale: 'Above critical temperature, thermal fluctuations destroy alignment',
            source: 'MCKENNEY-LACAN-03',
            examples: ['Group fracture', 'Opinion divergence', 'Social breakdown']
        },
        adjustable: false
    },
    {
        id: 'physics-ising-003',
        category: MPNCategory.DYNAMICS,
        subcategory: 'phase_transition',
        musicalElement: 'Sudden Tutti',
        displayName: 'Phase Transition (T = Tc)',
        psychometricMappings: [{
            dimension: PsychometricDimension.PHYSICS,
            trait: 'Critical Point',
            strength: 0.95,
            description: 'Sudden tutti = phase transition at critical temperature'
        }],
        implementation: {},
        theory: {
            description: 'Sudden shift from disorder to order = critical point',
            rationale: 'At Tc, correlation length diverges, small perturbations cascade',
            source: 'MCKENNEY-LACAN-04',
            examples: ['Moment of decision', 'Tipping point', 'Collective action threshold']
        },
        adjustable: false
    },
    // Granovetter Thresholds
    {
        id: 'physics-granovetter-001',
        category: MPNCategory.RHYTHM,
        subcategory: 'cascade',
        musicalElement: 'Rhythmic Cascade Entry',
        displayName: 'Granovetter Cascade (θ threshold)',
        psychometricMappings: [{
            dimension: PsychometricDimension.PHYSICS,
            trait: 'Granovetter',
            strength: 0.9,
            description: 'Sequential instrument entries = threshold cascade activation'
        }],
        implementation: {},
        theory: {
            description: 'Instruments enter sequentially as neighbors exceed threshold θ',
            rationale: 'Agent activates when fraction of active neighbors ≥ θ',
            source: 'MCKENNEY-LACAN-05',
            examples: ['Escalating conflict', 'Spreading enthusiasm', 'Mob psychology']
        },
        adjustable: false
    },
    {
        id: 'physics-granovetter-002',
        category: MPNCategory.ARTICULATION,
        subcategory: 'influence',
        musicalElement: 'Imitative Counterpoint',
        displayName: 'Influence Propagation',
        psychometricMappings: [{
            dimension: PsychometricDimension.PHYSICS,
            trait: 'Network',
            strength: 0.85,
            description: 'Imitative entries = influence spreading through network'
        }],
        implementation: {},
        theory: {
            description: 'Canonical imitation represents influence propagation',
            rationale: 'Ideas spread through weak ties in social networks',
            source: 'MCKENNEY-LACAN-05',
            examples: ['Fugue entries', 'Rumor spreading', 'Emotional contagion']
        },
        adjustable: false
    },
    // Lyapunov Stability
    {
        id: 'physics-lyapunov-001',
        category: MPNCategory.HARMONY,
        subcategory: 'stability',
        musicalElement: 'Stable Tonic Pedal',
        displayName: 'Lyapunov Stable (λ < 0)',
        psychometricMappings: [{
            dimension: PsychometricDimension.PHYSICS,
            trait: 'Lyapunov',
            condition: 'stability > 0.7',
            strength: 0.9,
            description: 'Tonic pedal = negative Lyapunov exponent (stable attractor)'
        }],
        implementation: {},
        theory: {
            description: 'Sustained tonic note = system returning to stable equilibrium',
            rationale: 'Negative λ means perturbations decay, system is predictable',
            source: 'MCKENNEY-LACAN-06',
            examples: ['Grounded character', 'Emotional stability', 'Resolution']
        },
        adjustable: false
    },
    {
        id: 'physics-lyapunov-002',
        category: MPNCategory.HARMONY,
        subcategory: 'chaos',
        musicalElement: 'Chromatic Wandering',
        displayName: 'Lyapunov Chaos (λ > 0)',
        psychometricMappings: [{
            dimension: PsychometricDimension.PHYSICS,
            trait: 'Lyapunov',
            condition: 'entropy > 0.8',
            strength: 0.9,
            description: 'Chromatic wandering = positive Lyapunov exponent (chaos)'
        }],
        implementation: {},
        theory: {
            description: 'Unpredictable chromatic movement = chaotic trajectory',
            rationale: 'Positive λ means exponential divergence, sensitive dependence',
            source: 'MCKENNEY-LACAN-06',
            examples: ['Madness', 'Unpredictable behavior', 'Psychological crisis']
        },
        adjustable: false
    }
];

// ============================================================================
// CATEGORY 15: MCKENNEY-LACAN UNIFIED THEORY
// ============================================================================

const MCKENNEY_LACAN_ENTRIES: MPNReferenceEntry[] = [
    // Trauma-Entropy Calculus
    {
        id: 'ml-calculus-001',
        category: MPNCategory.MODE,
        subcategory: 'trauma_mode',
        musicalElement: 'Phrygian/Locrian Mode',
        displayName: 'High Trauma Modal Shift',
        psychometricMappings: [{
            dimension: PsychometricDimension.MCKENNEY_LACAN,
            trait: 'Trauma-Calculus',
            condition: 'trauma > 0.7',
            strength: 0.95,
            description: 'τ > 0.7 → flat-2 modes (Phrygian, Locrian) for instability'
        }],
        implementation: { scaleFormula: [0, 1, 3, 5, 7, 8, 10] },
        theory: {
            description: 'High trauma triggers modal darkening per McKenney-Lacan calculus',
            rationale: 'Trauma (τ) distorts the symbolic order, manifesting in unsettling modes',
            source: 'MCKENNEY-LACAN-THEOREM',
            examples: ['PTSD flashback', 'Panic scene', 'Traumatic revelation']
        },
        adjustable: false
    },
    {
        id: 'ml-calculus-002',
        category: MPNCategory.RHYTHM,
        subcategory: 'entropy_rhythm',
        musicalElement: 'Irregular Subdivisions',
        displayName: 'High Entropy Rhythmic Fragmentation',
        psychometricMappings: [{
            dimension: PsychometricDimension.MCKENNEY_LACAN,
            trait: 'Entropy-Calculus',
            condition: 'entropy > 0.6',
            strength: 0.9,
            description: 'H > 0.6 → irregular rhythmic subdivisions, unpredictable accents'
        }],
        implementation: {},
        theory: {
            description: 'High entropy drives rhythmic fragmentation',
            rationale: 'Entropy (H) measures system disorder; rhythm reflects cognitive chaos',
            source: 'MCKENNEY-LACAN-THEOREM',
            examples: ['Confusion', 'Information overload', 'Decision paralysis']
        },
        adjustable: false
    },
    // RSI Musical Mappings
    {
        id: 'ml-rsi-001',
        category: MPNCategory.TIMBRE,
        subcategory: 'real_register',
        musicalElement: 'Low Pedal Tones + Percussion',
        displayName: 'Real Register Dominance',
        psychometricMappings: [{
            dimension: PsychometricDimension.MCKENNEY_LACAN,
            trait: 'Real',
            condition: 'rsi.real > 0.5',
            strength: 0.9,
            description: 'Real dominant → bass pedals, timpani, primal sounds'
        }],
        implementation: { midiRange: { min: 24, max: 48 } },
        theory: {
            description: 'The Real manifests in low, visceral, pre-symbolic sounds',
            rationale: 'Real = impossible trauma, raw drives, beyond symbolization',
            source: 'LACAN-SEMINAR-XI',
            examples: ['Bodily fear', 'Death drive', 'Unspeakable horror']
        },
        adjustable: false
    },
    {
        id: 'ml-rsi-002',
        category: MPNCategory.HARMONY,
        subcategory: 'symbolic_register',
        musicalElement: 'Diatonic Resolution',
        displayName: 'Symbolic Register Dominance',
        psychometricMappings: [{
            dimension: PsychometricDimension.MCKENNEY_LACAN,
            trait: 'Symbolic',
            condition: 'rsi.symbolic > 0.5',
            strength: 0.9,
            description: 'Symbolic dominant → clear harmonic function, tonal resolution'
        }],
        implementation: {},
        theory: {
            description: 'The Symbolic manifests in rule-governed harmonic progressions',
            rationale: 'Symbolic = language, law, social order, the Big Other',
            source: 'LACAN-SEMINAR-III',
            examples: ['Rational dialogue', 'Social convention', 'Rule following']
        },
        adjustable: false
    },
    {
        id: 'ml-rsi-003',
        category: MPNCategory.MELODY,
        subcategory: 'imaginary_register',
        musicalElement: 'Ornamental Flourishes',
        displayName: 'Imaginary Register Dominance',
        psychometricMappings: [{
            dimension: PsychometricDimension.MCKENNEY_LACAN,
            trait: 'Imaginary',
            condition: 'rsi.imaginary > 0.5',
            strength: 0.9,
            description: 'Imaginary dominant → ornaments, trills, self-reflective figures'
        }],
        implementation: {},
        theory: {
            description: 'The Imaginary manifests in narcissistic melodic embellishment',
            rationale: 'Imaginary = ego, mirror stage, identification, fantasy',
            source: 'LACAN-SEMINAR-I',
            examples: ['Vanity', 'Self-image', 'Idealized persona']
        },
        adjustable: false
    },
    // Observer Effect
    {
        id: 'ml-observer-001',
        category: MPNCategory.DYNAMICS,
        subcategory: 'audience',
        musicalElement: 'Audience-Aware Dynamics',
        displayName: 'Observer Effect (Gaze)',
        psychometricMappings: [{
            dimension: PsychometricDimension.MCKENNEY_LACAN,
            trait: 'Observer',
            strength: 0.85,
            description: 'Performance awareness = objet petit a as gaze'
        }],
        implementation: {},
        theory: {
            description: 'Being observed changes the performance (quantum measurement)',
            rationale: 'The gaze of the Other (audience) transforms the observed system',
            source: 'MCKENNEY-LACAN-OBSERVER',
            examples: ['Stage presence', 'Public persona vs private', 'Self-consciousness']
        },
        adjustable: false
    },
    // Borromean Knot
    {
        id: 'ml-borromean-001',
        category: MPNCategory.TEXTURE,
        subcategory: 'register_balance',
        musicalElement: 'Three-Voice Counterpoint',
        displayName: 'Borromean Knot Balance',
        psychometricMappings: [{
            dimension: PsychometricDimension.MCKENNEY_LACAN,
            trait: 'Borromean',
            strength: 0.95,
            description: 'Three interlocked voices = RSI knot structure'
        }],
        implementation: {},
        theory: {
            description: 'Three-voice texture where each depends on the others',
            rationale: 'Remove any one register and the psyche unravels',
            source: 'LACAN-SEMINAR-XXII',
            examples: ['Balanced personality', 'Integrated self', 'Psychological health']
        },
        adjustable: false
    },
    // Grand Dictionary Isomorphism
    {
        id: 'ml-isomorphism-001',
        category: MPNCategory.HARMONY,
        subcategory: 'isomorphism',
        musicalElement: 'Eigenvalue Pitch (ν = λ)',
        displayName: 'Isomorphism Φ: Pitch',
        psychometricMappings: [{
            dimension: PsychometricDimension.MCKENNEY_LACAN,
            trait: 'Isomorphism',
            strength: 0.9,
            description: 'Pitch (ν) maps to psychological eigenvalue (λ)'
        }],
        implementation: {},
        theory: {
            description: 'The Grand Dictionary: Pitch = Eigenvalue = Emotional Valence',
            rationale: 'Category-theoretic isomorphism Φ: L → M between logs and music',
            source: 'MCKENNEY-LACAN-CODEX',
            examples: ['High pitch = positive valence', 'Low pitch = negative valence']
        },
        adjustable: false
    },
    {
        id: 'ml-isomorphism-002',
        category: MPNCategory.RHYTHM,
        subcategory: 'isomorphism',
        musicalElement: 'Entropy Rhythm (S = Δt)',
        displayName: 'Isomorphism Φ: Rhythm',
        psychometricMappings: [{
            dimension: PsychometricDimension.MCKENNEY_LACAN,
            trait: 'Isomorphism',
            strength: 0.9,
            description: 'Rhythm (Δt) maps to entropy (S) = cognitive load'
        }],
        implementation: {},
        theory: {
            description: 'The Grand Dictionary: Rhythm = Entropy = Cognitive Load',
            rationale: 'Fast/irregular rhythm = high entropy = processing overload',
            source: 'MCKENNEY-LACAN-CODEX',
            examples: ['Frantic rhythm = overload', 'Steady pulse = calm processing']
        },
        adjustable: false
    }
];

// ============================================================================

export const MPN_REFERENCE_DICTIONARY: MPNReferenceDictionary = {
    version: '3.2.0',
    lastUpdated: '2026-01-04',
    totalEntries: 0,
    categories: {
        [MPNCategory.TIMBRE]: [
            ...TIMBRE_ENTRIES,
            ...COGNITIVE_BIAS_ENTRIES.filter(e => e.category === MPNCategory.TIMBRE),
            ...SUPPORTING_DIMENSION_ENTRIES.filter(e => e.category === MPNCategory.TIMBRE)
        ],
        [MPNCategory.RHYTHM]: [
            ...RHYTHM_ENTRIES,
            ...OCEAN_ENTRIES.filter(e => e.category === MPNCategory.RHYTHM),
            ...COGNITIVE_BIAS_ENTRIES.filter(e => e.category === MPNCategory.RHYTHM),
            ...DARK_TRIAD_EXPANSION.filter(e => e.category === MPNCategory.RHYTHM),
            ...LACANIAN_ENHANCEMENT.filter(e => e.category === MPNCategory.RHYTHM),
            ...SUPPORTING_DIMENSION_ENTRIES.filter(e => e.category === MPNCategory.RHYTHM),
            ...PHYSICS_FRAMEWORK_ENTRIES.filter(e => e.category === MPNCategory.RHYTHM),
            ...MCKENNEY_LACAN_ENTRIES.filter(e => e.category === MPNCategory.RHYTHM)
        ],
        [MPNCategory.HARMONY]: [
            ...HARMONY_ENTRIES,
            ...OCEAN_ENTRIES.filter(e => e.category === MPNCategory.HARMONY),
            ...COGNITIVE_BIAS_ENTRIES.filter(e => e.category === MPNCategory.HARMONY),
            ...DARK_TRIAD_EXPANSION.filter(e => e.category === MPNCategory.HARMONY),
            ...SUPPORTING_DIMENSION_ENTRIES.filter(e => e.category === MPNCategory.HARMONY),
            ...PHYSICS_FRAMEWORK_ENTRIES.filter(e => e.category === MPNCategory.HARMONY),
            ...MCKENNEY_LACAN_ENTRIES.filter(e => e.category === MPNCategory.HARMONY)
        ],
        [MPNCategory.DYNAMICS]: [
            ...DYNAMICS_ENTRIES,
            ...OCEAN_ENTRIES.filter(e => e.category === MPNCategory.DYNAMICS),
            ...COGNITIVE_BIAS_ENTRIES.filter(e => e.category === MPNCategory.DYNAMICS),
            ...DARK_TRIAD_EXPANSION.filter(e => e.category === MPNCategory.DYNAMICS),
            ...LACANIAN_ENHANCEMENT.filter(e => e.category === MPNCategory.DYNAMICS),
            ...SUPPORTING_DIMENSION_ENTRIES.filter(e => e.category === MPNCategory.DYNAMICS),
            ...PHYSICS_FRAMEWORK_ENTRIES.filter(e => e.category === MPNCategory.DYNAMICS),
            ...MCKENNEY_LACAN_ENTRIES.filter(e => e.category === MPNCategory.DYNAMICS)
        ],
        [MPNCategory.MELODY]: [
            ...MELODY_ENTRIES,
            ...COGNITIVE_BIAS_ENTRIES.filter(e => e.category === MPNCategory.MELODY),
            ...DARK_TRIAD_EXPANSION.filter(e => e.category === MPNCategory.MELODY),
            ...LACANIAN_ENHANCEMENT.filter(e => e.category === MPNCategory.MELODY),
            ...MCKENNEY_LACAN_ENTRIES.filter(e => e.category === MPNCategory.MELODY)
        ],
        [MPNCategory.TEXTURE]: [
            ...TEXTURE_ENTRIES,
            ...OCEAN_ENTRIES.filter(e => e.category === MPNCategory.TEXTURE),
            ...COGNITIVE_BIAS_ENTRIES.filter(e => e.category === MPNCategory.TEXTURE),
            ...DARK_TRIAD_EXPANSION.filter(e => e.category === MPNCategory.TEXTURE),
            ...LACANIAN_ENHANCEMENT.filter(e => e.category === MPNCategory.TEXTURE),
            ...SUPPORTING_DIMENSION_ENTRIES.filter(e => e.category === MPNCategory.TEXTURE),
            ...PHYSICS_FRAMEWORK_ENTRIES.filter(e => e.category === MPNCategory.TEXTURE),
            ...MCKENNEY_LACAN_ENTRIES.filter(e => e.category === MPNCategory.TEXTURE)
        ],
        [MPNCategory.MODE]: [
            ...MODE_ENTRIES,
            ...COGNITIVE_BIAS_ENTRIES.filter(e => e.category === MPNCategory.MODE),
            ...MCKENNEY_LACAN_ENTRIES.filter(e => e.category === MPNCategory.MODE)
        ],
        [MPNCategory.INTERVALS]: [
            ...INTERVALS_ENTRIES,
            ...OCEAN_ENTRIES.filter(e => e.category === MPNCategory.INTERVALS),
            ...COGNITIVE_BIAS_ENTRIES.filter(e => e.category === MPNCategory.INTERVALS)
        ],
        [MPNCategory.ARTICULATION]: [
            ...ARTICULATION_ENTRIES,
            ...OCEAN_ENTRIES.filter(e => e.category === MPNCategory.ARTICULATION),
            ...DARK_TRIAD_EXPANSION.filter(e => e.category === MPNCategory.ARTICULATION),
            ...SUPPORTING_DIMENSION_ENTRIES.filter(e => e.category === MPNCategory.ARTICULATION),
            ...PHYSICS_FRAMEWORK_ENTRIES.filter(e => e.category === MPNCategory.ARTICULATION)
        ],
        [MPNCategory.SILENCE]: [
            ...SILENCE_ENTRIES,
            ...DARK_TRIAD_EXPANSION.filter(e => e.category === MPNCategory.SILENCE)
        ],
        [MPNCategory.TIMBRE]: [
            ...TIMBRE_ENTRIES,
            ...OCEAN_ENTRIES.filter(e => e.category === MPNCategory.TIMBRE),
            ...COGNITIVE_BIAS_ENTRIES.filter(e => e.category === MPNCategory.TIMBRE),
            ...DARK_TRIAD_EXPANSION.filter(e => e.category === MPNCategory.TIMBRE),
            ...SUPPORTING_DIMENSION_ENTRIES.filter(e => e.category === MPNCategory.TIMBRE),
            ...MCKENNEY_LACAN_ENTRIES.filter(e => e.category === MPNCategory.TIMBRE)
        ]
    }
};

// Calculate total entries
MPN_REFERENCE_DICTIONARY.totalEntries = Object.values(MPN_REFERENCE_DICTIONARY.categories)
    .reduce((sum, entries) => sum + entries.length, 0);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getEntriesByCategory(category: MPNCategory): MPNReferenceEntry[] {
    return MPN_REFERENCE_DICTIONARY.categories[category];
}

export function getEntryById(id: string): MPNReferenceEntry | undefined {
    for (const entries of Object.values(MPN_REFERENCE_DICTIONARY.categories)) {
        const found = entries.find(e => e.id === id);
        if (found) return found;
    }
    return undefined;
}

export function searchEntries(term: string): MPNReferenceEntry[] {
    const lowerTerm = term.toLowerCase();
    const results: MPNReferenceEntry[] = [];

    for (const entries of Object.values(MPN_REFERENCE_DICTIONARY.categories)) {
        for (const entry of entries) {
            if (
                entry.displayName.toLowerCase().includes(lowerTerm) ||
                entry.musicalElement.toLowerCase().includes(lowerTerm) ||
                entry.theory.description.toLowerCase().includes(lowerTerm)
            ) {
                results.push(entry);
            }
        }
    }
    return results;
}

export function getAdjustableEntries(): MPNReferenceEntry[] {
    const results: MPNReferenceEntry[] = [];
    for (const entries of Object.values(MPN_REFERENCE_DICTIONARY.categories)) {
        results.push(...entries.filter(e => e.adjustable));
    }
    return results;
}
