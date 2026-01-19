import express from "express";
import { list, detail, update, remove } from "../controllers/base.controller.js";
import { createDonor, getDonorDetail, updateDonor } from "../controllers/donors.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

const router = express.Router();

router.get("/", requireAuth, requirePermission("donors.read"), list("donors"));
router.get("/:id", requireAuth, requirePermission("donors.read"), detail("donors"));
router.get("/:id/detail", requireAuth, requirePermission("donors.read"), getDonorDetail);   // 👈 important

router.post("/", requireAuth, requirePermission("donors.create"), createDonor);
router.put("/:id", requireAuth, requirePermission("donors.update"), updateDonor);
router.delete("/:id", requireAuth, requirePermission("donors.delete"), remove("donors"));

export default router;
