import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const RegisterForm = ({ onSuccess, isLoading }) => {
  const [formData, setFormData] = useState({
  fullName: '',
  email: '',
  professionalTitle: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  role: 'user' // default role
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return levels[strength] || 'Very Weak';
  };

  const getPasswordStrengthColor = (strength) => {
    const colors = ['bg-error', 'bg-warning', 'bg-warning', 'bg-accent', 'bg-accent'];
    return colors[strength] || 'bg-error';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.professionalTitle.trim()) {
      newErrors.professionalTitle = 'Professional title is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password is too weak. Include uppercase, lowercase, numbers, and special characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    // Call backend registration API
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        professionalTitle: formData.professionalTitle,
        password: formData.password,
        role: formData.role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors({
        general: data.message || "Registration failed. Please try again.",
      });
      return;
    }

    // Store user + token in localStorage
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    // Redirect based on role
    if (data.user.role === "company") {
      window.location.href = "/company-registration-profile-setup";
    } else {
      window.location.href = "/job-seeker-dashboard";
    }

    // Also call onSuccess (if needed in parent)
    onSuccess({
      user: data.user,
      token: data.token,
    });
  } catch (error) {
    setErrors({ general: "Something went wrong. Please try again later." });
    console.error(error);
  }
};


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name Field */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="User" size={16} color="#64748B" />
          </div>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`input-field pl-10 ${errors.fullName ? 'border-error focus:ring-error' : ''}`}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
        </div>
        {errors.fullName && (
          <p className="mt-1 text-sm text-error-600 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Mail" size={16} color="#64748B" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input-field pl-10 ${errors.email ? 'border-error focus:ring-error' : ''}`}
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-error-600 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Professional Title Field */}
      <div>
        <label htmlFor="professionalTitle" className="block text-sm font-medium text-text-primary mb-2">
          Professional Title
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Briefcase" size={16} color="#64748B" />
          </div>
          <input
            type="text"
            id="professionalTitle"
            name="professionalTitle"
            value={formData.professionalTitle}
            onChange={handleChange}
            className={`input-field pl-10 ${errors.professionalTitle ? 'border-error focus:ring-error' : ''}`}
            placeholder="e.g., Software Engineer, Marketing Manager"
            disabled={isLoading}
          />
        </div>
        {errors.professionalTitle && (
          <p className="mt-1 text-sm text-error-600 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.professionalTitle}
          </p>
        )}
      </div>


        <div>
  <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-2">
    Register As
  </label>
  <select
    id="role"
    name="role"
    value={formData.role}
    onChange={handleChange}
    className="input-field"
    disabled={isLoading}
  >
    <option value="user">Job Seeker</option>
    <option value="company">Company</option>
  </select>
</div>


      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Lock" size={16} color="#64748B" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`input-field pl-10 pr-10 ${errors.password ? 'border-error focus:ring-error' : ''}`}
            placeholder="Create a strong password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={isLoading}
          >
            <Icon 
              name={showPassword ? "EyeOff" : "Eye"} 
              size={16} 
              color="#64748B"
              className="hover:text-text-primary transition-smooth" 
            />
          </button>
        </div>
        
        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-secondary-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-text-secondary">
                {getPasswordStrengthText(passwordStrength)}
              </span>
            </div>
          </div>
        )}
        
        {errors.password && (
          <p className="mt-1 text-sm text-error-600 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Lock" size={16} color="#64748B" />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-error focus:ring-error' : ''}`}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={isLoading}
          >
            <Icon 
              name={showConfirmPassword ? "EyeOff" : "Eye"} 
              size={16} 
              color="#64748B"
              className="hover:text-text-primary transition-smooth" 
            />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-error-600 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Terms Agreement */}
      <div>
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className={`mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-border rounded ${errors.agreeToTerms ? 'border-error' : ''}`}
            disabled={isLoading}
          />
          <span className="text-sm text-text-secondary">
            I agree to the{' '}
            <a href="/terms" className="text-primary-600 hover:text-primary-700 transition-smooth">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary-600 hover:text-primary-700 transition-smooth">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="mt-1 text-sm text-error-600 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.agreeToTerms}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary flex items-center justify-center space-x-2 min-h-touch"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <Icon name="UserPlus" size={16} />
            <span>Create Account</span>
          </>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;