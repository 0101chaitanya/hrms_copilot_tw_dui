import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    joinDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    department: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    bankAccount: {
      type: String,
      required: false,
    },
    resumeFileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    idProofFileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

employeeSchema.index({ companyId: 1 });
employeeSchema.index({ companyId: 1, email: 1 });

export const Employee = mongoose.model('Employee', employeeSchema);
