import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../utils/api';
import { MdCalendarToday, MdDescription } from 'react-icons/md';

const leaveSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  leaveType: z.enum(['personal', 'sick', 'annual', 'unpaid']),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

const LeaveForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      leaveType: 'personal',
      reason: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/leaves', data);
      onClose();
    } catch (error) {
      console.error('Failed to create leave request:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Start Date</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-base-content/50">
              <MdCalendarToday size={18} />
            </span>
            <input
              type="date"
              className={`input input-bordered w-full pl-10 ${errors.startDate ? 'input-error' : ''}`}
              {...register('startDate')}
            />
          </div>
          {errors.startDate && <span className="text-error text-sm mt-1">{errors.startDate.message}</span>}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">End Date</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-base-content/50">
              <MdCalendarToday size={18} />
            </span>
            <input
              type="date"
              className={`input input-bordered w-full pl-10 ${errors.endDate ? 'input-error' : ''}`}
              {...register('endDate')}
            />
          </div>
          {errors.endDate && <span className="text-error text-sm mt-1">{errors.endDate.message}</span>}
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Leave Type</span>
        </label>
        <select className="select select-bordered w-full" {...register('leaveType')}>
          <option value="personal">Personal</option>
          <option value="sick">Sick</option>
          <option value="annual">Annual</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Reason</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-base-content/50">
            <MdDescription size={18} />
          </span>
          <textarea
            className={`textarea textarea-bordered w-full pl-10 min-h-[100px] ${errors.reason ? 'textarea-error' : ''}`}
            placeholder="Please provide a brief reason for your leave request"
            {...register('reason')}
          />
        </div>
        {errors.reason && <span className="text-error text-sm mt-1">{errors.reason.message}</span>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default LeaveForm;
