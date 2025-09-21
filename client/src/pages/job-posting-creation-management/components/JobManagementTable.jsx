import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const JobManagementTable = ({ onEdit, onDuplicate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('datePosted');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Mock job data
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'engineering',
      location: { type: 'remote', country: 'United States' },
      employmentType: 'full-time',
      status: 'active',
      datePosted: '2023-06-15',
      expiresAt: '2023-07-15',
      applications: 24,
      views: 342,
      isFeatured: true
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      department: 'design',
      location: { type: 'hybrid', city: 'San Francisco', state: 'CA', country: 'United States' },
      employmentType: 'full-time',
      status: 'active',
      datePosted: '2023-06-10',
      expiresAt: '2023-07-10',
      applications: 18,
      views: 275,
      isFeatured: false
    },
    {
      id: 3,
      title: 'Product Manager',
      department: 'product',
      location: { type: 'onsite', city: 'New York', state: 'NY', country: 'United States' },
      employmentType: 'full-time',
      status: 'active',
      datePosted: '2023-06-05',
      expiresAt: '2023-07-05',
      applications: 32,
      views: 410,
      isFeatured: true
    },
    {
      id: 4,
      title: 'Marketing Specialist',
      department: 'marketing',
      location: { type: 'remote', country: 'United States' },
      employmentType: 'full-time',
      status: 'draft',
      datePosted: null,
      expiresAt: null,
      applications: 0,
      views: 0,
      isFeatured: false
    },
    {
      id: 5,
      title: 'Customer Support Representative',
      department: 'customer-support',
      location: { type: 'remote', country: 'United States' },
      employmentType: 'part-time',
      status: 'expired',
      datePosted: '2023-05-01',
      expiresAt: '2023-06-01',
      applications: 45,
      views: 520,
      isFeatured: false
    },
    {
      id: 6,
      title: 'Backend Developer',
      department: 'engineering',
      location: { type: 'hybrid', city: 'Austin', state: 'TX', country: 'United States' },
      employmentType: 'contract',
      status: 'paused',
      datePosted: '2023-05-20',
      expiresAt: '2023-06-20',
      applications: 12,
      views: 180,
      isFeatured: false
    }
  ];
  
  // Filter jobs based on search query and status filter
  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle null values
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    
    // Handle date comparisons
    if (sortBy === 'datePosted' || sortBy === 'expiresAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    // Handle string comparisons
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    // Sort based on direction
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Handle sort change
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  // Format location
  const formatLocation = (location) => {
    if (location.type === 'remote') {
      return 'Remote';
    } else if (location.type === 'hybrid') {
      if (location.city && location.state) {
        return `Hybrid · ${location.city}, ${location.state}`;
      }
      return 'Hybrid';
    } else if (location.type === 'onsite') {
      if (location.city && location.state) {
        return `${location.city}, ${location.state}`;
      }
      return 'On-site';
    }
    return '';
  };
  
  // Format employment type
  const formatEmploymentType = (type) => {
    const types = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'contract': 'Contract',
      'temporary': 'Temporary',
      'internship': 'Internship',
      'volunteer': 'Volunteer'
    };
    return types[type] || type;
  };
  
  // Format department
  const formatDepartment = (department) => {
    const departments = {
      'engineering': 'Engineering',
      'design': 'Design',
      'product': 'Product',
      'marketing': 'Marketing',
      'sales': 'Sales',
      'customer-support': 'Customer Support',
      'operations': 'Operations',
      'hr': 'Human Resources',
      'finance': 'Finance',
      'legal': 'Legal',
      'other': 'Other'
    };
    return departments[department] || department;
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success-50 text-success-600', icon: 'CheckCircle' },
      draft: { color: 'bg-secondary-100 text-secondary-600', icon: 'FileEdit' },
      expired: { color: 'bg-error-50 text-error-600', icon: 'AlertCircle' },
      paused: { color: 'bg-warning-50 text-warning-600', icon: 'Pause' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  return (
    <div className="bg-background border border-border rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={16} className="text-secondary-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs..."
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="expired">Expired</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-surface-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <span>Job Title</span>
                  {sortBy === 'title' && (
                    <Icon name={sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={14} />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <span>Department</span>
                  {sortBy === 'department' && (
                    <Icon name={sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={14} />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden lg:table-cell">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">
                <button
                  onClick={() => handleSort('applications')}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <span>Applications</span>
                  {sortBy === 'applications' && (
                    <Icon name={sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={14} />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden lg:table-cell">
                <button
                  onClick={() => handleSort('datePosted')}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <span>Posted</span>
                  {sortBy === 'datePosted' && (
                    <Icon name={sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={14} />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden lg:table-cell">
                <button
                  onClick={() => handleSort('expiresAt')}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <span>Expires</span>
                  {sortBy === 'expiresAt' && (
                    <Icon name={sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={14} />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {sortedJobs.length > 0 ? (
              sortedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-surface transition-smooth">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start">
                      {job.isFeatured && (
                        <span className="inline-block mr-2">
                          <Icon name="Star" size={16} className="text-warning" />
                        </span>
                      )}
                      <div>
                        <div className="text-sm font-medium text-text-primary">{job.title}</div>
                        <div className="text-xs text-text-secondary hidden sm:block md:hidden">
                          {formatDepartment(job.department)}
                        </div>
                        <div className="text-xs text-text-secondary hidden sm:block md:hidden">
                          {formatLocation(job.location)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-text-primary">{formatDepartment(job.department)}</div>
                    <div className="text-xs text-text-secondary">{formatEmploymentType(job.employmentType)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm text-text-primary">{formatLocation(job.location)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(job.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-text-primary">{job.applications}</div>
                    <div className="text-xs text-text-secondary">{job.views} views</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm text-text-primary">{formatDate(job.datePosted)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm text-text-primary">{formatDate(job.expiresAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(job)}
                        className="text-primary hover:text-primary-700 transition-smooth"
                        title="Edit"
                      >
                        <Icon name="Edit" size={18} />
                      </button>
                      <button
                        onClick={() => onDuplicate(job)}
                        className="text-primary hover:text-primary-700 transition-smooth"
                        title="Duplicate"
                      >
                        <Icon name="Copy" size={18} />
                      </button>
                      {job.status === 'active' && (
                        <button
                          className="text-warning hover:text-warning-600 transition-smooth"
                          title="Pause"
                        >
                          <Icon name="Pause" size={18} />
                        </button>
                      )}
                      {job.status === 'paused' && (
                        <button
                          className="text-success hover:text-success-600 transition-smooth"
                          title="Resume"
                        >
                          <Icon name="Play" size={18} />
                        </button>
                      )}
                      {job.status === 'expired' && (
                        <button
                          className="text-primary hover:text-primary-700 transition-smooth"
                          title="Renew"
                        >
                          <Icon name="RefreshCw" size={18} />
                        </button>
                      )}
                      <button
                        className="text-error hover:text-error-600 transition-smooth"
                        title="Delete"
                      >
                        <Icon name="Trash2" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Icon name="Search" size={48} className="text-secondary-300 mb-4" />
                    <h3 className="text-lg font-medium text-text-primary mb-1">No jobs found</h3>
                    <p className="text-text-secondary">
                      {searchQuery ? 'Try adjusting your search or filters' : 'Create your first job posting to get started'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-border bg-surface-100 flex items-center justify-between">
        <div className="text-sm text-text-secondary">
          Showing <span className="font-medium">{sortedJobs.length}</span> of <span className="font-medium">{mockJobs.length}</span> jobs
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            className="btn-secondary px-3 py-1 text-sm"
            disabled={sortedJobs.length === 0}
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          <button
            className="btn-secondary px-3 py-1 text-sm"
            disabled={sortedJobs.length === 0}
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobManagementTable;