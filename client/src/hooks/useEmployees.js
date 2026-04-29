import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';
import {
  fetchEmployeesStart,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
} from '../slices/employeeSlice';

export const useEmployees = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employee.employees);
  const loading = useSelector((state) => state.employee.loading);
  const error = useSelector((state) => state.employee.error);

  const getEmployees = async () => {
    dispatch(fetchEmployeesStart());
    try {
      const response = await api.get('/employees');
      dispatch(fetchEmployeesSuccess(response.data.data));
    } catch (err) {
      dispatch(fetchEmployeesFailure(err.response?.data?.message || 'Failed to fetch employees'));
    }
  };

  return { employees, loading, error, getEmployees };
};
