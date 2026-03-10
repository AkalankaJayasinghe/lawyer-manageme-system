import React, { useState } from 'react';
import { paymentAPI } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import Card from '../ui/Card';

const PaymentForm = ({ bookingId, amount, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    cardHolder: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNumber') value = value.replace(/\D/g, '').slice(0, 16);
    if (name === 'cvc') value = value.replace(/\D/g, '').slice(0, 4);
    if (name === 'expiryMonth') value = value.replace(/\D/g, '').slice(0, 2);
    if (name === 'expiryYear') value = value.replace(/\D/g, '').slice(0, 4);
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const formatCardDisplay = (num) =>
    num.replace(/(.{4})/g, '$1 ').trim();

  const validate = () => {
    const newErrors = {};
    if (!formData.cardHolder.trim()) newErrors.cardHolder = 'Cardholder name is required';
    if (formData.cardNumber.length !== 16) newErrors.cardNumber = 'Enter a valid 16-digit card number';
    const month = parseInt(formData.expiryMonth, 10);
    if (!formData.expiryMonth || month < 1 || month > 12) newErrors.expiryMonth = 'Invalid month (01-12)';
    const year = parseInt(formData.expiryYear, 10);
    if (!formData.expiryYear || year < new Date().getFullYear()) newErrors.expiryYear = 'Invalid year';
    if (formData.cvc.length < 3) newErrors.cvc = 'CVC must be 3-4 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError('');
    try {
      // In production, use Stripe Elements or another PCI-compliant SDK to
      // tokenize card details client-side before sending to the server.
      // Never send raw card numbers or CVCs to your backend.
      await paymentAPI.createPayment({
        bookingId,
        amount,
        paymentMethod: 'card',
        // Only non-sensitive details are sent; the server receives a token in production
        cardSummary: {
          last4: formData.cardNumber.slice(-4),
          expiryMonth: formData.expiryMonth,
          expiryYear: formData.expiryYear,
          cardHolder: formData.cardHolder,
        },
      });
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Alert variant="success" title="Payment Successful!">
        Your payment of ${amount?.toFixed(2) || '0.00'} has been processed successfully.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && <Alert variant="error">{error}</Alert>}

      {amount !== undefined && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-700 font-medium">Amount Due</span>
            <span className="text-2xl font-bold text-blue-900">${amount?.toFixed(2)}</span>
          </div>
        </Card>
      )}

      <Input
        label="Cardholder Name"
        name="cardHolder"
        value={formData.cardHolder}
        onChange={handleChange}
        error={errors.cardHolder}
        placeholder="John Smith"
        required
        autoComplete="cc-name"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Card Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="cardNumber"
          value={formatCardDisplay(formData.cardNumber)}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 font-mono tracking-widest
            ${errors.cardNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
          autoComplete="cc-number"
          inputMode="numeric"
        />
        {errors.cardNumber && <p className="text-sm text-red-600">{errors.cardNumber}</p>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Month"
          name="expiryMonth"
          value={formData.expiryMonth}
          onChange={handleChange}
          error={errors.expiryMonth}
          placeholder="MM"
          required
          autoComplete="cc-exp-month"
          inputMode="numeric"
        />
        <Input
          label="Year"
          name="expiryYear"
          value={formData.expiryYear}
          onChange={handleChange}
          error={errors.expiryYear}
          placeholder="YYYY"
          required
          autoComplete="cc-exp-year"
          inputMode="numeric"
        />
        <Input
          label="CVC"
          name="cvc"
          value={formData.cvc}
          onChange={handleChange}
          error={errors.cvc}
          placeholder="123"
          required
          autoComplete="cc-csc"
          inputMode="numeric"
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
        <svg className="h-4 w-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Your payment information is encrypted and secure.
      </div>

      <Button type="submit" loading={submitting} className="w-full" size="lg">
        {submitting ? 'Processing…' : `Pay $${amount?.toFixed(2) || '0.00'}`}
      </Button>
    </form>
  );
};

export default PaymentForm;
