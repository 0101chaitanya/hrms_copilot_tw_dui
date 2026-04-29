import { Employee } from '../models/Employee.js';
import { Attendance } from '../models/Attendance.js';
import { LeaveRequest } from '../models/LeaveRequest.js';
import { Payroll } from '../models/Payroll.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  calculateAttendanceTrend,
  calculateDepartmentBreakdown,
  calculateAttritionRate,
} from '../utils/payrollCalculator.js';

export const getDashboardMetrics = asyncHandler(async (req, res) => {
  const totalEmployees = await Employee.countDocuments({
    companyId: req.companyId,
    isActive: true,
  });

  const activeLeaves = await LeaveRequest.countDocuments({
    companyId: req.companyId,
    status: 'pending',
  });

  const totalAttendance = await Attendance.countDocuments({
    companyId: req.companyId,
  });

  const presentDays = await Attendance.countDocuments({
    companyId: req.companyId,
    status: 'present',
  });

  const attendanceRate = totalAttendance > 0 ? ((presentDays / totalAttendance) * 100).toFixed(2) : 0;

  res.json({
    success: true,
    data: {
      totalEmployees,
      activeLeaves,
      attendanceRate: `${attendanceRate}%`,
      totalAttendance,
    },
  });
});

export const getAttendanceTrend = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;

  const attendanceRecords = await Attendance.find({
    companyId: req.companyId,
  });

  const trend = calculateAttendanceTrend(attendanceRecords, parseInt(days));

  res.json({
    success: true,
    data: trend,
  });
});

export const getDepartmentBreakdown = asyncHandler(async (req, res) => {
  const employees = await Employee.find({
    companyId: req.companyId,
    isActive: true,
  });

  const breakdown = calculateDepartmentBreakdown(employees);

  res.json({
    success: true,
    data: breakdown,
  });
});

export const getLeaveBreakdown = asyncHandler(async (req, res) => {
  const leaves = await LeaveRequest.find({
    companyId: req.companyId,
    status: 'approved',
  });

  const breakdown = {};

  leaves.forEach((leave) => {
    if (!breakdown[leave.leaveType]) {
      breakdown[leave.leaveType] = 0;
    }
    breakdown[leave.leaveType]++;
  });

  res.json({
    success: true,
    data: breakdown,
  });
});

export const getPayrollSummary = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  let filter = { companyId: req.companyId };

  if (month && year) {
    filter.month = parseInt(month);
    filter.year = parseInt(year);
  }

  const payrollRecords = await Payroll.find(filter);

  const summary = {
    totalGrossPay: 0,
    totalDeductions: 0,
    totalNetPay: 0,
    recordsCount: payrollRecords.length,
  };

  payrollRecords.forEach((record) => {
    summary.totalGrossPay += record.grossPay;
    summary.totalDeductions += record.totalDeductions;
    summary.totalNetPay += record.netPay;
  });

  res.json({
    success: true,
    data: summary,
  });
});
