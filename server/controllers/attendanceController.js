import { Attendance } from '../models/Attendance.js';
import { Employee } from '../models/Employee.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import dayjs from 'dayjs';

export const checkIn = asyncHandler(async (req, res) => {
  let { employeeId } = req.body;
  let employee;

  // If employeeId provided, verify it belongs to company
  if (employeeId) {
    employee = await Employee.findOne({
      _id: employeeId,
      companyId: req.companyId,
    });
  } else {
    // Try to find employee by userId
    employee = await Employee.findOne({
      companyId: req.companyId,
      userId: req.userId,
    });
  }

  // If no employee record exists, create one for this user
  if (!employee) {
    const { User } = await import('../models/User.js');
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    employee = new Employee({
      userId: user._id,
      companyId: req.companyId,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      department: user.department || 'General',
      position: user.role === 'admin' ? 'Administrator' : user.role === 'hr' ? 'HR Manager' : 'Employee',
      salary: 0,
      joinDate: new Date(),
      isActive: true,
    });
    await employee.save();
    
    // Link employee to user
    user.employee = employee._id;
    await user.save();
  }

  const today = dayjs().startOf('day').toDate();
  const tomorrowStart = dayjs(today).add(1, 'day').toDate();

  // Check if already checked in today
  const existingCheckIn = await Attendance.findOne({
    employeeId: employee._id,
    companyId: req.companyId,
    date: { $gte: today, $lt: tomorrowStart },
    checkInTime: { $exists: true },
  });

  if (existingCheckIn && !existingCheckIn.checkOutTime) {
    return res.status(400).json({
      success: false,
      message: 'Already checked in today',
    });
  }

  const attendance = new Attendance({
    employeeId: employee._id,
    companyId: req.companyId,
    date: today,
    checkInTime: new Date(),
    status: 'present',
  });

  await attendance.save();

  res.status(201).json({
    success: true,
    message: 'Checked in successfully',
    data: attendance,
  });
});

export const checkOut = asyncHandler(async (req, res) => {
  let { employeeId } = req.body;
  let employee;

  // If employeeId provided, verify it belongs to company
  if (employeeId) {
    employee = await Employee.findOne({
      _id: employeeId,
      companyId: req.companyId,
    });
  } else {
    // Try to find employee by userId
    employee = await Employee.findOne({
      companyId: req.companyId,
      userId: req.userId,
    });
  }

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found',
    });
  }

  const today = dayjs().startOf('day').toDate();
  const tomorrowStart = dayjs(today).add(1, 'day').toDate();

  const attendance = await Attendance.findOne({
    employeeId: employee._id,
    companyId: req.companyId,
    date: { $gte: today, $lt: tomorrowStart },
  });

  if (!attendance) {
    return res.status(404).json({
      success: false,
      message: 'No check-in found for today',
    });
  }

  const checkInTime = attendance.checkInTime;
  const checkOutTime = new Date();
  const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);

  attendance.checkOutTime = checkOutTime;
  attendance.totalHours = totalHours;

  await attendance.save();

  res.json({
    success: true,
    message: 'Checked out successfully',
    data: attendance,
  });
});

export const getAttendance = asyncHandler(async (req, res) => {
  const { startDate, endDate, employeeId } = req.query;

  let filter = { companyId: req.companyId };

  if (req.userRole === 'employee') {
    const employee = await Employee.findOne({ companyId: req.companyId, userId: req.userId });
    if (employee) {
      filter.employeeId = employee._id;
    }
  } else if (employeeId) {
    filter.employeeId = employeeId;
  }

  if (startDate && endDate) {
    filter.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const attendance = await Attendance.find(filter)
    .populate('employeeId', 'name email')
    .sort({ date: -1 });

  res.json({
    success: true,
    data: attendance,
  });
});

export const getAttendanceById = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findOne({
    _id: req.params.id,
    companyId: req.companyId,
  }).populate('employeeId', 'name email');

  if (!attendance) {
    return res.status(404).json({
      success: false,
      message: 'Attendance record not found',
    });
  }

  res.json({
    success: true,
    data: attendance,
  });
});
