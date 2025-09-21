// src/pages/admin-moderation-management/components/SystemMonitoring.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const SystemMonitoring = () => {
  const [refreshInterval, setRefreshInterval] = useState('30');
  const [alertLevel, setAlertLevel] = useState('all');

  const performanceMetrics = {
    serverUptime: '99.98%',
    cpuUsage: '34%',
    memoryUsage: '68%',
    diskSpace: '45%',
    responseTime: '245ms',
    throughput: '1,247 req/min'
  };

  const errorLogs = [
    {
      id: 1,
      timestamp: '2024-01-15 14:23:45',
      level: 'error',
      service: 'Payment API',
      message: 'Stripe webhook timeout - retrying',
      details: 'Connection timeout after 30s',
      resolved: false
    },
    {
      id: 2,
      timestamp: '2024-01-15 13:45:12',
      level: 'warning',
      service: 'Search Service',
      message: 'ElasticSearch query slow response',
      details: 'Query took 3.2s to complete',
      resolved: true
    },
    {
      id: 3,
      timestamp: '2024-01-15 12:30:08',
      level: 'info',
      service: 'User Service',
      message: 'Bulk user import completed',
      details: '1,247 users processed successfully',
      resolved: true
    },
    {
      id: 4,
      timestamp: '2024-01-15 11:15:22',
      level: 'error',
      service: 'Email Service',
      message: 'SMTP server connection failed',
      details: 'Unable to connect to mail.company.com:587',
      resolved: false
    }
  ];

  const integrationStatus = [
    {
      name: 'ElasticSearch',
      status: 'healthy',
      lastCheck: '2024-01-15 14:25:00',
      responseTime: '45ms',
      version: '8.11.0',
      uptime: '99.9%'
    },
    {
      name: 'Stripe Payment',
      status: 'warning',
      lastCheck: '2024-01-15 14:24:30',
      responseTime: '1.2s',
      version: 'API v2023-10-16',
      uptime: '99.5%'
    },
    {
      name: 'AWS S3',
      status: 'healthy',
      lastCheck: '2024-01-15 14:25:15',
      responseTime: '120ms',
      version: 'REST API',
      uptime: '100%'
    },
    {
      name: 'SendGrid Email',
      status: 'error',
      lastCheck: '2024-01-15 14:20:45',
      responseTime: 'timeout',
      version: 'API v3',
      uptime: '98.2%'
    },
    {
      name: 'Redis Cache',
      status: 'healthy',
      lastCheck: '2024-01-15 14:25:10',
      responseTime: '8ms',
      version: '7.0.11',
      uptime: '99.8%'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-700 bg-green-100';
      case 'warning': return 'text-yellow-700 bg-yellow-100';
      case 'error': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-700 bg-red-100';
      case 'warning': return 'text-yellow-700 bg-yellow-100';
      case 'info': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getMetricColor = (value, type) => {
    const numValue = parseInt(value);
    if (type === 'usage') {
      if (numValue > 80) return 'text-red-600';
      if (numValue > 60) return 'text-yellow-600';
      return 'text-green-600';
    }
    return 'text-text-primary';
  };

  const filteredLogs = alertLevel === 'all' 
    ? errorLogs 
    : errorLogs.filter(log => log.level === alertLevel);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary">System Monitoring</h2>
        <p className="text-sm text-text-secondary mt-1">
          Performance metrics, error logs, and integration status monitoring
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-text-primary">Performance Metrics</h3>
            <div className="flex space-x-3">
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="input-field text-sm"
              >
                <option value="10">Refresh every 10s</option>
                <option value="30">Refresh every 30s</option>
                <option value="60">Refresh every 1m</option>
                <option value="300">Refresh every 5m</option>
              </select>
              <button className="btn-secondary text-sm flex items-center space-x-2">
                <Icon name="RefreshCw" size={16} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Activity" size={24} className="text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary">{performanceMetrics.serverUptime}</h4>
              <p className="text-sm text-text-secondary">Server Uptime</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Cpu" size={24} className="text-blue-600" />
              </div>
              <h4 className={`text-2xl font-bold ${getMetricColor(performanceMetrics.cpuUsage, 'usage')}`}>
                {performanceMetrics.cpuUsage}
              </h4>
              <p className="text-sm text-text-secondary">CPU Usage</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="HardDrive" size={24} className="text-purple-600" />
              </div>
              <h4 className={`text-2xl font-bold ${getMetricColor(performanceMetrics.memoryUsage, 'usage')}`}>
                {performanceMetrics.memoryUsage}
              </h4>
              <p className="text-sm text-text-secondary">Memory Usage</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Database" size={24} className="text-orange-600" />
              </div>
              <h4 className={`text-2xl font-bold ${getMetricColor(performanceMetrics.diskSpace, 'usage')}`}>
                {performanceMetrics.diskSpace}
              </h4>
              <p className="text-sm text-text-secondary">Disk Usage</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Clock" size={24} className="text-yellow-600" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary">{performanceMetrics.responseTime}</h4>
              <p className="text-sm text-text-secondary">Avg Response Time</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="TrendingUp" size={24} className="text-indigo-600" />
              </div>
              <h4 className="text-2xl font-bold text-text-primary">{performanceMetrics.throughput}</h4>
              <p className="text-sm text-text-secondary">Throughput</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-6">Third-Party Integration Status</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrationStatus.map((integration) => (
              <div key={integration.name} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium text-text-primary">{integration.name}</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Response Time:</span>
                    <span className="text-text-primary font-medium">{integration.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Version:</span>
                    <span className="text-text-primary">{integration.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Uptime:</span>
                    <span className="text-text-primary">{integration.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Last Check:</span>
                    <span className="text-text-primary">{integration.lastCheck}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Logs */}
      <div className="card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-text-primary">System Error Logs</h3>
            <div className="flex space-x-3">
              <select
                value={alertLevel}
                onChange={(e) => setAlertLevel(e.target.value)}
                className="input-field text-sm"
              >
                <option value="all">All Levels</option>
                <option value="error">Errors Only</option>
                <option value="warning">Warnings Only</option>
                <option value="info">Info Only</option>
              </select>
              <button className="btn-secondary text-sm flex items-center space-x-2">
                <Icon name="Download" size={16} />
                <span>Export Logs</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Timestamp</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Level</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Service</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Message</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Status</th>
                  <th className="text-left py-3 text-sm font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border">
                    <td className="py-4 text-sm text-text-primary font-mono">{log.timestamp}</td>
                    <td className="py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-text-primary font-medium">{log.service}</td>
                    <td className="py-4">
                      <div className="text-sm text-text-primary">{log.message}</div>
                      <div className="text-xs text-text-secondary mt-1">{log.details}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center">
                        {log.resolved ? (
                          <div className="flex items-center text-green-600">
                            <Icon name="CheckCircle" size={16} className="mr-1" />
                            <span className="text-xs">Resolved</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <Icon name="AlertCircle" size={16} className="mr-1" />
                            <span className="text-xs">Active</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">View</button>
                        {!log.resolved && (
                          <button className="text-green-600 hover:text-green-700 text-sm">Resolve</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoring;