import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const DashboardSidebar = ({ activeTab, setActiveTab, userData }) => {

  
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'applications', label: 'Applications', icon: 'FileText' },
    { id: 'saved', label: 'Saved Jobs', icon: 'Bookmark' },
    { id: 'alerts', label: 'Job Alerts', icon: 'Bell' },
  ];

  const quickActions = [
    { id: 'profile', label: 'Edit Profile', icon: 'User', path: '#' },
    { id: 'settings', label: 'Notification Settings', icon: 'Settings', path: '/user-setting' },
  ];

  return (
    <div className="bg-background rounded-lg shadow-sm border border-border p-6 sticky top-24">
      {/* User Profile Section */}
      <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-border">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
          <Image 
            src={userData.profileImage} 
            alt={userData.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">{userData.name}</h3>
        <p className="text-sm text-text-secondary mt-1">{userData.email}</p>
        <button
  onClick={() => setActiveTab("editProfile")}
  className="mt-4 text-sm text-primary flex items-center hover:text-primary-700 transition-smooth"
>
  <Icon name="Edit" size={14} className="mr-1" />
  Edit Profile
</button>

      </div>

      {/* Navigation */}
      <nav className="mb-6">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Dashboard
        </h4>
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  activeTab === item.id
                    ? 'bg-primary-50 text-primary-600' :'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Actions */}
      <div>
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Quick Actions
        </h4>
        <ul className="space-y-1">
          {quickActions.map((action) => (
            <li key={action.id}>
              <Link
                to={action.path}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-smooth"
              >
                <Icon name={action.icon} size={18} />
                <span>{action.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Sign Out Button */}
      <div className="mt-6 pt-6 border-t border-border">
        <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-error hover:bg-error-50 transition-smooth">
          <Icon name="LogOut" size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;