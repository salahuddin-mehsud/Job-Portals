import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Icon from 'components/AppIcon';

import Breadcrumb from 'components/ui/Breadcrumb';
import JobPostingForm from './components/JobPostingForm';
import JobPreview from './components/JobPreview';
import PricingCalculator from './components/PricingCalculator';
import JobManagementTable from './components/JobManagementTable';
import CsvUploadSection from './components/CsvUploadSection';
import RecruiterSidebar from './components/RecruiterSidebar';

const JobPostingCreationManagement = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [formMode, setFormMode] = useState('create'); // create, edit, duplicate
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  // Form setup with react-hook-form
  const { control, handleSubmit, watch, setValue, reset, formState: { errors, isDirty, isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      department: '',
      location: { type: 'remote', address: '', city: '', state: '', country: '', zipCode: '' },
      employmentType: '',
      description: '',
      requirements: '',
      qualifications: '',
      benefits: '',
      salary: { min: '', max: '', currency: 'USD', period: 'yearly', isVisible: true },
      applicationSettings: { 
        deadline: null, 
        redirectUrl: '', 
        notificationEmail: '',
        screeningQuestions: []
      },
      publishSettings: { status: 'draft', scheduledDate: null },
      isFeatured: false
    }
  });

  // Watch form values for preview
  const formValues = watch();

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle form submission
  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    // In a real app, this would send data to an API
    alert('Job posting submitted successfully!');
    reset();
  };

  // Handle job selection for editing
  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setFormMode('edit');
    setActiveTab('create');
    
    // Populate form with job data
    Object.keys(job).forEach(key => {
      setValue(key, job[key]);
    });
  };

  // Handle job duplication
  const handleJobDuplicate = (job) => {
    setSelectedJob({...job, id: null, title: `${job.title} (Copy)`});
    setFormMode('duplicate');
    setActiveTab('create');
    
    // Populate form with job data but change title
    Object.keys(job).forEach(key => {
      if (key === 'title') {
        setValue(key, `${job.title} (Copy)`);
      } else {
        setValue(key, job[key]);
      }
    });
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setShowSidebarMobile(!showSidebarMobile);
  };

  return (
    <div className="bg-surface min-h-screen">
      {/* Mobile sidebar toggle button */}
      {isMobile && (
        <button 
          onClick={toggleMobileSidebar}
          className="fixed bottom-4 right-4 z-50 bg-primary text-white p-3 rounded-full shadow-lg"
          aria-label="Toggle sidebar"
        >
          <Icon name={showSidebarMobile ? "X" : "Menu"} size={24} />
        </button>
      )}

      <div className="flex">
        {/* Sidebar - hidden on mobile unless toggled */}
        <div className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out' : 'relative'}
          ${isMobile && !showSidebarMobile ? '-translate-x-full' : 'translate-x-0'}
          ${isSidebarCollapsed && !isMobile ? 'w-20' : 'w-64'}
          bg-background border-r border-border shadow-sm transition-all duration-300
        `}>
          <RecruiterSidebar 
            isCollapsed={isSidebarCollapsed} 
            toggleCollapse={toggleSidebar}
            isMobile={isMobile}
            closeMobileSidebar={() => setShowSidebarMobile(false)}
          />
        </div>

        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ${isMobile ? 'w-full' : (isSidebarCollapsed ? 'ml-20' : 'ml-64')}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Job Posting Management</h1>
                <p className="text-text-secondary mt-1">Create, edit, and manage your job listings</p>
              </div>
              
              {activeTab === 'manage' && (
                <button 
                  onClick={() => {
                    setActiveTab('create');
                    setFormMode('create');
                    reset();
                  }}
                  className="btn-primary mt-4 md:mt-0 flex items-center space-x-2"
                >
                  <Icon name="Plus" size={20} />
                  <span>Create New Job</span>
                </button>
              )}
            </div>

            {/* Tab navigation */}
            <div className="border-b border-border mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`py-4 px-1 font-medium text-sm border-b-2 transition-smooth ${
                    activeTab === 'create' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary-300'
                  }`}
                >
                  {formMode === 'create' ? 'Create Job' : formMode === 'edit' ? 'Edit Job' : 'Duplicate Job'}
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className={`py-4 px-1 font-medium text-sm border-b-2 transition-smooth ${
                    activeTab === 'manage' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary-300'
                  }`}
                >
                  Manage Jobs
                </button>
                <button
                  onClick={() => setActiveTab('csv')}
                  className={`py-4 px-1 font-medium text-sm border-b-2 transition-smooth ${
                    activeTab === 'csv' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary-300'
                  }`}
                >
                  Bulk Upload
                </button>
              </nav>
            </div>

            {/* Tab content */}
            {activeTab === 'create' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <JobPostingForm 
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    formMode={formMode}
                    isDirty={isDirty}
                    isValid={isValid}
                  />
                </div>
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <JobPreview formValues={formValues} />
                    <PricingCalculator formValues={formValues} setValue={setValue} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'manage' && (
              <JobManagementTable 
                onEdit={handleJobSelect} 
                onDuplicate={handleJobDuplicate}
              />
            )}

            {activeTab === 'csv' && (
              <CsvUploadSection />
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobile && showSidebarMobile && (
        <div 
          className="fixed inset-0 bg-secondary-900 bg-opacity-50 z-30"
          onClick={() => setShowSidebarMobile(false)}
        />
      )}
    </div>
  );
};

export default JobPostingCreationManagement;