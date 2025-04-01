import { dbConnect } from '@/config/dbConnect';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

dbConnect();

export async function GET() {
    try {
        // Clear the token cookie
        (await cookies()).delete('token');

        return NextResponse.json(
            { success: true, message: 'Logout successful' },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
