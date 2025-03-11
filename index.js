import express from "express";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("Server is running");
});

// user routes
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

app.listen(3000, async () => {
  console.log("Server is running");
});
