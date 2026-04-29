import dayjs from 'dayjs';

export const calculatePayroll = (employee, month, year) => {
  const basicPay = employee.salary;
  const allowances = basicPay * 0.1; // 10% allowances

  const grossPay = basicPay + allowances;

  const providentFund = grossPay * 0.12; // 12% PF
  const insurance = grossPay * 0.02; // 2% insurance

  const totalDeductions = providentFund + insurance;

  // Simple tax calculation based on slabs
  let tax = 0;
  if (grossPay > 500000) {
    tax = (grossPay - 500000) * 0.3 + 50000 * 0.2;
  } else if (grossPay > 250000) {
    tax = (grossPay - 250000) * 0.2;
  }

  const netPay = grossPay - totalDeductions - tax;

  return {
    basicPay,
    allowances,
    grossPay,
    providentFund,
    insurance,
    totalDeductions,
    tax,
    netPay,
  };
};

export const calculateAttendanceTrend = (attendanceRecords, days = 30) => {
  const today = dayjs();
  const startDate = today.subtract(days, 'days');

  const trend = {};
  for (let i = 0; i < days; i++) {
    const date = startDate.add(i, 'days').format('YYYY-MM-DD');
    trend[date] = { present: 0, absent: 0, halfDay: 0, leave: 0 };
  }

  attendanceRecords.forEach((record) => {
    const date = dayjs(record.date).format('YYYY-MM-DD');
    if (trend[date]) {
      const status = record.status.toLowerCase().replace('-', '');
      trend[date][status]++;
    }
  });

  return trend;
};

export const calculateDepartmentBreakdown = (employees) => {
  const breakdown = {};

  employees.forEach((emp) => {
    if (!breakdown[emp.department]) {
      breakdown[emp.department] = 0;
    }
    breakdown[emp.department]++;
  });

  return breakdown;
};

export const calculateAttritionRate = (totalEmployees, departedEmployees, month, year) => {
  if (totalEmployees === 0) return 0;
  const daysInMonth = dayjs().month(month - 1).year(year).daysInMonth();
  return (departedEmployees / totalEmployees) * 100;
};
