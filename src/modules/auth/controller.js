import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { clearAuthCookie, setAuthCookie } from "../../utils/authCookie.js";
import { getAuthProfile, loginUser, registerUser } from "./service.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  sendSuccess(res, 201, user, { message: "User registered successfully" });
});

export const login = asyncHandler(async (req, res) => {
  const { accessToken, user } = await loginUser(req.body);
  setAuthCookie(res, accessToken);
  sendSuccess(res, 200, { user }, { message: "Login successful" });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  sendSuccess(res, 200, null, { message: "Logged out successfully" });
});

export const me = asyncHandler(async (req, res) => {
  const user = await getAuthProfile(req.user.sub);
  sendSuccess(res, 200, user, { message: "Profile retrieved successfully" });
});
