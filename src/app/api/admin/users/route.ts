import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const result = await db.query('SELECT id, name, email, role, is_approved, created_at FROM users ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
