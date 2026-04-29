import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['sick', 'personal', 'annual', 'unpaid'],
      default: 'personal',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    approvalDate: {
      type: Date,
      required: false,
    },
    rejectionReason: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

leaveRequestSchema.index({ companyId: 1, employeeId: 1 });
leaveRequestSchema.index({ companyId: 1, status: 1 });

export const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
