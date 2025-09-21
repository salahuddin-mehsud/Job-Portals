import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const JobAlerts = () => {
  // Mock job alerts data
  const initialAlerts = [
    {
      id: 1,
      name: 'React Developer',
      keywords: ['React', 'JavaScript', 'Frontend'],
      location: 'San Francisco, CA',
      locationType: 'Remote',
      frequency: 'daily',
      notificationTypes: ['email', 'push'],
      isActive: true,
      lastSent: '1 day ago',
      matchCount: 12
    },
    {
      id: 2,
      name: 'UX/UI Designer',
      keywords: ['UX', 'UI', 'Figma', 'Design'],
      location: 'New York, NY',
      locationType: 'Any',
      frequency: 'weekly',
      notificationTypes: ['email'],
      isActive: true,
      lastSent: '5 days ago',
      matchCount: 8
    },
    {
      id: 3,
      name: 'Product Manager',
      keywords: ['Product Management', 'Agile', 'Scrum'],
      location: 'Austin, TX',
      locationType: 'On-site',
      frequency: 'daily',
      notificationTypes: ['push'],
      isActive: false,
      lastSent: '2 weeks ago',
      matchCount: 5
    }
  ];

  const [alerts, setAlerts] = useState(initialAlerts);
  const [isCreating, setIsCreating] = useState(false);
  const [newAlert, setNewAlert] = useState({
    name: '',
    keywords: [],
    location: '',
    locationType: 'Any',
    frequency: 'daily',
    notificationTypes: ['email', 'push'],
    isActive: true
  });
  const [keywordInput, setKeywordInput] = useState('');

  const handleToggleAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const handleDeleteAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !newAlert.keywords.includes(keywordInput.trim())) {
      setNewAlert({
        ...newAlert,
        keywords: [...newAlert.keywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setNewAlert({
      ...newAlert,
      keywords: newAlert.keywords.filter(k => k !== keyword)
    });
  };

  const handleToggleNotificationType = (type) => {
    if (newAlert.notificationTypes.includes(type)) {
      setNewAlert({
        ...newAlert,
        notificationTypes: newAlert.notificationTypes.filter(t => t !== type)
      });
    } else {
      setNewAlert({
        ...newAlert,
        notificationTypes: [...newAlert.notificationTypes, type]
      });
    }
  };

  const handleCreateAlert = () => {
    if (newAlert.name.trim() && newAlert.keywords.length > 0) {
      const newId = Math.max(0, ...alerts.map(a => a.id)) + 1;
      setAlerts([
        ...alerts,
        {
          ...newAlert,
          id: newId,
          lastSent: 'Never',
          matchCount: 0
        }
      ]);
      setNewAlert({
        name: '',
        keywords: [],
        location: '',
        locationType: 'Any',
        frequency: 'daily',
        notificationTypes: ['email', 'push'],
        isActive: true
      });
      setIsCreating(false);
    }
  };

  return (
    <div>
      {/* Create Alert Button */}
      {!isCreating && (
        <div className="mb-6">
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary flex items-center"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            <span>Create New Alert</span>
          </button>
        </div>
      )}
      
      {/* Create Alert Form */}
      {isCreating && (
        <div className="bg-background border border-border rounded-lg shadow-soft p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-text-primary">Create Job Alert</h4>
            <button
              onClick={() => setIsCreating(false)}
              className="text-text-secondary hover:text-text-primary transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Alert Name */}
            <div>
              <label htmlFor="alertName" className="block text-sm font-medium text-text-primary mb-1">
                Alert Name
              </label>
              <input
                type="text"
                id="alertName"
                value={newAlert.name}
                onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                placeholder="e.g., Frontend Developer Jobs"
                className="input-field"
              />
            </div>
            
            {/* Keywords */}
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-text-primary mb-1">
                Keywords
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="keywords"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                  placeholder="Add skills, job titles, etc."
                  className="input-field rounded-r-none flex-1"
                />
                <button
                  onClick={handleAddKeyword}
                  className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary-700 transition-smooth"
                >
                  Add
                </button>
              </div>
              
              {newAlert.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newAlert.keywords.map((keyword, index) => (
                    <div 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-600"
                    >
                      <span>{keyword}</span>
                      <button
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="ml-2 text-primary-600 hover:text-primary-700 transition-smooth"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={newAlert.location}
                  onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                  placeholder="City, State, or Country"
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="locationType" className="block text-sm font-medium text-text-primary mb-1">
                  Job Type
                </label>
                <select
                  id="locationType"
                  value={newAlert.locationType}
                  onChange={(e) => setNewAlert({ ...newAlert, locationType: e.target.value })}
                  className="input-field"
                >
                  <option value="Any">Any</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>
            
            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Alert Frequency
              </label>
              <div className="flex space-x-4">
                {['daily', 'weekly', 'monthly'].map((freq) => (
                  <label key={freq} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="frequency"
                      checked={newAlert.frequency === freq}
                      onChange={() => setNewAlert({ ...newAlert, frequency: freq })}
                      className="form-radio h-4 w-4 text-primary border-secondary-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-text-secondary capitalize">{freq}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Notification Types */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Notification Methods
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={newAlert.notificationTypes.includes('email')}
                    onChange={() => handleToggleNotificationType('email')}
                    className="form-checkbox h-4 w-4 text-primary border-secondary-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-text-secondary">Email</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={newAlert.notificationTypes.includes('push')}
                    onChange={() => handleToggleNotificationType('push')}
                    className="form-checkbox h-4 w-4 text-primary border-secondary-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-text-secondary">Push Notification</span>
                </label>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-border rounded-md text-text-secondary hover:bg-surface transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAlert}
                className="btn-primary"
                disabled={!newAlert.name.trim() || newAlert.keywords.length === 0}
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Alerts List */}
      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className="bg-background border border-border rounded-lg shadow-soft overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert.isActive ? 'bg-success-50' : 'bg-secondary-100'}`}>
                      <Icon 
                        name="Bell" 
                        size={20} 
                        className={alert.isActive ? 'text-success-600' : 'text-secondary-400'} 
                      />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-base font-medium text-text-primary flex items-center">
                        {alert.name}
                        {alert.matchCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-50 text-primary-600">
                            {alert.matchCount} matches
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-text-secondary mt-1">
                        {alert.keywords.join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-3 sm:mt-0">
                    <div className="flex items-center mr-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <span className="mr-2 text-sm text-text-secondary">
                          {alert.isActive ? 'Active' : 'Paused'}
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={alert.isActive}
                            onChange={() => handleToggleAlert(alert.id)}
                            className="sr-only"
                          />
                          <div className={`w-10 h-5 rounded-full transition-smooth ${alert.isActive ? 'bg-success-500' : 'bg-secondary-300'}`}></div>
                          <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-smooth ${alert.isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                      </label>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-1 text-text-secondary hover:text-error-600 transition-smooth"
                      aria-label="Delete alert"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="px-4 sm:px-6 py-3 bg-surface text-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center text-text-secondary">
                  <Icon name="MapPin" size={16} className="mr-2" />
                  <span>{alert.location || 'Any Location'} • {alert.locationType}</span>
                </div>
                
                <div className="flex items-center text-text-secondary">
                  <Icon name="Clock" size={16} className="mr-2" />
                  <span>Sent {alert.frequency}, last sent {alert.lastSent}</span>
                </div>
                
                <div className="flex items-center text-text-secondary">
                  <Icon name="Bell" size={16} className="mr-2" />
                  <span>
                    {alert.notificationTypes.includes('email') && 'Email'}
                    {alert.notificationTypes.includes('email') && alert.notificationTypes.includes('push') && ' & '}
                    {alert.notificationTypes.includes('push') && 'Push'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-background border border-border rounded-lg shadow-soft p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
            <Icon name="Bell" size={24} className="text-secondary-400" />
          </div>
          <h4 className="text-lg font-medium text-text-primary mb-2">No Job Alerts</h4>
          <p className="text-sm text-text-secondary mb-4">
            Create job alerts to get notified when new jobs matching your criteria are posted.
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary inline-flex items-center"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            <span>Create Alert</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default JobAlerts;