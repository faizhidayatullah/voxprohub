// src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { prisma } from "./config/prisma.js";
import { requireAuth, requireRole } from "./middlewares/auth.js";

/* ==========================
   Setup upload folder
========================== */
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const name = `img_${Date.now()}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

/* ==========================
   Initialize Express App
========================== */
const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Serve static uploads
app.use("/uploads", express.static(UPLOAD_DIR));

/* ==========================
   Routes dasar
========================== */
app.get("/", (_, res) => res.send("VoxproHub API is running 🚀"));
app.get("/health", (_, res) => res.json({ ok: true }));

/* ==========================
   Auth & Admin routes
========================== */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);

/* ==========================
   Public Rooms
========================== */
app.get("/api/v1/rooms", async (_, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    res.json(rooms);
  } catch {
    res.status(500).json({ error: "Failed to list rooms" });
  }
});

app.get("/api/v1/rooms/:id", async (req, res) => {
  try {
    const room = await prisma.room.findUnique({ where: { id: req.params.id } });
    if (!room || !room.isActive) return res.status(404).json({ error: "Not found" });
    res.json(room);
  } catch {
    res.status(500).json({ error: "Failed to get room" });
  }
});

/* ==========================
   Unavailable Slots
========================== */
app.get("/api/v1/rooms/:id/unavailable", async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // format: YYYY-MM-DD
    if (!date) return res.status(400).json({ error: "date is required (YYYY-MM-DD)" });

    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    const slots = await prisma.unavailableSlot.findMany({
      where: { roomId: id, date: { gte: startOfDay, lte: endOfDay } },
      orderBy: { start: "asc" },
    });
    res.json(slots);
  } catch {
    res.status(500).json({ error: "Failed to fetch unavailable slots" });
  }
});

app.get("/api/v1/rooms/:id/unavailable-range", async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ error: "start & end required" });

    const s = new Date(`${start}T00:00:00`);
    const e = new Date(`${end}T23:59:59`);

    const slots = await prisma.unavailableSlot.findMany({
      where: { roomId: id, date: { gte: s, lte: e } },
      orderBy: [{ date: "asc" }, { start: "asc" }],
    });
    res.json(slots);
  } catch {
    res.status(500).json({ error: "Failed to fetch range slots" });
  }
});

/* ==========================
   Contact Info
========================== */
app.get("/api/v1/contact", async (_, res) => {
  const c = await prisma.contactInfo.findUnique({ where: { id: "singleton" } });
  res.json(c || null);
});

app.put("/api/v1/admin/contact", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { whatsapp, waMessage, instagram } = req.body;
    const c = await prisma.contactInfo.upsert({
      where: { id: "singleton" },
      update: { whatsapp, waMessage, instagram },
      create: { id: "singleton", whatsapp, waMessage, instagram },
    });
    res.json(c);
  } catch {
    res.status(500).json({ error: "Failed to update contact" });
  }
});

/* ==========================
   Admin Rooms CRUD
========================== */
app.get("/api/v1/admin/rooms", requireAuth, requireRole("ADMIN"), async (_, res) => {
  try {
    const rooms = await prisma.room.findMany({ orderBy: { createdAt: "desc" } });
    res.json(rooms);
  } catch {
    res.status(500).json({ error: "Failed to list rooms (admin)" });
  }
});

app.post("/api/v1/admin/rooms", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { name, capacity, pricePerHour, facilities = [], isActive = true } = req.body;
    const room = await prisma.room.create({
      data: {
        name,
        capacity: Number(capacity),
        pricePerHour: Number(pricePerHour),
        facilities,
        isActive,
      },
    });
    res.status(201).json(room);
  } catch {
    res.status(500).json({ error: "Failed to create room" });
  }
});

app.patch("/api/v1/admin/rooms/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.capacity !== undefined) data.capacity = Number(data.capacity);
    if (data.pricePerHour !== undefined) data.pricePerHour = Number(data.pricePerHour);
    const room = await prisma.room.update({ where: { id: req.params.id }, data });
    res.json(room);
  } catch {
    res.status(500).json({ error: "Failed to update room" });
  }
});

app.delete("/api/v1/admin/rooms/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    // soft delete
    const room = await prisma.room.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json(room);
  } catch {
    res.status(500).json({ error: "Failed to delete room" });
  }
});

/* ==========================
   Admin Unavailable Slots
========================== */
app.post("/api/v1/admin/unavailable", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { roomId, date, start, end, reason } = req.body || {};
    if (!roomId || !date || !start || !end) return res.status(400).json({ error: "roomId, date, start, end are required" });
    if (start >= end) return res.status(400).json({ error: "start must be earlier than end" });

    const day = new Date(`${date}T00:00:00`);

    const overlaps = await prisma.unavailableSlot.findFirst({
      where: {
        roomId,
        date: day,
        OR: [{ start: { lt: end }, end: { gt: start } }],
      },
    });
    if (overlaps) return res.status(409).json({ error: "Time slot overlaps with existing block" });

    const slot = await prisma.unavailableSlot.create({
      data: { roomId, date: day, start, end, reason },
    });
    res.status(201).json(slot);
  } catch {
    res.status(500).json({ error: "Failed to create slot" });
  }
});

app.delete("/api/v1/admin/unavailable/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    await prisma.unavailableSlot.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch {
    res.status(500).json({ error: "Failed to delete slot" });
  }
});

/* ==========================
   Landing Content
========================== */
app.get("/api/v1/landing", async (_, res) => {
  try {
    const data = await prisma.landingContent.findUnique({ where: { id: "landing" } });
    res.json(data || null);
  } catch {
    res.status(500).json({ error: "Failed to get landing content" });
  }
});

app.put("/api/v1/admin/landing", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { heroTitle, heroSubtitle, heroImage, visiTitle, visiText } = req.body;
    const data = await prisma.landingContent.upsert({
      where: { id: "landing" },
      update: { heroTitle, heroSubtitle, heroImage, visiTitle, visiText },
      create: { id: "landing", heroTitle, heroSubtitle, heroImage, visiTitle, visiText },
    });
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to update landing content" });
  }
});

/* ==========================
   Image Upload (Admin)
========================== */
app.post("/api/v1/admin/upload", requireAuth, requireRole("ADMIN"), upload.single("file"), async (req, res) => {
  try {
    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(201).json({ url });
  } catch {
    res.status(500).json({ error: "Failed to upload file" });
  }
});

/* ==========================
   Error Handler & Server Start
========================== */
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
