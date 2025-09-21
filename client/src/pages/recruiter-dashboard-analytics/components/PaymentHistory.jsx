import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const PaymentHistory = () => {
  const [viewMode, setViewMode] = useState('all');

  const payments = [
    {
      id: 'INV-2024-0512',
      date: '2024-05-12',
      amount: 299.00,
      status: 'paid',
      description: 'Premium Plan - Monthly Subscription',
      paymentMethod: 'Visa ending in 4242',
    },
    {
      id: 'INV-2024-0412',
      date: '2024-04-12',
      amount: 299.00,
      status: 'paid',
      description: 'Premium Plan - Monthly Subscription',
      paymentMethod: 'Visa ending in 4242',
    },
    {
      id: 'INV-2024-0312',
      date: '2024-03-12',
      amount: 299.00,
      status: 'paid',
      description: 'Premium Plan - Monthly Subscription',
      paymentMethod: 'Visa ending in 4242',
    },
    {
      id: 'INV-2024-0212',
      date: '2024-02-12',
      amount: 299.00,
      status: 'paid',
      description: 'Premium Plan - Monthly Subscription',
      paymentMethod: 'Visa ending in 4242',
    },
    {
      id: 'INV-2024-0112',
      date: '2024-01-12',
      amount: 299.00,
      status: 'paid',
      description: 'Premium Plan - Monthly Subscription',
      paymentMethod: 'Visa ending in 4242',
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      paid: 'bg-success-50 text-success-600',
      pending: 'bg-warning-50 text-warning-600',
      failed: 'bg-error-50 text-error-600',
    };
    return statusStyles[status] || 'bg-secondary-100 text-secondary-600';
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 px-6 pt-6">
        <h3 className="text-lg font-medium text-text-primary mb-3 sm:mb-0">Payment History</h3>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              viewMode === 'all' ?'bg-primary-50 text-primary' :'text-text-secondary hover:bg-surface-100'
            }`}
          >
            All Payments
          </button>
          <button
            onClick={() => setViewMode('invoices')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              viewMode === 'invoices' ?'bg-primary-50 text-primary' :'text-text-secondary hover:bg-surface-100'
            }`}
          >
            Invoices
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-surface-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Invoice ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-surface-50 transition-smooth">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-primary">{payment.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-secondary">{formatDate(payment.date)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-text-primary">{payment.description}</div>
                  <div className="text-xs text-text-secondary mt-1">{payment.paymentMethod}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-primary">${payment.amount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-text-secondary hover:text-primary transition-smooth">
                      <Icon name="FileText" size={16} />
                    </button>
                    <button className="text-text-secondary hover:text-primary transition-smooth">
                      <Icon name="Download" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 flex items-center justify-between border-t border-border">
        <div className="text-sm text-text-secondary">
          Showing <span className="font-medium">5</span> of <span className="font-medium">12</span> payments
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-100 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon name="ChevronLeft" size={20} />
          </button>
          <button className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-100 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;