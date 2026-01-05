import { Request, Response } from "express";
import { PostService } from "./post.service";


const createPost = async(req:Request, res:Response) =>{
    try{
       const data = req.body;
       if(data.length === 0){
         return res.status(404).json({
            success: false,
            message:"missing data on req.body"
         })
       }
       const result = await PostService.createPost(data);
       return res.status(201).json({
        success: true,
        message: "post created successfully",
        data: result
       })
    }catch(err: any){
        res.status(500).json({
            success:false,
            message: err.message,
            details: err
        })
    }
}

export const PostController = {
    createPost
}