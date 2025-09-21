import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const SimilarJobsCarousel = ({ jobs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % jobs.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + jobs.length) % jobs.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <div className="bg-background rounded-lg shadow-soft border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Similar Jobs</h2>
        <Link
          to="/job-search-browse"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-smooth"
        >
          View All Jobs
          <Icon name="ArrowRight" size={16} className="ml-1 inline" />
        </Link>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-1 gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="border border-border rounded-lg p-4 hover:shadow-soft transition-smooth">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Image
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="w-12 h-12 rounded-lg object-cover border border-border"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to="/job-detail-application"
                  className="text-lg font-semibold text-text-primary hover:text-primary-600 transition-smooth line-clamp-1"
                >
                  {job.title}
                </Link>
                <p className="text-text-secondary text-sm mb-2">{job.company}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted mb-2">
                  <span className="flex items-center space-x-1">
                    <Icon name="MapPin" size={14} />
                    <span>{job.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="DollarSign" size={14} />
                    <span>{job.salary}</span>
                  </span>
                </div>
                <p className="text-text-muted text-xs">
                  Posted {formatDate(job.postedDate)}
                </p>
              </div>
              <div className="flex-shrink-0">
                <button className="p-2 hover:bg-surface rounded-lg transition-smooth">
                  <Icon name="Bookmark" size={16} className="text-secondary-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Carousel View */}
      <div className="md:hidden">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {jobs.map((job) => (
              <div key={job.id} className="w-full flex-shrink-0">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="flex-shrink-0">
                      <Image
                        src={job.logo}
                        alt={`${job.company} logo`}
                        className="w-12 h-12 rounded-lg object-cover border border-border"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to="/job-detail-application"
                        className="text-lg font-semibold text-text-primary hover:text-primary-600 transition-smooth line-clamp-2"
                      >
                        {job.title}
                      </Link>
                      <p className="text-text-secondary text-sm">{job.company}</p>
                    </div>
                    <button className="p-1 hover:bg-surface rounded transition-smooth">
                      <Icon name="Bookmark" size={16} className="text-secondary-400" />
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-sm text-text-muted">
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={14} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="DollarSign" size={14} />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>Posted {formatDate(job.postedDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg border border-border hover:bg-surface transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {jobs.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-smooth ${
                  index === currentIndex ? 'bg-primary-600' : 'bg-secondary-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentIndex === jobs.length - 1}
            className="p-2 rounded-lg border border-border hover:bg-surface transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimilarJobsCarousel;