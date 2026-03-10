// Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../layout/Header';
import Footer from '../components/common/Footer';
import './Register.css';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { register, isLoading, error, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') navigate('/admin-dashboard');
      else if (user?.role === 'lawyer') navigate('/lawyer-dashboard');
      else navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(
      formData.phone.replace(/[\s\-()]/g, '')
    )) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    try {
      const { confirmPassword: _confirmPassword, ...registerData } = formData;
      await register(registerData);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return { text: 'Weak', color: '#ef4444' };
    if (passwordStrength <= 2) return { text: 'Fair', color: '#f59e0b' };
    if (passwordStrength <= 3) return { text: 'Good', color: '#3b82f6' };
    return { text: 'Strong', color: '#10b981' };
  };

  return (
    <div className="register-page">
      <Header />
      <main className="register-main">
        {/* Background Decorations */}
        <div className="register-bg-decoration">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
        </div>

        <div className="register-container">
          {/* Left Panel - Branding */}
          <div className="register-branding">
            <div className="branding-content">
              <div className="branding-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 className="branding-title">Join LegalConnect</h1>
              <p className="branding-subtitle">
                Connect with top legal professionals and get the
                help you need, when you need it.
              </p>

              <div className="branding-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <span>Access to 500+ verified lawyers</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <span>Secure & confidential consultations</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <span>Book appointments in minutes</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <span>24/7 support available</span>
                </div>
              </div>

              <div className="branding-testimonial">
                <p className="testimonial-text">
                  "LegalConnect made finding the right lawyer incredibly
                  easy. Highly recommend!"
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">JD</div>
                  <div>
                    <p className="author-name">Jane Doe</p>
                    <p className="author-role">Small Business Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="register-form-panel">
            <div className="form-content">
              {/* Progress Steps */}
              <div className="step-progress">
                <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                  <div className="step-number">
                    {step > 1 ? (
                      <svg width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : '1'}
                  </div>
                  <span className="step-label">Personal Info</span>
                </div>
                <div className={`step-line ${step > 1 ? 'active' : ''}`}></div>
                <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <span className="step-label">Security</span>
                </div>
              </div>

              <div className="form-header">
                <h2 className="form-title">
                  {step === 1 ? 'Personal Information' : 'Create Your Password'}
                </h2>
                <p className="form-subtitle">
                  {step === 1
                    ? 'Tell us a bit about yourself to get started'
                    : 'Set a strong password to protect your account'}
                </p>
              </div>

              {error && (
                <div className="alert alert-error">
                  <svg className="alert-icon" width="20" height="20"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Step 1 */}
                {step === 1 && (
                  <div className="form-step fade-in">
                    {/* Role Selection */}
                    <div className="role-selector">
                      <label className="role-label">I am a:</label>
                      <div className="role-options">
                        <button
                          type="button"
                          className={`role-option ${
                            formData.role === 'user' ? 'selected' : ''
                          }`}
                          onClick={() => setFormData(prev => ({
                            ...prev, role: 'user'
                          }))}
                        >
                          <div className="role-option-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                          <span className="role-option-label">Client</span>
                          <span className="role-option-desc">
                            Looking for legal help
                          </span>
                        </button>
                        <button
                          type="button"
                          className={`role-option ${
                            formData.role === 'lawyer' ? 'selected' : ''
                          }`}
                          onClick={() => setFormData(prev => ({
                            ...prev, role: 'lawyer'
                          }))}
                        >
                          <div className="role-option-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M3 6l9-4 9 4M3 6v8l9 4 9-4V6" />
                              <path d="M3 10l9 4 9-4" />
                            </svg>
                          </div>
                          <span className="role-option-label">Lawyer</span>
                          <span className="role-option-desc">
                            Offering legal services
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Name Field */}
                    <div className="form-field">
                      <label htmlFor="name" className="field-label">
                        Full Name <span className="required">*</span>
                      </label>
                      <div className={`field-input-wrapper ${
                        errors.name ? 'has-error' : ''
                      } ${formData.name ? 'has-value' : ''}`}>
                        <svg className="field-icon" width="18" height="18"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          className="field-input"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {formData.name && !errors.name && (
                          <svg className="field-check" width="18" height="18"
                            viewBox="0 0 24 24" fill="none"
                            stroke="#10b981" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      {errors.name && (
                        <span className="field-error">{errors.name}</span>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="form-field">
                      <label htmlFor="email" className="field-label">
                        Email Address <span className="required">*</span>
                      </label>
                      <div className={`field-input-wrapper ${
                        errors.email ? 'has-error' : ''
                      } ${formData.email && !errors.email ? 'has-value' : ''}`}>
                        <svg className="field-icon" width="18" height="18"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="M22 7l-10 7L2 7" />
                        </svg>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="field-input"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {formData.email && !errors.email && (
                          <svg className="field-check" width="18" height="18"
                            viewBox="0 0 24 24" fill="none"
                            stroke="#10b981" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      {errors.email && (
                        <span className="field-error">{errors.email}</span>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="form-field">
                      <label htmlFor="phone" className="field-label">
                        Phone Number
                        <span className="optional-badge">Optional</span>
                      </label>
                      <div className={`field-input-wrapper ${
                        errors.phone ? 'has-error' : ''
                      }`}>
                        <svg className="field-icon" width="18" height="18"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          className="field-input"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.phone && (
                        <span className="field-error">{errors.phone}</span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-full"
                      onClick={handleNext}
                    >
                      Continue
                      <svg width="18" height="18" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="form-step fade-in">
                    {/* Password Field */}
                    <div className="form-field">
                      <label htmlFor="password" className="field-label">
                        Password <span className="required">*</span>
                      </label>
                      <div className={`field-input-wrapper ${
                        errors.password ? 'has-error' : ''
                      }`}>
                        <svg className="field-icon" width="18" height="18"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          className="field-input"
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <span className="field-error">{errors.password}</span>
                      )}

                      {/* Password Strength */}
                      {formData.password && (
                        <div className="password-strength">
                          <div className="strength-bars">
                            {[1, 2, 3, 4, 5].map(level => (
                              <div
                                key={level}
                                className={`strength-bar ${
                                  level <= passwordStrength ? 'filled' : ''
                                }`}
                                style={{
                                  backgroundColor: level <= passwordStrength
                                    ? getStrengthLabel().color : '#e5e7eb'
                                }}
                              />
                            ))}
                          </div>
                          <span
                            className="strength-label"
                            style={{ color: getStrengthLabel().color }}
                          >
                            {getStrengthLabel().text}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-field">
                      <label htmlFor="confirmPassword" className="field-label">
                        Confirm Password <span className="required">*</span>
                      </label>
                      <div className={`field-input-wrapper ${
                        errors.confirmPassword ? 'has-error' : ''
                      } ${formData.confirmPassword &&
                          formData.password === formData.confirmPassword
                        ? 'has-value' : ''}`}>
                        <svg className="field-icon" width="18" height="18"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="field-input"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                        {formData.confirmPassword &&
                          formData.password === formData.confirmPassword && (
                          <svg className="field-check" width="18" height="18"
                            viewBox="0 0 24 24" fill="none"
                            stroke="#10b981" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      {errors.confirmPassword && (
                        <span className="field-error">
                          {errors.confirmPassword}
                        </span>
                      )}
                    </div>

                    {/* Terms */}
                    <div className="terms-wrapper">
                      <label className="terms-label">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="terms-checkbox"
                        />
                        <span className="custom-checkbox">
                          {agreeTerms && (
                            <svg width="12" height="12" viewBox="0 0 24 24"
                              fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span className="terms-text">
                          I agree to the{' '}
                          <Link to="/terms" className="terms-link">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="terms-link">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                      {errors.terms && (
                        <span className="field-error">{errors.terms}</span>
                      )}
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleBack}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary btn-grow"
                      >
                        {isLoading ? (
                          <div className="btn-loading">
                            <div className="spinner"></div>
                            Creating account...
                          </div>
                        ) : (
                          <>
                            Create Account
                            <svg width="18" height="18" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>

              <div className="form-footer">
                <p className="form-footer-text">
                  Already have an account?{' '}
                  <Link to="/login" className="form-footer-link">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;