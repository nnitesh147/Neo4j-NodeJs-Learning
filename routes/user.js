import { Router } from "express";

import {
  createPost,
  followOther,
  friendRequest,
  mutualFriends,
  register,
  suggestedUser,
} from "../controllers/user.js";
import { checkExistUser, isAuthenticated } from "../middlewares/index.js";

const userRouter = Router();

userRouter.post("/register", checkExistUser, register);
userRouter.post("/follow-other-user", isAuthenticated, followOther);

userRouter.post("/friend-request", isAuthenticated, friendRequest);

userRouter.post("/create-post", isAuthenticated, createPost);

userRouter.get("/mutual-friends", isAuthenticated, mutualFriends);

userRouter.get("/suggestion", isAuthenticated, suggestedUser);

export default userRouter;
