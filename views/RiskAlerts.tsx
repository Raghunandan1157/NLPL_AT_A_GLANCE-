import React from 'react';
import { DonutChart } from '../components/DonutChart';

interface Props {
    onBack: () => void;
}

export const RiskAlerts: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
            <span className="material-icons-round text-2xl">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-center flex-1 pr-10">Risk Alerts Center</h1>
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Last Scan: 13-01-2026 @ 12:15 PM</p>
        </div>
        <div className="flex gap-3 mt-6">
            <div className="relative flex-1">
                <button className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 active:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] text-gray-400 leading-none mb-1">Region</span>
                        <span>All Regions</span>
                    </div>
                    <span className="material-icons-round text-gray-400">expand_more</span>
                </button>
            </div>
            <div className="relative flex-1">
                 <button className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 active:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] text-gray-400 leading-none mb-1">Severity</span>
                        <span className="text-red-500">Critical & High</span>
                    </div>
                    <span className="material-icons-round text-gray-400">expand_more</span>
                </button>
            </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Risk Overview</h2>
                    <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">14 <span className="text-lg font-medium text-gray-500 dark:text-gray-400">Alerts</span></p>
                    <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                        <span className="material-icons-round text-sm">trending_up</span> +3 from yesterday
                    </p>
                </div>
                 <DonutChart percentage={75} size={64} colorClass="text-red-500" label={<div className="flex flex-col items-center"><span className="text-[10px] text-gray-400">Risk</span><span className="text-sm font-bold text-red-500">High</span></div>}/>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800/30">
                    <p className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase mb-1">Critical</p>
                    <div className="flex justify-between items-end">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">5</span>
                        <span className="text-[10px] text-red-500 bg-white dark:bg-red-900/40 px-1.5 py-0.5 rounded shadow-sm">Action Req.</span>
                    </div>
                </div>
                 <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-100 dark:border-orange-800/30">
                    <p className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase mb-1">Warning</p>
                    <div className="flex justify-between items-end">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">9</span>
                        <span className="text-[10px] text-orange-500 bg-white dark:bg-orange-900/40 px-1.5 py-0.5 rounded shadow-sm">Monitor</span>
                    </div>
                </div>
            </div>
        </section>

        <div className="flex items-center justify-between px-1">
             <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Urgent Issues 
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">5</span>
            </h3>
             <button className="text-primary text-xs font-semibold flex items-center gap-1">
                Sort by Impact <span className="material-icons-round text-sm">sort</span>
            </button>
        </div>

        <div className="space-y-4">
            {/* Alert 1 */}
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border-l-4 border-l-red-500 border-y border-r border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-transform">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                            <span className="material-icons-round">dangerous</span>
                        </div>
                        <div>
                             <h4 className="font-bold text-sm text-gray-900 dark:text-white">High NPA Risk</h4>
                            <p className="text-xs text-gray-500">Tumkur Branch • ID #2921</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">CRITICAL</span>
                        <span className="text-[10px] text-gray-400">2h ago</span>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                    <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Trigger Metric</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">NPA Total &gt; 5%</p>
                    </div>
                     <div className="text-right">
                         <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Current Value</p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">₹ 2.67L</p>
                    </div>
                </div>
                 <div className="mt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                    <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] font-bold">JD</div>
                         <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] font-bold">AS</div>
                    </div>
                    <button className="text-primary text-xs font-bold flex items-center gap-1 hover:text-orange-700">
                        View Accounts <span className="material-icons-round text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>

            {/* Alert 2 */}
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border-l-4 border-l-red-500 border-y border-r border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-transform">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                            <span className="material-icons-round">trending_down</span>
                        </div>
                        <div>
                             <h4 className="font-bold text-sm text-gray-900 dark:text-white">Critical Collection Drop</h4>
                            <p className="text-xs text-gray-500">Tiptur Region • ID #8822</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">CRITICAL</span>
                        <span className="text-[10px] text-gray-400">4h ago</span>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                    <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Trigger Metric</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Daily Run Rate</p>
                    </div>
                     <div className="text-right">
                         <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Deficit</p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">- 42%</p>
                    </div>
                </div>
                 <div className="mt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                    <p className="text-[10px] text-gray-400 italic">Expected: ₹ 5.2L | Actual: ₹ 3.0L</p>
                    <button className="text-primary text-xs font-bold flex items-center gap-1 hover:text-orange-700">
                        Analyze <span className="material-icons-round text-sm">analytics</span>
                    </button>
                </div>
            </div>

            {/* Alert 3 */}
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border-l-4 border-l-orange-500 border-y border-r border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-transform">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                            <span className="material-icons-round">person_alert</span>
                        </div>
                        <div>
                             <h4 className="font-bold text-sm text-gray-900 dark:text-white">Potential NPA</h4>
                            <p className="text-xs text-gray-500">Kolar District • ID #1102</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">HIGH RISK</span>
                        <span className="text-[10px] text-gray-400">1d ago</span>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                    <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Bucket Move</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">31-60 DPD</p>
                    </div>
                     <div className="text-right">
                         <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Exposure</p>
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">₹ 1.15L</p>
                    </div>
                </div>
                 <div className="mt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                     <p className="text-[10px] text-gray-400">Customer: Rakesh Kumar</p>
                    <button className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-xs font-bold flex items-center gap-1">
                        Details <span className="material-icons-round text-sm">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
      </main>

       <div className="fixed bottom-24 right-6 z-30">
        <button className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center">
          <span className="material-icons-round">picture_as_pdf</span>
        </button>
      </div>
    </div>
  );
};