import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  user: null,
  company: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  initialized: false,
};

// Thunk to initialize auth state on app load
export const initAuth = createAsyncThunk(
  'auth/initAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data.data;
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.company = action.payload.company;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.company = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.company = action.payload.company;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.company = action.payload.company;
        state.initialized = true;
      })
      .addCase(initAuth.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.company = null;
        state.initialized = true;
      });
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
