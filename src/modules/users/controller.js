import { asyncHandler } from "../../utils/asyncHandler.js";
import { listUsers, updateUserById } from "./service.js";

export const getUsers = asyncHandler(async (req, res) => {
  const data = await listUsers({
    role: req.query.role,
    status: req.query.status,
    page: req.query.page,
    limit: req.query.limit,
  });

  res.status(200).json({ message: "Users fetched", data });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await updateUserById(req.params.userId, req.body);
  res.status(200).json({ message: "User updated", data: user });
});
