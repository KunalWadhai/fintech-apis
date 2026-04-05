import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { listUsers, updateUserById } from "./service.js";

export const getUsers = asyncHandler(async (req, res) => {
  const q = req.validatedQuery;
  const result = await listUsers({
    role: q.role,
    status: q.status,
    page: q.page,
    limit: q.limit,
  });

  sendSuccess(res, 200, { items: result.items }, {
    message: "Users retrieved successfully",
    meta: { pagination: result.pagination },
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await updateUserById(req.validatedParams.userId, req.body);
  sendSuccess(res, 200, user, { message: "User updated successfully" });
});
