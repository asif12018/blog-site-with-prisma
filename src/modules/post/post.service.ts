
import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


//create a post service



const createPost = async(data: Omit<Post, "id" | "createdAt" | "updatedAt">)=>{
  const result = await prisma.post.create({
    data
  })

  return result
}

export const PostService = {
    createPost
}