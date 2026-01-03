
export interface MusicalStyle {
    id: string;
    name: string;
    description: string;
    orchestrationMode?: string; // Maps to GeniusComposer.OrchestrationMode
    rhythm: {
        base_division: 4 | 8 | 16 | 32;
        syncopation_weight: number; // 0.0 - 1.0 (Higher = more off-beat)
        swing: boolean;
        tempo_range: [number, number];
    };
    harmony: {
        complexity: number; // 0.0 (Triads) - 1.0 (Clusters/Extended)
        dissonance_tolerance: number; // 0.0 (Consonant) - 1.0 (Dissonant)
        preferred_modes: string[];
    };
    texture: {
        density: number; // 0.0 (Sparse) - 1.0 (Dense)
        voice_leading_strictness: number; // 1.0 = Strict Classical, 0.0 = Free
    };
}

export const STYLE_PRESETS: Record<string, MusicalStyle> = {
    'orchestral': {
        id: 'orchestral',
        name: 'Full Orchestra',
        description: 'Grand, sweeping textures with functional harmony and dramatic dynamic range.',
        orchestrationMode: 'FULL_ORCHESTRA',
        rhythm: {
            base_division: 4,
            syncopation_weight: 0.2,
            swing: false,
            tempo_range: [60, 100]
        },
        harmony: {
            complexity: 0.3,
            dissonance_tolerance: 0.4,
            preferred_modes: ['ionian', 'aeolian', 'mixolydian']
        },
        texture: {
            density: 0.8,
            voice_leading_strictness: 0.9
        }
    },
    'chamber_death': {
        id: 'chamber_death',
        name: 'Chamber Death',
        description: 'Intimate darkness. Sparse strings and low woodwinds with high trauma sensitivity and minor modalities.',
        orchestrationMode: 'CHAMBER_QUARTET',
        rhythm: {
            base_division: 8,
            syncopation_weight: 0.3,
            swing: false,
            tempo_range: [40, 70]
        },
        harmony: {
            complexity: 0.6,
            dissonance_tolerance: 0.8,
            preferred_modes: ['phrygian', 'locrian', 'harmonic_minor']
        },
        texture: {
            density: 0.2,
            voice_leading_strictness: 0.85
        }
    },
    'jazz_noir': {
        id: 'jazz_noir',
        name: 'Jazz Noir',
        description: 'Smoke-filled darkness. Muted brass, walking bass, and diminished chords with late-night swing.',
        orchestrationMode: 'BRASS_ENSEMBLE',
        rhythm: {
            base_division: 8,
            syncopation_weight: 0.7,
            swing: true,
            tempo_range: [70, 110]
        },
        harmony: {
            complexity: 0.9,
            dissonance_tolerance: 0.7,
            preferred_modes: ['dorian', 'altered', 'diminished']
        },
        texture: {
            density: 0.4,
            voice_leading_strictness: 0.5
        }
    },
    'wagnerian': {
        id: 'wagnerian',
        name: 'Leitmotif (Wagnerian)',
        description: 'Thematic development and transformation. Each actor\'s leitmotif evolves through harmonic and rhythmic mutations.',
        orchestrationMode: 'LEITMOTIF_WAGNERIAN',
        rhythm: {
            base_division: 4,
            syncopation_weight: 0.1,
            swing: false,
            tempo_range: [50, 90]
        },
        harmony: {
            complexity: 0.7,
            dissonance_tolerance: 0.6,
            preferred_modes: ['chromatic', 'major', 'minor']
        },
        texture: {
            density: 0.9,
            voice_leading_strictness: 0.8
        }
    },
    'minimalist_void': {
        id: 'minimalist_void',
        name: 'Minimalist Void',
        description: 'Extreme sparsity. Single sustained tones, vast silences, and glacial harmonic movement.',
        orchestrationMode: 'MINIMALIST_GLASS',
        rhythm: {
            base_division: 4,
            syncopation_weight: 0.0,
            swing: false,
            tempo_range: [30, 60]
        },
        harmony: {
            complexity: 0.1,
            dissonance_tolerance: 0.2,
            preferred_modes: ['lydian', 'ionian']
        },
        texture: {
            density: 0.1,
            voice_leading_strictness: 0.6
        }
    },
    'cyber_glitch': {
        id: 'cyber_glitch',
        name: 'Cyber Glitch',
        description: 'Digital chaos. Stuttering rhythms, microtonal clusters, and algorithmic fragmentation with high entropy.',
        orchestrationMode: 'FULL_ORCHESTRA', // Uses full palette but with electronic treatment
        rhythm: {
            base_division: 32,
            syncopation_weight: 0.95,
            swing: false,
            tempo_range: [140, 200]
        },
        harmony: {
            complexity: 1.0,
            dissonance_tolerance: 1.0,
            preferred_modes: ['chromatic', 'whole-tone', 'octatonic']
        },
        texture: {
            density: 0.3,
            voice_leading_strictness: 0.0
        }
    },
    'jazz': {
        id: 'jazz',
        name: 'Cool Jazz Ensemble',
        description: 'Extended harmonies (7ths, 9ths), swing rhythms, and improvisational feel.',
        rhythm: {
            base_division: 8,
            syncopation_weight: 0.8,
            swing: true,
            tempo_range: [80, 140]
        },
        harmony: {
            complexity: 0.9,
            dissonance_tolerance: 0.6,
            preferred_modes: ['dorian', 'mixolydian', 'blues']
        },
        texture: {
            density: 0.5,
            voice_leading_strictness: 0.4
        }
    },
    'minimalist': {
        id: 'minimalist',
        name: 'Glass/Reich Minimalism',
        description: 'Repetitive pulse patterns, slowly shifting harmonies, and hypnotic textures.',
        orchestrationMode: 'MINIMALIST_GLASS',
        rhythm: {
            base_division: 8,
            syncopation_weight: 0.1,
            swing: false,
            tempo_range: [110, 160]
        },
        harmony: {
            complexity: 0.2,
            dissonance_tolerance: 0.1,
            preferred_modes: ['ionian', 'lydian']
        },
        texture: {
            density: 0.6,
            voice_leading_strictness: 0.7
        }
    },
    'avant_garde': {
        id: 'avant_garde',
        name: 'Avant-Garde / Atonal',
        description: 'High entropy, jagged rhythms, and complete harmonic freedom.',
        rhythm: {
            base_division: 16,
            syncopation_weight: 0.9,
            swing: false,
            tempo_range: [40, 180]
        },
        harmony: {
            complexity: 1.0,
            dissonance_tolerance: 1.0,
            preferred_modes: ['chromatic', 'whole-tone']
        },
        texture: {
            density: 0.3,
            voice_leading_strictness: 0.1
        }
    },
    'chamber': {
        id: 'chamber',
        name: 'Intimate Chamber',
        description: 'Delicate, transparent textures for emotional dialogue.',
        orchestrationMode: 'CHAMBER_QUARTET',
        rhythm: {
            base_division: 4,
            syncopation_weight: 0.1,
            swing: false,
            tempo_range: [50, 80]
        },
        harmony: {
            complexity: 0.4,
            dissonance_tolerance: 0.3,
            preferred_modes: ['aeolian', 'harmonic_minor']
        },
        texture: {
            density: 0.3,
            voice_leading_strictness: 0.95
        }
    },
    'electronic': {
        id: 'electronic',
        name: 'Dark Electronic',
        description: 'Synthesized textures, steady machine pulses, and minor harmonies.',
        rhythm: {
            base_division: 16,
            syncopation_weight: 0.3,
            swing: false,
            tempo_range: [100, 130]
        },
        harmony: {
            complexity: 0.4,
            dissonance_tolerance: 0.5,
            preferred_modes: ['phrygian', 'locrian']
        },
        texture: {
            density: 0.7,
            voice_leading_strictness: 0.0
        }
    },
    'baroque': {
        id: 'baroque',
        name: 'Baroque Counterpoint',
        description: 'Strict voice leading, ornamented melodies, and driving harmonic rhythm.',
        rhythm: {
            base_division: 16,
            syncopation_weight: 0.1,
            swing: false,
            tempo_range: [80, 120]
        },
        harmony: {
            complexity: 0.3,
            dissonance_tolerance: 0.2,
            preferred_modes: ['ionian', 'harmonic_minor']
        },
        texture: {
            density: 0.6,
            voice_leading_strictness: 1.0
        }
    },
    'romantic': {
        id: 'romantic',
        name: 'Romantic Expressive',
        description: 'Ebb and flow of tempo, lush harmonies, and high emotional dynamic.',
        rhythm: {
            base_division: 8,
            syncopation_weight: 0.2,
            swing: false,
            tempo_range: [40, 100]
        },
        harmony: {
            complexity: 0.6,
            dissonance_tolerance: 0.5,
            preferred_modes: ['major', 'minor']
        },
        texture: {
            density: 0.9,
            voice_leading_strictness: 0.7
        }
    },
    'strings_only': {
        id: 'strings_only',
        name: 'Strings Only',
        description: 'Pure string quartet emotionality with rich harmonic voicing and expressive portamento.',
        orchestrationMode: 'STRINGS_ONLY',
        rhythm: {
            base_division: 8,
            syncopation_weight: 0.2,
            swing: false,
            tempo_range: [50, 100]
        },
        harmony: {
            complexity: 0.5,
            dissonance_tolerance: 0.4,
            preferred_modes: ['aeolian', 'dorian', 'mixolydian']
        },
        texture: {
            density: 0.7,
            voice_leading_strictness: 0.9
        }
    },
    'solo_piano': {
        id: 'solo_piano',
        name: 'Solo Piano',
        description: 'Single instrument reduction with full harmonic expression and intimate dynamics.',
        orchestrationMode: 'SOLO_PIANO',
        rhythm: {
            base_division: 16,
            syncopation_weight: 0.3,
            swing: false,
            tempo_range: [40, 120]
        },
        harmony: {
            complexity: 0.6,
            dissonance_tolerance: 0.5,
            preferred_modes: ['all']
        },
        texture: {
            density: 0.5,
            voice_leading_strictness: 0.7
        }
    }
};
