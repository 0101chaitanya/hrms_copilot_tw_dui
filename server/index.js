import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import {errorHandler} from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import leaveRoutes from './routes/leaves.js';
import attendanceRoutes from './routes/attendance.js';
import payrollRoutes from './routes/payroll.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();

// Connect to database
await connectDB();

// Middleware
app.use(cors({

    origin: process.env.FRONT_END_URL,
    credentials: true

}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Health check
app.get('/health', (req, res) => {
    res.json({success: true, message: 'Server is running'});
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT ;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
