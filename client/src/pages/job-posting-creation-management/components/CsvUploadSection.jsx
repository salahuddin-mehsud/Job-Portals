import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const CsvUploadSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'uploading', 'success', 'error'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      handleFileSelection(droppedFile);
    } else {
      setValidationErrors(['Please upload a CSV file']);
    }
  };
  
  // Handle file input change
  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };
  
  // Process the selected file
  const handleFileSelection = (selectedFile) => {
    setFile(selectedFile);
    setValidationErrors([]);
    setUploadStatus(null);
  };
  
  // Handle file upload
  const handleUpload = () => {
    if (!file) {
      setValidationErrors(['Please select a file to upload']);
      return;
    }
    
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    // Simulate file upload with progress
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Simulate validation errors for demonstration
          if (Math.random() > 0.7) {
            setUploadStatus('error');
            setValidationErrors([
              'Row 3: Missing required field "title"',
              'Row 7: Invalid employment type "freelance"',
              'Row 12: Invalid location format'
            ]);
          } else {
            setUploadStatus('success');
          }
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };
  
  // Reset the upload
  const handleReset = () => {
    setFile(null);
    setUploadStatus(null);
    setUploadProgress(0);
    setValidationErrors([]);
  };
  
  // Download template
  const handleDownloadTemplate = () => {
    // In a real app, this would trigger a file download
    alert('Template download started');
  };
  
  return (
    <div className="bg-background border border-border rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-border bg-surface-100">
        <h3 className="text-lg font-semibold text-text-primary">Bulk Upload Jobs</h3>
        <p className="text-sm text-text-secondary">Upload multiple job listings at once using a CSV file</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-base font-medium text-text-primary mb-2">Instructions</h4>
          <ol className="list-decimal list-inside space-y-2 text-text-secondary">
            <li>Download our CSV template or prepare your own file with the required columns</li>
            <li>Fill in your job details following the format in the template</li>
            <li>Upload your completed CSV file</li>
            <li>Review any validation errors and fix them in your file</li>
            <li>Confirm to publish or save as drafts</li>
          </ol>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <button
            onClick={handleDownloadTemplate}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Icon name="FileDown" size={20} />
            <span>Download CSV Template</span>
          </button>
          
          <div className="text-sm text-text-secondary">
            <p>Required columns: title, department, employment_type, location_type</p>
          </div>
        </div>
        
        {!file && !uploadStatus && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-primary bg-primary-50' : 'border-border'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <Icon name="Upload" size={48} className="text-secondary-400 mb-4" />
              <h4 className="text-lg font-medium text-text-primary mb-2">
                {isDragging ? 'Drop your CSV file here' : 'Drag and drop your CSV file here'}
              </h4>
              <p className="text-text-secondary mb-4">
                or click to browse from your computer
              </p>
              <input
                type="file"
                id="csv-upload"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <label
                htmlFor="csv-upload"
                className="btn-primary cursor-pointer"
              >
                Browse Files
              </label>
            </div>
          </div>
        )}
        
        {file && !uploadStatus && (
          <div className="border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                  <Icon name="FileText" size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-text-primary">{file.name}</h4>
                  <p className="text-sm text-text-secondary">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="text-text-secondary hover:text-error transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="btn-primary flex items-center space-x-2"
              >
                <Icon name="Upload" size={20} />
                <span>Upload and Validate</span>
              </button>
            </div>
          </div>
        )}
        
        {uploadStatus === 'uploading' && (
          <div className="border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-base font-medium text-text-primary">{file.name}</h4>
                  <span className="text-sm text-text-secondary">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-secondary-100 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 text-text-secondary">
                <Icon name="Loader" size={16} className="animate-spin" />
                <span>Uploading and validating...</span>
              </div>
            </div>
          </div>
        )}
        
        {uploadStatus === 'success' && (
          <div className="border rounded-lg p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={32} className="text-success" />
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h4 className="text-lg font-medium text-text-primary mb-2">Upload Successful!</h4>
              <p className="text-text-secondary">
                Your CSV file has been validated and is ready to be processed.
              </p>
            </div>
            
            <div className="bg-surface-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">File Summary</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary">Total Jobs</p>
                  <p className="text-lg font-medium text-text-primary">15</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Valid Jobs</p>
                  <p className="text-lg font-medium text-success">15</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                Upload Another File
              </button>
              <button
                className="btn-primary flex items-center space-x-2"
              >
                <Icon name="Check" size={20} />
                <span>Confirm and Publish</span>
              </button>
            </div>
          </div>
        )}
        
        {uploadStatus === 'error' && (
          <div className="border rounded-lg p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={32} className="text-error" />
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h4 className="text-lg font-medium text-text-primary mb-2">Validation Errors Found</h4>
              <p className="text-text-secondary">
                Please fix the following errors in your CSV file and try again.
              </p>
            </div>
            
            <div className="bg-error-50 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <Icon name="AlertCircle" size={16} className="text-error mr-2" />
                <span className="text-sm font-medium text-error">Errors</span>
              </div>
              <ul className="space-y-2 text-sm text-error-600">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-4 h-4 text-center leading-4 bg-error text-white rounded-full text-xs mr-2 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                Upload Revised File
              </button>
              <a
                href="#"
                className="btn-primary flex items-center space-x-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleDownloadTemplate();
                }}
              >
                <Icon name="FileDown" size={20} />
                <span>Download Template</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CsvUploadSection;