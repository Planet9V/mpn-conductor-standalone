import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Script Analysis API
 * 
 * Uses OpenRouter/GPT-4 to analyze uploaded play scripts and extract:
 * - Format (Shakespeare, modern play, screenplay)
 * - Structure (acts, scenes)
 * - Characters
 * - Dialogue vs stage directions
 */

interface AnalysisRequest {
    playId: string;
    rawText: string;
}

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

export async function POST(req: NextRequest) {
    try {
        const { playId, rawText }: AnalysisRequest = await req.json();

        if (!rawText) {
            return NextResponse.json(
                { error: 'No text provided' },
                { status: 400 }
            );
        }

        // Call OpenRouter for AI analysis
        const openRouterKey = process.env.OPENROUTER_API_KEY;

        if (!openRouterKey) {
            console.warn('OPENROUTER_API_KEY not set, using fallback parser');
            return NextResponse.json(fallbackParse(rawText));
        }

        const prompt = buildAnalysisPrompt(rawText);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openRouterKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002',
            },
            body: JSON.stringify({
                model: 'openai/gpt-4-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert in theatrical script analysis and format detection. Respond ONLY with valid JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3, // Low for structured output
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.statusText}`);
        }

        const data = await response.json();
        const aiResult = data.choices[0].message.content;

        // Parse AI response
        const structure = parseAIResponse(aiResult, rawText);

        return NextResponse.json(structure);

    } catch (error) {
        console.error('Script analysis error:', error);

        // Fallback to regex-based parsing if AI fails
        const { rawText } = await req.json();
        return NextResponse.json(fallbackParse(rawText));
    }
}

function buildAnalysisPrompt(rawText: string): string {
    const preview = rawText.substring(0, 5000); // First 5000 chars for analysis

    return `Analyze this theatrical script and extract its structure. Return ONLY valid JSON in this exact format:

{
  "format": "shakespeare" | "modern_play" | "screenplay" | "unknown",
  "confidence": 0.0-1.0,
  "acts": [
    {
      "actNumber": 1,
      "title": "optional title",
      "scenes": [
        {
          "sceneNumber": 1,
          "location": "optional location",
          "lines": [
            {
              "lineNumber": 0,
              "type": "dialogue" | "stage_direction" | "character_name" | "scene_header",
              "character": "CHARACTER NAME if dialogue",
              "text": "the actual text",
              "confidence": 0.0-1.0
            }
          ]
        }
      ]
    }
  ],
  "characters": [
    {
      "name": "MAIN NAME",
      "aliases": ["ALT1", "ALT2"],
      "estimatedLines": 100
    }
  ],
  "metadata": {
    "title": "detected title",
    "author": "detected author",
    "frontMatter": "introduction/historical notes if present",
    "estimatedLineCount": 1000
  }
}

SCRIPT TEXT (first 5000 characters):
---
${preview}
---

Key detection rules:
1. Character names are usually ALL CAPS before dialogue
2. Stage directions are in (parentheses) or [brackets]
3. Scene headers contain "Scene" or "Act"
4. Shakespeare: Archaic language, iambic pentameter hints
5. Modern play: Contemporary language, realistic dialogue
6. Screenplay: INT/EXT markers, CUT TO, FADE IN, etc.

Analyze the structure comprehensively and return the JSON.`;
}

function parseAIResponse(aiResult: string, rawText: string): DetectedStructure {
    try {
        // Remove markdown code blocks if present
        const cleaned = aiResult.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const parsed = JSON.parse(cleaned);

        // Validate structure
        if (!parsed.format || !parsed.acts || !parsed.characters) {
            throw new Error('Invalid AI response structure');
        }

        return parsed as DetectedStructure;
    } catch (error) {
        console.error('Failed to parse AI response, using fallback');
        return fallbackParse(rawText);
    }
}

function fallbackParse(text: string): DetectedStructure {
    const lines = text.split('\n');
    const characters = new Map<string, number>();
    const scriptLines: ScriptLine[] = [];
    const detectedActs: Act[] = [];
    let currentAct: Act | null = null;
    let currentScene: Scene | null = null;

    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Detect Acts
        const actMatch = trimmed.match(/^ACT\s+([IVXLCDM]+|\d+)/i);
        if (actMatch) {
            if (currentAct && currentScene) {
                currentAct.scenes.push(currentScene);
            }
            if (currentAct) {
                detectedActs.push(currentAct);
            }

            currentAct = {
                actNumber: detectedActs.length + 1,
                title: trimmed,
                scenes: []
            };
            currentScene = null;

            scriptLines.push({
                lineNumber: idx,
                type: 'scene_header',
                text: trimmed,
                confidence: 0.9
            });
            return;
        }

        // Detect Scenes
        const sceneMatch = trimmed.match(/^SCENE\s+([IVXLCDM]+|\d+)/i);
        if (sceneMatch) {
            if (currentScene && currentAct) {
                currentAct.scenes.push(currentScene);
            }

            if (!currentAct) {
                currentAct = {
                    actNumber: 1,
                    scenes: []
                };
            }

            currentScene = {
                sceneNumber: currentAct.scenes.length + 1,
                location: trimmed,
                lines: []
            };

            scriptLines.push({
                lineNumber: idx,
                type: 'scene_header',
                text: trimmed,
                confidence: 0.9
            });
            return;
        }

        // Initialize first scene if none exists
        if (!currentAct) {
            currentAct = { actNumber: 1, scenes: [] };
        }
        if (!currentScene) {
            currentScene = { sceneNumber: 1, lines: [] };
        }

        // Detect character names (ALL CAPS, short line)
        if (/^[A-Z\s\-']{2,40}$/.test(trimmed) && trimmed.length < 40 && !trimmed.includes('.')) {
            const charName = trimmed;
            characters.set(charName, (characters.get(charName) || 0) + 1);

            const scriptLine: ScriptLine = {
                lineNumber: idx,
                type: 'character_name',
                character: charName,
                text: trimmed,
                confidence: 0.7
            };

            scriptLines.push(scriptLine);
            currentScene.lines.push(scriptLine);
            return;
        }

        // Stage directions (parentheses or brackets)
        if (/^\(.*\)$|^\[.*\]$/.test(trimmed)) {
            const scriptLine: ScriptLine = {
                lineNumber: idx,
                type: 'stage_direction',
                text: trimmed,
                confidence: 0.8
            };

            scriptLines.push(scriptLine);
            currentScene.lines.push(scriptLine);
            return;
        }

        // Dialogue (everything else)
        const scriptLine: ScriptLine = {
            lineNumber: idx,
            type: 'dialogue',
            text: trimmed,
            confidence: 0.6
        };

        scriptLines.push(scriptLine);
        currentScene.lines.push(scriptLine);
    });

    // Close final scene and act
    if (currentScene && currentAct) {
        currentAct.scenes.push(currentScene);
    }
    if (currentAct) {
        detectedActs.push(currentAct);
    }

    // Build character list
    const characterList: Character[] = Array.from(characters.entries()).map(([name, count]) => ({
        name,
        aliases: [],
        estimatedLines: count
    }));

    // Detect format based on heuristics
    const hasShakespeareanLanguage = /thee|thou|hath|doth|wherefore/i.test(text);
    const hasScreenplayMarkers = /INT\.|EXT\.|FADE IN|CUT TO/i.test(text);

    let format: DetectedStructure['format'] = 'unknown';
    let confidence = 0.5;

    if (hasScreenplayMarkers) {
        format = 'screenplay';
        confidence = 0.85;
    } else if (hasShakespeareanLanguage) {
        format = 'shakespeare';
        confidence = 0.8;
    } else if (characters.size > 0) {
        format = 'modern_play';
        confidence = 0.7;
    }

    return {
        format,
        confidence,
        acts: detectedActs.length > 0 ? detectedActs : [{
            actNumber: 1,
            scenes: currentScene ? [currentScene] : [{
                sceneNumber: 1,
                lines: scriptLines
            }]
        }],
        characters: characterList,
        metadata: {
            frontMatter: lines.slice(0, 20).join('\n'),
            estimatedLineCount: scriptLines.length
        }
    };
}
