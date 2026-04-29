import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  joinDate: z.string().datetime(),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  salary: z.number().positive('Salary must be positive'),
  bankAccount: z.string().optional(),
});

export const employeeUpdateSchema = employeeSchema.partial();
