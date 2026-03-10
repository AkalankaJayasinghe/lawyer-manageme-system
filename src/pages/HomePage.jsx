import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../components/common/Footer';
import '../styles/modern-home.css';

const HomePage = () => {
  const featuredLawyers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      specialty: 'Family Law',
      rating: 4.9,
      reviewCount: 127,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
    },
    {
      id: 2,
      name: 'Michael Chen',
      specialty: 'Corporate Law',
      rating: 4.8,
      reviewCount: 95,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael'
    },
    {
      id: 5,
      name: 'Jennifer Kim',
      specialty: 'Immigration Law',
      rating: 4.9,
      reviewCount: 156,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer'
    }
  ];

  const practiceAreas = [
    { name: 'Family Law', icon: '👨‍👩‍👧‍👦', description: 'Divorce, custody, adoption' },
    { name: 'Corporate Law', icon: '🏢', description: 'Business formation, contracts' },
    { name: 'Criminal Law', icon: '⚖️', description: 'Defense, appeals, representation' },
    { name: 'Personal Injury', icon: '🩹', description: 'Accidents, compensation claims' },
    { name: 'Immigration Law', icon: '🌍', description: 'Visas, citizenship, deportation' },
    { name: 'Real Estate Law', icon: '🏠', description: 'Property transactions, disputes' }
  ];

  return (
    <div className="home-page">
      <Header />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Find Your Perfect Lawyer</h1>
              <p className="hero-subtitle">
                Connect with experienced attorneys and get expert legal advice for your specific needs.
              </p>
              <div className="hero-actions">
                <Link to="/lawyers" className="btn btn-primary btn-large">
                  Find a Lawyer
                </Link>
              </div>
              <div className="hero-features">
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Verified Attorneys</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Secure Platform</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Easy Booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="practice-areas">
        <div className="container">
          <div className="section-header">
            <h2>Practice Areas</h2>
            <p>Find lawyers specialized in your specific legal needs</p>
          </div>
          <div className="areas-grid">
            {practiceAreas.map((area, index) => (
              <div key={index} className="area-card">
                <div className="area-icon">{area.icon}</div>
                <h3>{area.name}</h3>
                <p>{area.description}</p>
                <Link to={`/lawyers?specialty=${encodeURIComponent(area.name)}`} className="area-link">
                  Find Lawyers →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get legal help in three simple steps</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Search & Browse</h3>
                <p>Browse our directory of verified lawyers and find the right attorney for your legal needs.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Book Consultation</h3>
                <p>Schedule a consultation at your convenience. Choose from in-person or virtual meetings.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Legal Help</h3>
                <p>Work with your chosen attorney to resolve your legal matters efficiently and effectively.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Lawyers */}
      <section className="featured-lawyers">
        <div className="container">
          <div className="section-header">
            <h2>Top Rated Lawyers</h2>
            <p>Highly recommended attorneys ready to help you</p>
          </div>
          <div className="lawyers-showcase">
            {featuredLawyers.map(lawyer => (
              <div key={lawyer.id} className="lawyer-showcase-card">
                <img src={lawyer.avatar} alt={lawyer.name} className="lawyer-avatar" />
                <div className="lawyer-info">
                  <h3>{lawyer.name}</h3>
                  <p className="specialty">{lawyer.specialty}</p>
                  <div className="rating">
                    <span className="stars">★★★★★</span>
                    <span>{lawyer.rating} ({lawyer.reviewCount} reviews)</span>
                  </div>
                  <Link to={`/lawyers/${lawyer.id}`} className="btn btn-outline">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="section-footer">
            <Link to="/lawyers" className="btn btn-primary">
              View All Lawyers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Verified Lawyers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Happy Clients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Practice Areas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
