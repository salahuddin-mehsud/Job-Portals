import React from 'react';
import Icon from 'components/AppIcon';

const CompanyDetailsForm = ({ formData, handleChange, errors }) => {
  const industries = [
    { id: 'tech', name: 'Technology' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'finance', name: 'Finance' },
    { id: 'education', name: 'Education' },
    { id: 'retail', name: 'Retail' },
    { id: 'manufacturing', name: 'Manufacturing' },
    { id: 'hospitality', name: 'Hospitality' },
    { id: 'media', name: 'Media & Entertainment' },
    { id: 'nonprofit', name: 'Non-Profit' },
    { id: 'other', name: 'Other' }
  ];
  
  const companySizes = [
    { id: '1-10', name: '1-10 employees' },
    { id: '11-50', name: '11-50 employees' },
    { id: '51-200', name: '51-200 employees' },
    { id: '201-500', name: '201-500 employees' },
    { id: '501-1000', name: '501-1000 employees' },
    { id: '1001-5000', name: '1001-5000 employees' },
    { id: '5001+', name: '5001+ employees' }
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-2">Company Details</h2>
        <p className="text-text-secondary">
          Tell us about your company to help candidates learn more about your organization.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Company Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
            Company Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input-field ${errors.name ? 'border-error focus:ring-error' : ''}`}
            placeholder="Enter your company name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.name}
            </p>
          )}
        </div>
        
        {/* Industry & Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-text-primary mb-1">
              Industry <span className="text-error">*</span>
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={`input-field ${errors.industry ? 'border-error focus:ring-error' : ''}`}
            >
              <option value="">Select industry</option>
              {industries.map(industry => (
                <option key={industry.id} value={industry.id}>
                  {industry.name}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors.industry}
              </p>
            )}
          </div>
          
          {/* Company Size */}
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-text-primary mb-1">
              Company Size
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select company size</option>
              {companySizes.map(size => (
                <option key={size.id} value={size.id}>
                  {size.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-text-primary mb-1">
            Company Website
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Globe" size={16} color="var(--color-secondary-500)" />
            </div>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`input-field pl-10 ${errors.website ? 'border-error focus:ring-error' : ''}`}
              placeholder="https://yourcompany.com"
            />
          </div>
          {errors.website && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.website}
            </p>
          )}
        </div>
        
        {/* Company Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
            Company Description <span className="text-error">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className={`input-field ${errors.description ? 'border-error focus:ring-error' : ''}`}
            placeholder="Tell candidates about your company's mission, values, and culture..."
          ></textarea>
          {errors.description ? (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.description}
            </p>
          ) : (
            <p className="mt-1 text-xs text-text-secondary">
              Minimum 100 characters. This description will appear on your company profile and job listings.
            </p>
          )}
        </div>
        
        {/* Headquarters & Founding Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Headquarters */}
          <div>
            <label htmlFor="headquarters" className="block text-sm font-medium text-text-primary mb-1">
              Headquarters Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="MapPin" size={16} color="var(--color-secondary-500)" />
              </div>
              <input
                type="text"
                id="headquarters"
                name="headquarters"
                value={formData.headquarters}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="City, State, Country"
              />
            </div>
          </div>
          
          {/* Founding Year */}
          <div>
            <label htmlFor="foundingYear" className="block text-sm font-medium text-text-primary mb-1">
              Year Founded
            </label>
            <select
              id="foundingYear"
              name="foundingYear"
              value={formData.foundingYear}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select year</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsForm;