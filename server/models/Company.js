import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
      },
    ],
  },
  { timestamps: true }
);

export const Company = mongoose.model('Company', companySchema);
