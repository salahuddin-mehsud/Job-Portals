import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const ProfileCompletion = ({ completion }) => {
  // Profile completion suggestions based on completion percentage

  const getSuggestions = () => {
    if (completion < 30) {
      return [
        { id: 1, text: 'Upload your resume', icon: 'FileUp', path: '#' },
        { id: 2, text: 'Add your work experience', icon: 'Briefcase', path: '#' },
        { id: 3, text: 'Add your education', icon: 'GraduationCap', path: '#' },
        { id: 4, text: 'Add your skills', icon: 'Code', path: '#' }
      ];
    } else if (completion < 60) {
      return [
        { id: 1, text: 'Add your profile picture', icon: 'Image', path: '#' },
        { id: 2, text: 'Complete your bio', icon: 'FileText', path: '#' },
        { id: 3, text: 'Add your certifications', icon: 'Award', path: '#' }
      ];
    } else if (completion < 90) {
      return [
        { id: 1, text: 'Add your portfolio links', icon: 'Link', path: '#' },
        { id: 2, text: 'Set your job preferences', icon: 'Sliders', path: '#' }
      ];
    } else {
      return [
        { id: 1, text: 'Review your profile', icon: 'CheckCircle', path: '#' }
      ];
    }
  };

  const suggestions = getSuggestions();
  
  // Determine color based on completion percentage
  const getCompletionColor = () => {
    if (completion < 30) return 'text-error-600';
    if (completion < 60) return 'text-warning-600';
    if (completion < 90) return 'text-primary-600';
    return 'text-success-600';
  };

  const getCompletionBgColor = () => {
    if (completion < 30) return 'bg-error-600';
    if (completion < 60) return 'bg-warning-600';
    if (completion < 90) return 'bg-primary-600';
    return 'bg-success-600';
  };

  return (
    <div className="bg-background rounded-lg border border-border shadow-soft">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Profile Completion</h3>
      </div>
      
      <div className="p-6">
        {/* Completion Percentage */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">
            {completion < 30 ? 'Just Started' : 
             completion < 60 ? 'Making Progress' : 
             completion < 90 ? 'Almost There': 'Well Done!'}
          </span>
          <span className={`text-lg font-bold ${getCompletionColor()}`}>
            {completion}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-surface rounded-full h-2.5 mb-6">
          <div 
            className={`h-2.5 rounded-full ${getCompletionBgColor()}`} 
            style={{ width: `${completion}%` }}
          ></div>
        </div>
        
        {/* Suggestions */}
        <h4 className="text-sm font-medium text-text-primary mb-3">
          Complete these steps to improve your profile:
        </h4>
        
        <ul className="space-y-3">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <Link 
                to={suggestion.path}
                className="flex items-center p-3 rounded-lg hover:bg-surface transition-smooth group"
              >
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 group-hover:bg-primary-100 transition-smooth">
                  <Icon name={suggestion.icon} size={16} className="text-primary-600" />
                </div>
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-smooth">
                  {suggestion.text}
                </span>
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className="ml-auto text-secondary-400 group-hover:text-primary-600 transition-smooth" 
                />
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Edit Profile Button */}
        <Link 
          to="#"
          className="w-full mt-6 btn-secondary flex items-center justify-center"
        >
          <Icon name="Edit" size={16} className="mr-2" />
          <span>Edit Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default ProfileCompletion;