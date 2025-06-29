import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useInvestments } from '../hooks/useInvestments';

interface InvestmentChartProps {
  type: 'performance' | 'allocation';
}

const InvestmentChart: React.FC<InvestmentChartProps> = ({ type }) => {
  const { investments, getSectorAllocation, loading, error } = useInvestments();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (type === 'performance') {
        return (
          <div className="bg-white p-4 border border-gray-300 shadow-lg rounded-lg">
            <p className="font-bold text-text-primary mb-2">{`${label}`}</p>
            <p className="text-sm text-green-600">
              Portfolio Value: ${payload[0].value.toLocaleString()}
            </p>
          </div>
        );
      } else {
        return (
          <div className="bg-white p-4 border border-gray-300 shadow-lg rounded-lg">
            <p className="font-bold text-text-primary mb-2">{payload[0].name}</p>
            <p className="text-sm text-accent-blue">
              Value: ${payload[0].value.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              Percentage: {payload[0].payload.percentage.toFixed(1)}%
            </p>
          </div>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-80 w-full flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-64 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load chart data</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (type === 'performance') {
    // Generate mock performance data for the last 6 months
    const performanceData = [
      { month: 'Jul', value: 25000 },
      { month: 'Aug', value: 26500 },
      { month: 'Sep', value: 24800 },
      { month: 'Oct', value: 27200 },
      { month: 'Nov', value: 28900 },
      { month: 'Dec', value: investments.reduce((sum, inv) => sum + inv.total_value, 0) }
    ];

    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#000000' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#000000' }}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `$${(value / 1000).toFixed(0)}k`;
                }
                return `$${value}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#007AFF" 
              strokeWidth={3}
              dot={{ fill: '#007AFF', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#007AFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'allocation') {
    const sectorData = getSectorAllocation();
    const COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5AC8FA', '#FFCC00', '#FF2D92'];

    if (sectorData.length === 0) {
      return (
        <div className="h-80 w-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No investment data available</p>
            <p className="text-sm text-gray-400">Add some investments to see allocation</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sectorData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {sectorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};

export default InvestmentChart;