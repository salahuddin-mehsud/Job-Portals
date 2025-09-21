import axios from "axios";
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

import Breadcrumb from 'components/ui/Breadcrumb';
import CompanyDetailsForm from './components/CompanyDetailsForm';
import ContactInformationForm from './components/ContactInformationForm';
import BillingSetupForm from './components/BillingSetupForm';
import BrandingCustomizationForm from './components/BrandingCustomizationForm';
import PreviewProfile from './components/PreviewProfile';

const CompanyRegistrationProfileSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Company Details
    name: '',
    industry: '',
    size: '',
    website: '',
    description: '',
    headquarters: '',
    foundingYear: '',
    employeeCount: '',
    
    // Contact Information
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactPosition: '',
    
    // Billing Setup
    billingPlan: 'standard',
    paymentMethod: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: '',
    
    // Branding Customization
    logo: null,
    logoPreview: '',
    culturePhotos: [],
    culturePhotosCaptions: [],
    colors: {
      primary: '#2563EB',
      secondary: '#64748B'
    }
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSaved, setFormSaved] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  
  const fileInputRef = useRef(null);
  
  const steps = [
    { id: 1, name: 'Company Details', icon: 'Building2' },
    { id: 2, name: 'Contact Information', icon: 'UserRound' },
    { id: 3, name: 'Billing Setup', icon: 'CreditCard' },
    { id: 4, name: 'Branding', icon: 'Palette' },
    { id: 5, name: 'Preview', icon: 'Eye' }
  ];
  
  useEffect(() => {
    // Check for saved draft in localStorage
    const savedData = localStorage.getItem('companyProfileDraft');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prevData => ({
          ...prevData,
          ...parsedData
        }));
      } catch (error) {
        console.error('Error parsing saved draft:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    // Save draft when form is touched
    if (formTouched) {
      const dataToSave = { ...formData };
      // Don't save file objects
      delete dataToSave.logo;
      delete dataToSave.culturePhotos;
      
      localStorage.setItem('companyProfileDraft', JSON.stringify(dataToSave));
    }
  }, [formData, formTouched]);
  
  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 1: // Company Details
        if (!formData.name) errors.name = 'Company name is required';
        if (!formData.industry) errors.industry = 'Industry is required';
        if (!formData.description) errors.description = 'Company description is required';
        if (formData.description && formData.description.length < 100) {
          errors.description = 'Description must be at least 100 characters';
        }
        if (formData.website && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(formData.website)) {
          errors.website = 'Please enter a valid website URL';
        }
        break;
        
      case 2: // Contact Information
        if (!formData.contactName) errors.contactName = 'Contact name is required';
        if (!formData.contactEmail) errors.contactEmail = 'Contact email is required';
        if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
          errors.contactEmail = 'Please enter a valid email address';
        }
        if (formData.contactPhone && !/^\+?[0-9\s-()]{8,20}$/.test(formData.contactPhone)) {
          errors.contactPhone = 'Please enter a valid phone number';
        }
        break;
        
      case 3: // Billing Setup
        if (!formData.billingPlan) errors.billingPlan = 'Please select a billing plan';
        break;
        
      case 4: // Branding
        // No required fields for branding
        break;
        
      default:
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setFormTouched(true);
  };
  
  const handleNestedChange = (section, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
    setFormTouched(true);
  };
  
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (field === 'logo') {
        setFormData(prevData => ({
          ...prevData,
          logo: file,
          logoPreview: reader.result
        }));
      } else if (field === 'culturePhotos') {
        setFormData(prevData => {
          const newPhotos = [...prevData.culturePhotos];
          newPhotos.push(file);
          
          const newCaptions = [...prevData.culturePhotosCaptions];
          newCaptions.push('');
          
          return {
            ...prevData,
            culturePhotos: newPhotos,
            culturePhotosCaptions: newCaptions
          };
        });
      }
    };
    
    reader.readAsDataURL(file);
    setFormTouched(true);
  };
  
  const handleCaptionChange = (index, caption) => {
    setFormData(prevData => {
      const newCaptions = [...prevData.culturePhotosCaptions];
      newCaptions[index] = caption;
      
      return {
        ...prevData,
        culturePhotosCaptions: newCaptions
      };
    });
    setFormTouched(true);
  };
  
  const removePhoto = (index) => {
    setFormData(prevData => {
      const newPhotos = [...prevData.culturePhotos];
      newPhotos.splice(index, 1);
      
      const newCaptions = [...prevData.culturePhotosCaptions];
      newCaptions.splice(index, 1);
      
      return {
        ...prevData,
        culturePhotos: newPhotos,
        culturePhotosCaptions: newCaptions
      };
    });
    setFormTouched(true);
  };
  
  const handleNext = () => {
    const isValid = validateStep(currentStep);
    
    if (isValid) {
      setCurrentStep(prevStep => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateStep(currentStep);
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'logo' && key !== 'culturePhotos' && key !== 'logoPreview') {
          if (typeof formData[key] === 'object') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });
      
      // Append files
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }
      
      if (formData.culturePhotos && formData.culturePhotos.length > 0) {
        formData.culturePhotos.forEach(photo => {
          formDataToSend.append('culturePhotos', photo);
        });
        
        // Append captions
        formDataToSend.append('culturePhotosCaptions', JSON.stringify(formData.culturePhotosCaptions));
      }

      const response = await axios.post(
        "http://localhost:5000/api/company/profile",
        formDataToSend,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      console.log("Company profile saved:", response.data);

      localStorage.removeItem("companyProfileDraft");
      setFormSaved(true);

      // Redirect after success
      setTimeout(() => {
        navigate("/job-posting-creation-management");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Error submitting form. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show success message
      setFormSaved(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setFormSaved(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyDetailsForm 
            formData={formData} 
            handleChange={handleChange} 
            errors={formErrors} 
          />
        );
      case 2:
        return (
          <ContactInformationForm 
            formData={formData} 
            handleChange={handleChange} 
            errors={formErrors} 
          />
        );
      case 3:
        return (
          <BillingSetupForm 
            formData={formData} 
            handleChange={handleChange} 
            errors={formErrors} 
          />
        );
      case 4:
        return (
          <BrandingCustomizationForm 
            formData={formData} 
            handleFileChange={handleFileChange} 
            handleNestedChange={handleNestedChange}
            handleCaptionChange={handleCaptionChange}
            removePhoto={removePhoto}
            fileInputRef={fileInputRef}
            errors={formErrors} 
            setFormData={setFormData}
          />
        );
      case 5:
        return (
          <PreviewProfile formData={formData} />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-surface pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Company Registration & Profile Setup</h1>
          <p className="text-text-secondary max-w-3xl">
            Complete your company profile to start posting jobs and connecting with qualified candidates in your industry.
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="hidden sm:block">
            <nav aria-label="Progress">
              <ol className="flex items-center">
                {steps.map((step, stepIdx) => (
                  <li key={step.name} className={`relative ${stepIdx === steps.length - 1 ? '' : 'pr-8 sm:pr-20'} flex-1`}>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className={`h-0.5 w-full ${stepIdx < currentStep - 1 ? 'bg-primary' : 'bg-secondary-200'}`}></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => stepIdx + 1 < currentStep && setCurrentStep(stepIdx + 1)}
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                        stepIdx + 1 < currentStep
                          ? 'bg-primary hover:bg-primary-700'
                          : stepIdx + 1 === currentStep
                          ? 'bg-primary-100 border-2 border-primary' :'bg-secondary-100'
                      } ${stepIdx + 1 < currentStep ? 'cursor-pointer' : ''}`}
                    >
                      <Icon 
                        name={stepIdx + 1 < currentStep ? 'Check' : step.icon} 
                        size={16} 
                        color={stepIdx + 1 < currentStep ? 'white' : stepIdx + 1 === currentStep ? 'var(--color-primary)' : 'var(--color-secondary-500)'} 
                      />
                      <span className="sr-only">{step.name}</span>
                    </button>
                    <div className="hidden sm:block absolute left-0 top-10 w-32 -ml-12 text-center text-xs font-medium text-text-secondary">
                      {step.name}
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          
          {/* Mobile Progress Indicator */}
          <div className="sm:hidden">
            <p className="text-sm font-medium text-text-secondary">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
            </p>
            <div className="mt-2 bg-secondary-200 rounded-full overflow-hidden">
              <div 
                className="h-2 bg-primary rounded-full" 
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Form Container */}
        <div className="bg-background rounded-lg shadow-sm border border-border p-6 mb-8">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            {/* Form Actions */}
            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="btn-secondary flex items-center space-x-2"
                    disabled={isSubmitting}
                  >
                    <Icon name="ArrowLeft" size={16} />
                    <span>Previous</span>
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {formSaved && (
                  <div className="text-accent flex items-center space-x-2 px-3 py-2 bg-accent-50 rounded-md">
                    <Icon name="Check" size={16} />
                    <span className="text-sm font-medium">Saved successfully</span>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="text-text-secondary hover:text-text-primary px-4 py-2 rounded-md transition-smooth"
                  disabled={isSubmitting}
                >
                  Save Draft
                </button>
                
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary flex items-center space-x-2"
                    disabled={isSubmitting}
                  >
                    <span>Next</span>
                    <Icon name="ArrowRight" size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Icon name="Loader2" className="animate-spin" size={16} />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Setup</span>
                        <Icon name="CheckCircle" size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        
        {/* Help Section */}
        <div className="bg-surface-100 rounded-lg p-6 border border-border-light">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="HelpCircle" size={20} className="mr-2 text-primary" />
            Need Help?
          </h3>
          <p className="text-text-secondary mb-4">
            Having trouble setting up your company profile? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#" className="flex items-center text-primary hover:text-primary-700 transition-smooth">
              <Icon name="FileText" size={16} className="mr-2" />
              <span>View Setup Guide</span>
            </a>
            <a href="#" className="flex items-center text-primary hover:text-primary-700 transition-smooth">
              <Icon name="MessageCircle" size={16} className="mr-2" />
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationProfileSetup;