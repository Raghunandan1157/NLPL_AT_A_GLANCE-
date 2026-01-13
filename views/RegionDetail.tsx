import React from 'react';
import { ViewState } from '../types';
import { DonutChart } from '../components/DonutChart';

interface RegionDetailProps {
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
}

export const RegionDetail: React.FC<RegionDetailProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
            <span className="material-icons-round text-2xl">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-center flex-1 pr-10">Tumkur Region</h1>
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Updated: 13-01-2026 @ 12:10 PM</p>
        </div>
        <div className="flex items-center justify-between mt-6 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
          <button className="flex-1 py-2 text-sm font-semibold rounded-lg bg-surface-light dark:bg-surface-dark shadow-sm text-primary transition-all">IGL</button>
          <button className="flex-1 py-2 text-sm font-medium rounded-lg text-gray-500 dark:text-gray-400">FIG</button>
          <button className="flex-1 py-2 text-sm font-medium rounded-lg text-gray-500 dark:text-gray-400">IL</button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Overall Performance</h2>
              <p className="text-2xl font-bold mt-1">₹ 4,096 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/ 12,057 Demand</span></p>
            </div>
            <DonutChart percentage={34} size={56} />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-icons-round text-red-500 text-sm">trending_down</span>
                <p className="text-xs font-medium text-red-600 dark:text-red-400">FTOD Collection</p>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">3.77%</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Bal: 8,616</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-icons-round text-green-500 text-sm">trending_up</span>
                <p className="text-xs font-medium text-green-600 dark:text-green-400">1-30 DPD</p>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">2.18%</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Bal: 1,033</p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">District Breakdown</h3>
          <button className="text-primary text-sm font-medium flex items-center gap-1">
            Filter <span className="material-icons-round text-base">filter_list</span>
          </button>
        </div>

        <div className="space-y-3">
          <RegionListItem title="Chikkamagaluru" target="264" score="48.11%" ftod="1.98%" dpd1="0.00%" dpd30="1.92%" initials="CK" colorTheme="green" onClick={() => onNavigate('BRANCH_DETAIL')} />
          <RegionListItem title="Tiptur" target="532" score="34.96%" ftod="2.92%" dpd1="5.26%" dpd30="1.33%" initials="TP" colorTheme="orange" onClick={() => onNavigate('BRANCH_DETAIL')} />
          <RegionListItem title="Vijayapura" target="817" score="21.05%" ftod="3.47%" dpd1="3.00%" dpd30="0.00%" initials="VJ" colorTheme="red" onClick={() => onNavigate('BRANCH_DETAIL')} />
        </div>
      </main>
    </div>
  );
};

interface LocalListItemProps {
  title: string; target: string; score: string; ftod: string; dpd1: string; dpd30: string; initials: string; colorTheme: 'green' | 'orange' | 'red'; onClick: () => void;
}

const RegionListItem: React.FC<LocalListItemProps> = ({ title, target, score, ftod, dpd1, dpd30, initials, colorTheme, onClick }) => {
  const themeColors = {
    green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
    red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
  };
  const theme = themeColors[colorTheme];
  return (
    <div onClick={onClick} className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-transform cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${theme.bg} flex items-center justify-center ${theme.text} font-bold text-sm`}>{initials}</div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{title}</h4>
            <p className="text-xs text-gray-500">Target: {target}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-bold ${theme.text}`}>{score}</p>
          <p className="text-[10px] text-gray-400">On Date Coll.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <MetricCol label="FTOD" value={ftod} isPositive={ftod.startsWith('0') || ftod.startsWith('1')} />
        <MetricCol label="1-30 DPD" value={dpd1} isPositive={dpd1.startsWith('0')} />
        <MetricCol label="31-60 DPD" value={dpd30} isPositive={dpd30.startsWith('0')} />
      </div>
    </div>
  );
};

const MetricCol = ({ label, value, isPositive }: { label: string, value: string, isPositive: boolean }) => (
  <div className="text-center">
    <p className="text-[10px] text-gray-500">{label}</p>
    <div className={`flex items-center justify-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      <span className="material-icons-round text-[10px]">{isPositive ? 'arrow_upward' : 'arrow_downward'}</span>
      <span className="text-xs font-bold">{value}</span>
    </div>
  </div>
);
