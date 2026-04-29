import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metrics: null,
  attendanceTrend: null,
  departmentBreakdown: null,
  leaveBreakdown: null,
  payrollSummary: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDashboardSuccess: (state, action) => {
      state.loading = false;
      state.metrics = action.payload.metrics;
      state.attendanceTrend = action.payload.attendanceTrend;
      state.departmentBreakdown = action.payload.departmentBreakdown;
      state.leaveBreakdown = action.payload.leaveBreakdown;
      state.payrollSummary = action.payload.payrollSummary;
    },
    fetchDashboardFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDashboardStart, fetchDashboardSuccess, fetchDashboardFailure } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
