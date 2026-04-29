import React from 'react';

export const Page = ({ title, actions, children }) => {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
};
