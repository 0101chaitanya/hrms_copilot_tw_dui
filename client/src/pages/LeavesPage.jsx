import React, { useEffect, useState } from 'react';
import { AppLayout } from '../layouts/AppShell';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import LeaveForm from '../components/LeaveForm';
import clsx from 'clsx';

const LeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const { isAdmin, isHR } = useAuth();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await api.get('/leaves');
      setLeaves(response.data.data);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/leaves/${id}/approve`, { status: 'approved' });
      fetchLeaves();
    } catch (error) {
      console.error('Failed to approve leave:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/leaves/${id}/approve`, { status: 'rejected' });
      fetchLeaves();
    } catch (error) {
      console.error('Failed to reject leave:', error);
    }
  };

  const handleFormClose = () => {
    setOpened(false);
    fetchLeaves();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-error';
      default:
        return 'badge-warning';
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <button className="btn btn-primary" onClick={() => setOpened(true)}>
            Request Leave
          </button>
        </div>

        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Employee</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Leave Type</th>
                <th>Reason</th>
                <th>Status</th>
                {(isAdmin || isHR) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.employeeId?.name}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td className="capitalize">{leave.leaveType}</td>
                  <td className="max-w-xs truncate">{leave.reason}</td>
                  <td>
                    <span className={clsx('badge', getStatusBadgeClass(leave.status))}>
                      {leave.status}
                    </span>
                  </td>
                  {(isAdmin || isHR) && leave.status === 'pending' && (
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApprove(leave._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-error btn-outline"
                          onClick={() => handleReject(leave._id)}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DaisyUI Modal */}
        <dialog className={`modal ${opened ? 'modal-open' : ''}`}>
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Request Leave</h3>
            <LeaveForm onClose={handleFormClose} />
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setOpened(false)}>
            <button>close</button>
          </form>
        </dialog>
      </div>
    </AppLayout>
  );
};

export default LeavesPage;
