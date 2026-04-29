import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MdDashboard, MdPeople, MdCalendarToday, MdAccessTime, MdAttachMoney, MdPerson } from 'react-icons/md';
import clsx from 'clsx';

const NavItem = ({ to, icon: Icon, label, color = 'primary' }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  // Use theme-aware Tailwind classes with opacity modifiers.
  // This is more idiomatic and respects the DaisyUI theme.
  const colorStyles = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
    secondary: 'bg-secondary/10 text-secondary',
    neutral: 'bg-neutral/10 text-neutral-content',
  };

  return (
    <Link
      to={to}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 mx-2 rounded-lg font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-content shadow-sm'
          : 'hover:bg-base-300/50 text-base-content'
      )}
    >
      <span className={clsx(
        'p-1.5 rounded-md',
        isActive ? 'bg-primary-content/20' : colorStyles[color]
      )}>
        <Icon size={18} />
      </span>
      <span>{label}</span>
    </Link>
  );
};

const SidebarNav = () => {
  const { isAdmin, isHR, isEmployee } = useAuth();

  const mainNav = (
    <>
      <NavItem to="/dashboard" icon={MdDashboard} label="Dashboard" color="primary" />
      {(isAdmin || isHR) && (
        <>
          <NavItem to="/employees" icon={MdPeople} label="Employees" color="success" />
          <NavItem to="/leaves" icon={MdCalendarToday} label="Leave Management" color="warning" />
          <NavItem to="/attendance" icon={MdAccessTime} label="Attendance" color="info" />
          <NavItem to="/payroll" icon={MdAttachMoney} label="Payroll" color="secondary" />
        </>
      )}
      {isEmployee && !isHR && !isAdmin && (
        <>
          <NavItem to="/leaves" icon={MdCalendarToday} label="My Leaves" color="warning" />
          <NavItem to="/attendance" icon={MdAccessTime} label="Attendance" color="info" />
        </>
      )}
    </>
  );

  return (
    <div className="h-full flex flex-col justify-between py-4">
      <nav className="flex flex-col gap-1">
        {mainNav}
      </nav>
      <nav className="flex flex-col gap-1">
        <NavItem to="/profile" icon={MdPerson} label="My Profile" color="neutral" />
      </nav>
    </div>
  );
};

export default SidebarNav;
