import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Company } from '../models/Company.js';
import { Employee } from '../models/Employee.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { registerSchema, loginSchema, requestOtpSchema, verifyOtpSchema } from '../schemas/authSchema.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const register = asyncHandler(async (req, res) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: validation.error.errors,
    });
  }

  const { email, phone, password, firstName, lastName, companyName } = validation.data;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists',
    });
  }

  if (phone) {
     const existingPhoneUser = await User.findOne({ phone });
     if (existingPhoneUser) {
         return res.status(400).json({
             success: false,
             message: 'Phone number already registered',
         });
     }
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create company
  const company = new Company({
    name: companyName,
    email,
  });
  await company.save();

  // Create user (admin)
  const user = new User({
    email,
    phone,
    password: hashedPassword,
    firstName,
    lastName,
    companyId: company._id,
    role: 'admin',
  });
  await user.save();

  company.admin = user._id;
  await company.save();

  // Generate token
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      companyId: company._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      company: {
        id: company._id,
        name: company.name,
      },
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: validation.error.errors,
    });
  }

  const { email, password } = validation.data;

  // Find user
  const user = await User.findOne({ email }).populate('companyId');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Compare password
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Generate token
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      companyId: user.companyId._id,
      role: user.role,
      employeeId: user.employee,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      company: {
        id: user.companyId._id,
        name: user.companyId.name,
      },
    },
  });
});

export const requestOtp = asyncHandler(async (req, res) => {
  const validation = requestOtpSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: validation.error.errors,
    });
  }

  const { email, phone } = validation.data;
  
  // Find user by email or phone
  const user = await User.findOne({ $or: [{ email }, { phone }] });
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Generate 6 digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  if (email) {
    user.emailOTP = await hashPassword(otp);
    user.emailOTPExpiry = otpExpiry;
    console.log(`[Mock Email Service] Sending OTP ${otp} to email ${email}`);
    // Here you would integrate with an email service like SendGrid/Nodemailer
  } else if (phone) {
    user.phoneOTP = await hashPassword(otp);
    user.phoneOTPExpiry = otpExpiry;
    console.log(`[Mock SMS Service] Sending OTP ${otp} to phone ${phone}`);
    // Here you would integrate with an SMS service like Twilio
  }

  await user.save();

  res.json({
    success: true,
    message: `OTP sent successfully to ${email ? 'email' : 'phone'}`,
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const validation = verifyOtpSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: validation.error.errors,
    });
  }

  const { email, phone, otp } = validation.data;

  const user = await User.findOne({ $or: [{ email }, { phone }] }).populate('companyId');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  let isValidOtp = false;

  if (email) {
    if (!user.emailOTP || !user.emailOTPExpiry || user.emailOTPExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired or invalid' });
    }
    isValidOtp = await comparePassword(otp, user.emailOTP);
    if (isValidOtp) {
       user.isEmailVerified = true;
       user.emailOTP = undefined;
       user.emailOTPExpiry = undefined;
    }
  } else if (phone) {
    if (!user.phoneOTP || !user.phoneOTPExpiry || user.phoneOTPExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired or invalid' });
    }
    isValidOtp = await comparePassword(otp, user.phoneOTP);
    if (isValidOtp) {
       user.isPhoneVerified = true;
       user.phoneOTP = undefined;
       user.phoneOTPExpiry = undefined;
    }
  }

  if (!isValidOtp) {
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP',
    });
  }

  await user.save();

  // Generate token after successful OTP verification
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      companyId: user.companyId._id,
      role: user.role,
      employeeId: user.employee,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: 'OTP verified successfully',
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      company: {
        id: user.companyId._id,
        name: user.companyId.name,
      },
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).populate('companyId').populate('employee');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
      },
      company: {
        id: user.companyId._id,
        name: user.companyId.name,
      },
      employee: user.employee || null,
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, department } = req.body;
  
  const user = await User.findById(req.userId).populate('employee');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Update user fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  
  // Only admin/HR can update department
  if (department && (user.role === 'admin' || user.role === 'hr')) {
    user.department = department;
    // Also update employee record if exists
    if (user.employee) {
      const employee = await Employee.findById(user.employee._id);
      if (employee) {
        employee.department = department;
        await employee.save();
      }
    }
  }

  await user.save();

  // Update employee name if user name changed
  if (user.employee && (firstName || lastName)) {
    const employee = await Employee.findById(user.employee._id);
    if (employee) {
      employee.name = `${user.firstName} ${user.lastName}`;
      await employee.save();
    }
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
      },
    },
  });
});
