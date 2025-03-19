import { Router } from "express";
import {
  allPost,
  commentPost,
  likedPost,
  userPost,
} from "../controllers/post.js";
import { isAuthenticated } from "../middlewares/index.js";

const postRouter = Router();

postRouter.post("/liked-a-post", isAuthenticated, likedPost);

postRouter.post("/comment", isAuthenticated, commentPost);

postRouter.get("/all", isAuthenticated, allPost);

postRouter.get("/user", isAuthenticated, userPost);

export default postRouter;
