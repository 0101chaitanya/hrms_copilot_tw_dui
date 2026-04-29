import express from 'express';
import {
  checkIn,
  checkOut,
  getAttendance,
  getAttendanceById,
} from '../controllers/attendanceController.js';
import { authMiddleware } from '../middleware/auth.js';
import { tenantFilterMiddleware } from '../middleware/tenantFilter.js';

const router = express.Router();

router.use(authMiddleware);
router.use(tenantFilterMiddleware);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/', getAttendance);
router.get('/:id', getAttendanceById);

export default router;
