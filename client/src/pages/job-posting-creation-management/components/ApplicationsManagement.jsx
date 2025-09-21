import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import axios from 'axios';
import { useAuth } from 'contexts/AuthContext';

const ApplicationsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchCompanyJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchApplications(selectedJob._id);
    }
  }, [selectedJob]);

  const fetchCompanyJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/jobs/company', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/applications/${applicationId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const filteredApplications = applications.filter(app => 
    statusFilter === 'all' || app.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icon name="Loader" size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background border border-border rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Applications Management</h3>
        <p className="text-sm text-text-secondary">Review and manage job applications</p>
      </div>

      {!selectedJob ? (
        <div className="p-6">
          <h4 className="text-base font-medium text-text-primary mb-4">Select a Job to View Applications</h4>
          <div className="grid gap-4">
            {jobs.map(job => (
              <div key={job._id} className="border border-border rounded-lg p-4 hover:bg-surface transition-smooth">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-base font-medium text-text-primary">{job.title}</h5>
                    <p className="text-sm text-text-secondary capitalize">{job.department}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-text-secondary">{job.applications?.length || 0} applications</span>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="btn-primary"
                    >
                      View Applications
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedJob(null)}
              className="flex items-center text-primary hover:text-primary-700 mr-4"
            >
              <Icon name="ArrowLeft" size={20} className="mr-1" />
              Back to Jobs
            </button>
            <h4 className="text-lg font-medium text-text-primary">Applications for {selectedJob.title}</h4>
          </div>

          <div className="flex items-center justify-between mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="In Review">In Review</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Accepted">Accepted</option>
            </select>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map(application => (
                <div key={application._id} className="border border-border rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          {application.userId.profilePicture ? (
                            <img 
                              src={application.userId.profilePicture} 
                              alt={application.userId.fullName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-medium text-primary">
                              {application.userId.fullName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h5 className="text-base font-medium text-text-primary">{application.userId.fullName}</h5>
                          <p className="text-sm text-text-secondary">{application.userId.email}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {application.userId.skills?.map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-text-secondary">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h6 className="text-sm font-medium text-text-primary mb-1">Cover Letter</h6>
                        <p className="text-sm text-text-secondary whitespace-pre-line">
                          {application.coverLetter}
                        </p>
                      </div>
                    </div>
                    
                    <div className="lg:w-64 flex flex-col space-y-3">
                      <div>
                        <span className="text-sm font-medium text-text-primary">Applied on</span>
                        <p className="text-sm text-text-secondary">{new Date(application.appliedDate).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-text-primary">Status</span>
                        <select
                          value={application.status}
                          onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                          className="input-field mt-1"
                        >
                          <option value="Applied">Applied</option>
                          <option value="In Review">In Review</option>
                          <option value="Interview">Interview</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Accepted">Accepted</option>
                        </select>
                      </div>
                      
                      <div className="flex space-x-2">
                        <a
                          href={application.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary flex-1 text-center"
                        >
                          View Resume
                        </a>
                        <button className="btn-primary flex-1">
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="FileText" size={48} className="text-secondary-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-text-primary mb-2">No applications found</h4>
              <p className="text-text-secondary">
                {statusFilter !== 'all' 
                  ? `No applications with status "${statusFilter}"` 
                  : 'No applications have been submitted for this job yet'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationsManagement;