import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useTransactions } from '../hooks/useTransactions';

interface TransactionChartProps {
  type: 'spending' | 'category';
}

const TransactionChart: React.FC<TransactionChartProps> = ({ type }) => {
  const { getSpendingTrend, getTransactionsByCategory, loading, error } = useTransactions();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (type === 'spending') {
        return (
          <div className="bg-white p-4 border border-gray-300 shadow-lg rounded-lg">
            <p className="font-bold text-text-primary mb-2">{`${label}`}</p>
            <p className="text-sm text-red-600">
              Expenses: ${payload[0].value.toLocaleString()}
            </p>
          </div>
        );
      } else {
        return (
          <div className="bg-white p-4 border border-gray-300 shadow-lg rounded-lg">
            <p className="font-bold text-text-primary mb-2">{payload[0].name}</p>
            <p className="text-sm text-accent-blue">
              Amount: ${payload[0].value.toLocaleString()}
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

  if (type === 'spending') {
    const spendingData = getSpendingTrend();

    if (spendingData.every(d => d.expenses === 0)) {
      return (
        <div className="h-80 w-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No spending data available</p>
            <p className="text-sm text-gray-400">Add some transactions to see spending trends</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={spendingData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
            <Bar 
              dataKey="expenses" 
              fill="#FF3B30"
              radius={[4, 4, 0, 0]}
              name="Expenses"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'category') {
    const categoryData = getTransactionsByCategory();
    const COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5AC8FA', '#FFCC00', '#FF2D92'];

    if (categoryData.length === 0) {
      return (
        <div className="h-80 w-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No category data available</p>
            <p className="text-sm text-gray-400">Add some transactions to see category breakdown</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name} $${value.toLocaleString()}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="amount"
            >
              {categoryData.map((entry, index) => (
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

export default TransactionChart;