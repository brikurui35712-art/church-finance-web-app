
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionType } from '../types';
import api from '../services/api';
import Page from '../components/Page';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowSmUpIcon, ArrowSmDownIcon } from '../components/icons/Icons';

// Modal Component
const ConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
            <Card className="w-full max-w-md mx-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 my-4">{message}</p>
                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="danger" onClick={onConfirm}>Confirm Revert</Button>
                </div>
            </Card>
        </div>
    );
};


const TransactionItem: React.FC<{ tx: Transaction; onRevert: (id: string) => void; }> = ({ tx, onRevert }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
        <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${tx.type === TransactionType.Credit ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {tx.type === TransactionType.Credit ? <ArrowSmUpIcon /> : <ArrowSmDownIcon />}
            </div>
            <div>
                <p className="font-semibold text-gray-900 dark:text-white">{tx.description}</p>
                <p className="text-sm text-gray-500 dark:text-secondary">{new Date(tx.date).toLocaleString()}
                    {tx.campaignName && ` | ${tx.campaignName}`}
                    {tx.category && ` | ${tx.category}`}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <p className={`font-semibold ${tx.type === TransactionType.Credit ? 'text-green-500' : 'text-red-400'}`}>
                {tx.type === TransactionType.Credit ? '+' : '-'} {tx.amount.toLocaleString()}
            </p>
            {tx.revertible && (
                <Button variant="secondary" onClick={() => onRevert(tx.id)} className="text-xs !py-1 !px-2">
                    Revert
                </Button>
            )}
        </div>
    </div>
);

const AllTransactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getAllCompletedTransactions();
            setTransactions(data);
        } catch (err) {
            setError("Failed to load transactions.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleRevertClick = (id: string) => {
        setSelectedTxId(id);
        setIsModalOpen(true);
    };

    const handleConfirmRevert = async () => {
        if (!selectedTxId) return;
        try {
            await api.revertTransaction(selectedTxId);
            setTransactions(prev => prev.filter(tx => tx.id !== selectedTxId));
        } catch (err) {
            console.error("Failed to revert transaction:", err);
            setError("Could not revert transaction. It may not be eligible or an error occurred.");
        } finally {
            setIsModalOpen(false);
            setSelectedTxId(null);
        }
    };

    return (
        <Page title="All Transactions">
            {error && <p className="text-red-500 bg-red-500/20 p-3 rounded-lg mb-4">{error}</p>}
            <Card>
                {loading && <p className="text-center text-gray-500 dark:text-secondary">Loading...</p>}
                {!loading && transactions.length === 0 && <p className="text-center text-gray-500 dark:text-secondary">No completed transactions found.</p>}
                {!loading && transactions.length > 0 && (
                    <div>
                        {transactions.map(tx => (
                            <TransactionItem key={tx.id} tx={tx} onRevert={handleRevertClick} />
                        ))}
                    </div>
                )}
            </Card>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmRevert}
                title="Revert Transaction"
                message="This will move the transaction back to the 'Reconciliation' queue for review. This action cannot be undone. Are you sure?"
            />
        </Page>
    );
};

export default AllTransactions;