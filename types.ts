
export enum UserRole {
    Admin = 'Admin',
    Finance = 'Finance',
    Viewer = 'Viewer',
}

export enum Theme {
    Light = 'Light',
    Dark = 'Dark',
    System = 'System',
}

export interface Account {
    id: string;
    name: string;
    balance: number;
    currency: string;
    last4: string;
}

export enum TransactionType {
    Credit = 'Credit',
    Debit = 'Debit',
}

export enum TransactionStatus {
    Completed = 'Completed',
    Staged = 'Staged',
    Rejected = 'Rejected',
}

export enum TransactionCategory {
    Tithe = 'Tithe',
    Offering = 'Offering',
    Thanksgiving = 'Thanksgiving',
    BuildingFund = 'Building Fund',
    YouthCamp = 'Youth Camp',
    Other = 'Other',
    Expense = 'Expense',
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    campaignName?: string;
    category?: TransactionCategory;
}

export interface StagedTransaction extends Transaction {
    smsMessage: SmsMessage;
}

export interface SmsMessage {
    id: string;
    from: string;
    body: string;
    receivedAt: string;
}

export enum ExpenseStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
}

export interface Expense {
    id: string;
    date: string;
    submittedBy: string;
    description: string;
    amount: number;
    status: ExpenseStatus;
}

export interface MonthlyReportData {
    month: string;
    income: number;
    expenses: number;
}

export interface CashEntry {
    id: number | string;
    member: string;
    amount: number;
}

export interface CashBatch {
    id: string;
    date: string;
    notes: string;
    total: number;
    entries: CashEntry[];
    createdBy: string;
}

export interface BudgetItem {
    id: string;
    name: string;
    price: number;
}

export interface Budget {
    id: string;
    description: string;
    plannedDate: string;
    items: BudgetItem[];
}

export interface Campaign {
    id: string;
    name: string;
    paybill: string;
    accountNumber: string;
    startDate: string;
    endDate: string;
}