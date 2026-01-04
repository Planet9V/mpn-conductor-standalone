import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/**
 * GET /api/styles/recommend
 * Recommends a style based on psychometric state
 * Query params: trauma, entropy, rsi_real, rsi_symbolic, rsi_imaginary
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const trauma = parseFloat(searchParams.get('trauma') || '0.5');
        const entropy = parseFloat(searchParams.get('entropy') || '0.5');
        const rsi_real = parseFloat(searchParams.get('rsi_real') || '0.33');
        const rsi_symbolic = parseFloat(searchParams.get('rsi_symbolic') || '0.33');
        const rsi_imaginary = parseFloat(searchParams.get('rsi_imaginary') || '0.34');

        // Validate inputs
        if (trauma < 0 || trauma > 1 || entropy < 0 || entropy > 1) {
            return NextResponse.json({
                success: false,
                error: 'Trauma and entropy must be between 0 and 1'
            }, { status: 400 });
        }

        const client = await pool.connect();

        try {
            // Use the database recommendation function
            const result = await client.query(`
                SELECT get_recommended_style($1, $2, $3, $4, $5) AS recommended_style
            `, [trauma, entropy, rsi_real, rsi_symbolic, rsi_imaginary]);

            const recommendedStyleId = result.rows[0].recommended_style;

            // Fetch full style details
            const styleResult = await client.query(`
                SELECT 
                    style_id,
                    name,
                    description,
                    orchestration_mode,
                    harmony_complexity,
                    harmony_dissonance_tolerance,
                    texture_density
                FROM musical_styles
                WHERE style_id = $1
            `, [recommendedStyleId]);

            if (styleResult.rows.length === 0) {
                return NextResponse.json({
                    success: false,
                    error: 'Recommended style not found'
                }, { status: 404 });
            }

            const style = styleResult.rows[0];

            return NextResponse.json({
                success: true,
                recommended: {
                    id: style.style_id,
                    name: style.name,
                    description: style.description,
                    orchestrationMode: style.orchestration_mode,
                    complexity: parseFloat(style.harmony_complexity),
                    dissonance: parseFloat(style.harmony_dissonance_tolerance),
                    density: parseFloat(style.texture_density)
                },
                psychometricState: {
                    trauma,
                    entropy,
                    rsi: { real: rsi_real, symbolic: rsi_symbolic, imaginary: rsi_imaginary }
                },
                reasoning: getRecommendationReasoning(trauma, entropy, rsi_real, rsi_symbolic, rsi_imaginary, recommendedStyleId)
            });

        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Error recommending style:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to recommend style',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

/**
 * Explain why a style was recommended
 */
function getRecommendationReasoning(
    trauma: number,
    entropy: number,
    rsi_real: number,
    rsi_symbolic: number,
    rsi_imaginary: number,
    recommendedId: string
): string {
    if (trauma > 0.80) {
        return `High trauma (${trauma.toFixed(2)}) indicates intense psychological distress. Chamber Death's sparse textures and dark harmonies reflect this state.`;
    }

    if (entropy > 0.95) {
        return `Extreme entropy (${entropy.toFixed(2)}) suggests chaotic unpredictability. Cyber Glitch's 32nd note patterns and atonal harmonies capture this.`;
    }

    if (entropy > 0.85) {
        return `High entropy (${entropy.toFixed(2)}) indicates disorder and unpredictability. Avant-Garde's free harmonies match this state.`;
    }

    const dominantRegister = rsi_real > rsi_symbolic && rsi_real > rsi_imaginary ? 'real' :
        rsi_symbolic > rsi_imaginary ? 'symbolic' : 'imaginary';

    if (dominantRegister === 'real' && trauma > 0.60) {
        return `Real register dominance (${rsi_real.toFixed(2)}) with moderate trauma suggests direct confrontation with harsh reality.`;
    }

    if (dominantRegister === 'symbolic' && trauma < 0.40) {
        if (entropy < 0.30) {
            return `Symbolic register dominance (${rsi_symbolic.toFixed(2)}) with low trauma suggests structured, rule-based thinking. Baroque's strict counterpoint fits this.`;
        }
        return `Symbolic register dominance with moderate entropy suggests thematic development and transformation.`;
    }

    if (dominantRegister === 'imaginary') {
        return `Imaginary register dominance (${rsi_imaginary.toFixed(2)}) suggests rich emotional fantasy and idealization. Romantic style's lush harmonies match this.`;
    }

    return `Balanced psychometric state suggests a grand, versatile orchestral approach.`;
}
