export interface ScenarioFrame {
    name: string;
    description: string;
    trauma: number;
    entropy: number;
    focusLayer: number;
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
