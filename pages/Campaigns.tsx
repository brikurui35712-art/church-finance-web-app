
import React, { useState, useEffect } from 'react';
import { Campaign } from '../types';
import api from '../services/api';
import Page from '../components/Page';
import Card from '../components/Card';
import Button from '../components/Button';
import { TrashIcon, PlusIcon } from '../components/icons/Icons';

const today = new Date().toISOString().split('T')[0];

const AddCampaignForm: React.FC<{ onAdd: (campaign: Omit<Campaign, 'id'>) => void }> = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [paybill, setPaybill] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !paybill || !accountNumber || !startDate || !endDate) return;
        setIsSubmitting(true);
        await onAdd({ name, paybill, accountNumber, startDate, endDate });
        setName('');
        setPaybill('');
        setAccountNumber('');
        setStartDate(today);
        setEndDate('');
        setIsSubmitting(false);
    };

    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Campaign</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Campaign Name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary" />
                <div className="flex gap-4">
                    <input type="text" placeholder="Paybill Number" value={paybill} onChange={e => setPaybill(e.target.value)} required className="w-1/2 bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary" />
                    <input type="text" placeholder="Account Number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required className="w-1/2 bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary" />
                </div>
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="text-xs text-gray-500 dark:text-gray-400">Start Date</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary" />
                    </div>
                    <div className="w-1/2">
                        <label className="text-xs text-gray-500 dark:text-gray-400">End Date</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary" />
                    </div>
                </div>
                <Button type="submit" isLoading={isSubmitting} className="w-full"><PlusIcon /> Create Campaign</Button>
            </form>
        </Card>
    );
};

const CampaignItem: React.FC<{ campaign: Campaign; onDelete: (id: string) => void }> = ({ campaign, onDelete }) => {
    const isActive = new Date() >= new Date(campaign.startDate) && new Date() <= new Date(campaign.endDate);
    return (
        <Card className="flex justify-between items-center">
            <div>
                <div className="flex items-center gap-2">
                     <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                    <p className="font-semibold text-gray-900 dark:text-white">{campaign.name}</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-secondary font-mono">Paybill: {campaign.paybill}, Acc: {campaign.accountNumber}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </p>
            </div>
            <Button variant="danger" onClick={() => onDelete(campaign.id)} className="px-2 py-1"><TrashIcon /></Button>
        </Card>
    )
}

const Campaigns: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const data = await api.getCampaigns();
            setCampaigns(data);
        } catch (error) {
            console.error("Failed to fetch campaigns", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleAddCampaign = async (newCampaignData: Omit<Campaign, 'id'>) => {
        try {
            const newCampaign = await api.createCampaign(newCampaignData);
            setCampaigns(prev => [newCampaign, ...prev]);
        } catch (error) {
            console.error("Failed to create campaign", error);
        }
    };

    const handleDeleteCampaign = async (id: string) => {
        try {
            await api.deleteCampaign(id);
            setCampaigns(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error("Failed to delete campaign", error);
        }
    };

    return (
        <Page title="Campaign Management">
            <div className="space-y-8">
                <AddCampaignForm onAdd={handleAddCampaign} />
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Existing Campaigns</h3>
                    <div className="space-y-4">
                        {loading && <p className="text-gray-500 dark:text-secondary">Loading campaigns...</p>}
                        {!loading && campaigns.length === 0 && (
                            <Card>
                                <p className="text-center text-gray-500 dark:text-secondary">No campaigns have been created yet.</p>
                            </Card>
                        )}
                        {campaigns.map(c => <CampaignItem key={c.id} campaign={c} onDelete={handleDeleteCampaign} />)}
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default Campaigns;