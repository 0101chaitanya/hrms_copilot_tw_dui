import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leaves: [],
  selectedLeave: null,
  loading: false,
  error: null,
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    fetchLeavesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLeavesSuccess: (state, action) => {
      state.loading = false;
      state.leaves = action.payload;
    },
    fetchLeavesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedLeave: (state, action) => {
      state.selectedLeave = action.payload;
    },
    addLeave: (state, action) => {
      state.leaves.push(action.payload);
    },
    updateLeave: (state, action) => {
      const index = state.leaves.findIndex((l) => l._id === action.payload._id);
      if (index >= 0) {
        state.leaves[index] = action.payload;
      }
    },
  },
});

export const {
  fetchLeavesStart,
  fetchLeavesSuccess,
  fetchLeavesFailure,
  setSelectedLeave,
  addLeave,
  updateLeave,
} = leaveSlice.actions;
export default leaveSlice.reducer;
