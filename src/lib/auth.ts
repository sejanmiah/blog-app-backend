import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma/client";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from "@/generated/prisma/client";

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
        },
    },
});