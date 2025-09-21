import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SocialAuth from './components/SocialAuth';

const JobSeekerRegistrationLogin = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Sign In', path: '/job-seeker-registration-login', isLast: true }
  ];

  const handleAuthSuccess = (userData) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Authentication successful:', userData);
      navigate('/job-seeker-dashboard');
    }, 1500);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb customItems={breadcrumbItems} />
        
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Briefcase" size={32} color="white" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome to NicheBoard Pro
            </h1>
            <p className="text-text-secondary">
              {activeTab === 'login' ?'Sign in to access your personalized job dashboard' :'Create your account to start your job search journey'
              }
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-background rounded-lg p-1 mb-6 border border-border">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => handleTabSwitch('login')}
                className={`py-3 px-4 rounded-md text-sm font-medium transition-smooth ${
                  activeTab === 'login' ?'bg-primary text-white shadow-sm' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleTabSwitch('register')}
                className={`py-3 px-4 rounded-md text-sm font-medium transition-smooth ${
                  activeTab === 'register' ?'bg-primary text-white shadow-sm' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-background rounded-lg shadow-soft border border-border p-6 mb-6">
            {/* Social Authentication */}
            <SocialAuth onSuccess={handleAuthSuccess} isLoading={isLoading} />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-text-secondary">Or continue with email</span>
              </div>
            </div>

            {/* Forms */}
            {activeTab === 'login' ? (
              <LoginForm onSuccess={handleAuthSuccess} isLoading={isLoading} />
            ) : (
              <RegisterForm onSuccess={handleAuthSuccess} isLoading={isLoading} />
            )}
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <Link 
                to="/terms" 
                className="text-text-secondary hover:text-primary-600 transition-smooth"
              >
                Terms of Service
              </Link>
              <span className="text-border">•</span>
              <Link 
                to="/privacy" 
                className="text-text-secondary hover:text-primary-600 transition-smooth"
              >
                Privacy Policy
              </Link>
            </div>
            
            <div className="text-sm text-text-secondary">
              Looking to hire talent?{' '}
              <Link 
                to="/company-registration-profile-setup" 
                className="text-primary-600 hover:text-primary-700 font-medium transition-smooth"
              >
                Post a job
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerRegistrationLogin;