// finance.routes.js
import express from 'express';
import { list, detail, create, update, remove } from '../controllers/base.controller.js';
import { createFinanceReport, getFinanceReportDetail, updateFinanceReport } from '../controllers/finance.controller.js';
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

const router = express.Router();

router.get('/', requireAuth, requirePermission("finance_reports.read"), list('finance_reports'));
router.get('/:id', requireAuth, requirePermission("finance_reports.read"), detail('finance_reports'));
router.get('/:id/detail', requireAuth, requirePermission("finance_reports.read"), getFinanceReportDetail);

router.post("/", requireAuth, requirePermission("finance_reports.create"), createFinanceReport);

router.put('/:id', requireAuth, requirePermission("finance_reports.update"), updateFinanceReport);

router.delete('/:id', requireAuth, requirePermission("finance_reports.delete"), remove('finance_reports'));

export default router;
