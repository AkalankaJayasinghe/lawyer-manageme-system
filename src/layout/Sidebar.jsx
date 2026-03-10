import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user, isLawyer, isUser } = useAuth();
  const location = useLocation();

  const isActiveRoute = (path) => location.pathname === path;

  const userNavItems = [
    { name: 'Dashboard', href: '/client-dashboard', icon: '📊' },
    { name: 'Find Lawyers', href: '/lawyers', icon: '👨‍⚖️' },
    { name: 'My Consultations', href: '/booking-management', icon: '📅' },
    { name: 'Messages', href: '/messaging', icon: '💬' },
    { name: 'Documents', href: '/documents', icon: '📄' },
    { name: 'Profile', href: '/profile', icon: '👤' }
  ];

  const lawyerNavItems = [
    { name: 'Dashboard', href: '/lawyer-dashboard', icon: '📊' },
    { name: 'Profile Management', href: '/lawyer-profile-management', icon: '⚙️' },
    { name: 'Consultations', href: '/booking-management', icon: '📅' },
    { name: 'Messages', href: '/messaging', icon: '💬' },
    { name: 'Documents', href: '/documents', icon: '📄' },
    { name: 'Profile', href: '/profile', icon: '👤' }
  ];

  const adminNavItems = [
    { name: 'Admin Dashboard', href: '/admin-dashboard', icon: '👑' },
    { name: 'All Consultations', href: '/booking-management', icon: '📅' },
    { name: 'All Lawyers', href: '/lawyers', icon: '👨‍⚖️' },
    { name: 'All Users', href: '/admin-dashboard', icon: '👥' }
  ];

  const getNavItems = () => {
    if (user?.role === 'admin') return adminNavItems;
    if (isLawyer()) return lawyerNavItems;
    return userNavItems;
  };

  const navItems = getNavItems();

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        {/* User Info */}
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900">{user?.name}</h3>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActiveRoute(item.href)
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Quick Stats or Additional Info */}
      <div className="p-6 border-t border-gray-200 mt-auto">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Stats</h4>
          <div className="text-xs text-blue-700">
            {isLawyer() ? (
              <>
                <div className="flex justify-between mb-1">
                  <span>This Month:</span>
                  <span className="font-medium">0 consultations</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="font-medium">$0</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between mb-1">
                  <span>Consultations:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Now:</span>
                  <span className="font-medium">0</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;