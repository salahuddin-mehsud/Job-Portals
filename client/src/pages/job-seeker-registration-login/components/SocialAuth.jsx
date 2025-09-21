import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const SocialAuth = ({ onSuccess, isLoading }) => {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const socialProviders = [
    {
      name: 'Google',
      icon: 'Chrome',
      color: 'bg-white border-border text-text-primary hover:bg-surface',
      mockUser: {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        provider: 'Google'
      }
    },
    {
      name: 'LinkedIn',
      icon: 'Linkedin',
      color: 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700',
      mockUser: {
        name: 'Jane Smith',
        email: 'jane.smith@linkedin.com',
        provider: 'LinkedIn'
      }
    }
  ];

const handleSocialAuth = async (provider) => {
  if (isLoading) return;

  setLoadingProvider(provider.name);

  try {
    // Simulate OAuth flow (or use real backend OAuth)
    setTimeout(() => {
      const { mockUser } = provider;

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", "social-login-mock-token"); // replace with real token if available

      // Trigger onSuccess
      onSuccess({ user: mockUser, token: "social-login-mock-token" });

      setLoadingProvider(null);
    }, 1500);
  } catch (err) {
    console.error(err);
    setLoadingProvider(null);
  }
};

  return (
    <div className="space-y-3">
      {socialProviders.map((provider) => (
        <button
          key={provider.name}
          onClick={() => handleSocialAuth(provider)}
          disabled={isLoading || loadingProvider}
          className={`w-full flex items-center justify-center space-x-3 py-3 px-4 border rounded-md font-medium transition-smooth min-h-touch ${provider.color} ${
            loadingProvider === provider.name ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {loadingProvider === provider.name ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting to {provider.name}...</span>
            </>
          ) : (
            <>
              <Icon name={provider.icon} size={20} />
              <span>Continue with {provider.name}</span>
            </>
          )}
        </button>
      ))}
      
      {/* Mock Credentials Info */}
      <div className="bg-accent-50 border border-accent-100 rounded-md p-3 mt-4">
        <div className="flex items-start">
          <Icon name="Info" size={16} color="var(--color-accent)" className="mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-accent-700 font-medium mb-1">Demo Social Login:</p>
            <p className="text-accent-600">Click any social button to simulate OAuth authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialAuth;