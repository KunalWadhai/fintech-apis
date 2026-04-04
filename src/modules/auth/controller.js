import { asyncHandler } from "../../utils/asyncHandler.js";
import { loginUser, registerUser } from "./service.js";
import { validateLoginBody, validateRegisterBody } from "./validation.js";

export const register = asyncHandler(async (req, res) => {
  validateRegisterBody(req.body);
  const user = await registerUser(req.body);
  res.status(201).json({ message: "User registered", data: user });
});

export const login = asyncHandler(async (req, res) => {
  validateLoginBody(req.body);
  const payload = await loginUser(req.body);
  res.status(200).json({ message: "Login successful", data: payload });
});
