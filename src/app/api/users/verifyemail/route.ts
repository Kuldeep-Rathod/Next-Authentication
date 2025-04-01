import { dbConnect } from '@/config/dbConnect';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

dbConnect();

export const POST = async (req: NextRequest) => {
    try {
        const reqBody = await req.json();

        const { token } = reqBody;
        console.log(token);

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid Token' },
                { status: 400 }
            );
        }
        console.log(user);

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            success: true,
            message: 'User Verified Successfully',
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
