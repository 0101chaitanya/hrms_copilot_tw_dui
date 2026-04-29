import { LeaveRequest } from '../models/LeaveRequest.js';
import { Employee } from '../models/Employee.js';
import { leaveSchema, leaveApprovalSchema } from '../schemas/leaveSchema.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createLeave = asyncHandler(async (req, res) => {
  const validation = leaveSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: validation.error.errors,
    });
  }

  const leaveRequest = new LeaveRequest({
    ...validation.data,
    companyId: req.companyId,
  });

  await leaveRequest.save();

  res.status(201).json({
    success: true,
    message: 'Leave request created successfully',
    data: leaveRequest,
  });
});

export const getLeaves = asyncHandler(async (req, res) => {
  let filter = { companyId: req.companyId };

  // Support status filter from query params
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Employees can only see their own leaves
  if (req.userRole === 'employee') {
    const employee = await Employee.findOne({ companyId: req.companyId, userId: req.userId });
    if (employee) {
      filter.employeeId = employee._id;
    }
  }

  let query = LeaveRequest.find(filter)
    .populate('employeeId', 'name email')
    .populate('approvedBy', 'firstName lastName');

  // Support limit from query params
  if (req.query.limit) {
    query = query.limit(parseInt(req.query.limit));
  }

  const leaves = await query.sort({ createdAt: -1 });

  res.json({
    success: true,
    data: leaves,
  });
});

export const approveLeave = asyncHandler(async (req, res) => {
  const validation = leaveApprovalSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: validation.error.errors,
    });
  }

  const leave = await LeaveRequest.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId },
    {
      status: validation.data.status,
      approvedBy: req.userId,
      approvalDate: new Date(),
      rejectionReason: validation.data.rejectionReason,
    },
    { new: true }
  );

  if (!leave) {
    return res.status(404).json({
      success: false,
      message: 'Leave request not found',
    });
  }

  res.json({
    success: true,
    message: `Leave ${validation.data.status} successfully`,
    data: leave,
  });
});

export const getLeaveById = asyncHandler(async (req, res) => {
  const leave = await LeaveRequest.findOne({
    _id: req.params.id,
    companyId: req.companyId,
  }).populate('employeeId', 'name email');

  if (!leave) {
    return res.status(404).json({
      success: false,
      message: 'Leave request not found',
    });
  }

  res.json({
    success: true,
    data: leave,
  });
});
