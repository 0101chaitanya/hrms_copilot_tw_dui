import React, { useEffect, useState } from 'react';
import { AppLayout } from '../layouts/AppShell';
import { Page } from '../components/Page';
import api from '../utils/api';
import EmployeeForm from '../components/EmployeeForm';
import Loader from '../components/Loader';
import clsx from 'clsx'; // Import clsx

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setOpened(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setOpened(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter((e) => e._id !== id));
      } catch (error) {
        console.error('Failed to delete employee:', error);
      }
    }
  };

  const handleFormClose = () => {
    setOpened(false);
    fetchEmployees();
  };

  if (loading) {
    return (
      <AppLayout>
        <Loader />
      </AppLayout>
    );
  }

  const pageActions = (
    <button className="btn btn-primary" onClick={handleAddEmployee}>
      Add Employee
    </button>
  );

  return (
    <AppLayout>
      <Page title="Employees" actions={pageActions}>
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow border border-base-300">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-base-content/50">
                    No employee records found.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.firstName} {employee.lastName}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>{employee.position}</td>
                    <td>${employee.salary?.toLocaleString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-xs btn-ghost"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-xs btn-error btn-outline"
                          onClick={() => handleDeleteEmployee(employee._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <dialog className={clsx('modal', opened && 'modal-open')}>
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              {selectedEmployee ? 'Edit Employee' : 'Add Employee'}
            </h3>
            <EmployeeForm employee={selectedEmployee} onClose={handleFormClose} />
          </div>
          <form method="dialog" className="modal-backdrop" onClick={(e) => { e.preventDefault(); setOpened(false); }}>
            <button type="button">close</button>
          </form>
        </dialog>
      </Page>
    </AppLayout>
  );
};

export default EmployeesPage;
