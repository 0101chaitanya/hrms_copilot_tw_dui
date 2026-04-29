import React, { useEffect, useState } from 'react';
import { AppLayout } from '../layouts/AppShell';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const YEARS = [
  { value: 2023, label: '2023' },
  { value: 2024, label: '2024' },
  { value: 2025, label: '2025' },
];

const PayrollPage = () => {
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchPayroll();
    fetchPayrollSummary();
  }, [month, year]);

  const fetchPayroll = async () => {
    try {
      const response = await api.get(`/payroll?month=${month}&year=${year}`);
      setPayroll(response.data.data);
    } catch (error) {
      console.error('Failed to fetch payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayrollSummary = async () => {
    try {
      const response = await api.get(`/dashboard/payroll-summary?month=${month}&year=${year}`);
      setSummary(response.data.data);
    } catch (error) {
      console.error('Failed to fetch payroll summary:', error);
    }
  };

  const handleGeneratePayroll = async () => {
    try {
      await api.post('/payroll', { month, year });
      fetchPayroll();
    } catch (error) {
      console.error('Failed to generate payroll:', error);
    }
  };

  const handlePrint = (payrollRecord) => {
    const content = `
      PAYROLL SLIP
      Employee: ${payrollRecord.employeeId?.name}
      Month: ${month}/${year}
      
      Basic Pay: $${payrollRecord.basicPay}
      Allowances: $${payrollRecord.allowances}
      Gross Pay: $${payrollRecord.grossPay}
      
      Deductions:
      PF: $${payrollRecord.providentFund}
      Insurance: $${payrollRecord.insurance}
      Total Deductions: $${payrollRecord.totalDeductions}
      
      Tax: $${payrollRecord.tax}
      Net Pay: $${payrollRecord.netPay}
    `;
    window.print();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Payroll Management</h1>
          {isAdmin && (
            <button className="btn btn-primary" onClick={handleGeneratePayroll}>
              Generate Payroll
            </button>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          <div className="form-control w-48">
            <label className="label">
              <span className="label-text">Month</span>
            </label>
            <select
              className="select select-bordered"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="form-control w-48">
            <label className="label">
              <span className="label-text">Year</span>
            </label>
            <select
              className="select select-bordered"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              {YEARS.map((y) => (
                <option key={y.value} value={y.value}>{y.label}</option>
              ))}
            </select>
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-4">
                <p className="text-sm text-base-content/60">Total Gross Pay</p>
                <p className="text-2xl font-bold">${summary.totalGrossPay?.toLocaleString()}</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-4">
                <p className="text-sm text-base-content/60">Total Deductions</p>
                <p className="text-2xl font-bold">${summary.totalDeductions?.toLocaleString()}</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-4">
                <p className="text-sm text-base-content/60">Total Net Pay</p>
                <p className="text-2xl font-bold">${summary.totalNetPay?.toLocaleString()}</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-4">
                <p className="text-sm text-base-content/60">Records Count</p>
                <p className="text-2xl font-bold">{summary.recordsCount}</p>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Employee</th>
                <th>Basic Pay</th>
                <th>Allowances</th>
                <th>Gross Pay</th>
                <th>Deductions</th>
                <th>Tax</th>
                <th>Net Pay</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((record) => (
                <tr key={record._id}>
                  <td>{record.employeeId?.name}</td>
                  <td>${record.basicPay?.toLocaleString()}</td>
                  <td>${record.allowances?.toLocaleString()}</td>
                  <td>${record.grossPay?.toLocaleString()}</td>
                  <td>${record.totalDeductions?.toLocaleString()}</td>
                  <td>${record.tax?.toLocaleString()}</td>
                  <td className="font-bold">${record.netPay?.toLocaleString()}</td>
                  <td>
                    <span className="badge badge-ghost">{record.status}</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-ghost" onClick={() => handlePrint(record)}>
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default PayrollPage;
