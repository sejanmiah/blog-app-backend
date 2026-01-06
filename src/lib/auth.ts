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
            sendVerificationEmail: async ( { user, url, token }, request) => {
            console.log(`send email to ${user.email}`)
            const info = await transporter.sendMail({
            from: '"Prisma Blog App" <prisma@blog.com>',
            to: "sejankhan931@gmail.com",
            subject: "Hello ✔",
            text: "Hello world?", // Plain-text version of the message
            html: "<b>Hello world?</b>", // HTML version of the message
        });
        },
    },
});