import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const SavedJobs = ({ limit, showViewAll = false, setActiveTab }) => {
  // Mock saved jobs data
  const allSavedJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechGrowth Inc.',
    companyLogo: 'https://randomuser.me/api/portraits/men/41.jpg',
    location: 'San Francisco, CA',
    locationType: 'Remote',
    salary: '$120,000 - $150,000',
    datePosted: '3 days ago',
    savedDate: '2 days ago',
    tags: ['React', 'TypeScript', 'Redux'],
    description: 'We are looking for an experienced Frontend Developer to join our team and help build innovative web applications.'
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    company: 'Innovate Solutions',
    companyLogo: 'https://randomuser.me/api/portraits/women/68.jpg',
    location: 'New York, NY',
    locationType: 'Hybrid',
    salary: '$90,000 - $120,000',
    datePosted: '1 week ago',
    savedDate: '5 days ago',
    tags: ['Figma', 'User Research', 'Prototyping'],
    description: 'Join our design team to create beautiful and intuitive user experiences for our products.'
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'Global Systems',
    companyLogo: 'https://randomuser.me/api/portraits/men/55.jpg',
    location: 'Austin, TX',
    locationType: 'On-site',
    salary: '$110,000 - $140,000',
    datePosted: '2 weeks ago',
    savedDate: '1 week ago',
    tags: ['Node.js', 'React', 'MongoDB'],
    description: 'Looking for a talented Full Stack Developer to help build and maintain our web applications.'
  },
  {
    id: 4,
    title: 'Product Manager',
    company: 'Future Innovations',
    companyLogo: 'https://randomuser.me/api/portraits/women/45.jpg',
    location: 'Seattle, WA',
    locationType: 'Remote',
    salary: '$130,000 - $160,000',
    datePosted: '5 days ago',
    savedDate: '3 days ago',
    tags: ['Agile', 'Product Strategy', 'User Stories'],
    description: 'Join our product team to lead the development of innovative software solutions.'
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Cloud Solutions',
    companyLogo: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'Chicago, IL',
    locationType: 'Remote',
    salary: '$115,000 - $145,000',
    datePosted: '1 week ago',
    savedDate: '4 days ago',
    tags: ['AWS', 'Docker', 'Kubernetes'],
    description: 'We are seeking a DevOps Engineer to help us build and maintain our cloud infrastructure.'
  },
  {
    id: 6,
    title: 'Data Scientist',
    company: 'Analytics Pro',
    companyLogo: 'https://randomuser.me/api/portraits/women/22.jpg',
    location: 'Boston, MA',
    locationType: 'Hybrid',
    salary: '$125,000 - $155,000',
    datePosted: '2 weeks ago',
    savedDate: '1 week ago',
    tags: ['Python', 'Machine Learning', 'SQL'],
    description: 'Join our data science team to analyze complex datasets and build predictive models.'
  }];


  const [savedJobs, setSavedJobs] = useState(allSavedJobs);
  const displayJobs = limit ? savedJobs.slice(0, limit) : savedJobs;

  const handleRemoveJob = (jobId) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
  };

  return (
    <div className="bg-background rounded-lg border border-border shadow-soft">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-semibold text-text-primary">Saved Jobs</h3>
        <Link to="/saved-jobs" onClick={() => setActiveTab('saved')} className="text-sm text-primary hover:text-primary-700 transition-smooth flex items-center">
            <span className=''>View All</span>
            <Icon name="ChevronRight" size={16} className="ml-1" />
          </Link>
        
      </div>
      
      {displayJobs.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6">
          {displayJobs.map((job) =>
        <div
          key={job.id}
          className="group relative bg-background border border-border rounded-lg p-4 hover:shadow-modal transition-smooth">

              <div className="absolute top-4 right-4 flex space-x-2">
                <button
              onClick={() => handleRemoveJob(job.id)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface text-text-secondary hover:bg-error-50 hover:text-error-600 transition-smooth"
              aria-label="Remove job">

                  <Icon name="X" size={16} />
                </button>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                  <Image
                src={job.companyLogo}
                alt={job.company}
                className="w-full h-full object-cover" />

                </div>
                
                <div className="flex-1 min-w-0">
                  <Link to="/job-detail-application" className="block">
                    <h4 className="text-base font-medium text-text-primary hover:text-primary-600 transition-smooth truncate">
                      {job.title}
                    </h4>
                    <p className="text-sm text-text-secondary mt-1 truncate">
                      {job.company}
                    </p>
                  </Link>
                  
                  <div className="flex flex-wrap items-center mt-2 text-xs text-text-secondary">
                    <div className="flex items-center mr-3">
                      <Icon name="MapPin" size={14} className="mr-1" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center mr-3">
                      <Icon name="Building" size={14} className="mr-1" />
                      <span>{job.locationType}</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="DollarSign" size={14} className="mr-1" />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.tags.map((tag, index) =>
                <span
                  key={index}
                  className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600">

                        {tag}
                      </span>
                )}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-text-secondary">
                      Saved {job.savedDate}
                    </span>
                    <Link
                  to="/job-detail-application"
                  className="inline-flex items-center text-xs font-medium text-primary hover:text-primary-700 transition-smooth">

                      <span>Apply Now</span>
                      <Icon name="ArrowRight" size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
        )}
        </div> :

      <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
            <Icon name="Bookmark" size={24} className="text-secondary-400" />
          </div>
          <h4 className="text-lg font-medium text-text-primary mb-2">No Saved Jobs</h4>
          <p className="text-sm text-text-secondary mb-4">
            You haven't saved any jobs yet. Browse jobs and save the ones you're interested in.
          </p>
          <Link to="/job-search-browse" className="btn-primary inline-flex items-center">
            <Icon name="Search" size={16} className="mr-2" />
            <span>Browse Jobs</span>
          </Link>
        </div>
      }
    </div>);

};

export default SavedJobs;