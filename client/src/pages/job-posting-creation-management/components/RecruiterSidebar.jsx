import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';

const RecruiterSidebar = ({ isCollapsed, toggleCollapse, isMobile, closeMobileSidebar }) => {
  const location = useLocation();
  
  // Navigation items
  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/recruiter-dashboard-analytics', 
      icon: 'BarChart3',
      badge: null
    },
    { 
      label: 'Job Postings', 
      path: '/job-posting-creation-management', 
      icon: 'Briefcase',
      badge: { count: 6, color: 'bg-primary text-white' }
    },
    { 
      label: 'Applications', 
      path: '/job-detail-application', 
      icon: 'FileText',
      badge: { count: 12, color: 'bg-success text-white' }
    },
    { 
      label: 'Company Profile', 
      path: '/company-registration-profile-setup', 
      icon: 'Building2',
      badge: null
    },
    { 
      label: 'Browse Jobs', 
      path: '/job-search-browse', 
      icon: 'Search',
      badge: null
    }
  ];
  
  // Secondary navigation items
  const secondaryNavItems = [
    { label: 'Settings', path: '#', icon: 'Settings' },
    { label: 'Billing', path: '#', icon: 'CreditCard' },
    { label: 'Help & Support', path: '#', icon: 'HelpCircle' }
  ];
  
  // Check if a path is active
  const isActivePath = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="h-screen flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link to="/" className="flex items-center space-x-2" onClick={isMobile ? closeMobileSidebar : undefined}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Briefcase" size={20} color="white" />
          </div>
          {!isCollapsed && <span className="text-lg font-semibold text-text-primary">NicheBoard</span>}
        </Link>
        
        {!isMobile && (
          <button
            onClick={toggleCollapse}
            className="text-text-secondary hover:text-text-primary transition-smooth"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
          </button>
        )}
        
        {isMobile && (
          <button
            onClick={closeMobileSidebar}
            className="text-text-secondary hover:text-text-primary transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>
      
      {/* User Profile */}
      <div className={`p-4 border-b border-border ${isCollapsed ? 'items-center' : ''}`}>
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="User" size={20} className="text-primary" />
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="User" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-primary">Jane Smith</h3>
              <p className="text-xs text-text-secondary">Acme Inc.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-md transition-smooth ${
                isActivePath(item.path)
                  ? 'bg-primary-50 text-primary' :'text-text-secondary hover:bg-surface hover:text-text-primary'
              }`}
              onClick={isMobile ? closeMobileSidebar : undefined}
            >
              <div className="flex items-center">
                <Icon name={item.icon} size={20} className="flex-shrink-0" />
                {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
              </div>
              
              {!isCollapsed && item.badge && (
                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${item.badge.color}`}>
                  {item.badge.count}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Secondary Navigation */}
      <div className="p-4 border-t border-border">
        <nav className="space-y-1">
          {secondaryNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md transition-smooth text-text-secondary hover:bg-surface hover:text-text-primary ${
                isCollapsed ? 'justify-center' : ''
              }`}
              onClick={isMobile ? closeMobileSidebar : undefined}
            >
              <Icon name={item.icon} size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="ml-3 text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <button
          className={`flex items-center px-3 py-2 rounded-md transition-smooth text-text-secondary hover:bg-surface hover:text-error ${
            isCollapsed ? 'justify-center w-full' : ''
          }`}
        >
          <Icon name="LogOut" size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 text-sm">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default RecruiterSidebar;