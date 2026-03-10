// Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bookingAPI } from '../services/api';
import Layout from '../layout/MainLayout';
import '../styles/dashboard.css';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: '⏳' },
  confirmed: { label: 'Confirmed', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', icon: '✓' },
  completed: { label: 'Completed', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', icon: '★' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: '✕' },
  rejected:  { label: 'Rejected',  color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: '✕' },
};

const Dashboard = () => {
  const { user, isLawyer, isUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    revenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let bookings = [];

      if (isLawyer()) {
        const res = await bookingAPI.getLawyerBookings();
        bookings = res.data || [];
      } else if (isUser()) {
        const res = await bookingAPI.getUserBookings();
        bookings = res.data || [];
      }

      setRecentBookings(
        [...bookings]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
      );

      const totalBookings = bookings.length;
      const activeBookings = bookings.filter(b =>
        ['pending', 'confirmed'].includes(b.status)
      ).length;
      const completedBookings = bookings.filter(b =>
        b.status === 'completed'
      ).length;
      const revenue = isLawyer()
        ? bookings
            .filter(b => b.status === 'completed' && b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + (b.fee || 0), 0)
        : 0;

      setStats({ totalBookings, activeBookings, completedBookings, revenue });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isLawyer, isUser]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : '—';

  const firstName = user?.name?.split(' ')[0] || 'there';
  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const STAT_CARDS = [
    {
      key: 'total',
      label: 'Total Consultations',
      value: stats.totalBookings,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
      shadow: 'rgba(59, 130, 246, 0.3)',
      trend: '+12%',
      trendUp: true
    },
    {
      key: 'active',
      label: 'Active',
      value: stats.activeBookings,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      shadow: 'rgba(16, 185, 129, 0.3)',
      trend: '+5%',
      trendUp: true
    },
    {
      key: 'completed',
      label: 'Completed',
      value: stats.completedBookings,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
      shadow: 'rgba(139, 92, 246, 0.3)',
      trend: '+8%',
      trendUp: true
    },
    ...(isLawyer()
      ? [
          {
            key: 'revenue',
            label: 'Revenue',
            value: `$${stats.revenue.toLocaleString()}`,
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            ),
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            shadow: 'rgba(245, 158, 11, 0.3)',
            trend: '+15%',
            trendUp: true
          }
        ]
      : [
          {
            key: 'pending',
            label: 'Pending Review',
            value: stats.activeBookings,
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            ),
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            shadow: 'rgba(245, 158, 11, 0.3)',
            trend: null,
            trendUp: false
          }
        ])
  ];

  const QUICK_ACTIONS = isLawyer()
    ? [
        {
          to: '/lawyer-profile-management',
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          ),
          title: 'Manage Profile',
          desc: 'Update your practice info',
          color: '#6366f1'
        },
        {
          to: '/booking-management',
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          ),
          title: 'Consultations',
          desc: 'View & manage bookings',
          color: '#10b981'
        },
        {
          to: '/messaging',
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          ),
          title: 'Messages',
          desc: 'Chat with clients',
          color: '#f59e0b'
        },
        {
          to: '/clients',
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ),
          title: 'My Clients',
          desc: 'View client list',
          color: '#ec4899'
        },
        {
          to: '/documents',
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          ),
          title: 'Documents',
          desc: 'Manage case files',
          color: '#8b5cf6'
        },
        {
          to: '/profile',
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.26.4.4.87.42 1.36" />
            </svg>
          ),
          title: 'Settings',
          desc: 'Account preferences',
          color: '#64748b'
        }
      ]
    : [
        {
          to: '/lawyers',
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          ),
          title: 'Find a Lawyer',
          desc: 'Search by specialization',
          color: '#6366f1'
        },
        {
          to: '/booking-management',
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          ),
          title: 'My Consultations',
          desc: 'View & manage bookings',
          color: '#10b981'
        },
        {
          to: '/messaging',
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          ),
          title: 'Messages',
          desc: 'Chat with your lawyer',
          color: '#f59e0b'
        },
        {
          to: '/documents',
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          ),
          title: 'Documents',
          desc: 'Upload & view files',
          color: '#8b5cf6'
        },
        {
          to: '/lawyers',
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          ),
          title: 'Book Consultation',
          desc: 'Schedule a new session',
          color: '#ec4899'
        },
        {
          to: '/profile',
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.26.4.4.87.42 1.36" />
            </svg>
          ),
          title: 'Settings',
          desc: 'Account preferences',
          color: '#64748b'
        }
      ];

  /* ──────────────────── LOADING ──────────────────── */
  if (loading) {
    return (
      <Layout>
        <div className="db-loading">
          <div className="db-spinner">
            <div className="db-spinner-ring" />
            <div className="db-spinner-ring db-spinner-ring--inner" />
          </div>
          <p className="db-loading-text">Loading your dashboard…</p>
        </div>
      </Layout>
    );
  }

  /* ──────────────────── RENDER ──────────────────── */
  return (
    <Layout>
      <div className="db-wrapper">

        {/* ════════ HERO ════════ */}
        <section className="db-hero">
          <div className="db-hero-bg">
            <div className="db-hero-orb db-hero-orb--1" />
            <div className="db-hero-orb db-hero-orb--2" />
            <div className="db-hero-orb db-hero-orb--3" />
            <div className="db-hero-grid" />
          </div>

          <div className="db-hero-content">
            <div className="db-hero-left">
              <div className="db-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="db-avatar-img" />
                ) : (
                  <span className="db-avatar-initials">{initials}</span>
                )}
                <span className="db-avatar-status" />
              </div>
              <div className="db-hero-text">
                <p className="db-hero-greeting">{greeting}</p>
                <h1 className="db-hero-name">{firstName}! 👋</h1>
                <p className="db-hero-subtitle">
                  {isLawyer()
                    ? 'Here\'s your practice overview for today'
                    : 'Manage your legal consultations in one place'}
                </p>
              </div>
            </div>

            <div className="db-hero-actions">
              <Link
                to={isLawyer() ? '/booking-management' : '/lawyers'}
                className="db-hero-btn db-hero-btn--primary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {isLawyer() ? 'View Schedule' : 'Book Consultation'}
              </Link>
              <Link to="/profile" className="db-hero-btn db-hero-btn--ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4" />
                </svg>
                Settings
              </Link>
            </div>
          </div>

          {/* ════════ STATS ════════ */}
          <div className="db-stats">
            {STAT_CARDS.map((s, i) => (
              <div
                key={s.key}
                className="db-stat"
                style={{
                  '--stat-gradient': s.gradient,
                  '--stat-shadow': s.shadow,
                  animationDelay: `${i * 0.08 + 0.1}s`
                }}
              >
                <div className="db-stat-icon-wrap">
                  {s.icon}
                </div>
                <div className="db-stat-content">
                  <span className="db-stat-value">{s.value}</span>
                  <span className="db-stat-label">{s.label}</span>
                </div>
                {s.trend && (
                  <span className={`db-stat-trend ${s.trendUp ? 'up' : 'down'}`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      {s.trendUp
                        ? <polyline points="18 15 12 9 6 15" />
                        : <polyline points="6 9 12 15 18 9" />}
                    </svg>
                    {s.trend}
                  </span>
                )}
                <div className="db-stat-decor" />
              </div>
            ))}
          </div>
        </section>

        {/* ════════ BODY GRID ════════ */}
        <div className="db-body">

          {/* ──── LEFT: Bookings ──── */}
          <section className="db-card db-card--bookings">
            <div className="db-card-header">
              <div className="db-card-header-left">
                <div className="db-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <h2 className="db-card-title">Recent Consultations</h2>
                  <p className="db-card-subtitle">
                    {recentBookings.length
                      ? `Showing ${recentBookings.length} most recent`
                      : 'No consultations yet'}
                  </p>
                </div>
              </div>
              <Link to="/booking-management" className="db-card-action">
                View All
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {error && (
              <div className="db-alert db-alert--error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
                <button className="db-alert-retry" onClick={fetchDashboardData}>Retry</button>
              </div>
            )}

            {!error && recentBookings.length === 0 ? (
              <div className="db-empty">
                <div className="db-empty-visual">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <line x1="10" y1="14" x2="14" y2="14" />
                    <line x1="12" y1="12" x2="12" y2="16" />
                  </svg>
                </div>
                <h3 className="db-empty-title">No consultations yet</h3>
                <p className="db-empty-desc">
                  {isLawyer()
                    ? 'Consultation bookings from clients will appear here.'
                    : 'Book your first consultation with a verified lawyer.'}
                </p>
                <Link
                  to={isLawyer() ? '/lawyer-profile-management' : '/lawyers'}
                  className="db-empty-cta"
                >
                  {isLawyer() ? 'Complete Profile' : 'Find a Lawyer'}
                </Link>
              </div>
            ) : (
              <div className="db-booking-list">
                {recentBookings.map((b, i) => {
                  const sm = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                  const lawyerName =
                    b.lawyerName || b.lawyer?.name || b.lawyer?.user?.name || '—';
                  const clientName =
                    b.userName || b.user?.name || '—';
                  const displayName = isLawyer() ? clientName : lawyerName;
                  const displayInitial =
                    displayName !== '—' ? displayName.charAt(0).toUpperCase() : '?';
                  const spec =
                    b.lawyerSpecialization || b.lawyer?.specialization || '';

                  return (
                    <div
                      key={b._id || b.id}
                      className="db-booking"
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      <div className="db-booking-avatar">
                        <span>{displayInitial}</span>
                      </div>

                      <div className="db-booking-body">
                        <div className="db-booking-top">
                          <h4 className="db-booking-name">
                            {b.title || displayName}
                          </h4>
                          <span
                            className="db-badge"
                            style={{
                              color: sm.color,
                              background: sm.bg,
                              borderColor: sm.border
                            }}
                          >
                            <span className="db-badge-dot" style={{ background: sm.color }} />
                            {sm.label}
                          </span>
                        </div>

                        {b.description && (
                          <p className="db-booking-desc">{b.description}</p>
                        )}

                        <div className="db-booking-meta">
                          <span className="db-booking-meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                            </svg>
                            {formatDate(b.date || b.bookingDate || b.scheduledDate || b.createdAt)}
                          </span>
                          {b.startTime && (
                            <span className="db-booking-meta-item">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              {b.startTime}
                            </span>
                          )}
                          {b.fee != null && (
                            <span className="db-booking-meta-item db-booking-meta-item--fee">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                              </svg>
                              ${b.fee}
                            </span>
                          )}
                          {spec && (
                            <span className="db-booking-meta-item db-booking-meta-item--spec">
                              {spec}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        to={`/booking/${b._id || b.id}`}
                        className="db-booking-arrow"
                        title="View details"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ──── RIGHT: Sidebar ──── */}
          <aside className="db-sidebar">

            {/* Quick Actions */}
            <section className="db-card">
              <div className="db-card-header">
                <div className="db-card-header-left">
                  <div className="db-card-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <h2 className="db-card-title">Quick Actions</h2>
                </div>
              </div>
              <div className="db-actions">
                {QUICK_ACTIONS.map((a, i) => (
                  <Link
                    key={a.title}
                    to={a.to}
                    className="db-action"
                    style={{
                      '--action-color': a.color,
                      animationDelay: `${i * 0.06 + 0.15}s`
                    }}
                  >
                    <div className="db-action-icon">
                      {a.icon}
                    </div>
                    <div className="db-action-text">
                      <span className="db-action-title">{a.title}</span>
                      <span className="db-action-desc">{a.desc}</span>
                    </div>
                    <svg className="db-action-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>

            {/* CTA Banner */}
            <section className="db-cta-banner">
              <div className="db-cta-glow" />
              <div className="db-cta-content">
                <div className="db-cta-icon">⚖️</div>
                <h3 className="db-cta-title">
                  {isLawyer() ? 'Grow Your Practice' : 'Need Legal Help?'}
                </h3>
                <p className="db-cta-desc">
                  {isLawyer()
                    ? 'Complete your profile to attract more clients and grow your online presence.'
                    : 'Browse 500+ verified attorneys across all practice areas.'}
                </p>
                <Link
                  to={isLawyer() ? '/lawyer-profile-management' : '/lawyers'}
                  className="db-cta-btn"
                >
                  {isLawyer() ? 'Complete Profile' : 'Browse Lawyers'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </section>

            {/* Profile Snapshot */}
            <section className="db-profile-snap">
              <div className="db-profile-snap-avatar">
                {initials}
              </div>
              <div className="db-profile-snap-info">
                <span className="db-profile-snap-name">{user?.name || 'User'}</span>
                <span className="db-profile-snap-email">{user?.email || ''}</span>
              </div>
              <Link to="/profile" className="db-profile-snap-edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;