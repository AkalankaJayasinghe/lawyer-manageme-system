import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../common/StarRating';
import '../../styles/modern-lawyer-card.css';

const LawyerCard = ({ lawyer }) => {
  const isPremium = lawyer.rating >= 4.8;
  const specialtyClass = lawyer.specialties?.[0]?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`lawyer-card ${isPremium ? 'premium' : ''}`}>
      <div className="lawyer-card-header">
        <img 
          src={lawyer.avatar} 
          alt={lawyer.name}
          className="lawyer-avatar"
          loading="lazy"
        />
        <div className="lawyer-status">
          {lawyer.verified && (
            <span className="verified-badge">
              <svg className="verified-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
          <span className={`availability-badge ${lawyer.available ? 'available' : 'busy'}`}>
            <span className="status-dot"></span>
            {lawyer.available ? 'Available' : 'Busy'}
          </span>
        </div>
      </div>

      <div className="lawyer-card-body">
        <h3 className="lawyer-name">{lawyer.name}</h3>
        
        <div className="lawyer-specialties">
          {lawyer.specialties.slice(0, 2).map(specialty => {
            const specialtyClass = specialty.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            return (
              <span key={specialty} className={`specialty-tag ${specialtyClass}`}>
                {specialty}
              </span>
            );
          })}
          {lawyer.specialties.length > 2 && (
            <span className="specialty-tag more">
              +{lawyer.specialties.length - 2} more
            </span>
          )}
        </div>

        <StarRating 
          rating={lawyer.rating} 
          reviewCount={lawyer.reviewCount}
        />

        <div className="lawyer-details">
          <div className="detail-item">
            <svg className="detail-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{lawyer.location}</span>
          </div>
          <div className="detail-item">
            <svg className="detail-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{lawyer.experienceYears} years experience</span>
          </div>
          <div className="detail-item">
            <svg className="detail-icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.75 2.524z" />
            </svg>
            <span>{lawyer.education}</span>
          </div>
        </div>

        <p className="lawyer-bio">{lawyer.bio}</p>

        <div className="lawyer-card-footer">
          <div className="consultation-fee">
            <span className="fee-label">Consultation</span>
            <span className="fee-amount">${lawyer.consultationFee}/hr</span>
          </div>
          
          <div className="lawyer-actions">
            <Link 
              to={`/lawyers/${lawyer.id}`} 
              className="btn btn-secondary"
            >
              View Profile
            </Link>
            <Link 
              to={`/booking/${lawyer.id}`} 
              className={`btn btn-primary ${!lawyer.available ? 'disabled' : ''}`}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerCard;
