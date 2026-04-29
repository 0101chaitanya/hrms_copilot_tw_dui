import express from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';
import { authMiddleware } from '../middleware/auth.js';
import { tenantFilterMiddleware } from '../middleware/tenantFilter.js';
import { authorizeMiddleware } from '../middleware/authorize.js';

const router = express.Router();

router.use(authMiddleware);
router.use(tenantFilterMiddleware);

router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', authorizeMiddleware(['admin', 'hr']), createEmployee);
router.put('/:id', authorizeMiddleware(['admin', 'hr']), updateEmployee);
router.delete('/:id', authorizeMiddleware(['admin']), deleteEmployee);

export default router;
