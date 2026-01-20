import { NextFunction, Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middleware/auth";

const createPost = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const data = req.body;
    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "missing data on req.body",
      });
    }
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized",
      });
    }
    const result = await PostService.createPost(data, user.id as string);
    return res.status(201).json({
      success: true,
      message: "post created successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

//get post controller

const getAllPost = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    // accepting true and false
    const isFeatured =
      req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const options = paginationSortingHelper(req.query);
    const { page, limit, skip, sortBy, sortOrder } = options;
    const result = await PostService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    return res.status(200).json({
      success: true,
      message: "post retrieved",
      data: result,
    });
  } catch (err: any) {
   next(err)
  }
};

//get post by Id

const getPostById = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const { postId } = req.params;
    const result = await PostService.getPostById(postId!);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err)
  }
};

//get my post

const getMyPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.user?.id;
    if(!userId){
      throw new Error("unauthorized");
    }
    const result = await PostService.getMyPost(userId as string);
    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

//update post

const updataPost = async(req:Request, res:Response, next:NextFunction) =>{
  try{
    const user = req.user;
    if(!user){
      throw new Error("You are unauthorized");
    }
    const {postId} = req.params
    const isAdmin = user.role === UserRole.ADMIN;
    const result = await PostService.updatePost(postId as string, req.body, user.id, isAdmin);

    return res.status(201).json({
      success: true,
      message: "post updated successfully",
      data: result
    })

  }catch(err:any){
   next(err)
  }
}

//delete post
const deletePost = async(req:Request, res:Response, next: NextFunction) =>{
  try{
    const user = req.user;
    if(!user){
      throw new Error("You are unauthorized");
    }
    const {postId} = req.params
    const isAdmin = user.role === UserRole.ADMIN;
    const result = await PostService.deletePost(postId as string,  user.id, isAdmin);

    return res.status(201).json({
      success: true,
      message: "post deleted successfully",
      data: result
    })

  }catch(err:any){
    next(err);
  }
}

//state for admin dashboard

const getStats = async(req: Request, res:Response, next: NextFunction)=>{
   try{

    const result = await PostService.getStats();
    return res.status(200).json({
      success: true,
      message: "Data retrieve successfully",
      data: result
    })

   }catch(err:any){
    next(err);
   }
}

export const PostController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPost,
  updataPost,
  deletePost,
  getStats
};
