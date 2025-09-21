import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Icon from 'components/AppIcon';

const SourceAttribution = () => {
  const data = [
    { name: 'Direct', value: 35, color: '#2563EB' },
    { name: 'Job Boards', value: 25, color: '#10B981' },
    { name: 'Referrals', value: 20, color: '#F59E0B' },
    { name: 'Social Media', value: 15, color: '#8B5CF6' },
    { name: 'Other', value: 5, color: '#64748B' },
  ];

  const COLORS = data.map(item => item.color);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-md shadow-sm">
          <p className="text-sm font-medium text-text-primary">{payload[0].name}</p>
          <p className="text-xs text-text-secondary">
            {payload[0].value}% of applications
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-xs text-text-secondary">{entry.value}: {entry.payload.value}%</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-text-primary">Application Sources</h3>
        <button className="text-text-secondary hover:text-text-primary transition-smooth">
          <Icon name="MoreHorizontal" size={20} />
        </button>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SourceAttribution;