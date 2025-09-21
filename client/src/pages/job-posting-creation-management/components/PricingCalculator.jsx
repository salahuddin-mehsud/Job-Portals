import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const PricingCalculator = ({ formValues, setValue }) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [couponError, setCouponError] = useState('');
  
  // Base pricing
  const basePricing = {
    standard: 99.99,
    featured: 49.99
  };
  
  // Calculate total
  const calculateTotal = () => {
    let total = basePricing.standard;
    
    if (formValues.isFeatured) {
      total += basePricing.featured;
    }
    
    if (couponApplied) {
      total -= couponDiscount;
    }
    
    return Math.max(0, total).toFixed(2);
  };
  
  // Handle coupon application
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    setIsApplying(true);
    setCouponError('');
    
    // Simulate API call
    setTimeout(() => {
      // Mock coupon validation
      if (couponCode.toUpperCase() === 'NEWUSER25') {
        setCouponApplied(true);
        setCouponDiscount(25);
        setCouponError('');
      } else if (couponCode.toUpperCase() === 'SUMMER2023') {
        setCouponApplied(true);
        setCouponDiscount(15);
        setCouponError('');
      } else {
        setCouponApplied(false);
        setCouponDiscount(0);
        setCouponError('Invalid or expired coupon code');
      }
      setIsApplying(false);
    }, 800);
  };
  
  // Remove coupon
  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponCode('');
    setCouponError('');
  };
  
  return (
    <div className="bg-background border border-border rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-border bg-surface-100">
        <h3 className="text-lg font-semibold text-text-primary">Pricing Summary</h3>
        <p className="text-sm text-text-secondary">Calculate the cost of your job posting</p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-text-primary">Standard Job Posting (30 days)</span>
            <span className="font-medium">${basePricing.standard.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured-option"
                checked={formValues.isFeatured}
                onChange={(e) => setValue('isFeatured', e.target.checked)}
                className="w-4 h-4 text-primary border-secondary-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="featured-option" className="ml-2 text-text-primary cursor-pointer">
                Featured Job Listing
              </label>
            </div>
            <span className="font-medium">${basePricing.featured.toFixed(2)}</span>
          </div>
          
          {formValues.isFeatured && (
            <div className="pl-6 text-sm text-text-secondary">
              <ul className="list-disc list-inside space-y-1">
                <li>Priority placement in search results</li>
                <li>Highlighted in the featured jobs section</li>
                <li>Increased visibility to qualified candidates</li>
              </ul>
            </div>
          )}
          
          <div className="pt-4 border-t border-border-light">
            {!couponApplied ? (
              <div className="space-y-2">
                <label htmlFor="coupon-code" className="block text-sm font-medium text-text-primary">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="coupon-code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className={`input-field flex-1 ${couponError ? 'border-error focus:ring-error-100' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isApplying}
                    className="btn-secondary whitespace-nowrap"
                  >
                    {isApplying ? (
                      <span className="flex items-center">
                        <Icon name="Loader" size={16} className="animate-spin mr-1" />
                        Applying...
                      </span>
                    ) : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-sm text-error">{couponError}</p>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center text-success-600 bg-success-50 p-3 rounded-md">
                <div className="flex items-center">
                  <Icon name="Check" size={16} className="mr-2" />
                  <span>
                    <span className="font-medium">{couponCode.toUpperCase()}</span> applied: ${couponDiscount.toFixed(2)} off
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-text-secondary hover:text-error transition-smooth"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t border-border-light">
            <div className="flex justify-between items-center font-medium text-lg">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Prices are in USD and exclude applicable taxes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;