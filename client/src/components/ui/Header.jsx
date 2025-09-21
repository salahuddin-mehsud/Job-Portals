import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import axios from 'axios';

const Header = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ people: [], companies: [] });
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState('job-seeker');
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const location = useLocation();

  const navigationItems = {
    'job-seeker': [
      { label: 'Browse', path: '/search', icon: 'Search' },
      { label: 'Applications', path: '/job-detail-application', icon: 'FileText' },
    ],
    'recruiter': [
      { label: 'Browse Jobs', path: '/job-search-browse', icon: 'Search' },
      { label: 'Dashboard', path: '/recruiter-dashboard-analytics', icon: 'BarChart3' },
      { label: 'Post Job', path: '/job-posting-creation-management', icon: 'Plus' },
      { label: 'Company', path: '/company-registration-profile-setup', icon: 'Building2' },
    ],
    'admin': [
      { label: 'Browse Jobs', path: '/job-search-browse', icon: 'Search' },
      { label: 'Admin Panel', path: '/admin-moderation-management', icon: 'Shield' },
      { label: 'Analytics', path: '/recruiter-dashboard-analytics', icon: 'BarChart3' },
    ],
    'anonymous': [
      { label: 'Browse Jobs', path: '/job-search-browse', icon: 'Search' },
      { label: 'Sign In', path: '/job-seeker-registration-login', icon: 'LogIn' },
    ]
  };

  const currentNavItems = isAuthenticated ? navigationItems[userRole] : navigationItems['anonymous'];

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
        setSearchQuery('');
        setSearchResults({ people: [], companies: [] });
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const storedUserString = localStorage.getItem("user");
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        console.error("No user or token in localStorage");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profile = res.data;
        setUser({
          fullName: profile.fullName,
          email: profile.email,
          professionalTitle: profile.professionalTitle,
          profileImage: profile.profilePicture || "https://randomuser.me/api/portraits/men/32.jpg",
        });

        // Set user role based on profile data
        if (profile.role) {
          setUserRole(profile.role === 'company' ? 'recruiter' : 'job-seeker');
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // Search function with debouncing
  useEffect(() => {
    const searchUsersAndCompanies = async () => {
      if (!searchQuery.trim()) {
        setSearchResults({ people: [], companies: [] });
        return;
      }

      setIsSearchLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`
        );
        
        const results = response.data.results || [];
        
        // Separate people and companies
        const people = results.filter(item => item.role === 'user');
        const companies = results.filter(item => item.role === 'company');
        
        setSearchResults({ people, companies });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchUsersAndCompanies();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
      setSearchQuery('');
      setSearchResults({ people: [], companies: [] });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchItemClick = (id) => {
    // First navigate to the profile
    navigate(`/profile/${id}`);
    
    // Then close the search after a small delay to ensure navigation happens
    setTimeout(() => {
      setIsSearchExpanded(false);
      setSearchQuery("");
      setSearchResults({ people: [], companies: [] });
    }, 100);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const getUserDisplayName = () => {
    const names = {
      'job-seeker': storedUser?.fullName,
      'recruiter': storedUser?.fullName,
      'admin': 'Admin User'
    };
    return names[userRole] || 'User';
  };

  const getUserMenuItems = () => {
    const storedUserString = localStorage.getItem("user");
    if (!storedUserString) return [];
    const storedUser = JSON.parse(storedUserString);
    const role = storedUser.role;

    const commonItems = [
      { label: 'Settings', icon: 'Settings', action: () => navigate('/user-setting') },
      { 
        label: 'Sign Out', 
        icon: 'LogOut', 
        action: () => {
          localStorage.clear();
          sessionStorage.clear();
          navigate('/login');
        }, 
        className: 'text-error border-t border-border-light pt-2 mt-2' 
      }
    ];

    if (role === 'user') {
      return [
        { label: 'Profile', icon: 'User', action: () => navigate('/user-profile') },
        { label: 'Dashboard', icon: 'BarChart3', action: () => navigate('/job-seeker-dashboard') },
        { label: 'Saved Jobs', icon: 'Bookmark', action: () => navigate('/saved-jobs') },
        { label: 'Application History', icon: 'Clock', action: () => navigate('/history') },
        ...commonItems
      ];
    }

    if (role === 'company') {
      return [
        { label: 'Profile', icon: 'User', action: () => navigate('/company-profile') },
        { label: 'Dashboard', icon: 'BarChart3', action: () => navigate('/job-posting-creation-management') },
        ...commonItems
      ];
    }

    return commonItems;
  };

  return (
    <header className="sticky top-0 z-1040 bg-background border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-smooth group-hover:bg-primary-700">
                <Icon name="Briefcase" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-text-primary hidden sm:block">JobBoard</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Search" size={20} color="#64748B" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchExpanded(true)}
                  placeholder="Search people, companies, or skills..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-smooth bg-surface"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults({ people: [], companies: [] });
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Icon name="X" size={16} color="#64748B" />
                  </button>
                )}
              </div>
            </form>
            
            {/* Search Results Dropdown */}
            {isSearchExpanded && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {isSearchLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-text-secondary">Searching...</p>
                  </div>
                ) : (
                  <>
                    {/* People Results */}
                    {searchResults.people.length > 0 && (
                      <div className="border-b border-border-light">
                        <div className="px-4 py-2 bg-surface-100 text-sm font-medium text-text-secondary">
                          People
                        </div>
                        {searchResults.people.map(person => (
                          <div
                            key={person._id}
                            onClick={() => handleSearchItemClick(person._id)}
                            className="px-4 py-3 hover:bg-surface-100 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center">
                              <img
                                src={person.profilePicture || 'https://randomuser.me/api/portraits/men/32.jpg'}
                                alt={person.fullName}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                              <div>
                                <p className="font-medium text-text-primary">{person.fullName}</p>
                                <p className="text-sm text-text-secondary">{person.professionalTitle}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Companies Results */}
                    {searchResults.companies.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-surface-100 text-sm font-medium text-text-secondary">
                          Companies
                        </div>
                        {searchResults.companies.map(company => (
                          <div
                            key={company._id}
                            onClick={() => handleSearchItemClick(company._id)}
                            className="px-4 py-3 hover:bg-surface-100 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center">
                              <img
                                src={company.companyProfile?.logoUrl || 'https://randomuser.me/api/portraits/men/32.jpg'}
                                alt={company.companyProfile?.name}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                              <div>
                                <p className="font-medium text-text-primary">{company.companyProfile?.name}</p>
                                <p className="text-sm text-text-secondary">{company.companyProfile?.industry}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* No Results */}
                    {searchResults.people.length === 0 && searchResults.companies.length === 0 && (
                      <div className="p-4 text-center text-text-secondary">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                    
                    {/* View All Results */}
                    {(searchResults.people.length > 0 || searchResults.companies.length > 0) && (
                      <div className="border-t border-border-light p-2">
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="w-full text-center text-primary hover:text-primary-700 font-medium py-2"
                        >
                          View all results
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth min-h-touch ${
                  isActivePath(item.path)
                    ? 'bg-primary-50 text-primary-600' :'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu & Mobile Controls */}
          <div className="flex items-center space-x-2">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-smooth min-h-touch min-w-touch"
            >
              <Icon name="Search" size={20} />
            </button>

            {/* User Menu */}
            {isAuthenticated && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-smooth min-h-touch"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <img 
                      src={user?.profileImage}
                      alt={user?.fullName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="hidden lg:block text-sm font-medium">{getUserDisplayName()}</span>
                  <Icon name="ChevronDown" size={16} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-background rounded-lg shadow-modal border border-border z-1050">
                    <div className="py-2">
                      {getUserMenuItems().map((item, index) => (
                        <button
                          key={index}
                          onClick={item.action}
                          className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-left hover:bg-surface transition-smooth ${item.className || ''}`}
                        >
                          <Icon name={item.icon} size={16} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-smooth min-h-touch min-w-touch"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchExpanded && (
          <div className="md:hidden pb-4" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Search" size={20} color="#64748B" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search people, companies, or skills..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-smooth bg-surface"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults({ people: [], companies: [] });
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Icon name="X" size={16} color="#64748B" />
                  </button>
                )}
              </div>
            </form>
            
            {/* Mobile Search Results */}
            {searchQuery && (
              <div className="mt-2 bg-white border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {isSearchLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-text-secondary">Searching...</p>
                  </div>
                ) : (
                  <>
                    {/* People Results */}
                    {searchResults.people.length > 0 && (
                      <div className="border-b border-border-light">
                        <div className="px-4 py-2 bg-surface-100 text-sm font-medium text-text-secondary">
                          People
                        </div>
                        {searchResults.people.map(person => (
                          <div
                            key={person._id}
                            onClick={() => handleSearchItemClick(person._id)}
                            className="px-4 py-3 hover:bg-surface-100 cursor-pointer transition-colors flex items-center"
                          >
                            <img
                              src={person.profilePicture || 'https://randomuser.me/api/portraits/men/32.jpg'}
                              alt={person.fullName}
                              className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium text-text-primary">{person.fullName}</p>
                              <p className="text-sm text-text-secondary">{person.professionalTitle}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Companies Results */}
                    {searchResults.companies.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-surface-100 text-sm font-medium text-text-secondary">
                          Companies
                        </div>
                        {searchResults.companies.map(company => (
                          <div
                            key={company._id}
                            onClick={() => handleSearchItemClick(company._id)}
                            className="px-4 py-3 hover:bg-surface-100 cursor-pointer transition-colors flex items-center"
                          >
                            <img
                              src={company.companyProfile?.logoUrl || 'https://randomuser.me/api/portraits/men/32.jpg'}
                              alt={company.companyProfile?.name}
                              className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium text-text-primary">{company.companyProfile?.name}</p>
                              <p className="text-sm text-text-secondary">{company.companyProfile?.industry}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* No Results */}
                    {searchResults.people.length === 0 && searchResults.companies.length === 0 && (
                      <div className="p-4 text-center text-text-secondary">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                    
                    {/* View All Results */}
                    {(searchResults.people.length > 0 || searchResults.companies.length > 0) && (
                      <div className="border-t border-border-light p-2">
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="w-full text-center text-primary hover:text-primary-700 font-medium py-2"
                        >
                          View all results
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <nav className="py-4 space-y-1">
              {currentNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-smooth min-h-touch ${
                    isActivePath(item.path)
                      ? 'bg-primary-50 text-primary-600' :'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}
                >
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;