// src/pages/admin-moderation-management/components/PlatformAnalytics.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const PlatformAnalytics = ({ dateRange }) => {
  const communityHealthMetrics = [
    {
      id: 1,
      title: 'User Engagement Rate',
      value: '74.3%',
      change: 5.2,
      changeType: 'increase',
      icon: 'Users',
      color: 'primary',
      description: 'Average daily active users'
    },
    {
      id: 2,
      title: 'Job Posting Volume',
      value: '2,847',
      change: 12.8,
      changeType: 'increase',
      icon: 'Briefcase',
      color: 'secondary',
      description: 'Jobs posted this period'
    },
    {
      id: 3,
      title: 'Successful Placements',
      value: '324',
      change: 8.7,
      changeType: 'increase',
      icon: 'CheckCircle',
      color: 'accent',
      description: 'Confirmed job placements'
    },
    {
      id: 4,
      title: 'Revenue Tracking',
      value: '$45,672',
      change: 15.3,
      changeType: 'increase',
      icon: 'DollarSign',
      color: 'warning',
      description: 'Platform revenue generated'
    }
  ];

  const topPerformingCategories = [
    { name: 'Technology', jobs: 847, applications: 3251, fillRate: '23%' },
    { name: 'Healthcare', jobs: 523, applications: 1892, fillRate: '31%' },
    { name: 'Finance', jobs: 412, applications: 1543, fillRate: '19%' },
    { name: 'Marketing', jobs: 387, applications: 1234, fillRate: '27%' },
    { name: 'Sales', jobs: 298, applications: 987, fillRate: '33%' },
  ];

  const userGrowthData = [
    { month: 'Jan', jobSeekers: 1200, recruiters: 89, companies: 67 },
    { month: 'Feb', jobSeekers: 1450, recruiters: 102, companies: 78 },
    { month: 'Mar', jobSeekers: 1680, recruiters: 118, companies: 91 },
    { month: 'Apr', jobSeekers: 1920, recruiters: 134, companies: 105 },
    { month: 'May', jobSeekers: 2180, recruiters: 151, companies: 119 },
    { month: 'Jun', jobSeekers: 2456, recruiters: 168, companies: 134 },
  ];

  const platformHealth = {
    systemUptime: '99.9%',
    avgResponseTime: '245ms',
    errorRate: '0.02%',
    satisfactionScore: '4.8/5'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary">Platform Analytics</h2>
        <p className="text-sm text-text-secondary mt-1">
          Community health metrics, user engagement, and revenue tracking with exportable reporting
        </p>
      </div>

      {/* Community Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {communityHealthMetrics.map((metric) => (
          <div key={metric.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-secondary mb-1">{metric.title}</p>
                <h3 className="text-2xl font-bold text-text-primary mb-1">{metric.value}</h3>
                <p className="text-xs text-text-secondary">{metric.description}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${metric.color}-50 flex-shrink-0`}>
                <Icon 
                  name={metric.icon} 
                  size={24} 
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

      {/* Platform Health Overview */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-6">Platform Health Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Zap" size={24} className="text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary">{platformHealth.systemUptime}</h4>
              <p className="text-sm text-text-secondary">System Uptime</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Clock" size={24} className="text-blue-600" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary">{platformHealth.avgResponseTime}</h4>
              <p className="text-sm text-text-secondary">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="AlertTriangle" size={24} className="text-red-600" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary">{platformHealth.errorRate}</h4>
              <p className="text-sm text-text-secondary">Error Rate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Star" size={24} className="text-yellow-600" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary">{platformHealth.satisfactionScore}</h4>
              <p className="text-sm text-text-secondary">User Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-text-primary">User Growth Trends</h3>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-text-secondary">Job Seekers</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-text-secondary">Recruiters</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-text-secondary">Companies</span>
              </div>
            </div>
          </div>
          
          {/* Simplified Chart Representation */}
          <div className="h-64 bg-surface-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Icon name="BarChart2" size={48} className="text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary">User Growth Chart</p>
              <p className="text-xs text-text-secondary mt-1">Interactive chart would be rendered here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Categories */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-6">Top Performing Job Categories</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Category</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Jobs Posted</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Applications</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Fill Rate</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Performance</th>
                </tr>
              </thead>
              <tbody>
                {topPerformingCategories.map((category, index) => (
                  <tr key={category.name} className="border-b border-border">
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-primary">{index + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-text-primary">{category.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-text-primary">{category.jobs.toLocaleString()}</td>
                    <td className="py-4 text-sm text-text-primary">{category.applications.toLocaleString()}</td>
                    <td className="py-4">
                      <span className="text-sm font-medium text-success">{category.fillRate}</span>
                    </td>
                    <td className="py-4">
                      <div className="w-full bg-surface-100 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: category.fillRate }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Export Analytics Reports</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="btn-secondary flex items-center justify-center space-x-2 h-12">
              <Icon name="FileText" size={16} />
              <span>User Report</span>
            </button>
            <button className="btn-secondary flex items-center justify-center space-x-2 h-12">
              <Icon name="BarChart2" size={16} />
              <span>Analytics Report</span>
            </button>
            <button className="btn-secondary flex items-center justify-center space-x-2 h-12">
              <Icon name="DollarSign" size={16} />
              <span>Revenue Report</span>
            </button>
            <button className="btn-secondary flex items-center justify-center space-x-2 h-12">
              <Icon name="Download" size={16} />
              <span>Full Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;