import React, { useState, useCallback, useEffect } from 'react';
import type { Strategy, BacktestResult, PaperStrategy, LiveStrategy } from './types';
import { View } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StrategyBuilder from './components/StrategyBuilder';
import Learn from './components/Learn';
import Marketplace from './components/Marketplace';
import Backtest from './components/Backtest';
import Login from './components/Login';
import PaperTrading from './components/PaperTrading';
import LiveTrading from './components/LiveTrading';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [activeStrategy, setActiveStrategy] = useState<Strategy | null>(null);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [followedStrategies, setFollowedStrategies] = useState<Set<string>>(new Set(['Steady Dividend Grower']));
  const [paperStrategies, setPaperStrategies] = useState<PaperStrategy[]>([]);
  const [liveStrategies, setLiveStrategies] = useState<LiveStrategy[]>([]);

  useEffect(() => {
    // Initialize with some mock paper trading data
    const mockPaperData: PaperStrategy[] = [
      {
        id: 'strat-1',
        name: 'My Golden Cross',
        pnl: 1250.78,
        winRate: 68,
        trades: 42,
        isActive: true,
        performanceData: Array.from({ length: 30 }, (_, i) => ({
          name: `Day ${i + 1}`,
          value: 10000 * (1 + (Math.random() - 0.4) * 0.01 * (i + 1)),
        })),
      },
      {
        id: 'strat-2',
        name: 'RSI Momentum',
        pnl: -340.50,
        winRate: 45,
        trades: 78,
        isActive: true,
        performanceData: Array.from({ length: 30 }, (_, i) => ({
          name: `Day ${i + 1}`,
          value: 5000 * (1 + (Math.random() - 0.55) * 0.02 * (i + 1)),
        })),
      },
      {
        id: 'strat-3',
        name: 'ETF Sector Rotator',
        pnl: 880.00,
        winRate: 61,
        trades: 25,
        isActive: false,
        performanceData: Array.from({ length: 30 }, (_, i) => ({
          name: `Day ${i + 1}`,
          value: 7500 * (1 + (Math.random() - 0.45) * 0.015 * (i + 1)),
        })),
      },
    ];
    setPaperStrategies(mockPaperData);
  }, []);

  const handleSetStrategy = useCallback((strategy: Strategy | null) => {
    setActiveStrategy(strategy);
    setBacktestResult(null); // Reset backtest results when strategy changes
    if (strategy) {
      setCurrentView(View.BACKTEST);
    }
  }, []);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentView(View.DASHBOARD); // Reset view on logout
  }, []);
  
  const handleNavigate = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const handleToggleFollow = useCallback((strategyName: string) => {
    setFollowedStrategies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(strategyName)) {
        newSet.delete(strategyName);
      } else {
        newSet.add(strategyName);
      }
      return newSet;
    });
  }, []);

  const handleTogglePaperStrategy = useCallback((strategyId: string) => {
    setPaperStrategies(prev => 
      prev.map(s => s.id === strategyId ? { ...s, isActive: !s.isActive } : s)
    );
  }, []);
  
  const handleDeployLive = useCallback((strategy: Strategy, backtest: BacktestResult) => {
    const newLiveStrategy: LiveStrategy = {
      id: `live-${Date.now()}`,
      name: strategy.name,
      pnl: 0,
      winRate: 0,
      trades: 0,
      isActive: true,
      brokerStatus: 'Connected',
      performanceData: [{ name: 'Start', value: 25000 }], // Start with a base value
    };
    setLiveStrategies(prev => [...prev, newLiveStrategy]);
    setCurrentView(View.LIVE_TRADING);
  }, []);
  
  const handleToggleLiveStrategy = useCallback((strategyId: string) => {
    setLiveStrategies(prev => 
      prev.map(s => s.id === strategyId ? { ...s, isActive: !s.isActive } : s)
    );
  }, []);


  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard paperStrategies={paperStrategies} onNavigate={() => handleNavigate(View.PAPER_TRADING)} />;
      case View.BUILDER:
        return <StrategyBuilder onStrategyCreated={handleSetStrategy} />;
      case View.BACKTEST:
        return <Backtest strategy={activeStrategy} result={backtestResult} setResult={setBacktestResult} onDeploy={handleDeployLive} />;
      case View.PAPER_TRADING:
        return <PaperTrading strategies={paperStrategies} onToggle={handleTogglePaperStrategy} />;
      case View.LIVE_TRADING:
        return <LiveTrading strategies={liveStrategies} onToggle={handleToggleLiveStrategy} />;
      case View.LEARN:
        return <Learn />;
      case View.MARKETPLACE:
        return <Marketplace followedStrategies={followedStrategies} onToggleFollow={handleToggleFollow} />;
      default:
        return <Dashboard paperStrategies={paperStrategies} onNavigate={() => handleNavigate(View.PAPER_TRADING)} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onLogout={handleLogout}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;