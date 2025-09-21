import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const ApplicationTracker = () => {
  const [filter, setFilter] = useState('all');
  
  // Mock application data
  const allApplications = [
    {
      id: 1,
      jobTitle: 'Senior Frontend Developer',
      company: 'TechGrowth Inc.',
      companyLogo: 'https://randomuser.me/api/portraits/men/41.jpg',
      location: 'San Francisco, CA (Remote)',
      appliedDate: '2023-06-15',
      status: 'interview',
      statusText: 'Interview Scheduled',
      lastUpdated: '2 days ago',
      timeline: [
        { date: '2023-06-15', status: 'applied', text: 'Application Submitted' },
        { date: '2023-06-18', status: 'reviewed', text: 'Application Reviewed' },
        { date: '2023-06-22', status: 'interview', text: 'Interview Scheduled for June 28' }
      ]
    },
    {
      id: 2,
      jobTitle: 'UX/UI Designer',
      company: 'Innovate Solutions',
      companyLogo: 'https://randomuser.me/api/portraits/women/68.jpg',
      location: 'New York, NY (Hybrid)',
      appliedDate: '2023-06-10',
      status: 'offer',
      statusText: 'Offer Received',
      lastUpdated: '1 day ago',
      timeline: [
        { date: '2023-06-10', status: 'applied', text: 'Application Submitted' },
        { date: '2023-06-12', status: 'reviewed', text: 'Application Reviewed' },
        { date: '2023-06-15', status: 'interview', text: 'First Interview Completed' },
        { date: '2023-06-18', status: 'interview', text: 'Second Interview Completed' },
        { date: '2023-06-22', status: 'offer', text: 'Offer Received' }
      ]
    },
    {
      id: 3,
      jobTitle: 'Full Stack Developer',
      company: 'Global Systems',
      companyLogo: 'https://randomuser.me/api/portraits/men/55.jpg',
      location: 'Austin, TX (On-site)',
      appliedDate: '2023-06-05',
      status: 'rejected',
      statusText: 'Not Selected',
      lastUpdated: '3 days ago',
      timeline: [
        { date: '2023-06-05', status: 'applied', text: 'Application Submitted' },
        { date: '2023-06-08', status: 'reviewed', text: 'Application Reviewed' },
        { date: '2023-06-12', status: 'rejected', text: 'Not Selected for this Position' }
      ]
    },
    {
      id: 4,
      jobTitle: 'Product Manager',
      company: 'Future Innovations',
      companyLogo: 'https://randomuser.me/api/portraits/women/45.jpg',
      location: 'Seattle, WA (Remote)',
      appliedDate: '2023-06-20',
      status: 'applied',
      statusText: 'Application Submitted',
      lastUpdated: '5 days ago',
      timeline: [
        { date: '2023-06-20', status: 'applied', text: 'Application Submitted' }
      ]
    },
    {
      id: 5,
      jobTitle: 'DevOps Engineer',
      company: 'Cloud Solutions',
      companyLogo: 'https://randomuser.me/api/portraits/men/32.jpg',
      location: 'Chicago, IL (Remote)',
      appliedDate: '2023-06-18',
      status: 'reviewed',
      statusText: 'Application Reviewed',
      lastUpdated: '4 days ago',
      timeline: [
        { date: '2023-06-18', status: 'applied', text: 'Application Submitted' },
        { date: '2023-06-21', status: 'reviewed', text: 'Application Reviewed' }
      ]
    }
  ];

  const filteredApplications = filter === 'all' 
    ? allApplications 
    : allApplications.filter(app => app.status === filter);

  const getStatusInfo = (status) => {
    const statusMap = {
      applied: { icon: 'Send', color: 'text-primary-600', bgColor: 'bg-primary-50' },
      reviewed: { icon: 'CheckCircle', color: 'text-secondary-600', bgColor: 'bg-secondary-50' },
      interview: { icon: 'Calendar', color: 'text-success-600', bgColor: 'bg-success-50' },
      rejected: { icon: 'XCircle', color: 'text-error-600', bgColor: 'bg-error-50' },
      offer: { icon: 'Award', color: 'text-warning-600', bgColor: 'bg-warning-50' }
    };
    
    return statusMap[status] || statusMap.applied;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'All Applications' },
          { id: 'applied', label: 'Applied' },
          { id: 'reviewed', label: 'Reviewed' },
          { id: 'interview', label: 'Interview' },
          { id: 'offer', label: 'Offer' },
          { id: 'rejected', label: 'Rejected' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
              filter === tab.id
                ? 'bg-primary-50 text-primary-600' :'bg-surface text-text-secondary hover:bg-secondary-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const statusInfo = getStatusInfo(application.status);
            
            return (
              <div 
                key={application.id}
                className="bg-background border border-border rounded-lg shadow-soft overflow-hidden"
              >
                {/* Application Header */}
                <div className="p-4 sm:p-6 border-b border-border">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                      <Image 
                        src={application.companyLogo} 
                        alt={application.company} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-base font-medium text-text-primary">
                            {application.jobTitle}
                          </h4>
                          <p className="text-sm text-text-secondary mt-1">
                            {application.company} • {application.location}
                          </p>
                        </div>
                        
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} mt-2 sm:mt-0`}>
                          <Icon name={statusInfo.icon} size={16} className="mr-1" />
                          <span>{application.statusText}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center mt-3 text-sm">
                        <div className="flex items-center mr-4 text-text-secondary">
                          <Icon name="Calendar" size={16} className="mr-1" />
                          <span>Applied: {formatDate(application.appliedDate)}</span>
                        </div>
                        <div className="flex items-center text-text-secondary">
                          <Icon name="Clock" size={16} className="mr-1" />
                          <span>Last updated: {application.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Application Timeline */}
                <div className="p-4 sm:p-6">
                  <h5 className="text-sm font-medium text-text-primary mb-4">Application Timeline</h5>
                  
                  <div className="relative">
                    {application.timeline.map((event, index) => {
                      const eventStatusInfo = getStatusInfo(event.status);
                      const isLast = index === application.timeline.length - 1;
                      
                      return (
                        <div key={index} className="flex items-start mb-4 last:mb-0">
                          <div className="relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${eventStatusInfo.bgColor} z-10`}>
                              <Icon name={eventStatusInfo.icon} size={16} className={eventStatusInfo.color} />
                            </div>
                            {!isLast && (
                              <div className="absolute top-8 left-1/2 w-0.5 h-full -translate-x-1/2 bg-border"></div>
                            )}
                          </div>
                          
                          <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-text-primary">
                              {event.text}
                            </p>
                            <p className="text-xs text-text-secondary mt-1">
                              {formatDate(event.date)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Application Actions */}
                <div className="px-4 sm:px-6 py-3 bg-surface border-t border-border flex flex-wrap gap-2">
                  <Link 
                    to="/job-detail-application" 
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-smooth"
                  >
                    <Icon name="ExternalLink" size={16} className="mr-1" />
                    <span>View Job</span>
                  </Link>
                  
                  {application.status === 'interview' && (
                    <button className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-success-600 bg-success-50 hover:bg-success-100 transition-smooth">
                      <Icon name="Calendar" size={16} className="mr-1" />
                      <span>Schedule Interview</span>
                    </button>
                  )}
                  
                  {application.status === 'offer' && (
                    <button className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-warning-600 bg-warning-50 hover:bg-warning-100 transition-smooth">
                      <Icon name="FileText" size={16} className="mr-1" />
                      <span>Review Offer</span>
                    </button>
                  )}
                  
                  <button className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-text-secondary bg-background hover:bg-secondary-100 transition-smooth ml-auto">
                    <Icon name="MoreHorizontal" size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-background border border-border rounded-lg shadow-soft p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
            <Icon name="FileText" size={24} className="text-secondary-400" />
          </div>
          <h4 className="text-lg font-medium text-text-primary mb-2">No Applications Found</h4>
          <p className="text-sm text-text-secondary mb-4">
            {filter === 'all' ? "You haven't applied to any jobs yet." 
              : `You don't have any applications with '${filter}' status.`}
          </p>
          <Link to="/job-search-browse" className="btn-primary inline-flex items-center">
            <Icon name="Search" size={16} className="mr-2" />
            <span>Find Jobs</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;