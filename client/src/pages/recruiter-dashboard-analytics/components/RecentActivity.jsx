import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'application',
      content: 'New application received for Senior Frontend Developer',
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      user: {
        name: 'Emily Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      },
      icon: 'FileText',
      iconColor: 'primary',
    },
    {
      id: 2,
      type: 'interview',
      content: 'Interview scheduled with Michael Rodriguez for Product Manager',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      user: {
        name: 'Michael Rodriguez',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      },
      icon: 'Calendar',
      iconColor: 'warning',
    },
    {
      id: 3,
      type: 'status',
      content: 'Sarah Chen moved to Assessment stage',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      user: {
        name: 'Sarah Chen',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      },
      icon: 'ArrowRight',
      iconColor: 'accent',
    },
    {
      id: 4,
      type: 'offer',
      content: 'Offer letter sent to David Wilson for UX/UI Designer',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      user: {
        name: 'David Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      },
      icon: 'Send',
      iconColor: 'success',
    },
    {
      id: 5,
      type: 'job',
      content: 'New job posted: Marketing Specialist',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: 'Briefcase',
      iconColor: 'secondary',
    },
  ];

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getIconBackground = (color) => {
    const backgrounds = {
      primary: 'bg-primary-50',
      secondary: 'bg-secondary-100',
      accent: 'bg-accent-50',
      warning: 'bg-warning-50',
      success: 'bg-success-50',
      error: 'bg-error-50',
    };
    return backgrounds[color] || 'bg-secondary-100';
  };

  const getIconColor = (color) => {
    const colors = {
      primary: 'text-primary',
      secondary: 'text-secondary-600',
      accent: 'text-accent',
      warning: 'text-warning',
      success: 'text-success',
      error: 'text-error',
    };
    return colors[color] || 'text-secondary-600';
  };

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-text-primary">Recent Activity</h3>
        <button className="text-text-secondary hover:text-text-primary transition-smooth">
          <Icon name="MoreHorizontal" size={20} />
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex">
            <div className={`flex-shrink-0 h-10 w-10 rounded-full ${getIconBackground(activity.iconColor)} flex items-center justify-center mr-3`}>
              <Icon name={activity.icon} size={18} className={getIconColor(activity.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-text-primary">{activity.content}</div>
              <div className="mt-1 flex items-center">
                {activity.user && (
                  <div className="flex items-center mr-2">
                    <Image 
                      src={activity.user.avatar} 
                      alt={activity.user.name} 
                      className="h-4 w-4 rounded-full mr-1"
                    />
                    <span className="text-xs text-text-secondary truncate">{activity.user.name}</span>
                  </div>
                )}
                <span className="text-xs text-text-secondary">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <button className="w-full text-center text-sm text-primary hover:text-primary-700 transition-smooth">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;