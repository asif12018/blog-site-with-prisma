import { prisma } from "../../lib/prisma"
import IComment from "../../types/comment.types"




// create comment
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

//get comment by id

const getCommentById = async (commentId: string) =>{
    const result = await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true,
                }
            }
        }
    })

    return result
}

// get post by author id

const getCommentByAuthorId = async(authorId: string) =>{
    const result = await prisma.comment.findMany({
        where: {
            authorId: authorId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
    return result;
}


export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthorId
}