import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookingAPI } from '../services/api';
import Layout from '../layout/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/ui/Modal';

const BookingManagement = () => {
  const { user, isLawyer, isUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, [refreshToken]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let response;
      
      if (isLawyer()) {
        response = await bookingAPI.getLawyerBookings();
      } else if (isUser()) {
        response = await bookingAPI.getUserBookings();
      } else {
        response = await bookingAPI.getAllBookings();
      }
      
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, newStatus);
      setRefreshToken(prev => prev + 1);
      setIsModalOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => 
    filterStatus === 'all' || booking.status === filterStatus
  );

  const BookingCard = ({ booking }) => (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {isUser ? `Lawyer: ${booking.lawyer?.user?.name || 'Unknown'}` : `Client: ${booking.user?.name || 'Unknown'}`}
          </p>
        </div>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>📅 Date:</span>
          <span>{new Date(booking.date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span>🕐 Time:</span>
          <span>{booking.startTime}</span>
        </div>
        <div className="flex justify-between">
          <span>⏱️ Duration:</span>
          <span>{booking.duration} minutes</span>
        </div>
        <div className="flex justify-between">
          <span>💰 Fee:</span>
          <span>${booking.fee}</span>
        </div>
        <div className="flex justify-between">
          <span>🔴 Urgency:</span>
          <span className="capitalize">{booking.urgencyLevel}</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-700 mt-4">{booking.description}</p>
      
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedBooking(booking);
            setIsModalOpen(true);
          }}
        >
          View Details
        </Button>
        
        {isLawyer() && ['pending', 'confirmed'].includes(booking.status) && (
          <div className="flex space-x-2">
            <Button
              variant="success"
              size="sm"
              onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
            >
              Accept
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
            >
              Decline
            </Button>
          </div>
        )}
        
        {booking.status === 'confirmed' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleStatusUpdate(booking._id, 'completed')}
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consultation Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your {isLawyer() ? 'client consultations' : 'lawyer consultations'}
            </p>
          </div>
          
          {isUser() && (
            <Button
              onClick={() => window.location.href = '/lawyers'}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              Book Consultation
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  filterStatus === status
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status} ({bookings.filter(b => status === 'all' || b.status === status).length})
              </button>
            ))}
          </nav>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No consultations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filterStatus === 'all' 
                  ? "You don't have any consultations yet."
                  : `No consultations with status "${filterStatus}".`
                }
              </p>
              {isUser() && (
                <div className="mt-6">
                  <Button onClick={() => window.location.href = '/lawyers'}>
                    Find a Lawyer
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}

        {/* Booking Detail Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBooking(null);
          }}
          title="Consultation Details"
          size="lg"
        >
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Title</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedBooking.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <span className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Time</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedBooking.startTime}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedBooking.duration} minutes</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Fee</h4>
                  <p className="mt-1 text-sm text-gray-900">${selectedBooking.fee}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.description}</p>
              </div>
              
              {selectedBooking.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedBooking.notes}</p>
                </div>
              )}
              
              {selectedBooking.documents && selectedBooking.documents.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Documents</h4>
                  <div className="mt-1 space-y-2">
                    {selectedBooking.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-900">{doc.filename}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
                {isLawyer() && selectedBooking.status === 'confirmed' && (
                  <Button 
                    variant="primary" 
                    onClick={() => handleStatusUpdate(selectedBooking._id, 'completed')}
                  >
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default BookingManagement;