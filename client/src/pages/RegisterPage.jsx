import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { loginSuccess, loginFailure } from '../slices/authSlice';
import { MdEmail, MdLock, MdPerson, MdBusiness } from 'react-icons/md';

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

  const InputField = ({ label, name, type = 'text', icon: Icon, error, ...props }) => (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-3 text-base-content/50">
            <Icon size={18} />
          </span>
        )}
        <input
          type={type}
          className={`input input-bordered w-full ${Icon ? 'pl-10' : ''} ${error ? 'input-error' : ''}`}
          {...register(name)}
          {...props}
        />
      </div>
      {error && <span className="text-error text-sm mt-1">{error.message}</span>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-black text-center mb-8 text-primary">
          SMART HRMS
        </h1>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-xl font-semibold text-center mb-6">
              Create your account
            </h2>

            {generalError && (
              <div className="alert alert-error mb-4">
                <span>{generalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  name="firstName"
                  icon={MdPerson}
                  error={errors.firstName}
                  placeholder="John"
                />
                <InputField
                  label="Last Name"
                  name="lastName"
                  icon={MdPerson}
                  error={errors.lastName}
                  placeholder="Doe"
                />
              </div>

              <InputField
                label="Company Name"
                name="companyName"
                icon={MdBusiness}
                error={errors.companyName}
                placeholder="Acme Corp"
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                icon={MdEmail}
                error={errors.email}
                placeholder="your@email.com"
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                icon={MdLock}
                error={errors.password}
                placeholder="Min 6 characters"
              />

              <button
                type="submit"
                className={`btn btn-primary w-full mt-4 ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </form>

            <p className="text-center text-sm text-base-content/60 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary font-semibold">
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
