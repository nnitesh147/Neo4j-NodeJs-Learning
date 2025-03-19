import { session } from "neo4j-driver";
import { connectDb } from "../db/index.js";

export const checkExistUser = async (req, res, next) => {
  try {
    const driver = await connectDb();

    const { name, email, user_name } = req.body;
    if ((!name || !email, !user_name)) {
      return res.status(402).json({
        success: false,
        message: "Name , email , user_name required",
      });
    }

    const session = driver.session();

    const result = await session.run(
      "Match (u:User { name: $name , email : $email , user_name : $user_name}) return u",
      { name, email, user_name }
    );

    if (result.records.length != 0) {
      return res.status(404).json({
        success: false,
        message: "User already exists",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const isAuthenticated = async (req, res, next) => {
  // implement authentication logic here
  next();
};
