import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const statusVariant = {
  pending: 'warning',
  confirmed: 'primary',
  completed: 'success',
  cancelled: 'error',
  rejected: 'error',
};

const BookingCard = ({ booking, onStatusUpdate, onDelete, currentUserRole }) => {
  const statusColor = statusVariant[booking.status] || 'default';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">Booking #{booking.id}</p>
          <h3 className="font-semibold text-gray-900">
            {booking.type
              ? booking.type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
              : 'Consultation'}
          </h3>
        </div>
        <Badge variant={statusColor}>
          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
        </Badge>
      </div>

      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(booking.scheduledDate || booking.date)}</span>
        </div>
        {booking.duration && (
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{booking.duration} minutes</span>
          </div>
        )}
        {booking.lawyerName && (
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Lawyer: {booking.lawyerName}</span>
          </div>
        )}
        {booking.clientName && currentUserRole === 'lawyer' && (
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Client: {booking.clientName}</span>
          </div>
        )}
      </div>

      {booking.description && (
        <p className="text-sm text-gray-600 bg-gray-50 rounded p-2 line-clamp-2">
          {booking.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        <Link to={`/booking/${booking.id}`}>
          <Button size="sm" variant="outline">View Details</Button>
        </Link>

        {onStatusUpdate && booking.status === 'pending' && currentUserRole === 'lawyer' && (
          <>
            <Button size="sm" variant="success" onClick={() => onStatusUpdate(booking.id, 'confirmed')}>
              Confirm
            </Button>
            <Button size="sm" variant="danger" onClick={() => onStatusUpdate(booking.id, 'rejected')}>
              Reject
            </Button>
          </>
        )}

        {onStatusUpdate && booking.status === 'confirmed' && currentUserRole === 'lawyer' && (
          <Button size="sm" variant="success" onClick={() => onStatusUpdate(booking.id, 'completed')}>
            Mark Complete
          </Button>
        )}

        {onDelete && currentUserRole === 'admin' && (
          <Button size="sm" variant="danger" onClick={() => onDelete(booking.id)}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
