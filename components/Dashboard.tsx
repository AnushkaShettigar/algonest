import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Achievement, PaperStrategy } from '../types';
import { RocketIcon, ShieldIcon, TrophyIcon, WrenchIcon, BookIcon } from './ui/Icons';

const achievements: Achievement[] = [
  { name: 'First Strategy', description: 'You built your first trading strategy!', icon: WrenchIcon },
  { name: 'Backtest Pro', description: 'Ran more than 10 backtests.', icon: ShieldIcon },
  { name: 'Paper Trader', description: 'Completed a paper trading competition.', icon: TrophyIcon },
  { name: 'Lifelong Learner', description: 'Completed 5 educational modules.', icon: BookIcon },
  { name: 'Market Explorer', description: 'Followed a strategy from the marketplace.', icon: RocketIcon },
];

const generatePortfolioData = (days: number) => {
    let value = 10000;
    const data = [];
    for (let i = 1; i <= days; i++) {
        value *= (1 + (Math.random() - 0.48) * 0.015);
        data.push({ name: `Day ${i}`, value: value });
    }
    return data;
};

const portfolioData = generatePortfolioData(90);

const StatCard: React.FC<{ title: string; value: string; change?: string; onClick?: () => void }> = ({ title, value, change, onClick }) => (
    <div
        onClick={onClick}
        className={`bg-surface p-6 rounded-lg border border-border ${onClick ? 'cursor-pointer hover:border-primary transition-colors duration-200' : ''}`}
    >
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
        {change && <p className="text-sm text-primary mt-1">{change}</p>}
    </div>
);

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
    <div className="bg-surface p-4 rounded-lg flex items-center space-x-4 border border-border hover:border-primary transition-colors duration-200">
        <div className="bg-surface-light p-3 rounded-full">
            <achievement.icon className="w-6 h-6 text-primary" />
        </div>
        <div>
            <h4 className="font-semibold text-text-primary">{achievement.name}</h4>
            <p className="text-sm text-text-secondary">{achievement.description}</p>
        </div>
    </div>
);

interface DashboardProps {
  paperStrategies: PaperStrategy[];
  onNavigate: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ paperStrategies, onNavigate }) => {
  const activeStrategies = paperStrategies.filter(s => s.isActive).length;
  const totalPnl = paperStrategies.reduce((acc, s) => acc + s.pnl, 0);
  const avgWinRate = paperStrategies.length > 0
    ? paperStrategies.reduce((acc, s) => acc + s.winRate, 0) / paperStrategies.length
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Welcome back, Team RAS</h2>
        <p className="mt-1 text-text-secondary">Nuturing algo trading one strategy at a time!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total P/L (Paper)" value={`₹${totalPnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} change="+2.1% this week" />
        <StatCard title="Active Strategies" value={activeStrategies.toString()} change={`${paperStrategies.length} total`} onClick={onNavigate} />
        <StatCard title="Win Rate (Avg)" value={`${avgWinRate.toFixed(1)}%`} change="-0.5% this week" />
      </div>
      
      <div className="bg-surface p-6 rounded-lg border border-border">
        <h3 className="text-2xl font-bold tracking-tight text-text-primary">Portfolio Performance (Till Date)</h3>
        <div className="h-96 w-full mt-4">
            <ResponsiveContainer>
                <AreaChart data={portfolioData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2bd94a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2bd94a" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                    <XAxis dataKey="name" stroke="#a0a0a0" tick={{ fontSize: 10 }} interval={14} />
                    <YAxis stroke="#a0a0a0" tickFormatter={(value) => `₹${Number(value/1000).toLocaleString('en-IN')}k`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #3a3a3a' }}
                        formatter={(value: number) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Portfolio Value"]}
                     />
                    <Area type="monotone" dataKey="value" stroke="#2bd94a" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight text-text-primary">Achievements</h3>
        <p className="mt-1 text-text-secondary">Track your progress and unlock new badges.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {achievements.map((ach, index) => (
            <AchievementCard key={index} achievement={ach} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;