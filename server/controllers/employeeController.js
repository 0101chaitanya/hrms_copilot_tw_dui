import { Employee } from '../models/Employee.js';
import { employeeSchema, employeeUpdateSchema } from '../schemas/employeeSchema.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({ companyId: req.companyId });

  res.json({
    success: true,
    data: employees,
  });
});

export const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({
    _id: req.params.id,
    companyId: req.companyId,
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found',
    });
  }

  res.json({
    success: true,
    data: employee,
  });
});

export const createEmployee = asyncHandler(async (req, res) => {
  const validation = employeeSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: validation.error.errors,
    });
  }

  const employee = new Employee({
    ...validation.data,
    companyId: req.companyId,
  });

  await employee.save();

  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: employee,
  });
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const validation = employeeUpdateSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: validation.error.errors,
    });
  }

  const employee = await Employee.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId },
    validation.data,
    { new: true }
  );

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found',
    });
  }

  res.json({
    success: true,
    message: 'Employee updated successfully',
    data: employee,
  });
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId },
    { isActive: false },
    { new: true }
  );

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found',
    });
  }

  res.json({
    success: true,
    message: 'Employee deleted successfully',
    data: employee,
  });
});
