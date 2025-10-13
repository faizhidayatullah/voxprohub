import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function register(req, res, next) {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email already used" });
    const passwordHash = await bcrypt.hash(password, 10);
    const u = await prisma.user.create({ data: { name, email, passwordHash } });
    res.status(201).json({ id: u.id, name: u.name, email: u.email, role: u.role });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const u = await prisma.user.findUnique({ where: { email } });
    if (!u) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: u.id, email: u.email, role: u.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: u.id, name: u.name, email: u.email, role: u.role } });
  } catch (e) {
    next(e);
  }
}

export function me(req, res) {
  res.json({ user: req.user });
}
