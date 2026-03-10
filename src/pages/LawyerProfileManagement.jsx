import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { lawyerAPI } from '../services/api';
import Layout from '../layout/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LawyerProfileManagement = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    specializations: [],
    experience: '',
    bio: '',
    education: [{ institution: '', degree: '', year: '' }],
    rates: { hourly: '', consultation: '' },
    availability: [],
    languages: ''
  });
  const [newEducation, setNewEducation] = useState({ institution: '', degree: '', year: '' });
  const [newSpecialization, setNewSpecialization] = useState('');
  const [errors, setErrors] = useState({});

  const specializationOptions = [
    'Criminal Law', 'Civil Law', 'Family Law', 'Corporate Law', 'Real Estate Law',
    'Employment Law', 'Tax Law', 'Intellectual Property', 'Personal Injury',
    'Immigration Law', 'Bankruptcy Law', 'Contract Law', 'Estate Planning'
  ];

  const availabilityOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchLawyerProfile();
  }, []);

  const fetchLawyerProfile = async () => {
    try {
      setLoading(true);
      // This would need to be implemented in the backend
      // For now, we'll work with the assumption that the profile exists or needs to be created
      setLoading(false);
    } catch (error) {
      console.error('Error fetching lawyer profile:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addEducation = () => {
    if (newEducation.institution && newEducation.degree && newEducation.year) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation]
      }));
      setNewEducation({ institution: '', degree: '', year: '' });
    }
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleSpecializationChange = (e) => {
    setNewSpecialization(e.target.value);
  };

  const addSpecialization = () => {
    if (newSpecialization && !formData.specializations.includes(newSpecialization)) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization]
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (specialization) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== specialization)
    }));
  };

  const toggleAvailability = (day) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }));
  };

  const handleLanguagesChange = (e) => {
    const languages = e.target.value.split(',').map(lang => lang.trim()).filter(lang => lang);
    setFormData(prev => ({
      ...prev,
      languages
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }

    if (formData.specializations.length === 0) {
      newErrors.specializations = 'At least one specialization is required';
    }

    if (!formData.experience || formData.experience < 0) {
      newErrors.experience = 'Experience must be a positive number';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      
      // Convert strings to numbers
      const submissionData = {
        ...formData,
        experience: parseInt(formData.experience),
        rates: {
          hourly: parseFloat(formData.rates.hourly) || 0,
          consultation: parseFloat(formData.rates.consultation) || 0
        },
        languages: typeof formData.languages === 'string' 
          ? formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang)
          : formData.languages
      };

      if (profile?._id) {
        await lawyerAPI.updateLawyerProfile(profile._id, submissionData);
      } else {
        await lawyerAPI.createLawyerProfile(submissionData);
      }
      
      // Refresh the profile
      await fetchLawyerProfile();
      alert('Profile saved successfully!');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lawyer Profile Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your professional lawyer profile and availability
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card padding="lg">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </Card.Header>
            
            <Card.Body className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="License Number"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  error={errors.licenseNumber}
                  placeholder="Enter your bar license number"
                  required
                />
                
                <Input
                  label="Years of Experience"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleInputChange}
                  error={errors.experience}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <Input
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                error={errors.bio}
                placeholder="Tell clients about your background and expertise..."
                textarea
                rows={4}
                required
              />
            </Card.Body>
          </Card>

          {/* Specializations */}
          <Card padding="lg">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Specializations</h2>
            </Card.Header>
            
            <Card.Body className="space-y-4">
              <div className="flex space-x-2">
                <select
                  value={newSpecialization}
                  onChange={handleSpecializationChange}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a specialization</option>
                  {specializationOptions.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <Button type="button" onClick={addSpecialization} size="sm">
                  Add
                </Button>
              </div>

              {errors.specializations && (
                <p className="text-sm text-red-600">{errors.specializations}</p>
              )}

              <div className="flex flex-wrap gap-2">
                {formData.specializations.map((specialization, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {specialization}
                    <button
                      type="button"
                      onClick={() => removeSpecialization(specialization)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Rates */}
          <Card padding="lg">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Rates</h2>
            </Card.Header>
            
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Hourly Rate ($)"
                  name="hourly"
                  type="number"
                  value={formData.rates.hourly}
                  onChange={(e) => handleNestedInputChange('rates', 'hourly', e.target.value)}
                  placeholder="100"
                  min="0"
                  step="0.01"
                />
                
                <Input
                  label="Consultation Fee ($)"
                  name="consultation"
                  type="number"
                  value={formData.rates.consultation}
                  onChange={(e) => handleNestedInputChange('rates', 'consultation', e.target.value)}
                  placeholder="150"
                  min="0"
                  step="0.01"
                />
              </div>
            </Card.Body>
          </Card>

          {/* Availability */}
          <Card padding="lg">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Availability</h2>
            </Card.Header>
            
            <Card.Body>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
                {availabilityOptions.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleAvailability(day)}
                    className={`p-3 text-center rounded-lg border text-sm font-medium transition-colors ${
                      formData.availability.includes(day)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Languages */}
          <Card padding="lg">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Languages</h2>
            </Card.Header>
            
            <Card.Body>
              <Input
                label="Languages Spoken"
                value={Array.isArray(formData.languages) ? formData.languages.join(', ') : ''}
                onChange={handleLanguagesChange}
                placeholder="English, Spanish, French (comma separated)"
                helperText="Separate multiple languages with commas"
              />
            </Card.Body>
          </Card>

          {/* Education */}
          <Card padding="lg">
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Education</h2>
            </Card.Header>
            
            <Card.Body className="space-y-4">
              {formData.education.map((edu, index) => (
                <div key={index} className="flex space-x-2 items-end">
                  <Input
                    label="Institution"
                    value={edu.institution}
                    onChange={(e) => {
                      const updatedEducation = [...formData.education];
                      updatedEducation[index].institution = e.target.value;
                      setFormData(prev => ({ ...prev, education: updatedEducation }));
                    }}
                    placeholder="University/School name"
                  />
                  <Input
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) => {
                      const updatedEducation = [...formData.education];
                      updatedEducation[index].degree = e.target.value;
                      setFormData(prev => ({ ...prev, education: updatedEducation }));
                    }}
                    placeholder="JD, LLM, etc."
                  />
                  <Input
                    label="Year"
                    type="number"
                    value={edu.year}
                    onChange={(e) => {
                      const updatedEducation = [...formData.education];
                      updatedEducation[index].year = e.target.value;
                      setFormData(prev => ({ ...prev, education: updatedEducation }));
                    }}
                    placeholder="2020"
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeEducation(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Add Education</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Institution"
                    value={newEducation.institution}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                  />
                  <Input
                    placeholder="Degree"
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                  />
                  <Input
                    placeholder="Year"
                    type="number"
                    value={newEducation.year}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, year: e.target.value }))}
                    className="w-20"
                  />
                  <Button type="button" onClick={addEducation} size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" loading={saving} size="lg">
              {profile ? 'Update Profile' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default LawyerProfileManagement;