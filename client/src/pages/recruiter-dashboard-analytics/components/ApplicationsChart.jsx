import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const ApplicationsChart = () => {
  const [chartView, setChartView] = useState('weekly');

  const weeklyData = [
    { name: 'Mon', applications: 12, interviews: 5 },
    { name: 'Tue', applications: 19, interviews: 8 },
    { name: 'Wed', applications: 15, interviews: 6 },
    { name: 'Thu', applications: 22, interviews: 10 },
    { name: 'Fri', applications: 18, interviews: 7 },
    { name: 'Sat', applications: 8, interviews: 3 },
    { name: 'Sun', applications: 5, interviews: 2 },
  ];

  const monthlyData = [
    { name: 'Week 1', applications: 62, interviews: 25 },
    { name: 'Week 2', applications: 74, interviews: 30 },
    { name: 'Week 3', applications: 58, interviews: 22 },
    { name: 'Week 4', applications: 53, interviews: 20 },
  ];

  const chartData = chartView === 'weekly' ? weeklyData : monthlyData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-md shadow-sm">
          <p className="text-sm font-medium text-text-primary mb-1">{label}</p>
          <p className="text-xs text-primary">
            <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
            Applications: {payload[0].value}
          </p>
          <p className="text-xs text-accent">
            <span className="inline-block w-3 h-3 bg-accent rounded-full mr-2"></span>
            Interviews: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-text-primary">Application Volume</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartView('weekly')}
            className={`px-3 py-1 text-sm rounded-md ${
              chartView === 'weekly' ?'bg-primary-50 text-primary' :'text-text-secondary hover:bg-surface-100'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setChartView('monthly')}
            className={`px-3 py-1 text-sm rounded-md ${
              chartView === 'monthly' ?'bg-primary-50 text-primary' :'text-text-secondary hover:bg-surface-100'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent-500)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-accent-500)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="applications" 
              stroke="var(--color-primary-500)" 
              fillOpacity={1} 
              fill="url(#colorApplications)" 
            />
            <Area 
              type="monotone" 
              dataKey="interviews" 
              stroke="var(--color-accent-500)" 
              fillOpacity={1} 
              fill="url(#colorInterviews)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
          <span className="text-xs text-text-secondary">Applications</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-accent rounded-full mr-2"></span>
          <span className="text-xs text-text-secondary">Interviews</span>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsChart;