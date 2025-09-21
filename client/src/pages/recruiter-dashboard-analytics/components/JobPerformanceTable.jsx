import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const JobPerformanceTable = () => {
  const [sortField, setSortField] = useState('views');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('all');

  const jobsData = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      posted: '2024-05-15',
      expires: '2024-06-15',
      status: 'active',
      views: 1245,
      applications: 48,
      costPerApplication: 8.75,
      conversionRate: 3.85,
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      posted: '2024-05-10',
      expires: '2024-06-10',
      status: 'active',
      views: 987,
      applications: 32,
      costPerApplication: 10.25,
      conversionRate: 3.24,
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      posted: '2024-05-05',
      expires: '2024-06-05',
      status: 'active',
      views: 756,
      applications: 18,
      costPerApplication: 15.50,
      conversionRate: 2.38,
    },
    {
      id: 4,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote',
      posted: '2024-04-28',
      expires: '2024-05-28',
      status: 'expired',
      views: 1102,
      applications: 41,
      costPerApplication: 9.15,
      conversionRate: 3.72,
    },
    {
      id: 5,
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Chicago, IL',
      posted: '2024-05-12',
      expires: '2024-06-12',
      status: 'active',
      views: 543,
      applications: 15,
      costPerApplication: 18.75,
      conversionRate: 2.76,
    },
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredJobs = filter === 'all' 
    ? jobsData 
    : jobsData.filter(job => job.status === filter);

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 px-6 pt-6">
        <h3 className="text-lg font-medium text-text-primary mb-3 sm:mb-0">Job Performance</h3>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field py-1.5 pl-3 pr-10 text-sm"
            >
              <option value="all">All Jobs</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <Icon name="ChevronDown" size={16} className="text-text-secondary" />
            </div>
          </div>
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={16} className="text-text-secondary" />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              className="input-field py-1.5 pl-10 pr-4 text-sm w-full"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-surface-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Job Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('views')}
              >
                <div className="flex items-center">
                  <span>Views</span>
                  {sortField === 'views' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                      className="ml-1" 
                    />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('applications')}
              >
                <div className="flex items-center">
                  <span>Applications</span>
                  {sortField === 'applications' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                      className="ml-1" 
                    />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('conversionRate')}
              >
                <div className="flex items-center">
                  <span>Conversion</span>
                  {sortField === 'conversionRate' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                      className="ml-1" 
                    />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('costPerApplication')}
              >
                <div className="flex items-center">
                  <span>Cost/App</span>
                  {sortField === 'costPerApplication' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                      className="ml-1" 
                    />
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Expires
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {sortedJobs.map((job) => (
              <tr key={job.id} className="hover:bg-surface-50 transition-smooth">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-primary">{job.title}</div>
                  <div className="text-xs text-text-secondary">{job.department} • {job.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.status === 'active' ?'bg-success-50 text-success-600' 
                      : job.status === 'expired' ?'bg-error-50 text-error-600' :'bg-secondary-100 text-secondary-600'
                  }`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  {job.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  {job.applications}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  {job.conversionRate.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  ${job.costPerApplication.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {formatDate(job.expires)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-text-secondary hover:text-primary transition-smooth">
                      <Icon name="Eye" size={16} />
                    </button>
                    <button className="text-text-secondary hover:text-primary transition-smooth">
                      <Icon name="Edit" size={16} />
                    </button>
                    <button className="text-text-secondary hover:text-error transition-smooth">
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 flex items-center justify-between border-t border-border">
        <div className="text-sm text-text-secondary">
          Showing <span className="font-medium">{sortedJobs.length}</span> of <span className="font-medium">{jobsData.length}</span> jobs
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-100 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon name="ChevronLeft" size={20} />
          </button>
          <button className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-100 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPerformanceTable;