import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { is_approved, role } = await request.json();
        const { id } = params;

        if (is_approved !== undefined) {
            await db.query('UPDATE users SET is_approved = $1 WHERE id = $2', [is_approved, id]);
        }

        if (role !== undefined) {
            await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
        }

        // Log the action
        await db.query(
            'INSERT INTO user_activity_log (user_id, action, details) VALUES ($1, $2, $3)',
            [id, 'ADMIN_UPDATE', JSON.stringify({ is_approved, role })]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
