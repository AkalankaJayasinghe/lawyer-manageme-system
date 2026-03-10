import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bookingAPI } from '../services/api';
import Layout from '../layout/MainLayout';
import '../styles/Cliant Dashboard.css';

const STATUS_META = {
  pending:   { label: 'Pending',   color: '#f59e0b', bg: '#fef3c7' },
  confirmed: { label: 'Confirmed', color: '#10b981', bg: '#d1fae5' },
  completed: { label: 'Completed', color: '#6366f1', bg: '#ede9fe' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fee2e2' },
  rejected:  { label: 'Rejected',  color: '#ef4444', bg: '#fee2e2' },
};

const QUICK_ACTIONS = [
  { to: '/lawyers',            icon: '🔍', title: 'Find a Lawyer',     desc: 'Search by specialization' },
  { to: '/booking-management', icon: '📅', title: 'My Consultations',  desc: 'View & manage bookings'   },
  { to: '/documents',          icon: '📂', title: 'Documents',         desc: 'Upload & view files'       },
  { to: '/messaging',          icon: '💬', title: 'Messages',          desc: 'Chat with your lawyer'     },
  { to: '/profile',            icon: '⚙️', title: 'Account Settings',  desc: 'Manage your profile'       },
  { to: '/lawyers',            icon: '⚖️', title: 'Book Consultation', desc: 'Schedule a new session'    },
];

const ClientDashboard = () => {
  const { user: authUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await bookingAPI.getUserBookings();
        setBookings(res.data || res || []);
      } catch {
        setError('Could not load bookings.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const total     = bookings.length;
  const pending   = bookings.filter(b => b.status === 'pending').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const completed = bookings.filter(b => b.status === 'completed').length;
  const recent    = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const initials  = authUser?.name ? authUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const firstName = authUser?.name?.split(' ')[0] || 'there';

  const STATS = [
    { label: 'Total Bookings', value: total,     icon: '📋', grad: 'linear-gradient(135deg,#4f46e5,#818cf8)', shadow: 'rgba(79,70,229,0.3)'  },
    { label: 'Pending',        value: pending,   icon: '⏳', grad: 'linear-gradient(135deg,#f59e0b,#fbbf24)', shadow: 'rgba(245,158,11,0.3)' },
    { label: 'Confirmed',      value: confirmed, icon: '✅', grad: 'linear-gradient(135deg,#10b981,#34d399)', shadow: 'rgba(16,185,129,0.3)' },
    { label: 'Completed',      value: completed, icon: '🏆', grad: 'linear-gradient(135deg,#6366f1,#a78bfa)', shadow: 'rgba(99,102,241,0.3)' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="cd-loading">
          <div className="cd-spinner" />
          <p>Loading your dashboard…</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="cd-wrapper">

        {/* HERO BANNER */}
        <div className="cd-hero">
          <div className="cd-hero-bg" />
          <div className="cd-hero-content">
            <div className="cd-hero-left">
              <div className="cd-avatar">{initials}</div>
              <div>
                <h1 className="cd-greeting">Good day, {firstName}! 👋</h1>
                <p className="cd-sub">Welcome to your LegalConnect dashboard</p>
              </div>
            </div>
            <Link to="/lawyers" className="cd-hero-cta">+ Book Consultation</Link>
          </div>

          <div className="cd-stats-row">
            {STATS.map(s => (
              <div
                key={s.label}
                className="cd-stat-card"
                style={{ background: s.grad, boxShadow: `0 8px 24px ${s.shadow}` }}
              >
                <span className="cd-stat-icon">{s.icon}</span>
                <div>
                  <div className="cd-stat-num">{s.value}</div>
                  <div className="cd-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="cd-main-grid">

          {/* LEFT — Recent Bookings */}
          <div className="cd-panel">
            <div className="cd-panel-header">
              <h2 className="cd-panel-title">Recent Consultations</h2>
              <Link to="/booking-management" className="cd-see-all">View All →</Link>
            </div>

            {error && <div className="cd-error">{error}</div>}

            {!error && recent.length === 0 ? (
              <div className="cd-empty">
                <div className="cd-empty-icon">📅</div>
                <p className="cd-empty-title">No consultations yet</p>
                <p className="cd-empty-sub">Book your first consultation with a verified lawyer.</p>
                <Link to="/lawyers" className="cd-empty-btn">Find a Lawyer</Link>
              </div>
            ) : (
              <div className="cd-booking-list">
                {recent.map((b) => {
                  const sm    = STATUS_META[b.status] || STATUS_META.pending;
                  const lName = b.lawyerName || b.lawyer?.name || b.lawyer?.user?.name || '—';
                  const spec  = b.lawyerSpecialization || b.lawyer?.specialization || '';
                  return (
                    <div key={b._id || b.id} className="cd-booking-row">
                      <div className="cd-booking-avatar">
                        {lName !== '—' ? lName.charAt(0).toUpperCase() : '⚖'}
                      </div>
                      <div className="cd-booking-info">
                        <div className="cd-booking-name">{lName}</div>
                        {spec && <div className="cd-booking-spec">{spec}</div>}
                        <div className="cd-booking-date">
                          {fmt(b.date || b.bookingDate || b.scheduledDate || b.createdAt)}
                          {b.timeSlot && <span className="cd-booking-time"> · {b.timeSlot}</span>}
                        </div>
                      </div>
                      <span className="cd-status-badge" style={{ color: sm.color, background: sm.bg }}>
                        {sm.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT — Sidebar */}
          <div className="cd-sidebar">

            {/* Quick Actions */}
            <div className="cd-panel">
              <div className="cd-panel-header">
                <h2 className="cd-panel-title">Quick Actions</h2>
              </div>
              <div className="cd-actions-grid">
                {QUICK_ACTIONS.map(a => (
                  <Link key={a.to + a.title} to={a.to} className="cd-action-card">
                    <span className="cd-action-icon">{a.icon}</span>
                    <div className="cd-action-title">{a.title}</div>
                    <div className="cd-action-desc">{a.desc}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Find Lawyer CTA */}
            <div className="cd-find-lawyer-card">
              <div className="cd-find-lawyer-icon">⚖️</div>
              <h3 className="cd-find-lawyer-title">Need Legal Help?</h3>
              <p className="cd-find-lawyer-sub">Browse 500+ verified attorneys across all practice areas.</p>
              <Link to="/lawyers" className="cd-find-lawyer-btn">Browse Lawyers</Link>
            </div>

            {/* Profile Summary */}
            <div className="cd-profile-card">
              <div className="cd-profile-avatar">{initials}</div>
              <div className="cd-profile-info">
                <div className="cd-profile-name">{authUser?.name || 'User'}</div>
                <div className="cd-profile-email">{authUser?.email || ''}</div>
              </div>
              <Link to="/profile" className="cd-profile-edit">Edit</Link>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientDashboard;
