import express from 'express';
import {
  getDashboardMetrics,
  getAttendanceTrend,
  getDepartmentBreakdown,
  getLeaveBreakdown,
  getPayrollSummary,
} from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/auth.js';
import { tenantFilterMiddleware } from '../middleware/tenantFilter.js';

const router = express.Router();

router.use(authMiddleware);
router.use(tenantFilterMiddleware);

router.get('/metrics', getDashboardMetrics);
router.get('/attendance-trend', getAttendanceTrend);
router.get('/department-breakdown', getDepartmentBreakdown);
router.get('/leave-breakdown', getLeaveBreakdown);
router.get('/payroll-summary', getPayrollSummary);

export default router;
