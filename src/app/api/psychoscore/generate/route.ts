/**
 * PSYCHOSCORE API Route
 * 
 * Proxies requests to the PSYCHOSCORE FastAPI inference server.
 * Handles authentication, rate limiting, and error management.
 * 
 * @endpoint POST /api/psychoscore/generate
 */

import { NextRequest, NextResponse } from 'next/server';

// PSYCHOSCORE inference server URL (configurable via env)
const PSYCHOSCORE_SERVER_URL = process.env.PSYCHOSCORE_SERVER_URL || 'http://localhost:8001';

// Rate limiting (simple in-memory, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

interface GenerateRequest {
    disc?: { D: number; I: number; S: number; C: number };
    ocean?: { O: number; C: number; E: number; A: number; N: number };
    rsi?: { real: number; symbolic: number; imaginary: number };
    trauma?: number;
    entropy?: number;
    dark_triad?: { machiavellianism: number; narcissism: number; psychopathy: number };
    cognitive_biases?: string[];
    physics?: {
        hamiltonian_energy?: number;
        ising_spin?: '+' | '-';
        granovetter_threshold?: number;
        lyapunov_exponent?: number;
    };
    key?: string;
    mode?: string;
    tempo?: number;
    max_bars?: number;
    temperature?: number;
    top_p?: number;
}

function checkRateLimit(clientId: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(clientId);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (record.count >= RATE_LIMIT) {
        return false;
    }

    record.count++;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        // Get client identifier (IP or user ID from session)
        const clientId = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'anonymous';

        // Check rate limit
        if (!checkRateLimit(clientId)) {
            return NextResponse.json(
                { success: false, error: 'Rate limit exceeded. Try again later.' },
                { status: 429 }
            );
        }

        // Parse request body
        const body: GenerateRequest = await request.json();

        // Validate required fields
        if (body.trauma !== undefined && (body.trauma < 0 || body.trauma > 1)) {
            return NextResponse.json(
                { success: false, error: 'trauma must be between 0 and 1' },
                { status: 400 }
            );
        }
        if (body.entropy !== undefined && (body.entropy < 0 || body.entropy > 1)) {
            return NextResponse.json(
                { success: false, error: 'entropy must be between 0 and 1' },
                { status: 400 }
            );
        }

        // Forward request to PSYCHOSCORE inference server
        const response = await fetch(`${PSYCHOSCORE_SERVER_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...body,
                // Ensure defaults
                trauma: body.trauma ?? 0.3,
                entropy: body.entropy ?? 0.3,
                max_bars: body.max_bars ?? 32,
                top_p: body.top_p ?? 0.9,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[PSYCHOSCORE API] Server error: ${response.status}`, errorText);
            return NextResponse.json(
                { success: false, error: `Inference server error: ${response.status}` },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);

    } catch (error) {
        console.error('[PSYCHOSCORE API] Request failed:', error);

        // Check if it's a connection error
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return NextResponse.json(
                { success: false, error: 'PSYCHOSCORE server unavailable. Is the inference server running?' },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Health check endpoint
 */
export async function GET() {
    try {
        const response = await fetch(`${PSYCHOSCORE_SERVER_URL}/health`, {
            method: 'GET',
        });

        const isHealthy = response.ok;
        return NextResponse.json({
            status: isHealthy ? 'healthy' : 'unhealthy',
            server: PSYCHOSCORE_SERVER_URL,
            timestamp: new Date().toISOString(),
        });
    } catch {
        return NextResponse.json({
            status: 'unavailable',
            server: PSYCHOSCORE_SERVER_URL,
            error: 'Cannot connect to inference server',
            timestamp: new Date().toISOString(),
        });
    }
}
