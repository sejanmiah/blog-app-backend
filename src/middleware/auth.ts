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

// const auth = (...roles: UserRole[]) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         // console.log("Middleware inititaed");
//         // console.log("Roles:", roles);
//         try {
//             console.log("Roles:", roles);
//             const session = await betterAuth.api.getSession({
//                 headers: req.headers as any
//             })
//             // console.log("Session:", session);
//             if (!session) {
//                 return res.status(401).json({
//                     success: false,
//                     message: "Unauthorized access"
//                 })
//             }
//             if (!session.user.emailVerified) {
//                 return res.status(403).json({
//                     success: false,
//                     message: "Email not verified"
//                 })
//             }
//             req.user = {
//                 id: session.user.id,
//                 email: session.user.email,
//                 role: session.user.role as string,
//                 emailVerified: session.user.emailVerified

//             }



//             if (roles.length && !roles.includes(req.user.role as UserRole)) {
//                 return res.status(406).json({
//                     success: false,
//                     message: "Forbidden access! You dont have permission acess this resource."
//                 })
//             }
//             next();
//         } catch (error) {

//            return console.error("Authentication error:", error);

//         }
//     }
// }


// const auth = (...roles: UserRole[]) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             // get user session
//             const session = await betterAuth.api.getSession({
//                 headers: req.headers as any
//             })

//             if (!session) {
//                 return res.status(401).json({
//                     success: false,
//                     message: "You are not authorized!"
//                 })
//             }

//             if (!session.user.emailVerified) {
//                 return res.status(403).json({
//                     success: false,
//                     message: "Email verification required. Please verfiy your email!"
//                 })
//             }

//             req.user = {
//                 id: session.user.id,
//                 email: session.user.email,
//                 name: session.user.name,
//                 // role: session.user.role as string,
//                 role: session.user.role?.toLowerCase() as string,
//                 emailVerified: session.user.emailVerified
//             }

//             if (roles.length && !roles.includes(req.user.role as UserRole)) {
//                 return res.status(403).json({
//                     success: false,
//                     message: "Forbidden! You don't have permission to access this resources!"
//                 })
//             }

//             next()
//         } catch (err) {
//             console.error("Authentication error:", err);
//         }

//     }
// };


const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            })

            if (!session) {
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
                // role: session.user.role.toUpperCase(), // 🔥 FIX HERE
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