import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import LeavesPage from './pages/LeavesPage';
import AttendancePage from './pages/AttendancePage';
import PayrollPage from './pages/PayrollPage';
import ProfilePage from './pages/ProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthInitializer } from './components/AuthInitializer';

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaves"
            element={
              <ProtectedRoute>
                <LeavesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payroll"
            element={
              <ProtectedRoute>
                <PayrollPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
