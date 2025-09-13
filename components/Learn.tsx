import React, { useState } from 'react';
import type { LearningModule } from '../types';
import { XIcon } from './ui/Icons';

const learningModules: LearningModule[] = [
  {
    title: 'Introduction to Algorithmic Trading',
    category: 'Beginner',
    description: 'Understand the fundamentals of algo trading and its role in modern markets.',
    duration: 15,
    content: `
### What is Algorithmic Trading?
Algorithmic trading (also called automated trading, black-box trading, or algo-trading) uses a computer program that follows a defined set of instructions (an algorithm) to place a trade. The trade, in theory, can generate profits at a speed and frequency that is impossible for a human trader.

The defined sets of instructions are based on timing, price, quantity, or any mathematical model. Apart from profit opportunities for the trader, algo-trading renders markets more liquid and trading more systematic by ruling out the impact of human emotions on trading activities.

### Why Use Algorithms?
- **Speed:** Algorithms can execute trades in fractions of a second, capitalizing on price fluctuations that are too fast for humans to react to.
- **Accuracy:** Automated systems reduce the chance of human error, such as mistyping a price or order size.
- **Backtesting:** Strategies can be tested against historical data to see how they would have performed, providing valuable insights before risking real capital.
- **Discipline:** By sticking to a pre-defined set of rules, algorithmic trading removes the emotional component of trading, such as fear and greed, which often leads to poor decisions.

### Getting Started
The first step is to develop a trading idea into a concrete strategy with specific rules. For example, a simple strategy might be: "Buy 100 shares of a stock when its 50-day moving average crosses above the 200-day moving average (a 'Golden Cross')." With platforms like Signal Stick, you don't need to be a programmer to build and test these ideas. You can start with our visual builder or even describe your strategy in plain English.
`
  },
  {
    title: 'Responsible Trading: Risk Management',
    category: 'Core Concepts',
    description: 'Learn to manage risk effectively with stop-losses, position sizing, and diversification.',
    duration: 25,
    content: `
### The Foundation of Successful Trading
Risk management is arguably the most important aspect of trading. It's not about winning every trade; it's about ensuring that your losses are manageable and don't wipe out your account. A solid risk management plan is what separates consistent traders from gamblers.

### 1. Position Sizing
Position sizing refers to determining how many shares or units of an asset you should trade. A common rule of thumb is the "1% rule," where you risk no more than 1% of your trading capital on a single trade.

**Example:** If you have a $10,000 account, you should not risk more than $100 on any single trade. This means if your stop-loss is triggered, your maximum loss would be $100. This protects you from a single bad trade having a catastrophic impact on your portfolio.

### 2. Stop-Loss Orders
A stop-loss is a pre-set order to sell an asset when it reaches a certain price. It's a crucial tool for cutting losses automatically without you needing to monitor the market constantly.

- **Static Stop-Loss:** A fixed price below your entry. For example, if you buy a stock at $50 and set a stop-loss at $48, you are risking $2 per share.
- **Trailing Stop-Loss:** A stop-loss set at a percentage or dollar amount below the market price. It moves up as the price moves in your favor, locking in profits while still protecting against a reversal.

### 3. Diversification
Don't put all your eggs in one basket. Diversification involves spreading your capital across different strategies, assets, and markets. An algorithmic trader might run several uncorrelated strategies simultaneously:
- A trend-following strategy on tech stocks.
- A mean-reversion strategy on commodities.
- A momentum strategy on cryptocurrencies.

If one strategy performs poorly due to specific market conditions, the others may perform well, smoothing out your overall returns and reducing your total risk.
`
  },
  {
    title: 'Indicator Deep Dive: Moving Averages',
    category: 'Technical Analysis',
    description: 'Explore simple, exponential, and weighted moving averages and how to use them.',
    duration: 20,
    content: `
### What Are Moving Averages?
A moving average (MA) is a widely used technical indicator that smooths out price data by creating a constantly updated average price. The average is taken over a specific period of time, like 10 days, 20 minutes, 30 weeks, or any time period the trader chooses.

### Types of Moving Averages
1.  **Simple Moving Average (SMA):** The SMA is calculated by taking the arithmetic mean of a given set of prices over the specified number of days in the past. For example, a 10-day SMA is the ten-day sum of closing prices divided by 10. It gives equal weight to all data points.
2.  **Exponential Moving Average (EMA):** The EMA gives more weight to recent prices, making it more responsive to new information. This responsiveness is what makes it a favorite among many traders. When the price crosses an EMA, it can be a signal to buy or sell.

### Using Crossovers for Signals
A popular strategy involves using two moving averages of different lengths.
- A **"Golden Cross"** occurs when a short-term MA (e.g., 50-day) crosses above a long-term MA (e.g., 200-day). This is often interpreted as a bullish signal, indicating the potential for a major uptrend.
- A **"Death Cross"** occurs when a short-term MA crosses below a long-term MA. This is considered a bearish signal, suggesting a potential downtrend.

These crossover signals are the basis for many simple and effective trend-following strategies.
`
  },
  {
    title: 'Understanding Backtest Overfitting',
    category: 'Advanced',
    description: 'A critical lesson on the dangers of curve-fitting your strategy to historical data.',
    duration: 30,
    content: `
### The Overfitting Trap
Overfitting (or curve-fitting) is one of the most common pitfalls in strategy development. It occurs when a trading model is designed to match historical data so closely that it fails to predict future outcomes or perform in live trading. The strategy looks perfect in the backtest but falls apart in the real world.

This happens because the model learns the *noise* in the historical data rather than the underlying market signal. It's like creating a key that perfectly fits one specific, old lock but fails to open any other lock.

### How Does It Happen?
Overfitting usually results from excessive optimization. A developer might tweak parameters endlessly until the backtest results look incredible.
- **Too many parameters:** A strategy with dozens of variables (e.g., MA period, RSI level, time of day, day of week) can be forced to fit any dataset.
- **Data mining:** Testing thousands of variations of a strategy and only picking the one that performed best historically is a recipe for overfitting.

### How to Avoid Overfitting
1.  **Keep it Simple:** Strategies with fewer rules and parameters are often more robust and less likely to be overfit.
2.  **Out-of-Sample Testing:** Split your historical data into two parts. Develop your strategy on the first part (the "in-sample" data) and then test its performance on the second part (the "out-of-sample" data). If the strategy performs well on data it hasn't "seen" before, it's more likely to be robust.
3.  **Walk-Forward Analysis:** This is a more advanced technique where you optimize a strategy over a period of data, then test it on the next period. This process is repeated, "walking forward" through the data to simulate how the strategy would adapt to new market conditions over time.
4.  **Use Logic:** Ensure your strategy rules make logical sense. Don't just rely on what the numbers say. Ask yourself *why* a particular rule should work.
`
  },
];

const LearningCard: React.FC<{ module: LearningModule, onSelect: () => void }> = ({ module, onSelect }) => (
    <div className="bg-surface p-6 rounded-lg border border-border flex flex-col h-full hover:border-primary transition-colors duration-200">
        <div className="flex-grow">
            <p className="text-sm font-semibold text-primary">{module.category}</p>
            <h4 className="text-lg font-bold text-text-primary mt-2">{module.title}</h4>
            <p className="text-text-secondary mt-2 text-sm">{module.description}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
            <span className="text-xs text-text-secondary">{module.duration} min read</span>
            <button onClick={onSelect} className="text-sm font-semibold text-primary hover:text-primary-hover">Start Learning →</button>
        </div>
    </div>
);

const ArticleModal: React.FC<{ module: LearningModule; onClose: () => void }> = ({ module, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-surface w-full max-w-3xl max-h-[90vh] rounded-lg border border-border shadow-2xl shadow-primary/20 overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <div>
                        <p className="text-sm font-semibold text-primary">{module.category}</p>
                        <h2 className="text-2xl font-bold text-text-primary">{module.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto prose prose-invert prose-headings:text-primary prose-a:text-primary">
                    {/* A simple markdown-like renderer */}
                    {module.content.trim().split('\n').map((paragraph, i) => {
                        if (paragraph.startsWith('### ')) {
                            return <h3 key={i} className="text-xl font-bold mt-4 mb-2 text-primary">{paragraph.substring(4)}</h3>;
                        }
                        if (paragraph.startsWith('- ')) {
                            return <li key={i} className="ml-6 list-disc">{paragraph.substring(2)}</li>
                        }
                        return <p key={i} className="my-4 text-text-secondary">{paragraph}</p>;
                    })}
                </div>
            </div>
        </div>
    )
}


const Learn: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<LearningModule | null>(null);

  return (
    <div className="space-y-8">
       <div>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Learning Hub</h2>
        <p className="mt-1 text-text-secondary">Expand your trading knowledge with our curated modules.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningModules.map((mod, index) => (
          <LearningCard key={index} module={mod} onSelect={() => setSelectedArticle(mod)} />
        ))}
      </div>
      {selectedArticle && <ArticleModal module={selectedArticle} onClose={() => setSelectedArticle(null)} />}
    </div>
  );
};

export default Learn;