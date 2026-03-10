import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import '../../styles/modern-header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    // TODO: Implement logout action
    // dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/lawyers?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="navbar-brand-logo">
              LegalConnect
            </Link>
            
            <div className="navbar-nav-container hidden md:ml-6 md:flex">
              <Link
                to="/"
                className={`navbar-nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Home
              </Link>
              <Link
                to="/lawyers"
                className={`navbar-nav-link ${isActive('/lawyers') ? 'active' : ''}`}
              >
                Find Lawyers
              </Link>
              <Link
                to="/about"
                className={`navbar-nav-link ${isActive('/about') ? 'active' : ''}`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`navbar-nav-link ${isActive('/contact') ? 'active' : ''}`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="navbar-search hidden md:block">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search lawyers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <svg className="search-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </form>
          </div>

          <div className="navbar-auth-buttons hidden md:flex">
            {isAuthenticated ? (
              <div className="navbar-user-menu">
                <Link
                  to="/dashboard"
                  className={`navbar-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/bookings"
                  className={`navbar-nav-link ${isActive('/bookings') ? 'active' : ''}`}
                >
                  Bookings
                </Link>
                <Link
                  to="/profile"
                  className={`navbar-nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="navbar-logout-btn"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="navbar-login-btn"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="navbar-signup-btn"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="mobile-nav-toggle md:hidden"
            onClick={toggleMobileMenu}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'open' : ''} md:hidden`}>
          <div className="mobile-nav-links">
            <Link
              to="/"
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/lawyers"
              className={`mobile-nav-link ${isActive('/lawyers') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Find Lawyers
            </Link>
            <Link
              to="/about"
              className={`mobile-nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`mobile-nav-link ${isActive('/contact') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`mobile-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/bookings"
                  className={`mobile-nav-link ${isActive('/bookings') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Bookings
                </Link>
                <Link
                  to="/profile"
                  className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}
          </div>
          
          <div className="mobile-nav-buttons">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
