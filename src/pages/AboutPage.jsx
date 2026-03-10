import React from 'react';
import Header from '../layout/Header';
import Footer from '../components/common/Footer';
import '../Styles/about.css';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Sarah Mitchell',
      role: 'CEO & Founder',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-ceo',
      bio: 'Former lawyer with 15 years of experience in legal practice and technology.'
    },
    {
      name: 'David Chen',
      role: 'CTO',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david-cto',
      bio: 'Tech industry veteran focused on building scalable legal technology solutions.'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Head of Legal Affairs',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria-legal',
      bio: 'Expert in legal compliance and attorney relations with 12 years of experience.'
    }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Accessibility',
      description: 'Making legal services accessible to everyone, regardless of location or background.'
    },
    {
      icon: '🔒',
      title: 'Trust & Security',
      description: 'Maintaining the highest standards of security and confidentiality for all interactions.'
    },
    {
      icon: '⚖️',
      title: 'Justice',
      description: 'Ensuring fair access to quality legal representation for all members of our community.'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'Continuously improving our platform to better serve lawyers and clients alike.'
    }
  ];

  return (
    <div className="about-page">
      <Header />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>About LegalEase</h1>
            <p className="hero-subtitle">
              We're revolutionizing how people connect with legal professionals, 
              making quality legal services accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                At LegalEase, we believe that everyone deserves access to quality legal representation. 
                Our platform bridges the gap between those who need legal help and experienced attorneys 
                who can provide it.
              </p>
              <p>
                We're committed to creating a transparent, efficient, and user-friendly environment 
                where clients can find the right lawyer for their specific needs, and where lawyers 
                can build meaningful relationships with clients who need their expertise.
              </p>
            </div>
            <div className="mission-image">
              <div className="image-placeholder">
                <span className="placeholder-icon">⚖️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
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
              <div className="stat-number">99%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <p>The people behind LegalEase</p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <img src={member.image} alt={member.name} className="team-image" />
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Getting legal help has never been easier</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Search & Browse</h3>
                <p>Browse our extensive directory of verified lawyers and filter by practice area, location, and more.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Review & Compare</h3>
                <p>Read lawyer profiles, reviews, and ratings to find the perfect match for your legal needs.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Book & Connect</h3>
                <p>Schedule a consultation and start working with your chosen lawyer to resolve your legal matter.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;