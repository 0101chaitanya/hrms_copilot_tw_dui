import React, { useEffect, useState } from 'react';
import { AppLayout } from '../layouts/AppShell';
import { Page } from '../components/Page';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import LeaveForm from '../components/LeaveForm';
import clsx from 'clsx';
import Loader from '../components/Loader';

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
        <Loader />
      </AppLayout>
    );
  }

  const pageActions = (
    <button className="btn btn-primary" onClick={() => setOpened(true)}>
      Request Leave
    </button>
  );

  return (
    <AppLayout>
      <Page title="Leave Management" actions={pageActions}>
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow border border-base-300">
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
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={(isAdmin || isHR) ? "7" : "6"} className="text-center py-4 text-base-content/50">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.employeeId?.name || 'Unknown'}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td className="capitalize">{leave.leaveType}</td>
                    <td className="max-w-xs truncate" title={leave.reason}>{leave.reason}</td>
                    <td>
                      <span className={clsx('badge badge-sm', getStatusBadgeClass(leave.status))}>
                        {leave.status}
                      </span>
                    </td>
                    {(isAdmin || isHR) && (
                      <td>
                        {leave.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              className="btn btn-xs btn-success"
                              onClick={() => handleApprove(leave._id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-xs btn-error btn-outline"
                              onClick={() => handleReject(leave._id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <dialog className={clsx('modal', opened && 'modal-open')}>
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Request Leave</h3>
            <LeaveForm onClose={handleFormClose} />
          </div>
          <form method="dialog" className="modal-backdrop" onClick={(e) => { e.preventDefault(); setOpened(false); }}>
            <button type="button">close</button>
          </form>
        </dialog>
      </Page>
    </AppLayout>
  );
};

export default LeavesPage;
