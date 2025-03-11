import { connectDb } from "../db/index.js";

export const register = async (req, res) => {
  const { name, email, user_name } = req.body;

  try {
    const driver = await connectDb();
    const session = driver.session();

    const result = await session.run(
      "Merge (u:User { name: $name , email : $email , user_name : $user_name}) return u",
      { name, email, user_name }
    );

    return res.status(200).json({
      success: true,
      message: "User Created",
      data: result.records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const followOther = async (req, res) => {
  const { from_user, to_user } = req.body;

  try {
    const driver = await connectDb();

    const session = driver.session();

    const user1 = await session.run(
      "Match(from: User {email:$from_user}) return from",
      { from_user }
    );
    const user2 = await session.run(
      "Match(to: User {email:$to_user}) return to",
      { to_user }
    );

    if (user1.records.length === 0 || user2.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user exists",
        data: [],
      });
    }

    const records = await session.run(
      "Match(from: User {email:$from_user}) Match(to : User {email : $to_user}) Merge (from) - [:FOLLOWS] -> (to) return from , to",
      { from_user, to_user }
    );

    return res.status(200).json({
      success: true,
      message: "followed",
      data: records.records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
      data: [],
    });
  }
};

export const friendRequest = async (req, res) => {
  const { from_user, to_user } = req.body;

  try {
    const driver = await connectDb();

    const session = driver.session();

    const user1 = await session.run(
      "Match(from: User {email:$from_user}) return from",
      { from_user }
    );
    const user2 = await session.run(
      "Match(to: User {email:$to_user}) return to",
      { to_user }
    );

    if (user1.records.length === 0 || user2.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user exists",
        data: [],
      });
    }

    const records = await session.run(
      "Match(from: User {email:$from_user}) Match(to : User {email : $to_user}) Merge (from) - [:FRIENDS] -> (to)  Merge (to) - [:FRIENDS] -> (from) return from , to",
      { from_user, to_user }
    );

    return res.status(200).json({
      success: true,
      message: "Became friend",
      data: records.records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
      data: [],
    });
  }
};

export const createPost = async (req, res) => {
  const { from_user, content } = req.body;

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
      "Match (u:User {email:$from_user}) Merge (p:Post {id: randomUUID(), content: $content , createdAt: datetime()}) Merge (u) - [:POSTED] -> (p) return u , p",
      { from_user, content }
    );
    return res.status(200).json({
      success: true,
      message: "Post created",
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

export const mutualFriends = async (req, res) => {
  const { user, me } = req.query;
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
    const user2 = await session.run(
      "Match(from: User {email:$me}) return from",
      { me }
    );

    if (user2.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user exists",
        data: [],
      });
    }

    const result = await session.run(
      "Match(u1:User) - [:FRIENDS] -> (u2:User {email:$user})  where (u1) - [:FRIENDS] -> (:User {email : $me}) return u1",
      { user, me }
    );
    return res.status(200).json({
      success: true,
      message: "Successfully fetched mutual friends",
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

export const suggestedUser = async (req, res) => {
  const { me } = req.query;
  const driver = await connectDb();

  const session = driver.session();

  try {
    const user1 = await session.run(
      "Match(from: User {email:$me}) return from",
      { me }
    );

    if (user1.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user exists",
        data: [],
      });
    }

    const result = await session.run(
      "MATCH (myself:User {email:$me}), (suggested:User) WHERE myself <> suggested AND NOT (myself)-[:FRIENDS]-(suggested) WITH myself, suggested, shortestPath((myself)-[:FRIENDS*..3]-(suggested)) AS path WHERE path IS NOT NULL RETURN suggested, length(path) AS hops ORDER BY hops, rand() LIMIT 10",
      { me }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully fetched Suggestions friends",
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
