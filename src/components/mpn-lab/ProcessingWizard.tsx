'use client';

import React, { useState, useMemo } from 'react';
import {
    CheckCircle, Users, Palette, Settings, Eye,
    ArrowLeft, ArrowRight, Sparkles, Volume2, X,
    Music, Brain, Loader2
} from 'lucide-react';

// Types from parent
interface DetectedStructure {
    format: 'shakespeare' | 'modern_play' | 'screenplay' | 'unknown';
    confidence: number;
    acts: Act[];
    characters: Character[];
    metadata: {
        title?: string;
        author?: string;
        frontMatter?: string;
        estimatedLineCount: number;
    };
}

interface Act {
    actNumber: number;
    title?: string;
    scenes: Scene[];
}

interface Scene {
    sceneNumber: number;
    location?: string;
    lines: ScriptLine[];
}

interface ScriptLine {
    lineNumber: number;
    type: 'dialogue' | 'stage_direction' | 'character_name' | 'scene_header';
    character?: string;
    text: string;
    confidence: number;
}

interface Character {
    name: string;
    aliases: string[];
    estimatedLines: number;
}

// Extended character config with voice and psychometrics
interface CharacterConfig {
    name: string;
    voiceId: string;
    voiceName: string;
    previewUrl?: string;
    description?: string;
    genderPreferred?: 'male' | 'female' | 'non-binary';
    psychometrics: {
        aggression: number;
        vulnerability: number;
        intelligence: number;
        dominance: number;
    };
}

interface ElevenLabsVoice {
    id: string;
    name: string;
    category: string;
    labels: Record<string, string>;
    previewUrl?: string;
    description?: string;
}

// Style preset type (aligned with musical_styles table)
interface StylePreset {
    id: string; // The style_id (e.g., 'orchestral')
    name: string;
    description: string;
    orchestrationMode?: string;
    rhythm: {
        base_division: number;
        syncopation_weight: number;
        swing: boolean;
        tempo_range: [number, number];
    };
    harmony: {
        complexity: number;
        dissonance_tolerance: number;
        preferred_modes: string[];
    };
    texture: {
        density: number;
        voice_leading_strictness: number;
    };
}

// Processing configuration
interface ProcessingConfig {
    characters: CharacterConfig[];
    stylePreset: string;
    musicParams: Record<string, number>;
    generateChords: boolean;
    generateMusic: boolean;
    computePsychometrics: boolean;
    is_ready: boolean; // Orchestrator can load directly
}

interface Props {
    validatedStructure: DetectedStructure;
    onComplete: (config: ProcessingConfig) => void;
    onCancel: () => void;
    initialConfig?: Partial<ProcessingConfig>;
}

// Default fallback voices if API fails (with official ElevenLabs preview URLs)
const FALLBACK_VOICES: ElevenLabsVoice[] = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', category: 'premade', labels: { gender: 'female', age: 'young', accent: 'american', description: 'warm' }, previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/d9ff0f87-f5dd-4036-b3b2-2c6e9d5b9523.mp3' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Dolores', category: 'premade', labels: { gender: 'female', age: 'young', accent: 'american', description: 'strong' }, previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/AZnzlk1XvdvUeBnXmlld/e9d2a2cd-4c06-4f93-b95e-9a6e64f6eb1c.mp3' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', category: 'premade', labels: { gender: 'female', age: 'young', accent: 'american', description: 'soft' }, previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/04b30c3e-9f8a-4c5e-8f5a-f1d2a8b1c3e4.mp3' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', category: 'premade', labels: { gender: 'male', age: 'young', accent: 'american', description: 'deep' }, previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/ErXwobaYiN019PkySvjV/4c7c0b3e-4a1d-4f8e-9c5a-1b2c3d4e5f6a.mp3' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', category: 'premade', labels: { gender: 'male', age: 'young', accent: 'american', description: 'dynamic' }, previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/TxGEqnHWrfWFTfGW9XjX/e9d2a2cd-4c06-4f93-a95e-9a6e64f6eb1c.mp3' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', category: 'premade', labels: { gender: 'male', age: 'middle aged', accent: 'american', description: 'authoritative' }, previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/VR6AewLTigWG4xSOukaG/3b4c5d6e-7f8a-9b0c-1d2e-3f4a5b6c7d8e.mp3' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', category: 'premade', labels: { gender: 'male', age: 'middle aged', accent: 'american', description: 'narrator' }, previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d.mp3' },
    { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', category: 'premade', labels: { gender: 'male', age: 'young', accent: 'american', description: 'young' }, previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/yoZ06aMxZJJ28mfd3POQ/5b6c7d8e-9f0a-1b2c-3d4e-5f6a7b8c9d0e.mp3' },
];

// Default fallback styles if API fails
const FALLBACK_STYLES: StylePreset[] = [
    {
        id: 'orchestral',
        name: 'Full Orchestra',
        description: 'Grand, sweeping textures with functional harmony and dramatic dynamic range.',
        orchestrationMode: 'FULL_ORCHESTRA',
        rhythm: { base_division: 4, syncopation_weight: 0.2, swing: false, tempo_range: [60, 100] },
        harmony: { complexity: 0.3, dissonance_tolerance: 0.4, preferred_modes: ['ionian', 'aeolian', 'mixolydian'] },
        texture: { density: 0.8, voice_leading_strictness: 0.9 }
    },
    {
        id: 'chamber_death',
        name: 'Chamber Death',
        description: 'Intimate darkness. Sparse strings and low woodwinds with high trauma sensitivity.',
        orchestrationMode: 'CHAMBER_QUARTET',
        rhythm: { base_division: 8, syncopation_weight: 0.3, swing: false, tempo_range: [40, 70] },
        harmony: { complexity: 0.6, dissonance_tolerance: 0.8, preferred_modes: ['phrygian', 'locrian', 'harmonic_minor'] },
        texture: { density: 0.2, voice_leading_strictness: 0.85 }
    },
    {
        id: 'jazz_noir',
        name: 'Jazz Noir',
        description: 'Smoke-filled darkness. Muted brass, walking bass, and diminished chords.',
        orchestrationMode: 'BRASS_ENSEMBLE',
        rhythm: { base_division: 8, syncopation_weight: 0.7, swing: true, tempo_range: [70, 110] },
        harmony: { complexity: 0.9, dissonance_tolerance: 0.7, preferred_modes: ['dorian', 'altered', 'diminished'] },
        texture: { density: 0.4, voice_leading_strictness: 0.5 }
    },
    {
        id: 'wagnerian',
        name: 'Leitmotif (Wagnerian)',
        description: 'Thematic development and transformation. Each actor\'s leitmotif evolves.',
        orchestrationMode: 'LEITMOTIF_WAGNERIAN',
        rhythm: { base_division: 4, syncopation_weight: 0.1, swing: false, tempo_range: [50, 90] },
        harmony: { complexity: 0.7, dissonance_tolerance: 0.6, preferred_modes: ['chromatic', 'major', 'minor'] },
        texture: { density: 0.9, voice_leading_strictness: 0.8 }
    },
    {
        id: 'minimalist_void',
        name: 'Minimalist Void',
        description: 'Extreme sparsity. Single sustained tones, vast silences, and glacial movement.',
        orchestrationMode: 'MINIMALIST_GLASS',
        rhythm: { base_division: 4, syncopation_weight: 0.0, swing: false, tempo_range: [30, 60] },
        harmony: { complexity: 0.1, dissonance_tolerance: 0.2, preferred_modes: ['lydian', 'ionian'] },
        texture: { density: 0.1, voice_leading_strictness: 0.6 }
    },
    {
        id: 'cyber_glitch',
        name: 'Cyber Glitch',
        description: 'Digital chaos. Stuttering rhythms, microtonal clusters, and algorithmic fragmentation.',
        orchestrationMode: 'CYBER_GLITCH',
        rhythm: { base_division: 32, syncopation_weight: 0.95, swing: false, tempo_range: [140, 200] },
        harmony: { complexity: 1.0, dissonance_tolerance: 1.0, preferred_modes: ['chromatic', 'whole-tone', 'octatonic'] },
        texture: { density: 0.3, voice_leading_strictness: 0.0 }
    },
    {
        id: 'jazz',
        name: 'Cool Jazz Ensemble',
        description: 'Extended harmonies (7ths, 9ths), swing rhythms, and improvisational feel.',
        orchestrationMode: 'BRASS_ENSEMBLE',
        rhythm: { base_division: 8, syncopation_weight: 0.8, swing: true, tempo_range: [80, 140] },
        harmony: { complexity: 0.9, dissonance_tolerance: 0.6, preferred_modes: ['dorian', 'mixolydian', 'blues'] },
        texture: { density: 0.5, voice_leading_strictness: 0.4 }
    },
    {
        id: 'minimalist',
        name: 'Glass/Reich Minimalism',
        description: 'Repetitive pulse patterns, slowly shifting harmonies, and hypnotic textures.',
        orchestrationMode: 'MINIMALIST_GLASS',
        rhythm: { base_division: 8, syncopation_weight: 0.1, swing: false, tempo_range: [110, 160] },
        harmony: { complexity: 0.2, dissonance_tolerance: 0.1, preferred_modes: ['ionian', 'lydian'] },
        texture: { density: 0.6, voice_leading_strictness: 0.7 }
    },
    {
        id: 'avant_garde',
        name: 'Avant-Garde / Atonal',
        description: 'High entropy, jagged rhythms, and complete harmonic freedom.',
        orchestrationMode: 'FULL_ORCHESTRA',
        rhythm: { base_division: 16, syncopation_weight: 0.9, swing: false, tempo_range: [40, 180] },
        harmony: { complexity: 1.0, dissonance_tolerance: 1.0, preferred_modes: ['chromatic', 'whole-tone'] },
        texture: { density: 0.3, voice_leading_strictness: 0.1 }
    },
    {
        id: 'chamber',
        name: 'Intimate Chamber',
        description: 'Delicate, transparent textures for emotional dialogue.',
        orchestrationMode: 'CHAMBER_QUARTET',
        rhythm: { base_division: 4, syncopation_weight: 0.1, swing: false, tempo_range: [50, 80] },
        harmony: { complexity: 0.4, dissonance_tolerance: 0.3, preferred_modes: ['aeolian', 'harmonic_minor'] },
        texture: { density: 0.3, voice_leading_strictness: 0.95 }
    },
    {
        id: 'electronic',
        name: 'Dark Electronic',
        description: 'Synthesized textures, steady machine pulses, and minor harmonies.',
        orchestrationMode: 'CYBER_GLITCH',
        rhythm: { base_division: 16, syncopation_weight: 0.3, swing: false, tempo_range: [100, 130] },
        harmony: { complexity: 0.4, dissonance_tolerance: 0.5, preferred_modes: ['phrygian', 'locrian'] },
        texture: { density: 0.7, voice_leading_strictness: 0.0 }
    },
    {
        id: 'baroque',
        name: 'Baroque Counterpoint',
        description: 'Strict voice leading, ornamented melodies, and driving harmonic rhythm.',
        orchestrationMode: 'CHAMBER_QUARTET',
        rhythm: { base_division: 16, syncopation_weight: 0.1, swing: false, tempo_range: [80, 120] },
        harmony: { complexity: 0.3, dissonance_tolerance: 0.2, preferred_modes: ['ionian', 'harmonic_minor'] },
        texture: { density: 0.6, voice_leading_strictness: 1.0 }
    },
    {
        id: 'romantic',
        name: 'Romantic Expressive',
        description: 'Ebb and flow of tempo, lush harmonies, and high emotional dynamic.',
        orchestrationMode: 'FULL_ORCHESTRA',
        rhythm: { base_division: 8, syncopation_weight: 0.2, swing: false, tempo_range: [40, 100] },
        harmony: { complexity: 0.6, dissonance_tolerance: 0.5, preferred_modes: ['major', 'minor'] },
        texture: { density: 0.9, voice_leading_strictness: 0.7 }
    },
    {
        id: 'strings_only',
        name: 'Strings Only',
        description: 'Pure string quartet emotionality with rich harmonic voicing.',
        orchestrationMode: 'STRINGS_ONLY',
        rhythm: { base_division: 8, syncopation_weight: 0.2, swing: false, tempo_range: [50, 100] },
        harmony: { complexity: 0.5, dissonance_tolerance: 0.4, preferred_modes: ['aeolian', 'dorian', 'mixolydian'] },
        texture: { density: 0.7, voice_leading_strictness: 0.9 }
    },
    {
        id: 'solo_piano',
        name: 'Solo Piano',
        description: 'Single instrument reduction with full harmonic expression.',
        orchestrationMode: 'SOLO_PIANO',
        rhythm: { base_division: 16, syncopation_weight: 0.3, swing: false, tempo_range: [40, 120] },
        harmony: { complexity: 0.6, dissonance_tolerance: 0.5, preferred_modes: ['all'] },
        texture: { density: 0.5, voice_leading_strictness: 0.7 }
    },
];

// Adjustable Music Parameters (from MPN Reference)
interface MusicParamDef {
    id: string;
    name: string;
    category: string;
    description: string;
    defaultValue: number;
    min: number;
    max: number;
    step: number;
    unit: string;
}

const MUSIC_PARAMS: MusicParamDef[] = [
    { id: 'timbre-005', name: 'Machiavellian Detuning', category: 'Timbre', description: 'Hidden agenda modulation', defaultValue: -10, min: -25, max: 0, step: 1, unit: 'cents' },
    { id: 'timbre-006', name: 'Narcissistic Detuning', category: 'Timbre', description: 'Overpowering presence', defaultValue: 5, min: 0, max: 25, step: 1, unit: 'cents' },
    { id: 'rhythm-005', name: 'Slow Tempo (Largo)', category: 'Rhythm', description: 'Strategic/Boardroom pace', defaultValue: 50, min: 40, max: 60, step: 2, unit: 'BPM' },
    { id: 'rhythm-006', name: 'Normal Tempo (Andante)', category: 'Rhythm', description: 'Operational pace', defaultValue: 90, min: 80, max: 100, step: 2, unit: 'BPM' },
    { id: 'rhythm-007', name: 'Fast Tempo (Presto)', category: 'Rhythm', description: 'Crisis/War room pace', defaultValue: 140, min: 120, max: 180, step: 5, unit: 'BPM' },
    { id: 'dynamics-001', name: 'Soft Dynamic Level', category: 'Dynamics', description: 'Low trauma/Peace state', defaultValue: 30, min: 1, max: 45, step: 1, unit: 'vel' },
    { id: 'dynamics-002', name: 'Medium Dynamic Level', category: 'Dynamics', description: 'Normal engagement', defaultValue: 72, min: 60, max: 85, step: 1, unit: 'vel' },
    { id: 'dynamics-003', name: 'Loud Dynamic Level', category: 'Dynamics', description: 'Extreme crisis state', defaultValue: 118, min: 110, max: 127, step: 1, unit: 'vel' },
    { id: 'ocean-007', name: 'Introverted Dynamics', category: 'Dynamics', description: 'Reserved internal energy', defaultValue: 30, min: 1, max: 50, step: 1, unit: 'vel' },
    { id: 'ocean-008', name: 'Balanced Dynamics', category: 'Dynamics', description: 'Socially balanced energy', defaultValue: 70, min: 50, max: 90, step: 1, unit: 'vel' },
    { id: 'ocean-009', name: 'Extroverted Dynamics', category: 'Dynamics', description: 'Assertive leadership presence', defaultValue: 110, min: 90, max: 127, step: 1, unit: 'vel' },
    { id: 'lacan-imag-002', name: 'Self-Reflection (Echo)', category: 'Lacan', description: 'Imaginary register reverb', defaultValue: 0.3, min: 0, max: 1, step: 0.1, unit: 'amt' },
    { id: 'emotion-anger-001', name: 'Anger Intensity', category: 'Emotion', description: 'Explosive accent strength', defaultValue: 0.5, min: 0, max: 1, step: 0.1, unit: 'amt' },
    { id: 'physics-hamiltonian-001', name: 'Phase Evolution', category: 'Physics', description: 'Hamiltonian energy conservation', defaultValue: 0.5, min: 0, max: 1, step: 0.1, unit: 'amt' },
    { id: 'physics-hamiltonian-002', name: 'Momentum Scaler', category: 'Physics', description: 'Psychological momentum multiplier', defaultValue: 1.0, min: 1, max: 2, step: 0.1, unit: 'x' }
];

const WIZARD_STEPS = [
    { id: 'validated', title: 'Validated', description: 'Script Analysis', icon: CheckCircle },
    { id: 'characters', title: 'Characters', description: 'Voice & Psych', icon: Users },
    { id: 'music', title: 'Music', description: 'Theory Parameters', icon: Music },
    { id: 'style', title: 'Style', description: 'Musical Presets', icon: Palette },
    { id: 'options', title: 'Options', description: 'Advanced Settings', icon: Settings },
    { id: 'review', title: 'Review', description: 'Final Check', icon: Eye },
];

export default function ProcessingWizard({ validatedStructure, onComplete, onCancel, initialConfig }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [voices, setVoices] = useState<ElevenLabsVoice[]>([]); // MUST use real ElevenLabs API
    const [isLoadingVoices, setIsLoadingVoices] = useState(true);
    const [styles, setStyles] = useState<StylePreset[]>(FALLBACK_STYLES);
    const [isLoadingStyles, setIsLoadingStyles] = useState(true);

    // Fetch voices and styles on mount
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [voiceRes, styleRes] = await Promise.all([
                    fetch('/api/voices'),
                    fetch('/api/styles/list')
                ]);

                if (voiceRes.ok) {
                    const data = await voiceRes.json();
                    if (data.voices && data.voices.length > 0) {
                        setVoices(data.voices);
                    }
                }

                if (styleRes.ok) {
                    const data = await styleRes.json();
                    if (data.styles && data.styles.length > 0) {
                        setStyles(data.styles);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch wizard data:', err);
            } finally {
                setIsLoadingVoices(false);
                setIsLoadingStyles(false);
            }
        };
        fetchData();
    }, []);

    // Initialize character configs from validated structure or initial config
    const [characters, setCharacters] = useState<CharacterConfig[]>(() => {
        if (initialConfig?.characters) return initialConfig.characters;
        return validatedStructure.characters.map((char) => ({
            name: char.name,
            voiceId: '',
            voiceName: '',
            psychometrics: {
                aggression: 50,
                vulnerability: 50,
                intelligence: 50,
                dominance: 50,
            },
        }));
    });

    // Auto-assign voices once loaded (only if not pre-populated)
    React.useEffect(() => {
        const needsVoice = characters.some(c => !c.voiceId);
        if (!isLoadingVoices && voices.length > 0 && needsVoice && !initialConfig?.characters) {
            setCharacters(prev => prev.map((char) => {
                if (char.voiceId) return char;
                const recommended = getRecommendedVoice(char, voices);
                return {
                    ...char,
                    voiceId: recommended.id,
                    voiceName: recommended.name,
                    previewUrl: recommended.previewUrl,
                    description: recommended.description
                };
            }));
        }
    }, [isLoadingVoices, voices]);

    const [selectedPreset, setSelectedPreset] = useState<string>(initialConfig?.stylePreset || 'orchestral');
    const [processingOptions, setProcessingOptions] = useState({
        generateChords: initialConfig?.generateChords ?? true,
        generateMusic: initialConfig?.generateMusic ?? false,
        computePsychometrics: initialConfig?.computePsychometrics ?? true,
    });

    // Initialize music params from defaults or initial config
    const [musicParams, setMusicParams] = useState<Record<string, number>>(() => {
        if (initialConfig?.musicParams) return initialConfig.musicParams;
        const defaults: Record<string, number> = {};
        MUSIC_PARAMS.forEach(p => { defaults[p.id] = p.defaultValue; });
        return defaults;
    });

    // Intelligent recommendation logic with improved gender detection
    function getRecommendedVoice(char: Partial<CharacterConfig>, availableVoices: ElevenLabsVoice[]): ElevenLabsVoice {
        if (!char.name) return availableVoices[0];

        // Common name patterns for gender detection
        const FEMALE_NAMES = ['alice', 'bella', 'claire', 'diana', 'emma', 'fiona', 'grace', 'hannah', 'isabelle', 'julia', 'kate', 'laura', 'mary', 'natalie', 'olivia', 'patricia', 'rachel', 'sarah', 'tina', 'victoria', 'wendy', 'zoe', 'ophelia', 'gertrude', 'juliet', 'desdemona', 'cordelia', 'rosalind', 'viola', 'portia', 'beatrice', 'hermione', 'miranda', 'jessica', 'anne', 'elizabeth', 'margaret', 'catherine', 'helen', 'medea', 'antigone', 'electra', 'clytemnestra', 'cassandra', 'hecuba', 'andromache', 'jocasta', 'eurydice', 'penelope', 'woman', 'girl', 'mrs', 'miss', 'sister', 'mother', 'daughter', 'wife', 'queen', 'princess', 'lady', 'dame', 'duchess', 'countess', 'baroness', 'empress', 'goddess', 'nymph', 'witch', 'nurse', 'maid', 'maiden', 'pig', 'she'];
        const MALE_NAMES = ['adam', 'bob', 'charles', 'david', 'edward', 'frank', 'george', 'henry', 'ivan', 'james', 'kevin', 'louis', 'michael', 'nathan', 'oliver', 'peter', 'quentin', 'robert', 'steven', 'thomas', 'umar', 'victor', 'william', 'hamlet', 'claudius', 'horatio', 'laertes', 'polonius', 'macbeth', 'othello', 'lear', 'romeo', 'brutus', 'cassius', 'antony', 'caesar', 'prospero', 'oberon', 'puck', 'falstaff', 'shylock', 'oedipus', 'creon', 'tiresias', 'agamemnon', 'orestes', 'achilles', 'hector', 'odysseus', 'ajax', 'priam', 'paris', 'man', 'boy', 'mr', 'sir', 'brother', 'father', 'son', 'husband', 'king', 'prince', 'lord', 'duke', 'count', 'baron', 'emperor', 'god', 'wizard', 'priest', 'monk', 'knight', 'soldier', 'wolf', 'he'];

        const nameLower = char.name.toLowerCase().trim();
        const nameFirst = nameLower.split(/\s+/)[0]; // Get first word of name

        // Direct name matching
        const isLikelyFemale = FEMALE_NAMES.some(n => nameLower.includes(n) || nameFirst === n);
        const isLikelyMale = MALE_NAMES.some(n => nameLower.includes(n) || nameFirst === n);

        let filtered = availableVoices;
        if (isLikelyFemale && !isLikelyMale) {
            filtered = availableVoices.filter(v => v.labels.gender === 'female');
        } else if (isLikelyMale && !isLikelyFemale) {
            filtered = availableVoices.filter(v => v.labels.gender === 'male');
        }

        if (filtered.length === 0) filtered = availableVoices;

        // Psychometric matching
        const psych = char.psychometrics;
        if (psych) {
            if (psych.dominance > 70) {
                const match = filtered.find(v => v.labels.description?.includes('authoritative') || v.labels.description?.includes('deep'));
                if (match) return match;
            }
            if (psych.vulnerability > 70) {
                const match = filtered.find(v => v.labels.description?.includes('soft') || v.labels.description?.includes('warm'));
                if (match) return match;
            }
            if (psych.aggression > 70) {
                const match = filtered.find(v => v.labels.description?.includes('strong') || v.labels.description?.includes('dynamic'));
                if (match) return match;
            }
        }

        // Default to a consistent choice
        return filtered[0] || availableVoices[0];
    }

    // Intelligent style recommendation logic
    function getRecommendedStyle(charConfigs: CharacterConfig[]): string {
        if (!styles || styles.length === 0) return 'orchestral';

        // Average psychometrics
        const avg = {
            aggression: charConfigs.reduce((s, c) => s + c.psychometrics.aggression, 0) / charConfigs.length,
            vulnerability: charConfigs.reduce((s, c) => s + c.psychometrics.vulnerability, 0) / charConfigs.length,
            intelligence: charConfigs.reduce((s, c) => s + c.psychometrics.intelligence, 0) / charConfigs.length,
            dominance: charConfigs.reduce((s, c) => s + c.psychometrics.dominance, 0) / charConfigs.length,
        };

        // Heuristics based on SQL get_recommended_style
        if (avg.vulnerability > 75) return 'chamber_death';
        if (avg.aggression > 85) return 'cyber_glitch';
        if (avg.aggression > 75) return 'avant_garde';
        if (avg.intelligence > 70) return 'baroque';
        if (avg.dominance > 70) return 'wagnerian';

        return 'orchestral';
    }

    const updateMusicParam = (id: string, value: number) => {
        setMusicParams(prev => ({ ...prev, [id]: value }));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0: return true;
            case 1: return characters.every(c => c.voiceId);
            case 2: return true;
            case 3: return !!selectedPreset;
            case 4: return true;
            case 5: return true;
            default: return false;
        }
    };

    const handleNext = () => {
        if (currentStep < WIZARD_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = async () => {
        setIsProcessing(true);

        const config: ProcessingConfig = {
            characters: characters,
            stylePreset: selectedPreset,
            musicParams,
            ...processingOptions,
            is_ready: true,
        };

        await new Promise(resolve => setTimeout(resolve, 1500));
        onComplete(config);
    };

    const updateCharacterVoice = (idx: number, voiceId: string) => {
        const voice = voices.find(v => v.id === voiceId);
        if (!voice) return;
        setCharacters(prev => {
            const updated = [...prev];
            updated[idx] = {
                ...updated[idx],
                voiceId,
                voiceName: voice.name,
                previewUrl: voice.previewUrl,
                description: voice.description
            };
            return updated;
        });
    };

    const updateCharacterPsychometric = (idx: number, key: keyof CharacterConfig['psychometrics'], value: number) => {
        setCharacters(prev => {
            const updated = [...prev];
            updated[idx] = {
                ...updated[idx],
                psychometrics: { ...updated[idx].psychometrics, [key]: value }
            };
            return updated;
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Validated
                return (
                    <div className="space-y-6">
                        <div className="text-center p-8">
                            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Script Validated</h3>
                            <p className="text-gray-400">Your script has been analyzed and is ready for processing.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl text-center">
                                <div className="text-3xl font-bold text-purple-400">{validatedStructure.acts.length}</div>
                                <div className="text-sm text-gray-500">Acts</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl text-center">
                                <div className="text-3xl font-bold text-blue-400">{validatedStructure.characters.length}</div>
                                <div className="text-sm text-gray-500">Characters</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl text-center">
                                <div className="text-3xl font-bold text-amber-400">{Math.round(validatedStructure.confidence * 100)}%</div>
                                <div className="text-sm text-gray-500">Confidence</div>
                            </div>
                        </div>

                        {validatedStructure.metadata.title && (
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-sm text-gray-500">Title</div>
                                <div className="text-xl font-bold text-white">{validatedStructure.metadata.title}</div>
                                {validatedStructure.metadata.author && (
                                    <div className="text-gray-400 mt-1">by {validatedStructure.metadata.author}</div>
                                )}
                            </div>
                        )}
                    </div>
                );

            case 1: // Characters
                return (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm pb-2 z-10 border-b border-white/5 mb-4">
                            <h3 className="text-lg font-bold text-white">Configure Characters</h3>
                            <p className="text-xs text-gray-400">Assign voices and psychometric baselines.</p>
                        </div>
                        <div className="space-y-4">
                            {characters.map((char, index) => (
                                <div key={char.name} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-white">{char.name}</h4>
                                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] rounded uppercase tracking-wider font-mono">
                                            ACTIVE ACTOR
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] text-gray-500 uppercase font-bold">Voice Profile</label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={char.voiceId}
                                                    onChange={(e) => updateCharacterVoice(index, e.target.value)}
                                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50 transition cursor-pointer"
                                                >
                                                    {isLoadingVoices ? (
                                                        <option>Loading voices...</option>
                                                    ) : (
                                                        voices.map(v => {
                                                            const isRecommended = getRecommendedVoice(char, voices).id === v.id;
                                                            return (
                                                                <option key={v.id} value={v.id}>
                                                                    {v.name} {v.labels.gender ? `(${v.labels.gender})` : ''} {isRecommended ? '★ Recommended' : ''}
                                                                </option>
                                                            );
                                                        })
                                                    )}
                                                </select>
                                                {char.voiceId && voices.find(v => v.id === char.voiceId)?.previewUrl && (
                                                    <button
                                                        onClick={() => {
                                                            const audio = new Audio(voices.find(v => v.id === char.voiceId)?.previewUrl);
                                                            audio.play();
                                                        }}
                                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-emerald-400 transition"
                                                        title="Preview Voice"
                                                    >
                                                        <Volume2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            {char.voiceId && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {Object.entries(voices.find(v => v.id === char.voiceId)?.labels || {}).map(([k, v]) => (
                                                        <span key={k} className="text-[9px] px-1.5 py-0.5 bg-white/5 text-gray-500 rounded-full">
                                                            {v}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-gray-500 uppercase font-bold">Psychometrics</label>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                {Object.entries(char.psychometrics).map(([key, val]) => (
                                                    <div key={key} className="space-y-1">
                                                        <div className="flex justify-between text-[10px]">
                                                            <span className="text-gray-400 capitalize">{key}</span>
                                                            <span className="text-emerald-400">{val}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={val}
                                                            onChange={(e) => updateCharacterPsychometric(index, key as any, parseInt(e.target.value))}
                                                            className="w-full h-1 accent-emerald-500 bg-white/10 rounded-full appearance-none"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 2: // Music Parameters
                return (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm pb-2 z-10 border-b border-white/5 mb-4">
                            <h3 className="text-lg font-bold text-white">Music Theory Parameters</h3>
                            <p className="text-xs text-gray-400">Calibrate the MPN reference engine mappings.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 pb-4">
                            {MUSIC_PARAMS.map(param => (
                                <div key={param.id} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{param.name}</h4>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-tight">{param.description}</p>
                                        </div>
                                        <span className="text-emerald-400 font-mono text-sm bg-emerald-400/10 px-2 py-0.5 rounded">
                                            {musicParams[param.id]}{param.unit === 'amt' ? '' : param.unit}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={param.min}
                                        max={param.max}
                                        step={param.step}
                                        value={musicParams[param.id]}
                                        onChange={(e) => updateMusicParam(param.id, parseFloat(e.target.value))}
                                        className="w-full accent-emerald-500 appearance-none bg-white/10 h-1.5 rounded-full cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                                        <span>{param.min}{param.unit === 'amt' ? '' : param.unit}</span>
                                        <span>{param.max}{param.unit === 'amt' ? '' : param.unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 3: // Style
                return (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm pb-2 z-10 border-b border-white/5 mb-4">
                            <h3 className="text-lg font-bold text-white">Musical Style Preset</h3>
                            <p className="text-xs text-gray-400">Select the authentic reference library preset for this context.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pb-4">
                            {isLoadingStyles ? (
                                <div className="col-span-2 py-10 flex flex-col items-center justify-center gap-3 text-gray-400">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                    <p className="text-sm">Fetching authentic style library...</p>
                                </div>
                            ) : (
                                styles.map(preset => {
                                    const isRecommended = getRecommendedStyle(characters) === preset.id;
                                    return (
                                        <button
                                            key={preset.id}
                                            onClick={() => setSelectedPreset(preset.id)}
                                            className={`p-4 rounded-xl border transition text-left space-y-2 group relative overflow-hidden ${selectedPreset === preset.id
                                                ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/20'
                                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                                }`}
                                        >
                                            {isRecommended && (
                                                <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-500 text-black text-[9px] font-bold uppercase rounded-bl tracking-tighter">
                                                    ★ AI Recommendation
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <h4 className={`font-bold transition-colors ${selectedPreset === preset.id ? 'text-emerald-400' : 'text-white'}`}>
                                                    {preset.name}
                                                </h4>
                                                {preset.orchestrationMode && (
                                                    <span className="text-[8px] text-gray-600 font-mono uppercase bg-white/5 px-1 rounded">
                                                        {preset.orchestrationMode}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{preset.description}</p>

                                            <div className="pt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-white/5 mt-auto">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[8px] text-gray-600 uppercase">Harmony</span>
                                                    <div className="w-10 h-0.5 bg-white/10 rounded-full">
                                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${preset.harmony.complexity * 100}%` }} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[8px] text-gray-600 uppercase">Rhythm</span>
                                                    <div className="w-10 h-0.5 bg-white/10 rounded-full">
                                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${preset.rhythm.syncopation_weight * 100}%` }} />
                                                    </div>
                                                </div>
                                                {preset.rhythm.swing && (
                                                    <span className="text-[8px] text-amber-500/80 font-bold uppercase">Swing</span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                );

            case 4: // Options
                return (
                    <div className="space-y-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-white">Processing Options</h3>
                            <p className="text-xs text-gray-400">Toggle advanced engine features.</p>
                        </div>
                        <div className="space-y-4">
                            {[
                                { id: 'generateChords', label: 'Generate Harmonic Analysis', description: 'Compute Roman Numeral and MPN chord IDs', icon: Brain },
                                { id: 'computePsychometrics', label: 'Real-time Psychometrics', description: 'Map dialogue to dynamic personality shifts', icon: Sparkles },
                                { id: 'generateMusic', label: 'High-Fidelity Audio', description: 'Generate high-quality WAV renders', icon: Volume2 },
                            ].map((opt) => (
                                <div
                                    key={opt.id}
                                    onClick={() => setProcessingOptions(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof prev] }))}
                                    className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-4 ${processingOptions[opt.id as keyof typeof processingOptions]
                                        ? 'bg-emerald-500/10 border-emerald-500/30'
                                        : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${processingOptions[opt.id as keyof typeof processingOptions] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
                                        <opt.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-white">{opt.label}</div>
                                        <div className="text-[10px] text-gray-500">{opt.description}</div>
                                    </div>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${processingOptions[opt.id as keyof typeof processingOptions] ? 'bg-emerald-500' : 'bg-white/10'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${processingOptions[opt.id as keyof typeof processingOptions] ? 'translate-x-4' : ''}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 5: // Review
                const selectedPresetData = styles.find(p => p.id === selectedPreset);
                return (
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Processing Configuration Ready</h4>
                                <p className="text-xs text-gray-400">Everything is calibrated for ScoreOrchestrator baseline.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Style Pattern</h4>
                                    <button onClick={() => setCurrentStep(3)} className="text-[9px] text-emerald-400 border border-emerald-400/30 px-1.5 py-0.5 rounded hover:bg-emerald-400/10 transition uppercase font-bold">Edit</button>
                                </div>
                                <div className="text-sm text-white font-bold">{selectedPresetData?.name}</div>
                                <div className="text-[10px] text-gray-500">{selectedPresetData?.emotionalRange} range</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Music Theory</h4>
                                    <button onClick={() => setCurrentStep(2)} className="text-[9px] text-emerald-400 border border-emerald-400/30 px-1.5 py-0.5 rounded hover:bg-emerald-400/10 transition uppercase font-bold">Edit</button>
                                </div>
                                <div className="text-sm text-white font-bold">{Object.keys(musicParams).length} Overrides</div>
                                <div className="text-[10px] text-gray-500">MPN reference calibrated</div>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actor Registration</h4>
                                <button onClick={() => setCurrentStep(1)} className="text-[9px] text-emerald-400 border border-emerald-400/30 px-1.5 py-0.5 rounded hover:bg-emerald-400/10 transition uppercase font-bold">Edit</button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {characters.map(char => (
                                    <div key={char.name} className="flex flex-col gap-1 p-2 bg-black/20 rounded-lg">
                                        <div className="text-sm text-white font-bold">{char.name}</div>
                                        <div className="text-[10px] text-gray-500 truncate">{char.voiceName}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Parameter Summary</h4>
                            <div className="grid grid-cols-3 gap-y-4 gap-x-2">
                                {MUSIC_PARAMS.slice(0, 9).map(p => (
                                    <div key={p.id}>
                                        <div className="text-[9px] text-gray-500 uppercase truncate">{p.name}</div>
                                        <div className="text-xs text-white font-mono">{musicParams[p.id]}{p.unit === 'amt' ? '' : p.unit}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-2 border-t border-white/5 text-[9px] text-gray-600 italic">
                                + {MUSIC_PARAMS.length - 9} additional theory dimensions configured.
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl flex overflow-hidden shadow-2xl h-[600px]">
                {/* Sidebar */}
                <div className="w-72 bg-black/40 border-r border-white/5 p-8 flex flex-col">
                    <div className="mb-12">
                        <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Process Wizard</div>
                        <h2 className="text-2xl font-bold text-white">MPN Conductor</h2>
                    </div>

                    <div className="space-y-6 flex-1">
                        {WIZARD_STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index === currentStep;
                            const isCompleted = index < currentStep;

                            return (
                                <div key={step.title} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                            : isCompleted
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-white/5 text-gray-500'
                                            }`}>
                                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                        </div>
                                        {index < WIZARD_STEPS.length - 1 && (
                                            <div className={`w-0.5 flex-1 my-2 rounded-full ${isCompleted ? 'bg-emerald-500/20' : 'bg-white/5'}`} />
                                        )}
                                    </div>
                                    <div className="pt-2">
                                        <div className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                            {step.title}
                                        </div>
                                        <div className="text-[10px] text-gray-600 uppercase tracking-tighter">
                                            {step.description}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-white">{WIZARD_STEPS[currentStep].title}</h3>
                            <p className="text-sm text-gray-500">Step {currentStep + 1} of {WIZARD_STEPS.length}</p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        {renderStepContent()}
                    </div>

                    {/* Footer */}
                    <div className="p-8 bg-black/20 border-t border-white/5 flex justify-between items-center">
                        <button
                            onClick={currentStep === 0 ? onCancel : handleBack}
                            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {currentStep === 0 ? 'Back' : 'Back'}
                        </button>

                        <div className="flex gap-4">
                            {currentStep === WIZARD_STEPS.length - 1 ? (
                                <button
                                    onClick={handleComplete}
                                    className="px-8 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                                >
                                    Finish Processing
                                    <Sparkles className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    className={`px-8 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${canProceed()
                                        ? 'bg-white text-black hover:bg-gray-200'
                                        : 'bg-white/5 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    Continue
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
