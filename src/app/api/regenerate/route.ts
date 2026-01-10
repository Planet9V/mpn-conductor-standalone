import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Real-time Score Regeneration API
 * Regenerates music from a specific beat using current psychometric state
 */

export async function POST(request: Request) {
    try {
        const {
            projectId,
            fromBeat,
            psychometricOverrides,
            actorMappings,
            orchestrationMode
        } = await request.json();

        if (typeof fromBeat !== 'number') {
            return NextResponse.json({ error: 'fromBeat is required' }, { status: 400 });
        }

        // Log regeneration request
        console.log(`[Regenerate API] Starting regeneration from beat ${fromBeat}`);

        // Fetch project config if ID provided
        let projectConfig = null;
        if (projectId) {
            const result = await db.query(
                'SELECT config FROM user_projects WHERE id = $1',
                [projectId]
            );
            projectConfig = result.rows[0]?.config || {};
        }

        // Build regeneration parameters
        const regenerationParams = {
            startBeat: fromBeat,
            psychometrics: psychometricOverrides || projectConfig?.psychometrics || {
                trauma: 0.5,
                entropy: 0.5,
                rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 }
            },
            actorMappings: actorMappings || projectConfig?.actorMappings || [],
            orchestrationMode: orchestrationMode || projectConfig?.orchestrationMode || 'leitmotif_wagnerian',
            temperature: calculateDynamicTemperature(psychometricOverrides?.entropy || 0.5)
        };

        // Queue regeneration job (in production, this would go to a worker)
        const jobId = `regen_${Date.now()}_${Math.random().toString(36).slice(2)}`;

        // Log audit entry
        await db.query(
            `INSERT INTO user_activity_log (action, details) 
       VALUES ($1, $2)`,
            ['SCORE_REGENERATION', JSON.stringify({
                jobId,
                fromBeat,
                projectId,
                orchestrationMode: regenerationParams.orchestrationMode,
                timestamp: new Date().toISOString()
            })]
        );

        return NextResponse.json({
            success: true,
            jobId,
            message: `Regeneration queued from beat ${fromBeat}`,
            params: {
                startBeat: regenerationParams.startBeat,
                temperature: regenerationParams.temperature,
                orchestrationMode: regenerationParams.orchestrationMode,
                actorCount: regenerationParams.actorMappings.length
            }
        });

    } catch (error) {
        console.error('[Regenerate API] Error:', error);
        return NextResponse.json({ error: 'Regeneration failed' }, { status: 500 });
    }
}

/**
 * Calculate dynamic temperature based on entropy
 * Higher entropy → higher temperature (more variation)
 */
function calculateDynamicTemperature(entropy: number): number {
    const BASE_TEMP = 0.7;
    const TEMP_RANGE = 0.5; // 0.7 - 1.2 range
    return BASE_TEMP + (entropy * TEMP_RANGE);
}

export async function GET() {
    return NextResponse.json({
        endpoint: '/api/regenerate',
        method: 'POST',
        description: 'Real-time score regeneration from a specific beat',
        body: {
            projectId: 'string (optional)',
            fromBeat: 'number (required)',
            psychometricOverrides: 'object (optional)',
            actorMappings: 'array (optional)',
            orchestrationMode: 'string (optional)'
        },
        returns: {
            success: 'boolean',
            jobId: 'string',
            params: 'object'
        }
    });
}
