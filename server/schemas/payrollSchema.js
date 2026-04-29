import { z } from 'zod';

export const payrollSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  month: z.number().min(1).max(12, 'Invalid month'),
  year: z.number().min(2000).max(2099, 'Invalid year'),
  basicPay: z.number().positive('Basic pay must be positive'),
  allowances: z.number().nonnegative().optional().default(0),
  providentFund: z.number().nonnegative().optional().default(0),
  insurance: z.number().nonnegative().optional().default(0),
  tax: z.number().nonnegative().optional().default(0),
});
