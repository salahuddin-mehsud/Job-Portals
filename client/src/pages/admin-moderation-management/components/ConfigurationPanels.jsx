// src/pages/admin-moderation-management/components/ConfigurationPanels.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ConfigurationPanels = () => {
  const [activePanel, setActivePanel] = useState('coupons');
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    type: 'percentage',
    expiryDate: '',
    usageLimit: '',
    description: ''
  });

  const configPanels = [
    { id: 'coupons', label: 'Coupon Codes', icon: 'Tag' },
    { id: 'featured', label: 'Featured Jobs', icon: 'Star' },
    { id: 'payments', label: 'Payment Settings', icon: 'CreditCard' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'general', label: 'General Settings', icon: 'Settings' }
  ];

  const existingCoupons = [
    {
      id: 1,
      code: 'WELCOME50',
      discount: '50%',
      type: 'percentage',
      used: 23,
      limit: 100,
      expires: '2024-03-15',
      status: 'active'
    },
    {
      id: 2,
      code: 'NEWUSER25',
      discount: '$25',
      type: 'fixed',
      used: 8,
      limit: 50,
      expires: '2024-02-28',
      status: 'active'
    },
    {
      id: 3,
      code: 'EXPIRED10',
      discount: '10%',
      type: 'percentage',
      used: 15,
      limit: 30,
      expires: '2024-01-10',
      status: 'expired'
    }
  ];

  const featuredJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      featuredUntil: '2024-02-15',
      views: 1247,
      applications: 67,
      status: 'active'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'StartupXYZ',
      featuredUntil: '2024-02-20',
      views: 892,
      applications: 34,
      status: 'active'
    }
  ];

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    console.log('Creating coupon:', newCoupon);
    // Implement coupon creation logic
    setNewCoupon({
      code: '',
      discount: '',
      type: 'percentage',
      expiryDate: '',
      usageLimit: '',
      description: ''
    });
  };

  const renderCouponsPanel = () => (
    <div className="space-y-6">
      {/* Create New Coupon */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Create New Coupon Code</h3>
          <form onSubmit={handleCouponSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Coupon Code</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  placeholder="e.g., SAVE20"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Discount Value</label>
                <div className="flex">
                  <select
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
                    className="input-field rounded-r-none w-24"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">$</option>
                  </select>
                  <input
                    type="number"
                    value={newCoupon.discount}
                    onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})}
                    placeholder={newCoupon.type === 'percentage' ? '20' : '25'}
                    className="input-field rounded-l-none flex-1"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={newCoupon.expiryDate}
                  onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Usage Limit</label>
                <input
                  type="number"
                  value={newCoupon.usageLimit}
                  onChange={(e) => setNewCoupon({...newCoupon, usageLimit: e.target.value})}
                  placeholder="100"
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
              <textarea
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                placeholder="Brief description of the coupon..."
                className="input-field"
                rows={3}
              />
            </div>
            <button type="submit" className="btn-primary">
              Create Coupon
            </button>
          </form>
        </div>
      </div>

      {/* Existing Coupons */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Existing Coupons</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Code</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Discount</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Usage</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Expires</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Status</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {existingCoupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-border">
                    <td className="py-4">
                      <span className="font-mono bg-surface-100 px-2 py-1 rounded text-sm">{coupon.code}</span>
                    </td>
                    <td className="py-4 text-sm text-text-primary">{coupon.discount}</td>
                    <td className="py-4 text-sm text-text-primary">{coupon.used}/{coupon.limit}</td>
                    <td className="py-4 text-sm text-text-primary">{coupon.expires}</td>
                    <td className="py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        coupon.status === 'active' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                      }`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                        <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeaturedJobsPanel = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Featured Job Management</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Job</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Featured Until</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Performance</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Status</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {featuredJobs.map((job) => (
                  <tr key={job.id} className="border-b border-border">
                    <td className="py-4">
                      <div>
                        <div className="text-sm font-medium text-text-primary">{job.title}</div>
                        <div className="text-sm text-text-secondary">{job.company}</div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-text-primary">{job.featuredUntil}</td>
                    <td className="py-4">
                      <div className="text-sm">
                        <div className="text-text-primary">{job.views} views</div>
                        <div className="text-text-secondary">{job.applications} applications</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-green-700 bg-green-100">
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">Extend</button>
                        <button className="text-red-600 hover:text-red-700 text-sm">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettingsPanel = () => (
    <div className="card">
      <div className="p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Payment Processing Settings</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-text-primary mb-3">Stripe Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Publishable Key</label>
                <input type="text" className="input-field" placeholder="pk_live_..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Secret Key</label>
                <input type="password" className="input-field" placeholder="sk_live_..." />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-text-primary mb-3">Pricing Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Basic Job Posting</label>
                <input type="number" className="input-field" placeholder="29.99" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Featured Job</label>
                <input type="number" className="input-field" placeholder="99.99" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Premium Listing</label>
                <input type="number" className="input-field" placeholder="199.99" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsPanel = () => (
    <div className="card">
      <div className="p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Notification Template Customization</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email Templates</label>
            <select className="input-field mb-4">
              <option>Welcome Email</option>
              <option>Job Application Confirmation</option>
              <option>Password Reset</option>
              <option>Payment Confirmation</option>
            </select>
            <textarea 
              className="input-field" 
              rows={8}
              placeholder="Email template content..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">SMS Settings</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Enable SMS notifications</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Send application confirmations</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Send payment receipts</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneralSettingsPanel = () => (
    <div className="card">
      <div className="p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">General Platform Settings</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-text-primary mb-3">Site Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Site Name</label>
                <input type="text" className="input-field" defaultValue="JobBoard Pro" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Support Email</label>
                <input type="email" className="input-field" defaultValue="support@jobboard.com" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-text-primary mb-3">Content Moderation</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Auto-moderate job postings</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Require company verification</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Manual approval for new users</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activePanel) {
      case 'coupons': return renderCouponsPanel();
      case 'featured': return renderFeaturedJobsPanel();
      case 'payments': return renderPaymentSettingsPanel();
      case 'notifications': return renderNotificationsPanel();
      case 'general': return renderGeneralSettingsPanel();
      default: return renderCouponsPanel();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary">Configuration Panels</h2>
        <p className="text-sm text-text-secondary mt-1">
          Manage coupon codes, featured jobs, payment settings, and notification templates
        </p>
      </div>

      {/* Panel Navigation */}
      <div className="card">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {configPanels.map((panel) => (
              <button
                key={panel.id}
                onClick={() => setActivePanel(panel.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-smooth ${
                  activePanel === panel.id
                    ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name={panel.icon} size={16} />
                <span className="text-sm font-medium">{panel.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Panel Content */}
      {renderContent()}
    </div>
  );
};

export default ConfigurationPanels;