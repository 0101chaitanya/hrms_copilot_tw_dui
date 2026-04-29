import React, { useEffect, useState } from 'react';
import { AppLayout } from '../layouts/AppShell';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import clsx from 'clsx';

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const { isEmployee } = useAuth();

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/attendance');
      setAttendance(response.data.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await api.post('/attendance/check-in', {});
      setCheckedIn(true);
      fetchAttendance();
    } catch (error) {
      console.error('Failed to check in:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/attendance/check-out', {});
      setCheckedIn(false);
      fetchAttendance();
    } catch (error) {
      console.error('Failed to check out:', error);
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

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Attendance</h1>

        {isEmployee && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-base-content/60">
                      {checkedIn ? 'Checked In' : 'Not Checked In'}
                    </p>
                    <p className={clsx('text-2xl font-bold', checkedIn ? 'text-success' : 'text-base-content')}>
                      {checkedIn ? 'ON DUTY' : 'OFF DUTY'}
                    </p>
                  </div>
                  {!checkedIn ? (
                    <button onClick={handleCheckIn} className="btn btn-success">
                      Check In
                    </button>
                  ) : (
                    <button onClick={handleCheckOut} className="btn btn-error">
                      Check Out
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-lg font-semibold mb-4">Attendance History</h2>
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record._id}>
                  <td>{record.employeeId?.name}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>
                    {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                  </td>
                  <td>
                    {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                  </td>
                  <td>{record.totalHours ? record.totalHours.toFixed(2) : '-'}</td>
                  <td>
                    <span className={clsx('badge', record.status === 'present' ? 'badge-success' : 'badge-ghost')}>
                      {record.status}
                    </span>
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

export default AttendancePage;
