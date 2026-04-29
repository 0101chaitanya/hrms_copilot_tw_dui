import React, { useEffect, useState } from 'react';
import { AppLayout } from '../layouts/AppShell';
import { Page } from '../components/Page';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import MetricCard from '../components/MetricCard';
import { MdAttachMoney, MdAccountBalanceWallet, MdMoneyOff, MdPeople } from 'react-icons/md';

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
        <Loader />
      </AppLayout>
    );
  }

  const pageActions = isAdmin && (
    <button className="btn btn-primary" onClick={handleGeneratePayroll}>
      Generate Payroll
    </button>
  );

  return (
    <AppLayout>
      <Page title="Payroll Management" actions={pageActions}>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="form-control w-full sm:w-48">
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
          <div className="form-control w-full sm:w-48">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Total Gross Pay"
              value={`$${summary.totalGrossPay?.toLocaleString() || 0}`}
              icon={MdAttachMoney}
              iconBgColor="bg-primary/10 text-primary"
            />
            <MetricCard
              title="Total Deductions"
              value={`$${summary.totalDeductions?.toLocaleString() || 0}`}
              icon={MdMoneyOff}
              iconBgColor="bg-error/10 text-error"
            />
            <MetricCard
              title="Total Net Pay"
              value={`$${summary.totalNetPay?.toLocaleString() || 0}`}
              icon={MdAccountBalanceWallet}
              iconBgColor="bg-success/10 text-success"
            />
            <MetricCard
              title="Records Count"
              value={summary.recordsCount || 0}
              icon={MdPeople}
              iconBgColor="bg-info/10 text-info"
            />
          </div>
        )}

        <div className="overflow-x-auto bg-base-100 rounded-lg shadow border border-base-300">
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
              {payroll.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-base-content/50">
                    No payroll records found for this period.
                  </td>
                </tr>
              ) : (
                payroll.map((record) => (
                  <tr key={record._id}>
                    <td>{record.employeeId?.name || 'Unknown'}</td>
                    <td>${record.basicPay?.toLocaleString() || 0}</td>
                    <td>${record.allowances?.toLocaleString() || 0}</td>
                    <td>${record.grossPay?.toLocaleString() || 0}</td>
                    <td>${record.totalDeductions?.toLocaleString() || 0}</td>
                    <td>${record.tax?.toLocaleString() || 0}</td>
                    <td className="font-bold text-success">${record.netPay?.toLocaleString() || 0}</td>
                    <td>
                      <span className="badge badge-ghost badge-sm">{record.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-xs btn-ghost" onClick={() => handlePrint(record)}>
                        Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Page>
    </AppLayout>
  );
};

export default PayrollPage;
