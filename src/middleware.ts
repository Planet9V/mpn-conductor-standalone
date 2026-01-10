/**
 * Next.js Middleware for Authentication
 * Protects routes and enforces login requirements
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
    '/dashboard',
    '/projects',
    '/admin',
];

// Routes that are always public
const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/register',
    '/request-access',
    '/mpn-conductor', // TODO: Make protected after testing
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/logout',
    '/api/psychoscore/generate', // API routes use their own auth
    '/api/health',
];

// Check if path matches any pattern
function matchesPattern(path: string, patterns: string[]): boolean {
    return patterns.some(pattern => {
        if (pattern.endsWith('*')) {
            return path.startsWith(pattern.slice(0, -1));
        }
        return path === pattern || path.startsWith(pattern + '/');
    });
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for static files and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // file extensions (images, etc.)
    ) {
        return NextResponse.next();
    }

    // Allow public routes
    if (matchesPattern(pathname, PUBLIC_ROUTES)) {
        return NextResponse.next();
    }

    // Check for auth token in cookies
    const authToken = request.cookies.get('mpn_auth_token');

    // Protected routes require authentication
    if (matchesPattern(pathname, PROTECTED_ROUTES)) {
        if (!authToken) {
            // Redirect to login with return URL
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('returnUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // For all other routes, allow access (security by default can be enabled later)
    return NextResponse.next();
}

export const config = {
    // Run middleware on all routes except static files
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
