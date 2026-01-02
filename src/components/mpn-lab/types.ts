export interface ScenarioFrame {
    name: string;
    description: string;
    trauma: number;
    entropy: number;
    focusLayer: number;
    // Stage directions for background/environment scoring
    stageDirection?: string;
    // Actor notes for emotional dynamic
    actorNote?: string;
    // Mood for environment stave
    mood?: 'neutral' | 'tense' | 'peaceful' | 'chaotic' | 'ominous' | 'melancholic' | 'triumphant';
    script?: {
        speaker: string;
        text: string;
        chord: string;
        analysis: string;
    };
}

export interface LiteraryScenario {
    id: string;
    title: string;
    author: string;
    theme: string;
    color: string;
    frames: ScenarioFrame[];
}

