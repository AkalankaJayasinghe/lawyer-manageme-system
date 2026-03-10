import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user?.role === 'lawyer') {
        navigate('/lawyer-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(formData);
      // Navigation will be handled by useEffect after login
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* ── Left Branding Panel ── */}
      <div
        className="login-split-left"
        style={{
          width: '44%',
          background: 'linear-gradient(145deg, #0f0c29 0%, #302b63 50%, #1a1a4e 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem 2.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blurred orbs */}
        <div style={{
          position: 'absolute', width: '380px', height: '380px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102,126,234,0.2) 0%, transparent 70%)',
          top: '-120px', left: '-120px', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(118,75,162,0.18) 0%, transparent 70%)',
          bottom: '-80px', right: '-60px', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: '180px', height: '180px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)',
          bottom: '28%', left: '8%', pointerEvents: 'none',
        }} />
        {/* Subtle grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px', pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '380px', width: '100%' }}>
          {/* Logo */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 32px rgba(102,126,234,0.45)',
            fontSize: '2rem',
          }}>
            ⚖️
          </div>

          <h1 style={{
            fontSize: '2.4rem', fontWeight: 800, color: '#ffffff',
            marginBottom: '0.4rem', letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
            Legal<span style={{
              background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Connect</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.55)', fontSize: '1rem',
            marginBottom: '2.5rem', lineHeight: 1.6,
          }}>
            Your trusted partner in legal solutions
          </p>

          {/* Feature Cards */}
          {[
            { icon: '🔒', title: 'Verified Attorneys', desc: 'Licensed & background-checked professionals' },
            { icon: '📋', title: 'Case Management', desc: 'Organize documents and track your cases' },
            { icon: '💬', title: 'Live Consultations', desc: 'Real-time messaging with your lawyer' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              borderRadius: '0.875rem',
              padding: '0.875rem 1.125rem',
              marginBottom: '0.75rem',
              border: '1px solid rgba(255,255,255,0.09)',
              textAlign: 'left',
              transition: 'background 0.2s',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(102,126,234,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div>
                <div style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 600 }}>{f.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', marginTop: '1px' }}>{f.desc}</div>
              </div>
            </div>
          ))}

          {/* Stats Row */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '0',
            marginTop: '2rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '0.875rem',
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}>
            {[['500+', 'Lawyers'], ['10K+', 'Clients'], ['98%', 'Satisfaction']].map(([num, label], i) => (
              <div key={label} style={{
                flex: 1, textAlign: 'center', padding: '1rem 0.5rem',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{
                  fontSize: '1.4rem', fontWeight: 800,
                  background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {num}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        background: '#f8faff',
        position: 'relative',
        overflowY: 'auto',
      }}>
        {/* Top-right account link */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
          New here?{' '}
          <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>
            Create account →
          </Link>
        </div>

        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Heading */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '2rem', fontWeight: 800, color: '#111827',
              marginBottom: '0.375rem', letterSpacing: '-0.02em',
            }}>
              Welcome back 👋
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Sign in to continue to your LegalConnect account
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              background: '#fff1f2', border: '1px solid #fca5a5',
              borderRadius: '0.75rem', padding: '0.875rem 1rem',
              color: '#b91c1c', fontSize: '0.875rem', marginBottom: '1.5rem',
            }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block', fontSize: '0.875rem', fontWeight: 600,
                color: '#374151', marginBottom: '0.5rem',
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '0.875rem', top: '50%',
                  transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none',
                }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%', paddingLeft: '2.75rem', paddingRight: '1rem',
                    height: '2.875rem', border: '2px solid #e5e7eb', borderRadius: '0.75rem',
                    fontSize: '0.95rem', outline: 'none', background: 'white',
                    transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
                    color: '#111827',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block', fontSize: '0.875rem', fontWeight: 600,
                color: '#374151', marginBottom: '0.5rem',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '0.875rem', top: '50%',
                  transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none',
                }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: '100%', paddingLeft: '2.75rem', paddingRight: '3rem',
                    height: '2.875rem', border: '2px solid #e5e7eb', borderRadius: '0.75rem',
                    fontSize: '0.95rem', outline: 'none', background: 'white',
                    transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
                    color: '#111827',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.875rem', top: '50%',
                    transform: 'translateY(-50%)', background: 'none', border: 'none',
                    cursor: 'pointer', color: '#9ca3af', padding: 0,
                    display: 'flex', alignItems: 'center',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot Password */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '1.75rem',
            }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                cursor: 'pointer', fontSize: '0.875rem', color: '#374151',
              }}>
                <input
                  type="checkbox"
                  name="remember-me"
                  style={{ accentColor: '#4f46e5', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                style={{ fontSize: '0.875rem', color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '0.9rem',
                background: isLoading
                  ? 'linear-gradient(135deg, #818cf8, #a78bfa)'
                  : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white', border: 'none', borderRadius: '0.75rem',
                fontSize: '1rem', fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(79,70,229,0.35)',
                letterSpacing: '0.01em',
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24"
                    style={{ animation: 'loginSpin 0.8s linear infinite' }}
                  >
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" />
                    <path d="M12 2 A10 10 0 0 1 22 12" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0 1.25rem' }}>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                or continue with
              </span>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            </div>

            {/* Social Login */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                {
                  label: 'Google',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  ),
                },
                {
                  label: 'Microsoft',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#f25022" d="M0 0h11v11H0z" />
                      <path fill="#00a4ef" d="M13 0h11v11H13z" />
                      <path fill="#7fba00" d="M0 13h11v11H0z" />
                      <path fill="#ffb900" d="M13 13h11v11H13z" />
                    </svg>
                  ),
                },
              ].map(({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '0.625rem', padding: '0.75rem',
                    background: 'white', border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem', fontSize: '0.9rem', fontWeight: 600,
                    color: '#374151', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </form>

          {/* Bottom sign-up link */}
          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <div style={{
          position: 'absolute', bottom: '1.25rem',
          left: 0, right: 0, textAlign: 'center',
          color: '#d1d5db', fontSize: '0.72rem',
        }}>
          © {new Date().getFullYear()} LegalConnect · All rights reserved
        </div>
      </div>

      {/* Spinner keyframe + responsive helpers */}
      <style>{`
        @keyframes loginSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .login-split-left { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;