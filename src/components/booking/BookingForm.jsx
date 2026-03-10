import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI, lawyerAPI } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';

const BookingForm = ({ lawyerId, onSuccess }) => {
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '60',
    type: 'consultation',
    description: '',
  });
  const [errors, setErrors] = useState({});

  const typeOptions = [
    { value: 'consultation', label: 'Initial Consultation' },
    { value: 'follow-up', label: 'Follow-up Meeting' },
    { value: 'document-review', label: 'Document Review' },
    { value: 'court-preparation', label: 'Court Preparation' },
    { value: 'other', label: 'Other' },
  ];

  const durationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
  ];

  useEffect(() => {
    if (lawyerId) {
      lawyerAPI.getLawyerById(lawyerId)
        .then((data) => setLawyer(data.data || data))
        .catch(() => setError('Failed to load lawyer details'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [lawyerId]);

  const validate = () => {
    const newErrors = {};
    const now = new Date();
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.description.trim()) newErrors.description = 'Please describe your legal matter';
    if (formData.date && formData.time) {
      const selected = new Date(`${formData.date}T${formData.time}`);
      if (selected < now) newErrors.date = 'Booking date must be in the future';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError('');
    try {
      const bookingData = {
        lawyerId,
        scheduledDate: `${formData.date}T${formData.time}`,
        duration: parseInt(formData.duration, 10),
        type: formData.type,
        description: formData.description,
      };
      await bookingAPI.createBooking(bookingData);
      setSuccess(true);
      if (onSuccess) onSuccess();
      else navigate('/booking-management');
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (success) {
    return (
      <Alert variant="success" title="Booking Confirmed!">
        Your consultation has been booked successfully. You will receive a confirmation shortly.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && <Alert variant="error">{error}</Alert>}

      {lawyer && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {lawyer.name?.charAt(0) || 'L'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{lawyer.name}</p>
            <p className="text-sm text-gray-500">{lawyer.specialization || 'Legal Professional'}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
          min={new Date().toISOString().split('T')[0]}
        />
        <Input
          label="Time"
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          error={errors.time}
          required
        />
      </div>

      <Select
        label="Session Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        options={typeOptions}
        required
      />

      <Select
        label="Duration"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        options={durationOptions}
        required
      />

      <Textarea
        label="Describe Your Legal Matter"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Please briefly describe the legal issue you need help with..."
        rows={4}
        required
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={submitting} className="flex-1">
          Confirm Booking
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
