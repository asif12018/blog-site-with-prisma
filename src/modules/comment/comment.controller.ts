import { Request, Response } from "express";
import { commentService } from "./comment.service";




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



export const commentController = {
    createComment
}