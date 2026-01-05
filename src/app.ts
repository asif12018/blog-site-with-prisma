import express, { Application, Request, Response } from "express";
import { postRouter } from "./modules/post/post.router";

const app: Application = express();
app.use(express.json());


app.use("/posts", postRouter);

app.get("/",(req: Request,res:Response)=>{
    res.status(200).json({
        success:true,
        message:"hello world"
    })
})

export default app;