import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { loginSuccess, loginFailure } from '../slices/authSlice';
import { MdEmail, MdLock, MdAdminPanelSettings, MdPeople, MdPerson } from 'react-icons/md';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const DEMO_CREDENTIALS = [
  { role: 'admin', email: 'admin@demo.com', password: 'Admin@123', color: 'badge-error', icon: MdAdminPanelSettings },
  { role: 'hr', email: 'hr@demo.com', password: 'Hr@123', color: 'badge-warning', icon: MdPeople },
  { role: 'employee', email: 'employee@demo.com', password: 'Employee@123', color: 'badge-info', icon: MdPerson },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [generalError, setGeneralError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setGeneralError('');
    try {
      const response = await api.post('/auth/login', data);
      dispatch(
        loginSuccess({
          user: response.data.data.user,
          company: response.data.data.company,
          token: response.data.data.token,
        })
      );
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      setGeneralError(errorMessage);
    }
  };

  const fillDemoCredentials = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-black text-center mb-8 text-primary">
          SMART HRMS
        </h1>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-xl font-semibold text-center mb-6">
              Welcome back!
            </h2>

            {generalError && (
              <div className="alert alert-error mb-4">
                <span>{generalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-base-content/50">
                    <MdEmail size={18} />
                  </span>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className={`input input-bordered w-full pl-10 ${errors.email ? 'input-error' : ''}`}
                    {...register('email')}
                  />
                </div>
                {errors.email && <span className="text-error text-sm mt-1">{errors.email.message}</span>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-base-content/50">
                    <MdLock size={18} />
                  </span>
                  <input
                    type="password"
                    placeholder="Your password"
                    className={`input input-bordered w-full pl-10 ${errors.password ? 'input-error' : ''}`}
                    {...register('password')}
                  />
                </div>
                {errors.password && <span className="text-error text-sm mt-1">{errors.password.message}</span>}
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Demo Credentials Section */}
            <div className="divider my-6 text-sm">Demo Credentials</div>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <div
                  key={cred.role}
                  className="card card-bordered bg-base-100 cursor-pointer hover:bg-base-200 transition-colors"
                  onClick={() => fillDemoCredentials(cred.email, cred.password)}
                >
                  <div className="card-body p-3 flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <cred.icon size={20} className="text-base-content/70" />
                      <div>
                        <p className="font-medium capitalize text-sm">{cred.role}</p>
                        <p className="text-xs text-base-content/50">{cred.email}</p>
                      </div>
                    </div>
                    <span className={`badge ${cred.color} badge-sm`}>{cred.password}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-base-content/60 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="link link-primary font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
