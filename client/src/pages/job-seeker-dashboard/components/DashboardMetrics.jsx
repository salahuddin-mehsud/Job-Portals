import React from 'react';
import Icon from 'components/AppIcon';

const DashboardMetrics = ({ metrics }) => {
  const metricCards = [
    {
      id: 'applications',
      label: 'Applications Submitted',
      value: metrics.applicationsSubmitted,
      icon: 'FileText',
      color: 'primary',
      trend: '+3 this week',
      trendUp: true
    },
    {
      id: 'interviews',
      label: 'Interviews Scheduled',
      value: metrics.interviewsScheduled,
      icon: 'Calendar',
      color: 'success',
      trend: '+1 this week',
      trendUp: true
    },
    {
      id: 'saved',
      label: 'Saved Jobs',
      value: metrics.savedJobs,
      icon: 'Bookmark',
      color: 'warning',
      trend: 'Updated today',
      trendUp: null
    },
    {
      id: 'matches',
      label: 'New Matches',
      value: metrics.newMatches,
      icon: 'Zap',
      color: 'secondary',
      trend: 'Based on your profile',
      trendUp: null
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((card) => (
        <div 
          key={card.id}
          className="bg-background rounded-lg border border-border p-4 shadow-soft hover:shadow-modal transition-smooth"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-secondary text-sm">{card.label}</p>
              <h3 className="text-2xl font-bold mt-1 text-text-primary">{card.value}</h3>
              <div className="flex items-center mt-2 text-xs">
                {card.trendUp !== null && (
                  <Icon 
                    name={card.trendUp ? "TrendingUp" : "TrendingDown"} 
                    size={14} 
                    className={card.trendUp ? "text-success mr-1" : "text-error mr-1"} 
                  />
                )}
                <span className={card.trendUp === null ? "text-text-secondary" : (card.trendUp ? "text-success" : "text-error")}>
                  {card.trend}
                </span>
              </div>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${card.color}-50`}>
              <Icon 
                name={card.icon} 
                size={20} 
                className={`text-${card.color}-600`} 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;