import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    fetchEmployeesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEmployeesSuccess: (state, action) => {
      state.loading = false;
      state.employees = action.payload;
    },
    fetchEmployeesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    addEmployee: (state, action) => {
      state.employees.push(action.payload);
    },
    updateEmployee: (state, action) => {
      const index = state.employees.findIndex((e) => e._id === action.payload._id);
      if (index >= 0) {
        state.employees[index] = action.payload;
      }
    },
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter((e) => e._id !== action.payload);
    },
  },
});

export const {
  fetchEmployeesStart,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  setSelectedEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = employeeSlice.actions;
export default employeeSlice.reducer;
