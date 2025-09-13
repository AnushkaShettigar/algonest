import React from 'react';
import type { MarketplaceStrategy } from '../types';

const strategies: MarketplaceStrategy[] = [
  { name: 'Momentum Master', author: 'CryptoKing', description: 'A high-frequency strategy for volatile tech stocks.', returnYTD: 45.2, risk: 'High' },
  { name: 'Steady Dividend Grower', author: 'ValueInvest', description: 'Focuses on stable, dividend-paying blue-chip stocks.', returnYTD: 12.8, risk: 'Low' },
  { name: 'ETF Rotator', author: 'SectorSurfer', description: 'Rotates between major sector ETFs based on relative strength.', returnYTD: 22.5, risk: 'Medium' },
  { name: 'Mean Reversion', author: 'TraderJane', description: 'A classic strategy that profits from short-term price corrections.', returnYTD: 18.9, risk: 'Medium' },
  { name: 'Gold Cross Standard', author: 'ChartWizard', description: 'A trend-following strategy using 50/200 day moving averages.', returnYTD: 15.3, risk: 'Low' },
  { name: 'AI Trend Predictor', author: 'QuantAI', description: 'Uses a proprietary machine learning model to predict market direction. (Premium)', returnYTD: 78.1, risk: 'High' },
];

const RiskBadge: React.FC<{ risk: 'Low' | 'Medium' | 'High' }> = ({ risk }) => {
    const colorClasses = {
        Low: 'bg-green-500/20 text-green-400 border-green-500/30',
        Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        High: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colorClasses[risk]}`}>{risk} Risk</span>;
};

interface MarketplaceCardProps {
    strategy: MarketplaceStrategy;
    isFollowed: boolean;
    onToggleFollow: () => void;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ strategy, isFollowed, onToggleFollow }) => (
    <div className="bg-surface p-6 rounded-lg border border-border flex flex-col h-full hover:border-primary transition-colors duration-200">
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-bold text-text-primary">{strategy.name}</h4>
                    <p className="text-sm text-text-secondary">by {strategy.author}</p>
                </div>
                <RiskBadge risk={strategy.risk} />
            </div>
            <p className="text-text-secondary mt-3 text-sm">{strategy.description}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
            <div>
                <p className="text-xs text-text-secondary">Return YTD</p>
                <p className="text-lg font-bold text-green-400">{strategy.returnYTD}%</p>
            </div>
            <button 
                onClick={onToggleFollow}
                className={`text-sm font-semibold py-2 px-4 rounded-md transition-colors ${
                    isFollowed 
                    ? 'bg-surface-light text-text-secondary border border-border cursor-default' 
                    : 'bg-primary text-background hover:bg-primary-hover'
                }`}
            >
                {isFollowed ? 'Following' : 'Follow'}
            </button>
        </div>
    </div>
);

interface MarketplaceProps {
    followedStrategies: Set<string>;
    onToggleFollow: (strategyName: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ followedStrategies, onToggleFollow }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Strategy Marketplace</h2>
        <p className="mt-1 text-text-secondary">Discover, follow, and learn from strategies created by the community.</p>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategies.map((strat, index) => (
          <MarketplaceCard 
            key={index} 
            strategy={strat} 
            isFollowed={followedStrategies.has(strat.name)}
            onToggleFollow={() => onToggleFollow(strat.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
