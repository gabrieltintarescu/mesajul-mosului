import { NextResponse } from 'next/server';

export interface AdminLoginRequest {
    password: string;
}

// POST /api/admin/login - Admin login
export async function POST(request: Request) {
    try {
        const body: AdminLoginRequest = await request.json();

        if (!body.password) {
            return NextResponse.json(
                { success: false, error: 'Password is required' },
                { status: 400 }
            );
        }

        const adminPassword = process.env.ADMIN_PASSWORD || 'santa2024';

        if (body.password !== adminPassword) {
            return NextResponse.json(
                { success: false, error: 'Invalid password' },
                { status: 401 }
            );
        }

        // Generate a simple token (in production, use JWT)
        const token = 'admin_token_' + adminPassword;

        return NextResponse.json({
            success: true,
            data: { token },
        });
    } catch (error) {
        console.error('Error in POST /api/admin/login:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
