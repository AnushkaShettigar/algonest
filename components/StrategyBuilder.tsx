import React, { useState, useCallback, useMemo } from 'react';
import type { Strategy } from '../types';
import { generateStrategyFromText } from '../services/geminiService';

interface StrategyBuilderProps {
  onStrategyCreated: (strategy: Strategy) => void;
}

const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ onStrategyCreated }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'nlp'>('form');
  const [nlpInput, setNlpInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formState, setFormState] = useState({
      name: 'My Custom Strategy',
      indicator: 'sma_cross',
      param1: 50,
      param2: 200,
      param3: 14, // For RSI period
      param4: 30, // For RSI level
      condition: 'crosses_above',
      action: 'buy'
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({...prev, [name]: value}));
  }

  const generatedRuleText = useMemo(() => {
      const { indicator, param1, param2, param3, param4, condition, action } = formState;
      const actionText = action === 'buy' ? 'Enter a buy position' : 'Enter a sell position';
      
      switch(indicator) {
          case 'sma_cross':
              return `${actionText} when the ${param1}-period SMA ${condition.replace('_', ' ')} the ${param2}-period SMA.`;
          case 'rsi':
              return `${actionText} when the ${param3}-period RSI is ${condition.replace('_', ' ')} ${param4}.`;
          case 'macd_cross':
              return `${actionText} when the MACD line ${condition.replace('_', ' ')} the signal line.`;
          default:
              return 'Define your rule above.';
      }
  }, [formState]);

  const handleNlpSubmit = useCallback(async () => {
    if (!nlpInput.trim()) {
      setError('Please describe your strategy.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const strategy = await generateStrategyFromText(nlpInput);
      onStrategyCreated(strategy);
    } catch (err) {
      setError('Failed to generate strategy. The model may be unavailable. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [nlpInput, onStrategyCreated]);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const strategy: Strategy = {
      name: formState.name,
      description: `A strategy based on the ${formState.indicator} indicator.`,
      rules: {
        entry: generatedRuleText,
        exit: `(Define exit condition)`, // Placeholder
        stopLoss: `(Define stop-loss)` // Placeholder
      }
    };
    onStrategyCreated(strategy);
  };


  return (
    <div className="space-y-8">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">Strategy Builder</h2>
            <p className="mt-1 text-text-secondary">Design your trading logic visually or with plain English.</p>
        </div>
        <div className="bg-surface p-2 rounded-lg border border-border max-w-sm">
            <div className="flex space-x-2">
                <button onClick={() => setActiveTab('form')} className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'form' ? 'bg-primary text-background' : 'bg-transparent text-text-secondary hover:bg-surface-light'}`}>Visual Builder</button>
                <button onClick={() => setActiveTab('nlp')} className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'nlp' ? 'bg-primary text-background' : 'bg-transparent text-text-secondary hover:bg-surface-light'}`}>Natural Language</button>
            </div>
        </div>

        {activeTab === 'form' && (
             <div className="bg-surface p-8 rounded-lg border border-border">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Strategy Name</label>
                        <input type="text" name="name" id="name" value={formState.name} onChange={handleFormChange} className="mt-1 w-full bg-surface-light border border-border rounded-md p-2 focus:ring-primary focus:border-primary" />
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="indicator" className="block text-sm font-medium text-text-secondary">Indicator / Event</label>
                        <select name="indicator" id="indicator" value={formState.indicator} onChange={handleFormChange} className="w-full bg-surface-light border border-border rounded-md p-2 focus:ring-primary focus:border-primary">
                            <option value="sma_cross">Moving Average Crossover</option>
                            <option value="rsi">RSI (Relative Strength Index)</option>
                            <option value="macd_cross">MACD Crossover</option>
                        </select>
                    </div>

                    {formState.indicator === 'sma_cross' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="param1" className="block text-sm font-medium text-text-secondary">Fast Period</label>
                                <input type="number" name="param1" id="param1" value={formState.param1} onChange={handleFormChange} className="mt-1 w-full bg-surface-light border border-border rounded-md p-2" />
                            </div>
                            <div>
                                <label htmlFor="param2" className="block text-sm font-medium text-text-secondary">Slow Period</label>
                                <input type="number" name="param2" id="param2" value={formState.param2} onChange={handleFormChange} className="mt-1 w-full bg-surface-light border border-border rounded-md p-2" />
                            </div>
                        </div>
                    )}

                     {formState.indicator === 'rsi' && (
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                                <label htmlFor="param3" className="block text-sm font-medium text-text-secondary">RSI Period</label>
                                <input type="number" name="param3" id="param3" value={formState.param3} onChange={handleFormChange} className="mt-1 w-full bg-surface-light border border-border rounded-md p-2" />
                            </div>
                            <div>
                                <label htmlFor="param4" className="block text-sm font-medium text-text-secondary">Level</label>
                                <input type="number" name="param4" id="param4" value={formState.param4} onChange={handleFormChange} className="mt-1 w-full bg-surface-light border border-border rounded-md p-2" />
                            </div>
                        </div>
                    )}


                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="condition" className="block text-sm font-medium text-text-secondary">Condition</label>
                            <select name="condition" id="condition" value={formState.condition} onChange={handleFormChange} className="w-full bg-surface-light border border-border rounded-md p-2 mt-1">
                                <option value="crosses_above">Crosses Above</option>
                                <option value="crosses_below">Crosses Below</option>
                                <option value="is_greater_than">Is Greater Than</option>
                                <option value="is_less_than">Is Less Than</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="action" className="block text-sm font-medium text-text-secondary">Action</label>
                            <select name="action" id="action" value={formState.action} onChange={handleFormChange} className="w-full bg-surface-light border border-border rounded-md p-2 mt-1">
                                <option value="buy">Buy</option>
                                <option value="sell">Sell</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-surface-light p-4 rounded-md border border-border">
                        <p className="text-sm text-text-secondary">Generated Rule:</p>
                        <p className="text-primary font-medium mt-1">{generatedRuleText}</p>
                    </div>

                    <button type="submit" className="w-full bg-primary text-background font-bold py-3 px-4 rounded-md hover:bg-primary-hover transition-colors">Create Strategy</button>
                </form>
             </div>
        )}

        {activeTab === 'nlp' && (
             <div className="bg-surface p-8 rounded-lg border border-border space-y-4">
                <h3 className="text-xl font-bold text-text-primary">Describe Your Strategy</h3>
                <textarea
                    value={nlpInput}
                    onChange={(e) => setNlpInput(e.target.value)}
                    placeholder="e.g., 'Buy 10 shares of AAPL when its 50-day moving average crosses above its 200-day moving average. Sell when the opposite occurs.'"
                    className="w-full h-40 bg-surface-light border border-border rounded-md p-4 text-text-primary focus:ring-primary focus:border-primary resize-none"
                    disabled={isLoading}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    onClick={handleNlpSubmit}
                    disabled={isLoading}
                    className="w-full bg-primary text-background font-bold py-3 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : 'Generate Strategy with AI'}
                </button>
             </div>
        )}
    </div>
  );
};

export default StrategyBuilder;
