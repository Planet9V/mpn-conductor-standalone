import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/variants/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const result = await db.query('SELECT * FROM score_variants WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        console.error('[API-VARIANTS] GET ID Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/variants/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Dynamic update construction
        const keys = Object.keys(body).filter(k => k !== 'id' && k !== 'created_at');
        if (keys.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

        const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
        const values = keys.map(k => {
            const val = body[k];
            return (typeof val === 'object' && val !== null) ? JSON.stringify(val) : val;
        });

        const query = `UPDATE score_variants SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`;

        const result = await db.query(query, [id, ...values]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        console.error('[API-VARIANTS] PUT Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/variants/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const result = await db.query('DELETE FROM score_variants WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, deleted: result.rows[0] });
    } catch (error: any) {
        console.error('[API-VARIANTS] DELETE Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
