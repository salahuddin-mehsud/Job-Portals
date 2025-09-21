import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const PreviewProfile = ({ formData }) => {
  const industries = {
    'tech': 'Technology',
    'healthcare': 'Healthcare',
    'finance': 'Finance',
    'education': 'Education',
    'retail': 'Retail',
    'manufacturing': 'Manufacturing',
    'hospitality': 'Hospitality',
    'media': 'Media & Entertainment',
    'nonprofit': 'Non-Profit',
    'other': 'Other'
  };
  
  const companySizes = {
    '1-10': '1-10 employees',
    '11-50': '11-50 employees',
    '51-200': '51-200 employees',
    '201-500': '201-500 employees',
    '501-1000': '501-1000 employees',
    '1001-5000': '1001-5000 employees',
    '5001+': '5001+ employees'
  };
  
  // Mock job listings for the preview
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      type: 'Full-time',
      postedDate: '2 days ago',
      salary: '$120,000 - $160,000'
    },
    {
      id: 2,
      title: 'Product Manager',
      location: 'Remote',
      type: 'Full-time',
      postedDate: '1 week ago',
      salary: '$110,000 - $140,000'
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      location: 'New York, NY',
      type: 'Full-time',
      postedDate: '3 days ago',
      salary: '$90,000 - $120,000'
    }
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-2">Preview Your Company Profile</h2>
        <p className="text-text-secondary">
          This is how your company profile will appear to job seekers. Review all information before completing setup.
        </p>
      </div>
      
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-surface-100 p-6 border-b border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border border-border flex items-center justify-center mb-4 md:mb-0 md:mr-6">
              {formData.logoPreview ? (
                <Image 
                  src={formData.logoPreview} 
                  alt={formData.name || 'Company logo'} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <Icon name="Building2" size={32} className="text-secondary-400" />
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary mb-1">
                {formData.name || 'Your Company Name'}
              </h1>
              <div className="flex flex-wrap items-center text-text-secondary text-sm">
                {formData.industry && (
                  <span className="flex items-center mr-4 mb-2">
                    <Icon name="Briefcase" size={14} className="mr-1" />
                    {industries[formData.industry] || formData.industry}
                  </span>
                )}
                
                {formData.headquarters && (
                  <span className="flex items-center mr-4 mb-2">
                    <Icon name="MapPin" size={14} className="mr-1" />
                    {formData.headquarters}
                  </span>
                )}
                
                {formData.size && (
                  <span className="flex items-center mr-4 mb-2">
                    <Icon name="Users" size={14} className="mr-1" />
                    {companySizes[formData.size] || formData.size}
                  </span>
                )}
                
                {formData.website && (
                  <span className="flex items-center mb-2">
                    <Icon name="Globe" size={14} className="mr-1" />
                    <a 
                      href={formData.website.startsWith('http') ? formData.website : `https://${formData.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-700 transition-smooth"
                    >
                      {formData.website.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button className="btn-primary flex items-center space-x-2">
                <Icon name="Bell" size={16} />
                <span>Follow</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-background border-b border-border">
          <div className="flex overflow-x-auto">
            <button className="px-6 py-3 text-primary border-b-2 border-primary font-medium">
              About
            </button>
            <button className="px-6 py-3 text-text-secondary hover:text-text-primary transition-smooth">
              Jobs
            </button>
            <button className="px-6 py-3 text-text-secondary hover:text-text-primary transition-smooth">
              Reviews
            </button>
            <button className="px-6 py-3 text-text-secondary hover:text-text-primary transition-smooth">
              Photos
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-text-primary mb-4">About {formData.name || 'Us'}</h2>
            <div className="prose max-w-none text-text-secondary">
              <p>{formData.description || 'Your company description will appear here. Make sure to provide a comprehensive overview of your company, including your mission, values, and what makes your organization unique.'}</p>
            </div>
          </div>
          
          {/* Company Info */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface rounded-lg p-4 border border-border">
                <h3 className="text-sm font-medium text-text-secondary mb-2">Industry</h3>
                <p className="text-text-primary">{industries[formData.industry] || 'Not specified'}</p>
              </div>
              
              <div className="bg-surface rounded-lg p-4 border border-border">
                <h3 className="text-sm font-medium text-text-secondary mb-2">Company Size</h3>
                <p className="text-text-primary">{companySizes[formData.size] || 'Not specified'}</p>
              </div>
              
              <div className="bg-surface rounded-lg p-4 border border-border">
                <h3 className="text-sm font-medium text-text-secondary mb-2">Founded</h3>
                <p className="text-text-primary">{formData.foundingYear || 'Not specified'}</p>
              </div>
              
              <div className="bg-surface rounded-lg p-4 border border-border">
                <h3 className="text-sm font-medium text-text-secondary mb-2">Headquarters</h3>
                <p className="text-text-primary">{formData.headquarters || 'Not specified'}</p>
              </div>
            </div>
          </div>
          
          {/* Culture Photos */}
          {formData.culturePhotos.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Company Culture</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.culturePhotos.map((photo, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border border-border">
                    <div className="h-48">
                      <Image 
                        src={URL.createObjectURL(photo)} 
                        alt={formData.culturePhotosCaptions[index] || `Company culture photo ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {formData.culturePhotosCaptions[index] && (
                      <div className="p-3 bg-surface">
                        <p className="text-sm text-text-secondary">{formData.culturePhotosCaptions[index]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Open Positions */}
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Open Positions</h2>
            {mockJobs.length > 0 ? (
              <div className="space-y-4">
                {mockJobs.map(job => (
                  <div key={job.id} className="bg-surface rounded-lg p-4 border border-border hover:border-primary transition-smooth">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-text-primary mb-1">{job.title}</h3>
                        <div className="flex flex-wrap items-center text-text-secondary text-sm">
                          <span className="flex items-center mr-4 mb-2">
                            <Icon name="MapPin" size={14} className="mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center mr-4 mb-2">
                            <Icon name="Clock" size={14} className="mr-1" />
                            {job.type}
                          </span>
                          <span className="flex items-center mr-4 mb-2">
                            <Icon name="Calendar" size={14} className="mr-1" />
                            Posted {job.postedDate}
                          </span>
                          <span className="flex items-center mb-2">
                            <Icon name="DollarSign" size={14} className="mr-1" />
                            {job.salary}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <button className="btn-primary">View Job</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-100 rounded-lg p-6 text-center">
                <Icon name="Briefcase" size={32} className="mx-auto mb-2 text-secondary-400" />
                <h3 className="text-lg font-medium text-text-primary mb-1">No open positions yet</h3>
                <p className="text-text-secondary mb-4">
                  After completing your company profile, you'll be able to post job openings.
                </p>
                <button className="btn-secondary">
                  Post a Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-primary-50 rounded-lg p-4 border border-primary-100">
        <div className="flex items-start">
          <Icon name="Info" size={20} className="text-primary mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-1">Ready to complete your setup?</h3>
            <p className="text-sm text-text-secondary">
              Once you complete the setup process, your company profile will be live and you can start posting jobs immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewProfile;