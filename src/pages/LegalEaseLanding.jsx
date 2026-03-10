import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../components/common/Footer';
import '../Styles/legalease.css';

const LegalEaseLanding = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Mock testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Business Owner',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      content: 'Legal Ease made our corporate restructuring seamless. Their expertise and professionalism exceeded our expectations.',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Property Developer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
      content: 'Outstanding legal support for our real estate transactions. They guided us through every step with clarity and precision.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Startup Founder',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
      content: 'From contract negotiations to intellectual property protection, Legal Ease has been our trusted legal partner.',
      rating: 5
    }
  ];

  // Practice areas data
  const practiceAreas = [
    {
      id: 1,
      title: 'Corporate Law',
      description: 'Comprehensive business legal services including mergers, acquisitions, and corporate governance.',
      icon: '🏢',
      cases: '150+ Cases'
    },
    {
      id: 2,
      title: 'Real Estate Law',
      description: 'Property transactions, zoning issues, and real estate litigation services.',
      icon: '🏠',
      cases: '200+ Cases'
    },
    {
      id: 3,
      title: 'Family Law',
      description: 'Divorce, custody, adoption, and other family-related legal matters.',
      icon: '👨‍👩‍👧‍👦',
      cases: '300+ Cases'
    },
    {
      id: 4,
      title: 'Criminal Defense',
      description: 'Expert criminal defense representation for all types of criminal charges.',
      icon: '⚖️',
      cases: '180+ Cases'
    },
    {
      id: 5,
      title: 'Personal Injury',
      description: 'Fighting for fair compensation in personal injury and accident cases.',
      icon: '🩹',
      cases: '250+ Cases'
    },
    {
      id: 6,
      title: 'Employment Law',
      description: 'Workplace disputes, wrongful termination, and employment contract issues.',
      icon: '💼',
      cases: '120+ Cases'
    }
  ];

  // Statistics data
  const stats = [
    { number: '1000+', label: 'Cases Won', icon: '🏆' },
    { number: '25+', label: 'Expert Lawyers', icon: '👨‍💼' },
    { number: '15+', label: 'Years Experience', icon: '📅' },
    { number: '98%', label: 'Success Rate', icon: '📈' }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="legal-ease-landing">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Your Legal Solutions,
                <span className="hero-title-highlight"> Made Easy</span>
              </h1>
              <p className="hero-description">
                Expert legal representation with a personal touch. We simplify complex legal matters 
                and provide clear, effective solutions for individuals and businesses.
              </p>
              
              <div className="hero-features">
                <div className="hero-feature">
                  <span className="feature-icon">✓</span>
                  <span>24/7 Legal Support</span>
                </div>
                <div className="hero-feature">
                  <span className="feature-icon">✓</span>
                  <span>Expert Legal Team</span>
                </div>
                <div className="hero-feature">
                  <span className="feature-icon">✓</span>
                  <span>Proven Track Record</span>
                </div>
              </div>
              
              <div className="hero-actions">
                <Link to="/consultation" className="btn btn-primary">
                  <span>Get Free Consultation</span>
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link to="/about" className="btn btn-secondary">
                  <span>Learn More</span>
                </Link>
              </div>
            </div>
            
            <div className="hero-image">
              <div className="hero-card">
                <div className="card-content">
                  <div className="card-icon">⚖️</div>
                  <h3>Legal Excellence</h3>
                  <p>Professional legal services you can trust</p>
                  <div className="card-stats">
                    <div className="stat">
                      <span className="stat-number">98%</span>
                      <span className="stat-label">Success Rate</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">1000+</span>
                      <span className="stat-label">Cases Won</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section" id="stats" data-animate>
        <div className="container">
          <div className={`stats-grid ${isVisible.stats ? 'animate' : ''}`}>
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Areas Section */}
      <section className="practice-areas-section" id="services" data-animate>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Practice Areas</h2>
            <p className="section-description">
              Comprehensive legal services across multiple practice areas with experienced attorneys 
              dedicated to achieving the best outcomes for our clients.
            </p>
          </div>
          
          <div className={`practice-areas-grid ${isVisible.services ? 'animate' : ''}`}>
            {practiceAreas.map((area, index) => (
              <div key={area.id} className="practice-area-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="area-icon">{area.icon}</div>
                <div className="area-content">
                  <h3 className="area-title">{area.title}</h3>
                  <p className="area-description">{area.description}</p>
                  <div className="area-cases">{area.cases}</div>
                </div>
                <Link to={`/services/${area.title.toLowerCase().replace(/\s+/g, '-')}`} className="area-link">
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section" id="why-choose" data-animate>
        <div className="container">
          <div className="why-choose-content">
            <div className="why-choose-text">
              <h2 className="section-title">Why Choose Legal Ease?</h2>
              <p className="section-description">
                We combine legal expertise with innovative technology to deliver exceptional results 
                while making legal services more accessible and understandable.
              </p>
              
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <div className="feature-content">
                    <h4>Personalized Approach</h4>
                    <p>Tailored legal strategies designed specifically for your unique situation and goals.</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <div className="feature-content">
                    <h4>Fast Response Time</h4>
                    <p>Quick response to your legal needs with efficient case management and communication.</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">💡</div>
                  <div className="feature-content">
                    <h4>Innovative Solutions</h4>
                    <p>Modern technology combined with traditional legal expertise for optimal outcomes.</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">🛡️</div>
                  <div className="feature-content">
                    <h4>Trusted Protection</h4>
                    <p>Your interests are our priority with confidential and secure legal representation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="why-choose-image">
              <div className="image-placeholder">
                <div className="placeholder-content">
                  <div className="placeholder-icon">⚖️</div>
                  <h3>Legal Excellence</h3>
                  <p>Professional • Reliable • Results-Driven</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials" data-animate>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-description">
              Don't just take our word for it. Here's what our satisfied clients have to say about our legal services.
            </p>
          </div>
          
          <div className={`testimonials-container ${isVisible.testimonials ? 'animate' : ''}`}>
            <div className="testimonial-card active">
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  {renderStars(testimonials[currentTestimonial].rating)}
                </div>
                <blockquote className="testimonial-text">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="testimonial-author">
                  <img 
                    src={testimonials[currentTestimonial].image} 
                    alt={testimonials[currentTestimonial].name}
                    className="author-image"
                  />
                  <div className="author-info">
                    <div className="author-name">{testimonials[currentTestimonial].name}</div>
                    <div className="author-role">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-controls">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`control-dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Schedule your free consultation today and let our experienced legal team help you navigate 
              your legal challenges with confidence.
            </p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary btn-large">
                <span>Schedule Free Consultation</span>
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.966-7.037A8.001 8.001 0 012 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
              </Link>
              <Link to="/lawyers" className="btn btn-outline btn-large">
                <span>Browse Lawyers</span>
              </Link>
            </div>
            
            <div className="cta-contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>(555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>info@legalease.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>123 Legal St, Law City, LC 12345</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LegalEaseLanding;