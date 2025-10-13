import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const r = Router();
r.use(requireAuth, requireRole("ADMIN"));
r.get("/metrics", (req, res) => {
  res.json({ weekBookings: 0, occupancyRate: 0, pending: 0 });
});
export default r;
