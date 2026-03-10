import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../components/common/Footer';
import '../Styles/landing.css';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      icon: '🛡️',
      title: "Secure Authentication",
      description: "JWT-based authentication with role-based access control for users, lawyers, and admins."
    },
    {
      icon: '👥',
      title: "Profile Management",
      description: "Comprehensive profile management for both clients and legal professionals."
    },
    {
      icon: '📅',
      title: "Smart Booking System",
      description: "Advanced appointment scheduling with real-time availability and automated reminders."
    },
    {
      icon: '💬',
      title: "Real-time Communication",
      description: "Secure messaging system with instant notifications and file sharing capabilities."
    },
    {
      icon: '📄',
      title: "Document Management",
      description: "Upload, share, and manage legal documents with version control and security."
    },
    {
      icon: '🏆',
      title: "Professional Verification",
      description: "Verified lawyer profiles with credentials, specializations, and client reviews."
    }
  ];

  const stats = [
    { label: "Active Lawyers", value: "2,500+", icon: "👥" },
    { label: "Cases Handled", value: "15,000+", icon: "📄" },
    { label: "Client Satisfaction", value: "98%", icon: "⭐" },
    { label: "Response Time", value: "< 2hrs", icon: "⏰" }
  ];

  const practiceAreas = [
    "Criminal Law", "Civil Law", "Corporate Law", "Family Law", 
    "Immigration Law", "Personal Injury", "Real Estate Law", "Employment Law"
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: "Search & Browse",
      description: "Search through our network of verified lawyers by practice area, location, or expertise."
    },
    {
      step: 2,
      title: "Book Consultation",
      description: "Schedule a consultation at your convenience with secure online booking and payment."
    },
    {
      step: 3,
      title: "Get Legal Help",
      description: "Receive professional legal advice and ongoing support through our secure platform."
    }
  ];

  return (
    <div className="landing-page">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">⚖️</span>
              <span className="badge-text">Professional Legal Services Platform</span>
            </div>
            
            <h1 className="hero-title">
              Connect with
              <span className="hero-accent">Qualified Lawyers</span>
            </h1>
            
            <p className="hero-description">
              Find experienced legal professionals, book consultations, and manage your cases 
              all in one secure, user-friendly platform.
            </p>

            {/* Search Bar */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search by practice area, location, or lawyer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button className="search-icon">🔍</button>
              </div>
              <Link to="/lawyers" className="search-button">
                Find Lawyers
              </Link>
            </div>

            {/* Hero Buttons */}
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">
                Get Started
                <span className="btn-icon">→</span>
              </Link>
              <Link to="/lawyers" className="btn-secondary">
                Browse Lawyers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <span>{stat.icon}</span>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Comprehensive Legal Management Platform
            </h2>
            <p className="section-description">
              Everything you need to connect with lawyers, manage consultations, 
              and handle legal matters efficiently.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <span>{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="practice-areas-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Practice Areas We Cover
            </h2>
            <p className="section-description">
              Find specialized lawyers across all major areas of law
            </p>
          </div>

          <div className="practice-areas-grid">
            {practiceAreas.map((area, index) => (
              <div key={index} className="practice-area-badge">
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              How It Works
            </h2>
            <p className="section-description">
              Get legal help in three simple steps
            </p>
          </div>

          <div className="steps-grid">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">
                  {step.step}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Get Legal Help?
            </h2>
            <p className="cta-description">
              Join thousands of clients who trust our platform for their legal needs. 
              Get started today and connect with qualified lawyers instantly.
            </p>

            <div className="cta-buttons">
              <Link to="/register" className="btn-primary">
                Create Account
                <span className="btn-icon">→</span>
              </Link>
              <Link to="/lawyers" className="btn-secondary">
                View All Lawyers
              </Link>
            </div>

            <div className="cta-features">
              <div className="cta-feature">
                <span className="feature-check">✓</span>
                <span>Verified Lawyers</span>
              </div>
              <div className="cta-feature">
                <span className="feature-check">✓</span>
                <span>Secure Platform</span>
              </div>
              <div className="cta-feature">
                <span className="feature-check">✓</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;