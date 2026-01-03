/**
 * Play Parser Utility
 * Parses complete play texts into structured frames for MPN analysis
 */

import { LiteraryScenario, ScenarioFrame } from './types';

// ============================================================================
// TYPES
// ============================================================================

export interface ParsedPlay {
    id: string;
    title: string;
    author: string;
    theme: string;
    color: string;
    frames: ScenarioFrame[];
    characters: CharacterProfile[];
    wordCount: number;
    actCount: number;
}

export interface CharacterProfile {
    id: string;
    name: string;
    lineCount: number;
    disc: { D: number; I: number; S: number; C: number };
    darkTriad: { machiavellianism: number; narcissism: number; psychopathy: number };
    archetype: string;
    instrument: string;
}

// ============================================================================
// SPEAKER PATTERN DETECTION
// ============================================================================

// Common patterns for speaker identification in various play formats
const SPEAKER_PATTERNS = [
    // ALL CAPS followed by period or colon
    /^([A-Z][A-Z\s]+)[\.:]\s*(.*)$/,
    // Title case with colon
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*[\.:]\s*(.*)$/,
    // Bracketed speakers [HAMLET]
    /^\[([A-Z]+)\]\s*(.*)$/,
    // Gutenberg format: "SPEAKER."
    /^([A-Z]{2,}(?:\s+[A-Z]+)*)\.\s+(.*)$/,
];

// Stage directions and non-dialogue markers
const STAGE_DIRECTION_PATTERNS = [
    /^\s*\[.*\]\s*$/,                    // [Stage direction]
    /^\s*\(.*\)\s*$/,                    // (Stage direction)
    /^ACT\s+[IVX]+/i,                    // ACT I, ACT II, etc.
    /^SCENE\s+[IVX\d]+/i,                // SCENE 1, SCENE II
    /^Enter\s+/i,                        // Enter Hamlet
    /^Exit\s*/i,                         // Exit, Exeunt
    /^Exeunt/i,
    /^\s*$/,                             // Empty lines
];

// ============================================================================
// SENTIMENT ANALYSIS (Basic)
// ============================================================================

const NEGATIVE_WORDS = new Set([
    'death', 'die', 'dead', 'kill', 'murder', 'blood', 'hate', 'fear', 'dark',
    'evil', 'curse', 'damn', 'hell', 'revenge', 'betray', 'suffer', 'pain',
    'woe', 'grief', 'sorrow', 'weep', 'cry', 'mourn', 'lost', 'doom', 'fate',
    'tragedy', 'wretched', 'villain', 'treachery', 'poison', 'slain', 'corpse',
    'ghost', 'horror', 'terror', 'mad', 'madness', 'insane', 'guilty', 'sin'
]);

const POSITIVE_WORDS = new Set([
    'love', 'joy', 'hope', 'light', 'peace', 'happy', 'blessed', 'fair',
    'sweet', 'kind', 'gentle', 'noble', 'true', 'honest', 'virtue', 'grace',
    'heaven', 'angel', 'beautiful', 'delight', 'pleasure', 'comfort', 'friend'
]);

const HIGH_AROUSAL_WORDS = new Set([
    'now', 'quick', 'haste', 'hurry', 'run', 'fight', 'strike', 'sword',
    'fire', 'thunder', 'storm', 'rage', 'fury', 'passion', 'burning', 'wild'
]);

// ============================================================================
// PSYCHOMETRIC COMPUTATION
// ============================================================================

function computeTrauma(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let negScore = 0;
    let posScore = 0;

    for (const word of words) {
        const cleaned = word.replace(/[^a-z]/g, '');
        if (NEGATIVE_WORDS.has(cleaned)) negScore++;
        if (POSITIVE_WORDS.has(cleaned)) posScore++;
    }

    const ratio = (negScore - posScore * 0.5) / Math.max(words.length, 1);
    return Math.min(1, Math.max(0, 0.3 + ratio * 2));
}

function computeEntropy(text: string, previousSpeaker: string, currentSpeaker: string): number {
    // Base entropy from word diversity
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const lexicalDiversity = uniqueWords.size / Math.max(words.length, 1);

    // Speaker change adds entropy
    const speakerChange = previousSpeaker !== currentSpeaker ? 0.15 : 0;

    // Arousal words add entropy
    let arousal = 0;
    for (const word of words) {
        if (HIGH_AROUSAL_WORDS.has(word.replace(/[^a-z]/g, ''))) arousal++;
    }
    const arousalFactor = arousal / Math.max(words.length, 1);

    return Math.min(1, Math.max(0, lexicalDiversity * 0.5 + speakerChange + arousalFactor));
}

function inferChord(trauma: number, entropy: number): string {
    // Map psychometric state to chord
    if (trauma > 0.7) {
        return entropy > 0.6 ? 'Diminished' : 'Minor (tense)';
    } else if (trauma > 0.4) {
        return entropy > 0.5 ? 'Dominant 7th' : 'Minor';
    } else {
        return entropy > 0.5 ? 'Major (bright)' : 'Major';
    }
}

// ============================================================================
// MAIN PARSER
// ============================================================================

export function parsePlayText(
    rawText: string,
    metadata: { id: string; title: string; author: string; theme: string; color: string }
): ParsedPlay {
    const lines = rawText.split('\n');
    const frames: ScenarioFrame[] = [];
    const characterStats: Map<string, { count: number; totalTrauma: number }> = new Map();

    let currentAct = 1;
    let currentScene = 1;
    let previousSpeaker = '';
    let frameIndex = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip stage directions
        if (STAGE_DIRECTION_PATTERNS.some(p => p.test(line))) {
            // Track act/scene changes
            const actMatch = line.match(/ACT\s+([IVX]+|\d+)/i);
            const sceneMatch = line.match(/SCENE\s+([IVX]+|\d+)/i);
            if (actMatch) currentAct = romanToInt(actMatch[1]) || parseInt(actMatch[1]) || currentAct;
            if (sceneMatch) currentScene = romanToInt(sceneMatch[1]) || parseInt(sceneMatch[1]) || currentScene;
            continue;
        }

        // Try to match speaker patterns
        let speaker: string | null = null;
        let dialogue: string = '';

        for (const pattern of SPEAKER_PATTERNS) {
            const match = line.match(pattern);
            if (match) {
                speaker = match[1].trim();
                dialogue = match[2]?.trim() || '';
                break;
            }
        }

        if (!speaker || dialogue.length < 5) continue;

        // Compute psychometric values
        const trauma = computeTrauma(dialogue);
        const entropy = computeEntropy(dialogue, previousSpeaker, speaker);
        const chord = inferChord(trauma, entropy);

        // Create frame
        frames.push({
            name: `${speaker} (${currentAct}.${currentScene})`,
            description: dialogue.substring(0, 100) + (dialogue.length > 100 ? '...' : ''),
            trauma,
            entropy,
            focusLayer: frameIndex % 7,
            script: {
                speaker,
                text: dialogue,
                chord,
                analysis: `Act ${currentAct}, Scene ${currentScene}`
            }
        });

        // Track character stats
        const stats = characterStats.get(speaker) || { count: 0, totalTrauma: 0 };
        stats.count++;
        stats.totalTrauma += trauma;
        characterStats.set(speaker, stats);

        previousSpeaker = speaker;
        frameIndex++;
    }

    // Generate character profiles
    const characters: CharacterProfile[] = Array.from(characterStats.entries())
        .filter(([, stats]) => stats.count >= 3) // At least 3 lines
        .map(([name, stats], index) => {
            const avgTrauma = stats.totalTrauma / stats.count;
            return {
                id: name.toLowerCase().replace(/\s+/g, '_'),
                name,
                lineCount: stats.count,
                disc: inferDISC(name, avgTrauma),
                darkTriad: inferDarkTriad(avgTrauma),
                archetype: inferArchetype(avgTrauma),
                instrument: assignInstrument(index)
            };
        })
        .sort((a, b) => b.lineCount - a.lineCount);

    return {
        ...metadata,
        frames,
        characters,
        wordCount: rawText.split(/\s+/).length,
        actCount: currentAct
    };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function romanToInt(roman: string): number {
    const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100 };
    let result = 0;
    for (let i = 0; i < roman.length; i++) {
        const curr = values[roman[i]] || 0;
        const next = values[roman[i + 1]] || 0;
        result += curr < next ? -curr : curr;
    }
    return result;
}

function inferDISC(name: string, avgTrauma: number): CharacterProfile['disc'] {
    // Simple heuristic based on trauma level
    const high = avgTrauma > 0.5;
    return {
        D: high ? 0.6 + Math.random() * 0.3 : 0.3 + Math.random() * 0.3,
        I: high ? 0.3 + Math.random() * 0.3 : 0.5 + Math.random() * 0.3,
        S: high ? 0.2 + Math.random() * 0.3 : 0.5 + Math.random() * 0.3,
        C: 0.4 + Math.random() * 0.3
    };
}

function inferDarkTriad(avgTrauma: number): CharacterProfile['darkTriad'] {
    const base = avgTrauma * 0.5;
    return {
        machiavellianism: Math.min(1, base + Math.random() * 0.3),
        narcissism: Math.min(1, base * 0.8 + Math.random() * 0.2),
        psychopathy: Math.min(1, base * 0.6 + Math.random() * 0.2)
    };
}

function inferArchetype(avgTrauma: number): string {
    if (avgTrauma > 0.7) return 'shadow';
    if (avgTrauma > 0.5) return 'hero';
    if (avgTrauma > 0.3) return 'mentor';
    return 'herald';
}

function assignInstrument(index: number): string {
    const instruments = ['Trumpet', 'Flute', 'Cello', 'Piano', 'Violin', 'Clarinet', 'Horn', 'Oboe'];
    return instruments[index % instruments.length];
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export function playToLiteraryScenario(play: ParsedPlay): LiteraryScenario {
    return {
        id: play.id,
        title: play.title,
        author: play.author,
        theme: play.theme,
        color: play.color,
        frames: play.frames
    };
}
