
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { MonthlyReportData, CashBatch, Transaction, TransactionType, Theme } from '../types';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import Page from '../components/Page';
import Card from '../components/Card';
import Button from '../components/Button';

const CashBatchItem: React.FC<{ batch: CashBatch }> = ({ batch }) => {
    return (
        <Card className="mb-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{batch.notes || 'Cash Batch'}</p>
                    <p className="text-sm text-gray-500 dark:text-secondary">{new Date(batch.date).toLocaleDateString()} by {batch.createdBy}</p>
                </div>
                <p className="font-bold text-lg text-primary">KSH {batch.total.toLocaleString()}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Detailed Entries</h4>
                {batch.entries.length > 0 ? (
                    <ul className="space-y-2">
                        {batch.entries.map(entry => (
                            <li key={entry.id} className="flex justify-between items-center bg-gray-100 dark:bg-base p-2 rounded-md">
                                <span className="text-gray-600 dark:text-gray-400">{entry.member}</span>
                                <span className="font-mono text-gray-800 dark:text-gray-200">KSH {entry.amount.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-secondary text-sm">No detailed entries recorded for this batch.</p>
                )}
            </div>
        </Card>
    );
};

const COLORS = ['#34D399', '#A1F453', '#60A5FA', '#FBBF24', '#A78BFA', '#F87171'];

const Reports: React.FC = () => {
    const { theme } = useContext(AppContext);
    const [monthlyData, setMonthlyData] = useState<MonthlyReportData[] | null>(null);
    const [cashBatches, setCashBatches] = useState<CashBatch[] | null>(null);
    const [filteredCashBatches, setFilteredCashBatches] = useState<CashBatch[] | null>(null);
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    
    const isDarkMode = useMemo(() => {
        if (theme === Theme.System) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return theme === Theme.Dark;
    }, [theme]);

    const chartTheme = useMemo(() => ({
        tooltipStyle: {
            backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#4A5568' : '#E5E7EB'}`,
            color: isDarkMode ? '#E2E8F0' : '#1F2937'
        },
        axisStroke: isDarkMode ? '#A0AEC0' : '#6B7280',
        gridStroke: isDarkMode ? '#4A5568' : '#E5E7EB',
    }), [isDarkMode]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [monthly, batches, allTransactions] = await Promise.all([
                    api.getMonthlyReport(),
                    api.getCashCollectionBatches(),
                    api.getAllCompletedTransactions(),
                ]);
                setMonthlyData(monthly);
                setCashBatches(batches);
                setFilteredCashBatches(batches);
                setTransactions(allTransactions);
            } catch (err) {
                console.error("Failed to fetch report data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const pieData = useMemo(() => {
        if (!transactions) return [];
        const categoryTotals = transactions
            .filter(tx => tx.type === TransactionType.Credit && tx.category)
            .reduce((acc, tx) => {
                const category = tx.category!;
                if (!acc[category]) {
                    acc[category] = 0;
                }
                acc[category] += tx.amount;
                return acc;
            }, {} as Record<string, number>);
        
        return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
    }, [transactions]);

    const lineData = useMemo(() => {
        if (!transactions) return [];
        const monthlyTotals = transactions
            .filter(tx => tx.type === TransactionType.Credit && tx.category)
            .reduce((acc, tx) => {
                const month = new Date(tx.date).toLocaleString('default', { month: 'short', year: '2-digit' });
                const category = tx.category!;
                
                if (!acc[month]) {
                    acc[month] = { month };
                }
                if (!acc[month][category]) {
                    acc[month][category] = 0;
                }
                acc[month][category] += tx.amount;

                return acc;
            }, {} as Record<string, any>);

        return Object.values(monthlyTotals).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    }, [transactions]);

    const incomeCategories = useMemo(() => {
        if (!transactions) return [];
        return Array.from(new Set(transactions.filter(tx => tx.type === TransactionType.Credit && tx.category).map(tx => tx.category!)));
    }, [transactions]);


    const handleFilter = () => {
        if (!cashBatches) return;
        let filtered = cashBatches;

        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0); // Start of the day
            filtered = filtered.filter(batch => new Date(batch.date) >= start);
        }

        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // End of the day
            filtered = filtered.filter(batch => new Date(batch.date) <= end);
        }

        setFilteredCashBatches(filtered);
    };

    const clearFilter = () => {
        setStartDate('');
        setEndDate('');
        setFilteredCashBatches(cashBatches);
    };

    return (
        <Page title="Reports">
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Income Distribution</h3>
                        {loading && <p className="text-gray-500 dark:text-secondary text-center py-24">Loading chart data...</p>}
                        {pieData.length > 0 && (
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                            return percent > 0.05 ? (<text x={x} y={y} fill={isDarkMode ? 'white' : 'black'} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                                {`${(percent * 100).toFixed(0)}%`}
                                            </text>) : null;
                                        }}>
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={chartTheme.tooltipStyle} formatter={(value: number) => `KSH ${value.toLocaleString()}`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        {!loading && pieData.length === 0 && <p className="text-gray-500 dark:text-secondary text-center py-24">No income data available for chart.</p>}
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Income vs. Expenses</h3>
                        {loading && <p className="text-gray-500 dark:text-secondary text-center py-24">Loading chart data...</p>}
                        {monthlyData && (
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridStroke} />
                                        <XAxis dataKey="month" stroke={chartTheme.axisStroke} />
                                        <YAxis stroke={chartTheme.axisStroke} />
                                        <Tooltip contentStyle={chartTheme.tooltipStyle} formatter={(value: number) => `KSH ${value.toLocaleString()}`} />
                                        <Legend wrapperStyle={{ color: chartTheme.tooltipStyle.color }} />
                                        <Bar dataKey="income" fill="#34D399" name="Income" />
                                        <Bar dataKey="expenses" fill="#F87171" name="Expenses" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        {!loading && !monthlyData && <p className="text-red-400 text-center py-24">Could not load monthly report data.</p>}
                    </Card>
                </div>
                 <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Income Trends by Category</h3>
                     {loading && <p className="text-gray-500 dark:text-secondary text-center py-24">Loading chart data...</p>}
                     {lineData.length > 0 && (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <LineChart data={lineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridStroke} />
                                    <XAxis dataKey="month" stroke={chartTheme.axisStroke} />
                                    <YAxis stroke={chartTheme.axisStroke} />
                                    <Tooltip contentStyle={chartTheme.tooltipStyle} formatter={(value: number) => `KSH ${value.toLocaleString()}`} />
                                    <Legend />
                                    {incomeCategories.map((category, index) => (
                                        <Line key={category} type="monotone" dataKey={category} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    {!loading && lineData.length === 0 && <p className="text-gray-500 dark:text-secondary text-center py-24">No trend data available.</p>}
                </Card>

                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cash Collection Batches</h3>
                     <Card className="mb-4">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="flex-grow">
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                                <input 
                                    type="date" 
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div className="flex-grow">
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                                <input 
                                    type="date" 
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleFilter}>Filter</Button>
                                <Button variant="secondary" onClick={clearFilter}>Clear</Button>
                            </div>
                        </div>
                    </Card>

                    {loading && <p className="text-gray-500 dark:text-secondary">Loading cash collections...</p>}
                    {filteredCashBatches && filteredCashBatches.length > 0 ? (
                        filteredCashBatches.map(batch => <CashBatchItem key={batch.id} batch={batch} />)
                    ) : (
                        !loading && <Card><p className="text-gray-500 dark:text-secondary text-center">No cash collection batches found for the selected criteria.</p></Card>
                    )}
                </div>
            </div>
        </Page>
    );
};

export default Reports;