import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Ensure table exists (lazy init)
const ensureTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS score_variants (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            play_id INTEGER REFERENCES plays(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            ai_model VARCHAR(50) NOT NULL,
            musical_style_id VARCHAR(50) NOT NULL,
            voice_overrides JSONB DEFAULT '{}',
            parameter_overrides JSONB DEFAULT '{}',
            is_generated BOOLEAN DEFAULT FALSE,
            generated_score JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

// GET /api/variants?play_id=123
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const playId = searchParams.get('play_id');

        if (!playId) {
            return NextResponse.json({ error: 'play_id is required' }, { status: 400 });
        }

        await ensureTable();

        const result = await db.query(
            'SELECT * FROM score_variants WHERE play_id = $1 ORDER BY created_at DESC',
            [playId]
        );

        return NextResponse.json(result.rows);
    } catch (error: any) {
        console.error('[API-VARIANTS] GET Error:', error.message || error);
        return NextResponse.json({
            error: 'Failed to fetch variants',
            details: error.message
        }, { status: 500 });
    }
}

// POST /api/variants
export async function POST(request: Request) {
    try {
        await ensureTable();
        const body = await request.json();
        const {
            play_id,
            name,
            ai_model,
            musical_style_id,
            voice_overrides,
            parameter_overrides
        } = body;

        if (!play_id || !name || !ai_model || !musical_style_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await db.query(
            `INSERT INTO score_variants
            (play_id, name, ai_model, musical_style_id, voice_overrides, parameter_overrides)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                play_id,
                name,
                ai_model,
                musical_style_id,
                JSON.stringify(voice_overrides || {}),
                JSON.stringify(parameter_overrides || {})
            ]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        console.error('[API-VARIANTS] POST Error:', error.message || error);
        return NextResponse.json({
            error: 'Failed to create variant',
            details: error.message
        }, { status: 500 });
    }
}
