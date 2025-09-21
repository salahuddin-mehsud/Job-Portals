import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const RecentActivity = () => {
  // Mock activity data
  const activities = [
    {
      id: 1,
      type: 'application_status',
      title: 'Application Status Update',
      company: 'TechGrowth Inc.',
      companyLogo: 'https://randomuser.me/api/portraits/men/41.jpg',
      position: 'Senior Frontend Developer',
      status: 'interview',
      message: 'Your application has moved to the interview stage',
      timestamp: '2 hours ago',
      actions: [
        { label: 'View Details', icon: 'Eye', path: '/job-detail-application' },
        { label: 'Schedule Interview', icon: 'Calendar', path: '#' }
      ]
    },
    {
      id: 2,
      type: 'job_recommendation',
      title: 'New Job Match',
      company: 'Innovate Solutions',
      companyLogo: 'https://randomuser.me/api/portraits/women/68.jpg',
      position: 'UX/UI Designer',
      match: '92% match',
      message: 'Based on your profile and preferences',
      timestamp: '5 hours ago',
      actions: [
        { label: 'View Job', icon: 'ExternalLink', path: '/job-detail-application' },
        { label: 'Save', icon: 'Bookmark', path: '#' }
      ]
    },
    {
      id: 3,
      type: 'application_status',
      title: 'Application Status Update',
      company: 'Global Systems',
      companyLogo: 'https://randomuser.me/api/portraits/men/55.jpg',
      position: 'Full Stack Developer',
      status: 'reviewed',
      message: 'Your application has been reviewed by the hiring team',
      timestamp: '1 day ago',
      actions: [
        { label: 'View Details', icon: 'Eye', path: '/job-detail-application' }
      ]
    },
    {
      id: 4,
      type: 'job_alert',
      title: 'New Jobs in Your Alert',
      alertName: 'React Developer Jobs',
      count: 3,
      message: 'New jobs matching your "React Developer" alert',
      timestamp: '2 days ago',
      actions: [
        { label: 'View Jobs', icon: 'List', path: '/job-search-browse' }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return { name: 'Send', color: 'text-primary-600', bgColor: 'bg-primary-50' };
      case 'reviewed':
        return { name: 'CheckCircle', color: 'text-secondary-600', bgColor: 'bg-secondary-50' };
      case 'interview':
        return { name: 'Calendar', color: 'text-success-600', bgColor: 'bg-success-50' };
      case 'rejected':
        return { name: 'XCircle', color: 'text-error-600', bgColor: 'bg-error-50' };
      case 'offer':
        return { name: 'Award', color: 'text-warning-600', bgColor: 'bg-warning-50' };
      default:
        return { name: 'Info', color: 'text-secondary-600', bgColor: 'bg-secondary-50' };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'application_status':
        return { name: 'FileText', color: 'text-primary-600', bgColor: 'bg-primary-50' };
      case 'job_recommendation':
        return { name: 'Zap', color: 'text-warning-600', bgColor: 'bg-warning-50' };
      case 'job_alert':
        return { name: 'Bell', color: 'text-success-600', bgColor: 'bg-success-50' };
      default:
        return { name: 'Activity', color: 'text-secondary-600', bgColor: 'bg-secondary-50' };
    }
  };

  return (
    <div className="bg-background rounded-lg border border-border shadow-soft">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
        <Link to="#" className="text-sm text-primary hover:text-primary-700 transition-smooth flex items-center">
          <span>View All</span>
          <Icon name="ChevronRight" size={16} className="ml-1" />
        </Link>
      </div>
      
      <div className="divide-y divide-border">
        {activities.map((activity) => {
          const typeIconData = getTypeIcon(activity.type);
          const statusIconData = activity.status ? getStatusIcon(activity.status) : null;
          
          return (
            <div key={activity.id} className="p-4 sm:p-6 hover:bg-surface transition-smooth">
              <div className="flex items-start">
                {activity.type === 'application_status' || activity.type === 'job_recommendation' ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mr-4">
                    <Image 
                      src={activity.companyLogo} 
                      alt={activity.company} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeIconData.bgColor} flex-shrink-0 mr-4`}>
                    <Icon name={typeIconData.name} size={20} className={typeIconData.color} />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-medium text-text-primary truncate">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-text-secondary ml-2 whitespace-nowrap">
                      {activity.timestamp}
                    </span>
                  </div>
                  
                  {(activity.type === 'application_status' || activity.type === 'job_recommendation') && (
                    <p className="text-sm text-text-secondary mb-1">
                      {activity.position} at {activity.company}
                    </p>
                  )}
                  
                  {activity.type === 'job_alert' && (
                    <p className="text-sm text-text-secondary mb-1">
                      {activity.count} new jobs in "{activity.alertName}"
                    </p>
                  )}
                  
                  <div className="flex items-center mt-1 mb-3">
                    {activity.status && (
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusIconData.bgColor} ${statusIconData.color} mr-2`}>
                        <Icon name={statusIconData.name} size={12} className="mr-1" />
                        <span className="capitalize">{activity.status}</span>
                      </div>
                    )}
                    
                    {activity.match && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-50 text-success-600">
                        <Icon name="Check" size={12} className="mr-1" />
                        <span>{activity.match}</span>
                      </div>
                    )}
                    
                    <span className="text-xs text-text-secondary ml-auto">
                      {activity.message}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {activity.actions.map((action, index) => (
                      <Link 
                        key={index}
                        to={action.path}
                        className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-surface text-text-secondary hover:bg-secondary-100 transition-smooth"
                      >
                        <Icon name={action.icon} size={14} className="mr-1" />
                        <span>{action.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {activities.length === 0 && (
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
            <Icon name="Calendar" size={24} className="text-secondary-400" />
          </div>
          <h4 className="text-lg font-medium text-text-primary mb-2">No Recent Activity</h4>
          <p className="text-sm text-text-secondary mb-4">
            Your recent activities will appear here
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

export default RecentActivity;