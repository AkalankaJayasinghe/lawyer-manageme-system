import React from 'react';

const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedLocation,
  setSelectedLocation,
  sortBy,
  setSortBy,
  resultCount,
  specialties,
  locations
}) => {
  return (
    <>
      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-bar">
            <div className="search-input-wrapper">
              <svg className="search-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, specialty, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-container">
            <div className="filters-row">
              <div className="filter-group">
                <label htmlFor="specialty">Practice Area</label>
                <select
                  id="specialty"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="filter-select"
                >
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="location">Location</label>
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="filter-select"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="sortBy">Sort By</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price-low">Lowest Price</option>
                  <option value="price-high">Highest Price</option>
                </select>
              </div>
            </div>

            <div className="filter-results">
              <span className="results-count">
                {resultCount} lawyer{resultCount !== 1 ? 's' : ''} found
              </span>
              
              {(selectedSpecialty || selectedLocation || searchQuery) && (
                <button 
                  className="clear-filters"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSpecialty('');
                    setSelectedLocation('');
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchFilters;
