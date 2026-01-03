import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Middleware to handle maintenance mode
 * Set APP_IS_ACTIVE=inactive in Vercel env vars to enable maintenance mode
 * Default is "active" (site is accessible)
 */
export function middleware(request: NextRequest) {
    const isActive = process.env.APP_IS_ACTIVE !== 'inactive';

    // If app is active, allow all requests
    if (isActive) {
        return NextResponse.next();
    }

    // Allow access to maintenance page, static files, and API routes
    const { pathname } = request.nextUrl;

    // Paths that should always be accessible
    const allowedPaths = [
        '/maintenance',
        '/api/', // Allow API routes (for health checks, etc.)
        '/_next/', // Next.js internals
        '/favicon.ico',
        '/santaicon2.png',
        '/robots.txt',
    ];

    const isAllowedPath = allowedPaths.some(path => pathname.startsWith(path));

    if (isAllowedPath) {
        return NextResponse.next();
    }

    // Redirect all other requests to maintenance page
    const maintenanceUrl = new URL('/maintenance', request.url);
    return NextResponse.rewrite(maintenanceUrl);
}

export const config = {
    // Match all paths except static files
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};
