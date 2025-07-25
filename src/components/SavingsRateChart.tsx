import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useTransactions } from '../hooks/useTransactions';

const SavingsRateChart: React.FC = () => {
  const { transactions, loading, error } = useTransactions();

  const savingsData = React.useMemo(() => {
    const months = [];
    const currentDate = new Date();
    
    // Get last 12 months of data for better trend visibility
    for (let i = 11; i >= 0; i--) {
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

      const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
      const targetRate = 20; // 20% target savings rate

      months.push({ 
        month: monthName, 
        savingsRate: Math.max(0, savingsRate),
        targetRate,
        income,
        expenses
      });
    }
    
    return months;
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 shadow-lg rounded-lg">
          <p className="font-bold text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-blue-600">
            Savings Rate: {data.savingsRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">
            Target: {data.targetRate}%
          </p>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Income: ${data.income.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">
              Expenses: ${data.expenses.toLocaleString()}
            </p>
          </div>
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

  if (error || savingsData.every(d => d.savingsRate === 0)) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No savings data available</p>
          <p className="text-sm text-gray-400">Add income and expense data to track savings rate</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={savingsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#007AFF" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
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
            tickFormatter={(value) => `${value}%`}
            domain={[0, 'dataMax + 5']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="targetRate"
            stroke="#4ECDC4"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#targetGradient)"
            name="Target (20%)"
          />
          <Area
            type="monotone"
            dataKey="savingsRate"
            stroke="#007AFF"
            strokeWidth={3}
            fill="url(#savingsGradient)"
            name="Actual Savings Rate"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SavingsRateChart;