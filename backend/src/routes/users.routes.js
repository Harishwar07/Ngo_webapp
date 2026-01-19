import express from "express";
import {
  createUser,
  listUsers,
  getUserById
} from "../controllers/users.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { approveUser } from "../controllers/users.controller.js";

const router = express.Router();

// Create new user (Admin creates users)
// POST /api/v1/users
router.post("/", createUser);

// List all users
// GET /api/v1/users
router.get("/", listUsers);

// Get single user
// GET /api/v1/users/:id
router.get("/:id", getUserById);


router.patch( "/:id/approve", requireAuth, requireRole("Admin", "SuperAdmin"), approveUser );

export default router;
