import * as userStore from "../../models/user/services.js";
import { ApiError } from "../../utils/apiError.js";

export const listUsers = async ({ role, status, page = 1, limit = 20 }) => {
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const { items, total } = await userStore.listUsersWithTotal(filter, { skip, limit });

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
  const user = await userStore.updateUserById(id, payload);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};
