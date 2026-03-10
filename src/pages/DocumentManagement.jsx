import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { documentAPI, bookingAPI } from '../services/api';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DocumentManagement = () => {
  const { user } = useAuth();
  const { bookingId } = useParams(); // Optional: specific booking documents
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(bookingId || '');
  
  const [uploadData, setUploadData] = useState({
    title: '',
    file: null,
    booking: bookingId || ''
  });

  useEffect(() => {
    loadDocuments();
    loadBookings();
  }, [bookingId]);

  const loadDocuments = async () => {
    try {
      const response = await documentAPI.getAllDocuments(bookingId);
      setDocuments(response || []);
    } catch (error) {
      setError('Failed to load documents: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      if (response.success) {
        setBookings(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF, JPEG, and PNG files are allowed');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      
      setUploadData(prev => ({
        ...prev,
        file: file,
        title: prev.title || file.name.split('.')[0] // Auto-fill title from filename
      }));
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadData.file || !uploadData.title) {
      setError('Please select a file and enter a title');
      return;
    }
    
    setUploading(true);
    setError('');
    setSuccess('');
    
    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('title', uploadData.title);
      if (uploadData.booking) {
        formData.append('booking', uploadData.booking);
      }
      
      const response = await documentAPI.uploadDocument(formData);
      
      if (response.message) {
        setSuccess('Document uploaded successfully!');
        setUploadData({
          title: '',
          file: null,
          booking: bookingId || ''
        });
        // Reset file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
        
        // Reload documents
        loadDocuments();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      await documentAPI.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc._id !== documentId));
      setSuccess('Document deleted successfully!');
    } catch (error) {
      setError('Failed to delete document: ' + error.message);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) {
      return (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    } else if (fileType?.includes('image')) {
      return (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {bookingId ? 'Booking Documents' : 'Document Management'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h2>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={uploadData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter document title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {!bookingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Booking (Optional)
                  </label>
                  <select
                    name="booking"
                    value={uploadData.booking}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a booking</option>
                    {bookings.map(booking => (
                      <option key={booking._id} value={booking._id}>
                        {booking.title} - {formatDate(booking.date)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File * (PDF, JPEG, PNG - Max 5MB)
              </label>
              <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploadData.file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {uploadData.file.name} ({formatFileSize(uploadData.file.size)})
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading || !uploadData.file || !uploadData.title}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </form>
        </div>

        {/* Documents List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Documents ({documents.length})
            </h2>
            
            {!bookingId && (
              <select
                value={selectedBooking}
                onChange={(e) => setSelectedBooking(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All documents</option>
                {bookings.map(booking => (
                  <option key={booking._id} value={booking._id}>
                    {booking.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No documents</h3>
              <p className="mt-1 text-gray-500">Upload your first document to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {documents
                .filter(doc => !selectedBooking || doc.booking === selectedBooking)
                .map(document => (
                <div key={document._id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mr-4">
                    {getFileIcon(document.fileType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {document.title}
                    </h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Size: {formatFileSize(document.size || 0)}</span>
                      <span>Uploaded: {formatDate(document.createdAt)}</span>
                      {document.booking && (
                        <span>Booking: {bookings.find(b => b._id === document.booking)?.title || 'Unknown'}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <a
                      href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${document.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(document._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;