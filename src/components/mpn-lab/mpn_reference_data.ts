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
// BUILD COMPLETE DICTIONARY
// ============================================================================

export const MPN_REFERENCE_DICTIONARY: MPNReferenceDictionary = {
    version: '2.4.0',
    lastUpdated: new Date().toISOString().split('T')[0],
    totalEntries: 0,
    categories: {
        [MPNCategory.TIMBRE]: TIMBRE_ENTRIES,
        [MPNCategory.RHYTHM]: RHYTHM_ENTRIES,
        [MPNCategory.HARMONY]: HARMONY_ENTRIES,
        [MPNCategory.DYNAMICS]: DYNAMICS_ENTRIES,
        [MPNCategory.MELODY]: MELODY_ENTRIES,
        [MPNCategory.TEXTURE]: TEXTURE_ENTRIES,
        [MPNCategory.MODE]: MODE_ENTRIES,
        [MPNCategory.INTERVALS]: INTERVALS_ENTRIES,
        [MPNCategory.ARTICULATION]: ARTICULATION_ENTRIES,
        [MPNCategory.SILENCE]: SILENCE_ENTRIES
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
