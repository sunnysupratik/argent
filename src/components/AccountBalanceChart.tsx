import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useAccounts } from '../hooks/useAccounts';

const AccountBalanceChart: React.FC = () => {
  const { accounts, loading, error } = useAccounts();

  const chartData = React.useMemo(() => {
    return accounts
      .map(account => ({
        name: account.account_name.length > 12 
          ? account.account_name.substring(0, 12) + '...' 
          : account.account_name,
        fullName: account.account_name,
        balance: Number(account.current_balance),
        type: account.account_type
      }))
      .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
  }, [accounts]);

  const getBarColor = (type: string, balance: number) => {
    if (balance < 0) return '#FF6B6B'; // Red for negative balances
    
    switch (type.toLowerCase()) {
      case 'checking':
        return '#007AFF'; // Primary blue
      case 'savings':
        return '#4ECDC4'; // Teal
      case 'investment':
        return '#96CEB4'; // Green
      case 'credit_card':
        return '#FF9F43'; // Orange
      default:
        return '#B0B0B0'; // Gray
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 shadow-lg rounded-lg">
          <p className="font-medium text-gray-900 mb-1">{data.fullName}</p>
          <p className="text-sm text-gray-600 mb-1 capitalize">{data.type.replace('_', ' ')}</p>
          <p className={`text-lg font-bold ${data.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(data.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
          <div className="h-48 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || chartData.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No account data available</p>
          <p className="text-sm text-gray-400">Connect accounts to see balance distribution</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#666666' }}
            angle={-45}
            textAnchor="end"
            height={60}
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
          <Bar dataKey="balance" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(entry.type, entry.balance)} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccountBalanceChart;