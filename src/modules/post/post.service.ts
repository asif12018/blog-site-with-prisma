
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

//get post

const getAllPost = async(payload: {search: string | undefined})=>{
  const result = await prisma.post.findMany({
    where: {
      OR: [
        {
          title : {
        contains: payload.search as string,
        mode: "insensitive"
      }
        },
      {
        content: {
        contains: payload.search as string,
        mode: "insensitive"
      }
      },
      { 
        //this is array. so contains will not work
        tags: {
          has: payload.search as string
        }
      }
      ]
    }
  }
  );
  return result;
}

export const PostService = {
    createPost,
    getAllPost
}