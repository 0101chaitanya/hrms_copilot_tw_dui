import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { loginSuccess, loginFailure } from '../slices/authSlice';
import { MdEmail, MdLock, MdPerson, MdBusiness } from 'react-icons/md';
import InputField from '../components/InputField';
import clsx from 'clsx'; // Import clsx

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [generalError, setGeneralError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setGeneralError('');
    try {
      const response = await api.post('/auth/register', data);
      dispatch(
        loginSuccess({
          user: response.data.data.user,
          company: response.data.data.company,
          token: response.data.data.token,
        })
      );
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch(loginFailure(errorMessage));
      setGeneralError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-black text-center mb-8 text-primary">
          SMART HRMS
        </h1>

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="text-xl font-semibold text-center mb-6">
              Create your account
            </h2>

            {generalError && (
              <div className="alert alert-error mb-4 shadow-sm">
                <span>{generalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  icon={MdPerson}
                  error={errors.firstName}
                  placeholder="John"
                  {...register('firstName')}
                />
                <InputField
                  label="Last Name"
                  icon={MdPerson}
                  error={errors.lastName}
                  placeholder="Doe"
                  {...register('lastName')}
                />
              </div>

              <InputField
                label="Company Name"
                icon={MdBusiness}
                error={errors.companyName}
                placeholder="Acme Corp"
                {...register('companyName')}
              />

              <InputField
                label="Email"
                type="email"
                icon={MdEmail}
                error={errors.email}
                placeholder="your@email.com"
                {...register('email')}
              />

              <InputField
                label="Password"
                type="password"
                icon={MdLock}
                error={errors.password}
                placeholder="Min 6 characters"
                {...register('password')}
              />

              <button
                type="submit"
                className={clsx('btn btn-primary w-full mt-4', isSubmitting && 'loading')}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </form>

            <p className="text-center text-sm text-base-content/60 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary font-semibold hover:text-primary-focus transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
