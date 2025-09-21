import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const DemographicInsights = () => {
  const [insightType, setInsightType] = useState('gender');

  const genderData = [
    { name: 'Male', value: 45, color: '#2563EB' },
    { name: 'Female', value: 38, color: '#8B5CF6' },
    { name: 'Non-binary', value: 12, color: '#10B981' },
    { name: 'Prefer not to say', value: 5, color: '#64748B' },
  ];

  const ageData = [
    { name: '18-24', value: 15, color: '#2563EB' },
    { name: '25-34', value: 42, color: '#8B5CF6' },
    { name: '35-44', value: 28, color: '#10B981' },
    { name: '45-54', value: 10, color: '#F59E0B' },
    { name: '55+', value: 5, color: '#64748B' },
  ];

  const educationData = [
    { name: 'High School', value: 8, color: '#2563EB' },
    { name: 'Associate', value: 12, color: '#8B5CF6' },
    { name: 'Bachelor\'s', value: 45, color: '#10B981' },
    { name: 'Master\'s', value: 30, color: '#F59E0B' },
    { name: 'Doctorate', value: 5, color: '#64748B' },
  ];

  const experienceData = [
    { name: '0-1 years', value: 10, color: '#2563EB' },
    { name: '2-5 years', value: 35, color: '#8B5CF6' },
    { name: '6-10 years', value: 30, color: '#10B981' },
    { name: '11-15 years', value: 15, color: '#F59E0B' },
    { name: '16+ years', value: 10, color: '#64748B' },
  ];

  const insightOptions = [
    { id: 'gender', label: 'Gender' },
    { id: 'age', label: 'Age' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
  ];

  const getActiveData = () => {
    switch (insightType) {
      case 'gender':
        return genderData;
      case 'age':
        return ageData;
      case 'education':
        return educationData;
      case 'experience':
        return experienceData;
      default:
        return genderData;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-md shadow-sm">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="text-xs text-text-secondary">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: payload[0].payload.color }}></span>
            {payload[0].value}% of candidates
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-text-primary mb-3 sm:mb-0">Demographic Insights</h3>
        <div className="flex space-x-2">
          {insightOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setInsightType(option.id)}
              className={`px-3 py-1 text-sm rounded-md ${
                insightType === option.id
                  ? 'bg-primary-50 text-primary' :'text-text-secondary hover:bg-surface-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getActiveData()}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
              barSize={24}
            >
              {getActiveData().map((entry, index) => (
                <rect key={`rect-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-xs text-text-secondary text-center">
        Based on self-reported data from job applicants
      </div>
    </div>
  );
};

export default DemographicInsights;