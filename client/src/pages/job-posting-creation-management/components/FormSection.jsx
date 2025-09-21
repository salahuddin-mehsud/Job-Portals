import React from 'react';
import Icon from 'components/AppIcon';

const FormSection = ({ title, icon, children, isExpanded, toggleExpanded }) => {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={toggleExpanded}
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center space-x-2">
          <Icon name={icon} size={20} className="text-secondary-500" />
          <h3 className="text-base font-medium text-text-primary">{title}</h3>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-secondary-500"
        />
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default FormSection;