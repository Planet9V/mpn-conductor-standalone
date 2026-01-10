import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const result = await db.query('SELECT * FROM user_activity_log ORDER BY created_at DESC LIMIT 100');
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}
