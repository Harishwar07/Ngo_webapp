import express from 'express';
import { list, detail, update, remove } from '../controllers/base.controller.js';
import { getStudentDetail, createStudent, updateStudent } from '../controllers/students.controller.js';
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { sanitizeQuery } from "../middleware/sanitizeQuery.middleware.js";
//import { createStudentValidator } from "../validators/student.validator.js";
//import { validateRequest } from "../validators/common.validator.js";

const router = express.Router();

router.get('/', requireAuth, requirePermission("students.read"), list('students'));
router.get('/:id', requireAuth, requirePermission("students.read"), detail('students'));
router.get('/:id/detail', requireAuth, requirePermission("students.read"), getStudentDetail);

router.post( '/', requireAuth, requirePermission("students.create"), createStudent);

router.put( '/:id', requireAuth, requirePermission("students.update"), updateStudent);

router.delete('/:id', requireAuth, requirePermission("students.delete"), remove('students'));

export default router;
