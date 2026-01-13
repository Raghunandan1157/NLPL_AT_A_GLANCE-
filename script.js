/**
 * Collection Pro - Vanilla JS Implementation
 */

// --- State Management ---
const state = {
    currentView: 'GLOBAL_DASHBOARD',
    activeTab: 'IGL', // IGL, FIG, IL
    searchTerm: '',
    darkMode: false
};

// --- Component Generators ---

const Components = {
    DonutChart: (percentage, size = 56, colorClass = "text-primary", label = null) => {
        const strokeWidth = 4;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        return `
        <div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px">
          <svg class="w-full h-full transform -rotate-90">
            <circle class="text-gray-200 dark:text-gray-700" cx="${size / 2}" cy="${size / 2}" fill="transparent" r="${radius}" stroke="currentColor" stroke-width="${strokeWidth}"></circle>
            <circle class="${colorClass} transition-all duration-1000 ease-out" cx="${size / 2}" cy="${size / 2}" fill="transparent" r="${radius}" stroke="currentColor" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" stroke-width="${strokeWidth}"></circle>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center leading-none">
            ${label ? label : `<span class="text-xs font-bold ${colorClass}">${percentage}%</span>`}
          </div>
        </div>`;
    },

    MetricSmall: (label, value, trend, color) => {
        const icon = trend === 'up' ? 'arrow_upward' : trend === 'down' ? 'arrow_downward' : 'check';
        return `
        <div class="text-center">
            <p class="text-[10px] text-gray-500">${label}</p>
            <div class="flex items-center justify-center gap-1 ${color}">
                <span class="material-icons-round text-[10px]">${icon}</span>
                <span class="text-xs font-bold">${value}</span>
            </div>
        </div>`;
    },

    ListItem: ({ initials, title, subtitle, value, valueLabel, metrics, theme, onClick }) => {
        const themes = {
            green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
            orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
            red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
            blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
            purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
        };
        const t = themes[theme] || themes.green;
        
        const metricsHtml = metrics ? `
        <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            ${metrics.map(m => Components.MetricSmall(m.label, m.value, m.trend, m.color)).join('')}
        </div>` : '';

        return `
        <div onclick="${onClick}" class="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-transform cursor-pointer hover:shadow-md">
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full ${t.bg} flex items-center justify-center ${t.text} font-bold text-sm">${initials}</div>
                    <div>
                        <h4 class="font-bold text-sm text-gray-900 dark:text-white">${title}</h4>
                        <p class="text-xs text-gray-500">${subtitle}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-sm font-bold ${t.text}">${value}</p>
                    <p class="text-[10px] text-gray-400">${valueLabel}</p>
                </div>
            </div>
            ${metricsHtml}
        </div>`;
    }
};

// --- Views ---

const Views = {
    GLOBAL_DASHBOARD: () => {
        const tabs = ['IGL', 'FIG', 'IL'];
        const percentage = state.activeTab === 'IGL' ? 34 : state.activeTab === 'FIG' ? 62 : 45;

        return `
        <header class="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4 view-animate">
            <div class="flex items-center justify-between">
                <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                    <span class="material-icons-round text-2xl">menu</span>
                </button>
                <h1 class="text-lg font-bold text-center flex-1 pr-10">Collection Pro</h1>
            </div>
            <div class="mt-2 text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Global Report • Updated: 13-01-2026</p>
            </div>
            <div class="flex items-center justify-between mt-6 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                ${tabs.map(tab => `
                    <button onclick="actions.setTab('${tab}')" 
                        class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${state.activeTab === tab ? 'bg-surface-light dark:bg-surface-dark shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}">
                        ${tab}
                    </button>
                `).join('')}
            </div>
        </header>

        <main class="p-4 space-y-6 view-animate">
            <!-- Overall Performance -->
            <section class="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Overall Performance (${state.activeTab})</h2>
                        <p class="text-2xl font-bold mt-1">₹ 4.2 Cr <span class="text-sm font-normal text-gray-500 dark:text-gray-400">/ 12.5 Cr</span></p>
                    </div>
                    ${Components.DonutChart(percentage)}
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-2">
                    <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800/30">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="material-icons-round text-red-500 text-sm">trending_down</span>
                            <p class="text-xs font-medium text-red-600 dark:text-red-400">FTOD</p>
                        </div>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">3.77%</p>
                        <p class="text-[10px] text-gray-500 dark:text-gray-400">Bal: 86.1 L</p>
                    </div>
                    <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800/30">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="material-icons-round text-green-500 text-sm">trending_up</span>
                            <p class="text-xs font-medium text-green-600 dark:text-green-400">1-30 DPD</p>
                        </div>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">2.18%</p>
                        <p class="text-[10px] text-gray-500 dark:text-gray-400">Bal: 10.3 L</p>
                    </div>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Aging Buckets</p>
                    <div class="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                         <div class="flex-none w-28 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                            <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase">31-60 DPD</p>
                            <p class="text-sm font-bold mt-1 text-red-500">0.92%</p>
                            <p class="text-[10px] text-gray-400 mt-1">Bal: 19.4 L</p>
                        </div>
                        <div class="flex-none w-28 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                            <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase">PNPA</p>
                            <p class="text-sm font-bold mt-1 text-orange-500">0.39%</p>
                            <p class="text-[10px] text-gray-400 mt-1">Bal: 17.9 L</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Top Regions -->
            <div class="flex items-center justify-between px-1">
                <h3 class="text-base font-bold text-gray-900 dark:text-white">Top Performing Regions</h3>
                <button class="text-primary text-sm font-medium flex items-center gap-1">
                    Filter <span class="material-icons-round text-base">filter_list</span>
                </button>
            </div>

            <div class="space-y-3">
                ${Components.ListItem({
                    initials: 'BS',
                    title: 'Bengaluru South',
                    subtitle: 'Target: 2.6 Cr',
                    value: '48.11%',
                    valueLabel: 'On Date Coll.',
                    theme: 'green',
                    onClick: "router.navigate('REGION_DETAIL')",
                    metrics: [
                        { label: 'FTOD', value: '1.98%', trend: 'down', color: 'text-red-500' },
                        { label: '1-30', value: '0.00%', trend: 'neutral', color: 'text-green-500' },
                        { label: '31-60', value: '1.92%', trend: 'up', color: 'text-green-500' }
                    ]
                })}
                ${Components.ListItem({
                    initials: 'MY',
                    title: 'Mysuru Region',
                    subtitle: 'Target: 1.8 Cr',
                    value: '34.96%',
                    valueLabel: 'On Date Coll.',
                    theme: 'orange',
                    onClick: "router.navigate('REGION_DETAIL')",
                    metrics: [
                        { label: 'FTOD', value: '2.92%', trend: 'up', color: 'text-green-500' },
                        { label: '1-30', value: '5.26%', trend: 'up', color: 'text-green-500' },
                        { label: '31-60', value: '1.33%', trend: 'up', color: 'text-green-500' }
                    ]
                })}
                ${Components.ListItem({
                    initials: 'HB',
                    title: 'Hubballi Region',
                    subtitle: 'Target: 95 L',
                    value: '21.05%',
                    valueLabel: 'On Date Coll.',
                    theme: 'red',
                    onClick: "router.navigate('REGION_DETAIL')",
                    metrics: [
                        { label: 'FTOD', value: '3.47%', trend: 'up', color: 'text-green-500' },
                        { label: '1-30', value: '3.00%', trend: 'up', color: 'text-green-500' },
                        { label: '31-60', value: '0.00%', trend: 'down', color: 'text-red-500' }
                    ]
                })}
            </div>
        </main>
        
        <div class="fixed bottom-24 right-6 z-30">
            <button onclick="alert('Download Started')" class="bg-primary hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center active:scale-90">
                <span class="material-icons-round">download</span>
            </button>
        </div>
        `;
    },

    REGION_DETAIL: () => {
        return `
        <header class="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4 view-animate">
            <div class="flex items-center justify-between">
                <button onclick="router.navigate('GLOBAL_DASHBOARD')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                    <span class="material-icons-round text-2xl">arrow_back</span>
                </button>
                <h1 class="text-lg font-bold text-center flex-1 pr-10">Tumkur Region</h1>
            </div>
            <div class="flex items-center justify-between mt-6 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                <button class="flex-1 py-2 text-sm font-semibold rounded-lg bg-surface-light dark:bg-surface-dark shadow-sm text-primary">IGL</button>
                <button class="flex-1 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">FIG</button>
                <button class="flex-1 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">IL</button>
            </div>
        </header>

        <main class="p-4 space-y-6 view-animate">
            <section class="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Overall Performance</h2>
                        <p class="text-2xl font-bold mt-1">₹ 4,096 <span class="text-sm font-normal text-gray-500 dark:text-gray-400">/ 12,057 Demand</span></p>
                    </div>
                    ${Components.DonutChart(34)}
                </div>
            </section>

            <div class="flex items-center justify-between px-1">
                <h3 class="text-base font-bold text-gray-900 dark:text-white">District Breakdown</h3>
                <button class="text-primary text-sm font-medium flex items-center gap-1">Filter <span class="material-icons-round text-base">filter_list</span></button>
            </div>

            <div class="space-y-3">
                 ${Components.ListItem({
                    initials: 'CK', title: 'Chikkamagaluru', subtitle: 'Target: 264', value: '48.11%', valueLabel: 'On Date Coll.', theme: 'green',
                    onClick: "router.navigate('BRANCH_DETAIL')",
                    metrics: [{ label: 'FTOD', value: '1.98%', trend: 'up', color: 'text-green-500' }, { label: '1-30', value: '0.00%', trend: 'neutral', color: 'text-green-500' }, { label: '31-60', value: '1.92%', trend: 'up', color: 'text-green-500' }]
                })}
                ${Components.ListItem({
                    initials: 'TP', title: 'Tiptur', subtitle: 'Target: 532', value: '34.96%', valueLabel: 'On Date Coll.', theme: 'orange',
                    onClick: "router.navigate('BRANCH_DETAIL')",
                    metrics: [{ label: 'FTOD', value: '2.92%', trend: 'up', color: 'text-green-500' }, { label: '1-30', value: '5.26%', trend: 'up', color: 'text-green-500' }, { label: '31-60', value: '1.33%', trend: 'up', color: 'text-green-500' }]
                })}
                 ${Components.ListItem({
                    initials: 'VJ', title: 'Vijayapura', subtitle: 'Target: 817', value: '21.05%', valueLabel: 'On Date Coll.', theme: 'red',
                    onClick: "router.navigate('BRANCH_DETAIL')",
                    metrics: [{ label: 'FTOD', value: '3.47%', trend: 'up', color: 'text-green-500' }, { label: '1-30', value: '3.00%', trend: 'up', color: 'text-green-500' }, { label: '31-60', value: '0.00%', trend: 'down', color: 'text-red-500' }]
                })}
            </div>
        </main>`;
    },

    BRANCH_DETAIL: () => {
        return `
        <header class="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4 view-animate">
            <div class="flex items-center justify-between">
                <button onclick="router.navigate('REGION_DETAIL')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                    <span class="material-icons-round text-2xl">arrow_back</span>
                </button>
                <h1 class="text-lg font-bold text-center flex-1 pr-10">Marikal Branch</h1>
            </div>
        </header>
        
        <main class="p-4 space-y-6 view-animate">
            <section class="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-start mb-4">
                    <div>
                    <h2 class="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Branch Performance</h2>
                    <p class="text-2xl font-bold mt-1">₹ 2,140 <span class="text-sm font-normal text-gray-500 dark:text-gray-400">/ 5,800 Demand</span></p>
                    </div>
                    ${Components.DonutChart(36)}
                </div>
            </section>

            <div class="space-y-3">
                ${Components.ListItem({ initials: 'RK', title: 'Ramesh Kumar', subtitle: 'Target: 1,240', value: '92.45%', valueLabel: 'Collection', theme: 'blue', onClick: '', metrics: null })}
                ${Components.ListItem({ initials: 'SD', title: 'Sita Devi', subtitle: 'Target: 980', value: '64.10%', valueLabel: 'Collection', theme: 'purple', onClick: '', metrics: null })}
            </div>
        </main>`;
    },

    STAFF_LIST: () => {
         const allStaff = [
            { rank: 1, name: "Rajesh Kumar", region: "Tumkur Region", score: "92.4%", theme: "green", avatarUrl: "https://picsum.photos/100/100?random=1", metrics: [{ l: 'FTOD', v: '4.8%' }, { l: '1-30', v: '2.1%' }, { l: '31-60', v: '1.2%' }] },
            { rank: 2, name: "Anjali Singh", region: "Kolar District", score: "88.1%", theme: "green", avatarUrl: "https://picsum.photos/100/100?random=2", metrics: [{ l: 'FTOD', v: '3.9%' }, { l: '1-30', v: '1.8%' }, { l: '31-60', v: '0.9%' }] },
            { rank: 3, name: "Priya Sharma", region: "Tiptur Zone", score: "76.5%", theme: "orange", avatarUrl: "https://picsum.photos/100/100?random=3", metrics: [{ l: 'FTOD', v: '2.5%' }, { l: '1-30', v: '4.1%' }, { l: '31-60', v: '1.1%' }] },
            { rank: 4, name: "Vikram M.", region: "Chikkamagaluru", score: "62.3%", theme: "orange", initials: "VM", metrics: [{ l: 'FTOD', v: '1.2%' }, { l: '1-30', v: '3.2%' }, { l: '31-60', v: '4.5%' }] },
            { rank: 5, name: "Suresh Rao", region: "Vijayapura", score: "45.8%", theme: "red", initials: "SR", metrics: [{ l: 'FTOD', v: '0.8%' }, { l: '1-30', v: '5.1%' }, { l: '31-60', v: '6.2%' }] }
        ];

        const filteredStaff = allStaff.filter(s => s.name.toLowerCase().includes(state.searchTerm.toLowerCase()));

        return `
        <header class="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4 view-animate">
            <div class="flex items-center justify-between">
                <button onclick="router.navigate('GLOBAL_DASHBOARD')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                    <span class="material-icons-round text-2xl">arrow_back</span>
                </button>
                <h1 class="text-lg font-bold text-center flex-1 pr-10">Staff Performance</h1>
            </div>
            <div class="mt-4">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span class="material-icons-round text-gray-400">search</span></span>
                    <input oninput="actions.search(this.value)" value="${state.searchTerm}" class="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-gray-100 dark:bg-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" placeholder="Search officer..." type="text">
                </div>
            </div>
        </header>
        
        <main class="p-4 space-y-4 view-animate">
            ${filteredStaff.map(staff => `
                <div class="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                ${staff.avatarUrl ? 
                                    `<img class="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm" src="${staff.avatarUrl}" alt="${staff.name}"/>` : 
                                    `<div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg border-2 border-white dark:border-gray-800 shadow-sm">${staff.initials}</div>`
                                }
                                <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-gray-800 shadow-sm">${staff.rank}</div>
                            </div>
                            <div>
                                <h4 class="font-bold text-sm text-gray-900 dark:text-white">${staff.name}</h4>
                                <p class="text-xs text-gray-500">${staff.region}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold ${staff.theme === 'green' ? 'text-green-600' : staff.theme === 'orange' ? 'text-orange-500' : 'text-red-500'}">${staff.score}</p>
                            <p class="text-[10px] text-gray-400">Score</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                        ${staff.metrics.map(m => `
                            <div class="text-center">
                                <p class="text-[10px] text-gray-500 uppercase font-medium">${m.l}</p>
                                <p class="text-sm font-bold mt-1">${m.v}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </main>`;
    },

    RISK_CENTER: () => {
        return `
        <header class="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4 view-animate">
            <div class="flex items-center justify-between">
                <button onclick="router.navigate('GLOBAL_DASHBOARD')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                    <span class="material-icons-round text-2xl">arrow_back</span>
                </button>
                <h1 class="text-lg font-bold text-center flex-1 pr-10">Risk Alerts</h1>
            </div>
             <div class="flex gap-3 mt-6">
                <button class="flex-1 flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium">
                    <div class="flex flex-col items-start"><span class="text-[10px] text-gray-400">Region</span><span>All</span></div><span class="material-icons-round text-gray-400">expand_more</span>
                </button>
                <button class="flex-1 flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium">
                    <div class="flex flex-col items-start"><span class="text-[10px] text-gray-400">Severity</span><span class="text-red-500">Critical</span></div><span class="material-icons-round text-gray-400">expand_more</span>
                </button>
            </div>
        </header>

        <main class="p-4 space-y-6 view-animate">
            <section class="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Risk Overview</h2>
                        <p class="text-3xl font-bold mt-1 text-gray-900 dark:text-white">14 <span class="text-lg font-medium text-gray-500 dark:text-gray-400">Alerts</span></p>
                        <p class="text-xs text-red-500 font-medium mt-1 flex items-center gap-1"><span class="material-icons-round text-sm">trending_up</span> +3 today</p>
                    </div>
                    ${Components.DonutChart(75, 64, "text-red-500", `<div class="flex flex-col items-center"><span class="text-[10px] text-gray-400">Risk</span><span class="text-sm font-bold text-red-500">High</span></div>`)}
                </div>
            </section>

             <div class="flex items-center justify-between px-1">
                 <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">Urgent <span class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">5</span></h3>
                 <button class="text-primary text-xs font-semibold flex items-center gap-1">Sort <span class="material-icons-round text-sm">sort</span></button>
            </div>

            <div class="space-y-4">
                <div class="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border-l-4 border-l-red-500 border-y border-r border-gray-100 dark:border-gray-700">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center"><span class="material-icons-round">dangerous</span></div>
                            <div><h4 class="font-bold text-sm text-gray-900 dark:text-white">High NPA Risk</h4><p class="text-xs text-gray-500">Tumkur Branch</p></div>
                        </div>
                        <span class="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">CRITICAL</span>
                    </div>
                     <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                        <div><p class="text-[10px] text-gray-500 uppercase">Metric</p><p class="text-sm font-bold text-gray-900 dark:text-white">NPA > 5%</p></div>
                        <div class="text-right"><p class="text-[10px] text-gray-500 uppercase">Value</p><p class="text-lg font-bold text-red-600">₹ 2.67L</p></div>
                    </div>
                </div>

                <div class="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border-l-4 border-l-orange-500 border-y border-r border-gray-100 dark:border-gray-700">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center"><span class="material-icons-round">person_alert</span></div>
                            <div><h4 class="font-bold text-sm text-gray-900 dark:text-white">Potential NPA</h4><p class="text-xs text-gray-500">Kolar District</p></div>
                        </div>
                        <span class="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">HIGH RISK</span>
                    </div>
                     <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                        <div><p class="text-[10px] text-gray-500 uppercase">Movement</p><p class="text-sm font-bold text-gray-900 dark:text-white">31-60 DPD</p></div>
                        <div class="text-right"><p class="text-[10px] text-gray-500 uppercase">Exposure</p><p class="text-lg font-bold text-orange-600">₹ 1.15L</p></div>
                    </div>
                </div>
            </div>
        </main>`;
    },

    PROFILE: () => {
        return `
        <div class="bg-surface-light dark:bg-surface-dark pt-12 pb-8 px-4 rounded-b-[2rem] shadow-sm mb-6 view-animate">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-xl font-bold">My Profile</h1>
                <button class="p-2 text-gray-400"><span class="material-icons-round">settings</span></button>
            </div>
            
            <div class="flex items-center gap-4">
                <div class="relative">
                    <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-4 border-white dark:border-gray-800">JD</div>
                    <button class="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"><span class="material-icons-round text-xs">edit</span></button>
                </div>
                <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">John Doe</h2>
                    <p class="text-sm text-gray-500">Regional Manager • Karnataka</p>
                    <div class="flex items-center gap-1 mt-1 text-green-600 text-xs font-medium"><span class="w-2 h-2 rounded-full bg-green-500"></span> Active now</div>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-4 mt-8">
                <div class="text-center"><p class="text-2xl font-bold text-gray-900 dark:text-white">4</p><p class="text-xs text-gray-500 uppercase tracking-wide mt-1">Regions</p></div>
                <div class="text-center border-l border-r border-gray-100 dark:border-gray-700"><p class="text-2xl font-bold text-gray-900 dark:text-white">92%</p><p class="text-xs text-gray-500 uppercase tracking-wide mt-1">Efficiency</p></div>
                <div class="text-center"><p class="text-2xl font-bold text-gray-900 dark:text-white">12</p><p class="text-xs text-gray-500 uppercase tracking-wide mt-1">Team</p></div>
            </div>
        </div>

        <main class="px-4 space-y-4 view-animate">
            <section class="bg-surface-light dark:bg-surface-dark rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
                <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors mb-1">
                    <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600"><span class="material-icons-round text-lg">person</span></div><span class="text-sm font-medium text-gray-900 dark:text-white">Personal Info</span></div><span class="material-icons-round text-gray-300">chevron_right</span>
                </button>
                 <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                    <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600"><span class="material-icons-round text-lg">account_balance_wallet</span></div><span class="text-sm font-medium text-gray-900 dark:text-white">Incentives</span></div><span class="material-icons-round text-gray-300">chevron_right</span>
                </button>
            </section>

             <section class="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Preferences</h3>
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600"><span class="material-icons-round text-lg">dark_mode</span></div><span class="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</span></div>
                    <button onclick="actions.toggleDarkMode()" class="w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.darkMode ? 'bg-primary' : 'bg-gray-200'}"><div class="w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${state.darkMode ? 'translate-x-6' : 'translate-x-0'}"></div></button>
                </div>
            </section>
             <button class="w-full py-4 text-red-500 font-semibold bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">Log Out</button>
             <p class="text-center text-xs text-gray-400 pt-4 pb-4">Version 2.4.0</p>
        </main>`;
    }
};

// --- Actions & Router ---

const router = {
    navigate: (viewName) => {
        state.currentView = viewName;
        render();
    }
};

const actions = {
    setTab: (tabName) => {
        state.activeTab = tabName;
        render();
    },
    toggleDarkMode: () => {
        state.darkMode = !state.darkMode;
        const html = document.documentElement;
        if (state.darkMode) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        render(); // Re-render to update toggle switch UI
    },
    search: (term) => {
        state.searchTerm = term;
        // Optimization: Don't re-render whole app, just the list part ideally.
        // For simplicity in this demo, we re-render.
        render();
        // Restore focus to input after render
        const input = document.querySelector('input');
        if(input) {
            input.focus();
            input.value = term; // Ensure cursor doesn't jump weirdly
        }
    }
};

function render() {
    const app = document.getElementById('app');
    const viewFn = Views[state.currentView];
    
    if (viewFn) {
        app.innerHTML = viewFn();
    } else {
        app.innerHTML = Views.GLOBAL_DASHBOARD();
    }

    // Update Bottom Nav Active State
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const view = btn.getAttribute('data-view');
        const isActive = view === state.currentView;
        
        if (isActive) {
            btn.classList.add('text-primary');
            btn.classList.remove('text-gray-400');
        } else {
            btn.classList.remove('text-primary');
            btn.classList.add('text-gray-400');
        }
    });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // state.darkMode = true;
        // document.documentElement.classList.add('dark');
    }
    render();
});
