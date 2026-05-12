import { registerUser, loginUser } from "./auth.service.js";
import { generateToken } from "../../utils/jwt.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import prisma from "../../config/prisma.js";

const toPublicUser = (user) => {
  if (!user) return user;
  const { passwordHash: _omit, ...publicFields } = user;
  return publicFields;
};

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  const token = generateToken(user);

  res.json({
    message: "User registered",
    token,
    user: toPublicUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await loginUser(email, password);

  const token = generateToken(user);

  res.json({
    message: "Login successful",
    token,
    user: toPublicUser(user),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json(toPublicUser(user));
});