/**
 * Mock Data for Collection Pro Dashboard
 * Sample dataset with approximately 100 entries
 */

// Region and District mapping based on provided data
const REGION_DISTRICT_MAP = {
    'KALABURAGI': ['KALBURGI', 'INDI', 'SEDAM', 'HUMNABAD', 'BIDAR', 'LINGSUGUR', 'KUSHTAGI'],
    'DHARWAD': ['DHARWAD', 'GADAG', 'BELAGAVI', 'BAGALKOTE', 'VIJAYAPURA', 'BADAMI', 'CHIKKODI', 'BALLARI', 'KUDLIGI', 'VIJAYANAGARA'],
    'TUMKUR': ['TUMKUR', 'TIPTUR', 'KADUR', 'HOLALKERE', 'CHITRADURGA', 'DAVANAGERE', 'CHIKKAMAGALURU', 'BENGALORE-RURAL', 'BENGALORE-URBAN', 'CHIKKABALLAPUR', 'KOLAR'],
    'ANDRA PRADESH': ['KADAPA'],
    'TELANGANA': ['MAHABOOBNAGAR', 'SANGAREDDY']
};

// Sample employee names
const EMPLOYEE_NAMES = [
    'Rajesh Kumar', 'Suresh Patil', 'Anil Sharma', 'Priya Devi', 'Venkat Rao',
    'Ramesh Gowda', 'Sandeep Naik', 'Meena Kumari', 'Prakash Hegde', 'Lakshmi Bai',
    'Naveen Reddy', 'Bharath Kumar', 'Shivani Kaur', 'Mahesh Babu', 'Kavitha Nair',
    'Ravi Shankar', 'Deepa Rani', 'Kiran Kumar', 'Anjali Devi', 'Srinivas Rao',
    'Pooja Sharma', 'Ganesh Prasad', 'Sunita Kumari', 'Rakesh Shetty', 'Divya Murthy',
    'Harish Gowda', 'Neha Singh', 'Sunil Desai', 'Rekha Bhat', 'Arun Kumar'
];

// Products
const PRODUCTS = ['JLG', 'SHG', 'MSME', 'IL'];

// DPD Groups
const DPD_GROUPS = ['FTOD', '0', '1-30', '31-60', 'PNPA', '61-90'];

// Helper function to get random item from array
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function to get random number in range
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get random amount
function getRandomAmount(min, max) {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// Generate mock data
function generateMockData() {
    const data = [];
    let id = 1;

    // Current date info
    const today = new Date();
    const currentDate = today.getDate();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentMonth = months[today.getMonth()];
    const currentYear = today.getFullYear();

    // Generate entries for each region and district
    Object.keys(REGION_DISTRICT_MAP).forEach(region => {
        const districts = REGION_DISTRICT_MAP[region];

        districts.forEach(district => {
            // Generate 2-5 branches per district
            const numBranches = getRandomNumber(2, 4);

            for (let b = 1; b <= numBranches; b++) {
                const branchCode = `BR${district.substring(0, 3)}${String(b).padStart(2, '0')}`;
                const branchName = `${district} Branch ${b}`;

                // Generate 2-4 staff members per branch
                const numStaff = getRandomNumber(2, 3);

                for (let s = 0; s < numStaff; s++) {
                    const employeeId = `EMP${String(id).padStart(4, '0')}`;
                    const employeeName = EMPLOYEE_NAMES[id % EMPLOYEE_NAMES.length];
                    const product = getRandomItem(PRODUCTS);

                    // Generate financial data
                    const totalDemandAmount = getRandomAmount(50000, 500000);
                    const achievementPercentage = getRandomAmount(0.3, 0.95);
                    const achievementAmount = totalDemandAmount * achievementPercentage;

                    const regularDemandAmount = totalDemandAmount * 0.7;
                    const odDemandAmount = totalDemandAmount * 0.3;

                    const regularDemandAccount = getRandomNumber(5, 20);
                    const odDemandAccount = getRandomNumber(1, 5);
                    const totalDemandAccount = regularDemandAccount + odDemandAccount;
                    const achievementAccount = Math.floor(totalDemandAccount * achievementPercentage);

                    const portfolioAmount = getRandomAmount(100000, 1000000);
                    const portfolioAccount = getRandomNumber(10, 50);

                    // DPD groups
                    const dpdGroupPresent = getRandomItem(DPD_GROUPS);
                    const dpdGroupLastMonth = getRandomItem(DPD_GROUPS);

                    // Create record
                    const record = {
                        id: id,
                        timestamp: today.toISOString(),
                        hour: today.getHours(),
                        date: currentDate,
                        month: currentMonth,
                        year: currentYear,
                        region_name: region,
                        district_name: district,
                        branch_code: branchCode,
                        branch_name: branchName,
                        center_name: `Center ${district} ${getRandomNumber(1, 10)}`,
                        center_id: `CNT${String(getRandomNumber(1000, 9999))}`,
                        product_id: product,
                        account_id: `ACC${String(getRandomNumber(100000, 999999))}`,
                        client_name: `Client ${getRandomNumber(1, 100)}`,
                        client_id: `CLT${String(getRandomNumber(10000, 99999))}`,
                        employee_id: employeeId,
                        employee_name: employeeName,
                        db_date: `${currentDate}-${currentMonth}-${currentYear}`,
                        db_amount: getRandomAmount(1000, 10000),
                        meeting_date: `${currentDate}-${currentMonth}-${currentYear}`,
                        regular_demand_account: regularDemandAccount,
                        regular_demand_amount: regularDemandAmount,
                        od_demand_account: odDemandAccount,
                        od_demand_amount: odDemandAmount,
                        total_demand_account: totalDemandAccount,
                        total_demand_amount: totalDemandAmount,
                        achievement_account: achievementAccount,
                        achievement_amount: achievementAmount,
                        portfolio_account: portfolioAccount,
                        portfolio_amount: portfolioAmount,
                        dpd_group_last_month: dpdGroupLastMonth,
                        dpd_group_present: dpdGroupPresent,
                        created_at: today.toISOString()
                    };

                    data.push(record);
                    id++;
                }
            }
        });
    });

    return data;
}

// Generate the data
const MOCK_DATA = generateMockData();

// Also generate data for the past 7 days for date navigation
function generateDataForDays(days) {
    const allData = [];
    const today = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    for (let d = 0; d < days; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - d);

        const dayDate = date.getDate();
        const dayMonth = months[date.getMonth()];
        const dayYear = date.getFullYear();

        // Generate fresh data for each day
        let id = d * 150 + 1;

        Object.keys(REGION_DISTRICT_MAP).forEach(region => {
            const districts = REGION_DISTRICT_MAP[region];

            districts.forEach(district => {
                const numBranches = getRandomNumber(2, 4);

                for (let b = 1; b <= numBranches; b++) {
                    const branchCode = `BR${district.substring(0, 3)}${String(b).padStart(2, '0')}`;
                    const branchName = `${district} Branch ${b}`;
                    const numStaff = getRandomNumber(2, 3);

                    for (let s = 0; s < numStaff; s++) {
                        const employeeId = `EMP${String((id % 30) + 1).padStart(4, '0')}`;
                        const employeeName = EMPLOYEE_NAMES[(id % 30)];
                        const product = getRandomItem(PRODUCTS);

                        const totalDemandAmount = getRandomAmount(50000, 500000);
                        const achievementPercentage = getRandomAmount(0.3, 0.95);
                        const achievementAmount = totalDemandAmount * achievementPercentage;

                        const regularDemandAmount = totalDemandAmount * 0.7;
                        const odDemandAmount = totalDemandAmount * 0.3;

                        const regularDemandAccount = getRandomNumber(5, 20);
                        const odDemandAccount = getRandomNumber(1, 5);
                        const totalDemandAccount = regularDemandAccount + odDemandAccount;
                        const achievementAccount = Math.floor(totalDemandAccount * achievementPercentage);

                        const portfolioAmount = getRandomAmount(100000, 1000000);
                        const portfolioAccount = getRandomNumber(10, 50);

                        const dpdGroupPresent = getRandomItem(DPD_GROUPS);
                        const dpdGroupLastMonth = getRandomItem(DPD_GROUPS);

                        const record = {
                            id: id,
                            timestamp: date.toISOString(),
                            hour: date.getHours(),
                            date: dayDate,
                            month: dayMonth,
                            year: dayYear,
                            region_name: region,
                            district_name: district,
                            branch_code: branchCode,
                            branch_name: branchName,
                            center_name: `Center ${district} ${getRandomNumber(1, 10)}`,
                            center_id: `CNT${String(getRandomNumber(1000, 9999))}`,
                            product_id: product,
                            account_id: `ACC${String(getRandomNumber(100000, 999999))}`,
                            client_name: `Client ${getRandomNumber(1, 100)}`,
                            client_id: `CLT${String(getRandomNumber(10000, 99999))}`,
                            employee_id: employeeId,
                            employee_name: employeeName,
                            db_date: `${dayDate}-${dayMonth}-${dayYear}`,
                            db_amount: getRandomAmount(1000, 10000),
                            meeting_date: `${dayDate}-${dayMonth}-${dayYear}`,
                            regular_demand_account: regularDemandAccount,
                            regular_demand_amount: regularDemandAmount,
                            od_demand_account: odDemandAccount,
                            od_demand_amount: odDemandAmount,
                            total_demand_account: totalDemandAccount,
                            total_demand_amount: totalDemandAmount,
                            achievement_account: achievementAccount,
                            achievement_amount: achievementAmount,
                            portfolio_account: portfolioAccount,
                            portfolio_amount: portfolioAmount,
                            dpd_group_last_month: dpdGroupLastMonth,
                            dpd_group_present: dpdGroupPresent,
                            created_at: date.toISOString()
                        };

                        allData.push(record);
                        id++;
                    }
                }
            });
        });
    }

    return allData;
}

// Generate data for past 7 days
window.MOCK_DATABASE = generateDataForDays(7);

// Mock database query interface
window.MockDB = {
    // Query data with filters
    query: function(filters = {}) {
        let result = [...window.MOCK_DATABASE];

        // Filter by date
        if (filters.date !== undefined) {
            result = result.filter(r => r.date === filters.date);
        }
        if (filters.month !== undefined) {
            result = result.filter(r => r.month === filters.month);
        }
        if (filters.year !== undefined) {
            result = result.filter(r => r.year === filters.year);
        }

        // Filter by region
        if (filters.region_name !== undefined) {
            result = result.filter(r => r.region_name === filters.region_name);
        }

        // Filter by branch
        if (filters.branch_name !== undefined) {
            result = result.filter(r => r.branch_name === filters.branch_name);
        }

        // Filter by product
        if (filters.product_id !== undefined) {
            result = result.filter(r => r.product_id === filters.product_id);
        }

        // Select specific columns
        if (filters.select && Array.isArray(filters.select)) {
            result = result.map(row => {
                const selected = {};
                filters.select.forEach(col => {
                    if (row.hasOwnProperty(col)) {
                        selected[col] = row[col];
                    }
                });
                return selected;
            });
        }

        // Limit results
        if (filters.limit !== undefined) {
            result = result.slice(0, filters.limit);
        }

        return Promise.resolve({ data: result, error: null });
    },

    // Get unique values for a column
    getUniqueValues: function(column) {
        const values = new Set();
        window.MOCK_DATABASE.forEach(row => {
            if (row[column]) {
                values.add(row[column]);
            }
        });
        return Array.from(values);
    }
};

console.log('Mock data loaded:', window.MOCK_DATABASE.length, 'records');
