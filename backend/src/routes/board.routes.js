// board.routes.js
import express from 'express';
import { list, detail, create, update, remove } from '../controllers/base.controller.js';
import { createBoardMember, getBoardMemberDetail, updateBoardMember } from '../controllers/board.controller.js';
import { uploadPdf } from "../middleware/upload.middleware.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

const router = express.Router();

router.get('/',requireAuth, requirePermission("board_members.read"), list('board_members'));
router.get('/:id',requireAuth, requirePermission("board_members.read"), detail('board_members'));
router.get('/:id/detail',requireAuth, requirePermission("board_members.read"), getBoardMemberDetail);

router.post("/", requireAuth, requirePermission("board_members.create"), uploadPdf.single("proof_file_url"), createBoardMember);

router.put("/:id", requireAuth, requirePermission("board_members.update"), uploadPdf.single("proof_file_url"), updateBoardMember);

router.delete('/:id', requireAuth, requirePermission("board_members.delete"), remove('board_members'));

export default router;
