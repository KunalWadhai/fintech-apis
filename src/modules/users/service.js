import { User } from "../../models/user/index.js";
import { ApiError } from "../../utils/apiError.js";

export const listUsers = async ({ role, status, page = 1, limit = 20 }) => {
  const query = {};
  if (role) query.role = role;
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    User.find(query, { passwordHash: 0 }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  };
};

export const updateUserById = async (id, payload) => {
  const user = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    projection: { passwordHash: 0 },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
