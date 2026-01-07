
import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


//create a post service



const createPost = async(data: Omit<Post, "id" | "createdAt" | "updatedAt" | 'authorId'>, userId: string)=>{
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId
    }
  })

  return result
}

export const PostService = {
    createPost
}