import React from 'react';
import Icon from 'components/AppIcon';

const MetricsCards = () => {
  const metrics = [
    {
      id: 1,
      title: 'Active Jobs',
      value: 12,
      change: 2,
      changeType: 'increase',
      icon: 'Briefcase',
      color: 'primary',
    },
    {
      id: 2,
      title: 'Total Applications',
      value: 247,
      change: 18.3,
      changeType: 'increase',
      icon: 'FileText',
      color: 'secondary',
    },
    {
      id: 3,
      title: 'Interview Conversions',
      value: '32%',
      change: 5.4,
      changeType: 'increase',
      icon: 'Users',
      color: 'accent',
    },
    {
      id: 4,
      title: 'Hiring Success Rate',
      value: '8.5%',
      change: 1.2,
      changeType: 'decrease',
      icon: 'CheckCircle',
      color: 'warning',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div key={metric.id} className="card p-5 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">{metric.title}</p>
              <h3 className="text-2xl font-bold text-text-primary">{metric.value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${metric.color}-50`}>
              <Icon 
                name={metric.icon} 
                size={20} 
                className={`text-${metric.color}`} 
              />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className={`flex items-center ${
              metric.changeType === 'increase' ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={metric.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className="mr-1" 
              />
              <span className="text-sm font-medium">{metric.change}%</span>
            </div>
            <span className="text-xs text-text-secondary ml-2">vs. last period</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;