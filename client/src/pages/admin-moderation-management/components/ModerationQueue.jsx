// src/pages/admin-moderation-management/components/ModerationQueue.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';


const ModerationQueue = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [bulkAction, setBulkAction] = useState('');

  const pendingItems = [
    {
      id: 1,
      type: 'job_posting',
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      submittedBy: 'Jane Smith',
      submittedAt: '2024-01-15 09:30',
      priority: 'high',
      status: 'pending',
      category: 'Technology',
      flaggedReason: 'Suspicious salary range'
    },
    {
      id: 2,
      type: 'user_verification',
      title: 'Company Profile Verification',
      company: 'StartupXYZ',
      submittedBy: 'Mike Johnson',
      submittedAt: '2024-01-15 08:15',
      priority: 'medium',
      status: 'pending',
      category: 'Verification',
      flaggedReason: 'Document quality issues'
    },
    {
      id: 3,
      type: 'reported_content',
      title: 'Inappropriate Job Description',
      company: 'GlobalTech Solutions',
      submittedBy: 'Sarah Wilson',
      submittedAt: '2024-01-15 07:45',
      priority: 'urgent',
      status: 'under_review',
      category: 'Content',
      flaggedReason: 'Discriminatory language reported'
    },
    {
      id: 4,
      type: 'job_posting',
      title: 'Marketing Manager Position',
      company: 'Creative Agency Pro',
      submittedBy: 'David Brown',
      submittedAt: '2024-01-14 16:20',
      priority: 'low',
      status: 'pending',
      category: 'Marketing',
      flaggedReason: 'Automatic review - new company'
    }
  ];

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    const allIds = pendingItems.map(item => item.id);
    setSelectedItems(selectedItems.length === allIds.length ? [] : allIds);
  };

  const handleBulkAction = () => {
    if (bulkAction && selectedItems.length > 0) {
      console.log(`Performing ${bulkAction} on items:`, selectedItems);
      // Implement bulk action logic
      setSelectedItems([]);
      setBulkAction('');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'under_review': return 'text-blue-700 bg-blue-100';
      case 'approved': return 'text-green-700 bg-green-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'job_posting': return 'Briefcase';
      case 'user_verification': return 'UserCheck';
      case 'reported_content': return 'Flag';
      default: return 'FileText';
    }
  };

  const filteredItems = filterStatus === 'all' 
    ? pendingItems 
    : pendingItems.filter(item => item.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Moderation Queue</h2>
          <p className="text-sm text-text-secondary mt-1">
            Review and approve pending content, user verifications, and reported items
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field text-sm"
          >
            <option value="all">All Items</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex space-x-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="input-field text-sm"
              >
                <option value="">Bulk Actions</option>
                <option value="approve">Approve Selected</option>
                <option value="reject">Reject Selected</option>
                <option value="priority_high">Set High Priority</option>
                <option value="assign_reviewer">Assign Reviewer</option>
              </select>
              <button
                onClick={handleBulkAction}
                className="btn-primary text-sm"
                disabled={!bulkAction}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Moderation Queue Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-100">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Item Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-surface-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-border focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-surface-100 rounded-lg flex items-center justify-center">
                        <Icon name={getTypeIcon(item.type)} size={16} className="text-text-secondary" />
                      </div>
                      <span className="ml-2 text-sm font-medium text-text-primary capitalize">
                        {item.type.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-text-primary">{item.title}</div>
                      <div className="text-sm text-text-secondary">{item.company}</div>
                      <div className="text-xs text-text-secondary mt-1">{item.flaggedReason}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-primary">{item.submittedBy}</div>
                    <div className="text-xs text-text-secondary">{item.submittedAt}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Review
                      </button>
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Approve
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-text-secondary">
          Showing {filteredItems.length} of {pendingItems.length} items
        </div>
        <div className="flex space-x-2">
          <button className="btn-secondary text-sm" disabled>
            Previous
          </button>
          <button className="btn-secondary text-sm" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModerationQueue;