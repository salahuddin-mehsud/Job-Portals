// src/pages/admin-moderation-management/components/AuditTrail.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const AuditTrail = () => {
  const [filterUser, setFilterUser] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [searchTerm, setSearchTerm] = useState('');

  const auditActivities = [
    {
      id: 1,
      timestamp: '2024-01-15 14:30:25',
      user: {
        name: 'Admin User',
        email: 'admin@jobboard.com',
        role: 'admin',
        avatar: 'https://images.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'
      },
      action: 'user_suspended',
      target: 'User: emily.davis@email.com',
      details: 'Suspended user account due to policy violations',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      changes: {
        before: { status: 'active' },
        after: { status: 'suspended', reason: 'Policy violations' }
      }
    },
    {
      id: 2,
      timestamp: '2024-01-15 13:45:12',
      user: {
        name: 'Sarah Johnson',
        email: 'sarah.j@jobboard.com',
        role: 'moderator',
        avatar: 'https://images.pexels.com/photo/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1'
      },
      action: 'job_approved',
      target: 'Job: Senior React Developer - TechCorp',
      details: 'Approved job posting with suggested edits',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      changes: {
        before: { status: 'pending_approval' },
        after: { status: 'approved', modified: true }
      }
    },
    {
      id: 3,
      timestamp: '2024-01-15 12:20:08',
      user: {
        name: 'Mike Chen',
        email: 'mike.chen@jobboard.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80'
      },
      action: 'coupon_created',
      target: 'Coupon: WELCOME50',
      details: 'Created new coupon code for 50% discount',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      changes: {
        before: null,
        after: { code: 'WELCOME50', discount: '50%', limit: 100 }
      }
    },
    {
      id: 4,
      timestamp: '2024-01-15 11:30:45',
      user: {
        name: 'Admin User',
        email: 'admin@jobboard.com',
        role: 'admin',
        avatar: 'https://images.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'
      },
      action: 'settings_updated',
      target: 'System Settings',
      details: 'Updated payment processing configuration',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      changes: {
        before: { stripe_webhook_enabled: false },
        after: { stripe_webhook_enabled: true, webhook_url: 'https://api.jobboard.com/webhook' }
      }
    },
    {
      id: 5,
      timestamp: '2024-01-15 10:15:22',
      user: {
        name: 'Sarah Johnson',
        email: 'sarah.j@jobboard.com',
        role: 'moderator',
        avatar: 'https://images.pexels.com/photo/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1'
      },
      action: 'content_rejected',
      target: 'Job: Marketing Assistant - StartupXYZ',
      details: 'Rejected job posting due to misleading description',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      changes: {
        before: { status: 'pending_approval' },
        after: { status: 'rejected', reason: 'Misleading job description' }
      }
    },
    {
      id: 6,
      timestamp: '2024-01-15 09:45:33',
      user: {
        name: 'Mike Chen',
        email: 'mike.chen@jobboard.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80'
      },
      action: 'user_verified',
      target: 'Company: TechCorp Inc.',
      details: 'Verified company profile and documents',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      changes: {
        before: { verified: false },
        after: { verified: true, verified_by: 'mike.chen@jobboard.com' }
      }
    }
  ];

  const getActionColor = (action) => {
    switch (action) {
      case 'user_suspended': return 'text-red-700 bg-red-100';
      case 'job_approved': return 'text-green-700 bg-green-100';
      case 'content_rejected': return 'text-red-700 bg-red-100';
      case 'coupon_created': return 'text-blue-700 bg-blue-100';
      case 'settings_updated': return 'text-purple-700 bg-purple-100';
      case 'user_verified': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'user_suspended': return 'UserX';
      case 'job_approved': return 'CheckCircle';
      case 'content_rejected': return 'XCircle';
      case 'coupon_created': return 'Tag';
      case 'settings_updated': return 'Settings';
      case 'user_verified': return 'UserCheck';
      default: return 'Activity';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-red-700 bg-red-100';
      case 'moderator': return 'text-purple-700 bg-purple-100';
      case 'user': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const filteredActivities = auditActivities.filter(activity => {
    const matchesUser = filterUser === 'all' || activity.user.role === filterUser;
    const matchesAction = filterAction === 'all' || activity.action === filterAction;
    const matchesSearch = searchTerm === '' || 
      activity.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesUser && matchesAction && matchesSearch;
  });

  const exportAuditTrail = () => {
    console.log('Exporting audit trail for date range:', dateRange);
    // Implement export functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary">Audit Trail</h2>
        <p className="text-sm text-text-secondary mt-1">
          Comprehensive activity logging with user attribution and timestamp tracking
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Search" size={16} className="text-text-secondary" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search activities..."
                  className="input-field pl-10 w-full sm:w-64"
                />
              </div>
              
              {/* User Filter */}
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="input-field"
              >
                <option value="all">All Users</option>
                <option value="admin">Admins</option>
                <option value="moderator">Moderators</option>
                <option value="user">Users</option>
              </select>
              
              {/* Action Filter */}
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="input-field"
              >
                <option value="all">All Actions</option>
                <option value="user_suspended">User Suspensions</option>
                <option value="job_approved">Job Approvals</option>
                <option value="content_rejected">Content Rejections</option>
                <option value="coupon_created">Coupon Creation</option>
                <option value="settings_updated">Settings Updates</option>
                <option value="user_verified">User Verifications</option>
              </select>
              
              {/* Date Range */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="input-field"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={exportAuditTrail}
                className="btn-secondary flex items-center space-x-2"
              >
                <Icon name="Download" size={16} />
                <span>Export</span>
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <Icon name="RefreshCw" size={16} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-6">Activity Timeline</h3>
          <div className="space-y-6">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {/* Timeline Line */}
                {index < filteredActivities.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Action Icon */}
                  <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name={getActionIcon(activity.action)} size={20} className="text-text-secondary" />
                  </div>
                  
                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Activity Header */}
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getActionColor(activity.action)}`}>
                            {activity.action.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-sm text-text-secondary">{activity.timestamp}</span>
                        </div>
                        
                        {/* User Info */}
                        <div className="flex items-center space-x-3 mb-3">
                          <Image 
                            src={activity.user.avatar} 
                            alt={activity.user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-sm font-medium text-text-primary">{activity.user.name}</span>
                            <span className={`ml-2 inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getRoleColor(activity.user.role)}`}>
                              {activity.user.role}
                            </span>
                          </div>
                        </div>
                        
                        {/* Activity Details */}
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-text-primary">Target: </span>
                            <span className="text-sm text-text-secondary">{activity.target}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-text-primary">Action: </span>
                            <span className="text-sm text-text-secondary">{activity.details}</span>
                          </div>
                          
                          {/* Changes */}
                          {activity.changes && (
                            <div className="mt-3 p-3 bg-surface-50 rounded-lg">
                              <h4 className="text-sm font-medium text-text-primary mb-2">Changes Made:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {activity.changes.before && (
                                  <div>
                                    <span className="text-xs font-medium text-red-600">Before:</span>
                                    <pre className="text-xs text-text-secondary mt-1 font-mono bg-red-50 p-2 rounded">
                                      {JSON.stringify(activity.changes.before, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                <div>
                                  <span className="text-xs font-medium text-green-600">After:</span>
                                  <pre className="text-xs text-text-secondary mt-1 font-mono bg-green-50 p-2 rounded">
                                    {JSON.stringify(activity.changes.after, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Technical Details */}
                          <div className="mt-3 text-xs text-text-secondary space-y-1">
                            <div>IP Address: {activity.ipAddress}</div>
                            <div>User Agent: {activity.userAgent.substring(0, 60)}...</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Menu */}
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Details
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={16} className="text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-primary">Total Activities</p>
              <p className="text-lg font-bold text-blue-600">{filteredActivities.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={16} className="text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-primary">Approvals</p>
              <p className="text-lg font-bold text-green-600">
                {filteredActivities.filter(a => a.action.includes('approved')).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Icon name="XCircle" size={16} className="text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-primary">Rejections</p>
              <p className="text-lg font-bold text-red-600">
                {filteredActivities.filter(a => a.action.includes('rejected') || a.action.includes('suspended')).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={16} className="text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-primary">Config Changes</p>
              <p className="text-lg font-bold text-purple-600">
                {filteredActivities.filter(a => a.action.includes('settings') || a.action.includes('created')).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;