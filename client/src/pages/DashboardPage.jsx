import React, { useEffect, useState } from 'react';
import { AppLayout } from '../layouts/AppShell';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  MdPeople, MdCalendarToday, MdAttachMoney, MdAccessTime, MdTrendingUp,
  MdTrendingDown, MdCheck, MdDescription, MdBusiness, MdNotifications,
  MdArrowForward
} from 'react-icons/md';
import clsx from 'clsx';

const DashboardPage = () => {
  const { isAdmin, isHR, user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [attendanceTrend, setAttendanceTrend] = useState(null);
  const [departmentBreakdown, setDepartmentBreakdown] = useState(null);
  const [leaveBreakdown, setLeaveBreakdown] = useState(null);
  const [payrollSummary, setPayrollSummary] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const now = new Date();
        const requests = [
          api.get('/dashboard/metrics'),
          api.get(`/dashboard/attendance-trend?days=${timeRange}`),
          api.get('/dashboard/department-breakdown'),
          api.get('/dashboard/leave-breakdown'),
          api.get(`/dashboard/payroll-summary?month=${now.getMonth() + 1}&year=${now.getFullYear()}`),
        ];

        if (isAdmin || isHR) {
          requests.push(api.get('/leaves?status=pending&limit=5'));
        }

        const [
          metricsRes, attendanceRes, deptRes, leaveRes, payrollRes, leavesRes
        ] = await Promise.all(requests);

        setMetrics(metricsRes.data.data);
        setPayrollSummary(payrollRes.data.data);

        const attendanceData = Object.entries(attendanceRes.data.data).map(([date, data]) => ({
          date,
          present: data.present || 0,
          absent: data.absent || 0,
          halfDay: data.halfday || 0,
        }));
        setAttendanceTrend(attendanceData);

        const deptData = Object.entries(deptRes.data.data).map(([dept, count]) => ({
          name: dept,
          value: count,
        }));
        setDepartmentBreakdown(deptData);

        const leaveData = Object.entries(leaveRes.data.data).map(([type, count]) => ({
          name: type,
          value: count,
        }));
        setLeaveBreakdown(leaveData);

        if (leavesRes?.data?.data) {
          setPendingLeaves(leavesRes.data.data.slice(0, 5));
        }

        setRecentActivity([
          { id: 1, type: 'leave', message: 'John Doe requested sick leave', time: '2 hours ago', status: 'pending' },
          { id: 2, type: 'employee', message: 'New employee Sarah Smith joined', time: '5 hours ago', status: 'completed' },
          { id: 3, type: 'payroll', message: 'April payroll processed', time: '1 day ago', status: 'completed' },
          { id: 4, type: 'attendance', message: 'Attendance marked for 45 employees', time: '1 day ago', status: 'completed' },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange, isAdmin, isHR]);

  const handleApproveLeave = async (leaveId) => {
    try {
      await api.put(`/leaves/${leaveId}/approve`, { status: 'approved' });
      setPendingLeaves(pendingLeaves.filter(l => l._id !== leaveId));
    } catch (error) {
      console.error('Failed to approve leave:', error);
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      await api.put(`/leaves/${leaveId}/approve`, { status: 'rejected' });
      setPendingLeaves(pendingLeaves.filter(l => l._id !== leaveId));
    } catch (error) {
      console.error('Failed to reject leave:', error);
    }
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6B6B', '#4ECDC4'];

  const adminQuickActions = [
    { icon: MdPeople, label: 'Add Employee', path: '/employees', color: 'bg-primary/10 text-primary' },
    { icon: MdDescription, label: 'Process Payroll', path: '/payroll', color: 'bg-success/10 text-success' },
    { icon: MdCalendarToday, label: 'Leave Requests', path: '/leaves', color: 'bg-warning/10 text-warning', badge: pendingLeaves.length },
    { icon: MdAccessTime, label: 'Mark Attendance', path: '/attendance', color: 'bg-info/10 text-info' },
  ];

  const employeeQuickActions = [
    { icon: MdAccessTime, label: 'Check In/Out', path: '/attendance', color: 'bg-info/10 text-info' },
    { icon: MdCalendarToday, label: 'Request Leave', path: '/leaves', color: 'bg-warning/10 text-warning' },
    { icon: MdDescription, label: 'View Payslip', path: '/payroll', color: 'bg-success/10 text-success' },
  ];

  const getRoleBadgeClass = () => {
    if (isAdmin) return 'badge-error';
    if (isHR) return 'badge-warning';
    return 'badge-info';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'leave': return <MdCalendarToday size={16} />;
      case 'employee': return <MdPeople size={16} />;
      case 'payroll': return <MdDescription size={16} />;
      case 'attendance': return <MdAccessTime size={16} />;
      default: return <MdCheck size={16} />;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-6">
        {/* Header with controls */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isAdmin ? 'Admin Dashboard' : isHR ? 'HR Dashboard' : 'Employee Dashboard'}
          </h1>
          <div className="flex gap-2">
            {(isAdmin || isHR) && (
              <>
                <select
                  className="select select-bordered select-sm"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => navigate('/leaves')}
                >
                  <MdNotifications size={16} className="mr-1" />
                  {pendingLeaves.length} Pending
                </button>
              </>
            )}
          </div>
        </div>

        {/* User Greeting */}
        <div className="card bg-primary/10 border border-primary/20 mb-6">
          <div className="card-body flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <MdPeople size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Welcome back, {user?.firstName} {user?.lastName}!
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={clsx('badge', getRoleBadgeClass())}>
                    {user?.role?.toUpperCase()}
                  </span>
                  <span className="text-sm text-base-content/60">{user?.company?.name}</span>
                </div>
              </div>
            </div>
            <span className="text-sm text-base-content/60 mt-2 md:mt-0">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Admin/HR Quick Actions */}
        {(isAdmin || isHR) && (
          <div className="card bg-base-100 shadow border border-base-300 mb-6">
            <div className="card-body">
              <h3 className="text-sm font-medium text-base-content/60 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {adminQuickActions.map((action) => (
                  <div
                    key={action.label}
                    className="card card-bordered cursor-pointer hover:bg-base-200 transition-colors"
                    onClick={() => navigate(action.path)}
                  >
                    <div className="card-body p-4 flex flex-row items-center gap-3">
                      <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', action.color)}>
                        <action.icon size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{action.label}</p>
                        {action.badge > 0 && (
                          <span className="badge badge-warning badge-xs">{action.badge} new</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Admin/HR Metrics - Company Wide */}
        {(isAdmin || isHR) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-base-content/60">Total Employees</span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <MdPeople size={14} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{metrics?.totalEmployees || 0}</p>
                <p className="text-xs text-success">Active workforce</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-base-content/60">Attendance Rate</span>
                  <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center">
                    <MdAccessTime size={14} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{metrics?.attendanceRate || '0%'}</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-base-content/60">Pending Leaves</span>
                  <div className="w-8 h-8 rounded-full bg-warning/10 text-warning flex items-center justify-center">
                    <MdCalendarToday size={14} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{metrics?.activeLeaves || 0}</p>
                <p className="text-xs text-warning">Awaiting approval</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-base-content/60">Monthly Payroll</span>
                  <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <MdAttachMoney size={14} />
                  </div>
                </div>
                <p className="text-2xl font-bold">${payrollSummary?.totalNetPay?.toLocaleString() || '0'}</p>
                <p className="text-xs text-base-content/60">{payrollSummary?.recordsCount || 0} employees</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-base-content/60">Days Recorded</span>
                  <div className="w-8 h-8 rounded-full bg-info/10 text-info flex items-center justify-center">
                    <MdBusiness size={14} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{metrics?.totalAttendance || 0}</p>
                <p className="text-xs text-base-content/60">This period</p>
              </div>
            </div>
          </div>
        )}

        {/* Employee Metrics - Personal Only */}
        {!isAdmin && !isHR && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-base-content/60">My Attendance Rate</span>
                  <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center">
                    <MdAccessTime size={14} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{metrics?.attendanceRate || '0%'}</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-base-content/60">My Leave Balance</span>
                  <div className="w-8 h-8 rounded-full bg-warning/10 text-warning flex items-center justify-center">
                    <MdCalendarToday size={14} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{metrics?.activeLeaves || 0}</p>
                <p className="text-xs text-base-content/60">Days pending/approved</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-base-content/60">My Net Pay</span>
                  <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <MdAttachMoney size={14} />
                  </div>
                </div>
                <p className="text-2xl font-bold">${payrollSummary?.totalNetPay?.toLocaleString() || '0'}</p>
                <p className="text-xs text-base-content/60">This month</p>
              </div>
            </div>
          </div>
        )}

        {/* Admin/HR Charts - Company Wide Analytics */}
        {(isAdmin || isHR) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body">
                <h3 className="text-sm font-medium mb-4">Attendance Trend (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="present" stroke="#8884d8" />
                    <Line type="monotone" dataKey="absent" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body">
                <h3 className="text-sm font-medium mb-4">Department Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentBreakdown || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card bg-base-100 shadow border border-base-300 md:col-span-2">
              <div className="card-body">
                <h3 className="text-sm font-medium mb-4">Leave Types Used</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leaveBreakdown || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(leaveBreakdown || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Employee Quick Actions */}
        {!isAdmin && !isHR && (
          <div className="card bg-base-100 shadow border border-base-300 mb-6">
            <div className="card-body">
              <h3 className="text-sm font-medium text-base-content/60 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-4">
                {employeeQuickActions.map((action) => (
                  <div
                    key={action.label}
                    className="card card-bordered cursor-pointer hover:bg-base-200 transition-colors"
                    onClick={() => navigate(action.path)}
                  >
                    <div className="card-body p-4 flex flex-row items-center gap-3">
                      <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', action.color)}>
                        <action.icon size={20} />
                      </div>
                      <span className="font-medium text-sm">{action.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Admin Controls Section */}
        {(isAdmin || isHR) && (
          <>
            <div className="divider my-6 text-sm">Administrative Controls</div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {/* Pending Leave Requests */}
              <div className="md:col-span-4 card bg-base-100 shadow border border-base-300">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Pending Leave Requests</h3>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => navigate('/leaves')}
                    >
                      View All <MdArrowForward size={14} className="ml-1" />
                    </button>
                  </div>

                  {pendingLeaves.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="table table-sm w-full">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingLeaves.map((leave) => (
                            <tr key={leave._id}>
                              <td className="font-medium">
                                {leave.employeeId?.firstName} {leave.employeeId?.lastName}
                              </td>
                              <td>
                                <span className="badge badge-info badge-sm">{leave.leaveType}</span>
                              </td>
                              <td className="text-sm">
                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                              </td>
                              <td>
                                <div className="flex gap-1">
                                  <button
                                    className="btn btn-success btn-xs btn-square"
                                    onClick={() => handleApproveLeave(leave._id)}
                                  >
                                    <MdCheck size={16} />
                                  </button>
                                  <button
                                    className="btn btn-error btn-xs btn-square"
                                    onClick={() => handleRejectLeave(leave._id)}
                                  >
                                    <MdTrendingDown size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="card bg-base-200 border border-base-300 p-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-2">
                        <MdCheck size={24} />
                      </div>
                      <p className="text-sm text-base-content/60">All caught up! No pending requests.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="md:col-span-3 card bg-base-100 shadow border border-base-300">
                <div className="card-body">
                  <h3 className="font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="card card-bordered p-3">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                            activity.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                          )}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{activity.message}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-base-content/50">{activity.time}</span>
                              {activity.status === 'pending' && (
                                <span className="badge badge-warning badge-xs">Pending</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
