import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../components/common/Footer';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../Styles/lawyer-profile.css';

const LawyerProfilePage = () => {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock lawyer data - replace with API call
  const mockLawyer = {
    id: parseInt(id),
    name: 'Sarah Johnson',
    specialties: ['Family Law', 'Divorce', 'Child Custody'],
    location: 'New York, NY',
    rating: 4.9,
    reviewCount: 127,
    experienceYears: 12,
    consultationFee: 250,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio: 'Experienced family law attorney specializing in divorce and child custody cases. I am dedicated to helping families navigate through difficult times with compassion and expertise.',
    education: 'Harvard Law School',
    languages: ['English', 'Spanish'],
    verified: true,
    available: true,
    barNumber: 'NY12345678',
    practiceAreas: ['Family Law', 'Divorce Law', 'Child Custody', 'Alimony & Support'],
    education_details: [
      { degree: 'Juris Doctor', school: 'Harvard Law School', year: '2011' },
      { degree: 'Bachelor of Arts', school: 'Columbia University', year: '2008' }
    ],
    certifications: ['Board Certified Family Law Attorney', 'Mediator Certification'],
    experience: [
      { position: 'Senior Partner', firm: 'Johnson & Associates', years: '2018 - Present' },
      { position: 'Associate Attorney', firm: 'Miller Law Group', years: '2011 - 2018' }
    ],
    reviews: [
      {
        id: 1,
        clientName: 'John D.',
        rating: 5,
        date: '2024-01-15',
        comment: 'Sarah was incredibly helpful during my divorce proceedings. Professional and caring.'
      },
      {
        id: 2,
        clientName: 'Maria S.',
        rating: 5,
        date: '2024-01-10',
        comment: 'Excellent attorney. Helped me with child custody case. Highly recommended!'
      }
    ],
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'sarah@johnsonlaw.com',
      address: '123 Legal Street, New York, NY 10001'
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLawyer(mockLawyer);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="lawyer-profile-page">
        <Header />
        <LoadingSpinner message="Loading lawyer profile..." />
        <Footer />
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="lawyer-profile-page">
        <Header />
        <div className="container">
          <div className="not-found">
            <h2>Lawyer not found</h2>
            <Link to="/lawyers" className="btn btn-primary">Back to Lawyers</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="lawyer-profile-page">
      <Header />
      
      {/* Profile Header */}
      <section className="profile-header">
        <div className="container">
          <div className="profile-hero">
            <div className="profile-image">
              <img src={lawyer.avatar} alt={lawyer.name} />
              {lawyer.verified && (
                <div className="verified-badge">
                  <svg className="verified-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="profile-info">
              <h1 className="lawyer-name">{lawyer.name}</h1>
              <div className="lawyer-specialties">
                {lawyer.specialties.map(specialty => (
                  <span key={specialty} className="specialty-tag">{specialty}</span>
                ))}
              </div>
              
              <StarRating rating={lawyer.rating} reviewCount={lawyer.reviewCount} />
              
              <div className="profile-details">
                <div className="detail-item">
                  <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{lawyer.location}</span>
                </div>
                <div className="detail-item">
                  <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>{lawyer.experienceYears} years experience</span>
                </div>
                <div className="detail-item">
                  <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span>${lawyer.consultationFee}/hour</span>
                </div>
              </div>
            </div>
            
            <div className="profile-actions">
              <span className={`availability ${lawyer.available ? 'available' : 'busy'}`}>
                {lawyer.available ? 'Available Now' : 'Currently Busy'}
              </span>
              <Link 
                to={`/booking/${lawyer.id}`} 
                className={`btn btn-primary btn-large ${!lawyer.available ? 'disabled' : ''}`}
              >
                Book Consultation
              </Link>
              <button className="btn btn-secondary btn-large">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="profile-content">
        <div className="container">
          <div className="content-layout">
            {/* Main Content */}
            <div className="main-content">
              {/* Tabs */}
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`tab ${activeTab === 'experience' ? 'active' : ''}`}
                  onClick={() => setActiveTab('experience')}
                >
                  Experience
                </button>
                <button 
                  className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({lawyer.reviewCount})
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="overview-content">
                    <div className="section">
                      <h3>About</h3>
                      <p>{lawyer.bio}</p>
                    </div>
                    
                    <div className="section">
                      <h3>Practice Areas</h3>
                      <div className="practice-areas">
                        {lawyer.practiceAreas.map(area => (
                          <span key={area} className="practice-area-tag">{area}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="section">
                      <h3>Languages</h3>
                      <div className="languages">
                        {lawyer.languages.map(language => (
                          <span key={language} className="language-tag">{language}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="experience-content">
                    <div className="section">
                      <h3>Education</h3>
                      <div className="education-list">
                        {lawyer.education_details.map((edu, index) => (
                          <div key={index} className="education-item">
                            <h4>{edu.degree}</h4>
                            <p>{edu.school} • {edu.year}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="section">
                      <h3>Professional Experience</h3>
                      <div className="experience-list">
                        {lawyer.experience.map((exp, index) => (
                          <div key={index} className="experience-item">
                            <h4>{exp.position}</h4>
                            <p>{exp.firm} • {exp.years}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="section">
                      <h3>Certifications</h3>
                      <div className="certifications">
                        {lawyer.certifications.map(cert => (
                          <span key={cert} className="certification-tag">{cert}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="reviews-content">
                    <div className="reviews-summary">
                      <div className="rating-overview">
                        <div className="rating-score">{lawyer.rating}</div>
                        <StarRating rating={lawyer.rating} reviewCount={lawyer.reviewCount} />
                      </div>
                    </div>
                    
                    <div className="reviews-list">
                      {lawyer.reviews.map(review => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <div className="reviewer-info">
                              <span className="reviewer-name">{review.clientName}</span>
                              <span className="review-date">{review.date}</span>
                            </div>
                            <StarRating rating={review.rating} showCount={false} size="small" />
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              <div className="contact-card">
                <h3>Contact Information</h3>
                <div className="contact-item">
                  <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>{lawyer.contact.phone}</span>
                </div>
                <div className="contact-item">
                  <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>{lawyer.contact.email}</span>
                </div>
                <div className="contact-item">
                  <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{lawyer.contact.address}</span>
                </div>
              </div>
              
              <div className="quick-facts">
                <h3>Quick Facts</h3>
                <div className="fact-item">
                  <span className="fact-label">Bar Number:</span>
                  <span className="fact-value">{lawyer.barNumber}</span>
                </div>
                <div className="fact-item">
                  <span className="fact-label">Years of Practice:</span>
                  <span className="fact-value">{lawyer.experienceYears} years</span>
                </div>
                <div className="fact-item">
                  <span className="fact-label">Consultation Fee:</span>
                  <span className="fact-value">${lawyer.consultationFee}/hour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LawyerProfilePage;
