import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async () => {
  const connection = await mongoose.connect(env.mongoUri);
  if(connection.connection.readyState === 1) {
    console.log("Connected to MongoDB");
  } else {
    console.log("Failed to connect to MongoDB");
  }
  return mongoose.connection;
};
