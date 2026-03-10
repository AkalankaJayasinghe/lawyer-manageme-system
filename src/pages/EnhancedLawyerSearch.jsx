import React, { useState, useEffect } from 'react';
import { lawyerAPI } from '../services/api';
import LawyerCard from '../components/lawyers/LawyerCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EnhancedLawyerSearch = () => {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    location: '',
    minRating: 0,
    maxFee: '',
    experience: '',
    availability: '',
    sortBy: 'rating'
  });

  const [availableFilters, setAvailableFilters] = useState({
    specializations: [],
    locations: [],
    experienceRanges: ['0-2 years', '3-5 years', '6-10 years', '10+ years']
  });

  useEffect(() => {
    loadLawyers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [lawyers, filters]);

  const loadLawyers = async () => {
    try {
      setLoading(true);
      const response = await lawyerAPI.getAllLawyers();
      
      if (response.success && response.lawyers) {
        const approvedLawyers = response.lawyers.filter(lawyer => lawyer.status === 'approved');
        setLawyers(approvedLawyers);
        
        // Extract unique values for filter dropdowns
        const specializations = [...new Set(
          approvedLawyers.flatMap(lawyer => lawyer.specializations || [])
        )].filter(Boolean);
        
        const locations = [...new Set(
          approvedLawyers.map(lawyer => lawyer.location || lawyer.address?.city)
        )].filter(Boolean);
        
        setAvailableFilters(prev => ({
          ...prev,
          specializations,
          locations
        }));
      }
    } catch (error) {
      setError('Failed to load lawyers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...lawyers];

    // Text search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(lawyer => 
        (lawyer.name || lawyer.firstName + ' ' + lawyer.lastName || '').toLowerCase().includes(searchTerm) ||
        (lawyer.specializations || []).some(spec => spec.toLowerCase().includes(searchTerm)) ||
        (lawyer.bio || '').toLowerCase().includes(searchTerm)
      );
    }

    // Specialization filter
    if (filters.specialization) {
      filtered = filtered.filter(lawyer => 
        (lawyer.specializations || []).includes(filters.specialization)
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(lawyer => 
        lawyer.location === filters.location || 
        lawyer.address?.city === filters.location
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(lawyer => 
        (lawyer.rating || 0) >= filters.minRating
      );
    }

    // Fee filter
    if (filters.maxFee) {
      const maxFee = parseFloat(filters.maxFee);
      filtered = filtered.filter(lawyer => 
        (lawyer.hourlyRate || 0) <= maxFee
      );
    }

    // Experience filter
    if (filters.experience) {
      filtered = filtered.filter(lawyer => {
        const experience = lawyer.experienceYears || 0;
        switch (filters.experience) {
          case '0-2 years':
            return experience >= 0 && experience <= 2;
          case '3-5 years':
            return experience >= 3 && experience <= 5;
          case '6-10 years':
            return experience >= 6 && experience <= 10;
          case '10+ years':
            return experience > 10;
          default:
            return true;
        }
      });
    }

    // Availability filter
    if (filters.availability) {
      // This would need backend support for real availability checking
      // For now, we'll assume all lawyers are available
      filtered = filtered.filter(lawyer => lawyer.isAvailable !== false);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'experience':
          return (b.experienceYears || 0) - (a.experienceYears || 0);
        case 'fee_low':
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        case 'fee_high':
          return (b.hourlyRate || 0) - (a.hourlyRate || 0);
        case 'name':
          const nameA = a.name || a.firstName + ' ' + a.lastName || '';
          const nameB = b.name || b.firstName + ' ' + b.lastName || '';
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

    setFilteredLawyers(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      specialization: '',
      location: '',
      minRating: 0,
      maxFee: '',
      experience: '',
      availability: '',
      sortBy: 'rating'
    });
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={() => handleFilterChange('minRating', index + 1)}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        } hover:text-yellow-400 cursor-pointer`}
      >
        ★
      </button>
    ));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Lawyer</h1>
          <p className="mt-2 text-gray-600">
            Search and filter from our network of qualified legal professionals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Main search bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, specialization, or keywords..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Advanced filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <select
                value={filters.specialization}
                onChange={(e) => handleFilterChange('specialization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Specializations</option>
                {availableFilters.specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {availableFilters.locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Experience</option>
                {availableFilters.experienceRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            {/* Max Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Hourly Rate</label>
              <input
                type="number"
                placeholder="$ per hour"
                value={filters.maxFee}
                onChange={(e) => handleFilterChange('maxFee', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort by */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="fee_low">Lowest Fee</option>
                <option value="fee_high">Highest Fee</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            {/* Clear filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Rating filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
            <div className="flex items-center space-x-1">
              {getRatingStars(filters.minRating)}
              <span className="ml-2 text-sm text-gray-600">
                {filters.minRating > 0 ? `${filters.minRating}+ stars` : 'Any rating'}
              </span>
              {filters.minRating > 0 && (
                <button
                  onClick={() => handleFilterChange('minRating', 0)}
                  className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredLawyers.length} Lawyer{filteredLawyers.length !== 1 ? 's' : ''} Found
          </h2>
          
          {filteredLawyers.length !== lawyers.length && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Show all {lawyers.length} lawyers
            </button>
          )}
        </div>

        {filteredLawyers.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No lawyers found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search criteria or clearing filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map(lawyer => (
              <LawyerCard key={lawyer._id} lawyer={lawyer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedLawyerSearch;