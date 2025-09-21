import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('people');
  const [industryFilter, setIndustryFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail',
    'Manufacturing', 'Hospitality', 'Media', 'Non-Profit', 'Other'
  ];

  const popularSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java',
    'Marketing', 'Sales', 'Design', 'Management', 'Data Analysis'
  ];

  const performSearch = async (page = 1) => {
    if (!searchQuery && !industryFilter && !skillFilter && activeTab === 'all') return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: activeTab === 'all' ? '' : activeTab.slice(0, -1), // people -> user, companies -> company
        industry: industryFilter,
        skill: skillFilter,
        page: page,
        limit: 10
      });

      const response = await axios.get(
        `http://localhost:5000/api/search?${params}`
      );
      
      setResults(response.data.results);
      setPagination(response.data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error('Search error:', error);
      alert('Error performing search');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setIndustryFilter('');
    setSkillFilter('');
    setResults([]);
  };

  useEffect(() => {
    if (searchQuery || industryFilter || skillFilter) {
      performSearch(1);
    }
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'people' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('people')}
        >
          People
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'companies' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('companies')}
        >
          Companies
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
      </div>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Query
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or job title"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {activeTab !== 'people' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          )}
          
          {activeTab !== 'companies' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill
              </label>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Skills</option>
                {popularSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
          
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      </form>
      
      {/* Results */}
      <div>
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <Link 
                  to={`/profile/${result._id}`}
                  className="flex-1 flex items-center gap-4 hover:underline"
                >
                  <img 
                    src={result.role === 'company' 
                      ? result.companyProfile?.logoUrl 
                      : result.profilePicture || 'https://randomuser.me/api/portraits/men/32.jpg'
                    }
                    alt={result.role === 'company' ? result.companyProfile.name : result.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">
                      {result.role === 'company' ? result.companyProfile.name : result.fullName}
                    </h3>
                    <p className="text-gray-600">
                      {result.role === 'company' 
                        ? result.companyProfile.industry 
                        : result.professionalTitle
                      }
                    </p>
                    {result.role === 'user' && result.skills && result.skills.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">Skills: </span>
                        {result.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                            {skill}
                          </span>
                        ))}
                        {result.skills.length > 3 && (
                          <span className="text-sm text-gray-500">+{result.skills.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
                
                <FollowButton targetId={result._id} targetType={result.role} />
              </div>
            ))}
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-6">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => performSearch(page)}
                    className={`mx-1 px-3 py-1 rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No results found. Try adjusting your search criteria.</p>
            </div>
          )
        )}
        
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Searching...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;