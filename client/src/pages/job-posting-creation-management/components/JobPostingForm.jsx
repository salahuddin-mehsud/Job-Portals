import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import Icon from 'components/AppIcon';
import FormSection from './FormSection';
import ScreeningQuestions from './ScreeningQuestions';

const JobPostingForm = ({
  control,
  errors,
  setValue,
  handleSubmit,
  onSubmit,
  formMode,
  isDirty,
  isValid, reset
}) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [expandedSections, setExpandedSections] = useState({
    basics: true,
    description: true,
    requirements: true,
    compensation: true,
    application: true,
    publishing: true
  });

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Simulate auto-save functionality
  React.useEffect(() => {
    if (isDirty) {
      setAutoSaveStatus('saving');
      const timer = setTimeout(() => {
        setAutoSaveStatus('saved');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isDirty]);

  // Employment type options
  const employmentTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'internship', label: 'Internship' },
  { value: 'volunteer', label: 'Volunteer' }];


  // Department options
  const departments = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'customer-support', label: 'Customer Support' },
  { value: 'operations', label: 'Operations' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'legal', label: 'Legal' },
  { value: 'other', label: 'Other' }];


  // Location type options
  const locationTypes = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' }];


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-background border border-border rounded-lg shadow-sm">
      {/* Auto-save indicator */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-100">
        <h2 className="text-lg font-semibold text-text-primary">
          {formMode === 'create' ? 'Create New Job Posting' : formMode === 'edit' ? 'Edit Job Posting' : 'Duplicate Job Posting'}
        </h2>
        <div className="flex items-center text-sm">
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
          autoSaveStatus === 'saving' ? 'bg-warning animate-pulse' : 'bg-success'}`
          }></span>
          <span className="text-text-secondary">
            {autoSaveStatus === 'saving' ? 'Saving draft...' : 'Draft saved'}
          </span>
        </div>
      </div>

      {/* Job Basics Section */}
      <FormSection
        title="Job Basics"
        icon="Briefcase"
        isExpanded={expandedSections.basics}
        toggleExpanded={() => toggleSection('basics')}>

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-1">
              Job Title <span className="text-error">*</span>
            </label>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Job title is required', maxLength: { value: 100, message: 'Title is too long' } }}
              render={({ field }) =>
              <input
                {...field}
                type="text"
                id="title"
                placeholder="e.g. Senior Frontend Developer"
                className={`input-field ${errors.title ? 'border-error focus:ring-error-100' : ''}`} />

              } />

            {errors.title &&
            <p className="mt-1 text-sm text-error">{errors.title.message}</p>
            }
            <p className="mt-1 text-xs text-text-secondary">
              A clear title improves visibility. Keep it under 100 characters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-text-primary mb-1">
                Department <span className="text-error">*</span>
              </label>
              <Controller
                name="department"
                control={control}
                rules={{ required: 'Department is required' }}
                render={({ field }) =>
                <select
                  {...field}
                  id="department"
                  className={`input-field ${errors.department ? 'border-error focus:ring-error-100' : ''}`}>

                    <option value="">Select Department</option>
                    {departments.map((option) =>
                  <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                  )}
                  </select>
                } />

              {errors.department &&
              <p className="mt-1 text-sm text-error">{errors.department.message}</p>
              }
            </div>

            <div>
              <label htmlFor="employmentType" className="block text-sm font-medium text-text-primary mb-1">
                Employment Type <span className="text-error">*</span>
              </label>
              <Controller
                name="employmentType"
                control={control}
                rules={{ required: 'Employment type is required' }}
                render={({ field }) =>
                <select
                  {...field}
                  id="employmentType"
                  className={`input-field ${errors.employmentType ? 'border-error focus:ring-error-100' : ''}`}>

                    <option value="">Select Employment Type</option>
                    {employmentTypes.map((option) =>
                  <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                  )}
                  </select>
                } />

              {errors.employmentType &&
              <p className="mt-1 text-sm text-error">{errors.employmentType.message}</p>
              }
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Location Type <span className="text-error">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              <Controller
                name="location.type"
                control={control}
                rules={{ required: 'Location type is required' }}
                render={({ field }) =>
                <>
                    {locationTypes.map((option) =>
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                      type="radio"
                      value={option.value}
                      checked={field.value === option.value}
                      onChange={() => field.onChange(option.value)}
                      className="w-4 h-4 text-primary border-secondary-300 focus:ring-primary-500" />

                        <span className="text-sm text-text-primary">{option.label}</span>
                      </label>
                  )}
                  </>
                } />

            </div>
            {errors.location?.type &&
            <p className="mt-1 text-sm text-error">{errors.location.type.message}</p>
            }
          </div>

          <Controller
            name="location.type"
            control={control}
            render={({ field }) =>
            <>
                {(field.value === 'onsite' || field.value === 'hybrid') &&
              <div className="space-y-4 border-t border-border-light pt-4 mt-4">
                    <div>
                      <label htmlFor="location.address" className="block text-sm font-medium text-text-primary mb-1">
                        Street Address
                        {field.value === 'onsite' && <span className="text-error"> *</span>}
                      </label>
                      <Controller
                    name="location.address"
                    control={control}
                    rules={field.value === 'onsite' ? { required: 'Address is required' } : {}}
                    render={({ field }) =>
                    <input
                      {...field}
                      type="text"
                      id="location.address"
                      placeholder="e.g. 123 Main Street"
                      className={`input-field ${errors.location?.address ? 'border-error focus:ring-error-100' : ''}`} />

                    } />

                      {errors.location?.address &&
                  <p className="mt-1 text-sm text-error">{errors.location.address.message}</p>
                  }
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="location.city" className="block text-sm font-medium text-text-primary mb-1">
                          City
                          {field.value === 'onsite' && <span className="text-error"> *</span>}
                        </label>
                        <Controller
                      name="location.city"
                      control={control}
                      rules={field.value === 'onsite' ? { required: 'City is required' } : {}}
                      render={({ field }) =>
                      <input
                        {...field}
                        type="text"
                        id="location.city"
                        placeholder="e.g. San Francisco"
                        className={`input-field ${errors.location?.city ? 'border-error focus:ring-error-100' : ''}`} />

                      } />

                        {errors.location?.city &&
                    <p className="mt-1 text-sm text-error">{errors.location.city.message}</p>
                    }
                      </div>

                      <div>
                        <label htmlFor="location.state" className="block text-sm font-medium text-text-primary mb-1">
                          State/Province
                          {field.value === 'onsite' && <span className="text-error"> *</span>}
                        </label>
                        <Controller
                      name="location.state"
                      control={control}
                      rules={field.value === 'onsite' ? { required: 'State is required' } : {}}
                      render={({ field }) =>
                      <input
                        {...field}
                        type="text"
                        id="location.state"
                        placeholder="e.g. California"
                        className={`input-field ${errors.location?.state ? 'border-error focus:ring-error-100' : ''}`} />

                      } />

                        {errors.location?.state &&
                    <p className="mt-1 text-sm text-error">{errors.location.state.message}</p>
                    }
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="location.country" className="block text-sm font-medium text-text-primary mb-1">
                          Country
                          {field.value === 'onsite' && <span className="text-error"> *</span>}
                        </label>
                        <Controller
                      name="location.country"
                      control={control}
                      rules={field.value === 'onsite' ? { required: 'Country is required' } : {}}
                      render={({ field }) =>
                      <input
                        {...field}
                        type="text"
                        id="location.country"
                        placeholder="e.g. United States"
                        className={`input-field ${errors.location?.country ? 'border-error focus:ring-error-100' : ''}`} />

                      } />

                        {errors.location?.country &&
                    <p className="mt-1 text-sm text-error">{errors.location.country.message}</p>
                    }
                      </div>

                      <div>
                        <label htmlFor="location.zipCode" className="block text-sm font-medium text-text-primary mb-1">
                          Zip/Postal Code
                          {field.value === 'onsite' && <span className="text-error"> *</span>}
                        </label>
                        <Controller
                      name="location.zipCode"
                      control={control}
                      rules={field.value === 'onsite' ? { required: 'Zip code is required' } : {}}
                      render={({ field }) =>
                      <input
                        {...field}
                        type="text"
                        id="location.zipCode"
                        placeholder="e.g. 94103"
                        className={`input-field ${errors.location?.zipCode ? 'border-error focus:ring-error-100' : ''}`} />

                      } />

                        {errors.location?.zipCode &&
                    <p className="mt-1 text-sm text-error">{errors.location.zipCode.message}</p>
                    }
                      </div>
                    </div>
                  </div>
              }
              </>
            } />

        </div>
      </FormSection>

      {/* Job Description Section */}
      <FormSection
        title="Job Description"
        icon="FileText"
        isExpanded={expandedSections.description}
        toggleExpanded={() => toggleSection('description')}>

        <div className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
              Job Description <span className="text-error">*</span>
            </label>
            <Controller
              name="description"
              control={control}
              rules={{
                required: 'Job description is required',
                minLength: { value: 100, message: 'Description should be at least 100 characters' }
              }}
              render={({ field }) =>
              <textarea
                {...field}
                id="description"
                rows={8}
                placeholder="Describe the role, responsibilities, and ideal candidate..."
                className={`input-field font-mono ${errors.description ? 'border-error focus:ring-error-100' : ''}`} />

              } />

            {errors.description &&
            <p className="mt-1 text-sm text-error">{errors.description.message}</p>
            }
            <div className="flex justify-between mt-1">
              <p className="text-xs text-text-secondary">
                Use markdown for formatting. Minimum 100 characters.
              </p>
              <Controller
                name="description"
                control={control}
                render={({ field }) =>
                <p className={`text-xs ${field.value.length < 100 ? 'text-error' : 'text-text-secondary'}`}>
                    {field.value.length} / 5000
                  </p>
                } />

            </div>
          </div>
        </div>
      </FormSection>

      {/* Requirements & Qualifications Section */}
      <FormSection
        title="Requirements & Qualifications"
        icon="CheckSquare"
        isExpanded={expandedSections.requirements}
        toggleExpanded={() => toggleSection('requirements')}>

        <div className="space-y-6">
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-text-primary mb-1">
              Requirements <span className="text-error">*</span>
            </label>
            <Controller
              name="requirements"
              control={control}
              rules={{ required: 'Requirements are required' }}
              render={({ field }) =>
              <textarea
                {...field}
                id="requirements"
                rows={5}
                placeholder="List the essential skills, experience, and qualifications..."
                className={`input-field font-mono ${errors.requirements ? 'border-error focus:ring-error-100' : ''}`} />

              } />

            {errors.requirements &&
            <p className="mt-1 text-sm text-error">{errors.requirements.message}</p>
            }
            <p className="mt-1 text-xs text-text-secondary">
              Use bullet points (- item) for better readability.
            </p>
          </div>

          <div>
            <label htmlFor="qualifications" className="block text-sm font-medium text-text-primary mb-1">
              Preferred Qualifications
            </label>
            <Controller
              name="qualifications"
              control={control}
              render={({ field }) =>
              <textarea
                {...field}
                id="qualifications"
                rows={4}
                placeholder="List additional skills or experience that would be beneficial..."
                className="input-field font-mono" />

              } />

            <p className="mt-1 text-xs text-text-secondary">
              Optional but recommended. Helps candidates understand if they're a good fit.
            </p>
          </div>

          <div>
            <label htmlFor="benefits" className="block text-sm font-medium text-text-primary mb-1">
              Benefits & Perks
            </label>
            <Controller
              name="benefits"
              control={control}
              render={({ field }) =>
              <textarea
                {...field}
                id="benefits"
                rows={4}
                placeholder="List the benefits and perks offered with this position..."
                className="input-field font-mono" />

              } />

            <p className="mt-1 text-xs text-text-secondary">
              Highlighting benefits increases application rates by up to 30%.
            </p>
          </div>
        </div>
      </FormSection>

      {/* Compensation Section */}
      <FormSection
        title="Compensation Details"
        icon="DollarSign"
        isExpanded={expandedSections.compensation}
        toggleExpanded={() => toggleSection('compensation')}>

        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <Controller
              name="salary.isVisible"
              control={control}
              render={({ field }) =>
              <label className="flex items-center cursor-pointer">
                  <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-4 h-4 text-primary border-secondary-300 rounded focus:ring-primary-500" />

                  <span className="ml-2 text-sm font-medium text-text-primary">
                    Display salary range publicly
                  </span>
                </label>
              } />

            <div className="ml-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-50 text-success-600">
                <Icon name="TrendingUp" size={12} className="mr-1" />
                +24% more applications
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="salary.currency" className="block text-sm font-medium text-text-primary mb-1">
                Currency
              </label>
              <Controller
                name="salary.currency"
                control={control}
                render={({ field }) =>
                <select
                  {...field}
                  id="salary.currency"
                  className="input-field">

                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                } />

            </div>

            <div>
              <label htmlFor="salary.period" className="block text-sm font-medium text-text-primary mb-1">
                Pay Period
              </label>
              <Controller
                name="salary.period"
                control={control}
                render={({ field }) =>
                <select
                  {...field}
                  id="salary.period"
                  className="input-field">

                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="hourly">Hourly</option>
                  </select>
                } />

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="salary.min" className="block text-sm font-medium text-text-primary mb-1">
                Minimum Salary
              </label>
              <Controller
                name="salary.min"
                control={control}
                render={({ field }) =>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-secondary-500 sm:text-sm">
                        {field.value ? '$' : ''}
                      </span>
                    </div>
                    <input
                    {...field}
                    type="number"
                    id="salary.min"
                    placeholder="e.g. 50000"
                    className="input-field pl-7" />

                  </div>
                } />

            </div>

            <div>
              <label htmlFor="salary.max" className="block text-sm font-medium text-text-primary mb-1">
                Maximum Salary
              </label>
              <Controller
                name="salary.max"
                control={control}
                render={({ field }) =>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-secondary-500 sm:text-sm">
                        {field.value ? '$' : ''}
                      </span>
                    </div>
                    <input
                    {...field}
                    type="number"
                    id="salary.max"
                    placeholder="e.g. 80000"
                    className="input-field pl-7" />

                  </div>
                } />

            </div>
          </div>
          
          <p className="text-xs text-text-secondary">
            Providing a salary range increases application rates and improves candidate quality.
          </p>
        </div>
      </FormSection>

      {/* Application Settings Section */}
      <FormSection
        title="Application Settings"
        icon="Settings"
        isExpanded={expandedSections.application}
        toggleExpanded={() => toggleSection('application')}>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="applicationSettings.deadline" className="block text-sm font-medium text-text-primary mb-1">
                Application Deadline
              </label>
              <Controller
                name="applicationSettings.deadline"
                control={control}
                render={({ field }) =>
                <input
                  {...field}
                  type="date"
                  id="applicationSettings.deadline"
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]} />

                } />

              <p className="mt-1 text-xs text-text-secondary">
                Leave blank for no deadline.
              </p>
            </div>

            <div>
              <label htmlFor="applicationSettings.notificationEmail" className="block text-sm font-medium text-text-primary mb-1">
                Notification Email
              </label>
              <Controller
                name="applicationSettings.notificationEmail"
                control={control}
                render={({ field }) =>
                <input
                  {...field}
                  type="email"
                  id="applicationSettings.notificationEmail"
                  placeholder="e.g. recruiting@company.com"
                  className="input-field" />

                } />

              <p className="mt-1 text-xs text-text-secondary">
                Where to send application notifications.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="applicationSettings.redirectUrl" className="block text-sm font-medium text-text-primary mb-1">
              External Application URL
            </label>
            <Controller
              name="applicationSettings.redirectUrl"
              control={control}
              render={({ field }) =>
              <input
                {...field}
                type="url"
                id="applicationSettings.redirectUrl"
                placeholder="e.g. https://your-ats.com/job/123"
                className="input-field" />

              } />

            <p className="mt-1 text-xs text-text-secondary">
              Optional. Redirects applicants to your ATS or careers page.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-text-primary">
                Screening Questions
              </label>
              <button
                type="button"
                className="text-primary text-sm font-medium flex items-center"
                onClick={() => {
                  const currentQuestions = control._formValues.applicationSettings.screeningQuestions || [];
                  setValue('applicationSettings.screeningQuestions', [
                  ...currentQuestions,
                  { question: '', type: 'text', required: true }]
                  );
                }}>

                <Icon name="Plus" size={16} className="mr-1" />
                Add Question
              </button>
            </div>
            
            <Controller
              name="applicationSettings.screeningQuestions"
              control={control}
              defaultValue={[]}
              render={({ field }) =>
              <ScreeningQuestions
                questions={field.value}
                onChange={field.onChange} />

              } />

            
            <p className="mt-1 text-xs text-text-secondary">
              Add screening questions to filter candidates.
            </p>
          </div>
        </div>
      </FormSection>

      {/* Publishing Options Section */}
      <FormSection
        title="Publishing Options"
        icon="Globe"
        isExpanded={expandedSections.publishing}
        toggleExpanded={() => toggleSection('publishing')}>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Publication Status
            </label>
            <Controller
              name="publishSettings.status"
              control={control}
              render={({ field }) =>
              <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border border-border rounded-md cursor-pointer hover:bg-surface transition-smooth">
                    <input
                    type="radio"
                    value="draft"
                    checked={field.value === 'draft'}
                    onChange={() => field.onChange('draft')}
                    className="w-4 h-4 text-primary border-secondary-300 focus:ring-primary-500" />

                    <div>
                      <span className="block text-sm font-medium text-text-primary">Save as Draft</span>
                      <span className="block text-xs text-text-secondary">Save your progress without publishing.</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-border rounded-md cursor-pointer hover:bg-surface transition-smooth">
                    <input
                    type="radio"
                    value="publish"
                    checked={field.value === 'publish'}
                    onChange={() => field.onChange('publish')}
                    className="w-4 h-4 text-primary border-secondary-300 focus:ring-primary-500" />

                    <div>
                      <span className="block text-sm font-medium text-text-primary">Publish Immediately</span>
                      <span className="block text-xs text-text-secondary">Make this job visible to candidates right away.</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-border rounded-md cursor-pointer hover:bg-surface transition-smooth">
                    <input
                    type="radio"
                    value="schedule"
                    checked={field.value === 'schedule'}
                    onChange={() => field.onChange('schedule')}
                    className="w-4 h-4 text-primary border-secondary-300 focus:ring-primary-500" />

                    <div>
                      <span className="block text-sm font-medium text-text-primary">Schedule Publication</span>
                      <span className="block text-xs text-text-secondary">Set a future date to publish this job.</span>
                    </div>
                  </label>
                </div>
              } />

          </div>

          <Controller
            name="publishSettings.status"
            control={control}
            render={({ field }) =>
            <>
                {field.value === 'schedule' &&
              <div>
                    <label htmlFor="publishSettings.scheduledDate" className="block text-sm font-medium text-text-primary mb-1">
                      Publication Date <span className="text-error">*</span>
                    </label>
                    <Controller
                  name="publishSettings.scheduledDate"
                  control={control}
                  rules={{ required: 'Publication date is required for scheduled posts' }}
                  render={({ field }) =>
                  <input
                    {...field}
                    type="datetime-local"
                    id="publishSettings.scheduledDate"
                    className={`input-field ${errors.publishSettings?.scheduledDate ? 'border-error focus:ring-error-100' : ''}`}
                    min={new Date().toISOString().slice(0, 16)} />

                  } />

                    {errors.publishSettings?.scheduledDate &&
                <p className="mt-1 text-sm text-error">{errors.publishSettings.scheduledDate.message}</p>
                }
                  </div>
              }
              </>
            } />


          <div>
            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) =>
              <label className="flex items-center space-x-3 p-4 border border-border rounded-md bg-surface cursor-pointer hover:bg-surface-100 transition-smooth">
                  <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-5 h-5 text-primary border-secondary-300 rounded focus:ring-primary-500" />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-primary">Featured Job Listing</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-50 text-warning-600">
                        +$49.99
                      </span>
                    </div>
                    <span className="block text-xs text-text-secondary mt-1">
                      Highlight your job at the top of search results and category pages.
                    </span>
                  </div>
                </label>
              } />

          </div>
        </div>
      </FormSection>

      {/* Form Actions */}
      <div className="px-6 py-4 bg-surface-100 border-t border-border flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            if (window.confirm('Are you sure you want to discard your changes?')) {
              reset();
            }
          }}>

          Discard Changes
        </button>
        
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setValue('publishSettings.status', 'draft');
            handleSubmit(onSubmit)();
          }}>

          Save Draft
        </button>
        
        <button
          type="submit"
          className="btn-primary"
          disabled={!isValid}>

          {formMode === 'create' ? 'Create Job' : 'Update Job'}
        </button>
      </div>
    </form>);

};

export default JobPostingForm;