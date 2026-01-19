import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

export const requireAuth = async (req, res, next) => {
  try {
    // ✅ Access token only
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // ✅ Verify access token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // ✅ Validate session still active
    const [sessions] = await db.query(
      `
      SELECT id
      FROM user_sessions
      WHERE user_id = ?
        AND session_id = ?
        AND expires_at > NOW()
      `,
      [decoded.id, decoded.session_id]
    );

    if (!sessions.length) {
      return res.status(401).json({ message: "Session expired or revoked" });
    }

    // Attach user
    req.user = decoded; // { id, email, role, session_id }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Access token expired" });
  }
};



export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
