import { Router } from "express";
import {
  allPost,
  commentPost,
  likedPost,
  userPost,
} from "../controllers/post.js";

const postRouter = Router();

postRouter.post("/liked-a-post", likedPost);

postRouter.post("/comment", commentPost);

postRouter.get("/all", allPost);

postRouter.get("/user", userPost);

export default postRouter;
