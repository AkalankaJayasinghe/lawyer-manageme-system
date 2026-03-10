import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaFilter, FaEllipsisV } from 'react-icons/fa';
import Sidebar from '../layout/Sidebar.jsx';
import Header from '../layout/Header';
import '../styles/clients.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
  });
  
  useEffect(() => {
    // Fetch clients from API
    const fetchClients = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockClients = [
            { id: 1, name: 'John Smith', email: 'john.smith@example.com', phone: '(555) 123-4567', type: 'Individual', status: 'Active', cases: 2, createdAt: '2025-01-15' },
            { id: 2, name: 'Reynolds Inc.', email: 'contact@reynolds.com', phone: '(555) 987-6543', type: 'Corporate', status: 'Active', cases: 3, createdAt: '2025-02-20' },
            { id: 3, name: 'Mary Davidson', email: 'mary.d@example.com', phone: '(555) 456-7890', type: 'Individual', status: 'Active', cases: 1, createdAt: '2025-03-05' },
            { id: 4, name: 'Robert Black', email: 'robert.black@example.com', phone: '(555) 234-5678', type: 'Individual', status: 'Inactive', cases: 1, createdAt: '2025-03-18' },
            { id: 5, name: 'Global Enterprises Ltd.', email: 'info@globalent.com', phone: '(555) 876-5432', type: 'Corporate', status: 'Active', cases: 4, createdAt: '2025-04-10' },
            { id: 6, name: 'Sarah Williams', email: 'sarah.w@example.com', phone: '(555) 345-6789', type: 'Individual', status: 'Active', cases: 1, createdAt: '2025-05-22' },
            { id: 7, name: 'Tech Solutions Inc.', email: 'support@techsol.com', phone: '(555) 654-3210', type: 'Corporate', status: 'Active', cases: 2, createdAt: '2025-06-15' },
            { id: 8, name: 'David Johnson', email: 'david.j@example.com', phone: '(555) 765-4321', type: 'Individual', status: 'Inactive', cases: 0, createdAt: '2025-07-08' },
          ];
          setClients(mockClients);
          setFilteredClients(mockClients);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  useEffect(() => {
    // Apply filters and search
    let result = clients;
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(client => client.status === filters.status);
    }
    
    // Apply type filter
    if (filters.type !== 'all') {
      result = result.filter(client => client.type === filters.type);
    }
    
    // Apply search
    if (searchTerm) {
      result = result.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      );
    }
    
    setFilteredClients(result);
  }, [searchTerm, filters, clients]);
  
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };
  
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header title="Client Management" />
        
        <div className="page-toolbar">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search clients..."
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
            
            <Link to="/clients/new" className="add-button">
              <FaPlus /> Add Client
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
                <option value="Inactive">Inactive</option>
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
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Cases</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <Link to={`/clients/${client.id}`} className="name-link">
                          {client.name}
                        </Link>
                      </td>
                      <td>{client.email}</td>
                      <td>{client.phone}</td>
                      <td>{client.type}</td>
                      <td>
                        <span className={`status-badge ${client.status.toLowerCase()}`}>
                          {client.status}
                        </span>
                      </td>
                      <td>{client.cases}</td>
                      <td>{client.createdAt}</td>
                      <td>
                        <div className="action-dropdown">
                          <button className="action-button">
                            <FaEllipsisV />
                          </button>
                          <div className="dropdown-menu">
                            <Link to={`/clients/${client.id}`}>View Details</Link>
                            <Link to={`/clients/${client.id}/edit`}>Edit</Link>
                            <Link to={`/clients/${client.id}/cases`}>View Cases</Link>
                            <button className="dropdown-item text-danger">Deactivate</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      No clients found. Adjust your filters or create a new client.
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

export default Clients;