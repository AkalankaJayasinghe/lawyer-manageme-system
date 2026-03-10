import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookingAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BookingDashboard = () => {
  const { user, isLawyer, isUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      let response;
      
      if (isLawyer()) {
        response = await bookingAPI.getLawyerBookings();
      } else if (isUser()) {
        response = await bookingAPI.getUserBookings();
      } else if (isAdmin()) {
        response = await bookingAPI.getAllBookings();
      }
      
      if (response.success) {
        setBookings(response.data || []);
      }
    } catch (error) {
      setError('Failed to load bookings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!isLawyer() && !isAdmin()) return;
    
    try {
      setUpdatingStatus(bookingId);
      const response = await bookingAPI.updateBookingStatus(bookingId, newStatus);
      
      if (response.success) {
        setBookings(prev => 
          prev.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status: newStatus }
              : booking
          )
        );
      }
    } catch (error) {
      setError('Failed to update booking status: ' + error.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isLawyer() ? 'My Bookings' : isUser() ? 'My Appointments' : 'All Bookings'}
        </h1>
        
        {isUser() && (
          <Link
            to="/booking/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Book Appointment
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md capitalize ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status} {status === 'all' ? `(${bookings.length})` : `(${bookings.filter(b => b.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {filter === 'all' ? 'No bookings found' : `No ${filter} bookings found`}
          </div>
          {isUser() && filter === 'all' && (
            <Link
              to="/booking/new"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Book Your First Appointment
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map(booking => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {booking.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-500 block">
                        {isLawyer() ? 'Client' : 'Lawyer'}
                      </span>
                      <span className="font-medium">
                        {isLawyer() 
                          ? booking.user?.name || 'Unknown Client'
                          : booking.lawyer?.user?.name || 'Unknown Lawyer'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Date & Time</span>
                      <span className="font-medium">{formatDate(booking.date)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Duration</span>
                      <span className="font-medium">{booking.duration} minutes</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Fee</span>
                      <span className="font-medium">${booking.fee}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(booking.urgencyLevel)}`}>
                    {booking.urgencyLevel} priority
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-sm text-gray-500 block mb-1">Description</span>
                <p className="text-gray-700">{booking.description}</p>
              </div>

              {booking.notes && (
                <div className="mb-4">
                  <span className="text-sm text-gray-500 block mb-1">Notes</span>
                  <p className="text-gray-700">{booking.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/booking/${booking._id}`)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                  
                  {isUser() && booking.status === 'pending' && (
                    <Link
                      to={`/booking/edit/${booking._id}`}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Edit
                    </Link>
                  )}
                </div>

                {/* Status Update Buttons (for lawyers and admins) */}
                {(isLawyer() || isAdmin()) && booking.status !== 'completed' && booking.status !== 'cancelled' && (
                  <div className="flex space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                          disabled={updatingStatus === booking._id}
                          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          disabled={updatingStatus === booking._id}
                          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                        disabled={updatingStatus === booking._id}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingDashboard;