import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ShareJobModal = ({ job, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);

  const jobUrl = `${window.location.origin}/job-detail-application?id=${job.id}`;

  const shareOptions = [
    {
      name: 'LinkedIn',
      icon: 'Linkedin',
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`
    },
    {
      name: 'Twitter',
      icon: 'Twitter',
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this job: ${job.title} at ${job.company.name}`)}&url=${encodeURIComponent(jobUrl)}`
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: 'MessageCircle',
      color: 'bg-green-600 hover:bg-green-700',
      url: `https://wa.me/?text=${encodeURIComponent(`Check out this job: ${job.title} at ${job.company.name} - ${jobUrl}`)}`
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = jobUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSocialShare = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleEmailShare = async (e) => {
    e.preventDefault();
    setIsEmailSending(true);

    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Job shared successfully via email!');
      setEmail('');
      setMessage('');
      onClose();
    } catch (error) {
      alert('Failed to send email. Please try again.');
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-1050">
      <div className="bg-background rounded-lg shadow-modal max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Share Job</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Job Info */}
          <div className="bg-surface rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-text-primary mb-1">{job.title}</h3>
            <p className="text-text-secondary text-sm">{job.company.name}</p>
            <p className="text-text-muted text-sm">{job.location}</p>
          </div>

          {/* Copy Link */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Job Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={jobUrl}
                readOnly
                className="input-field flex-1 bg-surface"
              />
              <button
                onClick={handleCopyLink}
                className={`btn-secondary px-4 py-2 transition-smooth ${
                  copied ? 'bg-accent-50 text-accent-600 border-accent-200' : ''
                }`}
              >
                {copied ? (
                  <>
                    <Icon name="Check" size={16} className="mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Icon name="Copy" size={16} className="mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Media Sharing */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-text-primary mb-3">Share on Social Media</h4>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => handleSocialShare(option.url)}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-white transition-smooth ${option.color}`}
                >
                  <Icon name={option.icon} size={18} />
                  <span className="text-sm font-medium">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email Sharing */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-3">Share via Email</h4>
            <form onSubmit={handleEmailShare} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Add a personal message..."
                />
              </div>

              <button
                type="submit"
                disabled={isEmailSending || !email}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEmailSending ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Icon name="Mail" size={16} className="mr-2" />
                    Send Email
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareJobModal;