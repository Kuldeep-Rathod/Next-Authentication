import { dbConnect } from "@/config/dbConnect";
import { NextResponse } from "next/server";

dbConnect();

export const POST = async () => {
    try {
        const response = NextResponse.json(
            { success: true, message: "User Logged Out Successfully" },
            { status: 200 }
        );

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
};
