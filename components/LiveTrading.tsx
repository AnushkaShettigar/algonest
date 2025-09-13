import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import type { LiveStrategy } from '../types';

const LiveStrategyCard: React.FC<{ strategy: LiveStrategy; onToggle: (id: string) => void }> = ({ strategy, onToggle }) => {
    const pnlColor = strategy.pnl >= 0 ? 'text-green-500' : 'text-red-500';
    const statusColor = strategy.isActive ? 'bg-green-500' : 'bg-yellow-500';
    const statusText = strategy.isActive ? 'Active' : 'Paused';
    const brokerColor = strategy.brokerStatus === 'Connected' ? 'text-primary' : 'text-red-500';

    return (
        <div className="bg-surface p-6 rounded-lg border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-text-primary">{strategy.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-2">
                             <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`}></div>
                             <span className="text-sm font-medium text-text-secondary">{statusText}</span>
                        </div>
                         <div className="flex items-center space-x-2">
                             <div className={`w-2.5 h-2.5 rounded-full ${brokerColor.replace('text-', 'bg-')}`}></div>
                             <span className={`text-sm font-medium ${brokerColor}`}>Broker: {strategy.brokerStatus}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-text-secondary">Real-Time P/L</p>
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
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                    >
                        {strategy.isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface LiveTradingProps {
    strategies: LiveStrategy[];
    onToggle: (id: string) => void;
}

const LiveTrading: React.FC<LiveTradingProps> = ({ strategies, onToggle }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Live Trading Terminal</h2>
        <p className="mt-1 text-text-secondary">Monitor and manage your strategies deployed with real capital.</p>
      </div>
       {strategies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((strategy) => (
            <LiveStrategyCard key={strategy.id} strategy={strategy} onToggle={onToggle} />
            ))}
        </div>
      ) : (
         <div className="text-center py-20 bg-surface rounded-lg border border-border border-dashed">
            <h3 className="text-xl font-bold text-text-primary">No Live Strategies</h3>
            <p className="text-text-secondary mt-2">Backtest a strategy and click "Deploy Live" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default LiveTrading;