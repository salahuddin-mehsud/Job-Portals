// src/pages/admin-moderation-management/components/UserManagementSection.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const UserManagementSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'job_seeker',
      status: 'active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-15 09:30',
      avatar: 'https://images.pexels.com/photo/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
      applications: 12,
      profileCompletion: 95,
      verified: true,
      location: 'New York, NY'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@techcorp.com',
      role: 'recruiter',
      status: 'active',
      joinDate: '2024-01-05',
      lastLogin: '2024-01-15 08:15',
      avatar: 'https://images.pixabay.com/photo/2016/11/29/13/14/attractive-1868231_960_720.jpg',
      jobsPosted: 8,
      company: 'TechCorp Inc.',
      verified: true,
      location: 'San Francisco, CA'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@startup.io',
      role: 'company',
      status: 'pending_verification',
      joinDate: '2024-01-12',
      lastLogin: '2024-01-14 16:45',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80',
      jobsPosted: 3,
      company: 'StartupXYZ',
      verified: false,
      location: 'Austin, TX'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      role: 'job_seeker',
      status: 'suspended',
      joinDate: '2024-01-08',
      lastLogin: '2024-01-13 14:20',
      avatar: 'https://images.pexels.com/photo/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
      applications: 5,
      profileCompletion: 60,
      verified: false,
      location: 'Los Angeles, CA',
      suspensionReason: 'Multiple policy violations'
    }
  ];

  const handleUserAction = (userId, action) => {
    console.log(`Performing ${action} on user ${userId}`);
    // Implement user action logic
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) return;
    console.log(`Performing ${action} on users:`, selectedUsers);
    // Implement bulk action logic
    setSelectedUsers([]);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredUsers.map(user => user.id);
    setSelectedUsers(selectedUsers.length === allIds.length ? [] : allIds);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'pending_verification': return 'text-yellow-700 bg-yellow-100';
      case 'suspended': return 'text-red-700 bg-red-100';
      case 'inactive': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'job_seeker': return 'text-blue-700 bg-blue-100';
      case 'recruiter': return 'text-purple-700 bg-purple-100';
      case 'company': return 'text-indigo-700 bg-indigo-100';
      case 'admin': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary">User Management</h2>
        <p className="text-sm text-text-secondary mt-1">
          Manage job seekers, recruiters, and companies with comprehensive user controls
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Search" size={16} className="text-text-secondary" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="input-field pl-10 w-full sm:w-64"
                />
              </div>
              
              {/* Role Filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="input-field"
              >
                <option value="all">All Roles</option>
                <option value="job_seeker">Job Seekers</option>
                <option value="recruiter">Recruiters</option>
                <option value="company">Companies</option>
                <option value="admin">Admins</option>
              </select>
              
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending_verification">Pending Verification</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-smooth text-sm"
                >
                  Suspend Selected
                </button>
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-smooth text-sm"
                >
                  Activate Selected
                </button>
                <button
                  onClick={() => handleBulkAction('verify')}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-smooth text-sm"
                >
                  Verify Selected
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-100">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-border focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <Image 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text-primary">{user.name}</div>
                        <div className="text-sm text-text-secondary">{user.email}</div>
                        {user.company && (
                          <div className="text-xs text-text-secondary">{user.company}</div>
                        )}
                        <div className="text-xs text-text-secondary">{user.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'job_seeker' ? (
                      <div className="text-sm">
                        <div className="text-text-primary">{user.applications} applications</div>
                        <div className="text-text-secondary text-xs">{user.profileCompletion}% profile complete</div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <div className="text-text-primary">{user.jobsPosted} jobs posted</div>
                        <div className="text-text-secondary text-xs">Active recruiter</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {user.verified ? (
                        <div className="flex items-center text-green-600">
                          <Icon name="CheckCircle" size={16} className="mr-1" />
                          <span className="text-xs">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-600">
                          <Icon name="Clock" size={16} className="mr-1" />
                          <span className="text-xs">Pending</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-primary">{user.lastLogin}</div>
                    <div className="text-xs text-text-secondary">Joined {user.joinDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleUserAction(user.id, 'view')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleUserAction(user.id, 'edit')}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                      {user.status === 'active' ? (
                        <button 
                          onClick={() => handleUserAction(user.id, 'suspend')}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUserAction(user.id, 'activate')}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Activate
                        </button>
                      )}
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
          Showing {filteredUsers.length} of {users.length} users
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

export default UserManagementSection;