import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Functions

// Health Check
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(`Health check failed: ${error.message}`);
  }
};

// Authentication APIs
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout: async () => {
    try {
      await apiClient.get('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/auth/updatedetails', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const response = await apiClient.put('/auth/updatepassword', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update password');
    }
  }
};

// Lawyer APIs
export const lawyerAPI = {
  getAllLawyers: async (params = {}) => {
    try {
      const response = await apiClient.get('/lawyers/lawyers', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lawyers');
    }
  },

  getLawyerById: async (id) => {
    try {
      const response = await apiClient.get(`/lawyers/lawyers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lawyer');
    }
  },

  getSpecializations: async () => {
    try {
      const response = await apiClient.get('/lawyers/specializations');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch specializations');
    }
  },

  createLawyerProfile: async (profileData) => {
    try {
      const response = await apiClient.post('/lawyers/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create lawyer profile');
    }
  },

  updateLawyerProfile: async (id, profileData) => {
    try {
      const response = await apiClient.put(`/lawyers/profile/${id}`, profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update lawyer profile');
    }
  },

  deleteLawyerProfile: async (id) => {
    try {
      const response = await apiClient.delete(`/lawyers/profile/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete lawyer profile');
    }
  }
};

// Booking APIs
export const bookingAPI = {
  createBooking: async (bookingData) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  },

  getAllBookings: async () => {
    try {
      const response = await apiClient.get('/bookings');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch all bookings');
    }
  },

  getUserBookings: async () => {
    try {
      const response = await apiClient.get('/bookings/user');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user bookings');
    }
  },

  getLawyerBookings: async () => {
    try {
      const response = await apiClient.get('/bookings/lawyer');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lawyer bookings');
    }
  },

  getBookingById: async (id) => {
    try {
      const response = await apiClient.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking');
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await apiClient.put(`/bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update booking status');
    }
  },

  deleteBooking: async (id) => {
    try {
      const response = await apiClient.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete booking');
    }
  }
};

// Payment APIs
export const paymentAPI = {
  createPayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/create-payment', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment');
    }
  },

  getUserPayments: async () => {
    try {
      const response = await apiClient.get('/payments/payments');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  },

  getPaymentById: async (id) => {
    try {
      const response = await apiClient.get(`/payments/payments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment');
    }
  },

  getPaymentHistory: async () => {
    try {
      const response = await apiClient.get('/payments/payment-history');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment history');
    }
  }
};

// Message APIs
export const messageAPI = {
  sendMessage: async (messageData) => {
    try {
      const response = await apiClient.post('/messages/send', messageData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  },

  getMessages: async (userId) => {
    try {
      const response = await apiClient.get(`/messages/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await apiClient.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete message');
    }
  }
};

// Document APIs
export const documentAPI = {
  uploadDocument: async (formData) => {
    try {
      const response = await apiClient.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload document');
    }
  },

  getAllDocuments: async (bookingId = null) => {
    try {
      const url = bookingId ? `/documents?booking=${bookingId}` : '/documents';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch documents');
    }
  },

  getDocumentById: async (id) => {
    try {
      const response = await apiClient.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch document');
    }
  },

  deleteDocument: async (documentId) => {
    try {
      const response = await apiClient.delete(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete document');
    }
  }
};

// User APIs
export const userAPI = {
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/users/all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  },

  updateUserProfile: async (userData) => {
    try {
      const response = await apiClient.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user profile');
    }
  },

  deleteUserAccount: async () => {
    try {
      const response = await apiClient.delete('/users/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user account');
    }
  }
};

// Admin APIs
export const adminAPI = {
  activateUser: async (userId) => {
    try {
      const response = await apiClient.put(`/users/${userId}/activate`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to activate user');
    }
  },

  deactivateUser: async (userId) => {
    try {
      const response = await apiClient.put(`/users/${userId}/deactivate`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to deactivate user');
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  approveLawyer: async (lawyerId) => {
    try {
      const response = await apiClient.put(`/lawyers/profile/${lawyerId}/approve`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to approve lawyer');
    }
  },

  rejectLawyer: async (lawyerId) => {
    try {
      const response = await apiClient.put(`/lawyers/profile/${lawyerId}/reject`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reject lawyer');
    }
  },

  suspendLawyer: async (lawyerId) => {
    try {
      const response = await apiClient.put(`/lawyers/profile/${lawyerId}/suspend`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to suspend lawyer');
    }
  },

  deleteLawyer: async (lawyerId) => {
    try {
      const response = await apiClient.delete(`/lawyers/profile/${lawyerId}/admin`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete lawyer');
    }
  }
};

// Utility functions
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getAuthToken = () => localStorage.getItem('token');

export const isAuthenticated = () => !!getAuthToken();

export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || 'user';
};

export const isLawyer = () => getUserRole() === 'lawyer';
export const isAdmin = () => getUserRole() === 'admin';
export const isUser = () => getUserRole() === 'user';

// Generic API functions
export const fetchData = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(`API call failed: ${error.response?.data?.message || error.message}`);
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(`API call failed: ${error.response?.data?.message || error.message}`);
  }
};

export const putData = async (endpoint, data) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(`API call failed: ${error.response?.data?.message || error.message}`);
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(`API call failed: ${error.response?.data?.message || error.message}`);
  }
};

export default apiClient;
