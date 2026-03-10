import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { paymentAPI, bookingAPI } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PaymentPage = () => {
  const { user } = useAuth();
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [booking, setBooking] = useState(null);
  
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const response = await bookingAPI.getBookingById(bookingId);
        if (response.success) {
          setBooking(response.data);
        } else {
          setError('Booking not found');
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } catch (error) {
        setError('Failed to load booking: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      loadBooking();
    } else {
      setLoading(false);
    }
  }, [bookingId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('billing.')) {
      const field = name.split('.')[1];
      setPaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentData(prev => ({ ...prev, expiryDate: formatted }));
  };

  const validatePayment = () => {
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      throw new Error('Please enter a valid 16-digit card number');
    }
    
    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      throw new Error('Please enter a valid expiry date (MM/YY)');
    }
    
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      throw new Error('Please enter a valid CVV');
    }
    
    if (!paymentData.cardholderName.trim()) {
      throw new Error('Please enter cardholder name');
    }
    
    if (paymentData.paymentMethod === 'credit_card') {
      const { street, city, state, zipCode } = paymentData.billingAddress;
      if (!street || !city || !state || !zipCode) {
        throw new Error('Please complete billing address');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      validatePayment();

      const payment = {
        booking: bookingId,
        userId: user.id,
        lawyerId: booking.lawyer._id || booking.lawyer,
        amount: booking.fee,
        paymentMethod: paymentData.paymentMethod,
        paymentDetails: {
          cardNumber: paymentData.cardNumber.replace(/\s/g, '').slice(-4), // Store only last 4 digits
          cardholderName: paymentData.cardholderName,
          billingAddress: paymentData.billingAddress
        }
      };

      const response = await paymentAPI.createPayment(payment);

      if (response.success) {
        setSuccess('Payment processed successfully!');
        setTimeout(() => {
          navigate(`/booking/${bookingId}?payment=success`);
        }, 2000);
      } else {
        setError(response.message || 'Payment failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!booking) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <p className="text-gray-600">The booking you're trying to pay for could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h1>

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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={paymentData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            {paymentData.paymentMethod === 'credit_card' && (
              <>
                {/* Card Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={paymentData.expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={paymentData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Billing Address */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="billing.street"
                      value={paymentData.billingAddress.street}
                      onChange={handleInputChange}
                      placeholder="Street Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="billing.city"
                        value={paymentData.billingAddress.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="billing.state"
                        value={paymentData.billingAddress.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="billing.zipCode"
                        value={paymentData.billingAddress.zipCode}
                        onChange={handleInputChange}
                        placeholder="ZIP Code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        name="billing.country"
                        value={paymentData.billingAddress.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {paymentData.paymentMethod === 'paypal' && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your payment.</p>
                <div className="text-2xl text-blue-600">PayPal</div>
              </div>
            )}

            {paymentData.paymentMethod === 'bank_transfer' && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">Bank Transfer Instructions</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Please transfer the amount to the following account:
                </p>
                <div className="text-sm space-y-1">
                  <p><strong>Account Name:</strong> Legal Services LLC</p>
                  <p><strong>Account Number:</strong> 1234567890</p>
                  <p><strong>Routing Number:</strong> 987654321</p>
                  <p><strong>Reference:</strong> Booking {booking._id}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing Payment...' : `Pay $${booking.fee}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">{booking.title}</h3>
              <p className="text-sm text-gray-600">{booking.description}</p>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Lawyer:</span>
                <span className="font-medium">{booking.lawyer?.user?.name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(booking.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{booking.duration} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">{booking.status}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${booking.fee}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Your payment is secure and encrypted. You will receive a confirmation email after successful payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;