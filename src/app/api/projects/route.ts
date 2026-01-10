import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const result = await db.query('SELECT * FROM user_projects ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, description, config, user_id, is_template } = await request.json();
        const result = await db.query(
            'INSERT INTO user_projects (name, description, config, user_id, is_template) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, config || {}, user_id, is_template || false]
        );
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
