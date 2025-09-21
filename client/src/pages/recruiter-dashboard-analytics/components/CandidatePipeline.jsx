import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const CandidatePipeline = () => {
  const [activeStage, setActiveStage] = useState('all');

  const stages = [
    { id: 'all', label: 'All Candidates', count: 247 },
    { id: 'new', label: 'New', count: 58 },
    { id: 'screening', label: 'Screening', count: 42 },
    { id: 'interview', label: 'Interview', count: 35 },
    { id: 'assessment', label: 'Assessment', count: 28 },
    { id: 'offer', label: 'Offer', count: 12 },
    { id: 'hired', label: 'Hired', count: 8 },
    { id: 'rejected', label: 'Rejected', count: 64 },
  ];

  const candidates = [
    {
      id: 1,
      name: 'Emily Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      position: 'Senior Frontend Developer',
      appliedDate: '2024-05-18T14:30:00',
      stage: 'interview',
      rating: 4.5,
      tags: ['React', 'TypeScript', 'UI/UX'],
      lastActivity: 'Interview scheduled for tomorrow at 2:00 PM',
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      position: 'Product Manager',
      appliedDate: '2024-05-17T09:15:00',
      stage: 'screening',
      rating: 4.0,
      tags: ['Product Strategy', 'Agile', 'B2B'],
      lastActivity: 'Resume screening completed, awaiting phone interview',
    },
    {
      id: 3,
      name: 'Sarah Chen',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      position: 'DevOps Engineer',
      appliedDate: '2024-05-16T16:45:00',
      stage: 'assessment',
      rating: 4.8,
      tags: ['AWS', 'Kubernetes', 'CI/CD'],
      lastActivity: 'Technical assessment sent on May 18',
    },
    {
      id: 4,
      name: 'David Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      position: 'UX/UI Designer',
      appliedDate: '2024-05-15T11:20:00',
      stage: 'offer',
      rating: 4.7,
      tags: ['Figma', 'User Research', 'Prototyping'],
      lastActivity: 'Offer letter sent, awaiting response',
    },
    {
      id: 5,
      name: 'Jessica Martinez',
      avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
      position: 'Marketing Specialist',
      appliedDate: '2024-05-14T13:50:00',
      stage: 'new',
      rating: 3.9,
      tags: ['Content Marketing', 'SEO', 'Analytics'],
      lastActivity: 'Application received, pending review',
    },
  ];

  const filteredCandidates = activeStage === 'all' 
    ? candidates 
    : candidates.filter(candidate => candidate.stage === activeStage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getStageColor = (stage) => {
    const stageColors = {
      new: 'bg-secondary-100 text-secondary-700',
      screening: 'bg-primary-50 text-primary-700',
      interview: 'bg-warning-50 text-warning-600',
      assessment: 'bg-secondary-200 text-secondary-800',
      offer: 'bg-accent-50 text-accent-700',
      hired: 'bg-success-50 text-success-600',
      rejected: 'bg-error-50 text-error-600',
    };
    return stageColors[stage] || 'bg-secondary-100 text-secondary-700';
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-text-primary mb-3 sm:mb-0">Candidate Pipeline</h3>
        <div className="flex items-center space-x-2">
          <button className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-100 transition-smooth">
            <Icon name="Filter" size={16} />
          </button>
          <button className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-100 transition-smooth">
            <Icon name="SlidersHorizontal" size={16} />
          </button>
          <button className="btn-secondary py-1.5 px-3 text-sm">
            <span>Bulk Actions</span>
            <Icon name="ChevronDown" size={16} className="ml-1" />
          </button>
        </div>
      </div>

      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
                activeStage === stage.id
                  ? 'bg-primary-50 text-primary' :'text-text-secondary hover:bg-surface-100 hover:text-text-primary'
              }`}
            >
              <span>{stage.label}</span>
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-background">
                {stage.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Candidate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Applied
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Stage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-surface-50 transition-smooth">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image 
                          src={candidate.avatar} 
                          alt={candidate.name} 
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text-primary">{candidate.name}</div>
                        <div className="text-xs text-text-secondary flex flex-wrap gap-1 mt-1">
                          {candidate.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-surface-100">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-primary">{candidate.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-secondary">{formatDate(candidate.appliedDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(candidate.stage)}`}>
                      {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Icon 
                            key={i}
                            name={i < Math.floor(candidate.rating) ? "Star" : i < candidate.rating ? "StarHalf" : "Star"} 
                            size={16} 
                            className={i < candidate.rating ? "text-warning" : "text-secondary-300"} 
                            fill={i < candidate.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-text-secondary">{candidate.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-text-secondary hover:text-primary transition-smooth">
                        <Icon name="Mail" size={16} />
                      </button>
                      <button className="text-text-secondary hover:text-primary transition-smooth">
                        <Icon name="Calendar" size={16} />
                      </button>
                      <button className="text-text-secondary hover:text-primary transition-smooth">
                        <Icon name="MoreVertical" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCandidates.length === 0 && (
          <div className="py-12 text-center">
            <Icon name="Users" size={48} className="mx-auto mb-4 text-secondary-300" />
            <h3 className="text-lg font-medium text-text-primary mb-1">No candidates found</h3>
            <p className="text-text-secondary">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatePipeline;