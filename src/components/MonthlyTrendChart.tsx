import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTransactions } from '../hooks/useTransactions';

const MonthlyTrendChart: React.FC = () => {
  const { transactions, loading, error } = useTransactions();

  const trendData = React.useMemo(() => {
    const months = [];
    const currentDate = new Date();
    
    // Get last 6 months of data
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.transaction_date);
        return transactionDate.getMonth() === monthIndex &&
               transactionDate.getFullYear() === year;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

      const netIncome = income - expenses;
      const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

      months.push({ 
        month: monthName, 
        income, 
        expenses, 
        netIncome,
        savingsRate: Math.max(0, savingsRate)
      });
    }
    
    return months;
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 shadow-lg rounded-lg">
          <p className="font-bold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'income' && `Income: $${entry.value.toLocaleString()}`}
              {entry.dataKey === 'expenses' && `Expenses: $${entry.value.toLocaleString()}`}
              {entry.dataKey === 'netIncome' && `Net: $${entry.value.toLocaleString()}`}
              {entry.dataKey === 'savingsRate' && `Savings Rate: ${entry.value.toFixed(1)}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-48 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || trendData.every(d => d.income === 0 && d.expenses === 0)) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No trend data available</p>
          <p className="text-sm text-gray-400">Add transactions to see monthly trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#666666' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#666666' }}
            tickFormatter={(value) => {
              if (Math.abs(value) >= 1000) {
                return `$${(value / 1000).toFixed(0)}k`;
              }
              return `$${value}`;
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#4ECDC4" 
            strokeWidth={3}
            dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 4 }}
            name="Income"
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#FF6B6B" 
            strokeWidth={3}
            dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 4 }}
            name="Expenses"
          />
          <Line 
            type="monotone" 
            dataKey="netIncome" 
            stroke="#007AFF" 
            strokeWidth={3}
            dot={{ fill: '#007AFF', strokeWidth: 2, r: 4 }}
            name="Net Income"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;