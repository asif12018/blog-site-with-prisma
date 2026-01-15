import { prisma } from "../../lib/prisma"
import IComment from "../../types/comment.types"





const createComment = async(payload: IComment) =>{
    //find the data if not exist throw error
    await prisma.post.findUniqueOrThrow({
    where :{
        id: payload.postId
    }
   });
   //find the data if not exist throw error
   if(payload.parentId){
   await prisma.comment.findUniqueOrThrow({
        where: {
            id: payload.parentId
        }
     })
   }
   
   const result = await prisma.comment.create({
    data: payload
   });
   return result;
}


export const commentService = {
    createComment
}