import express, { NextFunction, Request, Response, Router } from "express";
import { PostController } from "./post.controller";

const router = express.Router();

const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log("Middleware inititaed");
        try {
            next();
        }catch (error) {
            console.error("Authentication error:", error);
        }
    }
}


router.post("/", auth(), PostController.createPost);

export const postRouter: Router = router;