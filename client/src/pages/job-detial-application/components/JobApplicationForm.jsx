import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const JobApplicationForm = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: '',
    linkedinUrl: '',
    portfolioUrl: '',
    answers: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const totalSteps = 3;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value
      }
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          resume: 'File size must be less than 5MB'
        }));
        return;
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          resume: 'Please upload a PDF or Word document'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        resume: file
      }));
      setErrors(prev => ({
        ...prev,
        resume: null
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (step === 2) {
      if (!formData.resume) newErrors.resume = 'Resume is required';
      if (!formData.coverLetter.trim()) newErrors.coverLetter = 'Cover letter is required';
    }

    if (step === 3) {
      job.applicationQuestions.forEach(question => {
        if (question.required && !formData.answers[question.id]) {
          newErrors[`question_${question.id}`] = 'This field is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - show confirmation and close
      alert('Application submitted successfully! You will receive a confirmation email shortly.');
      onClose();
    } catch (error) {
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`input-field ${errors.firstName ? 'border-error' : ''}`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-error text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`input-field ${errors.lastName ? 'border-error' : ''}`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="text-error text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`input-field ${errors.email ? 'border-error' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`input-field ${errors.phone ? 'border-error' : ''}`}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-error text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                LinkedIn Profile (Optional)
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                className="input-field"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Portfolio/Website (Optional)
              </label>
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                className="input-field"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Documents</h3>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Resume/CV *
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-2">
                    <Icon name="Upload" size={32} className="text-secondary-400" />
                    <div>
                      <p className="text-text-primary font-medium">
                        {formData.resume ? formData.resume.name : 'Click to upload resume'}
                      </p>
                      <p className="text-text-muted text-sm">PDF, DOC, or DOCX (max 5MB)</p>
                    </div>
                  </div>
                </label>
              </div>
              {errors.resume && (
                <p className="text-error text-sm mt-1">{errors.resume}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Cover Letter *
              </label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                rows={6}
                className={`input-field resize-none ${errors.coverLetter ? 'border-error' : ''}`}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.coverLetter && (
                  <p className="text-error text-sm">{errors.coverLetter}</p>
                )}
                <p className="text-text-muted text-sm ml-auto">
                  {formData.coverLetter.length}/1000 characters
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Additional Questions</h3>
            
            {job.applicationQuestions.map((question) => (
              <div key={question.id}>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {question.question} {question.required && '*'}
                </label>
                
                {question.type === 'textarea' && (
                  <textarea
                    value={formData.answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    rows={4}
                    className={`input-field resize-none ${errors[`question_${question.id}`] ? 'border-error' : ''}`}
                    placeholder="Enter your answer..."
                  />
                )}
                
                {question.type === 'radio' && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question_${question.id}`}
                          value={option}
                          checked={formData.answers[question.id] === option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-text-secondary">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {errors[`question_${question.id}`] && (
                  <p className="text-error text-sm mt-1">{errors[`question_${question.id}`]}</p>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-1050">
      <div className="bg-background rounded-lg shadow-modal max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Apply for {job.title}</h2>
            <p className="text-text-muted text-sm">{job.company.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-text-muted">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="ChevronLeft" size={16} className="mr-1" />
            Previous
          </button>

          <div className="flex space-x-3">
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
              >
                Next
                <Icon name="ChevronRight" size={16} className="ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={16} className="mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;