export enum View {
  DASHBOARD = 'DASHBOARD',
  BUILDER = 'BUILDER',
  BACKTEST = 'BACKTEST',
  PAPER_TRADING = 'PAPER_TRADING',
  LEARN = 'LEARN',
  MARKETPLACE = 'MARKETPLACE',
}

export interface Strategy {
  name: string;
  description: string;
  rules: {
    entry: string;
    exit: string;
    stopLoss?: string;
  };
}

export interface BacktestResult {
  totalReturn: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
  profitFactor: number;
  performanceData: { name: string; value: number }[];
}

export interface Achievement {
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

export interface MarketplaceStrategy {
    name: string;
    author: string;
    description: string;
    returnYTD: number;
    risk: 'Low' | 'Medium' | 'High';
}

export interface LearningModule {
    title: string;
    category: string;
    description: string;
    duration: number; // in minutes
    content: string;
}

export interface PaperStrategy {
    id: string;
    name: string;
    pnl: number;
    winRate: number;
    trades: number;
    isActive: boolean;
    performanceData: { name: string; value: number }[];
}
