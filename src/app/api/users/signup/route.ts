import { dbConnect } from "@/config/dbConnect";
import User from "@/models/userModel";
import { sendEmail } from "@/utils/mailer";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export const POST = async (req: NextRequest) => {
    try {
        const ReqBody = await req.json();

        const { email, password, username } = ReqBody;
        console.log(ReqBody);

        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            username,
        });

        const savedUser = await newUser.save();
        console.log(savedUser);

        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

        return NextResponse.json({
            success: true,
            message: "User created successfully",
            savedUser,
        });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
};
