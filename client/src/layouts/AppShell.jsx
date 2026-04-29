import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import { toggleColorScheme } from '../slices/themeSlice';
import { useAuth } from '../hooks/useAuth';
import SidebarNav from '../components/SidebarNav';
import { MdMenu, MdLightMode, MdDarkMode } from 'react-icons/md';

export const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const colorScheme = useSelector((state) => state.theme.colorScheme);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Header */}
        <header className="navbar bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 px-4">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer" className="btn btn-ghost btn-circle" aria-label="open sidebar">
              <MdMenu size={24} />
            </label>
          </div>
          <div className="flex-1">
            <span className="text-xl font-semibold px-4">SMART HRMS</span>
          </div>
          <div className="flex-none gap-2">
            <button
              onClick={() => dispatch(toggleColorScheme())}
              className="btn btn-ghost btn-circle"
              title={colorScheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {colorScheme === 'dark' ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
            </button>
            <span className="text-sm hidden sm:inline">{user?.firstName}</span>
            <button onClick={handleLogout} className="btn btn-sm btn-outline">
              Logout
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-base-100">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-base-200 border-t border-base-300 py-4 text-center text-sm text-base-content/60">
          © 2024 SMART HRMS. All rights reserved.
        </footer>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="bg-base-200 w-64 h-full">
          <SidebarNav />
        </aside>
      </div>
    </div>
  );
};
