import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma/client";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from "@/generated/prisma/client";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});





// const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,

    sendVerificationEmail: async ({ user, url, token }, request) => {
      try{
        
      const verificationURl = `${process.env.APP_URL}/verify-emial?token=${token}`

      console.log(user, url, token)
      console.log(`send email to ${user.email}`)
      const info = await transporter.sendMail({
        from: '"Prisma Blog App" <prisma@blog.com>',
        to: user.email,
        subject: "Hello ✔",
        text: "Hello world?", // Plain-text version of the message
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#111827; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">
                Prisma Blog App
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <h2 style="margin-top:0;">Verify your email address</h2>

              <p style="font-size:15px; line-height:1.6;">
                Hi <strong>${user.name}</strong>,
              </p>

              <p style="font-size:15px; line-height:1.6;">
                Thanks for registering on <strong>Prisma Blog App</strong>.
                Please confirm your email address by clicking the button below.
              </p>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${verificationURl}"
                   style="
                     background:#2563eb;
                     color:#ffffff;
                     text-decoration:none;
                     padding:14px 28px;
                     border-radius:6px;
                     font-size:16px;
                     display:inline-block;
                   ">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; line-height:1.6; color:#555555;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="font-size:13px; word-break:break-all; color:#2563eb;">
                ${verificationURl}
              </p>

              <p style="font-size:14px; color:#777777; margin-top:30px;">
                If you didn’t create an account, you can safely ignore this email.
              </p>

              <p style="font-size:14px; margin-top:20px;">
                — Prisma Blog App Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#999999;">
              © 2026 Prisma Blog App. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
      });
      } catch(err){
        console.error("Error sending verification email:", err);
      }
    },
  },
      socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});