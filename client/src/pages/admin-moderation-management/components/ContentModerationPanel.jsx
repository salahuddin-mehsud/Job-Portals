// src/pages/admin-moderation-management/components/ContentModerationPanel.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';


const ContentModerationPanel = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const jobsRequiringApproval = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      company: 'InnovateTech Solutions',
      location: 'Remote',
      salary: '$120,000 - $150,000',
      postedBy: 'Sarah Johnson',
      postedAt: '2024-01-15 10:30',
      status: 'pending_approval',
      flaggedIssues: ['Salary verification needed', 'Company legitimacy check'],
      originalContent: {
        description: 'We are looking for a talented developer to join our remote team.',
        requirements: ['5+ years experience', 'React, Node.js', 'Team player'],
        benefits: ['Health insurance', 'Flexible hours', 'Stock options']
      },
      suggestedEdits: {
        description: 'We are looking for a talented Full Stack Developer to join our fully remote team and contribute to cutting-edge projects.',
        requirements: ['5+ years of professional development experience', 'Strong proficiency in React and Node.js', 'Excellent communication and team collaboration skills'],
        benefits: ['Comprehensive health insurance', 'Flexible working hours', 'Equity participation program']
      }
    },
    {
      id: 2,
      title: 'Marketing Manager',
      company: 'Growth Marketing Co',
      location: 'New York, NY',
      salary: '$80,000 - $100,000',
      postedBy: 'Mike Chen',
      postedAt: '2024-01-15 09:15',
      status: 'under_review',
      flaggedIssues: ['Content quality improvement needed'],
      originalContent: {
        description: 'Join our marketing team and help us grow.',
        requirements: ['Marketing experience', 'Good communication'],
        benefits: ['Health care', 'PTO']
      },
      suggestedEdits: {
        description: 'Join our dynamic marketing team and help drive our company\'s growth through strategic marketing initiatives and innovative campaigns.',
        requirements: ['3+ years of marketing experience', 'Excellent written and verbal communication skills', 'Experience with digital marketing tools and analytics'],
        benefits: ['Comprehensive healthcare coverage', 'Generous paid time off policy', 'Professional development opportunities']
      }
    }
  ];

  const rejectionReasons = [
    'Discriminatory content',
    'Misleading job description',
    'Unrealistic requirements',
    'Inappropriate salary range',
    'Company verification required',
    'Duplicate posting',
    'Spam or low quality content',
    'Other (specify below)'
  ];

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setShowComparison(false);
    setRejectionReason('');
    setCustomReason('');
  };

  const handleApprove = (jobId, useEdits = false) => {
    console.log(`Approving job ${jobId} with edits: ${useEdits}`);
    // Implement approval logic
  };

  const handleReject = (jobId) => {
    const reason = rejectionReason === 'Other (specify below)' ? customReason : rejectionReason;
    if (!reason) {
      alert('Please select or specify a rejection reason');
      return;
    }
    console.log(`Rejecting job ${jobId} with reason: ${reason}`);
    // Implement rejection logic
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary">Content Moderation Panel</h2>
        <p className="text-sm text-text-secondary mt-1">
          Review job postings requiring approval with side-by-side content comparison
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs List */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-medium text-text-primary">Jobs Requiring Approval</h3>
              <p className="text-sm text-text-secondary mt-1">{jobsRequiringApproval.length} items</p>
            </div>
            <div className="space-y-0">
              {jobsRequiringApproval.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleJobSelect(job)}
                  className={`p-4 border-b border-border cursor-pointer transition-smooth hover:bg-surface-50 ${
                    selectedJob?.id === job.id ? 'bg-primary-50 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-text-primary truncate">{job.title}</h4>
                      <p className="text-sm text-text-secondary truncate">{job.company}</p>
                      <p className="text-xs text-text-secondary mt-1">{job.location}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.flaggedIssues.map((issue, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ml-2 flex-shrink-0 ${
                      job.status === 'pending_approval' ? 'bg-yellow-400' : 'bg-blue-400'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Review Area */}
        <div className="lg:col-span-2">
          {selectedJob ? (
            <div className="space-y-6">
              {/* Job Header */}
              <div className="card">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary">{selectedJob.title}</h3>
                      <p className="text-text-secondary">{selectedJob.company} • {selectedJob.location}</p>
                      <p className="text-primary font-medium mt-1">{selectedJob.salary}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowComparison(!showComparison)}
                        className={`btn-secondary text-sm ${showComparison ? 'bg-primary text-white' : ''}`}
                      >
                        <Icon name="GitCompare" size={16} className="mr-1" />
                        Compare Edits
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <span>Posted by {selectedJob.postedBy}</span>
                    <span>•</span>
                    <span>{selectedJob.postedAt}</span>
                  </div>
                </div>
              </div>

              {/* Content Comparison */}
              <div className="grid grid-cols-1 gap-6">
                {showComparison ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Original Content */}
                    <div className="card">
                      <div className="p-4 bg-red-50 border-b border-border">
                        <h4 className="font-medium text-text-primary flex items-center">
                          <Icon name="FileText" size={16} className="mr-2 text-red-600" />
                          Original Content
                        </h4>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h5 className="font-medium text-text-primary mb-2">Description</h5>
                          <p className="text-sm text-text-secondary">{selectedJob.originalContent.description}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-text-primary mb-2">Requirements</h5>
                          <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                            {selectedJob.originalContent.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-text-primary mb-2">Benefits</h5>
                          <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                            {selectedJob.originalContent.benefits.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Suggested Edits */}
                    <div className="card">
                      <div className="p-4 bg-green-50 border-b border-border">
                        <h4 className="font-medium text-text-primary flex items-center">
                          <Icon name="FileEdit" size={16} className="mr-2 text-green-600" />
                          Suggested Edits
                        </h4>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h5 className="font-medium text-text-primary mb-2">Description</h5>
                          <p className="text-sm text-text-secondary">{selectedJob.suggestedEdits.description}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-text-primary mb-2">Requirements</h5>
                          <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                            {selectedJob.suggestedEdits.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-text-primary mb-2">Benefits</h5>
                          <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                            {selectedJob.suggestedEdits.benefits.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card">
                    <div className="p-6 space-y-4">
                      <div>
                        <h5 className="font-medium text-text-primary mb-2">Job Description</h5>
                        <p className="text-sm text-text-secondary">{selectedJob.originalContent.description}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-text-primary mb-2">Requirements</h5>
                        <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                          {selectedJob.originalContent.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-text-primary mb-2">Benefits</h5>
                        <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                          {selectedJob.originalContent.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rejection Reasons */}
              <div className="card">
                <div className="p-6">
                  <h4 className="font-medium text-text-primary mb-4">Rejection Reason (Optional)</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {rejectionReasons.map((reason) => (
                        <label key={reason} className="flex items-center">
                          <input
                            type="radio"
                            name="rejectionReason"
                            value={reason}
                            checked={rejectionReason === reason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="mr-2 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-text-secondary">{reason}</span>
                        </label>
                      ))}
                    </div>
                    {rejectionReason === 'Other (specify below)' && (
                      <textarea
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Please specify the reason for rejection..."
                        className="input-field mt-2"
                        rows={3}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => handleApprove(selectedJob.id, false)}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <Icon name="Check" size={16} />
                  <span>Approve as Original</span>
                </button>
                
                {showComparison && (
                  <button
                    onClick={() => handleApprove(selectedJob.id, true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-smooth flex items-center justify-center space-x-2"
                  >
                    <Icon name="FileEdit" size={16} />
                    <span>Approve with Edits</span>
                  </button>
                )}
                
                <button
                  onClick={() => handleReject(selectedJob.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-smooth flex items-center justify-center space-x-2"
                >
                  <Icon name="X" size={16} />
                  <span>Reject</span>
                </button>
                
                <button className="btn-secondary flex items-center justify-center space-x-2">
                  <Icon name="MessageSquare" size={16} />
                  <span>Request Changes</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="card flex items-center justify-center py-16">
              <div className="text-center">
                <Icon name="FileText" size={48} className="mx-auto mb-4 text-secondary-400" />
                <h3 className="text-lg font-medium text-text-primary mb-2">Select a Job to Review</h3>
                <p className="text-text-secondary max-w-md">
                  Choose a job posting from the list on the left to begin the content moderation process.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentModerationPanel;