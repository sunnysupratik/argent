import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useTransactions } from '../hooks/useTransactions';

const CashFlowChart: React.FC = () => {
  const { getCashFlowData, loading, error } = useTransactions();
  const data = getCashFlowData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
      const expenses = payload.find((p: any) => p.dataKey === 'expenses')?.value || 0;
      const net = income - expenses;
      
      return (
        <div className="bg-white p-4 border border-gray-300 shadow-lg rounded-lg">
          <p className="font-bold text-text-primary mb-2">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey === 'income' ? 'Income' : 'Expenses'}: $${entry.value.toLocaleString()}`}
            </p>
          ))}
          <p className={`text-sm mt-1 pt-1 border-t font-medium ${
            net >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            Net: {net >= 0 ? '+' : ''}${net.toLocaleString()}
          </p>
        </div>
      );
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

  // Check if we have any meaningful data
  const hasData = data.some(d => d.income > 0 || d.expenses > 0);

  if (!hasData) {
    return (
      <div className="h-80 w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No transaction data available</p>
          <p className="text-sm text-gray-400">Add some transactions to see your cash flow</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
            dataKey="income" 
            fill="#007AFF"
            radius={[4, 4, 0, 0]}
            name="Income"
          />
          <Bar 
            dataKey="expenses" 
            fill="#B0B0B0"
            radius={[4, 4, 0, 0]}
            name="Expenses"
          />
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center space-x-8 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-accent-blue rounded"></div>
          <span className="text-sm font-medium text-text-primary">Income</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-graphic-subtle rounded"></div>
          <span className="text-sm font-medium text-text-primary">Expenses</span>
        </div>
      </div>
    </div>
  );
};

export default CashFlowChart;