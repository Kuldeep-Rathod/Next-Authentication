import { dbConnect } from '@/config/dbConnect';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

dbConnect();

export const getDataFromToken = async (req: NextRequest) => {
    try {
        const token = req.cookies.get('token')?.value || '';

        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

        return decodedToken.id;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
