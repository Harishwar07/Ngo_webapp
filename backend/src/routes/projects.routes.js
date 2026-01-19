// projects.routes.js
import express from 'express';
import { list, detail, create, update, remove } from '../controllers/base.controller.js';
import { createProject, getProjectDetail, updateProject } from '../controllers/projects.controller.js';
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { sanitizeQuery } from "../middleware/sanitizeQuery.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { projectsValidator } from "../validators/projects.validator.js";

const router = express.Router();

router.get('/', requireAuth, requirePermission("projects.read"), list('projects'));
router.get('/:id', requireAuth, requirePermission("projects.read"), detail('projects'));
router.get('/:id/detail', requireAuth, requirePermission("projects.read"), getProjectDetail);

router.post("/", requireAuth, requirePermission("projects.create"), createProject);

router.put( '/:id', requireAuth, requirePermission("projects.update"), updateProject );

router.delete('/:id', requireAuth, requirePermission("projects.delete"), remove('projects'));

export default router;
