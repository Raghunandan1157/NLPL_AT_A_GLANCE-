import React, { useState } from 'react';
import { ViewState } from '../types';
import { DonutChart } from '../components/DonutChart';

interface Props {
  onNavigate: (view: ViewState) => void;
}

export const GlobalDashboard: React.FC<Props> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'IGL' | 'FIG' | 'IL'>('IGL');

  const handleDownload = () => {
    alert("Report download started for " + activeTab + " segment.");
  };

  const tabs = ['IGL', 'FIG', 'IL'] as const;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
            <span className="material-icons-round text-2xl">menu</span>
          </button>
          <h1 className="text-lg font-bold text-center flex-1 pr-10">Collection Pro</h1>
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Global Report • Updated: 13-01-2026 @ 12:10 PM</p>
        </div>
        <div className="flex items-center justify-between mt-6 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
          {tabs.map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                 activeTab === tab 
                   ? 'bg-surface-light dark:bg-surface-dark shadow-sm text-primary' 
                   : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
               }`}
             >
               {tab}
             </button>
          ))}
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Overall Performance */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Overall Performance ({activeTab})</h2>
              <p className="text-2xl font-bold mt-1">₹ 4.2 Cr <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/ 12.5 Cr Demand</span></p>
            </div>
            <DonutChart percentage={activeTab === 'IGL' ? 34 : activeTab === 'FIG' ? 62 : 45} size={56} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-icons-round text-red-500 text-sm">trending_down</span>
                <p className="text-xs font-medium text-red-600 dark:text-red-400">FTOD Collection</p>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">3.77%</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Bal: 86.1 L</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-icons-round text-green-500 text-sm">trending_up</span>
                <p className="text-xs font-medium text-green-600 dark:text-green-400">1-30 DPD</p>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">2.18%</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Bal: 10.3 L</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Aging Buckets Breakdown</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              <div className="flex-none w-28 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">31-60 DPD</p>
                <p className="text-sm font-bold mt-1 text-red-500">0.92%</p>
                <p className="text-[10px] text-gray-400 mt-1">Bal: 19.4 L</p>
              </div>
              <div className="flex-none w-28 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">PNPA</p>
                <p className="text-sm font-bold mt-1 text-orange-500">0.39%</p>
                <p className="text-[10px] text-gray-400 mt-1">Bal: 17.9 L</p>
              </div>
              <div className="flex-none w-28 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">NPA Total</p>
                <p className="text-sm font-bold mt-1 text-gray-900 dark:text-white">₹ 26.7L</p>
                <p className="text-[10px] text-gray-400 mt-1">Accts: 770</p>
              </div>
            </div>
          </div>
        </section>

        {/* Top Regions */}
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Top Performing Regions</h3>
          <button className="text-primary text-sm font-medium flex items-center gap-1">
            Filter <span className="material-icons-round text-base">filter_list</span>
          </button>
        </div>

        <div className="space-y-3">
          {/* Card 1 */}
          <div 
             onClick={() => onNavigate('REGION_DETAIL')}
             className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-transform cursor-pointer hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm">BS</div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Bengaluru South</h4>
                  <p className="text-xs text-gray-500">Target: 2.6 Cr</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600 dark:text-green-400">48.11%</p>
                <p className="text-[10px] text-gray-400">On Date Coll.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <MetricSmall label="FTOD" value="1.98%" trend="down" color="text-red-500" />
              <MetricSmall label="1-30 DPD" value="0.00%" trend="neutral" color="text-green-500" />
              <MetricSmall label="31-60 DPD" value="1.92%" trend="up" color="text-green-500" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-transform hover:shadow-md">
             <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-sm">MY</div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Mysuru Region</h4>
                  <p className="text-xs text-gray-500">Target: 1.8 Cr</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-orange-500 dark:text-orange-400">34.96%</p>
                <p className="text-[10px] text-gray-400">On Date Coll.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <MetricSmall label="FTOD" value="2.92%" trend="up" color="text-green-500" />
              <MetricSmall label="1-30 DPD" value="5.26%" trend="up" color="text-green-500" />
              <MetricSmall label="31-60 DPD" value="1.33%" trend="up" color="text-green-500" />
            </div>
          </div>
          
           {/* Card 3 - Clickable to simulate Region Detail as well */}
           <div 
            onClick={() => onNavigate('REGION_DETAIL')}
            className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-transform cursor-pointer hover:shadow-md"
           >
             <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-sm">HB</div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Hubballi Region</h4>
                  <p className="text-xs text-gray-500">Target: 95 L</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-red-500 dark:text-red-400">21.05%</p>
                <p className="text-[10px] text-gray-400">On Date Coll.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <MetricSmall label="FTOD" value="3.47%" trend="up" color="text-green-500" />
              <MetricSmall label="1-30 DPD" value="3.00%" trend="up" color="text-green-500" />
              <MetricSmall label="31-60 DPD" value="0.00%" trend="down" color="text-red-500" />
            </div>
          </div>

        </div>
      </main>

      <div className="fixed bottom-24 right-6 z-30">
        <button 
            onClick={handleDownload}
            className="bg-primary hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center active:scale-90"
        >
          <span className="material-icons-round">download</span>
        </button>
      </div>
    </div>
  );
};

const MetricSmall = ({ label, value, trend, color }: { label: string, value: string, trend: 'up' | 'down' | 'neutral', color: string }) => (
  <div className="text-center">
    <p className="text-[10px] text-gray-500">{label}</p>
    <div className={`flex items-center justify-center gap-1 ${color}`}>
      {trend !== 'neutral' && (
        <span className="material-icons-round text-[10px]">
          {trend === 'up' ? 'arrow_upward' : 'arrow_downward'}
        </span>
      )}
      {trend === 'neutral' && <span className="material-icons-round text-[10px]">check</span>}
      <span className="text-xs font-bold">{value}</span>
    </div>
  </div>
);
