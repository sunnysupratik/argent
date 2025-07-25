import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useInvestments } from '../hooks/useInvestments';
import { useAccounts } from '../hooks/useAccounts';

const InvestmentPerformanceChart: React.FC = () => {
  const { investments, loading: investmentsLoading } = useInvestments();
  const { accounts, loading: accountsLoading, getAccountsByType } = useAccounts();

  const investmentAccounts = getAccountsByType('investment');

  const performanceData = React.useMemo(() => {
    // Group investments by sector for better visualization
    const sectorData: { [key: string]: { value: number, change: number, count: number } } = {};
    
    investments.forEach(investment => {
      const sector = investment.sector || 'Other';
      if (!sectorData[sector]) {
        sectorData[sector] = { value: 0, change: 0, count: 0 };
      }
      sectorData[sector].value += Number(investment.total_value);
      sectorData[sector].change += Number(investment.day_change);
      sectorData[sector].count += 1;
    });

    // Add investment accounts as a separate category
    if (investmentAccounts.length > 0) {
      const accountValue = investmentAccounts.reduce((sum, acc) => sum + Number(acc.current_balance), 0);
      sectorData['Accounts'] = { 
        value: accountValue, 
        change: accountValue * 0.015, // Assume 1.5% daily change for accounts
        count: investmentAccounts.length 
      };
    }

    return Object.entries(sectorData)
      .map(([sector, data]) => ({
        sector: sector.length > 10 ? sector.substring(0, 10) + '...' : sector,
        fullSector: sector,
        value: data.value,
        change: data.change,
        changePercent: data.value > 0 ? (data.change / data.value) * 100 : 0,
        holdings: data.count
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 sectors
  }, [investments, investmentAccounts]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 shadow-lg rounded-lg">
          <p className="font-bold text-gray-900 mb-2">{data.fullSector}</p>
          <p className="text-sm text-gray-600">
            Total Value: ${data.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-sm ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Day Change: {data.change >= 0 ? '+' : ''}${data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
          </p>
          <p className="text-sm text-gray-500">
            Holdings: {data.holdings}
          </p>
        </div>
      );
    }
    return null;
  };

  if (investmentsLoading || accountsLoading) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-48 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (performanceData.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No investment data available</p>
          <p className="text-sm text-gray-400">Add investments to see performance breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <XAxis 
            dataKey="sector" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#666666' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            yAxisId="value"
            orientation="left"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#666666' }}
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `$${(value / 1000).toFixed(0)}k`;
              }
              return `$${value}`;
            }}
          />
          <YAxis 
            yAxisId="percent"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#666666' }}
            tickFormatter={(value) => `${value.toFixed(1)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            yAxisId="value"
            dataKey="value" 
            fill="#007AFF" 
            radius={[4, 4, 0, 0]}
            name="Portfolio Value"
          />
          <Line 
            yAxisId="percent"
            type="monotone" 
            dataKey="changePercent" 
            stroke="#FF6B6B" 
            strokeWidth={3}
            dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 4 }}
            name="Day Change %"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentPerformanceChart;