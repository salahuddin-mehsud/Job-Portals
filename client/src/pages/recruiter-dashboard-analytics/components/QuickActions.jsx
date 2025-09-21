import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      title: 'Post a New Job',
      description: 'Create a new job listing to attract candidates',
      icon: 'Plus',
      color: 'primary',
      link: '/job-posting-creation-management',
    },
    {
      id: 2,
      title: 'Schedule Interviews',
      description: 'Set up interviews with shortlisted candidates',
      icon: 'Calendar',
      color: 'warning',
      link: '#',
    },
    {
      id: 3,
      title: 'Send Bulk Messages',
      description: 'Communicate with multiple candidates at once',
      icon: 'Mail',
      color: 'accent',
      link: '#',
    },
    {
      id: 4,
      title: 'Generate Reports',
      description: 'Create custom reports for hiring metrics',
      icon: 'BarChart2',
      color: 'secondary',
      link: '#',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action) => (
        <Link
          key={action.id}
          to={action.link}
          className="card p-5 flex flex-col hover:shadow-md transition-smooth border-2 border-transparent hover:border-primary-100"
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${action.color}-50 mb-4`}>
            <Icon 
              name={action.icon} 
              size={24} 
              className={`text-${action.color}`} 
            />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">{action.title}</h3>
          <p className="text-sm text-text-secondary mb-4">{action.description}</p>
          <div className="mt-auto flex items-center text-primary font-medium">
            <span>Get Started</span>
            <Icon name="ArrowRight" size={16} className="ml-1" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;