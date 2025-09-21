import React from 'react';


const SearchFilters = ({ selectedFilters, onFilterChange, onClearAll, activeFiltersCount, onClose }) => {
  const locations = [
    'San Francisco, CA',
    'New York, NY',
    'Austin, TX',
    'Seattle, WA',
    'Boston, MA',
    'Los Angeles, CA',
    'Chicago, IL',
    'Miami, FL'
  ];

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship'
  ];

  const experienceLevels = [
    'Entry-level',
    'Mid-level',
    'Senior',
    'Executive'
  ];

  const companySizes = [
    '1-10',
    '10-50',
    '50-100',
    '100-200',
    '200-500',
    '500+'
  ];

  const salaryRanges = [
    '$40,000 - $60,000',
    '$60,000 - $80,000',
    '$80,000 - $100,000',
    '$100,000 - $120,000',
    '$120,000 - $150,000',
    '$150,000+'
  ];

  const postingDates = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '3d', label: 'Last 3 days' },
    { value: '7d', label: 'Last week' },
    { value: '30d', label: 'Last month' }
  ];

  const handleLocationChange = (location) => {
    const newLocations = selectedFilters.location.includes(location)
      ? selectedFilters.location.filter(l => l !== location)
      : [...selectedFilters.location, location];
    onFilterChange('location', newLocations);
  };

  const handleEmploymentTypeChange = (type) => {
    const newTypes = selectedFilters.employmentType.includes(type)
      ? selectedFilters.employmentType.filter(t => t !== type)
      : [...selectedFilters.employmentType, type];
    onFilterChange('employmentType', newTypes);
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Location Filter */}
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">Location</h4>
          <div className="space-y-2">
            {locations.map((location) => (
              <label key={location} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters.location.includes(location)}
                  onChange={() => handleLocationChange(location)}
                  className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                />
                <span className="text-sm text-text-secondary">{location}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Employment Type Filter */}
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">Employment Type</h4>
          <div className="space-y-2">
            {employmentTypes.map((type) => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters.employmentType.includes(type)}
                  onChange={() => handleEmploymentTypeChange(type)}
                  className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                />
                <span className="text-sm text-text-secondary">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Level Filter */}
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">Experience Level</h4>
          <select
            value={selectedFilters.experienceLevel}
            onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background"
          >
            <option value="">Any level</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Salary Range Filter */}
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">Salary Range</h4>
          <select
            value={selectedFilters.salaryRange}
            onChange={(e) => onFilterChange('salaryRange', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background"
          >
            <option value="">Any salary</option>
            {salaryRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        {/* Company Size Filter */}
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">Company Size</h4>
          <select
            value={selectedFilters.companySize}
            onChange={(e) => onFilterChange('companySize', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background"
          >
            <option value="">Any size</option>
            {companySizes.map((size) => (
              <option key={size} value={size}>{size} employees</option>
            ))}
          </select>
        </div>

        {/* Posting Date Filter */}
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">Posted</h4>
          <div className="space-y-2">
            {postingDates.map((date) => (
              <label key={date.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="postingDate"
                  value={date.value}
                  checked={selectedFilters.postingDate === date.value}
                  onChange={(e) => onFilterChange('postingDate', e.target.value)}
                  className="w-4 h-4 text-primary-600 border-border focus:ring-primary-500"
                />
                <span className="text-sm text-text-secondary">{date.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Remote Work Filter */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFilters.remoteWork}
              onChange={(e) => onFilterChange('remoteWork', e.target.checked)}
              className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-text-primary">Remote work only</span>
          </label>
        </div>
      </div>

      {onClose && (
        <div className="mt-6 pt-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full btn-primary"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;