
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET a single play by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        const result = await db.query('SELECT * FROM plays WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Play not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('[API] Get play failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        // Delete the play
        const result = await db.query('DELETE FROM plays WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Play not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, deleted: result.rows[0] });

    } catch (error) {
        console.error('[API] Delete play failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // This is a minimal update implementation
        // Construct SET clause dynamically
        const keys = Object.keys(body).filter(k => k !== 'id');
        if (keys.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

        const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
        const values = keys.map(k => {
            const val = body[k];
            return (k === 'processed_data' && typeof val === 'object') ? JSON.stringify(val) : val;
        });

        const query = `UPDATE plays SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`;

        const result = await db.query(query, [id, ...values]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Play not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);

    } catch (error) {
        console.error('[API] Update play failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
