import nodemailer from "nodemailer";

export const sendEmail = async ({
    email,
    emailType,
    userId,
}: {
    email: string;
    emailType: string;
    userId: string;
}) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: "maddison53@ethereal.email",
                pass: "jn7jnAPss4f63QBp6D",
            },
        });

        const mailOptions = {
            from: "yourusername@email.com",
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Verify your email"
                    : "Reset your password",
            html: `<p>Click <a href="http://localhost:3000/verifyemail?token=${userId}">here</a> to ${
                emailType === "VERIFY"
                    ? "verify your email"
                    : "reset your password"
            }</p>`,
        };

        // Send the email
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;
    } catch (error) {
        console.log("error in sending mail", error);
    }
};
