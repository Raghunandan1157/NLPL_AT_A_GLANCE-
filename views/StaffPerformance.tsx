import React, { useState } from 'react';

interface Props {
    onBack: () => void;
}

export const StaffPerformance: React.FC<Props> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const allStaff = [
    { rank: 1, name: "Rajesh Kumar", region: "Tumkur Region", score: "92.4%", scoreColor: "text-green-600", avatarUrl: "https://picsum.photos/100/100?random=1", metrics: [{ l: 'FTOD', v: '4.8%', c: 'text-green-500' }, { l: '1-30 DPD', v: '2.1%', c: 'text-green-500' }, { l: '31-60 DPD', v: '1.2%', c: 'text-yellow-500' }] },
    { rank: 2, name: "Anjali Singh", region: "Kolar District", score: "88.1%", scoreColor: "text-green-600", avatarUrl: "https://picsum.photos/100/100?random=2", metrics: [{ l: 'FTOD', v: '3.9%', c: 'text-green-500' }, { l: '1-30 DPD', v: '1.8%', c: 'text-green-500' }, { l: '31-60 DPD', v: '0.9%', c: 'text-green-500' }] },
    { rank: 3, name: "Priya Sharma", region: "Tiptur Zone", score: "76.5%", scoreColor: "text-orange-500", avatarUrl: "https://picsum.photos/100/100?random=3", metrics: [{ l: 'FTOD', v: '2.5%', c: 'text-yellow-500' }, { l: '1-30 DPD', v: '4.1%', c: 'text-red-500' }, { l: '31-60 DPD', v: '1.1%', c: 'text-green-500' }] },
    { rank: 4, name: "Vikram M.", region: "Chikkamagaluru", score: "62.3%", scoreColor: "text-orange-500", initials: "VM", metrics: [{ l: 'FTOD', v: '1.2%', c: 'text-red-500' }, { l: '1-30 DPD', v: '3.2%', c: 'text-orange-500' }, { l: '31-60 DPD', v: '4.5%', c: 'text-red-500' }] },
    { rank: 5, name: "Suresh Rao", region: "Vijayapura", score: "45.8%", scoreColor: "text-red-500", initials: "SR", metrics: [{ l: 'FTOD', v: '0.8%', c: 'text-red-500' }, { l: '1-30 DPD', v: '5.1%', c: 'text-red-500' }, { l: '31-60 DPD', v: '6.2%', c: 'text-red-500' }] }
  ];

  const filteredStaff = allStaff.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    staff.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
            <span className="material-icons-round text-2xl">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-center flex-1 pr-10">Staff Performance</h1>
        </div>
        <div className="mt-4">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons-round text-gray-400">search</span>
                </span>
                <input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-gray-100 dark:bg-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" 
                    placeholder="Search officer or region..." 
                    type="text"
                />
            </div>
        </div>
        <div className="flex items-center gap-3 mt-4 overflow-x-auto no-scrollbar">
             <button className="flex items-center gap-1 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full whitespace-nowrap shadow-sm">
                Rank <span className="material-icons-round text-base">arrow_downward</span>
            </button>
            <button className="flex items-center gap-1 px-4 py-2 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-full whitespace-nowrap">
                Collection %
            </button>
            <button className="flex items-center gap-1 px-4 py-2 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-full whitespace-nowrap">
                Region
            </button>
        </div>
      </header>
      
       <main className="p-4 space-y-4">
            {filteredStaff.length > 0 ? (
                filteredStaff.map((staff, index) => (
                    <StaffCard 
                        key={index}
                        {...staff}
                    />
                ))
            ) : (
                <div className="text-center py-10 text-gray-400">
                    <span className="material-icons-round text-4xl mb-2">search_off</span>
                    <p>No staff found matching "{searchTerm}"</p>
                </div>
            )}
       </main>
        <div className="fixed bottom-24 right-6 z-30">
            <button 
                onClick={() => alert("Exporting leaderboard data...")}
                className="bg-primary hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center active:scale-90"
            >
            <span className="material-icons-round">download</span>
            </button>
      </div>
    </div>
  );
};

const StaffCard = ({ rank, name, region, score, scoreColor, avatarUrl, initials, metrics }: any) => {
    const rankColors = [
        'bg-yellow-400',
        'bg-gray-400',
        'bg-orange-400',
        'bg-gray-300',
        'bg-gray-300'
    ];
    const badgeColor = rankColors[rank - 1] || 'bg-gray-300';
    const initialsBg = rank === 4 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600';

    return (
        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-transform">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        {avatarUrl ? (
                             <img alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm" src={avatarUrl}/>
                        ) : (
                            <div className={`w-12 h-12 rounded-full ${initialsBg} dark:bg-opacity-20 flex items-center justify-center font-bold text-lg border-2 border-white dark:border-gray-800 shadow-sm`}>
                                {initials}
                            </div>
                        )}
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${badgeColor} rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-gray-800 shadow-sm`}>{rank}</div>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{name}</h4>
                        <div className="flex items-center gap-1">
                            <span className="material-icons-round text-[12px] text-gray-400">place</span>
                            <p className="text-xs text-gray-500">{region}</p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`text-lg font-bold ${scoreColor} dark:${scoreColor.replace('text-', 'text-')}`}>{score}</p>
                    <p className="text-[10px] text-gray-400">Overall Score</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                {metrics.map((m: any, i: number) => (
                    <div key={i} className={`text-center ${i === 1 ? 'border-l border-r border-gray-100 dark:border-gray-700' : ''}`}>
                         <p className="text-[10px] text-gray-500 uppercase font-medium">{m.l}</p>
                         <div className={`flex items-center justify-center gap-1 ${m.c} mt-1`}>
                            <span className="text-sm font-bold">{m.v}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
