import React from 'react';
import type { PaperStrategy } from '../types';
import { TrendingUpIcon, TrendingDownIcon, ClipboardListIcon, AwardIcon } from './ui/Icons';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

interface DashboardProps {
  paperStrategies: PaperStrategy[];
  onNavigate: () => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-surface p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            {icon}
        </div>
        <div className="mt-2">
            <h3 className="text-3xl font-bold text-text-primary">{value}</h3>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ paperStrategies, onNavigate }) => {
  const totalPnl = paperStrategies.reduce((acc, s) => acc + s.pnl, 0);
  const activeStrategies = paperStrategies.filter(s => s.isActive).length;
  const totalTrades = paperStrategies.reduce((acc, s) => acc + s.trades, 0);
  
  const activePaperStrategy = paperStrategies.find(s => s.isActive);
  const chartData = activePaperStrategy ? activePaperStrategy.performanceData : [];
  
  const topPerformer = [...paperStrategies].sort((a, b) => b.pnl - a.pnl)[0];
  const worstPerformer = [...paperStrategies].sort((a, b) => a.pnl - b.pnl)[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Dashboard</h2>
        <p className="mt-1 text-text-secondary">Welcome back! Here's a summary of your trading activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Paper P/L" 
            value={`₹${totalPnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={totalPnl >= 0 ? <TrendingUpIcon className="h-6 w-6 text-green-500" /> : <TrendingDownIcon className="h-6 w-6 text-red-500" />}
        />
        <StatCard 
            title="Active Strategies" 
            value={`${activeStrategies} / ${paperStrategies.length}`}
            icon={<ClipboardListIcon className="h-6 w-6 text-primary" />}
        />
        <StatCard 
            title="Total Trades" 
            value={totalTrades.toLocaleString('en-IN')}
            icon={<AwardIcon className="h-6 w-6 text-yellow-500" />}
        />
        <div className="bg-primary p-6 rounded-lg border border-primary flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-background">Manage Your Strategies</h3>
            <p className="text-sm text-primary-foreground mt-1 mb-3">View detailed performance and adjust your paper trades.</p>
            <button 
                onClick={onNavigate} 
                className="bg-background text-primary font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors w-full"
            >
                Go to Paper Trading
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface p-6 rounded-lg border border-border">
          <h3 className="text-xl font-bold text-text-primary">Portfolio Performance</h3>
          <p className="text-sm text-text-secondary mb-4">Displaying performance for '{activePaperStrategy?.name || 'N/A'}'</p>
          <div className="h-80 w-full">
            {chartData.length > 0 ? (
                 <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                        <XAxis dataKey="name" stroke="#a0a0a0" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#a0a0a0" tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} domain={['dataMin', 'dataMax']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #3a3a3a' }}
                            labelStyle={{ color: '#a0a0a0' }}
                            formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Value']}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="value" name="Portfolio Value" stroke="#2bd94a" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-text-secondary">No active strategy performance data to display.</p>
                </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
            <div className="bg-surface p-6 rounded-lg border border-border">
                <h4 className="font-bold text-text-primary mb-2">Top Performer</h4>
                {topPerformer ? (
                    <div>
                        <p className="text-lg font-semibold text-primary">{topPerformer.name}</p>
                        <p className={`text-2xl font-bold mt-1 ${topPerformer.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {topPerformer.pnl >= 0 ? '+' : ''}₹{topPerformer.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                ) : <p className="text-text-secondary">No strategies found.</p>}
            </div>
             <div className="bg-surface p-6 rounded-lg border border-border">
                <h4 className="font-bold text-text-primary mb-2">Needs Attention</h4>
                 {worstPerformer && worstPerformer.pnl < 0 ? (
                    <div>
                        <p className="text-lg font-semibold text-primary">{worstPerformer.name}</p>
                        <p className="text-2xl font-bold text-red-500 mt-1">
                            ₹{worstPerformer.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                ) : <p className="text-text-secondary">No underperforming strategies.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
