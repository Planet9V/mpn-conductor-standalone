
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { STYLE_PRESETS, MusicalStyle } from '@/components/mpn-lab/styles';
import { LiteraryScenario, ScenarioFrame } from '@/components/mpn-lab/types';

// Helper to parse raw text into frames (Server-side version of the import logic)
function parseTextToFrames(text: string): { speaker: string; text: string; description: string }[] {
    const lines = text.split('\n');
    const frames = [];
    const speakerPatterns = [
        /^([A-Z][A-Z\s]+)[\.:]\s*(.*)$/,
        /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*[\.:]\s*(.*)$/,
        /^([A-Z]{2,}(?:\s+[A-Z]+)*)\.\s+(.*)$/,
    ];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.length < 5) continue;
        if (/^\s*\[.*\]\s*$/.test(trimmed)) continue;
        if (/^\s*\(.*\)\s*$/.test(trimmed)) continue;
        if (/^ACT\s+/i.test(trimmed) || /^SCENE\s+/i.test(trimmed)) continue;

        for (const pattern of speakerPatterns) {
            const match = trimmed.match(pattern);
            if (match && match[2] && match[2].length > 10) {
                const speaker = match[1].trim();
                const text = match[2].trim();
                frames.push({
                    speaker,
                    text,
                    description: text.substring(0, 100)
                });
                break;
            }
        }
    }
    return frames.slice(0, 50); // Limit to 50 frames for performance
}

// Mock Psychometric Analysis (Chaos/Trauma)
// In a real system, this would use NLP vectors.
function analyzePsychometrics(text: string, style: MusicalStyle) {
    // Length correlates to Entropy?
    const lengthEntropy = Math.min(text.length / 200, 1);

    // Random perturbation
    const trauma = Math.random() * 0.8 + 0.1;

    // Style influence
    // High Density style -> Higher Entropy baseline
    const entropy = (lengthEntropy + style.texture.density) / 2;

    return { trauma, entropy };
}


export async function POST(req: NextRequest) {
    try {
        const { playId, styleId } = await req.json();

        if (!playId || !styleId) {
            return NextResponse.json({ error: 'Missing playId or styleId' }, { status: 400 });
        }

        const style = STYLE_PRESETS[styleId];
        if (!style) {
            return NextResponse.json({ error: 'Invalid styleId' }, { status: 400 });
        }

        // 1. Fetch Raw Play
        const result = await db.query('SELECT * FROM plays WHERE id = $1', [playId]);

        // Handle "db-" prefix if passed from UI (though ID should be clean UUID or similar)
        // If not found, check if it's a legacy static one (we can't process static ones via DB, but checking anyway)
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Play not found in database' }, { status: 404 });
        }

        const play = result.rows[0];
        const rawText = play.source_text || '';

        // 2. Parse
        const rawFrames = parseTextToFrames(rawText);
        if (rawFrames.length === 0) {
            return NextResponse.json({ error: 'No dialogue detected in script' }, { status: 422 });
        }

        // 3. Generate Scenario
        const frames: ScenarioFrame[] = rawFrames.map((rf, i) => {
            const metrics = analyzePsychometrics(rf.text, style);
            return {
                name: `Scene ${i + 1}`,
                description: rf.description,
                trauma: parseFloat(metrics.trauma.toFixed(2)),
                entropy: parseFloat(metrics.entropy.toFixed(2)),
                focusLayer: i % 7, // Cycle through layers
                script: {
                    speaker: rf.speaker,
                    text: rf.text,
                    chord: 'TBD', // Orchestrator handles this later
                    analysis: `Style: ${style.name} | Complexity: ${style.harmony.complexity}`
                }
            };
        });

        // Pick a color based on style
        const styleColors: Record<string, string> = {
            'orchestral': '#d97706', // Amber
            'jazz': '#3b82f6', // Blue
            'minimalist': '#10b981', // Emerald
            'avant_garde': '#ef4444', // Red
            'electronic': '#8b5cf6', // Violet
        };

        const processedData: LiteraryScenario = {
            id: play.id, // Keep same ID
            title: play.title,
            author: play.author,
            theme: `${style.name} Adaptation`,
            color: styleColors[styleId] || '#6b7280',
            frames: frames
        };

        // 4. Update DB
        await db.query(
            'UPDATE plays SET is_processed = true, processed_data = $1, description = $2 WHERE id = $3',
            [processedData, `Processed as ${style.name}`, playId]
        );

        return NextResponse.json({ success: true, processedData });

    } catch (error) {
        console.error('Processing error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
