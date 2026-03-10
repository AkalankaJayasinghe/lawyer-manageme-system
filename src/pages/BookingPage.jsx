import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../styles/booking.css';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState('video');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    caseDescription: '',
    urgency: 'normal'
  });

  // Mock lawyer data
  const mockLawyer = {
    id: parseInt(id),
    name: 'Sarah Johnson',
    specialties: ['Family Law', 'Divorce'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    consultationFee: 250,
    available: true
  };

  // Mock available time slots
  const availableSlots = {
    '2024-02-15': ['09:00', '10:30', '14:00', '15:30'],
    '2024-02-16': ['09:00', '11:00', '13:00', '16:00'],
    '2024-02-17': ['10:00', '14:30', '16:30'],
    '2024-02-18': ['09:30', '11:30', '15:00'],
    '2024-02-19': ['09:00', '10:00', '14:00', '17:00']
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLawyer(mockLawyer);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time');
      return;
    }

    // Mock booking submission
    const bookingData = {
      lawyerId: lawyer.id,
      date: selectedDate,
      time: selectedTime,
      type: consultationType,
      client: formData
    };

    console.log('Booking submitted:', bookingData);
    
    // Simulate API call
    setTimeout(() => {
      alert('Consultation booked successfully!');
      navigate('/');
    }, 1000);
  };

  const getNextDays = (count = 5) => {
    const days = [];
    const today = new Date();
    
    for (let i = 1; i <= count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    
    return days;
  };

  if (loading) {
    return (
      <div className="booking-page">
        <Header />
        <LoadingSpinner message="Loading booking information..." />
        <Footer />
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="booking-page">
        <Header />
        <div className="container">
          <div className="not-found">
            <h2>Lawyer not found</h2>
            <button onClick={() => navigate('/lawyers')} className="btn btn-primary">
              Back to Lawyers
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="booking-page">
      <Header />
      
      <div className="container">
        <div className="booking-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <h1>Book Consultation</h1>
        </div>

        <div className="booking-layout">
          {/* Lawyer Info Sidebar */}
          <div className="lawyer-info-card">
            <div className="lawyer-summary">
              <img src={lawyer.avatar} alt={lawyer.name} className="lawyer-avatar" />
              <div className="lawyer-details">
                <h3>{lawyer.name}</h3>
                <div className="specialties">
                  {lawyer.specialties.map(specialty => (
                    <span key={specialty} className="specialty-tag">{specialty}</span>
                  ))}
                </div>
                <div className="consultation-fee">
                  <span className="fee-amount">${lawyer.consultationFee}/hour</span>
                </div>
              </div>
            </div>

            <div className="consultation-types">
              <h4>Consultation Type</h4>
              <div className="type-options">
                <label className={`type-option ${consultationType === 'video' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="consultationType"
                    value="video"
                    checked={consultationType === 'video'}
                    onChange={(e) => setConsultationType(e.target.value)}
                  />
                  <span className="option-content">
                    <span className="option-icon">📹</span>
                    <span className="option-text">Video Call</span>
                  </span>
                </label>
                <label className={`type-option ${consultationType === 'phone' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="consultationType"
                    value="phone"
                    checked={consultationType === 'phone'}
                    onChange={(e) => setConsultationType(e.target.value)}
                  />
                  <span className="option-content">
                    <span className="option-icon">📞</span>
                    <span className="option-text">Phone Call</span>
                  </span>
                </label>
                <label className={`type-option ${consultationType === 'office' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="consultationType"
                    value="office"
                    checked={consultationType === 'office'}
                    onChange={(e) => setConsultationType(e.target.value)}
                  />
                  <span className="option-content">
                    <span className="option-icon">🏢</span>
                    <span className="option-text">In Office</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="booking-form-container">
            <form onSubmit={handleSubmit} className="booking-form">
              {/* Date Selection */}
              <div className="form-section">
                <h3>Select Date & Time</h3>
                <div className="date-selection">
                  {getNextDays().map(date => (
                    <button
                      key={date}
                      type="button"
                      className={`date-option ${selectedDate === date ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime(''); // Reset time when date changes
                      }}
                    >
                      <span className="date-day">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="date-number">
                        {new Date(date).toLocaleDateString('en-US', { day: 'numeric' })}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedDate && (
                  <div className="time-selection">
                    <h4>Available Times</h4>
                    <div className="time-slots">
                      {(availableSlots[selectedDate] || []).map(time => (
                        <button
                          key={time}
                          type="button"
                          className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Client Information */}
              <div className="form-section">
                <h3>Your Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Case Details */}
              <div className="form-section">
                <h3>Case Details</h3>
                <div className="form-group">
                  <label>Urgency Level</label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low - General consultation</option>
                    <option value="normal">Normal - Standard legal matter</option>
                    <option value="high">High - Time-sensitive issue</option>
                    <option value="urgent">Urgent - Immediate attention needed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Brief Description of Your Case *</label>
                  <textarea
                    name="caseDescription"
                    value={formData.caseDescription}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Please provide a brief overview of your legal matter..."
                    required
                  />
                </div>
              </div>

              {/* Summary & Submit */}
              <div className="form-section">
                <div className="booking-summary">
                  <h3>Booking Summary</h3>
                  <div className="summary-details">
                    <div className="summary-item">
                      <span>Date:</span>
                      <span>{selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Not selected'}</span>
                    </div>
                    <div className="summary-item">
                      <span>Time:</span>
                      <span>{selectedTime || 'Not selected'}</span>
                    </div>
                    <div className="summary-item">
                      <span>Type:</span>
                      <span>{consultationType === 'video' ? 'Video Call' : consultationType === 'phone' ? 'Phone Call' : 'In Office'}</span>
                    </div>
                    <div className="summary-item">
                      <span>Fee:</span>
                      <span>${lawyer.consultationFee}/hour</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-large">
                  Book Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;