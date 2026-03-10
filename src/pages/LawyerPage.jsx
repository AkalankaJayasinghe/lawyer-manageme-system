import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Lawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialization: '',
    location: '',
    rating: '',
    priceRange: ''
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockLawyers = [
      {
        id: 1,
        name: "John Doe",
        specialization: "Criminal Law",
        location: "New York, NY",
        rating: 4.8,
        reviews: 156,
        hourlyRate: 200,
        image: null,
        description: "Experienced criminal defense attorney with 15+ years of practice."
      },
      {
        id: 2,
        name: "Jane Smith",
        specialization: "Corporate Law",
        location: "Los Angeles, CA",
        rating: 4.9,
        reviews: 203,
        hourlyRate: 350,
        image: null,
        description: "Corporate law specialist focusing on mergers and acquisitions."
      },
      {
        id: 3,
        name: "Robert Johnson",
        specialization: "Family Law",
        location: "Chicago, IL",
        rating: 4.7,
        reviews: 89,
        hourlyRate: 175,
        image: null,
        description: "Compassionate family law attorney handling divorce and custody cases."
      }
    ];

    setTimeout(() => {
      setLawyers(mockLawyers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lawyers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find a Lawyer</h1>
          <p className="text-gray-600">Browse our network of qualified legal professionals</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <select
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Specializations</option>
                <option value="criminal">Criminal Law</option>
                <option value="corporate">Corporate Law</option>
                <option value="family">Family Law</option>
                <option value="personal-injury">Personal Injury</option>
                <option value="real-estate">Real Estate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City, State"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Price</option>
                <option value="0-150">$0 - $150/hr</option>
                <option value="150-250">$150 - $250/hr</option>
                <option value="250-400">$250 - $400/hr</option>
                <option value="400+">$400+/hr</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lawyers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map(lawyer => (
            <div key={lawyer.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-semibold text-gray-600">
                      {lawyer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{lawyer.name}</h3>
                    <p className="text-blue-600">{lawyer.specialization}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <StarRating rating={lawyer.rating} />
                  <p className="text-sm text-gray-600 mt-1">{lawyer.reviews} reviews</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {lawyer.location}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">${lawyer.hourlyRate}/hour</p>
                </div>

                <p className="text-sm text-gray-600 mb-4">{lawyer.description}</p>

                <div className="flex space-x-2">
                  <Link
                    to={`/lawyers/${lawyer.id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
                  >
                    View Profile
                  </Link>
                  <Link
                                      to={`/book/${lawyer.id}`}
                                      className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg text-center hover:bg-blue-50 transition-colors"
                                    >
                                      Book Now
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  };
                  
                  export default Lawyers;
                  