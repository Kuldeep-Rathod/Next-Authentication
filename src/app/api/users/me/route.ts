import { dbConnect } from '@/config/dbConnect';
import User from '@/models/userModel';
import { getDataFromToken } from '@/utils/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';

dbConnect();

export const GET = async (req: NextRequest) => {
    try {
        const userId = await getDataFromToken(req);

        const user = await User.findOne({ _id: userId }).select('-password');

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User Not Found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'User Found',
            data: user,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        });
    }
};
