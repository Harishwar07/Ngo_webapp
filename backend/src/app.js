import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import dotenv from "dotenv";
import { sanitizeBody } from "./middleware/sanitize.middleware.js";

import studentRoutes from "./routes/students.routes.js";
import donorRoutes from "./routes/donors.routes.js";
import volunteerRoutes from "./routes/volunteers.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import financeRoutes from "./routes/finance.routes.js";
import boardRoutes from "./routes/board.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import genericRoutes from "./routes/generic.routes.js";
import { enforceHTTPS } from "./middleware/https.middleware.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
app.set("trust proxy", 1); // ✅ REQUIRED for HTTPS detection
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(cookieParser());
app.use(
  helmet({
    hsts: process.env.NODE_ENV === "production"
      ? { maxAge: 31536000, includeSubDomains: true }
      : false
  })
);
app.use(cors({
  origin: "https://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(sanitizeBody);
app.use(enforceHTTPS);

/* ================= CSRF SETUP ================= */

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  }
});

/* CSRF token endpoint */
app.get("/api/v1/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

/* CSRF protection (exclude login & refresh) */
app.use((req, res, next) => {
  const csrfExcludedRoutes = [
    "/api/v1/auth/login",
    "/api/v1/auth/refresh",
      // FILE UPLOAD ROUTES
    "/api/v1/volunteers",
    "/api/v1/volunteers/",
    "/api/v1/board_members",
    "/api/v1/board_members/",
  ];

  if (
    csrfExcludedRoutes.some(route => req.path.startsWith(route)) &&
    ["POST", "PUT"].includes(req.method)
  ) {
    return next();
  }


  return csrfProtection(req, res, next);
});

/* ================= ROUTES ================= */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/donors", donorRoutes);
app.use("/api/v1/volunteers", volunteerRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/finance_reports", financeRoutes);
app.use("/api/v1/board_members", boardRoutes);
app.use("/api/v1", genericRoutes);

app.use("/uploads", express.static("uploads"));

export default app;
