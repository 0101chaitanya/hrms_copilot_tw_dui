import { z } from 'zod';

export const leaveSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  leaveType: z.enum(['sick', 'personal', 'annual', 'unpaid']),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const leaveApprovalSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional(),
});
