import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const CompanyProfileCard = ({ company }) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="Star" size={16} className="text-warning-500 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="StarHalf" size={16} className="text-warning-500 fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-secondary-300" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-background rounded-lg shadow-soft border border-border p-6 mb-6">
      {/* Company Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-4">
          <Image
            src={company.logo}
            alt={`${company.name} logo`}
            className="w-full h-full rounded-lg object-cover border border-border"
          />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">{company.name}</h3>
        <p className="text-text-muted text-sm mb-3">{company.industry}</p>
        
        {/* Glassdoor Rating */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="flex items-center space-x-1">
            {renderStars(company.glassdoorRating)}
          </div>
          <span className="text-text-primary font-medium">{company.glassdoorRating}</span>
          <span className="text-text-muted text-sm">({company.reviewCount} reviews)</span>
        </div>

        <Link
          to="/company-registration-profile-setup"
          className="btn-secondary w-full"
        >
          <Icon name="Building2" size={16} className="mr-2" />
          View Company Profile
        </Link>
      </div>

      {/* Company Info */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Users" size={16} className="text-secondary-500" />
          <span className="text-text-secondary text-sm">{company.size}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Icon name="MapPin" size={16} className="text-secondary-500" />
          <span className="text-text-secondary text-sm">{company.location}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Icon name="Globe" size={16} className="text-secondary-500" />
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 text-sm transition-smooth"
          >
            Visit Website
          </a>
        </div>
      </div>

      {/* Company Description */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-text-primary mb-3">About the Company</h4>
        <p className="text-text-secondary text-sm leading-relaxed">{company.description}</p>
      </div>

      {/* Culture Photos */}
      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-3">Company Culture</h4>
        <div className="grid grid-cols-2 gap-2">
          {company.culturePhotos.slice(0, showAllPhotos ? company.culturePhotos.length : 4).map((photo, index) => (
            <div key={index} className="aspect-square overflow-hidden rounded-lg">
              <Image
                src={photo}
                alt={`${company.name} culture photo ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
        
        {company.culturePhotos.length > 4 && (
          <button
            onClick={() => setShowAllPhotos(!showAllPhotos)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-3 transition-smooth"
          >
            {showAllPhotos ? 'Show Less' : `View All ${company.culturePhotos.length} Photos`}
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-secondary text-sm py-2">
            <Icon name="Heart" size={14} className="mr-1" />
            Follow
          </button>
          <button className="btn-secondary text-sm py-2">
            <Icon name="Share2" size={14} className="mr-1" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileCard;