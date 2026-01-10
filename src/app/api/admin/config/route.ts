import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const result = await db.query('SELECT * FROM system_config ORDER BY key ASC');
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { key, value, description } = await request.json();
        await db.query(
            'INSERT INTO system_config (key, value, description) VALUES ($1, $2, $3) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description',
            [key, value, description]
        );
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
    }
}
