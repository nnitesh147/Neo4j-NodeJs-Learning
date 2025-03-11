import { Router } from "express";

import {
  createPost,
  followOther,
  friendRequest,
  mutualFriends,
  register,
  suggestedUser,
} from "../controllers/user.js";
import { checkExistUser } from "../middlewares/index.js";

const userRouter = Router();

userRouter.post("/register", checkExistUser, register);
userRouter.post("/follow-other-user", followOther);

userRouter.post("/friend-request", friendRequest);

userRouter.post("/create-post", createPost);

userRouter.get("/mutual-friends", mutualFriends);

userRouter.get("/suggestion", suggestedUser);

export default userRouter;
