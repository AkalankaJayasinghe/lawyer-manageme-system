import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../common/Navbar';

const menuItems = {
  user: [
    { label: 'Dashboard', path: '/client-dashboard', icon: '🏠' },
    { label: 'Find Lawyers', path: '/lawyers', icon: '⚖️' },
    { label: 'My Bookings', path: '/booking-management', icon: '📅' },
    { label: 'Messages', path: '/messaging', icon: '💬' },
    { label: 'Documents', path: '/documents', icon: '📄' },
    { label: 'Payments', path: '/payments', icon: '💳' },
  ],
  lawyer: [
    { label: 'Dashboard', path: '/lawyer-dashboard', icon: '🏠' },
    { label: 'My Profile', path: '/lawyer-profile-management', icon: '👤' },
    { label: 'Consultations', path: '/booking-management', icon: '📅' },
    { label: 'Messages', path: '/messaging', icon: '💬' },
    { label: 'Documents', path: '/documents', icon: '📄' },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin-dashboard', icon: '🏠' },
    { label: 'Users', path: '/admin/users', icon: '👥' },
    { label: 'Lawyers', path: '/lawyers', icon: '⚖️' },
    { label: 'Bookings', path: '/booking-management', icon: '📅' },
    { label: 'Documents', path: '/documents', icon: '📄' },
  ],
};

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role || 'user';
  const items = menuItems[role] || menuItems.user;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar toggle button for mobile */}
        <button
          className="fixed bottom-4 right-4 z-40 lg:hidden bg-blue-600 text-white rounded-full p-3 shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-30 h-full w-64 bg-gray-900 text-white pt-16 transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:h-auto`}
        >
          <div className="px-4 py-6">
            <div className="mb-6 px-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {role.charAt(0).toUpperCase() + role.slice(1)} Menu
              </p>
            </div>
            <nav className="space-y-1">
              {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
