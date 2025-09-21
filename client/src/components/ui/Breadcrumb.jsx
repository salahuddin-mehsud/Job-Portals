import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();
  
  const pathMappings = {
    '/': 'Home',
    '/job-search-browse': 'Browse Jobs',
    '/job-detail-application': 'Job Details',
    '/job-seeker-dashboard': 'Dashboard',
    '/job-seeker-registration-login': 'Sign In',
    '/company-registration-profile-setup': 'Company Setup',
    '/job-posting-creation-management': 'Post Job',
    '/recruiter-dashboard-analytics': 'Dashboard',
    '/admin-moderation-management': 'Admin Panel'
  };

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ label: 'Home', path: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = pathMappings[currentPath] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isLast: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (location.pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="mx-2 text-secondary-400" 
                aria-hidden="true"
              />
            )}
            {crumb.isLast || index === breadcrumbs.length - 1 ? (
              <span 
                className="text-text-primary font-medium truncate max-w-xs sm:max-w-sm"
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-primary-600 transition-smooth truncate max-w-xs sm:max-w-sm"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;