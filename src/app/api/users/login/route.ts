import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/config/dbConnect';

dbConnect();

export const POST = async (req: NextRequest) => {
    try {
        const reqBody = await req.json();
        const { email, password } = reqBody;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation Error',
                    message: 'Email and password are required',
                },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Authentication Error',
                    message: 'Invalid email or password', // Generic message for security
                },
                { status: 401 }
            );
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Authentication Error',
                    message: 'Invalid email or password', // Same message as above
                },
                { status: 401 }
            );
        }

        // Create token
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username,
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
            expiresIn: '1h',
        });

        // Create response
        const response = NextResponse.json(
            {
                success: true,
                message: `Welcome back ${user.username}`,
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                },
            },
            { status: 200 }
        );

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60, // 1 hour
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Server Error',
                message: error.message || 'An unexpected error occurred',
            },
            { status: 500 }
        );
    }
};
