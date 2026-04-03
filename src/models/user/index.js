import mongoose from "mongoose";
import { userSchema } from "../../schema/user/schema.js";


export const User = mongoose.model("User", userSchema);
