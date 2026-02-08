import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

// node mailer code

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
   socialProviders: {
        google: { 
             prompt: "select_account consent",
             accessType: "offline", 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
           
        }, 
    },
  emailVerification: {
    sendOnSignUp:true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        (async () => {
          const verificationUrl = `${process.env.BETTER_AUTH_URL}/verify-email?token=${token}`;
          const info = await transporter.sendMail({
            from: 'Prisma blog" <prismablog@ph.com>',
            to: user.email,
            subject: "verify your email",
            text: "verify your email", // Plain-text version of the message
            html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 0; width: 100% !important; }
        .email-wrapper { width: 100%; margin: 0; padding: 0; background-color: #f4f4f7; }
        .email-content { width: 100%; max-width: 570px; margin: 0 auto; padding: 40px 0; }
        .email-body { background-color: #ffffff; border-radius: 8px; padding: 45px; border: 1px solid #e8e8e8; }
        .logo { font-size: 24px; font-weight: bold; color: #333; text-decoration: none; display: block; text-align: center; margin-bottom: 25px; }
        h1 { color: #333333; font-size: 22px; font-weight: bold; text-align: left; margin-top: 0; }
        p { font-size: 16px; line-height: 1.625; color: #51545e; margin: 24px 0; }
        .button { background-color: #22bc66; border-radius: 6px; color: #FFF; display: inline-block; font-size: 16px; font-weight: bold; line-height: 45px; text-align: center; text-decoration: none; width: 200px; -webkit-text-size-adjust: none; }
        .footer { text-align: center; padding: 25px; }
        .footer p { font-size: 12px; color: #a8aaaf; }
        .sub { font-size: 12px; color: #a8aaaf; margin-top: 25px; border-top: 1px solid #e8e8e8; padding-top: 20px; word-break: break-all; }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-content">
            <a href="${process.env.BETTER_AUTH_URL}" class="logo">Prisma Blog</a>
            <div class="email-body">
                <h1>Verify your email address</h1>
                <p>Thanks for signing up for Prisma Blog! We're excited to have you as part of our community. To get started, please confirm your email address by clicking the button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" class="button" target="_blank" style="color: #ffffff;">Verify Email</a>
                </div>

                <p>This verification link will expire in 24 hours. If you did not create an account, no further action is required.</p>
                
                <p>Best regards,<br>The Prisma Blog Team</p>

                <p class="sub">
                    If you’re having trouble clicking the "Verify Email" button, copy and paste the URL below into your web browser:<br>
                    <a href="${verificationUrl}">${verificationUrl}</a>
                </p>
            </div>
            <div class="footer">
                <p>&copy; 2026 Prisma Blog. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>`,
          });

          console.log("Message sent:", info.messageId);
        })();
      } catch (err) {
        console.error(err)
        throw err;
      }
    },
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL!,"http://localhost:3000"]
});
