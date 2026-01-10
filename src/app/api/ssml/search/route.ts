import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // 'elements' | 'prosody' | 'emotions' | 'all'

    try {
        let results: any = {};

        if (type === 'all' || type === 'elements') {
            const elements = query
                ? await db.query(
                    `SELECT * FROM ssml_elements WHERE 
             element_name ILIKE $1 OR description ILIKE $1 OR syntax ILIKE $1
             ORDER BY element_name`,
                    [`%${query}%`]
                )
                : await db.query('SELECT * FROM ssml_elements ORDER BY element_name');
            results.elements = elements.rows;
        }

        if (type === 'all' || type === 'prosody') {
            const prosody = query
                ? await db.query(
                    `SELECT * FROM ssml_prosody_params WHERE 
             param_name ILIKE $1 OR description ILIKE $1
             ORDER BY param_name`,
                    [`%${query}%`]
                )
                : await db.query('SELECT * FROM ssml_prosody_params ORDER BY param_name');
            results.prosody = prosody.rows;
        }

        if (type === 'all' || type === 'emotions') {
            const emotions = query
                ? await db.query(
                    `SELECT * FROM ssml_emotion_styles WHERE 
             style_name ILIKE $1 OR description ILIKE $1
             ORDER BY style_name`,
                    [`%${query}%`]
                )
                : await db.query('SELECT * FROM ssml_emotion_styles ORDER BY style_name');
            results.emotions = emotions.rows;
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error('SSML search error:', error);
        return NextResponse.json({ error: 'Failed to search SSML reference' }, { status: 500 });
    }
}
