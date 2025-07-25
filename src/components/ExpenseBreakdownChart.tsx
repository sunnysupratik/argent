import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTransactions } from '../hooks/useTransactions';

const ExpenseBreakdownChart: React.FC = () => {
  const { transactions, loading, error } = useTransactions();

  // Calculate expense breakdown by category
  const expenseData = React.useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = transaction.category?.name || 'Uncategorized';
        categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(Number(transaction.amount));
      });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 categories
  }, [transactions]);

  const COLORS = [
    '#007AFF', // Primary blue
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Light blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-300 shadow-lg rounded-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            ${data.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-48 w-48 bg-gray-300 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || expenseData.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No expense data available</p>
          <p className="text-sm text-gray-400">Add some expense transactions to see breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={expenseData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {expenseData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => (
              <span className="text-sm text-gray-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseBreakdownChart;