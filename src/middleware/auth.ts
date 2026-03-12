import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";




export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            })

            if (!session) {
                console.log("No session found for request");
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized!"
                })
            }

            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Email verification required!"
                })
            }

            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: (session.user.role ?? UserRole.USER).toUpperCase(),
                emailVerified: session.user.emailVerified
            }

            if (roles.length && !roles.includes(req.user.role as UserRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden! You don't have permission to access this resource!"
                })
            }

            next()
        } catch (err) {
            console.error("Authentication error:", err)
            return res.status(500).json({
                success: false,
                message: "Authentication failed"
            })
        }
    }
}

export default auth;