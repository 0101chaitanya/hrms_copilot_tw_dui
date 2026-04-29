import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  companyName: z.string().min(1, 'Company name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const requestOtpSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
}).refine(data => data.email || data.phone, {
  message: "Either email or phone must be provided",
  path: ["email", "phone"]
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
}).refine(data => data.email || data.phone, {
  message: "Either email or phone must be provided",
  path: ["email", "phone"]
});
