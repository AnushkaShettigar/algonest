
import React, { useState, useCallback, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';
import type { Strategy, BacktestResult, Trade } from '../types';
import { optimizeStrategy } from '../services/geminiService';
import { BoltIcon } from './ui/Icons';

interface BacktestProps {
  strategy: Strategy | null;
  result: BacktestResult | null;
  setResult: (result: BacktestResult | null) => void;
  onDeploy: (strategy: Strategy, result: BacktestResult) => void;
}

const MetricCard: React.FC<{ label: string; value: string; colorClass?: string }> = ({ label, value, colorClass = 'text-primary' }) => (
  <div className="bg-surface-light p-4 rounded-lg border border-border">
    <p className="text-sm text-text-secondary">{label}</p>
    <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
  </div>
);

const RiskIndicator: React.FC<{ drawdown: number }> = ({ drawdown }) => {
    let color = 'bg-green-500';
    let text = 'Low Risk';
    if (drawdown > 15 && drawdown <= 30) {
        color = 'bg-yellow-500';
        text = 'Medium Risk';
    } else if (drawdown > 30) {
        color = 'bg-red-500';
        text = 'High Risk';
    }

    return (
        <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="text-sm font-medium text-text-primary">{text}</span>
        </div>
    );
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const trade = data.trade as Trade | undefined;

        return (
            <div className="bg-surface p-3 rounded-lg border border-border text-sm">
                <p className="label text-text-secondary">{`${label}`}</p>
                <p className="intro text-text-primary">{`Portfolio Value : ₹${payload[0].value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
                {trade && (
                     <p className={`font-bold ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                        {trade.type === 'buy' ? 'Buy' : 'Sell'} @ ₹{trade.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                )}
            </div>
        );
    }
    return null;
};


const Backtest: React.FC<BacktestProps> = ({ strategy, result, setResult, onDeploy }) => {
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationSuggestion, setOptimizationSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runBacktest = useCallback(() => {
    if (!strategy) return;
    setIsBacktesting(true);
    setError(null);
    // Simulate API call
    setTimeout(() => {
      let currentValue = 10000;
      const trades: Trade[] = [];
      const perfData = Array.from({ length: 50 }, (_, i) => {
        const change = (Math.random() - 0.45) * 0.03;
        currentValue *= (1 + change);
        const point = {
          name: `Day ${i + 1}`,
          value: currentValue,
          trade: undefined as Trade | undefined,
        };
        
        // Randomly generate some trades
        if (Math.random() > 0.85 && i > 2 && i < 48) {
            const tradeType = Math.random() > 0.5 ? 'buy' : 'sell';
            const trade: Trade = { type: tradeType, day: i, value: currentValue };
            trades.push(trade);
            point.trade = trade;
        }

        return point;
      });

      setResult({
        totalReturn: Math.round((perfData[perfData.length-1].value / 10000 - 1) * 10000) / 100,
        winRate: 55 + Math.random() * 15,
        sharpeRatio: 0.8 + Math.random() * 1,
        maxDrawdown: 10 + Math.random() * 25,
        profitFactor: 1.2 + Math.random() * 1.5,
        performanceData: perfData,
        trades: trades,
      });
      setIsBacktesting(false);
    }, 1500);
  }, [strategy, setResult]);

  const handleOptimize = useCallback(async () => {
    if (!strategy) return;
    setIsOptimizing(true);
    setOptimizationSuggestion(null);
    setError(null);
    try {
        const suggestion = await optimizeStrategy(strategy);
        setOptimizationSuggestion(suggestion);
    } catch (err) {
        setError("Failed to get optimization suggestions. The model may be unavailable.");
        console.error(err);
    } finally {
        setIsOptimizing(false);
    }
  }, [strategy]);

  useEffect(() => {
      // Automatically run backtest if a strategy is present but no result
      if(strategy && !result && !isBacktesting) {
          runBacktest();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategy, result]);

  if (!strategy) {
    return (
      <div className="text-center py-20 bg-surface rounded-lg border border-border">
        <h3 className="text-xl font-bold text-text-primary">No Strategy Selected</h3>
        <p className="text-text-secondary mt-2">Go to the Strategy Builder to create or generate a new strategy.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-text-primary">Backtest Report: <span className="text-primary">{strategy.name}</span></h2>
                    <p className="mt-1 text-text-secondary">{strategy.description}</p>
                </div>
                {result && !isBacktesting && (
                    <button onClick={() => onDeploy(strategy, result)} className="mt-4 sm:mt-0 flex items-center justify-center space-x-2 w-full sm:w-auto bg-primary text-background font-bold py-3 px-6 rounded-md hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                        <BoltIcon className="w-5 h-5" />
                        <span>Deploy Live</span>
                    </button>
                )}
            </div>
        </div>

        {isBacktesting && (
             <div className="flex justify-center items-center h-64 bg-surface rounded-lg border border-border">
                <div className="text-center">
                    <svg className="animate-spin mx-auto h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg font-medium text-text-primary">Running historical backtest...</p>
                </div>
             </div>
        )}

        {result && !isBacktesting && (
            <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <MetricCard label="Total Return" value={`${result.totalReturn.toFixed(2)}%`} colorClass={result.totalReturn > 0 ? 'text-green-500' : 'text-red-500'} />
                    <MetricCard label="Win Rate" value={`${result.winRate.toFixed(2)}%`} />
                    <MetricCard label="Sharpe Ratio" value={result.sharpeRatio.toFixed(2)} />
                    <MetricCard label="Profit Factor" value={result.profitFactor.toFixed(2)} />
                    <MetricCard label="Max Drawdown" value={`${result.maxDrawdown.toFixed(2)}%`} colorClass="text-red-500"/>
                </div>

                <div className="bg-surface p-6 rounded-lg border border-border">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                       <h3 className="text-xl font-bold text-text-primary">Performance Chart</h3>
                       <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-xs text-text-secondary">Buy</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-xs text-text-secondary">Sell</span>
                            </div>
                            <RiskIndicator drawdown={result.maxDrawdown} />
                       </div>
                    </div>
                    <div className="h-96 w-full">
                        <ResponsiveContainer>
                            <LineChart data={result.performanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                                <XAxis dataKey="name" stroke="#a0a0a0" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#a0a0a0" tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} domain={['dataMin', 'dataMax']}/>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="value" name="Portfolio Value" stroke="#2bd94a" strokeWidth={2} dot={false} />
                                {result.trades.map((trade, index) => (
                                    <ReferenceDot 
                                        key={index}
                                        x={result.performanceData[trade.day]?.name} 
                                        y={trade.value}
                                        r={5}
                                        fill={trade.type === 'buy' ? '#22c55e' : '#ef4444'}
                                        stroke="#0a0a0a"
                                        strokeWidth={1}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-lg border border-border">
                    <h3 className="text-xl font-bold text-text-primary">AI Strategy Optimizer</h3>
                    <p className="text-text-secondary mt-1">Get suggestions to improve your strategy's performance.</p>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button
                        onClick={handleOptimize}
                        disabled={isOptimizing}
                        className="mt-4 bg-primary text-background font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isOptimizing ? 'Optimizing...' : 'Optimize with AI'}
                    </button>
                    {optimizationSuggestion && (
                        <div className="mt-4 p-4 bg-surface-light rounded-md border border-primary">
                            <h4 className="font-semibold text-primary">Optimization Suggestion:</h4>
                            <p className="text-text-primary whitespace-pre-wrap">{optimizationSuggestion}</p>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default Backtest;