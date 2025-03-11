import { session } from "neo4j-driver";
import { connectDb } from "../db/index.js";

export const likedPost = async (req, res) => {
  const { from_user, post_id } = req.body;

  const driver = await connectDb();

  const session = driver.session();

  try {
    const user1 = await session.run(
      "Match(from: User {email:$from_user}) return from",
      { from_user }
    );

    if (user1.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user exists",
        data: [],
      });
    }

    const post1 = await session.run("Match(p: Post {id:$post_id}) return p", {
      post_id,
    });

    if (post1.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No post exists",
        data: [],
      });
    }

    const result = await session.run(
      "Match (u:User {email:$from_user}) Match (p:Post {id:$post_id}) Merge (u) - [:LIKED] -> (p) return u , p",
      { from_user, post_id }
    );
    return res.status(200).json({
      success: true,
      message: "Liked successfully",
      data: result.records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
      data: [],
    });
  }
};

export const commentPost = async (req, res) => {
  const { from_user, post_id, comment_content } = req.body;

  const driver = await connectDb();

  const session = driver.session();

  try {
    const user1 = await session.run(
      "Match(from: User {email:$from_user}) return from",
      { from_user }
    );

    if (user1.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user exists",
        data: [],
      });
    }

    const post1 = await session.run("Match(p: Post {id:$post_id}) return p", {
      post_id,
    });

    if (post1.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No post exists",
        data: [],
      });
    }
    const result = await session.run(
      "Match (u:User {email:$from_user}) Match (p:Post {id:$post_id}) Merge (c:Comment {id: randomUUID(), content: $comment_content, createdAt: datetime()}) Merge (u) - [:COMMENTED] -> (c) MERGE (c) - [:BELONGS] -> (p) return u , p , c",
      { from_user, post_id, comment_content }
    );
    return res.status(200).json({
      success: true,
      message: "Commented successfully",
      data: result.records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
      data: [],
    });
  }
};

export const allPost = async (req, res) => {
  const { from_user } = req.query;
  const driver = await connectDb();

  const session = driver.session();

  try {
    const user1 = await session.run(
      "Match(from: User {email:$from_user}) return from",
      { from_user }
    );

    if (user1.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user exists",
        data: [],
      });
    }

    const result = await session.run(
      "Match(p:Post) where NOT (:User {email : $from_user}) - [:POSTED] -> (p) return p",
      { from_user }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully fetched all posts",
      data: result.records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
      data: [],
    });
  }
};

export const userPost = async (req, res) => {
  const { user } = req.query;
  const driver = await connectDb();

  const session = driver.session();

  try {
    const user1 = await session.run(
      "Match(from: User {email:$user}) return from",
      { user }
    );

    if (user1.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user exists",
        data: [],
      });
    }

    const result = await session.run(
      "Match(p:Post) where (:User {email : $user}) - [:POSTED] -> (p) return p",
      { user }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully fetched user posts",
      data: result.records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
      data: [],
    });
  }
};
