import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


const createPost = async (data: any, userId: string) => {
    console.log("Post Service [createPost] called with data:", JSON.stringify(data));
    
    // Explicitly destructure to ensure 'tag' is removed from 'rest'
    const { tag, tags, ...rest } = data;
    
    let finalTags: string[] = [];
    if (Array.isArray(tags)) {
        finalTags = tags;
    } else if (Array.isArray(tag)) {
        finalTags = tag;
    } else if (typeof tag === 'string') {
        finalTags = [tag];
    } else if (typeof tags === 'string') {
        finalTags = [tags];
    }

    console.log("Data being sent to Prisma:", JSON.stringify({ ...rest, tags: finalTags, authorId: userId }));

    const result = await prisma.post.create({
        data: {
            ...rest,
            tags: finalTags,
            authorId: userId
        }
    })
    return result;
}


export const postService = {
    createPost
}