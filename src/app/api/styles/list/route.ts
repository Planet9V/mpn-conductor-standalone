import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/**
 * GET /api/styles/list
 * Returns all available musical styles
 */
export async function GET(request: NextRequest) {
    try {
        const client = await pool.connect();

        try {
            const result = await client.query(`
                SELECT 
                    style_id,
                    name,
                    description,
                    orchestration_mode,
                    rhythm_base_division,
                    rhythm_syncopation_weight,
                    rhythm_swing,
                    rhythm_tempo_min,
                    rhythm_tempo_max,
                    harmony_complexity,
                    harmony_dissonance_tolerance,
                    harmony_preferred_modes,
                    texture_density,
                    texture_voice_leading_strictness,
                    is_system,
                    is_custom
                FROM musical_styles
                ORDER BY 
                    is_system DESC,
                    name ASC
            `);

            const styles = result.rows.map(row => ({
                id: row.style_id,
                name: row.name,
                description: row.description,
                orchestrationMode: row.orchestration_mode,
                rhythm: {
                    base_division: row.rhythm_base_division,
                    syncopation_weight: parseFloat(row.rhythm_syncopation_weight),
                    swing: row.rhythm_swing,
                    tempo_range: [row.rhythm_tempo_min, row.rhythm_tempo_max]
                },
                harmony: {
                    complexity: parseFloat(row.harmony_complexity),
                    dissonance_tolerance: parseFloat(row.harmony_dissonance_tolerance),
                    preferred_modes: row.harmony_preferred_modes || []
                },
                texture: {
                    density: parseFloat(row.texture_density),
                    voice_leading_strictness: parseFloat(row.texture_voice_leading_strictness)
                },
                isSystem: row.is_system,
                isCustom: row.is_custom
            }));

            return NextResponse.json({
                success: true,
                count: styles.length,
                styles
            });

        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Error fetching styles:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch styles',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
