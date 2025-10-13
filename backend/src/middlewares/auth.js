import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/, "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) return res.status(403).json({ error: "Forbidden" });
  next();
};
