import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Icon from 'components/AppIcon';
import axios from 'axios';

const JobApplicationForm = ({ job, onCancel, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', file);
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/upload/resume', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        setResume(response.data.url);
      } catch (error) {
        console.error('Error uploading resume:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleFormSubmit = (data) => {
    const applicationData = {
      jobId: job._id,
      coverLetter: data.coverLetter,
      resume: resume,
      answers: job.applicationRequirements?.questions?.map((question, index) => ({
        question: question.question,
        answer: data[`question-${index}`]
      })) || []
    };
    
    onSubmit(applicationData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Apply for {job.title}</h3>
          <button onClick={onCancel} className="text-text-secondary hover:text-text-primary">
            <Icon name="X" size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Upload Resume <span className="text-error">*</span>
            </label>
            <div className="flex items-center justify-center w-full">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                resume ? 'border-success' : 'border-border hover:border-primary'
              } ${uploading ? 'opacity-50' : ''}`}>
                {uploading ? (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Icon name="Loader" size={24} className="animate-spin mb-2" />
                    <p className="text-sm text-text-secondary">Uploading...</p>
                  </div>
                ) : resume ? (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Icon name="FileText" size={24} className="text-success mb-2" />
                    <p className="text-sm font-medium text-text-primary">Resume Uploaded</p>
                    <p className="text-xs text-text-secondary">Click to change</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Icon name="Upload" size={24} className="text-secondary-400 mb-2" />
                    <p className="text-sm text-text-secondary">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-text-secondary">PDF, DOC, DOCX (MAX. 5MB)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            {errors.resume && (
              <p className="mt-1 text-sm text-error">Resume is required</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="coverLetter" className="block text-sm font-medium text-text-primary mb-2">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              rows={5}
              placeholder="Tell us why you're a good fit for this position..."
              className="input-field"
              {...register('coverLetter')}
            />
          </div>

          {job.applicationRequirements?.questions && job.applicationRequirements.questions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-base font-medium text-text-primary mb-4">Application Questions</h4>
              <div className="space-y-4">
                {job.applicationRequirements.questions.map((question, index) => (
                  <div key={index} className="border border-border-light rounded-lg p-4">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      {question.question}
                      {question.required && <span className="text-error"> *</span>}
                    </label>
                    <textarea
                      rows={3}
                      className="input-field"
                      {...register(`question-${index}`, {
                        required: question.required ? 'This question is required' : false
                      })}
                    />
                    {errors[`question-${index}`] && (
                      <p className="mt-1 text-sm text-error">{errors[`question-${index}`].message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!resume || uploading}
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;