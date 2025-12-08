import { NextResponse } from 'next/server';

// Simple in-memory rate limiter
// In production, use Redis or a proper rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Max requests per window
}

/**
 * Rate limit by IP address
 * @returns null if allowed, NextResponse if rate limited
 */
export function rateLimit(
    request: Request,
    config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 }
): NextResponse | null {
    const ip = getClientIP(request);
    const now = Date.now();

    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        // New window
        rateLimitMap.set(ip, { count: 1, resetTime: now + config.windowMs });
        return null;
    }

    if (record.count >= config.maxRequests) {
        return NextResponse.json(
            { success: false, error: 'Too many requests. Please try again later.' },
            { status: 429 }
        );
    }

    record.count++;
    return null;
}

/**
 * Get client IP from request headers
 */
function getClientIP(request: Request): string {
    // Check common headers for client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    // Fallback to a default (in production, you might want to handle this differently)
    return 'unknown';
}

/**
 * Clean up old rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
        if (now > record.resetTime) {
            rateLimitMap.delete(ip);
        }
    }
}

// Clean up every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupRateLimits, 5 * 60 * 1000);
}

/**
 * Verify internal API key for service-to-service calls
 */
export function verifyInternalApiKey(request: Request): boolean {
    const apiKey = request.headers.get('x-api-key');
    const internalKey = process.env.INTERNAL_API_KEY;

    if (!internalKey) {
        console.error('INTERNAL_API_KEY is not set');
        return false;
    }

    return apiKey === internalKey;
}

/**
 * Generate a secure admin token (simple HMAC-based)
 */
export function generateAdminToken(): string {
    const password = process.env.ADMIN_PASSWORD;
    const secret = process.env.ADMIN_TOKEN_SECRET || process.env.INTERNAL_API_KEY || 'fallback-secret';

    if (!password) {
        throw new Error('ADMIN_PASSWORD not set');
    }

    // Create a more secure token format
    const timestamp = Date.now();
    const payload = `admin:${timestamp}:${secret}`;
    // Simple hash - in production use proper JWT
    const hash = Buffer.from(payload).toString('base64');
    return `${timestamp}.${hash}`;
}

/**
 * Verify admin token
 */
export function verifyAdminToken(authHeader: string): boolean {
    const token = authHeader.replace('Bearer ', '');
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        return false;
    }

    // Support both old format (for backwards compat) and new format
    // Old format: admin_token_{password}
    if (token === `admin_token_${adminPassword}`) {
        return true;
    }

    // New format: {timestamp}.{hash}
    const parts = token.split('.');
    if (parts.length === 2) {
        const [timestampStr] = parts;
        const timestamp = parseInt(timestampStr, 10);

        // Token expires after 24 hours
        const maxAge = 24 * 60 * 60 * 1000;
        if (Date.now() - timestamp > maxAge) {
            return false;
        }

        const secret = process.env.ADMIN_TOKEN_SECRET || process.env.INTERNAL_API_KEY || 'fallback-secret';
        const expectedPayload = `admin:${timestamp}:${secret}`;
        const expectedHash = Buffer.from(expectedPayload).toString('base64');

        return token === `${timestamp}.${expectedHash}`;
    }

    return false;
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeString(input: string, maxLength: number = 500): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    return input
        .slice(0, maxLength)
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
