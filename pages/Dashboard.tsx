
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Account, Transaction, TransactionType, UserRole, Campaign, StagedTransaction } from '../types';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import Page from '../components/Page';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowSmUpIcon, ArrowSmDownIcon, ClipboardCheckIcon } from '../components/icons/Icons';

const BalanceCard: React.FC<{ account: Account }> = ({ account }) => (
    <Card className="bg-gradient-to-br from-gray-200 to-white dark:from-gray-800 dark:to-surface border border-gray-200 dark:border-gray-700 relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex justify-between items-center text-gray-500 dark:text-secondary text-sm">
                <span>{account.name}</span>
                <span>VISA</span>
            </div>
            <div className="my-4">
                <p className="text-3xl font-bold tracking-wider text-gray-900 dark:text-white">
                    {account.currency} {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
            </div>
            <div className="flex justify-between items-center text-gray-500 dark:text-secondary text-sm font-mono">
                <span>**** **** **** {account.last4}</span>
                <span>08/28</span>
            </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-accent-green to-primary rounded-full opacity-20 blur-2xl"></div>
    </Card>
);

const TransactionItem: React.FC<{ tx: Transaction }> = ({ tx }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
        <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${tx.type === TransactionType.Credit ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {tx.type === TransactionType.Credit ? <ArrowSmUpIcon /> : <ArrowSmDownIcon />}
            </div>
            <div>
                <p className="font-semibold text-gray-900 dark:text-white">{tx.description}</p>
                <p className="text-sm text-gray-500 dark:text-secondary">{new Date(tx.date).toLocaleDateString()}</p>
            </div>
        </div>
        <p className={`font-semibold ${tx.type === TransactionType.Credit ? 'text-green-500' : 'text-red-400'}`}>
            {tx.type === TransactionType.Credit ? '+' : '-'} {tx.amount.toLocaleString()}
        </p>
    </div>
);

const ReconciliationNotification: React.FC<{ count: number }> = ({ count }) => (
    <Card className="border-l-4 border-yellow-400">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-gray-800 dark:text-gray-200">
                <ClipboardCheckIcon />
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Pending Transactions</p>
                    <p className="text-sm text-gray-500 dark:text-secondary">You have {count} transaction{count > 1 ? 's' : ''} from SMS to reconcile.</p>
                </div>
            </div>
            <Link to="/reconciliation">
                <Button variant="secondary">Review</Button>
            </Link>
        </div>
    </Card>
);

const ActiveCampaigns: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => (
    <div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Active Collections</h3>
        <div className="space-y-3">
            {campaigns.map(c => (
                <Card key={c.id} className="border-l-4 border-primary">
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{c.name}</p>
                    <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Paybill No:</span> <span className="font-mono text-accent-green">{c.paybill}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Account No:</span> <span className="font-mono text-accent-green">{c.accountNumber}</span></div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { userRole } = useContext(AppContext);
    const [accounts, setAccounts] = useState<Account[] | null>(null);
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [stagedCount, setStagedCount] = useState<number>(0);
    const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch common data for all roles
            const [accountsData, transactionsData] = await Promise.all([
                api.getAccounts(),
                api.getRecentTransactions(),
            ]);
            setAccounts(accountsData);
            setTransactions(transactionsData);

            // Fetch data specific to user role
            if (userRole === UserRole.Admin || userRole === UserRole.Treasurer) {
                const staged = await api.getStagedTransactions();
                setStagedCount(staged.length);
            } else {
                setStagedCount(0);
            }

            if (userRole === UserRole.Viewer) {
                const allCampaigns = await api.getCampaigns();
                const today = new Date();
                const active = allCampaigns.filter(c => new Date(c.startDate) <= today && new Date(c.endDate) >= today);
                setActiveCampaigns(active);
            } else {
                setActiveCampaigns([]);
            }
        };

        fetchData().catch(console.error);
    }, [userRole]);

    const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) ?? 0;
    const isFinanceUser = userRole === UserRole.Admin || userRole === UserRole.Treasurer;

    return (
        <Page title="Dashboard">
            <div className="space-y-8">
                {isFinanceUser && stagedCount > 0 && <ReconciliationNotification count={stagedCount} />}
                
                {userRole === UserRole.Viewer && activeCampaigns.length > 0 && <ActiveCampaigns campaigns={activeCampaigns} />}

                <Card className="bg-gradient-to-r from-primary to-accent-green p-6">
                    <p className="text-sm text-black font-medium">Total Balance</p>
                    <p className="text-4xl font-bold text-black mt-1">
                        KSH {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Accounts</h3>
                    {accounts ? (
                        accounts.map(acc => <BalanceCard key={acc.id} account={acc} />)
                    ) : (
                        <p className="text-gray-500 dark:text-secondary">Loading accounts...</p>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Recent Transactions</h3>
                    <Card>
                        {transactions ? (
                            transactions.map(tx => <TransactionItem key={tx.id} tx={tx} />)
                        ) : (
                            <p className="text-gray-500 dark:text-secondary">Loading transactions...</p>
                        )}
                    </Card>
                </div>
            </div>
        </Page>
    );
};

export default Dashboard;