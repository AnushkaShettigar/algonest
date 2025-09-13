import React from 'react';
import type { View } from '../types';
import { View as ViewEnum } from '../types';
import { SignalStickLogoIcon, ChartIcon, WrenchIcon, BookIcon, StoreIcon, LogOutIcon, ClipboardListIcon } from './ui/Icons';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  label: string;
  view: View;
  currentView: View;
  onClick: (view: View) => void;
  Icon: React.ComponentType<{ className?: string }>;
}> = ({ label, view, currentView, onClick, Icon }) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-background'
          : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onLogout }) => {
  return (
    <header className="bg-surface sticky top-0 z-10 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <SignalStickLogoIcon className="h-10 w-10 text-primary" />
            <h1 className="text-xl font-bold text-text-primary tracking-wider">Signal Stick</h1>
          </div>
          <div className="flex items-center space-x-2">
            <nav className="hidden md:flex items-center space-x-2">
              <NavItem label="Dashboard" view={ViewEnum.DASHBOARD} currentView={currentView} onClick={setCurrentView} Icon={ChartIcon} />
              <NavItem label="Strategy Builder" view={ViewEnum.BUILDER} currentView={currentView} onClick={setCurrentView} Icon={WrenchIcon} />
              <NavItem label="Paper Trading" view={ViewEnum.PAPER_TRADING} currentView={currentView} onClick={setCurrentView} Icon={ClipboardListIcon} />
              <NavItem label="Learn" view={ViewEnum.LEARN} currentView={currentView} onClick={setCurrentView} Icon={BookIcon} />
              <NavItem label="Marketplace" view={ViewEnum.MARKETPLACE} currentView={currentView} onClick={setCurrentView} Icon={StoreIcon} />
            </nav>
            <div className="hidden md:flex items-center pl-4 ml-4 border-l border-border">
                <button
                    onClick={onLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-surface-light hover:text-red-500 transition-colors duration-200"
                    aria-label="Logout"
                >
                    <LogOutIcon className="h-5 w-5" />
                    <span className="hidden lg:inline">Logout</span>
                </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;