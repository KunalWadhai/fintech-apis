import bcrypt from "bcrypt";
import { User } from "../../models/user/index.js";
import { signAccessToken } from "../../utils/token.js";
import { ApiError } from "../../utils/apiError.js";

const SAFE_USER_PROJECTION = {
  _id: 1,
  name: 1,
  email: 1,
  role: 1,
  status: 1,
  createdAt: 1,
  updatedAt: 1,
};

export const registerUser = async ({ name, email, password, role, status }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const created = await User.create({ name, email, passwordHash, role, status });
  return User.findById(created._id, SAFE_USER_PROJECTION);
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "User account is inactive");
  }

  const token = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    status: user.status,
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};
