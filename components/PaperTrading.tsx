import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import type { PaperStrategy } from '../types';

const StrategyCard: React.FC<{ strategy: PaperStrategy; onToggle: (id: string) => void }> = ({ strategy, onToggle }) => {
    const pnlColor = strategy.pnl >= 0 ? 'text-green-500' : 'text-red-500';
    const statusColor = strategy.isActive ? 'bg-green-500' : 'bg-yellow-500';
    const statusText = strategy.isActive ? 'Active' : 'Paused';

    return (
        <div className="bg-surface p-6 rounded-lg border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-text-primary">{strategy.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`}></div>
                        <span className="text-sm font-medium text-text-secondary">{statusText}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-text-secondary">P/L</p>
                    <p className={`text-2xl font-bold ${pnlColor}`}>₹{strategy.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>

            <div className="h-24 w-full my-4 -ml-4">
                <ResponsiveContainer>
                    <LineChart data={strategy.performanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                         <Tooltip
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #3a3a3a', fontSize: '12px' }}
                            labelFormatter={() => ''}
                            formatter={(value: number) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Value']}
                        />
                        <YAxis hide={true} domain={['dataMin', 'dataMax']} />
                        <Line type="monotone" dataKey="value" stroke="#2bd94a" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center border-t border-border pt-4">
                <div>
                    <p className="text-sm text-text-secondary">Win Rate</p>
                    <p className="text-lg font-semibold text-text-primary">{strategy.winRate}%</p>
                </div>
                 <div>
                    <p className="text-sm text-text-secondary">Trades</p>
                    <p className="text-lg font-semibold text-text-primary">{strategy.trades}</p>
                </div>
                <div className="flex items-center justify-center">
                    <button 
                        onClick={() => onToggle(strategy.id)}
                        className={`w-full text-sm font-bold py-2 px-4 rounded-md transition-colors ${
                            strategy.isActive 
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                    >
                        {strategy.isActive ? 'Pause' : 'Activate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface PaperTradingProps {
    strategies: PaperStrategy[];
    onToggle: (id: string) => void;
}

const PaperTrading: React.FC<PaperTradingProps> = ({ strategies, onToggle }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Paper Trading</h2>
        <p className="mt-1 text-text-secondary">Monitor and manage your simulated trading strategies.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
};

export default PaperTrading;