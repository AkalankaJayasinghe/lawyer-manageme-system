import React, { useState, useEffect } from 'react';
import { lawyerAPI } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';

const LawyerProfileForm = ({ lawyerId, existingProfile, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [specializations, setSpecializations] = useState([]);

  const [formData, setFormData] = useState({
    licenseNumber: '',
    specialization: '',
    experience: '',
    bio: '',
    education: '',
    hourlyRate: '',
    consultationFee: '',
    languages: '',
    location: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    lawyerAPI.getSpecializations()
      .then((data) => setSpecializations(data.data || data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (existingProfile) {
      setFormData({
        licenseNumber: existingProfile.licenseNumber || '',
        specialization: existingProfile.specialization || '',
        experience: existingProfile.experience || '',
        bio: existingProfile.bio || '',
        education: existingProfile.education || '',
        hourlyRate: existingProfile.rates?.hourly || existingProfile.hourlyRate || '',
        consultationFee: existingProfile.rates?.consultation || existingProfile.consultationFee || '',
        languages: Array.isArray(existingProfile.languages)
          ? existingProfile.languages.join(', ')
          : existingProfile.languages || '',
        location: existingProfile.location || '',
        phone: existingProfile.phone || '',
      });
    }
  }, [existingProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.experience) newErrors.experience = 'Years of experience is required';
    if (isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
      newErrors.experience = 'Experience must be a valid number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...formData,
        experience: Number(formData.experience),
        languages: formData.languages.split(',').map((l) => l.trim()).filter(Boolean),
        rates: {
          hourly: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
          consultation: formData.consultationFee ? Number(formData.consultationFee) : undefined,
        },
      };
      if (lawyerId) {
        await lawyerAPI.updateLawyerProfile(lawyerId, payload);
        setSuccess('Profile updated successfully.');
      } else {
        await lawyerAPI.createLawyerProfile(payload);
        setSuccess('Profile created successfully.');
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  };

  const specializationOptions = specializations.length > 0
    ? specializations.map((s) => ({ value: s, label: s }))
    : [
        { value: 'Criminal Law', label: 'Criminal Law' },
        { value: 'Civil Law', label: 'Civil Law' },
        { value: 'Family Law', label: 'Family Law' },
        { value: 'Corporate Law', label: 'Corporate Law' },
        { value: 'Real Estate Law', label: 'Real Estate Law' },
        { value: 'Employment Law', label: 'Employment Law' },
        { value: 'Tax Law', label: 'Tax Law' },
        { value: 'Intellectual Property', label: 'Intellectual Property' },
        { value: 'Immigration Law', label: 'Immigration Law' },
      ];

  if (submitting) return <Spinner className="mx-auto py-8" />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Bar License Number"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleChange}
          error={errors.licenseNumber}
          placeholder="e.g. BAR-2023-001"
          required
        />
        <Input
          label="Years of Experience"
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          error={errors.experience}
          placeholder="e.g. 5"
          min="0"
          required
        />
      </div>

      <Select
        label="Primary Specialization"
        name="specialization"
        value={formData.specialization}
        onChange={handleChange}
        options={specializationOptions}
        error={errors.specialization}
        placeholder="Select a specialization..."
        required
      />

      <Textarea
        label="Professional Bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        error={errors.bio}
        placeholder="Describe your experience, expertise, and approach to practice..."
        rows={4}
        required
      />

      <Input
        label="Education"
        name="education"
        value={formData.education}
        onChange={handleChange}
        placeholder="e.g. J.D., Harvard Law School, 2010"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Hourly Rate ($)"
          type="number"
          name="hourlyRate"
          value={formData.hourlyRate}
          onChange={handleChange}
          placeholder="e.g. 250"
          min="0"
        />
        <Input
          label="Consultation Fee ($)"
          type="number"
          name="consultationFee"
          value={formData.consultationFee}
          onChange={handleChange}
          placeholder="e.g. 150"
          min="0"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. New York, NY"
        />
        <Input
          label="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <Input
        label="Languages Spoken"
        name="languages"
        value={formData.languages}
        onChange={handleChange}
        placeholder="English, Spanish, French (comma separated)"
        helperText="Separate multiple languages with commas"
      />

      <Button type="submit" loading={submitting} className="w-full" size="lg">
        {lawyerId ? 'Update Profile' : 'Create Profile'}
      </Button>
    </form>
  );
};

export default LawyerProfileForm;
