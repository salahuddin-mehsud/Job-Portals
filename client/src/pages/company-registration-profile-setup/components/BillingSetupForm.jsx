import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const BillingSetupForm = ({ formData, handleChange, errors }) => {
  const [showCardForm, setShowCardForm] = useState(false);
  
  const billingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'Free',
      description: 'Get started with basic job posting capabilities',
      features: [
        '1 active job posting',
        'Standard listing visibility',
        'Basic company profile',
        'Email support'
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '$99',
      period: 'per month',
      description: 'Most popular plan for growing companies',
      features: [
        '5 active job postings',
        'Featured listings',
        'Enhanced company profile',
        'Applicant tracking',
        'Priority email support'
      ],
      recommended: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$299',
      period: 'per month',
      description: 'Advanced features for high-volume recruiting',
      features: [
        'Unlimited job postings',
        'Premium placement in search results',
        'Advanced analytics dashboard',
        'Candidate matching',
        'API access',
        'Dedicated account manager'
      ]
    }
  ];
  
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'SG', name: 'Singapore' },
    { code: 'IN', name: 'India' }
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-2">Billing Setup</h2>
        <p className="text-text-secondary">
          Choose a plan that fits your hiring needs. You can upgrade or downgrade at any time.
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Billing Plans */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Select a Plan <span className="text-error">*</span>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {billingPlans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative rounded-lg border ${
                  formData.billingPlan === plan.id 
                    ? 'border-primary bg-primary-50' :'border-border hover:border-primary-100 hover:bg-surface-100'
                } p-5 cursor-pointer transition-smooth`}
                onClick={() => handleChange({ target: { name: 'billingPlan', value: plan.id } })}
              >
                {plan.recommended && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-white">
                      Recommended
                    </span>
                  </div>
                )}
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      name="billingPlan"
                      id={`plan-${plan.id}`}
                      value={plan.id}
                      checked={formData.billingPlan === plan.id}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary border-secondary-300 focus:ring-primary"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={`plan-${plan.id}`} className="font-medium text-text-primary">
                      {plan.name}
                    </label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-text-primary">{plan.price}</span>
                    {plan.period && (
                      <span className="ml-1 text-sm text-text-secondary">{plan.period}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{plan.description}</p>
                </div>
                
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Icon name="Check" size={16} className="mt-0.5 mr-2 text-accent" />
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {errors.billingPlan && (
            <p className="mt-2 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.billingPlan}
            </p>
          )}
        </div>
        
        {/* Payment Method */}
        {formData.billingPlan !== 'basic' && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Payment Method
            </label>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCardForm(true)}
                  className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                    showCardForm ? 'border-primary bg-primary-50' : 'border-border'
                  }`}
                >
                  <Icon name="CreditCard" size={20} className="mr-2 text-secondary-500" />
                  <span>Credit Card</span>
                </button>
                
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-border rounded-md"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" fill="#F6F9FC" />
                    <path d="M7.5 15.5C7.5 14.6716 8.17157 14 9 14H15C15.8284 14 16.5 14.6716 16.5 15.5C16.5 16.3284 15.8284 17 15 17H9C8.17157 17 7.5 16.3284 7.5 15.5Z" fill="#80B9F9" />
                    <path d="M7.5 11C7.5 10.1716 8.17157 9.5 9 9.5H15C15.8284 9.5 16.5 10.1716 16.5 11C16.5 11.8284 15.8284 12.5 15 12.5H9C8.17157 12.5 7.5 11.8284 7.5 11Z" fill="#80B9F9" />
                    <path d="M7.5 6.5C7.5 5.67157 8.17157 5 9 5H15C15.8284 5 16.5 5.67157 16.5 6.5C16.5 7.32843 15.8284 8 15 8H9C8.17157 8 7.5 7.32843 7.5 6.5Z" fill="#80B9F9" />
                  </svg>
                  <span>PayPal</span>
                </button>
              </div>
              
              {showCardForm && (
                <div className="mt-4 p-4 border border-border rounded-lg bg-surface">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="card-number" className="block text-sm font-medium text-text-primary mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        className="input-field"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiration" className="block text-sm font-medium text-text-primary mb-1">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          id="expiration"
                          placeholder="MM / YY"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-text-primary mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          id="cvc"
                          placeholder="123"
                          className="input-field"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="card-name" className="block text-sm font-medium text-text-primary mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        id="card-name"
                        placeholder="John Smith"
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <Icon name="Lock" size={16} className="text-secondary-500 mr-2" />
                    <span className="text-xs text-text-secondary">
                      Your payment information is secured with 256-bit encryption
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Billing Address */}
        {formData.billingPlan !== 'basic' && (
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Billing Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="billingAddress" className="block text-sm font-medium text-text-primary mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  id="billingAddress"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="123 Main St"
                />
              </div>
              
              <div>
                <label htmlFor="billingCity" className="block text-sm font-medium text-text-primary mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="billingCity"
                  name="billingCity"
                  value={formData.billingCity}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="San Francisco"
                />
              </div>
              
              <div>
                <label htmlFor="billingState" className="block text-sm font-medium text-text-primary mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  id="billingState"
                  name="billingState"
                  value={formData.billingState}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="CA"
                />
              </div>
              
              <div>
                <label htmlFor="billingZip" className="block text-sm font-medium text-text-primary mb-1">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  id="billingZip"
                  name="billingZip"
                  value={formData.billingZip}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="94103"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="billingCountry" className="block text-sm font-medium text-text-primary mb-1">
                  Country
                </label>
                <select
                  id="billingCountry"
                  name="billingCountry"
                  value={formData.billingCountry}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Coupon Code */}
        {formData.billingPlan !== 'basic' && (
          <div>
            <label htmlFor="couponCode" className="block text-sm font-medium text-text-primary mb-1">
              Coupon Code (Optional)
            </label>
            <div className="flex">
              <input
                type="text"
                id="couponCode"
                className="input-field rounded-r-none"
                placeholder="Enter coupon code"
              />
              <button
                type="button"
                className="px-4 py-2 bg-secondary-100 text-text-primary border border-border border-l-0 rounded-r-md hover:bg-secondary-200 transition-smooth"
              >
                Apply
              </button>
            </div>
          </div>
        )}
        
        {/* Billing Terms */}
        <div className="bg-surface-100 rounded-lg p-4 border border-border-light">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-primary border-secondary-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-text-secondary">
                I agree to the <a href="#" className="text-primary hover:text-primary-700">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-700">Privacy Policy</a>
              </label>
            </div>
          </div>
          
          <p className="mt-3 text-xs text-text-secondary">
            {formData.billingPlan === 'basic' ?'The Basic plan is free to use. You can upgrade to a paid plan at any time to access additional features.' :'Your subscription will begin immediately. You can cancel or change your plan at any time from your account settings.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingSetupForm;