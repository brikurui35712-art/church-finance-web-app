
import React, { useState } from 'react';
import Page from '../components/Page';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../services/api';
import { CashEntry } from '../types';

const today = new Date().toISOString().split('T')[0];

const CashCollections: React.FC = () => {
    const [entries, setEntries] = useState<CashEntry[]>([{ id: Date.now(), member: '', amount: 0 }]);
    const [batchNotes, setBatchNotes] = useState('');
    const [batchDate, setBatchDate] = useState(today);
    const [isLoading, setIsLoading] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleEntryChange = (id: number | string, field: keyof Omit<CashEntry, 'id'>, value: string | number) => {
        setEntries(entries.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
    };

    const addEntry = () => {
        setEntries([...entries, { id: Date.now(), member: '', amount: 0 }]);
    };

    const removeEntry = (id: number | string) => {
        setEntries(entries.filter(entry => entry.id !== id));
    };

    const totalAmount = entries.reduce((sum, entry) => sum + Number(entry.amount), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmissionStatus('idle');
        try {
            const batchData = {
                notes: batchNotes,
                date: new Date(batchDate).toISOString(),
                total: totalAmount,
                entries: entries.filter(e => e.amount > 0 && e.member.trim() !== ''),
            };
            await api.createCashBatch(batchData);
            setSubmissionStatus('success');
            // Reset form
            setEntries([{ id: Date.now(), member: '', amount: 0 }]);
            setBatchNotes('');
            setBatchDate(today);
        } catch (error) {
            setSubmissionStatus('error');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Page title="Cash Collections">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Batch</h3>
                        <div>
                            <label htmlFor="batchDate" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Batch Date
                            </label>
                            <input
                                type="date"
                                id="batchDate"
                                value={batchDate}
                                onChange={(e) => setBatchDate(e.target.value)}
                                required
                                className="w-full bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="batchNotes" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Batch Notes (Optional)
                            </label>
                            <input
                                type="text"
                                id="batchNotes"
                                value={batchNotes}
                                onChange={(e) => setBatchNotes(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                placeholder="e.g., Sunday Service Collection"
                            />
                        </div>
                        <div className="flex justify-between items-center bg-gray-100 dark:bg-base p-3 rounded-lg">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Total Amount:</span>
                            <span className="font-bold text-xl text-primary">KSH {totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Entries</h3>
                        {entries.map((entry, index) => (
                            <div key={entry.id} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-base rounded-md">
                                <input
                                    type="text"
                                    placeholder="Member Name/ID"
                                    value={entry.member}
                                    onChange={(e) => handleEntryChange(entry.id, 'member', e.target.value)}
                                    className="flex-grow bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 focus:ring-primary focus:border-primary"
                                />
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={entry.amount || ''}
                                    onChange={(e) => handleEntryChange(entry.id, 'amount', parseFloat(e.target.value) || 0)}
                                    className="w-28 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 focus:ring-primary focus:border-primary"
                                />
                                <button type="button" onClick={() => removeEntry(entry.id)} className="text-red-500 hover:text-red-400 p-1" disabled={entries.length === 1}>
                                    &times;
                                </button>
                            </div>
                        ))}
                        <Button type="button" variant="secondary" onClick={addEntry}>
                            Add Entry
                        </Button>
                    </div>
                </Card>

                <div className="flex flex-col items-center">
                    <Button type="submit" isLoading={isLoading} disabled={totalAmount === 0}>
                        Submit Batch
                    </Button>
                    {submissionStatus === 'success' && <p className="text-green-400 mt-2">Batch submitted successfully!</p>}
                    {submissionStatus === 'error' && <p className="text-red-400 mt-2">Failed to submit batch. Please try again.</p>}
                </div>
            </form>
        </Page>
    );
};

export default CashCollections;