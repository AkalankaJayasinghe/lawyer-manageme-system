import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaFilter, FaEllipsisV } from 'react-icons/fa';
import Sidebar from '../layout/sidebar.jsx';
import Header from '../layout/Header';
import '../styles/cases.css';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    assignedTo: 'all',
  });
  
  useEffect(() => {
    // Fetch cases from API
    const fetchCases = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockCases = [
            { id: 101, title: 'Smith v. Johnson', type: 'Divorce', client: { id: 1, name: 'John Smith' }, assignedTo: 'Jane Doe', status: 'Active', priority: 'High', startDate: '2025-02-01', nextHearing: '2025-09-15', lastUpdated: '2025-09-05' },
            { id: 102, title: 'Reynolds Copyright Claim', type: 'Intellectual Property', client: { id: 2, name: 'Reynolds Inc.' }, assignedTo: 'Michael Brown', status: 'Active', priority: 'Medium', startDate: '2025-03-10', nextHearing: null, lastUpdated: '2025-09-04' },
            { id: 103, title: 'Davidson Injury Lawsuit', type: 'Personal Injury', client: { id: 3, name: 'Mary Davidson' }, assignedTo: 'Jane Doe', status: 'Pending', priority: 'Medium', startDate: '2025-05-15', nextHearing: '2025-10-20', lastUpdated: '2025-09-03' },
            { id: 104, title: 'Black Estate Planning', type: 'Estate', client: { id: 4, name: 'Robert Black' }, assignedTo: 'Michael Brown', status: 'Active', priority: 'Low', startDate: '2025-04-05', nextHearing: null, lastUpdated: '2025-09-02' },
            { id: 105, title: 'Global Enterprises Contract Dispute', type: 'Contract', client: { id: 5, name: 'Global Enterprises Ltd.' }, assignedTo: 'Jane Doe', status: 'On Hold', priority: 'High', startDate: '2025-06-10', nextHearing: null, lastUpdated: '2025-08-25' },
            { id: 106, title: 'Williams Property Purchase', type: 'Real Estate', client: { id: 6, name: 'Sarah Williams' }, assignedTo: 'Michael Brown', status: 'Active', priority: 'Medium', startDate: '2025-07-01', nextHearing: null, lastUpdated: '2025-09-01' },
            { id: 107, title: 'Tech Solutions IP Infringement', type: 'Intellectual Property', client: { id: 7, name: 'Tech Solutions Inc.' }, assignedTo: 'Jane Doe', status: 'Active', priority: 'High', startDate: '2025-08-15', nextHearing: '2025-11-10', lastUpdated: '2025-09-06' },
            { id: 203, title: 'Smith Estate Planning', type: 'Estate', client: { id: 1, name: 'John Smith' }, assignedTo: 'Michael Brown', status: 'Completed', priority: 'Medium', startDate: '2025-03-15', nextHearing: null, lastUpdated: '2025-07-20' },
          ];
          setCases(mockCases);
          setFilteredCases(mockCases);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching cases:', error);
        setLoading(false);
      }
    };
    
    fetchCases();
  }, []);
  
  useEffect(() => {
    // Apply filters and search
    let result = cases;
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(caseItem => caseItem.status === filters.status);
    }
    
    // Apply type filter
    if (filters.type !== 'all') {
      result = result.filter(caseItem => caseItem.type === filters.type);
    }
    
    // Apply assignedTo filter
    if (filters.assignedTo !== 'all') {
      result = result.filter(caseItem => caseItem.assignedTo === filters.assignedTo);
    }
    
    // Apply search
    if (searchTerm) {
      result = result.filter(caseItem => 
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCases(result);
  }, [searchTerm, filters, cases]);
  
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };
  
  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };
  
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header title="Case Management" />
        
        <div className="page-toolbar">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="toolbar-actions">
            <button
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filters
            </button>
            
            <Link to="/cases/new" className="add-button">
              <FaPlus /> Add Case
            </Link>
          </div>
        </div>
        
        {showFilters && (
          <div className="filters-container">
            <div className="filter-group">
              <label>Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="all">All Types</option>
                <option value="Divorce">Divorce</option>
                <option value="Intellectual Property">Intellectual Property</option>
                <option value="Personal Injury">Personal Injury</option>
                <option value="Estate">Estate</option>
                <option value="Contract">Contract</option>
                <option value="Real Estate">Real Estate</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Assigned To</label>
              <select
                name="assignedTo"
                value={filters.assignedTo}
                onChange={handleFilterChange}
              >
                <option value="all">All Lawyers</option>
                <option value="Jane Doe">Jane Doe</option>
                <option value="Michael Brown">Michael Brown</option>
              </select>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="data-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case Title</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Start Date</th>
                  <th>Next Hearing</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.length > 0 ? (
                  filteredCases.map((caseItem) => (
                    <tr key={caseItem.id}>
                      <td>
                        <Link to={`/cases/${caseItem.id}`} className="name-link">
                          {caseItem.title}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/clients/${caseItem.client.id}`}>
                          {caseItem.client.name}
                        </Link>
                      </td>
                      <td>{caseItem.type}</td>
                      <td>{caseItem.assignedTo}</td>
                      <td>
                        <span className={`status-badge ${caseItem.status.toLowerCase().replace(' ', '-')}`}>
                          {caseItem.status}
                        </span>
                      </td>
                      <td>
                        <span className={`priority-badge ${getPriorityClass(caseItem.priority)}`}>
                          {caseItem.priority}
                        </span>
                      </td>
                      <td>{caseItem.startDate}</td>
                      <td>{caseItem.nextHearing || '-'}</td>
                      <td>{caseItem.lastUpdated}</td>
                      <td>
                        <div className="action-dropdown">
                          <button className="action-button">
                            <FaEllipsisV />
                          </button>
                          <div className="dropdown-menu">
                            <Link to={`/cases/${caseItem.id}`}>View Details</Link>
                            <Link to={`/cases/${caseItem.id}/edit`}>Edit</Link>
                            <Link to={`/cases/${caseItem.id}/documents`}>View Documents</Link>
                            <button className="dropdown-item">Change Status</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="no-data">
                      No cases found. Adjust your filters or create a new case.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cases;