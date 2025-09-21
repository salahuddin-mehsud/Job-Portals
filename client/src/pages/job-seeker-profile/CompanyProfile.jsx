import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CompanyProfile.css';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyProfile = () => {
      try {
        setLoading(true);
        
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          setError('User not logged in');
          setLoading(false);
          return;
        }
        
        const user = JSON.parse(userData);
        
        if (user.role !== 'company') {
          setError('This profile does not belong to a company');
          setLoading(false);
          return;
        }
        
        if (!user.companyProfile) {
          setError('Company profile not found in user data');
          setLoading(false);
          return;
        }
        
        // Set company data directly from localStorage
        setCompany(user);
      } catch (err) {
        console.error('Error fetching company profile:', err);
        setError('Failed to load company profile');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  if (loading) {
    return (
      <div className="company-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading company profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-profile-error">
        <div className="error-icon">⚠️</div>
        <h2>Unable to Load Profile</h2>
        <p>{error}</p>
        <button onClick={() => window.history.back()} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="company-profile-error">
        <div className="error-icon">❓</div>
        <h2>Company Not Found</h2>
        <p>The company profile you're looking for doesn't exist.</p>
        <button onClick={() => window.history.back()} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  const { companyProfile } = company;

  return (
    <div className="company-profile-container">
      {/* Header Section */}
      <div 
        className="company-header"
        style={{
          backgroundColor: companyProfile.colors?.primary || '#3b82f6',
          color: 'white'
        }}
      >
        <div className="header-content">
          <div className="company-logo-container">
            <img 
              src={companyProfile.logoUrl || 'https://via.placeholder.com/150'} 
              alt={`${companyProfile.name} logo`} 
              className="company-logo"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
          </div>
          <div className="company-basic-info">
            <h1 className="company-name">{companyProfile.name}</h1>
            <p className="company-industry">{companyProfile.industry}</p>
            <div className="company-stats">
              <span className="stat">
                <i className="fas fa-users"></i> {companyProfile.employeeCount || 'N/A'} employees
              </span>
              <span className="stat">
                <i className="fas fa-map-marker-alt"></i> {companyProfile.headquarters || 'N/A'}
              </span>
              <span className="stat">
                <i className="fas fa-calendar-alt"></i> Founded {companyProfile.foundingYear || 'N/A'}
              </span>
            </div>
            {companyProfile.website && (
              <a 
                href={companyProfile.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="website-link"
              >
                <i className="fas fa-globe"></i> Visit Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="company-main-content">
        <div className="content-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* About Section */}
            <section className="company-section">
              <h2>About Us</h2>
              <p className="company-description">
                {companyProfile.description || 'No description provided.'}
              </p>
            </section>

            {/* Culture Photos */}
            {companyProfile.culturePhotos && companyProfile.culturePhotos.length > 0 && (
              <section className="company-section">
                <h2>Company Culture</h2>
                <div className="culture-gallery">
                  {companyProfile.culturePhotos.map((photo, index) => (
                    <div key={index} className="culture-photo-item">
                      <img 
                        src={photo} 
                        alt={`Company culture ${index + 1}`} 
                        className="culture-photo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {companyProfile.culturePhotosCaptions && 
                       companyProfile.culturePhotosCaptions[index] && (
                        <p className="culture-caption">
                          {companyProfile.culturePhotosCaptions[index]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Contact Information */}
            <section className="company-section contact-info">
              <h2>Contact Information</h2>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-user"></i>
                  <span>{companyProfile.contactName || 'N/A'}</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>{companyProfile.contactEmail || 'N/A'}</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>{companyProfile.contactPhone || 'N/A'}</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-briefcase"></i>
                  <span>{companyProfile.contactPosition || 'N/A'}</span>
                </div>
              </div>
            </section>

            {/* Company Details */}
            <section className="company-section">
              <h2>Company Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Industry</span>
                  <span className="detail-value">{companyProfile.industry || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Company Size</span>
                  <span className="detail-value">{companyProfile.size || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Headquarters</span>
                  <span className="detail-value">{companyProfile.headquarters || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Founded</span>
                  <span className="detail-value">{companyProfile.foundingYear || 'N/A'}</span>
                </div>
              </div>
            </section>

            {/* Brand Colors */}
            {companyProfile.colors && (
              <section className="company-section">
                <h2>Brand Colors</h2>
                <div className="color-palette">
                  {companyProfile.colors.primary && (
                    <div className="color-item">
                      <div 
                        className="color-swatch" 
                        style={{ backgroundColor: companyProfile.colors.primary }}
                      ></div>
                      <span className="color-label">Primary</span>
                      <span className="color-value">{companyProfile.colors.primary}</span>
                    </div>
                  )}
                  {companyProfile.colors.secondary && (
                    <div className="color-item">
                      <div 
                        className="color-swatch" 
                        style={{ backgroundColor: companyProfile.colors.secondary }}
                      ></div>
                      <span className="color-label">Secondary</span>
                      <span className="color-value">{companyProfile.colors.secondary}</span>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;