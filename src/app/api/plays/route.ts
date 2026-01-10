import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Ensure table exists (lazy init for dev environment)
const ensureTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS plays (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255),
            year VARCHAR(100),
            theme VARCHAR(255),
            description TEXT,
            source_text TEXT,
            is_processed BOOLEAN DEFAULT FALSE,
            processed_data JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

export async function GET() {
    try {
        await ensureTable();
        const result = await db.query('SELECT * FROM plays ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error: any) {
        console.error('[API-PLAYS] GET Error:', error.message || error);
        return NextResponse.json({
            error: 'Failed to fetch plays',
            details: error.message
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await ensureTable();
        const body = await request.json();
        const { title, author, year, theme, description, source_text, is_processed, processed_data } = body;

        const result = await db.query(
            `INSERT INTO plays
            (title, author, year, theme, description, source_text, is_processed, processed_data)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                title,
                author,
                year,
                theme,
                description || '',
                source_text || '',
                is_processed || false,
                processed_data ? JSON.stringify(processed_data) : null
            ]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        console.error('[API-PLAYS] POST Error:', error.message || error);
        return NextResponse.json({
            error: 'Failed to create play',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
