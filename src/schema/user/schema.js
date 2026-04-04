import mongoose from "mongoose";
import { ROLE_VALUES, ROLES } from "../../constants/roles.js";

export const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
      },
      passwordHash: { type: String, required: true },
      role: { type: String, enum: ROLE_VALUES, default: ROLES.VIEWER, index: true },
      status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
    },
    { timestamps: true, versionKey: false }
  );
  
  userSchema.methods.comparePassword = function comparePassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  };