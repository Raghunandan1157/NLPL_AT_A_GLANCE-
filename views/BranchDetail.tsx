import React from 'react';
import { DonutChart } from '../components/DonutChart';

interface BranchProps {
  onBack: () => void;
}

export const BranchDetail: React.FC<BranchProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
            <span className="material-icons-round text-2xl">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-center flex-1 pr-10">Marikal Branch</h1>
        </div>
      </header>
      
      <main className="p-4 space-y-6">
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Branch Performance</h2>
              <p className="text-2xl font-bold mt-1">₹ 2,140 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/ 5,800 Demand</span></p>
            </div>
            <DonutChart percentage={36} size={56} />
          </div>
        </section>

        <div className="space-y-3">
          <OfficerCard initials="RK" name="Ramesh Kumar" target="1,240" score="92.45%" theme="blue" />
          <OfficerCard initials="SD" name="Sita Devi" target="980" score="64.10%" theme="purple" />
        </div>
      </main>
    </div>
  );
};

const OfficerCard = ({ initials, name, target, score, theme }: any) => {
  const themes = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  };
  const colorClass = themes[theme as keyof typeof themes];
  return (
    <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center font-bold text-sm`}>{initials}</div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{name}</h4>
            <p className="text-xs text-gray-500">Target: {target}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-green-600">{score}</p>
          <p className="text-[10px] text-gray-400">Collection</p>
        </div>
      </div>
    </div>
  );
};
