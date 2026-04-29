import React from 'react';

const MetricCard = ({ title, value, description, icon: Icon, iconBgColor, valueColor }) => {
  return (
    <div className="card bg-base-100 shadow border border-base-300">
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-base-content/60">{title}</span>
          {Icon && (
            <div className={`w-8 h-8 rounded-full ${iconBgColor} flex items-center justify-center`}>
              <Icon size={14} />
            </div>
          )}
        </div>
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        {description && <p className="text-xs text-base-content/60">{description}</p>}
      </div>
    </div>
  );
};

export default MetricCard;
