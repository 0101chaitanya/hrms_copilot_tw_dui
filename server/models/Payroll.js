import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema(
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
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    basicPay: {
      type: Number,
      required: true,
    },
    allowances: {
      type: Number,
      default: 0,
    },
    grossPay: {
      type: Number,
      required: true,
    },
    providentFund: {
      type: Number,
      default: 0,
    },
    insurance: {
      type: Number,
      default: 0,
    },
    totalDeductions: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    netPay: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'processed', 'paid'],
      default: 'draft',
    },
    paidDate: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

payrollSchema.index({ companyId: 1, employeeId: 1, month: 1, year: 1 });
payrollSchema.index({ companyId: 1, month: 1, year: 1 });

export const Payroll = mongoose.model('Payroll', payrollSchema);
