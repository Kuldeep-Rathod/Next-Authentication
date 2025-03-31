import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/config/dbConnect";

dbConnect();

export const POST = async (req: NextRequest) => {
    try {
        const reqBody = await req.json();
        const { email, password } = reqBody;

        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User Not Found" },
                { status: 404 }
            );
        }

        const validPassword = bcrypt.compare(password, user.password);

        if (!validPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Incorrect Credentials",
                },
                { status: 401 }
            );
        }

        const tokenData = { id: user._id };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
            expiresIn: "1h",
        });

        const response = NextResponse.json(
            { success: true, message: `Welcome back ${user.username}` },
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
};
