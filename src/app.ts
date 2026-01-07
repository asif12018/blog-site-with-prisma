import express, { Application, Request, Response } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
const app: Application = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.BETTER_AUTH_URL,
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", postRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "hello world",
  });
});

export default app;
