import React from 'react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { 
      id: 'GLOBAL_DASHBOARD', 
      label: 'Reports', 
      icon: 'analytics',
      activeViews: ['GLOBAL_DASHBOARD', 'REGION_DETAIL', 'BRANCH_DETAIL'] 
    },
    { 
      id: 'STAFF_LIST', 
      label: 'Staff', 
      icon: 'people',
      activeViews: ['STAFF_LIST']
    },
    { 
      id: 'RISK_CENTER', 
      label: 'Alerts', 
      icon: 'notifications',
      activeViews: ['RISK_CENTER']
    },
    { 
      id: 'PROFILE', 
      label: 'Profile', 
      icon: 'account_circle',
      activeViews: ['PROFILE'] // Placeholder
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 pb-safe pt-2 px-6 flex justify-between items-center z-40 pb-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = item.activeViews.includes(currentView);
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewState)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive 
                ? 'text-primary' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            <span className="material-icons-round text-2xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};