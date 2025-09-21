import React from 'react';
import Icon from 'components/AppIcon';

const ContactInformationForm = ({ formData, handleChange, errors }) => {
  const positions = [
    'CEO/Founder',
    'HR Manager',
    'Recruiter',
    'Hiring Manager',
    'Department Head',
    'Office Manager',
    'Executive Assistant',
    'Other'
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-2">Contact Information</h2>
        <p className="text-text-secondary">
          Provide contact details for your company. This information will be used for account verification and communication.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Contact Name */}
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-text-primary mb-1">
            Contact Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            className={`input-field ${errors.contactName ? 'border-error focus:ring-error' : ''}`}
            placeholder="Full name of primary contact"
          />
          {errors.contactName && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.contactName}
            </p>
          )}
        </div>
        
        {/* Contact Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-text-primary mb-1">
              Contact Email <span className="text-error">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Mail" size={16} color="var(--color-secondary-500)" />
              </div>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.contactEmail ? 'border-error focus:ring-error' : ''}`}
                placeholder="email@company.com"
              />
            </div>
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors.contactEmail}
              </p>
            )}
            <p className="mt-1 text-xs text-text-secondary">
              We'll send a verification email to this address
            </p>
          </div>
          
          {/* Contact Phone */}
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-text-primary mb-1">
              Contact Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Phone" size={16} color="var(--color-secondary-500)" />
              </div>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.contactPhone ? 'border-error focus:ring-error' : ''}`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {errors.contactPhone && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors.contactPhone}
              </p>
            )}
          </div>
        </div>
        
        {/* Position */}
        <div>
          <label htmlFor="contactPosition" className="block text-sm font-medium text-text-primary mb-1">
            Position at Company
          </label>
          <select
            id="contactPosition"
            name="contactPosition"
            value={formData.contactPosition}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select position</option>
            {positions.map((position, index) => (
              <option key={index} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>
        
        {/* Verification Notice */}
        <div className="bg-surface-100 rounded-lg p-4 border border-border-light">
          <h3 className="text-sm font-medium text-text-primary mb-2 flex items-center">
            <Icon name="Shield" size={16} className="mr-2 text-primary" />
            Verification Process
          </h3>
          <p className="text-sm text-text-secondary">
            To ensure the authenticity of employer accounts, we'll send a verification email to the address provided. 
            For premium features, additional verification may be required.
          </p>
          
          <div className="mt-4 flex items-start">
            <div className="flex items-center h-5">
              <input
                id="verification-consent"
                name="verification-consent"
                type="checkbox"
                className="h-4 w-4 text-primary border-secondary-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="verification-consent" className="text-text-secondary">
                I understand that my company information will be verified before full access is granted
              </label>
            </div>
          </div>
        </div>
        
        {/* Optional Document Upload */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Business Verification (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border rounded-md">
            <div className="space-y-1 text-center">
              <Icon name="FileText" size={24} className="mx-auto text-secondary-400" />
              <div className="flex text-sm text-text-secondary">
                <label
                  htmlFor="business-document"
                  className="relative cursor-pointer bg-background rounded-md font-medium text-primary hover:text-primary-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                >
                  <span>Upload a document</span>
                  <input id="business-document" name="business-document" type="file" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-text-secondary">
                Business license, registration, or other official document (PDF, JPG, PNG)
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-text-secondary">
            Uploading verification documents can expedite the approval process and unlock premium features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInformationForm;