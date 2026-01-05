import express, { Request, Response, Router } from "express";
import { PostController } from "./post.controller";

const router = express.Router();

router.post("/", PostController.createPost)






export const postRouter: Router = router