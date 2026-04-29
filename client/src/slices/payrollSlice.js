import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payroll: [],
  selectedPayroll: null,
  loading: false,
  error: null,
};

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    fetchPayrollStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPayrollSuccess: (state, action) => {
      state.loading = false;
      state.payroll = action.payload;
    },
    fetchPayrollFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedPayroll: (state, action) => {
      state.selectedPayroll = action.payload;
    },
    addPayroll: (state, action) => {
      state.payroll.push(...action.payload);
    },
  },
});

export const {
  fetchPayrollStart,
  fetchPayrollSuccess,
  fetchPayrollFailure,
  setSelectedPayroll,
  addPayroll,
} = payrollSlice.actions;
export default payrollSlice.reducer;
