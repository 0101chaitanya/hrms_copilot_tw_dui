import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: Date,
      required: false,
    },
    checkOutTime: {
      type: Date,
      required: false,
    },
    totalHours: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'half-day', 'leave'],
      default: 'absent',
    },
    remarks: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ companyId: 1, employeeId: 1, date: 1 });
attendanceSchema.index({ companyId: 1, date: 1 });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
