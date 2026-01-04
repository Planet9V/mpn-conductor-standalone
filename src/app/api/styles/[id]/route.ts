import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/**
 * GET /api/styles/[id]
 * Get details for a specific style including psychometric mappings
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const styleId = params.id;
        const client = await pool.connect();

        try {
            // Fetch style details
            const styleResult = await client.query(`
                SELECT *
                FROM musical_styles
                WHERE style_id = $1
            `, [styleId]);

            if (styleResult.rows.length === 0) {
                return NextResponse.json({
                    success: false,
                    error: 'Style not found'
                }, { status: 404 });
            }

            const row = styleResult.rows[0];

            // Fetch psychometric mappings
            const mappingsResult = await client.query(`
                SELECT 
                    psychometric_entry_id,
                    psychometric_dimension,
                    weight,
                    priority,
                    applies_when_trauma_gt,
                    applies_when_trauma_lt,
                    applies_when_entropy_gt,
                    applies_when_entropy_lt,
                    applies_when_rsi_register,
                    affects_rhythm,
                    affects_harmony,
                    affects_dynamics,
                    affects_timbre
                FROM style_psychometric_mappings
                WHERE style_id = $1
                ORDER BY priority ASC, weight DESC
            `, [styleId]);

            const style = {
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
                isCustom: row.is_custom,
                psychometricMappings: mappingsResult.rows.map(m => ({
                    entryId: m.psychometric_entry_id,
                    dimension: m.psychometric_dimension,
                    weight: parseFloat(m.weight),
                    priority: m.priority,
                    conditions: {
                        traumaGt: m.applies_when_trauma_gt ? parseFloat(m.applies_when_trauma_gt) : null,
                        traumaLt: m.applies_when_trauma_lt ? parseFloat(m.applies_when_trauma_lt) : null,
                        entropyGt: m.applies_when_entropy_gt ? parseFloat(m.applies_when_entropy_gt) : null,
                        entropyLt: m.applies_when_entropy_lt ? parseFloat(m.applies_when_entropy_lt) : null,
                        rsiRegister: m.applies_when_rsi_register
                    },
                    affects: {
                        rhythm: m.affects_rhythm,
                        harmony: m.affects_harmony,
                        dynamics: m.affects_dynamics,
                        timbre: m.affects_timbre
                    }
                }))
            };

            return NextResponse.json({
                success: true,
                style
            });

        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Error fetching style:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch style',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
