
import React, { useState, useEffect, useCallback } from 'react';
import { StagedTransaction } from '../types';
import api from '../services/api';
import Page from '../components/Page';
import Card from '../components/Card';
import Button from '../components/Button';

const StagedTransactionCard: React.FC<{ tx: StagedTransaction; onConfirm: (id: string) => void; onReject: (id: string) => void; isProcessing: boolean }> = ({ tx, onConfirm, onReject, isProcessing }) => (
    <Card className="border border-yellow-500/30">
        <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">KSH {tx.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 dark:text-secondary">From: {tx.smsMessage.from}</p>
                    {tx.campaignName && (
                        <p className="text-xs text-primary mt-1">Fund: {tx.campaignName}</p>
                    )}
                </div>
                <span className="text-xs bg-yellow-500/20 text-yellow-400 font-medium px-2 py-1 rounded-full">
                    Staged
                </span>
            </div>
            
            <div className="bg-gray-100 dark:bg-base p-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono whitespace-pre-wrap">{tx.smsMessage.body}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button variant="danger" onClick={() => onReject(tx.id)} disabled={isProcessing}>
                    Reject
                </Button>
                <Button variant="success" onClick={() => onConfirm(tx.id)} disabled={isProcessing}>
                    Confirm
                </Button>
            </div>
        </div>
    </Card>
);

const Reconciliation: React.FC = () => {
    const [staged, setStaged] = useState<StagedTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchStagedTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getStagedTransactions();
            setStaged(data);
        } catch (error) {
            console.error("Failed to fetch staged transactions", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStagedTransactions();
    }, [fetchStagedTransactions]);

    const handleConfirm = async (id: string) => {
        setProcessingId(id);
        await api.confirmTransaction(id);
        setStaged(prev => prev.filter(tx => tx.id !== id));
        setProcessingId(null);
    };
    
    const handleReject = async (id: string) => {
        setProcessingId(id);
        await api.rejectTransaction(id);
        setStaged(prev => prev.filter(tx => tx.id !== id));
        setProcessingId(null);
    };

    return (
        <Page title="Reconcile Transactions">
            <div className="space-y-4">
                {loading && <p className="text-gray-500 dark:text-secondary">Loading staged transactions...</p>}
                {!loading && staged.length === 0 && (
                    <Card>
                        <p className="text-center text-gray-500 dark:text-secondary">No transactions to reconcile.</p>
                    </Card>
                )}
                {staged.map(tx => (
                    <StagedTransactionCard 
                        key={tx.id} 
                        tx={tx} 
                        onConfirm={handleConfirm} 
                        onReject={handleReject}
                        isProcessing={processingId === tx.id}
                    />
                ))}
            </div>
        </Page>
    );
};

export default Reconciliation;