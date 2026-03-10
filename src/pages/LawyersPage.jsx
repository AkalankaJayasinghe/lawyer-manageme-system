import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../components/common/Footer';
import { lawyerAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const LawyersPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLawyers();
  }, [selectedSpecialization, priceRange, sortBy, currentPage]);

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const params = {
        specialization: selectedSpecialization,
        hourlyRate: priceRange,
        location: location,
        sortBy: sortBy,
        page: currentPage,
        limit: 12
      };
      
      const response = await lawyerAPI.getAllLawyers(params);
      setLawyers(response.data?.lawyers || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    'Criminal Law', 'Civil Law', 'Family Law', 'Corporate Law', 'Real Estate Law',
    'Employment Law', 'Tax Law', 'Intellectual Property', 'Personal Injury',
    'Immigration Law', 'Bankruptcy Law', 'Contract Law', 'Estate Planning'
  ];

  const priceRanges = [
    { label: 'Under $100/hr', value: '0-100' },
    { label: '$100 - $200/hr', value: '100-200' },
    { label: '$200 - $300/hr', value: '200-300' },
    { label: '$300+/hr', value: '300-9999' }
  ];

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.specializations?.some(spec => 
                           spec.toLowerCase().includes(searchTerm.toLowerCase())
                         ) ||
                         lawyer.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !location || 
                           lawyer.user?.address?.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  const LawyerCard = ({ lawyer }) => (
    <Card hover className="lawyer-card">
      <div className="flex items-start space-x-4">
        {/* Profile Image */}
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-blue-600">
            {lawyer.user?.name?.charAt(0)?.toUpperCase() || 'L'}
          </span>
        </div>
        
        {/* Lawyer Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {lawyer.user?.name || 'Unknown Lawyer'}
          </h3>
          
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < (lawyer.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.540 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2-034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-sm text-gray-600">({lawyer.reviews?.length || 0})</span>
          </div>
          
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {lawyer.specializations?.slice(0, 3).map((spec, index) => (
                <span key={index} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  {spec}
                </span>
              ))}
              {lawyer.specializations?.length > 3 && (
                <span className="text-xs text-gray-500">+{lawyer.specifications.length - 3} more</span>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {lawyer.bio || 'Professional lawyer ready to help with your legal needs.'}
          </p>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">${lawyer.rates?.hourly || 0}</span>/hr
            </div>
            <Link to={`/lawyers/${lawyer._id}`}>
              <Button size="sm">View Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Legal Expert
            </h1>
            <p className="text-xl text-gray-600">
              Connect with experienced lawyers in your area
            </p>
          </div>

          {/* Search & Filters */}
          <Card className="p-6 mb-8">
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search lawyers by name, specialization, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Price Range</option>
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
                
                <input
                  type="text"
                  placeholder="Location (optional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="experience">Sort by Experience</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredLawyers.length} lawyer{filteredLawyers.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
              {selectedSpecialization && ` in ${selectedSpecialization}`}
            </p>
          </div>

          {/* Lawyers Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {filteredLawyers.length === 0 ? (
                <Card className="p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h4m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33M15 6a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLawyers.map(lawyer => (
                    <LawyerCard key={lawyer._id} lawyer={lawyer} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'primary' : 'outline'}
                          onClick={() => setCurrentPage(page)}
                          size="sm"
                        >
                          {page}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LawyersPage;