import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Breadcrumb from 'components/ui/Breadcrumb';
import MetricsCards from './components/MetricsCards';
import ApplicationsChart from './components/ApplicationsChart';
import CandidatePipeline from './components/CandidatePipeline';
import JobPerformanceTable from './components/JobPerformanceTable';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import SourceAttribution from './components/SourceAttribution';
import DemographicInsights from './components/DemographicInsights';
import PaymentHistory from './components/PaymentHistory';

const RecruiterDashboardAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const companyInfo = {
    name: "TechInnovate Solutions",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    subscription: "Premium Plan",
    expiresOn: "2024-12-31"
  };

  const sidebarItems = [
    { icon: 'LayoutDashboard', label: 'Overview', value: 'overview' },
    { icon: 'Briefcase', label: 'Jobs', value: 'jobs' },
    { icon: 'Users', label: 'Candidates', value: 'candidates' },
    { icon: 'BarChart2', label: 'Analytics', value: 'analytics' },
    { icon: 'CreditCard', label: 'Billing', value: 'billing' },
    { icon: 'Building2', label: 'Company', value: 'company' },
    { icon: 'Settings', label: 'Settings', value: 'settings' },
  ];

  const dateRangeOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'This year', value: 'year' },
    { label: 'All time', value: 'all' },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-surface min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 z-20 flex flex-col pt-16 bg-background border-r border-border transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'w-64' : 'w-20'
          } lg:static lg:translate-x-0`}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Company Info */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Image 
                    src={companyInfo.logo} 
                    alt={companyInfo.name} 
                    className={`rounded-lg ${sidebarOpen ? 'w-12 h-12' : 'w-10 h-10'}`}
                  />
                </div>
                {sidebarOpen && (
                  <div className="ml-3 overflow-hidden">
                    <h3 className="text-sm font-medium text-text-primary truncate">{companyInfo.name}</h3>
                    <p className="text-xs text-text-secondary truncate">{companyInfo.subscription}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                    activeTab === item.value
                      ? 'bg-primary-50 text-primary' :'text-text-secondary hover:bg-surface-100 hover:text-text-primary'
                  }`}
                >
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    className={`flex-shrink-0 ${activeTab === item.value ? 'text-primary' : 'text-text-secondary'}`} 
                  />
                  {sidebarOpen && <span className="ml-3 truncate">{item.label}</span>}
                </button>
              ))}
            </nav>

            {/* Subscription Info */}
            {sidebarOpen && (
              <div className="p-4 border-t border-border">
                <div className="bg-surface-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-text-secondary">Subscription</span>
                    <span className="text-xs font-medium text-accent">Active</span>
                  </div>
                  <div className="text-xs text-text-secondary">
                    Expires on {new Date(companyInfo.expiresOn).toLocaleDateString()}
                  </div>
                  <Link 
                    to="#" 
                    className="mt-2 text-xs text-primary hover:text-primary-700 font-medium flex items-center"
                  >
                    <span>Manage subscription</span>
                    <Icon name="ExternalLink" size={12} className="ml-1" />
                  </Link>
                </div>
              </div>
            )}

            {/* Toggle Button */}
            <button 
              onClick={toggleSidebar}
              className="p-2 m-4 rounded-md bg-surface-100 text-text-secondary hover:bg-surface hover:text-text-primary transition-smooth"
            >
              <Icon name={sidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={20} />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb />
            </div>

            {/* Page Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">Recruiter Dashboard</h1>
                  <p className="mt-1 text-sm text-text-secondary">
                    Monitor job performance, track applications, and analyze hiring metrics
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="input-field py-2 pl-3 pr-10 text-sm"
                    >
                      {dateRangeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <Icon name="ChevronDown" size={16} className="text-text-secondary" />
                    </div>
                  </div>
                  <button className="btn-primary flex items-center justify-center space-x-2">
                    <Icon name="Download" size={16} />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Metrics Cards */}
                <MetricsCards />

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ApplicationsChart />
                  <SourceAttribution />
                </div>

                {/* Job Performance Table */}
                <JobPerformanceTable />

                {/* Candidate Pipeline and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <CandidatePipeline />
                  </div>
                  <div>
                    <RecentActivity />
                  </div>
                </div>

                {/* Quick Actions */}
                <QuickActions />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Advanced Analytics</h2>
                
                {/* Demographic Insights */}
                <DemographicInsights />
                
                {/* Time to Hire & ROI Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-medium text-text-primary mb-4">Time to Hire Metrics</h3>
                    <div className="h-64">
                      {/* Chart would go here */}
                      <div className="w-full h-full flex items-center justify-center bg-surface-100 rounded-lg">
                        <p className="text-text-secondary">Time to Hire Chart</p>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <h3 className="text-lg font-medium text-text-primary mb-4">ROI Calculations</h3>
                    <div className="h-64">
                      {/* Chart would go here */}
                      <div className="w-full h-full flex items-center justify-center bg-surface-100 rounded-lg">
                        <p className="text-text-secondary">ROI Chart</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Billing & Payments</h2>
                
                {/* Payment History */}
                <PaymentHistory />
              </div>
            )}

            {/* Placeholder for other tabs */}
            {(activeTab === 'jobs' || activeTab === 'candidates' || activeTab === 'company' || activeTab === 'settings') && (
              <div className="card flex items-center justify-center py-16">
                <div className="text-center">
                  <Icon name={sidebarItems.find(item => item.value === activeTab)?.icon || 'FileText'} size={48} className="mx-auto mb-4 text-secondary-400" />
                  <h2 className="text-xl font-medium text-text-primary mb-2">{sidebarItems.find(item => item.value === activeTab)?.label || 'Content'}</h2>
                  <p className="text-text-secondary max-w-md">
                    This section is under development. Please check back later for updates.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboardAnalytics;