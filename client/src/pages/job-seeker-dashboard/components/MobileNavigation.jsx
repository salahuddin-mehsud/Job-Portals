import React from 'react';
import Icon from 'components/AppIcon';

const MobileNavigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'applications', label: 'Applications', icon: 'FileText' },
    { id: 'saved', label: 'Saved', icon: 'Bookmark' },
    { id: 'alerts', label: 'Alerts', icon: 'Bell' },
  ];

  return (
    <div className="flex items-center justify-around py-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center px-4 py-2 min-h-touch min-w-touch ${
            activeTab === item.id
              ? 'text-primary-600' :'text-text-secondary'
          }`}
        >
          <Icon 
            name={item.icon} 
            size={20} 
            className={activeTab === item.id ? 'fill-current' : ''} 
          />
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MobileNavigation;