import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // 1. Fetch user
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 2. Check password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 3. User approval check
        if (!user.is_approved) {
            return NextResponse.json({ error: 'Your account is pending administrator approval.' }, { status: 403 });
        }

        // 4. Create a simple token (in production, use JWT)
        const token = Buffer.from(JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        })).toString('base64');

        // 5. Create response with cookie
        const response = NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });

        // Set auth cookie for middleware
        response.cookies.set('mpn_auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60, // 24 hours
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

