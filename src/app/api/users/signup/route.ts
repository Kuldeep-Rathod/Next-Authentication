import { NextResponse } from 'next/server';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/config/dbConnect';

dbConnect();

export async function POST(request: Request) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        // Validation checks
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return NextResponse.json(
            {
                message: 'User created successfully',
                success: true,
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
