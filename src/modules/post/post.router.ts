import express, { NextFunction, Request, Response, Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();


//get all post

router.get("/", PostController.getAllPost)
router.get("/my-posts", auth(UserRole.ADMIN, UserRole.USER), PostController.getMyPost);

router.post("/", auth(UserRole.USER, UserRole.ADMIN),PostController.createPost)


router.get("/:postId", PostController.getPostById);

router.patch("/:postId", auth(UserRole.ADMIN, UserRole.USER), PostController.updataPost);

export const postRouter: Router = router