import React from 'react';
import clsx from 'clsx';

const InputField = React.forwardRef(
  ({ label, name, type = 'text', icon: Icon, error, disabled, description, ...props }, ref) => (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className="relative">
        {Icon && (
          <span
            className={clsx(
              'absolute left-3 top-3',
              disabled ? 'text-base-content/30' : 'text-base-content/50'
            )}
          >
            <Icon size={18} />
          </span>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          name={name}
          className={clsx(
            'input input-bordered w-full',
            Icon && 'pl-10',
            error && 'input-error',
            disabled && 'input-disabled bg-base-200'
          )}
          {...props}
        />
      </div>
      {error && <span className="text-error text-sm mt-1">{error.message}</span>}
      {description && <span className="text-xs text-base-content/50 mt-1">{description}</span>}
    </div>
  )
);

InputField.displayName = 'InputField';

export default InputField;
