import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';

const EditProfile = () => {
  const [user, setUser] = useState({
    fullName: '',
    professionalTitle: '',
    education: [],
    socialLinks: { linkedin: '', github: '', twitter: '' }
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [resume, setResume] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data);
     if (response.data.profilePicture) {
          setProfilePreview(response.data.profilePicture); // Cloudinary gives a full URL
     }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Failed to fetch user data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialField = name.split('.')[1];
      setUser(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = [...user.education];
    updatedEducation[index][name] = value;
    setUser(prev => ({ ...prev, education: updatedEducation }));
  };

  const addEducation = () => {
    setUser(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' }]
    }));
  };

  const removeEducation = (index) => {
    const updatedEducation = [...user.education];
    updatedEducation.splice(index, 1);
    setUser(prev => ({ ...prev, education: updatedEducation }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleCertificatesChange = (e) => {
    setCertificates(Array.from(e.target.files));
  };

  const removeCertificate = async (certificateId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/certificate/${certificateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update UI by removing the certificate
      setUser(prev => ({
        ...prev,
        certificates: prev.certificates.filter(cert => cert._id !== certificateId)
      }));
      
      setMessage('Certificate deleted successfully');
    } catch (error) {
      console.error('Error deleting certificate:', error);
      setMessage('Failed to delete certificate');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('fullName', user.fullName);
      formData.append('professionalTitle', user.professionalTitle);
      formData.append('education', JSON.stringify(user.education));
      formData.append('socialLinks', JSON.stringify(user.socialLinks));
      
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      
      if (resume) {
        formData.append('resume', resume);
      }
      
      if (certificates.length > 0) {
        certificates.forEach(cert => {
          formData.append('certificates', cert);
        });
      }

      const response = await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('Profile updated successfully!');
      
      // Update local storage with new data
      const userData = {
        _id: response.data._id,
        fullName: response.data.fullName,
        email: response.data.email,
        professionalTitle: response.data.professionalTitle,
        token: token
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      
      {message && (
        <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="professionalTitle">Professional Title</label>
            <input
              type="text"
              id="professionalTitle"
              name="professionalTitle"
              value={user.professionalTitle}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Social Links</h3>
          
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn</label>
           <input
  type="url"
  id="linkedin"
  name="socialLinks.linkedin"
  value={user.socialLinks?.linkedin || ''}
  onChange={handleChange}
  placeholder="https://linkedin.com/in/yourprofile"
/>
          </div>
          
          <div className="form-group">
            <label htmlFor="github">GitHub</label>
           <input
  type="url"
  id="github"
  name="socialLinks.github"
  value={user.socialLinks?.github || ''}
  onChange={handleChange}
  placeholder="https://github.com/yourprofile"
/>
          </div>
          
          <div className="form-group">
            <label htmlFor="twitter">Twitter</label>
          <input
  type="url"
  id="twitter"
  name="socialLinks.twitter"
  value={user.socialLinks?.twitter || ''}
  onChange={handleChange}
  placeholder="https://twitter.com/yourprofile"
/>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Education</h3>
          
          {user.education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="form-group">
                <label>School</label>
                <input
                  type="text"
                  name="school"
                  value={edu.school}
                  onChange={(e) => handleEducationChange(index, e)}
                />
              </div>
              
              <div className="form-group">
                <label>Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, e)}
                />
              </div>
              
              <div className="form-group">
                <label>Field of Study</label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleEducationChange(index, e)}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Start Year</label>
                  <input
                    type="number"
                    name="startYear"
                    value={edu.startYear}
                    onChange={(e) => handleEducationChange(index, e)}
                    min="1900"
                    max="2099"
                  />
                </div>
                
                <div className="form-group">
                  <label>End Year</label>
                  <input
                    type="number"
                    name="endYear"
                    value={edu.endYear}
                    onChange={(e) => handleEducationChange(index, e)}
                    min="1900"
                    max="2099"
                  />
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={() => removeEducation(index)} 
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button type="button" onClick={addEducation} className="add-btn">
            Add Education
          </button>
        </div>
        
        <div className="form-section">
          <h3>Profile Picture</h3>
          
          <div className="file-upload-group">
            {profilePreview && (
              <div className="image-preview">
                <img src={profilePreview} alt="Profile preview" />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="profilePicture">Upload Profile Picture</label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Resume</h3>
          
          <div className="form-group">
            <label htmlFor="resume">Upload Resume (PDF or DOCX)</label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Certificates</h3>
          
          {user.certificates && user.certificates.length > 0 && (
            <div className="existing-certificates">
              <h4>Existing Certificates:</h4>
              <ul>
                {user.certificates.map(cert => (
                  <li key={cert._id}>
                    {cert.name}
                    <button 
                      type="button" 
                      onClick={() => removeCertificate(cert._id)}
                      className="remove-cert-btn"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="certificates">Upload New Certificates (PDF or DOCX)</label>
            <input
              type="file"
              id="certificates"
              name="certificates"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={handleCertificatesChange}
            />
          </div>
        </div>
        
        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;