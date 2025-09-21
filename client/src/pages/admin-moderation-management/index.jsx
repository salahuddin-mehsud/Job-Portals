// src/pages/admin-moderation-management/index.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

import Breadcrumb from 'components/ui/Breadcrumb';
import ModerationQueue from './components/ModerationQueue';
import ContentModerationPanel from './components/ContentModerationPanel';
import UserManagementSection from './components/UserManagementSection';
import PlatformAnalytics from './components/PlatformAnalytics';
import ConfigurationPanels from './components/ConfigurationPanels';
import SystemMonitoring from './components/SystemMonitoring';
import AuditTrail from './components/AuditTrail';

const AdminModerationManagement = () => {
  const [activeTab, setActiveTab] = useState('moderation');
  const [dateRange, setDateRange] = useState('30d');

  const adminInfo = {
    name: "Admin User",
    avatar: "https://images.pexels.com/photo-220453/pexels-photo-220453.jpeg",
    role: "Super Administrator",
    lastLogin: "2024-01-15 10:30 AM"
  };

  const sidebarItems = [
    { icon: 'Shield', label: 'Moderation Queue', value: 'moderation' },
    { icon: 'FileText', label: 'Content Review', value: 'content' },
    { icon: 'Users', label: 'User Management', value: 'users' },
    { icon: 'BarChart2', label: 'Platform Analytics', value: 'analytics' },
    { icon: 'Settings', label: 'Configuration', value: 'config' },
    { icon: 'Activity', label: 'System Monitor', value: 'system' },
    { icon: 'History', label: 'Audit Trail', value: 'audit' },
  ];

  const dateRangeOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'This year', value: 'year' },
    { label: 'All time', value: 'all' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'moderation':
        return <ModerationQueue />;
      case 'content':
        return <ContentModerationPanel />;
      case 'users':
        return <UserManagementSection />;
      case 'analytics':
        return <PlatformAnalytics dateRange={dateRange} />;
      case 'config':
        return <ConfigurationPanels />;
      case 'system':
        return <SystemMonitoring />;
      case 'audit':
        return <AuditTrail />;
      default:
        return <ModerationQueue />;
    }
  };

  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumb />
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-background rounded-lg shadow-sm border border-border overflow-hidden">
              {/* Admin Info */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                      <Icon name="Shield" size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <h3 className="text-sm font-medium text-text-primary truncate">{adminInfo.name}</h3>
                    <p className="text-xs text-text-secondary truncate">{adminInfo.role}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="px-2 py-4 space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setActiveTab(item.value)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                      activeTab === item.value
                        ? 'bg-primary-50 text-primary' :'text-text-secondary hover:bg-surface-100 hover:text-text-primary'
                    }`}
                  >
                    <Icon 
                      name={item.icon} 
                      size={20} 
                      className={`flex-shrink-0 ${activeTab === item.value ? 'text-primary' : 'text-text-secondary'}`} 
                    />
                    <span className="ml-3 truncate">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* System Status */}
              <div className="p-4 border-t border-border">
                <div className="bg-surface-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-text-secondary">System Status</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="text-xs text-text-secondary mb-2">
                    Last check: 2 min ago
                  </div>
                  <Link 
                    to="#" 
                    className="text-xs text-primary hover:text-primary-700 font-medium flex items-center"
                  >
                    <span>View logs</span>
                    <Icon name="ExternalLink" size={12} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-background rounded-lg shadow-sm border border-border p-6 mb-6">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">Admin Management</h1>
                  <p className="mt-1 text-sm text-text-secondary">
                    Monitor platform activity, manage users, and configure system settings
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  {['analytics', 'audit'].includes(activeTab) && (
                    <div className="relative">
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="input-field py-2 pl-3 pr-10 text-sm"
                      >
                        {dateRangeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <Icon name="ChevronDown" size={16} className="text-text-secondary" />
                      </div>
                    </div>
                  )}
                  <button className="btn-primary flex items-center justify-center space-x-2">
                    <Icon name="Download" size={16} />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-surface rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-secondary mb-1">Pending Reviews</p>
                        <p className="text-2xl font-bold text-yellow-600">23</p>
                        <p className="text-xs text-text-secondary">+3 from yesterday</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Icon name="Clock" size={24} className="text-yellow-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-surface rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-secondary mb-1">Reported Content</p>
                        <p className="text-2xl font-bold text-red-600">7</p>
                        <p className="text-xs text-text-secondary">-2 from yesterday</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <Icon name="Flag" size={24} className="text-red-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-surface rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-secondary mb-1">User Verifications</p>
                        <p className="text-2xl font-bold text-blue-600">12</p>
                        <p className="text-xs text-text-secondary">+5 from yesterday</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon name="UserCheck" size={24} className="text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-surface rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-secondary mb-1">Active Users</p>
                        <p className="text-2xl font-bold text-green-600">1,247</p>
                        <p className="text-xs text-text-secondary">+47 from yesterday</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon name="TrendingUp" size={24} className="text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Content Area */}
              <div className="bg-surface rounded-lg border border-border p-4">
                {renderTabContent()}
              </div>
            </div>

            {/* Mobile Navigation Tabs */}
            <div className="lg:hidden bg-background rounded-lg shadow-sm border border-border p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setActiveTab(item.value)}
                    className={`flex flex-col items-center p-3 rounded-md transition-smooth ${
                      activeTab === item.value
                        ? 'bg-primary-50 text-primary' :'text-text-secondary hover:bg-surface-100 hover:text-text-primary'
                    }`}
                  >
                    <Icon 
                      name={item.icon} 
                      size={20} 
                      className={`mb-1 ${activeTab === item.value ? 'text-primary' : 'text-text-secondary'}`} 
                    />
                    <span className="text-xs font-medium text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModerationManagement;