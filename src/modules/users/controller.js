import { asyncHandler } from "../../utils/asyncHandler.js";
import { listUsers, updateUserById } from "./service.js";
import { validateUserUpdateBody } from "./validation.js";

export const getUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);

  const data = await listUsers({
    role: req.query.role,
    status: req.query.status,
    page,
    limit,
  });

  res.status(200).json({ message: "Users fetched", data });
});

export const updateUser = asyncHandler(async (req, res) => {
  validateUserUpdateBody(req.body);
  const user = await updateUserById(req.params.userId, req.body);
  res.status(200).json({ message: "User updated", data: user });
});
