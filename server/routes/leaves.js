import express from 'express';
import {
  createLeave,
  getLeaves,
  approveLeave,
  getLeaveById,
} from '../controllers/leaveController.js';
import { authMiddleware } from '../middleware/auth.js';
import { tenantFilterMiddleware } from '../middleware/tenantFilter.js';
import { authorizeMiddleware } from '../middleware/authorize.js';

const router = express.Router();

router.use(authMiddleware);
router.use(tenantFilterMiddleware);

router.post('/', createLeave);
router.get('/', getLeaves);
router.get('/:id', getLeaveById);
router.put('/:id/approve', authorizeMiddleware(['admin', 'hr']), approveLeave);

export default router;
