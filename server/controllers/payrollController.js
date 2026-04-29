import { Payroll } from '../models/Payroll.js';
import { Employee } from '../models/Employee.js';
import { payrollSchema } from '../schemas/payrollSchema.js';
import { calculatePayroll } from '../utils/payrollCalculator.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const generatePayroll = asyncHandler(async (req, res) => {
  const { month, year } = req.body;

  // Get all employees of the company
  const employees = await Employee.find({ companyId: req.companyId, isActive: true });

  const payrollRecords = [];

  for (const employee of employees) {
    // Check if payroll already exists
    const existingPayroll = await Payroll.findOne({
      employeeId: employee._id,
      month,
      year,
    });

    if (existingPayroll) {
      continue; // Skip if already exists
    }

    const calculations = calculatePayroll(employee, month, year);

    const payroll = new Payroll({
      employeeId: employee._id,
      companyId: req.companyId,
      month,
      year,
      ...calculations,
    });

    await payroll.save();
    payrollRecords.push(payroll);
  }

  res.status(201).json({
    success: true,
    message: `Payroll generated for ${month}/${year}`,
    data: payrollRecords,
  });
});

export const getPayroll = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  let filter = { companyId: req.companyId };

  if (month && year) {
    filter.month = parseInt(month);
    filter.year = parseInt(year);
  }

  // Employees can only see their own payroll
  if (req.userRole === 'employee') {
    const employee = await Employee.findOne({ companyId: req.companyId, userId: req.userId });
    if (employee) {
      filter.employeeId = employee._id;
    }
  }

  const payroll = await Payroll.find(filter)
    .populate('employeeId', 'name email salary')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: payroll,
  });
});

export const getPayrollById = asyncHandler(async (req, res) => {
  const payroll = await Payroll.findOne({
    _id: req.params.id,
    companyId: req.companyId,
  }).populate('employeeId', 'name email salary');

  if (!payroll) {
    return res.status(404).json({
      success: false,
      message: 'Payroll record not found',
    });
  }

  res.json({
    success: true,
    data: payroll,
  });
});

export const updatePayrollStatus = asyncHandler(async (req, res) => {
  const { status, paidDate } = req.body;

  const payroll = await Payroll.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId },
    { status, paidDate: paidDate ? new Date(paidDate) : undefined },
    { new: true }
  );

  if (!payroll) {
    return res.status(404).json({
      success: false,
      message: 'Payroll record not found',
    });
  }

  res.json({
    success: true,
    message: 'Payroll status updated',
    data: payroll,
  });
});
