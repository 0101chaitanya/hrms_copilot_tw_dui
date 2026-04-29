import express from 'express';
import {
  register,
  login,
  requestOtp,
  verifyOtp,
  me,
  updateProfile,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', authMiddleware, me);
router.put('/profile', authMiddleware, updateProfile);

export default router;
