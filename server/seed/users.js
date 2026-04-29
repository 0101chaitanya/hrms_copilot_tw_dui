import mongoose from 'mongoose';
import {User} from '../models/User.js';
import {Company} from '../models/Company.js';
import {Employee} from '../models/Employee.js';
import {Attendance} from '../models/Attendance.js';
import {LeaveRequest} from '../models/LeaveRequest.js';
import {Payroll} from '../models/Payroll.js';
import {hashPassword} from '../utils/password.js';

const TEST_CREDENTIALS = {
    admin: {
        email: 'admin@demo.com',
        password: 'Admin@123',
        firstName: 'Demo',
        lastName: 'Admin',
        phone: '+1234567890',
        role: 'admin'
    },
    hr: {
        email: 'hr@demo.com',
        password: 'Hr@123',
        firstName: 'Demo',
        lastName: 'HR Manager',
        phone: '+1234567891',
        role: 'hr'
    },
    employee: {
        email: 'employee@demo.com',
        password: 'Employee@123',
        firstName: 'Demo',
        lastName: 'Employee',
        phone: '+1234567892',
        role: 'employee'
    }
};

export async function seedUsers() {
    try {
        // Check if demo company exists
        let company = await Company.findOne({name: 'Demo Company'});

        // Create company first (without admin initially)
        if (!company) {
            company = new Company({
                name: 'Demo Company',
                email: 'contact@democompany.com',
            });
            await company.save();
            console.log('✓ Created demo company');
        }

        const results = [];

        // Create admin user
        let adminUser = await User.findOne({email: TEST_CREDENTIALS.admin.email});

        if (!adminUser) {
            const hashedPassword = await hashPassword(TEST_CREDENTIALS.admin.password);
            adminUser = new User({
                email: TEST_CREDENTIALS.admin.email,
                phone: TEST_CREDENTIALS.admin.phone,
                password: hashedPassword,
                firstName: TEST_CREDENTIALS.admin.firstName,
                lastName: TEST_CREDENTIALS.admin.lastName,
                companyId: company._id,
                role: TEST_CREDENTIALS.admin.role,
                isEmailVerified: true,
                isPhoneVerified: true,
            });
            await adminUser.save();
            console.log(`✓ Created admin user: ${TEST_CREDENTIALS.admin.email}`);
        } else {
            console.log(`⚠ Admin user already exists: ${TEST_CREDENTIALS.admin.email}`);
        }

        // Update company with admin
        if (!company.admin) {
            company.admin = adminUser._id;
            await company.save();
            console.log('✓ Updated company with admin');
        }

        // Create employee record for admin if not exists
        let adminEmployee = await Employee.findOne({ userId: adminUser._id });
        if (!adminEmployee) {
            adminEmployee = new Employee({
                userId: adminUser._id,
                companyId: company._id,
                name: `${TEST_CREDENTIALS.admin.firstName} ${TEST_CREDENTIALS.admin.lastName}`,
                email: TEST_CREDENTIALS.admin.email,
                department: 'Management',
                position: 'System Administrator',
                salary: 120000,
                joinDate: new Date(),
                isActive: true,
            });
            await adminEmployee.save();
            adminUser.employee = adminEmployee._id;
            await adminUser.save();
        }

        results.push({
            role: TEST_CREDENTIALS.admin.role,
            email: TEST_CREDENTIALS.admin.email,
            password: TEST_CREDENTIALS.admin.password,
            firstName: TEST_CREDENTIALS.admin.firstName,
            lastName: TEST_CREDENTIALS.admin.lastName,
            phone: TEST_CREDENTIALS.admin.phone,
        });

        // Create other users (hr, employee)
        for (const [roleName, creds] of Object.entries(TEST_CREDENTIALS)) {
            if (creds.role === 'admin') continue; // Skip admin, already handled

            // Check if user exists
            let user = await User.findOne({email: creds.email});

            if (!user) {
                const hashedPassword = await hashPassword(creds.password);

                user = new User({
                    email: creds.email,
                    phone: creds.phone,
                    password: hashedPassword,
                    firstName: creds.firstName,
                    lastName: creds.lastName,
                    companyId: company._id,
                    role: creds.role,
                    isEmailVerified: true,
                    isPhoneVerified: true,
                });

                await user.save();

                // Create employee record for all users (needed for attendance, leaves, payroll)
                const department = creds.role === 'admin' ? 'Management' : creds.role === 'hr' ? 'Human Resources' : 'Engineering';
                const position = creds.role === 'admin' ? 'System Administrator' : creds.role === 'hr' ? 'HR Manager' : 'Software Developer';
                const salary = creds.role === 'admin' ? 120000 : creds.role === 'hr' ? 90000 : 75000;
                
                const employee = new Employee({
                    userId: user._id,
                    companyId: company._id,
                    name: `${creds.firstName} ${creds.lastName}`,
                    email: creds.email,
                    department,
                    position,
                    salary,
                    joinDate: new Date(),
                    isActive: true,
                });
                await employee.save();

                user.employee = employee._id;
                await user.save();

                console.log(`✓ Created ${roleName} user: ${creds.email}`);
            } else {
                console.log(`⚠ ${roleName} user already exists: ${creds.email}`);
            }

            results.push({
                role: creds.role,
                email: creds.email,
                password: creds.password,
                firstName: creds.firstName,
                lastName: creds.lastName,
                phone: creds.phone,
            });
        }

        // Create mock data for all users
        await createMockData(company._id);

        console.log('\n========================================');
        console.log('       TEST CREDENTIALS SUMMARY       ');
        console.log('========================================\n');

        results.forEach(user => {
            console.log(`**${user.role.toUpperCase()}**`);
            console.log(`  Email:    ${user.email}`);
            console.log(`  Password: ${user.password}`);
            console.log(`  Name:     ${user.firstName} ${user.lastName}`);
            console.log(`  Phone:    ${user.phone}`);
            console.log('');
        });

        console.log('========================================');

        return results;
    } catch (error) {
        console.error('Seeding error:', error);
        throw error;
    }
}

// Create mock data for graphs and metrics
async function createMockData(companyId) {
    const employees = await Employee.find({ companyId });
    const users = await User.find({ companyId });
    
    if (employees.length === 0) return;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Create attendance records for last 30 days
    console.log('\n✓ Creating mock attendance records...');
    for (const employee of employees) {
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Skip weekends
            if (date.getDay() === 0 || date.getDay() === 6) continue;

            const isPresent = Math.random() > 0.15; // 85% attendance rate
            const existing = await Attendance.findOne({ employeeId: employee._id, date: { $gte: new Date(date.setHours(0,0,0,0)), $lt: new Date(date.setHours(23,59,59,999)) } });
            
            if (!existing) {
                const attendance = new Attendance({
                    employeeId: employee._id,
                    companyId,
                    date: new Date(date.setHours(9,0,0,0)),
                    checkInTime: isPresent ? new Date(date.setHours(9,0,0,0)) : null,
                    checkOutTime: isPresent ? new Date(date.setHours(17,30,0,0)) : null,
                    totalHours: isPresent ? 8.5 : 0,
                    status: isPresent ? 'present' : 'absent',
                });
                await attendance.save();
            }
        }
    }

    // Create leave requests
    console.log('✓ Creating mock leave requests...');
    const leaveTypes = ['sick', 'personal', 'annual', 'unpaid'];
    const statuses = ['pending', 'approved', 'approved', 'approved']; // More approved than pending
    
    for (const employee of employees) {
        const user = users.find(u => u._id.toString() === employee.userId?.toString());
        const isAdminOrHR = user?.role === 'admin' || user?.role === 'hr';
        
        // Create 2-4 leaves per employee
        const numLeaves = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < numLeaves; i++) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 60));
            
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 3) + 1);

            const existing = await LeaveRequest.findOne({ 
                employeeId: employee._id, 
                startDate: { $gte: new Date(startDate.setHours(0,0,0,0)), $lt: new Date(startDate.setHours(23,59,59,999)) }
            });
            
            if (!existing) {
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                const leave = new LeaveRequest({
                    employeeId: employee._id,
                    companyId,
                    startDate,
                    endDate,
                    leaveType: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
                    reason: `Mock ${leaveTypes[Math.floor(Math.random() * leaveTypes.length)]} leave request`,
                    status,
                    approvedBy: status === 'approved' ? users.find(u => u.role === 'admin')?._id : null,
                    approvalDate: status === 'approved' ? new Date() : null,
                });
                await leave.save();
            }
        }
    }

    // Create payroll records
    console.log('✓ Creating mock payroll records...');
    for (const employee of employees) {
        const existing = await Payroll.findOne({ 
            employeeId: employee._id, 
            month: currentMonth, 
            year: currentYear 
        });
        
        if (!existing) {
            const basicPay = employee.salary || 50000;
            const allowances = basicPay * 0.2;
            const grossPay = basicPay + allowances;
            const providentFund = basicPay * 0.12;
            const insurance = 500;
            const tax = grossPay * 0.1;
            const totalDeductions = providentFund + insurance + tax;
            const netPay = grossPay - totalDeductions;

            const payroll = new Payroll({
                employeeId: employee._id,
                companyId,
                month: currentMonth,
                year: currentYear,
                basicPay,
                allowances,
                grossPay,
                providentFund,
                insurance,
                tax,
                totalDeductions,
                netPay,
                status: 'processed',
            });
            await payroll.save();
        }
    }

    // Create previous month payroll too
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
    for (const employee of employees) {
        const existing = await Payroll.findOne({ 
            employeeId: employee._id, 
            month: prevMonth, 
            year: prevYear 
        });
        
        if (!existing) {
            const basicPay = employee.salary || 50000;
            const allowances = basicPay * 0.2;
            const grossPay = basicPay + allowances;
            const providentFund = basicPay * 0.12;
            const insurance = 500;
            const tax = grossPay * 0.1;
            const totalDeductions = providentFund + insurance + tax;
            const netPay = grossPay - totalDeductions;

            const payroll = new Payroll({
                employeeId: employee._id,
                companyId,
                month: prevMonth,
                year: prevYear,
                basicPay,
                allowances,
                grossPay,
                providentFund,
                insurance,
                tax,
                totalDeductions,
                netPay,
                status: 'processed',
            });
            await payroll.save();
        }
    }

    console.log('✓ Mock data creation complete!');
}

// Run directly if called from CLI
// if (import.meta.url === `file://${process.argv[1]}`) {
//     await mongoose.connect(process.env.MONGODB_URI);
//     await seedUsers();
//     await mongoose.disconnect();
// }
