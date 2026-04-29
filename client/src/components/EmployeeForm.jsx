import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../utils/api';
import { MdPerson, MdEmail, MdPhone, MdLocationOn, MdCalendarToday, MdWork, MdAttachMoney, MdBusiness } from 'react-icons/md';

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  joinDate: z.string().min(1, 'Join date is required'),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  salary: z.coerce.number().positive('Salary must be positive'),
});

const EmployeeForm = ({ employee, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee || {
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      joinDate: new Date().toISOString().split('T')[0],
      department: '',
      position: '',
      salary: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      if (employee) {
        await api.put(`/employees/${employee._id}`, data);
      } else {
        await api.post('/employees', data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save employee:', error);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Name"
          name="name"
          icon={MdPerson}
          error={errors.name}
          placeholder="Employee full name"
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          icon={MdEmail}
          error={errors.email}
          placeholder="employee@company.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Phone"
          name="phone"
          type="tel"
          icon={MdPhone}
          placeholder="+1 (555) 000-0000"
        />
        <InputField
          label="Address"
          name="address"
          icon={MdLocationOn}
          placeholder="Full residential address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          icon={MdCalendarToday}
        />
        <InputField
          label="Join Date"
          name="joinDate"
          type="date"
          icon={MdCalendarToday}
          error={errors.joinDate}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Department"
          name="department"
          icon={MdBusiness}
          error={errors.department}
          placeholder="Engineering"
        />
        <InputField
          label="Position"
          name="position"
          icon={MdWork}
          error={errors.position}
          placeholder="Software Engineer"
        />
      </div>

      <InputField
        label="Salary"
        name="salary"
        type="number"
        icon={MdAttachMoney}
        error={errors.salary}
        placeholder="60000"
      />

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
