import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";


const createPost = async (req: Request, res: Response) => {
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
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

//get post controller

const getAllPost = async (req: Request, res: Response) => {
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
    const {page, limit, skip, sortBy, sortOrder } = options;
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
      sortOrder 
    });
    return res.status(200).json({
      success: true,
      message: "post retrieved",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};
export const PostController = {
  createPost,
  getAllPost,
};
