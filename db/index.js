import { configDotenv } from "dotenv";
import neo4j from "neo4j-driver";

configDotenv();

export const connectDb = async () => {
  const URI = process.env.DB_URI; // Database URL
  const USER = process.env.DB_USER; // Database User ID
  const PASSWORD = process.env.DB_PASSWORD; // User Password

  // Neo4j driver instance
  const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
  if (driver.verifyConnectivity()) {
    console.log("Database connected");
  }
  return driver;
};
