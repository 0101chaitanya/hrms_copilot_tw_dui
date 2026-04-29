import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import employeeReducer from '../slices/employeeSlice';
import leaveReducer from '../slices/leaveSlice';
import attendanceReducer from '../slices/attendanceSlice';
import payrollReducer from '../slices/payrollSlice';
import dashboardReducer from '../slices/dashboardSlice';
import themeReducer from '../slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    leave: leaveReducer,
    attendance: attendanceReducer,
    payroll: payrollReducer,
    dashboard: dashboardReducer,
    theme: themeReducer,
  },
});

export default store;
