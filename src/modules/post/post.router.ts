import express, { NextFunction, Request, Response, Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();


//get all post

router.get("/", PostController.getAllPost)
router.get("/my-posts", auth(UserRole.ADMIN, UserRole.USER), PostController.getMyPost);

router.get("/stats", auth(UserRole.ADMIN),PostController.getStats);

router.post("/", auth(UserRole.USER, UserRole.ADMIN),PostController.createPost);


router.get("/:postId", PostController.getPostById);

router.patch("/:postId", auth(UserRole.ADMIN, UserRole.USER), PostController.updataPost);

router.delete("/:postId", auth(UserRole.USER, UserRole.ADMIN), PostController.deletePost);

export const postRouter: Router = router