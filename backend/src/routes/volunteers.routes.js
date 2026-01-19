import express from 'express';
import { list, detail, update, remove } from '../controllers/base.controller.js';
import { createVolunteer, getVolunteerDetail, updateVolunteer } from '../controllers/volunteers.controller.js';
import { uploadPdf } from "../middleware/upload.middleware.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

const router = express.Router();

router.get('/', requireAuth, requirePermission("volunteers.read"), list('volunteers'));
router.get('/:id', requireAuth, requirePermission("volunteers.read"), detail('volunteers'));
router.get('/:id/detail', requireAuth, requirePermission("volunteers.read"), getVolunteerDetail);

router.post('/', requireAuth, requirePermission("volunteers.create"), uploadPdf.single("proof_file_url"), createVolunteer);

router.put('/:id', requireAuth, requirePermission("volunteers.update"), uploadPdf.single("proof_file_url"), updateVolunteer);

router.delete('/:id', requireAuth, requirePermission("volunteers.delete"), remove('volunteers'));

export default router;
