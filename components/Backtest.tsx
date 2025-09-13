
import React, { useState, useCallback, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Strategy, BacktestResult } from '../types';
import { optimizeStrategy } from '../services/geminiService';

interface BacktestProps {
  strategy: Strategy | null;
  result: BacktestResult | null;
  setResult: (result: BacktestResult | null) => void;
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

const Backtest: React.FC<BacktestProps> = ({ strategy, result, setResult }) => {
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
      const perfData = Array.from({ length: 50 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: 10000 * (1 + (Math.random() - 0.45) * 0.02 * (i + 1)),
      }));

      setResult({
        totalReturn: Math.round((perfData[perfData.length-1].value / 10000 - 1) * 10000) / 100,
        winRate: 55 + Math.random() * 15,
        sharpeRatio: 0.8 + Math.random() * 1,
        maxDrawdown: 10 + Math.random() * 25,
        profitFactor: 1.2 + Math.random() * 1.5,
        performanceData: perfData,
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
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">Backtest Report: <span className="text-primary">{strategy.name}</span></h2>
            <p className="mt-1 text-text-secondary">{strategy.description}</p>
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
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="text-xl font-bold text-text-primary">Performance Chart</h3>
                       <RiskIndicator drawdown={result.maxDrawdown} />
                    </div>
                    <div className="h-96 w-full">
                        <ResponsiveContainer>
                            <LineChart data={result.performanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                                <XAxis dataKey="name" stroke="#a0a0a0" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#a0a0a0" tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}/>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #3a3a3a' }} 
                                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Portfolio Value"]}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="value" name="Portfolio Value" stroke="#2bd94a" strokeWidth={2} dot={false} />
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