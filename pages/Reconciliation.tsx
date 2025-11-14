import React, { useState, useEffect, useCallback } from 'react';
import { StagedTransaction, Campaign, TransactionCategory } from '../types';
import api from '../services/api';
import Page from '../components/Page';
import Card from '../components/Card';
import Button from '../components/Button';

const campaignToCategory = (campaignName?: string): TransactionCategory => {
    if (!campaignName) return TransactionCategory.Other;
    if (campaignName.toLowerCase().includes('tithe')) return TransactionCategory.Tithe;
    if (campaignName.toLowerCase().includes('offering')) return TransactionCategory.Offering;
    if (campaignName.toLowerCase().includes('thanksgiving')) return TransactionCategory.Thanksgiving;
    if (campaignName.toLowerCase().includes('building')) return TransactionCategory.BuildingFund;
    if (campaignName.toLowerCase().includes('youth camp')) return TransactionCategory.YouthCamp;
    return TransactionCategory.Other;
};

const StagedTransactionCard: React.FC<{
    tx: StagedTransaction;
    onConfirm: (id: string, overrideData: { description: string; campaignName?: string; category: TransactionCategory; }) => void;
    onReject: (id: string) => void;
    isProcessing: boolean;
    campaigns: Campaign[];
}> = ({ tx, onConfirm, onReject, isProcessing, campaigns }) => {
    const [description, setDescription] = useState('');
    const [selectedCampaign, setSelectedCampaign] = useState(tx.campaignName || '');
    const [selectedCategory, setSelectedCategory] = useState<TransactionCategory>(() => campaignToCategory(tx.campaignName));
    
    useEffect(() => {
        if (!campaigns.find(c => c.name === selectedCampaign)) {
             setSelectedCategory(campaignToCategory(undefined));
             return;
        }
        const campaign = campaigns.find(c => c.name === selectedCampaign);
        setSelectedCategory(campaignToCategory(campaign?.name));
    }, [selectedCampaign, campaigns]);


    const handleConfirmClick = () => {
        onConfirm(tx.id, {
            description,
            campaignName: selectedCampaign,
            category: selectedCategory,
        });
    };

    return (
        <Card className="border border-yellow-500/30">
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-lg text-gray-900 dark:text-white">KSH {tx.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 dark:text-secondary">From: {tx.smsMessage.from}</p>
                        {tx.campaignName && (
                            <p className="text-xs text-primary mt-1">Auto-detected Fund: {tx.campaignName}</p>
                        )}
                    </div>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 font-medium px-2 py-1 rounded-full">
                        Staged
                    </span>
                </div>
                
                <div className="bg-gray-100 dark:bg-base p-3 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono whitespace-pre-wrap">{tx.smsMessage.body}</p>
                </div>

                 <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Reconciliation Details</h4>
                    <div>
                        <label htmlFor={`description-${tx.id}`} className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description (Optional)</label>
                        <input
                            id={`description-${tx.id}`}
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={tx.description}
                            className="w-full bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor={`campaign-${tx.id}`} className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Campaign</label>
                            <select
                                id={`campaign-${tx.id}`}
                                value={selectedCampaign}
                                onChange={(e) => setSelectedCampaign(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">None</option>
                                {campaigns.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                         </div>
                         <div>
                            <label htmlFor={`category-${tx.id}`} className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
                            <select
                                id={`category-${tx.id}`}
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value as TransactionCategory)}
                                className="w-full bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                            >
                                {Object.values(TransactionCategory).filter(c => c !== TransactionCategory.Expense).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="danger" onClick={() => onReject(tx.id)} disabled={isProcessing}>
                        Reject
                    </Button>
                    <Button variant="success" onClick={handleConfirmClick} disabled={isProcessing}>
                        Confirm
                    </Button>
                </div>
            </div>
        </Card>
    );
};

const Reconciliation: React.FC = () => {
    const [staged, setStaged] = useState<StagedTransaction[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchStagedTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const [data, campaignsData] = await Promise.all([
                api.getStagedTransactions(),
                api.getCampaigns()
            ]);
            setStaged(data);
            setCampaigns(campaignsData);
        } catch (error) {
            console.error("Failed to fetch reconciliation data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStagedTransactions();
    }, [fetchStagedTransactions]);

    const handleConfirm = async (id: string, overrideData: { description: string; campaignName?: string; category: TransactionCategory; }) => {
        setProcessingId(id);
        await api.confirmTransaction(id, overrideData);
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
                        campaigns={campaigns}
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
