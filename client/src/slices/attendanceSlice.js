import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  attendance: [],
  selectedAttendance: null,
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    fetchAttendanceStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAttendanceSuccess: (state, action) => {
      state.loading = false;
      state.attendance = action.payload;
    },
    fetchAttendanceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addAttendance: (state, action) => {
      state.attendance.push(action.payload);
    },
    updateAttendance: (state, action) => {
      const index = state.attendance.findIndex((a) => a._id === action.payload._id);
      if (index >= 0) {
        state.attendance[index] = action.payload;
      }
    },
  },
});

export const {
  fetchAttendanceStart,
  fetchAttendanceSuccess,
  fetchAttendanceFailure,
  addAttendance,
  updateAttendance,
} = attendanceSlice.actions;
export default attendanceSlice.reducer;
