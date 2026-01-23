import { Request, Response } from "express"
import { postService } from "./post.service";
import { Post } from "../../../generated/prisma/client";

const createPost = async (req: Request, res: Response) => {
    // res.send("Create a new post")
    // console.log({req,res});
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log(user)
        const result = await postService.createPost(req.body, user.id)
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const PostController = {
    createPost
}
