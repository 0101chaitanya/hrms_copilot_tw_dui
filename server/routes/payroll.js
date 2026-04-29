import express from 'express';
import {
  generatePayroll,
  getPayroll,
  getPayrollById,
  updatePayrollStatus,
} from '../controllers/payrollController.js';
import { authMiddleware } from '../middleware/auth.js';
import { tenantFilterMiddleware } from '../middleware/tenantFilter.js';
import { authorizeMiddleware } from '../middleware/authorize.js';

const router = express.Router();

router.use(authMiddleware);
router.use(tenantFilterMiddleware);

router.post('/', authorizeMiddleware(['admin']), generatePayroll);
router.get('/', getPayroll);
router.get('/:id', getPayrollById);
router.put('/:id', authorizeMiddleware(['admin']), updatePayrollStatus);

export default router;
