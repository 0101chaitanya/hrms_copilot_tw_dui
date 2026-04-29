import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MdDashboard, MdPeople, MdCalendarToday, MdAccessTime, MdAttachMoney, MdPerson } from 'react-icons/md';
import clsx from 'clsx';

const NavItem = ({ to, icon: Icon, label, color = 'primary' }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const colorClasses = {
    primary: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    success: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    info: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300',
    secondary: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  };

  return (
    <Link
      to={to}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 mx-2 rounded-lg font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-content'
          : 'hover:bg-base-200 text-base-content'
      )}
    >
      <span className={clsx('p-1.5 rounded-md', isActive ? 'bg-primary-content/20' : colorClasses[color])}>
        <Icon size={18} />
      </span>
      <span>{label}</span>
    </Link>
  );
};

const SidebarNav = () => {
  const { isAdmin, isHR, isEmployee } = useAuth();

  return (
    <div className="h-full overflow-y-auto py-2">
      <nav className="flex flex-col gap-1">
        <NavItem to="/dashboard" icon={MdDashboard} label="Dashboard" color="primary" />

        {(isAdmin || isHR) && (
          <>
            <NavItem to="/employees" icon={MdPeople} label="Employees" color="success" />
            <NavItem to="/leaves" icon={MdCalendarToday} label="Leave Management" color="warning" />
            <NavItem to="/attendance" icon={MdAccessTime} label="Attendance" color="info" />
            <NavItem to="/payroll" icon={MdAttachMoney} label="Payroll" color="secondary" />
          </>
        )}

        {isEmployee && (
          <>
            <NavItem to="/leaves" icon={MdCalendarToday} label="My Leaves" color="warning" />
            <NavItem to="/attendance" icon={MdAccessTime} label="Attendance" color="info" />
          </>
        )}

        <NavItem to="/profile" icon={MdPerson} label="My Profile" color="neutral" />
      </nav>
    </div>
  );
};

export default SidebarNav;
