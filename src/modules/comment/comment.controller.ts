import { Request, Response } from "express";
import { commentService } from "./comment.service";



// create comment
const createComment = async(req: Request, res: Response) =>{
  try{
    const user = req.user;
     req.body.authorId = user?.id;
     const result = await commentService.createComment(req.body);
     return res.status(201).json({
        success: true,
        message: "Comment created successFully",
        data: result
     })
  }catch(err:any){
    return res.status(500).json({
       success: false,
       message: err.message,
       details: err
    })
  }
}

// get comment by id

const getCommentById = async(req: Request, res: Response) =>{
  try{
    
    const {commentId} = req.params;
    const result = await commentService.getCommentById(commentId as string)


    return res.status(200).json({
      success: true,
      message: 'Comment retrieved successfully',
      data: result
    })

  }catch(err:any){
    return res.status(500).json({
      success: false,
      message: err.message,
      details: err
    })
  }
}

// get comment by authorId

const getCommentByAuthorId = async(req:Request, res: Response) =>{
   try{
      const {authorId} = req.params;
      const result = await commentService.getCommentByAuthorId(authorId as string);
      
      return res.status(200).json({
        success: true,
        message: 'Comment retrieved successfully',
        data: result
      })
   }catch(err:any){
     return res.status(500).json({
      success: false,
      message: err.message,
      details: err
     })
   }
}



export const commentController = {
    createComment,
    getCommentById,
    getCommentByAuthorId
}