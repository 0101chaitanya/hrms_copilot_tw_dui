import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      sparse: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'hr', 'employee'],
      default: 'employee',
    },
    department: {
      type: String,
      required: false,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
    emailOTP: {
      type: String,
    },
    emailOTPExpiry: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phoneOTP: {
      type: String,
    },
    phoneOTPExpiry: {
      type: Date,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

userSchema.index({ companyId: 1, email: 1 });

export const User = mongoose.model('User', userSchema);
