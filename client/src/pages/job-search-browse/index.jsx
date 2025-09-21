import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import SearchFilters from './components/SearchFilters';
import JobCard from './components/JobCard';
import AdvancedSearchModal from './components/AdvancedSearchModal';
import JobPreviewPanel from './components/JobPreviewPanel';

const JobSearchBrowse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    postingDate: '',
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [recentSearches] = useState(['React Developer', 'Product Manager', 'UX Designer']);
  const [searchSuggestions] = useState(['Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'DevOps Engineer']);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchInputRef = useRef(null);

  // State for actual jobs data
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5000/api/jobs");
        setJobs(res.data);
        setFilteredJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search and posting date
  useEffect(() => {
    let filtered = [...jobs];

    // Search query filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.company?.name && job.company.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Posting date filter
    if (selectedFilters.postingDate) {
      const now = new Date();
      const daysAgo = {
        '24h': 1,
        '3d': 3,
        '7d': 7,
        '30d': 30
      }[selectedFilters.postingDate];

      if (daysAgo) {
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(job => new Date(job.createdAt) >= cutoffDate);
      }
    }

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'salary':
          const aSalary = parseInt(a.salary?.replace(/[^0-9]/g, '') || 0);
          const bSalary = parseInt(b.salary?.replace(/[^0-9]/g, '') || 0);
          return bSalary - aSalary;
        case 'relevance':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredJobs(filtered);
  }, [searchQuery, selectedFilters, sortBy, jobs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
      } else {
        newSaved.add(jobId);
      }
      return newSaved;
    });
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedFilters.postingDate) count++;
    return count;
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      postingDate: '',
    });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Find Your Next Opportunity</h1>
          <p className="text-text-secondary">Discover jobs from top companies in your field</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="Search" size={20} color="#64748B" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search jobs, companies, or skills..."
                className="w-full pl-12 pr-12 py-4 text-lg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-smooth bg-background shadow-soft"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <Icon name="X" size={20} color="#64748B" />
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-modal z-50">
                {searchQuery && (
                  <div className="p-4 border-b border-border-light">
                    <h4 className="text-sm font-medium text-text-secondary mb-2">Search for "{searchQuery}"</h4>
                    <button
                      onClick={() => {
                        setShowSuggestions(false);
                        searchInputRef.current?.blur();
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Press Enter to search
                    </button>
                  </div>
                )}
                
                {searchSuggestions.filter(suggestion => 
                  suggestion.toLowerCase().includes(searchQuery.toLowerCase())
                ).length > 0 && (
                  <div className="p-4 border-b border-border-light">
                    <h4 className="text-sm font-medium text-text-secondary mb-2">Suggestions</h4>
                    <div className="space-y-1">
                      {searchSuggestions
                        .filter(suggestion => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
                        .slice(0, 3)
                        .map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(suggestion);
                              setShowSuggestions(false);
                            }}
                            className="block w-full text-left px-2 py-1 text-sm text-text-primary hover:bg-surface rounded transition-smooth"
                          >
                            {suggestion}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {recentSearches.length > 0 && (
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-text-secondary mb-2">Recent Searches</h4>
                    <div className="space-y-1">
                      {recentSearches.slice(0, 3).map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(search);
                            setShowSuggestions(false);
                          }}
                          className="flex items-center space-x-2 w-full text-left px-2 py-1 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-smooth"
                        >
                          <Icon name="Clock" size={14} />
                          <span>{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <p className="text-text-secondary">
                  <span className="font-medium text-text-primary">{filteredJobs.length}</span> jobs found
                </p>
                
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="date">Most Recent</option>
                  <option value="salary">Highest Salary</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-background border border-border rounded-lg p-6 animate-pulse">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-secondary-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                        <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                        <div className="h-3 bg-secondary-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="AlertCircle" size={32} color="#EF4444" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Error Loading Jobs</h3>
                <p className="text-text-secondary mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Job Listings */}
            {!isLoading && !error && (
              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="Search" size={32} color="#64748B" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">No jobs found</h3>
                    <p className="text-text-secondary mb-4">Try adjusting your search criteria</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="btn-primary"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
  <JobCard
    key={job._id}
    job={{ ...job, company: job.company?.name || "Unknown Company" }}
    isSaved={savedJobs.has(job._id)}
    onSave={() => handleSaveJob(job._id)}
    onSelect={() => setSelectedJobId(job._id)}
    isSelected={selectedJobId === job._id}
    formatTimeAgo={formatTimeAgo}
  />
))

                )}
              </div>
            )}
          </div>

          {/* Job Preview Panel - Desktop */}
          {selectedJobId && (
            <div className="hidden xl:block w-96 flex-shrink-0">
              <JobPreviewPanel
                job={filteredJobs.find(j => j._id === selectedJobId)}
                onClose={() => setSelectedJobId(null)}
                isSaved={savedJobs.has(selectedJobId)}
                onSave={() => handleSaveJob(selectedJobId)}
                formatTimeAgo={formatTimeAgo}
              />
            </div>
          )}
        </div>

        {/* Advanced Search Modal */}
        <AdvancedSearchModal
          isOpen={isAdvancedSearchOpen}
          onClose={() => setIsAdvancedSearchOpen(false)}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

export default JobSearchBrowse;