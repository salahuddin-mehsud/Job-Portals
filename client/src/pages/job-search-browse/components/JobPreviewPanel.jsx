import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const JobPreviewPanel = ({ job, onClose, isSaved, onSave, formatTimeAgo }) => {
  if (!job) return null;

  return (
    <div className="bg-background border border-border rounded-lg shadow-soft h-fit sticky top-6">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
              <Image
                src={job.logo}
                alt={`${job.company} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-1">{job.title}</h3>
              <p className="text-text-secondary font-medium">{job.company}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onSave}
              className={`p-2 rounded-lg transition-smooth ${
                isSaved 
                  ? 'text-error bg-error-50 hover:bg-error-100' :'text-text-secondary hover:text-error hover:bg-error-50'
              }`}
            >
              <Icon name="Heart" size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {job.featured && (
          <div className="flex items-center space-x-1 mb-3">
            <Icon name="Star" size={16} color="#059669" />
            <span className="text-xs font-medium text-accent-600 uppercase tracking-wide">Featured Job</span>
          </div>
        )}

        <div className="space-y-2 text-sm text-text-secondary">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={16} />
            <span>{job.location}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} />
            <span>{job.employmentType}</span>
          </div>

          {job.remoteWork && (
            <div className="flex items-center space-x-2">
              <Icon name="Wifi" size={16} />
              <span>Remote work available</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={16} />
            <span>{job.salaryRange}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} />
            <span>Posted {formatTimeAgo(job.postedDate)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Description */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Job Description</h4>
          <div className="text-sm text-text-secondary space-y-2">
            {job.description.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Requirements</h4>
          <div className="space-y-2">
            {job.requirements.map((requirement, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Icon name="Check" size={14} color="#059669" className="mt-0.5 flex-shrink-0" />
                <span className="text-sm text-text-secondary">{requirement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Company Info</h4>
          <div className="space-y-2 text-sm text-text-secondary">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={14} />
              <span>{job.companySize} employees</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={14} />
              <span>{job.experienceLevel} level position</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-border space-y-3">
        <Link
          to="/job-detail-application"
          className="w-full btn-primary text-center block"
        >
          Apply Now
        </Link>
        
        <Link
          to="/job-detail-application"
          className="w-full btn-secondary text-center block"
        >
          View Full Details
        </Link>

        <div className="flex items-center justify-center space-x-4 pt-2">
          <button className="flex items-center space-x-1 text-sm text-text-secondary hover:text-text-primary transition-smooth">
            <Icon name="Share2" size={16} />
            <span>Share</span>
          </button>
          
          <button className="flex items-center space-x-1 text-sm text-text-secondary hover:text-text-primary transition-smooth">
            <Icon name="Flag" size={16} />
            <span>Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPreviewPanel;