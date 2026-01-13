import express, { NextFunction, Request, Response, Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();


//get all post

router.get("/", PostController.getAllPost)


router.post("/", auth(UserRole.USER),PostController.createPost)


router.get("/:postId", PostController.getPostById);



export const postRouter: Router = router