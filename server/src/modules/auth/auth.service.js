import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import { conflict, unauthorized } from "../../utils/httpError.js";

export const registerUser = async (data) => {
  const { name, email, password, phone, role } = data;
  if (role === "ADMIN") {
    throw unauthorized("Admin registration is not allowed");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw conflict("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      phone,
      role,
    },
  });

  return user;
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw unauthorized("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    throw unauthorized("Invalid credentials");
  }

  return user;
};