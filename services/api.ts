
import { Account, Transaction, TransactionType, TransactionStatus, StagedTransaction, Expense, ExpenseStatus, MonthlyReportData, CashBatch, CashEntry, Budget, BudgetItem, Campaign, TransactionCategory } from '../types';

const KSH = 'KSH';

const accounts: Account[] = [
    { id: 'acc1', name: 'Offering Account', balance: 513890.50, currency: KSH, last4: '4285' },
    { id: 'acc2', name: 'Tithe Account', balance: 124567.80, currency: KSH, last4: '1121' },
    { id: 'acc3', name: 'Building Fund', balance: 2350000.00, currency: KSH, last4: '9876' },
];

let transactions: Transaction[] = [
    { id: 'txn1', date: '2024-07-28T10:30:00Z', description: 'Tithe - J. Doe', amount: 5000, type: TransactionType.Credit, status: TransactionStatus.Completed, category: TransactionCategory.Tithe },
    { id: 'txn2', date: '2024-07-28T09:15:00Z', description: 'Sunday Offering', amount: 35750, type: TransactionType.Credit, status: TransactionStatus.Completed, campaignName: 'Sunday Offering', category: TransactionCategory.Offering },
    { id: 'txn3', date: '2024-07-27T14:00:00Z', description: 'Catering Services', amount: 15000, type: TransactionType.Debit, status: TransactionStatus.Completed, category: TransactionCategory.Expense },
    { id: 'txn4', date: '2024-07-26T11:45:00Z', description: 'MPesa Deposit', amount: 1200, type: TransactionType.Credit, status: TransactionStatus.Completed, campaignName: 'Youth Camp Fundraiser', category: TransactionCategory.YouthCamp },
    { id: 'txn5', date: '2024-07-25T18:20:00Z', description: 'Utility Bill', amount: 8500, type: TransactionType.Debit, status: TransactionStatus.Completed, category: TransactionCategory.Expense },
    { id: 'txn6', date: '2024-07-21T09:20:00Z', description: 'Thanksgiving - The Smiths', amount: 10000, type: TransactionType.Credit, status: TransactionStatus.Completed, category: TransactionCategory.Thanksgiving },
    { id: 'txn7', date: '2024-06-30T10:35:00Z', description: 'Tithe - A. User', amount: 7500, type: TransactionType.Credit, status: TransactionStatus.Completed, category: TransactionCategory.Tithe },
    { id: 'txn8', date: '2024-06-23T09:10:00Z', description: 'Sunday Offering', amount: 32500, type: TransactionType.Credit, status: TransactionStatus.Completed, campaignName: 'Sunday Offering', category: TransactionCategory.Offering },
    { id: 'txn9', date: '2024-06-15T11:00:00Z', description: 'Building Fund Donation', amount: 50000, type: TransactionType.Credit, status: TransactionStatus.Completed, campaignName: 'Building Fund', category: TransactionCategory.BuildingFund },
    { id: 'txn10', date: '2024-05-26T09:15:00Z', description: 'Sunday Offering', amount: 31000, type: TransactionType.Credit, status: TransactionStatus.Completed, campaignName: 'Sunday Offering', category: TransactionCategory.Offering },
    { id: 'txn11', date: '2024-05-19T10:40:00Z', description: 'Tithe - B. Simpson', amount: 3000, type: TransactionType.Credit, status: TransactionStatus.Completed, category: TransactionCategory.Tithe },
    { id: 'txn12', date: '2024-04-28T09:00:00Z', description: 'Sunday Offering', amount: 29000, type: TransactionType.Credit, status: TransactionStatus.Completed, campaignName: 'Sunday Offering', category: TransactionCategory.Offering },
    { id: 'txn13', date: '2024-04-15T10:45:00Z', description: 'Tithe - C. Kent', amount: 4500, type: TransactionType.Credit, status: TransactionStatus.Completed, category: TransactionCategory.Tithe },
];

let stagedTransactions: StagedTransaction[] = [
    {
        id: 'stg1', date: new Date().toISOString(), description: 'MPesa Payment', amount: 2500, type: TransactionType.Credit, status: TransactionStatus.Staged,
        smsMessage: { id: 'sms1', from: '+254712345678', body: 'QWERTY123 Confirmed. Ksh2,500.00 sent to FAITH CHURCH for account YOUTHCAMP from JOHN DOE on 28/7/24. New M-PESA balance is Ksh10,500.00.', receivedAt: new Date().toISOString() }
    },
    {
        id: 'stg2', date: new Date().toISOString(), description: 'Bank Deposit', amount: 10000, type: TransactionType.Credit, status: TransactionStatus.Staged,
        smsMessage: { id: 'sms2', from: 'EQUITYBANK', body: 'Deposit of KES 10,000 to A/C 0123... for account OFFERING received. Ref: XYZ789. Thank you.', receivedAt: new Date().toISOString() }
    },
     {
        id: 'stg3', date: new Date().toISOString(), description: 'MPesa Payment', amount: 500, type: TransactionType.Credit, status: TransactionStatus.Staged,
        smsMessage: { id: 'sms3', from: '+254700000000', body: 'ASDFG567 Confirmed. Ksh500.00 sent to FAITH CHURCH for account YOUTHCAMP from JANE SMITH on 28/7/24. New M-PESA balance is Ksh1,200.00.', receivedAt: new Date().toISOString() }
    },
];

const expenses: Expense[] = [
    { id: 'exp1', date: '2024-07-25', submittedBy: 'P. Smith', description: 'New sound system microphones', amount: 25000, status: ExpenseStatus.Pending },
    { id: 'exp2', date: '2024-07-22', submittedBy: 'A. Johnson', description: 'Sunday school materials', amount: 4500, status: ExpenseStatus.Approved },
    { id: 'exp3', date: '2024-07-20', submittedBy: 'P. Smith', description: 'Office stationery', amount: 2000, status: ExpenseStatus.Pending },
];

const monthlyReports: MonthlyReportData[] = [
    { month: 'Jan', income: 450000, expenses: 120000 },
    { month: 'Feb', income: 480000, expenses: 150000 },
    { month: 'Mar', income: 520000, expenses: 135000 },
    { month: 'Apr', income: 490000, expenses: 160000 },
    { month: 'May', income: 550000, expenses: 145000 },
    { month: 'Jun', income: 600000, expenses: 180000 },
];

const cashBatches: CashBatch[] = [
    { 
        id: 'B-1690550400000', 
        date: '2024-07-28T12:00:00Z', 
        notes: 'Sunday Service Collection', 
        total: 4500, 
        entries: [
            { id: 1, member: 'Mary Jane', amount: 2000 },
            { id: 2, member: 'Peter Parker', amount: 1500 },
            { id: 3, member: 'Anonymous', amount: 1000 },
        ],
        createdBy: 'Treasurer'
    },
    { 
        id: 'B-1690464000000', 
        date: '2024-07-27T10:00:00Z', 
        notes: 'Youth Fundraising Event', 
        total: 8250, 
        entries: [
            { id: 1, member: 'Youth Group Donation', amount: 5000 },
            { id: 2, member: 'John Doe', amount: 3250 },
        ],
        createdBy: 'Treasurer'
    }
];

const budgets: Budget[] = [
    { 
        id: 'bgt1', 
        description: 'Youth Camp Catering', 
        plannedDate: '2024-08-15',
        items: [
            { id: 'i1', name: 'Lunch Supplies', price: 40000 },
            { id: 'i2', name: 'Snacks & Drinks', price: 25000 },
            { id: 'i3', name: 'Cooking Staff', price: 20000 },
        ]
    },
    { 
        id: 'bgt2', 
        description: 'Community Outreach Program', 
        plannedDate: '2024-09-05',
        items: [
            { id: 'i4', name: 'Flyers and Posters', price: 10000 },
            { id: 'i5', name: 'Food Donations', price: 30000 },
            { id: 'i6', name: 'Volunteer T-shirts', price: 10000 },
        ]
    },
    { 
        id: 'bgt3', 
        description: 'Pastoral Staff Salaries', 
        plannedDate: '2024-08-30',
        items: [
            { id: 'i7', name: 'Senior Pastor Salary', price: 150000 },
            { id: 'i8', name: 'Associate Pastor Salary', price: 100000 },
        ]
    },
];

let campaigns: Campaign[] = [
    { id: 'camp1', name: 'Sunday Offering', paybill: '123456', accountNumber: 'OFFERING', startDate: '2024-01-01', endDate: '2024-12-31' },
    { id: 'camp2', name: 'Youth Camp Fundraiser', paybill: '123456', accountNumber: 'YOUTHCAMP', startDate: '2024-07-20', endDate: '2024-08-10' },
    { id: 'camp3', name: 'Building Fund', paybill: '123456', accountNumber: 'BUILDING', startDate: '2024-01-01', endDate: '2025-12-31' },
];

// MOCK SMS PARSER
const parseSmsForCampaign = (smsBody: string): string | undefined => {
    const allCampaigns = campaigns;
    for (const campaign of allCampaigns) {
        // Simple regex to find "account [ACCOUNT_NUMBER]"
        const regex = new RegExp(`account\\s+${campaign.accountNumber}`, 'i');
        if (regex.test(smsBody)) {
            return campaign.name;
        }
    }
    return undefined;
};

const campaignToCategory = (campaignName?: string): TransactionCategory => {
    if (!campaignName) return TransactionCategory.Other;
    if (campaignName.toLowerCase().includes('tithe')) return TransactionCategory.Tithe;
    if (campaignName.toLowerCase().includes('offering')) return TransactionCategory.Offering;
    if (campaignName.toLowerCase().includes('thanksgiving')) return TransactionCategory.Thanksgiving;
    if (campaignName.toLowerCase().includes('building')) return TransactionCategory.BuildingFund;
    if (campaignName.toLowerCase().includes('youth camp')) return TransactionCategory.YouthCamp;
    return TransactionCategory.Other;
};


const api = {
    getAccounts: (): Promise<Account[]> => Promise.resolve(accounts),
    getRecentTransactions: (): Promise<Transaction[]> => Promise.resolve(transactions.slice(0, 5)),
    getAllCompletedTransactions: (): Promise<Transaction[]> => Promise.resolve(transactions.filter(t => t.status === TransactionStatus.Completed)),
    getStagedTransactions: (): Promise<StagedTransaction[]> => {
        const processed = stagedTransactions
            .filter(t => t.status === TransactionStatus.Staged)
            .map(t => ({
                ...t,
                campaignName: parseSmsForCampaign(t.smsMessage.body)
            }));
        return Promise.resolve(processed);
    },
    confirmTransaction: (id: string, overrideData?: { description?: string, campaignName?: string, category?: TransactionCategory }): Promise<{ success: true }> => {
        const index = stagedTransactions.findIndex(t => t.id === id);
        if (index > -1) {
            const stagedTx = stagedTransactions[index];
            const autoCampaignName = parseSmsForCampaign(stagedTx.smsMessage.body);

            const finalCampaignName = overrideData?.campaignName !== undefined ? (overrideData.campaignName || undefined) : autoCampaignName;
            const finalCategory = overrideData?.category ?? campaignToCategory(finalCampaignName);
            const finalDescription = (overrideData?.description && overrideData.description.trim() !== '') ? overrideData.description : stagedTx.description;

            const confirmedTx: Transaction = {
                ...(stagedTx as Omit<StagedTransaction, 'smsMessage'>),
                status: TransactionStatus.Completed,
                campaignName: finalCampaignName,
                category: finalCategory,
                description: finalDescription,
            };
            transactions.unshift(confirmedTx); // Add to completed transactions
            stagedTransactions.splice(index, 1); // Remove from staged
        }
        return Promise.resolve({ success: true });
    },
    rejectTransaction: (id: string): Promise<{ success: true }> => {
        const index = stagedTransactions.findIndex(t => t.id === id);
        if (index > -1) stagedTransactions.splice(index, 1); // Just remove for this mock
        return Promise.resolve({ success: true });
    },
    getExpensesToApprove: (): Promise<Expense[]> => Promise.resolve(expenses.filter(e => e.status === ExpenseStatus.Pending)),
    approveExpense: (id: string): Promise<{ success: true }> => {
        const index = expenses.findIndex(e => e.id === id);
        if (index > -1) expenses[index].status = ExpenseStatus.Approved;
        return Promise.resolve({ success: true });
    },
    rejectExpense: (id: string): Promise<{ success: true }> => {
        const index = expenses.findIndex(e => e.id === id);
        if (index > -1) expenses[index].status = ExpenseStatus.Rejected;
        return Promise.resolve({ success: true });
    },
    createCashBatch: (batchData: { notes: string; date: string; total: number; entries: CashEntry[] }): Promise<{ success: true, batchId: string }> => {
        const newBatchId = `B-${Date.now()}`;
        const newBatch: CashBatch = {
            id: newBatchId,
            date: batchData.date,
            notes: batchData.notes,
            total: batchData.total,
            entries: batchData.entries.map((e, i) => ({ ...e, id: `${newBatchId}-${i}` })),
            createdBy: 'Treasurer' // In a real app this would come from the session
        };
        cashBatches.unshift(newBatch);
        // Also create a transaction for this
        transactions.unshift({
            id: `txn-${Date.now()}`,
            date: batchData.date,
            description: batchData.notes || 'Cash Collection',
            amount: batchData.total,
            type: TransactionType.Credit,
            status: TransactionStatus.Completed,
            category: TransactionCategory.Offering, // Assume cash is offering
        });
        return Promise.resolve({ success: true, batchId: newBatch.id });
    },
    getMonthlyReport: (): Promise<MonthlyReportData[]> => Promise.resolve(monthlyReports),
    getCashCollectionBatches: (): Promise<CashBatch[]> => Promise.resolve(cashBatches),

    // Budget API
    getBudgets: (): Promise<Budget[]> => Promise.resolve(JSON.parse(JSON.stringify(budgets))),
    createBudget: (item: Omit<Budget, 'id'>): Promise<Budget> => {
        const newBudgetItem: Budget = { 
            ...item, 
            id: `bgt${Date.now()}`,
            items: item.items.map((subItem, index) => ({...subItem, id: `i${Date.now()}-${index}`}))
        };
        budgets.push(newBudgetItem);
        return Promise.resolve(newBudgetItem);
    },
    deleteBudget: (id: string): Promise<{ success: true }> => {
        const index = budgets.findIndex(b => b.id === id);
        if (index > -1) budgets.splice(index, 1);
        return Promise.resolve({ success: true });
    },
    addBudgetItem: (budgetId: string, item: Omit<BudgetItem, 'id'>): Promise<BudgetItem> => {
        const budget = budgets.find(b => b.id === budgetId);
        if (budget) {
            const newItem: BudgetItem = { ...item, id: `i${Date.now()}` };
            budget.items.push(newItem);
            return Promise.resolve(newItem);
        } else {
            return Promise.reject(new Error("Budget not found"));
        }
    },
    deleteBudgetItem: (budgetId: string, itemId: string): Promise<{ success: true }> => {
        const budget = budgets.find(b => b.id === budgetId);
        if (budget) {
            const itemIndex = budget.items.findIndex(i => i.id === itemId);
            if (itemIndex > -1) {
                budget.items.splice(itemIndex, 1);
                return Promise.resolve({ success: true });
            } else {
                return Promise.reject(new Error("Item not found"));
            }
        } else {
            return Promise.reject(new Error("Budget not found"));
        }
    },

    // Campaigns API
    getCampaigns: (): Promise<Campaign[]> => Promise.resolve(JSON.parse(JSON.stringify(campaigns))),
    createCampaign: (item: Omit<Campaign, 'id'>): Promise<Campaign> => {
        const newCampaign: Campaign = { ...item, id: `camp${Date.now()}`};
        campaigns.push(newCampaign);
        return Promise.resolve(newCampaign);
    },
    deleteCampaign: (id: string): Promise<{ success: true }> => {
        const index = campaigns.findIndex(c => c.id === id);
        if (index > -1) campaigns.splice(index, 1);
        return Promise.resolve({ success: true });
    },
};

export default api;