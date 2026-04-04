import { asyncHandler } from "../../utils/asyncHandler.js";
import { clearAuthCookie, setAuthCookie } from "../../utils/authCookie.js";
import { getAuthProfile, loginUser, registerUser } from "./service.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({ message: "User registered", data: user });
});

export const login = asyncHandler(async (req, res) => {
  const { accessToken, user } = await loginUser(req.body);
  setAuthCookie(res, accessToken);
  res.status(200).json({ message: "Login successful", data: { user } });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ message: "Logged out" });
});

export const me = asyncHandler(async (req, res) => {
  const user = await getAuthProfile(req.user.sub);
  res.status(200).json({ message: "OK", data: user });
});
