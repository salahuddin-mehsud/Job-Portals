import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const LoginForm = ({ onSuccess, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();
    console.log("Login response received:", data);

    if (!response.ok) {
      setErrors({
        general: data.message || "Login failed. Please try again.",
      });
      return;
    }

    // ✅ Always store in localStorage
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    // Redirect based on role
    if (data.user.role === "company") {
      window.location.href = "/company-registration-profile-setup";
    } else {
      window.location.href = "/job-seeker-dashboard";
    }

    // Notify parent
    onSuccess({
      user: data.user,
      token: data.token,
    });

    console.log("Login successful:", data);
  } catch (error) {
    setErrors({ general: "Something went wrong. Please try again later." });
    console.error("Fetch error:", error);
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="bg-error-50 border border-error-100 rounded-md p-3">
          <div className="flex items-start">
            <Icon name="AlertCircle" size={16} color="var(--color-error)" className="mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-error-600">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Email */}
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

      {/* Password */}
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
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={isLoading}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} color="#64748B" />
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-error-600 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary flex items-center justify-center space-x-2 min-h-touch"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <Icon name="LogIn" size={16} />
            <span>Sign In</span>
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
