import React from 'react';
import Icon from 'components/AppIcon';

const JobPreview = ({ formValues }) => {
  const formatSalary = () => {
    if (!formValues.salary.min && !formValues.salary.max) return null;
    
    const formatNumber = (num) => {
      if (!num) return '';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: formValues.salary.currency || 'USD',
        maximumFractionDigits: 0
      }).format(num);
    };
    
    const min = formatNumber(formValues.salary.min);
    const max = formatNumber(formValues.salary.max);
    
    if (min && max) {
      return `${min} - ${max}`;
    } else if (min) {
      return `From ${min}`;
    } else if (max) {
      return `Up to ${max}`;
    }
    
    return null;
  };
  
  const formatPeriod = () => {
    const periods = {
      yearly: '/year',
      monthly: '/month',
      hourly: '/hour'
    };
    return periods[formValues.salary.period] || '';
  };
  
  const formatLocation = () => {
    const { location } = formValues;
    
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
  
  const formatEmploymentType = () => {
    const types = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'contract': 'Contract',
      'temporary': 'Temporary',
      'internship': 'Internship',
      'volunteer': 'Volunteer'
    };
    
    return types[formValues.employmentType] || '';
  };
  
  const formatDepartment = () => {
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
    
    return departments[formValues.department] || '';
  };
  
  return (
    <div className="bg-background border border-border rounded-lg shadow-sm mb-6">
      <div className="px-6 py-4 border-b border-border bg-surface-100">
        <h3 className="text-lg font-semibold text-text-primary">Job Preview</h3>
        <p className="text-sm text-text-secondary">See how your job will appear to candidates</p>
      </div>
      
      <div className="p-6">
        {formValues.isFeatured && (
          <div className="mb-4 flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-50 text-warning-600">
              <Icon name="Star" size={12} className="mr-1" />
              Featured
            </span>
          </div>
        )}
        
        <h2 className="text-xl font-bold text-text-primary mb-2">
          {formValues.title || 'Job Title'}
        </h2>
        
        <div className="flex flex-wrap items-center text-sm text-text-secondary mb-4 gap-y-2">
          <div className="flex items-center mr-4">
            <Icon name="Building2" size={16} className="mr-1" />
            <span>Your Company</span>
          </div>
          
          {formatLocation() && (
            <div className="flex items-center mr-4">
              <Icon name="MapPin" size={16} className="mr-1" />
              <span>{formatLocation()}</span>
            </div>
          )}
          
          {formatEmploymentType() && (
            <div className="flex items-center mr-4">
              <Icon name="Clock" size={16} className="mr-1" />
              <span>{formatEmploymentType()}</span>
            </div>
          )}
          
          {formatDepartment() && (
            <div className="flex items-center mr-4">
              <Icon name="Users" size={16} className="mr-1" />
              <span>{formatDepartment()}</span>
            </div>
          )}
          
          {formValues.salary.isVisible && formatSalary() && (
            <div className="flex items-center">
              <Icon name="DollarSign" size={16} className="mr-1" />
              <span>{formatSalary()}{formatPeriod()}</span>
            </div>
          )}
        </div>
        
        {formValues.description ? (
          <div className="prose prose-sm max-w-none mb-4 text-text-primary">
            <h3 className="text-base font-medium">Description</h3>
            <p className="text-sm whitespace-pre-line">{formValues.description.length > 300 ? 
              `${formValues.description.substring(0, 300)}...` : 
              formValues.description}
            </p>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none mb-4 text-text-secondary italic">
            <p>Add a job description to see how it will appear here.</p>
          </div>
        )}
        
        {formValues.requirements && (
          <div className="prose prose-sm max-w-none mb-4 text-text-primary">
            <h3 className="text-base font-medium">Requirements</h3>
            <p className="text-sm whitespace-pre-line">{formValues.requirements.length > 150 ? 
              `${formValues.requirements.substring(0, 150)}...` : 
              formValues.requirements}
            </p>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-border-light">
          <button className="btn-primary w-full" disabled>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPreview;