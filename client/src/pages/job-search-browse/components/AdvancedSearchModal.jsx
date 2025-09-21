import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AdvancedSearchModal = ({ isOpen, onClose, selectedFilters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(selectedFilters);

  if (!isOpen) return null;

  const handleLocalFilterChange = (filterType, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApplyFilters = () => {
    Object.keys(localFilters).forEach(key => {
      onFilterChange(key, localFilters[key]);
    });
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      location: [],
      employmentType: [],
      salaryRange: '',
      companySize: '',
      postingDate: '',
      experienceLevel: '',
      remoteWork: false
    };
    setLocalFilters(resetFilters);
  };

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Marketing',
    'Sales',
    'Design',
    'Engineering',
    'Operations',
    'Human Resources'
  ];

  const skills = [
    'JavaScript',
    'React',
    'Python',
    'Node.js',
    'SQL',
    'AWS',
    'Docker',
    'Git',
    'TypeScript',
    'MongoDB'
  ];

  const benefits = [
    'Health Insurance',
    'Dental Insurance',
    'Vision Insurance',
    '401(k)',
    'Paid Time Off',
    'Flexible Schedule',
    'Work From Home',
    'Professional Development',
    'Stock Options',
    'Gym Membership'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-background shadow-modal rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-text-primary">Advanced Search</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface rounded-lg transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  placeholder="e.g., React, Product Manager, UX Design"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Developer, Marketing Manager"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="e.g., Google, Microsoft, Startup"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Industry
                </label>
                <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">Any industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              {/* Minimum Salary */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  placeholder="e.g., 80000"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Maximum Salary */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  placeholder="e.g., 150000"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-text-primary mb-3">
                Required Skills
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {skills.map((skill) => (
                  <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-text-secondary">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-text-primary mb-3">
                Benefits & Perks
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {benefits.map((benefit) => (
                  <label key={benefit} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-text-secondary">{benefit}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="mt-6 space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.remoteWork}
                  onChange={(e) => handleLocalFilterChange('remoteWork', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-text-primary">Remote work opportunities</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-text-primary">Include internships</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-text-primary">Exclude staffing agencies</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border bg-surface">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-background transition-smooth"
            >
              Reset All
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-background transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-700 rounded-lg transition-smooth"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchModal;