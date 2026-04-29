import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '../layouts/AppShell';
import { Page } from '../components/Page';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { MdPerson, MdEmail, MdPhone, MdBusiness, MdBadge, MdCheck } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/authSlice';
import clsx from 'clsx';
import InputField from '../components/InputField'; // Import the shared InputField

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  department: z.string().optional(),
});

const ProfilePage = () => {
  const { user, isAdmin, isHR } = useAuth();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      department: user?.department || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        department: user.department || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setSuccess(false);
    try {
      const response = await api.put('/auth/profile', data);
      dispatch(setUser({
        user: response.data.data.user,
        company: user.company,
      }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const getRoleBadgeClass = () => {
    if (isAdmin) return 'badge-error';
    if (isHR) return 'badge-warning';
    return 'badge-info';
  };

  const getRoleIconClass = () => {
    if (isAdmin) return 'bg-error/10 text-error';
    if (isHR) return 'bg-warning/10 text-warning';
    return 'bg-info/10 text-info';
  };

  return (
    <AppLayout>
      <Page title="My Profile">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="md:col-span-1">
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body items-center text-center">
                <div className={clsx('w-20 h-20 rounded-full flex items-center justify-center mb-4', getRoleIconClass())}>
                  <MdPerson size={40} />
                </div>
                
                <h2 className="text-xl font-semibold">
                  {user?.firstName} {user?.lastName}
                </h2>
                <span className={clsx('badge', getRoleBadgeClass())}>
                  {user?.role?.toUpperCase()}
                </span>

                <div className="divider w-full my-4"></div>

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <MdEmail size={16} className="text-base-content/50" />
                    <span className="text-sm text-base-content/70">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MdBusiness size={16} className="text-base-content/50" />
                    <span className="text-sm text-base-content/70">{user?.company?.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MdBadge size={16} className="text-base-content/50" />
                    <span className="text-sm text-base-content/70">
                      {user?.department || 'No department set'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="md:col-span-2 space-y-4">
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body">
                <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

                {success && (
                  <div className="alert alert-success mb-4">
                    <MdCheck size={20} />
                    <span>Profile updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="First Name"
                      icon={MdPerson}
                      error={errors.firstName}
                      {...register('firstName')}
                    />
                    <InputField
                      label="Last Name"
                      icon={MdPerson}
                      error={errors.lastName}
                      {...register('lastName')}
                    />
                  </div>

                  <InputField
                    label="Phone"
                    type="tel"
                    icon={MdPhone}
                    error={errors.phone}
                    {...register('phone')}
                  />

                  {/* Only Admin/HR can edit department */}
                  {(isAdmin || isHR) ? (
                    <InputField
                      label="Department"
                      icon={MdBusiness}
                      error={errors.department}
                      description="Only Admin and HR can edit department"
                      {...register('department')}
                    />
                  ) : (
                    <InputField
                      label="Department"
                      icon={MdBusiness}
                      disabled
                      description="Contact HR to change your department"
                      value={user?.department || ''} // Display current department for disabled field
                    />
                  )}

                  <InputField
                    label="Email"
                    icon={MdEmail}
                    disabled
                    description="Email cannot be changed"
                    value={user?.email || ''} // Display current email for disabled field
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className={clsx('btn btn-primary', isSubmitting && 'loading')}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Role-based Info */}
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body">
                <h3 className="text-sm font-medium text-base-content/60 mb-3">Role Permissions</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Can edit:</span> First Name, Last Name, Phone
                  </p>
                  {(isAdmin || isHR) && (
                    <p>
                      <span className="font-semibold">Can also edit:</span> Department
                    </p>
                  )}
                  <p className="text-base-content/50">
                    Email address cannot be changed for security reasons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page>
    </AppLayout>
  );
};

export default ProfilePage;
