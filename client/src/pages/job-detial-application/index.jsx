import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Breadcrumb from 'components/ui/Breadcrumb';
import JobApplicationForm from './components/JobApplicationForm';
import CompanyProfileCard from './components/CompanyProfileCard';
import SimilarJobsCarousel from './components/SimilarJobsCarousel';
import ShareJobModal from './components/ShareJobModal';

const JobDetailApplication = () => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [isJobSaved, setIsJobSaved] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Mock job data
  const jobData = {
    id: "job-001",
    title: "Senior React Developer",
    company: {
      name: "TechFlow Solutions",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
      size: "50-200 employees",
      industry: "Software Development",
      location: "San Francisco, CA",
      website: "https://techflowsolutions.com",
      glassdoorRating: 4.2,
      reviewCount: 127,
      description: `TechFlow Solutions is a leading software development company specializing in cutting-edge web applications and digital transformation solutions. We pride ourselves on creating innovative products that solve real-world problems while maintaining a collaborative and inclusive work environment.

Our team consists of passionate developers, designers, and product managers who are committed to delivering exceptional results for our clients and users.`,
      culturePhotos: [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop"
      ]
    },
    location: "San Francisco, CA (Remote Friendly)",
    salary: "$120,000 - $160,000",
    employmentType: "Full-time",
    experienceLevel: "Senior Level",
    postedDate: "2024-01-15",
    applicationDeadline: "2024-02-15",
    description: `We are seeking a talented Senior React Developer to join our dynamic engineering team. You will be responsible for building and maintaining high-quality web applications using modern React technologies and best practices.

In this role, you'll collaborate closely with our product and design teams to create exceptional user experiences while working on challenging technical problems that impact thousands of users daily.`,
    responsibilities: [
      "Develop and maintain complex React applications with TypeScript",
      "Collaborate with cross-functional teams to define and implement new features",
      "Write clean, maintainable, and well-tested code",
      "Optimize applications for maximum speed and scalability",
      "Mentor junior developers and contribute to code reviews",
      "Stay up-to-date with the latest React ecosystem developments"
    ],
    requirements: [
      "5+ years of experience with React and modern JavaScript",
      "Strong proficiency in TypeScript and ES6+",
      "Experience with state management libraries (Redux, Zustand, etc.)",
      "Familiarity with testing frameworks (Jest, React Testing Library)",
      "Knowledge of modern build tools (Webpack, Vite, etc.)",
      "Experience with RESTful APIs and GraphQL",
      "Strong problem-solving skills and attention to detail",
      "Excellent communication and teamwork abilities"
    ],
    preferredQualifications: [
      "Experience with Next.js or other React frameworks",
      "Knowledge of cloud platforms (AWS, GCP, Azure)",
      "Familiarity with containerization (Docker, Kubernetes)",
      "Experience with CI/CD pipelines",
      "Contributions to open-source projects"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible work arrangements and remote options",
      "Professional development budget ($2,000/year)",
      "Unlimited PTO policy",
      "401(k) with company matching",
      "Modern equipment and home office stipend",
      "Team building events and company retreats"
    ],
    applicationQuestions: [
      {
        id: 1,
        question: "What interests you most about this role?",
        type: "textarea",
        required: true
      },
      {
        id: 2,
        question: "Describe your experience with React and TypeScript",
        type: "textarea",
        required: true
      },
      {
        id: 3,
        question: "Are you authorized to work in the United States?",
        type: "radio",
        options: ["Yes", "No"],
        required: true
      }
    ]
  };

  // Mock similar jobs
  const similarJobs = [
    {
      id: "job-002",
      title: "Frontend Developer",
      company: "InnovateTech",
      logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=60&h=60&fit=crop",
      location: "Remote",
      salary: "$90,000 - $120,000",
      postedDate: "2024-01-12"
    },
    {
      id: "job-003",
      title: "React Native Developer",
      company: "MobileFirst Inc",
      logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=60&h=60&fit=crop",
      location: "New York, NY",
      salary: "$110,000 - $140,000",
      postedDate: "2024-01-10"
    },
    {
      id: "job-004",
      title: "Full Stack Developer",
      company: "WebCraft Studios",
      logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=60&h=60&fit=crop",
      location: "Austin, TX",
      salary: "$100,000 - $130,000",
      postedDate: "2024-01-08"
    }
  ];

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Browse Jobs', path: '/job-search-browse' },
    { label: jobData.title, path: '/job-detail-application', isLast: true }
  ];

  const handleSaveJob = () => {
    setIsJobSaved(!isJobSaved);
  };

  const handleApplyNow = () => {
    setIsApplicationFormOpen(true);
  };

  const handleShareJob = () => {
    setIsShareModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDaysAgo = (dateString) => {
    const posted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    // Simulate checking if job is already saved
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setIsJobSaved(savedJobs.includes(jobData.id));
  }, [jobData.id]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb customItems={breadcrumbItems} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-background rounded-lg shadow-soft border border-border p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={jobData.company.logo}
                      alt={`${jobData.company.name} logo`}
                      className="w-16 h-16 rounded-lg object-cover border border-border"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                      {jobData.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-text-secondary mb-3">
                      <Link 
                        to="/company-registration-profile-setup"
                        className="text-lg font-semibold text-primary-600 hover:text-primary-700 transition-smooth"
                      >
                        {jobData.company.name}
                      </Link>
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={16} />
                        <span>{jobData.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="DollarSign" size={16} />
                        <span>{jobData.salary}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
                      <span className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>Posted {getDaysAgo(jobData.postedDate)} days ago</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Briefcase" size={14} />
                        <span>{jobData.employmentType}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="TrendingUp" size={14} />
                        <span>{jobData.experienceLevel}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleApplyNow}
                  className="btn-primary flex-1 sm:flex-none sm:px-8 py-3 text-base font-semibold"
                >
                  <Icon name="Send" size={20} className="mr-2" />
                  Apply Now
                </button>
                <button
                  onClick={handleSaveJob}
                  className={`btn-secondary flex items-center justify-center px-4 py-3 ${
                    isJobSaved ? 'bg-accent-50 text-accent-600 border-accent-200' : ''
                  }`}
                >
                  <Icon name={isJobSaved ? "BookmarkCheck" : "Bookmark"} size={20} />
                  <span className="ml-2 sm:hidden">{isJobSaved ? 'Saved' : 'Save Job'}</span>
                </button>
                <button
                  onClick={handleShareJob}
                  className="btn-secondary flex items-center justify-center px-4 py-3"
                >
                  <Icon name="Share2" size={20} />
                  <span className="ml-2 sm:hidden">Share</span>
                </button>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-background rounded-lg shadow-soft border border-border p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Job Description</h2>
              <div className="prose prose-lg max-w-none text-text-secondary mb-6">
                <p>{jobData.description}</p>
              </div>

              <div className="space-y-6">
                {/* Responsibilities */}
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2">
                    {jobData.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Icon name="Check" size={16} className="text-accent-600 mt-1 flex-shrink-0" />
                        <span className="text-text-secondary">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {jobData.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Icon name="Dot" size={16} className="text-primary-600 mt-1 flex-shrink-0" />
                        <span className="text-text-secondary">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preferred Qualifications */}
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Preferred Qualifications</h3>
                  <ul className="space-y-2">
                    {jobData.preferredQualifications.map((qualification, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Icon name="Plus" size={16} className="text-secondary-400 mt-1 flex-shrink-0" />
                        <span className="text-text-secondary">{qualification}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Benefits & Perks</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {jobData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-surface rounded-lg">
                        <Icon name="Gift" size={16} className="text-accent-600 mt-1 flex-shrink-0" />
                        <span className="text-text-secondary text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Application Deadline */}
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <Icon name="Calendar" size={20} className="text-warning-600" />
                <div>
                  <p className="text-warning-800 font-medium">Application Deadline</p>
                  <p className="text-warning-700 text-sm">
                    Applications close on {formatDate(jobData.applicationDeadline)}
                  </p>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            <SimilarJobsCarousel jobs={similarJobs} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Sticky Application Panel - Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-1030">
              <div className="flex space-x-3">
                <button
                  onClick={handleApplyNow}
                  className="btn-primary flex-1 py-3 text-base font-semibold"
                >
                  Apply Now
                </button>
                <button
                  onClick={handleSaveJob}
                  className={`btn-secondary px-4 py-3 ${
                    isJobSaved ? 'bg-accent-50 text-accent-600 border-accent-200' : ''
                  }`}
                >
                  <Icon name={isJobSaved ? "BookmarkCheck" : "Bookmark"} size={20} />
                </button>
              </div>
            </div>

            {/* Company Profile Card */}
            <div className="sticky top-24">
              <CompanyProfileCard company={jobData.company} />
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {isApplicationFormOpen && (
        <JobApplicationForm
          job={jobData}
          onClose={() => setIsApplicationFormOpen(false)}
        />
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareJobModal
          job={jobData}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {/* Mobile bottom padding */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

export default JobDetailApplication;