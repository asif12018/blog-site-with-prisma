import { CommentStatus } from "../../../generated/prisma/enums";
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

// delete comment

//1. nijr comment delete korte parbe user
// tar nijr comment kina check korte hobe
const deleteComment = async(commentId: string, authorId: string)=>{
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId: authorId
        },
        select: {
            id: true
        }
    });

    if(!commentData){
        throw new Error("Your provide input is invalid");
    }

    const result = await prisma.comment.delete({
        where:{
            id: commentData.id
        }
    })

    return result


}


//update comment
//author.id, comment id, updated data

const updateComment = async(commentId: string, data:{content?: string, status?:CommentStatus}, authorId:string) =>{
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId: authorId
        },
        select: {
            id: true
        }
    });

    if(!commentData){
        throw new Error("Your provide input is invalid");
    }

    const result = await prisma.comment.update({
        where: {
            id: commentId
        },
        data
    });

    return result;
}


export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment
}