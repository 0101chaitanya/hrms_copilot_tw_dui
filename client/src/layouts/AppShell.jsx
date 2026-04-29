import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import { toggleColorScheme } from '../slices/themeSlice';
import { useAuth } from '../hooks/useAuth';
import SidebarNav from '../components/SidebarNav';
import { MdMenu, MdClose, MdLightMode, MdDarkMode } from 'react-icons/md';

export const AppLayout = ({ children }) => {
  const [opened, setOpened] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const colorScheme = useSelector((state) => state.theme.colorScheme);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setOpened(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Header */}
      <header className="navbar bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 px-4">
        <div className="flex-none">
          <button
            onClick={() => setOpened(!opened)}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle menu"
          >
            {opened ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-base-200 border-r border-base-300 transition-all duration-300 overflow-y-auto ${
            opened ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0'
          } ${isMobile ? 'fixed inset-y-0 left-0 z-40 mt-16' : ''}`}
        >
          <SidebarNav />
        </aside>

        {/* Mobile overlay */}
        {isMobile && opened && (
          <div
            className="fixed inset-0 bg-black/50 z-30 mt-16"
            onClick={() => setOpened(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-base-200 border-t border-base-300 py-4 text-center text-sm text-base-content/60">
        © 2024 SMART HRMS. All rights reserved.
      </footer>
    </div>
  );
};
