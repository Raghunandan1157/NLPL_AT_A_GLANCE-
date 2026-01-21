/**
 * Collection Pro - Vanilla JS Implementation with Local Mock Data
 */

// --- Mock Database Reference ---
// Uses window.MockDB from mockData.js

// --- State Management ---
const state = {
    currentView: 'GLOBAL_DASHBOARD',
    activeTab: 'ALL', // 'ALL' or specific product
    searchTerm: '',
    darkMode: false,
    selectedRegion: null,
    selectedBranch: null,
    // Bucket detail modal
    bucketModal: {
        show: false,
        bucketName: '',
        entityName: '',
        demand: 0,
        collection: 0,
        accounts: 0,
        collectedAccounts: 0
    },
    // Date filter
    dateFilter: {
        selectedDates: [new Date()],
        showPicker: false,
        userSelected: false
    },
    // Data from Mock Database
    data: {
        summary: null,
        regions: [],
        branches: [],
        staff: [],
        products: [], // List of unique products from database
        loading: true,
        lastUpdated: null
    }
};

// --- Date Utilities ---
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DateUtils = {
    format: (date) => {
        return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    },
    formatShort: (date) => {
        return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
    },
    toDBFormat: (date) => {
        return {
            date: date.getDate(),
            month: MONTHS[date.getMonth()].toUpperCase(),
            year: date.getFullYear()
        };
    },
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    isSameDay: (d1, d2) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    }
};

// --- Data Fetching ---

const DataService = {
    // Format currency in lakhs/crore
    formatCurrency: (amount) => {
        if (amount >= 10000000) {
            return `₹ ${(amount / 10000000).toFixed(1)} Cr`;
        } else if (amount >= 100000) {
            return `₹ ${(amount / 100000).toFixed(1)} L`;
        } else {
            return `₹ ${amount.toLocaleString()}`;
        }
    },

    // Calculate percentage
    calcPercentage: (achieved, total) => {
        if (!total || total === 0) return 0;
        return ((achieved / total) * 100).toFixed(2);
    },

    // Fetch summary data grouped by region
    async fetchDashboardData() {
        state.data.loading = true;
        render();

        try {
            // If not user selected, first find the latest available date and products
            if (!state.dateFilter.userSelected) {
                // Get dates and products from mock data
                const { data: metaData, error: metaError } = await window.MockDB.query({
                    select: ['date', 'month', 'year', 'product_id'],
                    limit: 500
                });

                if (!metaError && metaData && metaData.length > 0) {
                    // Find latest date
                    let latestDate = null;
                    const productsSet = new Set();

                    metaData.forEach(row => {
                        // Collect products
                        if (row.product_id) {
                            productsSet.add(row.product_id);
                        }
                        // Find latest date
                        if (!row.date || !row.month || !row.year) return;
                        const monthIndex = MONTHS.findIndex(m => m.toUpperCase() === String(row.month).toUpperCase());
                        if (monthIndex !== -1) {
                            const d = new Date(row.year, monthIndex, row.date);
                            if (!latestDate || d > latestDate) {
                                latestDate = d;
                            }
                        }
                    });

                    if (latestDate) {
                        state.dateFilter.selectedDates = [latestDate];
                    }

                    // Store products
                    state.data.products = Array.from(productsSet).sort();
                }
                state.dateFilter.userSelected = true;
            }

            // Build query - fetch data for the selected date
            const selectedDate = state.dateFilter.selectedDates[0];
            const dbDate = DateUtils.toDBFormat(selectedDate);

            // Query filters
            const filters = {
                date: dbDate.date,
                month: dbDate.month,
                year: dbDate.year
            };

            // Filter by product if not "ALL"
            if (state.activeTab !== 'ALL') {
                filters.product_id = state.activeTab;
            }

            const { data: regionData, error } = await window.MockDB.query(filters);

            if (error) throw error;

            // If no data, show empty state
            if (!regionData || regionData.length === 0) {
                state.data.loading = false;
                state.data.summary = null;
                state.data.regions = [];
                state.data.lastUpdated = new Date().toLocaleDateString('en-IN');
                render();
                return;
            }

            // Aggregate by region
            const regionsMap = {};
            regionData.forEach(row => {
                const region = row.region_name;
                if (!regionsMap[region]) {
                    regionsMap[region] = {
                        name: region,
                        totalDemand: 0,
                        achievement: 0,
                        dpdCounts: { FTOD: 0, '1-30': 0, '31-60': 0, 'PNPA': 0, total: 0 },
                        // Bucket-wise demand and collection
                        bucketData: {
                            FTOD: { demand: 0, collection: 0, accounts: 0, collectedAccounts: 0 },
                            '1-30': { demand: 0, collection: 0, accounts: 0, collectedAccounts: 0 },
                            '31-60': { demand: 0, collection: 0, accounts: 0, collectedAccounts: 0 },
                            'PNPA': { demand: 0, collection: 0, accounts: 0, collectedAccounts: 0 }
                        }
                    };
                }
                const demand = parseFloat(row.total_demand_amount) || 0;
                const collection = parseFloat(row.achievement_amount) || 0;
                const demandAccounts = parseInt(row.total_demand_account) || 1;
                const collectedAccounts = parseInt(row.achievement_account) || 0;

                regionsMap[region].totalDemand += demand;
                regionsMap[region].achievement += collection;
                regionsMap[region].dpdCounts.total++;

                const dpd = row.dpd_group_present;
                if (dpd === 'FTOD' || dpd === '0') {
                    regionsMap[region].dpdCounts.FTOD++;
                    regionsMap[region].bucketData.FTOD.demand += demand;
                    regionsMap[region].bucketData.FTOD.collection += collection;
                    regionsMap[region].bucketData.FTOD.accounts += demandAccounts;
                    regionsMap[region].bucketData.FTOD.collectedAccounts += collectedAccounts;
                } else if (dpd === '1-30') {
                    regionsMap[region].dpdCounts['1-30']++;
                    regionsMap[region].bucketData['1-30'].demand += demand;
                    regionsMap[region].bucketData['1-30'].collection += collection;
                    regionsMap[region].bucketData['1-30'].accounts += demandAccounts;
                    regionsMap[region].bucketData['1-30'].collectedAccounts += collectedAccounts;
                } else if (dpd === '31-60') {
                    regionsMap[region].dpdCounts['31-60']++;
                    regionsMap[region].bucketData['31-60'].demand += demand;
                    regionsMap[region].bucketData['31-60'].collection += collection;
                    regionsMap[region].bucketData['31-60'].accounts += demandAccounts;
                    regionsMap[region].bucketData['31-60'].collectedAccounts += collectedAccounts;
                } else if (dpd === 'PNPA' || dpd === '61-90') {
                    regionsMap[region].dpdCounts.PNPA++;
                    regionsMap[region].bucketData.PNPA.demand += demand;
                    regionsMap[region].bucketData.PNPA.collection += collection;
                    regionsMap[region].bucketData.PNPA.accounts += demandAccounts;
                    regionsMap[region].bucketData.PNPA.collectedAccounts += collectedAccounts;
                }
            });

            // Convert to array and calculate percentages
            state.data.regions = Object.values(regionsMap).map(r => ({
                name: r.name,
                initials: r.name.substring(0, 2).toUpperCase(),
                totalDemand: r.totalDemand,
                achievement: r.achievement,
                percentage: this.calcPercentage(r.achievement, r.totalDemand),
                ftod: this.calcPercentage(r.dpdCounts.FTOD, r.dpdCounts.total),
                dpd1_30: this.calcPercentage(r.dpdCounts['1-30'], r.dpdCounts.total),
                dpd31_60: this.calcPercentage(r.dpdCounts['31-60'], r.dpdCounts.total),
                pnpa: this.calcPercentage(r.dpdCounts.PNPA, r.dpdCounts.total),
                bucketData: r.bucketData
            })).sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

            // Calculate overall summary
            const totalDemand = Object.values(regionsMap).reduce((sum, r) => sum + r.totalDemand, 0);
            const totalAchievement = Object.values(regionsMap).reduce((sum, r) => sum + r.achievement, 0);
            const totalDpdCounts = Object.values(regionsMap).reduce((acc, r) => {
                acc.FTOD += r.dpdCounts.FTOD;
                acc['1-30'] += r.dpdCounts['1-30'];
                acc['31-60'] += r.dpdCounts['31-60'];
                acc.PNPA += r.dpdCounts.PNPA;
                acc.total += r.dpdCounts.total;
                return acc;
            }, { FTOD: 0, '1-30': 0, '31-60': 0, PNPA: 0, total: 0 });

            state.data.summary = {
                totalDemand,
                totalAchievement,
                percentage: this.calcPercentage(totalAchievement, totalDemand),
                ftod: this.calcPercentage(totalDpdCounts.FTOD, totalDpdCounts.total),
                dpd1_30: this.calcPercentage(totalDpdCounts['1-30'], totalDpdCounts.total),
                dpd31_60: this.calcPercentage(totalDpdCounts['31-60'], totalDpdCounts.total),
                pnpa: this.calcPercentage(totalDpdCounts.PNPA, totalDpdCounts.total)
            };

            state.data.lastUpdated = new Date().toLocaleDateString('en-IN');
            state.data.loading = false;

        } catch (error) {
            console.error('Error fetching data:', error);
            state.data.loading = false;
            state.data.summary = null;
            state.data.regions = [];
            render();
            return;
        }

        render();
    },

    // Fetch branches for a specific region
    async fetchBranchData(regionName) {
        try {
            const { data: branchData, error } = await window.MockDB.query({
                region_name: regionName
            });

            if (error) throw error;

            const branchesMap = {};
            branchData.forEach(row => {
                const branch = row.branch_name || row.branch_code;
                if (!branch) return;
                if (!branchesMap[branch]) {
                    branchesMap[branch] = {
                        name: branch,
                        code: row.branch_code,
                        totalDemand: 0,
                        achievement: 0,
                        dpdCounts: { FTOD: 0, '1-30': 0, '31-60': 0, total: 0 },
                        bucketData: {
                            FTOD: { demand: 0, collection: 0, accounts: 0, collectedAccounts: 0 },
                            '1-30': { demand: 0, collection: 0, accounts: 0, collectedAccounts: 0 },
                            '31-60': { demand: 0, collection: 0, accounts: 0, collectedAccounts: 0 }
                        }
                    };
                }
                const demand = parseFloat(row.total_demand_amount) || 0;
                const collection = parseFloat(row.achievement_amount) || 0;
                const demandAccounts = parseInt(row.total_demand_account) || 1;
                const collectedAccounts = parseInt(row.achievement_account) || 0;

                branchesMap[branch].totalDemand += demand;
                branchesMap[branch].achievement += collection;
                branchesMap[branch].dpdCounts.total++;

                const dpd = row.dpd_group_present;
                if (dpd === 'FTOD' || dpd === '0') {
                    branchesMap[branch].dpdCounts.FTOD++;
                    branchesMap[branch].bucketData.FTOD.demand += demand;
                    branchesMap[branch].bucketData.FTOD.collection += collection;
                    branchesMap[branch].bucketData.FTOD.accounts += demandAccounts;
                    branchesMap[branch].bucketData.FTOD.collectedAccounts += collectedAccounts;
                } else if (dpd === '1-30') {
                    branchesMap[branch].dpdCounts['1-30']++;
                    branchesMap[branch].bucketData['1-30'].demand += demand;
                    branchesMap[branch].bucketData['1-30'].collection += collection;
                    branchesMap[branch].bucketData['1-30'].accounts += demandAccounts;
                    branchesMap[branch].bucketData['1-30'].collectedAccounts += collectedAccounts;
                } else if (dpd === '31-60') {
                    branchesMap[branch].dpdCounts['31-60']++;
                    branchesMap[branch].bucketData['31-60'].demand += demand;
                    branchesMap[branch].bucketData['31-60'].collection += collection;
                    branchesMap[branch].bucketData['31-60'].accounts += demandAccounts;
                    branchesMap[branch].bucketData['31-60'].collectedAccounts += collectedAccounts;
                }
            });

            state.data.branches = Object.values(branchesMap).map(b => ({
                name: b.name,
                code: b.code,
                initials: b.name.substring(0, 2).toUpperCase(),
                totalDemand: b.totalDemand,
                achievement: b.achievement,
                percentage: this.calcPercentage(b.achievement, b.totalDemand),
                ftod: this.calcPercentage(b.dpdCounts.FTOD, b.dpdCounts.total),
                dpd1_30: this.calcPercentage(b.dpdCounts['1-30'], b.dpdCounts.total),
                dpd31_60: this.calcPercentage(b.dpdCounts['31-60'], b.dpdCounts.total),
                bucketData: b.bucketData
            })).sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

        } catch (error) {
            console.error('Error fetching branch data:', error);
        }

        render();
    },

    // Fetch staff data for a specific branch
    async fetchStaffData(branchName) {
        try {
            const { data: staffData, error } = await window.MockDB.query({
                branch_name: branchName
            });

            if (error) throw error;

            const staffMap = {};
            staffData.forEach(row => {
                const empId = row.employee_id;
                if (!empId) return;
                if (!staffMap[empId]) {
                    staffMap[empId] = {
                        id: empId,
                        name: row.employee_name || `Employee ${empId}`,
                        totalDemand: 0,
                        achievement: 0,
                        dpdCounts: { FTOD: 0, '1-30': 0, '31-60': 0, total: 0 }
                    };
                }
                staffMap[empId].totalDemand += parseFloat(row.total_demand_amount) || 0;
                staffMap[empId].achievement += parseFloat(row.achievement_amount) || 0;
                staffMap[empId].dpdCounts.total++;

                const dpd = row.dpd_group_present;
                if (dpd === 'FTOD' || dpd === '0') staffMap[empId].dpdCounts.FTOD++;
                else if (dpd === '1-30') staffMap[empId].dpdCounts['1-30']++;
                else if (dpd === '31-60') staffMap[empId].dpdCounts['31-60']++;
            });

            state.data.staff = Object.values(staffMap).map((s, idx) => ({
                rank: idx + 1,
                id: s.id,
                name: s.name,
                initials: s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
                totalDemand: s.totalDemand,
                achievement: s.achievement,
                score: this.calcPercentage(s.achievement, s.totalDemand),
                ftod: this.calcPercentage(s.dpdCounts.FTOD, s.dpdCounts.total),
                dpd1_30: this.calcPercentage(s.dpdCounts['1-30'], s.dpdCounts.total),
                dpd31_60: this.calcPercentage(s.dpdCounts['31-60'], s.dpdCounts.total)
            })).sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

            // Update ranks after sorting
            state.data.staff.forEach((s, idx) => s.rank = idx + 1);

        } catch (error) {
            console.error('Error fetching staff data:', error);
        }

        render();
    }
};

const Components = {
    LoadingSpinner: () => `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
    `,

    DatePicker: () => {
        const dates = state.dateFilter.selectedDates;
        const displayText = dates.length === 1
            ? DateUtils.format(dates[0])
            : dates.length > 1
                ? `${DateUtils.formatShort(dates[0])} - ${DateUtils.formatShort(dates[dates.length - 1])}`
                : 'Select Date';

        return `
        <div class="flex items-center justify-center gap-3 py-3">
            <button onclick="actions.prevDate()" class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span class="material-icons-round text-gray-500 dark:text-gray-400">chevron_left</span>
            </button>
            <button onclick="actions.toggleDatePicker()" class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-w-[180px] justify-center">
                <span class="material-icons-round text-gray-500 dark:text-gray-400 text-lg">calendar_today</span>
                <span class="font-semibold text-sm text-gray-800 dark:text-gray-200">${displayText}</span>
                <span class="material-icons-round text-gray-400 text-sm">expand_more</span>
            </button>
            <button onclick="actions.nextDate()" class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span class="material-icons-round text-gray-500 dark:text-gray-400">chevron_right</span>
            </button>
        </div>
        ${state.dateFilter.showPicker ? Components.DatePickerModal() : ''}
        `;
    },

    DatePickerModal: () => {
        const today = new Date();
        const selectedDates = state.dateFilter.selectedDates;

        // Generate last 7 days for quick select
        const quickDates = [];
        for (let i = 0; i < 7; i++) {
            quickDates.push(DateUtils.addDays(today, -i));
        }

        return `
        <div class="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onclick="actions.closeDatePicker(event)">
            <div class="bg-surface-light dark:bg-surface-dark rounded-t-3xl w-full max-w-md p-6 animate-slide-up" onclick="event.stopPropagation()">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Select Date(s)</h3>
                    <button onclick="actions.closeDatePicker()" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span class="material-icons-round text-gray-500">close</span>
                    </button>
                </div>
                <p class="text-xs text-gray-500 mb-4">Tap to select/deselect dates</p>
                <div class="grid grid-cols-4 gap-2 mb-4">
                    ${quickDates.map(d => {
            const isSelected = selectedDates.some(sd => DateUtils.isSameDay(sd, d));
            return `
                        <button onclick="actions.toggleDateSelection('${d.toISOString()}')" 
                            class="p-3 rounded-xl text-center transition-all ${isSelected
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}">
                            <p class="text-xs font-medium">${MONTHS[d.getMonth()]}</p>
                            <p class="text-lg font-bold">${d.getDate()}</p>
                        </button>`;
        }).join('')}
                </div>
                <div class="flex gap-3">
                    <button onclick="actions.selectToday()" class="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Today
                    </button>
                    <button onclick="actions.applyDateFilter()" class="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors">
                        Apply Filter
                    </button>
                </div>
            </div>
        </div>
        `;
    },

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

    MetricSmall: (label, value, trend, color, clickData = null) => {
        const icon = trend === 'up' ? 'arrow_upward' : trend === 'down' ? 'arrow_downward' : 'check';
        const clickHandler = clickData ? `onclick="event.stopPropagation(); actions.showBucketDetail('${clickData.bucket}', '${clickData.entity.replace(/'/g, "\\'")}', ${clickData.demand}, ${clickData.collection}, ${clickData.accounts}, ${clickData.collectedAccounts})"` : '';
        const cursorClass = clickData ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1 -m-1 transition-colors' : '';
        return `
        <div class="text-center ${cursorClass}" ${clickHandler}>
            <p class="text-[10px] text-gray-500">${label}</p>
            <div class="flex items-center justify-center gap-1 ${color}">
                <span class="material-icons-round text-[10px]">${icon}</span>
                <span class="text-xs font-bold">${value}%</span>
            </div>
        </div>`;
    },

    BucketDetailModal: () => {
        if (!state.bucketModal.show) return '';

        const { bucketName, entityName, demand, collection, accounts, collectedAccounts } = state.bucketModal;
        const percentage = demand > 0 ? ((collection / demand) * 100).toFixed(2) : 0;
        const accountPercentage = accounts > 0 ? ((collectedAccounts / accounts) * 100).toFixed(2) : 0;

        return `
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onclick="actions.closeBucketDetail()">
            <div class="bg-surface-light dark:bg-surface-dark rounded-2xl w-full max-w-sm p-5 animate-slide-up shadow-xl" onclick="event.stopPropagation()">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">${bucketName} Bucket</h3>
                        <p class="text-xs text-gray-500">${entityName}</p>
                    </div>
                    <button onclick="actions.closeBucketDetail()" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span class="material-icons-round text-gray-500">close</span>
                    </button>
                </div>

                <!-- Amount Details -->
                <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-3">
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">Amount</p>
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-600 dark:text-gray-300">Demand</span>
                        <span class="text-sm font-bold text-gray-900 dark:text-white">${DataService.formatCurrency(demand)}</span>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-600 dark:text-gray-300">Collection</span>
                        <span class="text-sm font-bold text-green-600">${DataService.formatCurrency(collection)}</span>
                    </div>
                    <div class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Achievement</span>
                        <span class="text-sm font-bold ${parseFloat(percentage) >= 70 ? 'text-green-600' : parseFloat(percentage) >= 40 ? 'text-orange-500' : 'text-red-500'}">${percentage}%</span>
                    </div>
                </div>

                <!-- Account Details -->
                <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">Accounts</p>
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-600 dark:text-gray-300">Total Accounts</span>
                        <span class="text-sm font-bold text-gray-900 dark:text-white">${accounts}</span>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-600 dark:text-gray-300">Collected</span>
                        <span class="text-sm font-bold text-green-600">${collectedAccounts}</span>
                    </div>
                    <div class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Coverage</span>
                        <span class="text-sm font-bold ${parseFloat(accountPercentage) >= 70 ? 'text-green-600' : parseFloat(accountPercentage) >= 40 ? 'text-orange-500' : 'text-red-500'}">${accountPercentage}%</span>
                    </div>
                </div>
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
            ${metrics.map(m => Components.MetricSmall(m.label, m.value, m.trend, m.color, m.clickData)).join('')}
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
    },

    EmptyState: (message) => `
        <div class="text-center py-12">
            <span class="material-icons-round text-5xl text-gray-300 dark:text-gray-600 mb-4">inbox</span>
            <p class="text-gray-500 dark:text-gray-400">${message}</p>
            <button onclick="DataService.fetchDashboardData()" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
                Refresh Data
            </button>
        </div>
    `
};

// --- Helper Functions ---

const getThemeByPercentage = (pct) => {
    const p = parseFloat(pct);
    if (p >= 70) return 'green';
    if (p >= 40) return 'orange';
    return 'red';
};

const getTrend = (value) => {
    const v = parseFloat(value);
    if (v <= 2) return 'up';
    if (v >= 5) return 'down';
    return 'neutral';
};

const getTrendColor = (value) => {
    const v = parseFloat(value);
    if (v <= 2) return 'text-green-500';
    if (v >= 5) return 'text-red-500';
    return 'text-orange-500';
};

// --- Views ---

const Views = {
    GLOBAL_DASHBOARD: () => {
        const tabs = ['ALL', ...state.data.products.filter(p => p !== 'ALL')];
        const summary = state.data.summary;
        const regions = state.data.regions;

        if (state.data.loading) {
            return `
            <header class="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4 view-animate">
                <div class="flex items-center justify-between">
                    <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                        <span class="material-icons-round text-2xl">menu</span>
                    </button>
                    <h1 class="text-lg font-bold text-center flex-1 pr-10">Collection Pro</h1>
                </div>
            </header>
            <main class="p-4">
                ${Components.LoadingSpinner()}
            </main>`;
        }

        if (!summary || regions.length === 0) {
            return `
            <header class="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4 view-animate">
                <div class="flex items-center justify-between">
                    <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                        <span class="material-icons-round text-2xl">menu</span>
                    </button>
                    <h1 class="text-lg font-bold text-center flex-1 pr-10">Collection Pro</h1>
                </div>
            </header>
            <main class="p-4">
                ${Components.EmptyState('No data available for this date. Try selecting a different date.')}
            </main>`;
        }

        return `
        <header class="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4 view-animate">
            <div class="flex items-center justify-between">
                <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                    <span class="material-icons-round text-2xl">menu</span>
                </button>
                <h1 class="text-lg font-bold text-center flex-1 pr-10">Collection Pro</h1>
            </div>
            
            <!-- Date Picker -->
            ${Components.DatePicker()}
            
            <div class="flex items-center justify-between mt-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                ${tabs.map(tab => `
                    <button onclick="actions.setTab('${tab}')"
                        class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${state.activeTab === tab ? 'bg-surface-light dark:bg-surface-dark shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}">
                        ${tab === 'ALL' ? 'All' : tab}
                    </button>
                `).join('')}
            </div>
        </header>

        <main class="p-4 space-y-6 view-animate">
            <!-- Overall Performance -->
            <section class="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Overall Performance (${state.activeTab === 'ALL' ? 'All Products' : state.activeTab})</h2>
                        <p class="text-2xl font-bold mt-1">${DataService.formatCurrency(summary.totalAchievement)} <span class="text-sm font-normal text-gray-500 dark:text-gray-400">/ ${DataService.formatCurrency(summary.totalDemand)}</span></p>
                    </div>
                    ${Components.DonutChart(parseFloat(summary.percentage))}
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-2">
                    <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800/30">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="material-icons-round text-red-500 text-sm">trending_down</span>
                            <p class="text-xs font-medium text-red-600 dark:text-red-400">FTOD</p>
                        </div>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">${summary.ftod}%</p>
                    </div>
                    <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800/30">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="material-icons-round text-green-500 text-sm">trending_up</span>
                            <p class="text-xs font-medium text-green-600 dark:text-green-400">1-30 DPD</p>
                        </div>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">${summary.dpd1_30}%</p>
                    </div>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Aging Buckets</p>
                    <div class="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                         <div class="flex-none w-28 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                            <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase">31-60 DPD</p>
                            <p class="text-sm font-bold mt-1 text-red-500">${summary.dpd31_60}%</p>
                        </div>
                        <div class="flex-none w-28 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                            <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase">PNPA</p>
                            <p class="text-sm font-bold mt-1 text-orange-500">${summary.pnpa}%</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Top Regions -->
            <div class="flex items-center justify-between px-1">
                <h3 class="text-base font-bold text-gray-900 dark:text-white">Top Performing Regions</h3>
                <button onclick="DataService.fetchDashboardData()" class="text-primary text-sm font-medium flex items-center gap-1">
                    Refresh <span class="material-icons-round text-base">refresh</span>
                </button>
            </div>

            <div class="space-y-3">
                ${regions.slice(0, 10).map(region => {
                    const bd = region.bucketData || { FTOD: {demand:0,collection:0,accounts:0,collectedAccounts:0}, '1-30': {demand:0,collection:0,accounts:0,collectedAccounts:0}, '31-60': {demand:0,collection:0,accounts:0,collectedAccounts:0} };
                    return Components.ListItem({
                        initials: region.initials,
                        title: region.name,
                        subtitle: `Target: ${DataService.formatCurrency(region.totalDemand)}`,
                        value: `${region.percentage}%`,
                        valueLabel: 'Collection',
                        theme: getThemeByPercentage(region.percentage),
                        onClick: `actions.selectRegion('${region.name.replace(/'/g, "\\'")}')`,
                        metrics: [
                            { label: 'FTOD', value: region.ftod, trend: getTrend(region.ftod), color: getTrendColor(region.ftod), clickData: { bucket: 'FTOD', entity: region.name, demand: bd.FTOD.demand, collection: bd.FTOD.collection, accounts: bd.FTOD.accounts, collectedAccounts: bd.FTOD.collectedAccounts } },
                            { label: '1-30', value: region.dpd1_30, trend: getTrend(region.dpd1_30), color: getTrendColor(region.dpd1_30), clickData: { bucket: '1-30', entity: region.name, demand: bd['1-30'].demand, collection: bd['1-30'].collection, accounts: bd['1-30'].accounts, collectedAccounts: bd['1-30'].collectedAccounts } },
                            { label: '31-60', value: region.dpd31_60, trend: getTrend(region.dpd31_60), color: getTrendColor(region.dpd31_60), clickData: { bucket: '31-60', entity: region.name, demand: bd['31-60'].demand, collection: bd['31-60'].collection, accounts: bd['31-60'].accounts, collectedAccounts: bd['31-60'].collectedAccounts } }
                        ]
                    });
                }).join('')}
            </div>
        </main>
        `;
    },

    REGION_DETAIL: () => {
        const regionName = state.selectedRegion;
        const branches = state.data.branches;
        const regionData = state.data.regions.find(r => r.name === regionName) || {};

        return `
        <header class="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4 view-animate">
            <div class="flex items-center justify-between">
                <button onclick="router.navigate('GLOBAL_DASHBOARD')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                    <span class="material-icons-round text-2xl">arrow_back</span>
                </button>
                <h1 class="text-lg font-bold text-center flex-1 pr-10">${regionName}</h1>
            </div>
        </header>

        <main class="p-4 space-y-6 view-animate">
            <section class="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Region Performance</h2>
                        <p class="text-2xl font-bold mt-1">${DataService.formatCurrency(regionData.achievement || 0)} <span class="text-sm font-normal text-gray-500 dark:text-gray-400">/ ${DataService.formatCurrency(regionData.totalDemand || 0)}</span></p>
                    </div>
                    ${Components.DonutChart(parseFloat(regionData.percentage || 0))}
                </div>
            </section>

            <div class="flex items-center justify-between px-1">
                <h3 class="text-base font-bold text-gray-900 dark:text-white">Branch Breakdown</h3>
            </div>

            <div class="space-y-3">
                ${branches.length === 0 ? Components.EmptyState('No branch data available') : branches.map(branch => {
                    const bd = branch.bucketData || { FTOD: {demand:0,collection:0,accounts:0,collectedAccounts:0}, '1-30': {demand:0,collection:0,accounts:0,collectedAccounts:0}, '31-60': {demand:0,collection:0,accounts:0,collectedAccounts:0} };
                    return Components.ListItem({
                        initials: branch.initials,
                        title: branch.name,
                        subtitle: `Target: ${DataService.formatCurrency(branch.totalDemand)}`,
                        value: `${branch.percentage}%`,
                        valueLabel: 'Collection',
                        theme: getThemeByPercentage(branch.percentage),
                        onClick: `actions.selectBranch('${branch.name.replace(/'/g, "\\'")}')`,
                        metrics: [
                            { label: 'FTOD', value: branch.ftod, trend: getTrend(branch.ftod), color: getTrendColor(branch.ftod), clickData: { bucket: 'FTOD', entity: branch.name, demand: bd.FTOD.demand, collection: bd.FTOD.collection, accounts: bd.FTOD.accounts, collectedAccounts: bd.FTOD.collectedAccounts } },
                            { label: '1-30', value: branch.dpd1_30, trend: getTrend(branch.dpd1_30), color: getTrendColor(branch.dpd1_30), clickData: { bucket: '1-30', entity: branch.name, demand: bd['1-30'].demand, collection: bd['1-30'].collection, accounts: bd['1-30'].accounts, collectedAccounts: bd['1-30'].collectedAccounts } },
                            { label: '31-60', value: branch.dpd31_60, trend: getTrend(branch.dpd31_60), color: getTrendColor(branch.dpd31_60), clickData: { bucket: '31-60', entity: branch.name, demand: bd['31-60'].demand, collection: bd['31-60'].collection, accounts: bd['31-60'].accounts, collectedAccounts: bd['31-60'].collectedAccounts } }
                        ]
                    });
                }).join('')}
            </div>
        </main>`;
    },

    BRANCH_DETAIL: () => {
        const branchName = state.selectedBranch;
        const staff = state.data.staff;
        const branchData = state.data.branches.find(b => b.name === branchName) || {};

        return `
        <header class="sticky top-0 z-20 bg-surface-light dark:bg-surface-dark shadow-sm px-4 pt-12 pb-4 view-animate">
            <div class="flex items-center justify-between">
                <button onclick="router.navigate('REGION_DETAIL')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                    <span class="material-icons-round text-2xl">arrow_back</span>
                </button>
                <h1 class="text-lg font-bold text-center flex-1 pr-10">${branchName}</h1>
            </div>
        </header>
        
        <main class="p-4 space-y-6 view-animate">
            <section class="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-start mb-4">
                    <div>
                    <h2 class="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Branch Performance</h2>
                    <p class="text-2xl font-bold mt-1">${DataService.formatCurrency(branchData.achievement || 0)} <span class="text-sm font-normal text-gray-500 dark:text-gray-400">/ ${DataService.formatCurrency(branchData.totalDemand || 0)}</span></p>
                    </div>
                    ${Components.DonutChart(parseFloat(branchData.percentage || 0))}
                </div>
            </section>

            <div class="flex items-center justify-between px-1">
                <h3 class="text-base font-bold text-gray-900 dark:text-white">Staff Performance</h3>
            </div>

            <div class="space-y-3">
                ${staff.length === 0 ? Components.EmptyState('No staff data available') : staff.map(s => Components.ListItem({
            initials: s.initials,
            title: s.name,
            subtitle: `Target: ${DataService.formatCurrency(s.totalDemand)}`,
            value: `${s.score}%`,
            valueLabel: 'Score',
            theme: getThemeByPercentage(s.score),
            onClick: '',
            metrics: [
                { label: 'FTOD', value: s.ftod, trend: getTrend(s.ftod), color: getTrendColor(s.ftod) },
                { label: '1-30', value: s.dpd1_30, trend: getTrend(s.dpd1_30), color: getTrendColor(s.dpd1_30) },
                { label: '31-60', value: s.dpd31_60, trend: getTrend(s.dpd31_60), color: getTrendColor(s.dpd31_60) }
            ]
        })).join('')}
            </div>
        </main>`;
    },

    STAFF_LIST: () => {
        const allStaff = state.data.staff || [];
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
                    <input oninput="actions.search(this.value)" value="${state.searchTerm}" class="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-gray-100 dark:bg-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" placeholder="Search staff..." type="text">
                </div>
            </div>
        </header>
        
        <main class="p-4 space-y-4 view-animate">
            ${filteredStaff.length === 0 ? Components.EmptyState('No staff data. Navigate to a branch to view staff.') :
                filteredStaff.map(staff => `
                <div class="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg border-2 border-white dark:border-gray-800 shadow-sm">${staff.initials}</div>
                                <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-gray-800 shadow-sm">${staff.rank}</div>
                            </div>
                            <div>
                                <h4 class="font-bold text-sm text-gray-900 dark:text-white">${staff.name}</h4>
                                <p class="text-xs text-gray-500">ID: ${staff.id}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold ${getThemeByPercentage(staff.score) === 'green' ? 'text-green-600' : getThemeByPercentage(staff.score) === 'orange' ? 'text-orange-500' : 'text-red-500'}">${staff.score}%</p>
                            <p class="text-[10px] text-gray-400">Score</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div class="text-center">
                            <p class="text-[10px] text-gray-500 uppercase font-medium">FTOD</p>
                            <p class="text-sm font-bold mt-1">${staff.ftod}%</p>
                        </div>
                        <div class="text-center">
                            <p class="text-[10px] text-gray-500 uppercase font-medium">1-30</p>
                            <p class="text-sm font-bold mt-1">${staff.dpd1_30}%</p>
                        </div>
                        <div class="text-center">
                            <p class="text-[10px] text-gray-500 uppercase font-medium">31-60</p>
                            <p class="text-sm font-bold mt-1">${staff.dpd31_60}%</p>
                        </div>
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
        </header>

        <main class="p-4 space-y-6 view-animate">
            ${Components.EmptyState('Risk alerts will be calculated from uploaded data.')}
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
                    <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-4 border-white dark:border-gray-800">AD</div>
                </div>
                <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">Admin User</h2>
                    <p class="text-sm text-gray-500">Collection Pro Dashboard</p>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-4 mt-8">
                <div class="text-center"><p class="text-2xl font-bold text-gray-900 dark:text-white">${state.data.regions.length}</p><p class="text-xs text-gray-500 uppercase tracking-wide mt-1">Regions</p></div>
                <div class="text-center border-l border-r border-gray-100 dark:border-gray-700"><p class="text-2xl font-bold text-gray-900 dark:text-white">${state.data.summary ? state.data.summary.percentage : 0}%</p><p class="text-xs text-gray-500 uppercase tracking-wide mt-1">Overall</p></div>
                <div class="text-center"><p class="text-2xl font-bold text-gray-900 dark:text-white">${state.data.branches.length}</p><p class="text-xs text-gray-500 uppercase tracking-wide mt-1">Branches</p></div>
            </div>
        </div>

        <main class="px-4 space-y-4 view-animate">
             <section class="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Preferences</h3>
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600"><span class="material-icons-round text-lg">dark_mode</span></div><span class="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</span></div>
                    <button onclick="actions.toggleDarkMode()" class="w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.darkMode ? 'bg-primary' : 'bg-gray-200'}"><div class="w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${state.darkMode ? 'translate-x-6' : 'translate-x-0'}"></div></button>
                </div>
            </section>
             <button onclick="DataService.fetchDashboardData()" class="w-full py-4 text-primary font-semibold bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm hover:bg-primary/10 transition-colors">Refresh All Data</button>
             <p class="text-center text-xs text-gray-400 pt-4 pb-4">Collection Pro v2.0 • Sample Data Mode</p>
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
        DataService.fetchDashboardData();
    },
    toggleDarkMode: () => {
        state.darkMode = !state.darkMode;
        const html = document.documentElement;
        if (state.darkMode) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        render();
    },
    search: (term) => {
        state.searchTerm = term;
        render();
        const input = document.querySelector('input');
        if (input) {
            input.focus();
            input.value = term;
        }
    },
    selectRegion: (regionName) => {
        state.selectedRegion = regionName;
        DataService.fetchBranchData(regionName);
        router.navigate('REGION_DETAIL');
    },
    selectBranch: (branchName) => {
        state.selectedBranch = branchName;
        DataService.fetchStaffData(branchName);
        router.navigate('BRANCH_DETAIL');
    },
    // Date Picker Actions
    prevDate: () => {
        const currentDate = state.dateFilter.selectedDates[0] || new Date();
        state.dateFilter.selectedDates = [DateUtils.addDays(currentDate, -1)];
        state.dateFilter.userSelected = true;
        DataService.fetchDashboardData();
    },
    nextDate: () => {
        const currentDate = state.dateFilter.selectedDates[0] || new Date();
        const tomorrow = DateUtils.addDays(currentDate, 1);
        const today = new Date();
        // Don't go beyond today
        if (tomorrow <= today) {
            state.dateFilter.selectedDates = [tomorrow];
            state.dateFilter.userSelected = true;
            DataService.fetchDashboardData();
        }
    },
    toggleDatePicker: () => {
        state.dateFilter.showPicker = !state.dateFilter.showPicker;
        render();
    },
    closeDatePicker: (event) => {
        if (!event || event.target === event.currentTarget) {
            state.dateFilter.showPicker = false;
            render();
        }
    },
    toggleDateSelection: (isoString) => {
        const date = new Date(isoString);
        const existingIndex = state.dateFilter.selectedDates.findIndex(d => DateUtils.isSameDay(d, date));

        if (existingIndex >= 0) {
            // Remove if already selected (but keep at least one)
            if (state.dateFilter.selectedDates.length > 1) {
                state.dateFilter.selectedDates.splice(existingIndex, 1);
            }
        } else {
            // Add to selection
            state.dateFilter.selectedDates.push(date);
            state.dateFilter.selectedDates.sort((a, b) => a - b);
        }
        render();
    },
    selectToday: () => {
        state.dateFilter.selectedDates = [new Date()];
        state.dateFilter.userSelected = true;
        render();
    },
    applyDateFilter: () => {
        state.dateFilter.showPicker = false;
        state.dateFilter.userSelected = true;
        DataService.fetchDashboardData();
    },
    // Bucket Detail Modal Actions
    showBucketDetail: (bucketName, entityName, demand, collection, accounts, collectedAccounts) => {
        state.bucketModal = {
            show: true,
            bucketName,
            entityName,
            demand,
            collection,
            accounts,
            collectedAccounts
        };
        render();
    },
    closeBucketDetail: () => {
        state.bucketModal.show = false;
        render();
    }
};

function render() {
    const app = document.getElementById('app');
    const viewFn = Views[state.currentView];

    if (viewFn) {
        app.innerHTML = viewFn() + Components.BucketDetailModal();
    } else {
        app.innerHTML = Views.GLOBAL_DASHBOARD() + Components.BucketDetailModal();
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

// Attach to window for global access (needed for onclick handlers in HTML)
window.router = router;
window.actions = actions;
window.DataService = DataService;
window.render = render;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // state.darkMode = true;
        // document.documentElement.classList.add('dark');
    }

    // Initial render
    render();

    // Fetch data from mock database
    DataService.fetchDashboardData();
}
