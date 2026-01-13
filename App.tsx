import React, { useState } from 'react';
import { GlobalDashboard } from './views/GlobalDashboard';
import { RegionDetail } from './views/RegionDetail';
import { BranchDetail } from './views/BranchDetail';
import { RiskAlerts } from './views/RiskAlerts';
import { StaffPerformance } from './views/StaffPerformance';
import { BottomNav } from './components/BottomNav';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('GLOBAL_DASHBOARD');

  // Simple render logic for views
  const renderView = () => {
    switch (currentView) {
      case 'GLOBAL_DASHBOARD':
        return <GlobalDashboard onNavigate={setCurrentView} />;
      case 'REGION_DETAIL':
        return <RegionDetail onBack={() => setCurrentView('GLOBAL_DASHBOARD')} onNavigate={setCurrentView} />;
      case 'BRANCH_DETAIL':
        return <BranchDetail onBack={() => setCurrentView('REGION_DETAIL')} />;
      case 'RISK_CENTER':
        return <RiskAlerts onBack={() => setCurrentView('GLOBAL_DASHBOARD')} />;
      case 'STAFF_LIST':
        return <StaffPerformance onBack={() => setCurrentView('GLOBAL_DASHBOARD')} />;
      default:
        return <GlobalDashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-background-light dark:bg-background-dark min-h-screen">
      {renderView()}
      <BottomNav currentView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;