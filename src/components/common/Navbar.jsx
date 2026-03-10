import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout, isLawyer, isUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.navbar-user-menu')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getDashboardLink = () => {
    if (isLawyer && isLawyer()) return '/lawyer-dashboard';
    if (isUser && isUser()) return '/client-dashboard';
    return '/dashboard';
  };

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/lawyers', label: 'Find Lawyers' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const authLinks = [
    { to: getDashboardLink(), label: 'Dashboard' },
    { to: '/lawyers', label: 'Lawyers' },
    { to: '/booking-management', label: 'Consultations' },
    { to: '/messaging', label: 'Messages' },
    { to: '/documents', label: 'Documents' },
  ];

  const navLinks = isAuthenticated ? authLinks : publicLinks;

  return (
    <nav className={`navbar-container${scrolled ? ' scrolled' : ''}`} style={{ position: 'relative' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="navbar-brand-logo">
            <span style={{ marginRight: '0.4rem', fontSize: '1.4rem' }}>⚖️</span>
            LegalConnect
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="navbar-nav-container">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`navbar-nav-link${isActive(link.to) ? ' active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Auth Section */}
          <div className="navbar-auth-buttons">
            {isAuthenticated ? (
              <div className="navbar-user-menu">
                <div
                  className="navbar-user-avatar"
                  onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                  title={user?.name}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className={`navbar-dropdown${dropdownOpen ? ' open' : ''}`}>
                  <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>
                      {user?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'capitalize', marginTop: '2px' }}>
                      {user?.role}
                    </div>
                  </div>
                  <Link to="/profile" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Profile Settings
                  </Link>
                  {isLawyer && isLawyer() && (
                    <Link to="/lawyer-profile-management" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      Manage Profile
                    </Link>
                  )}
                  <Link to={getDashboardLink()} className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    My Dashboard
                  </Link>
                  <button className="navbar-logout-btn" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="navbar-login-btn">Sign In</Link>
                <Link to="/register" className="navbar-signup-btn">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-nav-menu${mobileOpen ? ' open' : ''}`}>
        <div className="mobile-nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-link${isActive(link.to) ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mobile-nav-buttons">
          {isAuthenticated ? (
            <>
              <div style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#374151', fontWeight: 600 }}>
                {user?.name}
              </div>
              <Link to="/profile" className="mobile-nav-link" style={{ borderLeft: 'none' }}>
                Profile Settings
              </Link>
              <button
                className="navbar-logout-btn"
                onClick={handleLogout}
                style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-login-btn" style={{ display: 'block', textAlign: 'center' }}>
                Sign In
              </Link>
              <Link to="/register" className="navbar-signup-btn" style={{ display: 'block', textAlign: 'center' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
