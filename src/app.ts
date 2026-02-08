import express, { Application, Request, Response } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRouter } from "./modules/comment/comment.router";
import errorHandler from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
const app: Application = express();
app.use(express.json());

app.use(
  cors({
   origin: [
      "http://localhost:3000",        // Your Frontend
      process.env.BETTER_AUTH_URL!,   // Your Backend (http://localhost:5000)
    ],
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", postRouter);

app.use("/comments", commentRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "hello world",
  });
});

app.use(notFound)
app.use(errorHandler)

export default app;
