import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Script Analysis API
 * 
 * Uses OpenRouter/Gemini-3-Flash to analyze uploaded play scripts and extract:
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
        year?: string;
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

        const systemPrompt = `You are a MASTER CLASS theatrical script parser.
Your GOAL is to convert a raw script text into a structured JSON representation, strictly adhering to the **Standard Script Format (SSF)**.

### 1. STANDARDIZED SCRIPT FORMAT (SSF) - MANDATORY OUTPUT
You must analyze the script while keeping this EXACT output format in mind:
- Title: # [Title] (H1 header)
- Author: **Author:** [Name]
- Year: **Year:** [Year]
- Acts: ## ACT [Number] - [Optional Title]
- Scenes: ### Scene [Number] - [Optional Location]
- Dialogue: **[CHARACTER NAME]:** [Dialogue text]
- Directions: *[Stage direction text]* (Single asterisk, square brackets inside)

### 2. METADATA EXTRACTION (ABSOLUTE ISOLATION)
- **Title**: Extract the play title.
- **Author**: Extract the author name.
- **Year**: Extract the publication or writing year.
- **CRITICAL RULE**: Once Title, Author, or Year are extracted into the metadata object, they MUST be COMPLETELY REMOVED from the "frontMatter" and the "lines" array. The frontMatter should NOT contain "Title: X", "Author: Y", or "Year: Z". 

### 3. STRUCTURAL RULES
- **DEDUPLICATION**: DO NOT include "ACT I" or "SCENE 1" as text in the "lines" array. Use the structural fields instead.
- **FRONT MATTER**: Contains context, mood, or character lists that are NOT metadata and NOT dialogue.
- **CHARACTER LIST**: MUST capture every unique speaking name found in the text.

### 4. OUTPUT FORMAT
You MUST return ONLY valid JSON matching the requested structure. NO conversational filler. NO markdown code blocks in the response itself.
`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openRouterKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002',
            },
            body: JSON.stringify({
                model: 'google/gemini-3-flash-preview',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.1, // Lower temperature for more consistent extraction
                max_tokens: 16000
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
    // Take first 15000 characters to stay within token limits
    const preview = rawText.slice(0, 15000);

    return `ANALYZE THIS SCRIPT:

PHASE 1: EXTRACT METADATA
- Identify Title, Author, and Year.
- Identify frontmatter (intro text).

PHASE 2: MAP STRUCTURE
- Identify Acts and Scenes.
- Identify every character who speaks.

PHASE 3: BUILD JSON
Return this EXACT structure:
{
  "format": "modern_play",
  "confidence": 0.98,
  "acts": [
    {
      "actNumber": 1,
      "title": "Optional Title",
      "scenes": [
        {
          "sceneNumber": 1,
          "location": "Optional Location",
          "lines": [
            {"lineNumber": 1, "type": "stage_direction", "text": "...", "confidence": 1.0},
            {"lineNumber": 2, "type": "dialogue", "character": "NAME", "text": "...", "confidence": 1.0}
          ]
        }
      ]
    }
  ],
  "characters": [{"name": "NAME", "aliases": [], "estimatedLines": 10}],
  "metadata": {
    "title": "PLAY TITLE",
    "author": "AUTHOR NAME",
    "year": "YEAR",
    "frontMatter": "CONTEXT/DESCRIPTION (SCRUB TITLE/AUTHOR FROM HERE)",
    "estimatedLineCount": 100
  }
}

---
ALIGNMENT GUIDE (SSF MARKDOWN):
# Play Title
**Author:** Author Name
**Year:** 2024
---
## ACT 1 - Act Title
### Scene 1 - Location
**CHARACTER:** Dialogue text...
*[Stage direction]*
---

CRITICAL: 
- Metadata (Title, Author, Year) MUST BE ISOLATED in the metadata object.
- DO NOT repeat Title/Author inside the frontMatter or lines.
- Results must be in English.

---SCRIPT TEXT---
${preview}
---END SCRIPT---`;
}


function parseAIResponse(aiResult: string, rawText: string): DetectedStructure {
    try {
        // Remove markdown code blocks if present
        const cleaned = aiResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned) as DetectedStructure;

        // AGGRESSIVE METADATA SCRUBBING from frontMatter
        if (parsed.metadata) {
            let fm = parsed.metadata.frontMatter || '';
            const title = (parsed.metadata.title || '').toLowerCase().trim();
            const author = (parsed.metadata.author || '').toLowerCase().trim();
            const year = (parsed.metadata.year || '').toLowerCase().trim();

            // Multi-pattern scrubbing
            fm = fm.split('\n')
                .filter(line => {
                    const l = line.trim().toLowerCase();
                    const lRaw = line.trim();

                    // Remove explicit metadata labels
                    if (l.match(/^(title|author|by|written by|year|date|published|year published|copyright)[:\s]/i)) return false;

                    // Remove ACT and SCENE headers from frontMatter
                    if (l.match(/^act\s+[ivx\d]+/i)) return false;
                    if (l.match(/^scene\s+[ivx\d]+/i)) return false;

                    // Remove lines that exactly match extracted metadata
                    if (title && (l === title || l.includes(title))) return false;
                    if (author && (l === author || l.includes(author))) return false;
                    if (year && l.includes(year)) return false;

                    // Remove standalone year patterns (4-digit years)
                    if (lRaw.match(/^\s*\d{4}\s*$/)) return false;

                    return true;
                })
                .join('\n').trim();

            parsed.metadata.frontMatter = fm;
        }

        // Also scrub metadata from the first scene's lines if it leaked there
        if (parsed.acts && parsed.acts.length > 0 && parsed.acts[0].scenes && parsed.acts[0].scenes.length > 0) {
            const firstScene = parsed.acts[0].scenes[0];
            const title = (parsed.metadata?.title || '').toLowerCase().trim();
            const author = (parsed.metadata?.author || '').toLowerCase().trim();

            firstScene.lines = firstScene.lines.filter(line => {
                const l = line.text.toLowerCase().trim();
                if (l.match(/^(title|author|by|written by|year|date|published)[:\s]/i)) return false;
                if (title && l === title) return false;
                if (author && l === author) return false;
                return true;
            });
        }

        // Validate structure
        if (!parsed.format || !parsed.acts || !parsed.characters) {
            throw new Error('Invalid AI response structure');
        }

        return parsed;
    } catch (error) {
        console.error('Failed to parse AI response, using fallback:', error);
        return fallbackParse(rawText);
    }
}

function fallbackParse(text: string): DetectedStructure {
    const lines = text.split('\n');
    const scriptLines: ScriptLine[] = [];
    const characters = new Map<string, number>();
    const detectedActs: Act[] = [];
    let currentAct: Act | null = null;
    let currentScene: Scene | null = null;

    // First, scan for metadata to skip in body
    let metadataTitle = '';
    let metadataAuthor = '';
    let metadataYear = '';
    const metadataLines = new Set<number>();

    lines.slice(0, 20).forEach((l, idx) => {
        const t = l.trim();
        if (t.toLowerCase().startsWith('title:')) {
            metadataTitle = t.replace(/title:/i, '').trim();
            metadataLines.add(idx);
        } else if (t.toLowerCase().startsWith('author:')) {
            metadataAuthor = t.replace(/author:/i, '').trim();
            metadataLines.add(idx);
        } else if (t.toLowerCase().match(/^(by|written by)/i)) {
            metadataAuthor = t.replace(/^(by|written by):?/i, '').trim();
            metadataLines.add(idx);
        } else if (t.toLowerCase().match(/^(year|date|published)/i)) {
            metadataYear = t.replace(/^(year|date|published):?/i, '').trim();
            metadataLines.add(idx);
        }
    });

    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        if (metadataLines.has(idx)) return; // SKIP METADATA IN BODY

        // Detect structural headers (SKIP IN DIALOGUE)
        if (trimmed.match(/^ACT\s+[IVX\d]+/i) || trimmed.match(/^(##|###)\s+ACT/i)) {
            if (currentAct) {
                if (currentScene) currentAct.scenes.push(currentScene);
                detectedActs.push(currentAct);
            }
            currentAct = {
                actNumber: detectedActs.length + 1,
                scenes: []
            };
            currentScene = null;
            return;
        }

        if (trimmed.match(/^SCENE\s+[IVX\d]+/i) || trimmed.match(/^(###|####)\s+SCENE/i)) {
            if (!currentAct) {
                currentAct = {
                    actNumber: 1,
                    scenes: []
                };
            }
            if (currentAct && currentScene) {
                currentAct.scenes.push(currentScene);
            }
            currentScene = {
                sceneNumber: currentAct.scenes.length + 1,
                location: trimmed.replace(/^SCENE\s+[IVX\d]+[:.-]?\s*/i, '').trim(),
                lines: []
            };
            return;
        }

        // Initialize first act/scene if none exists
        if (!currentAct) {
            currentAct = { actNumber: 1, scenes: [] };
        }
        if (!currentScene) {
            currentScene = { sceneNumber: 1, lines: [] };
        }

        // SHAW FORMAT: "CHARACTER NAME. Dialogue" or "CHARACTER NAME [direction]. Dialogue"
        const shawMatch = trimmed.match(/^([A-Z][A-Z\s\-']+)(?:\s*\[[^\]]+\])?\.\s*(.*)$/);
        if (shawMatch) {
            const charName = shawMatch[1].trim();
            characters.set(charName, (characters.get(charName) || 0) + 1);
            const line: ScriptLine = {
                lineNumber: idx,
                type: 'dialogue',
                character: charName,
                text: shawMatch[2].trim(),
                confidence: 0.8
            };
            currentScene.lines.push(line);
            return;
        }

        // Stage direction (brackets or parentheses)
        if (trimmed.startsWith('[') || trimmed.startsWith('(')) {
            currentScene.lines.push({
                lineNumber: idx,
                type: 'stage_direction',
                text: trimmed.replace(/[\[\]\(\)]/g, '').trim(),
                confidence: 0.8
            });
            return;
        }

        // Assume dialogue for remaining
        const splitLine = trimmed.match(/^([A-Z\s]+):\s*(.*)$/);
        if (splitLine) {
            const charName = splitLine[1].trim();
            characters.set(charName, (characters.get(charName) || 0) + 1);
            currentScene.lines.push({
                lineNumber: idx,
                type: 'dialogue',
                character: charName,
                text: splitLine[2].trim(),
                confidence: 0.8
            });
        } else {
            // General dialogue fallback
            currentScene.lines.push({
                lineNumber: idx,
                type: 'dialogue',
                text: trimmed,
                confidence: 0.5
            });
        }
    });

    // Close
    if (currentScene && currentAct) currentAct.scenes.push(currentScene);
    if (currentAct) detectedActs.push(currentAct);

    // Calculate total lines from processed scenes
    let totalProcessedLines = 0;
    detectedActs.forEach(act => {
        act.scenes.forEach(scene => {
            totalProcessedLines += scene.lines.length;
        });
    });

    return {
        format: 'modern_play',
        confidence: 0.5,
        acts: detectedActs.length > 0 ? detectedActs : [{
            actNumber: 1,
            scenes: [{
                sceneNumber: 1,
                lines: scriptLines // This will be empty now, as lines are pushed directly to currentScene.lines
            }]
        }],
        characters: Array.from(characters.entries()).map(([name, count]) => ({
            name, aliases: [], estimatedLines: count
        })),
        metadata: {
            title: metadataTitle || (lines[0].length < 50 ? lines[0].trim() : 'Unknown Title'),
            author: metadataAuthor || 'Unknown Author',
            year: metadataYear,
            frontMatter: '', // Logic simplified to prevent leakage
            estimatedLineCount: totalProcessedLines
        }
    };
}
