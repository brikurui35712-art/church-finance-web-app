
import React, { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseStatus } from '../types';
import api from '../services/api';
import Page from '../components/Page';
import Card from '../components/Card';
import Button from '../components/Button';

const ExpenseItem: React.FC<{ expense: Expense; onApprove: (id: string) => void; onReject: (id: string) => void; isProcessing: boolean }> = ({ expense, onApprove, onReject, isProcessing }) => (
    <Card className="border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{expense.description}</p>
                    <p className="text-sm text-gray-500 dark:text-secondary">
                        Submitted by {expense.submittedBy} on {new Date(expense.date).toLocaleDateString()}
                    </p>
                </div>
                <p className="font-bold text-lg text-primary">KSH {expense.amount.toLocaleString()}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button variant="danger" onClick={() => onReject(expense.id)} disabled={isProcessing}>
                    Reject
                </Button>
                <Button variant="success" onClick={() => onApprove(expense.id)} disabled={isProcessing}>
                    Approve
                </Button>
            </div>
        </div>
    </Card>
);

const Expenses: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getExpensesToApprove();
            setExpenses(data);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        await api.approveExpense(id);
        setExpenses(prev => prev.filter(e => e.id !== id));
        setProcessingId(null);
    };

    const handleReject = async (id: string) => {
        setProcessingId(id);
        await api.rejectExpense(id);
        setExpenses(prev => prev.filter(e => e.id !== id));
        setProcessingId(null);
    };

    return (
        <Page title="Expense Approval">
            <div className="space-y-4">
                {loading && <p className="text-gray-500 dark:text-secondary">Loading expenses for approval...</p>}
                {!loading && expenses.length === 0 && (
                    <Card>
                        <p className="text-center text-gray-500 dark:text-secondary">No pending expenses to approve.</p>
                    </Card>
                )}
                {expenses.map(exp => (
                    <ExpenseItem
                        key={exp.id}
                        expense={exp}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        isProcessing={processingId === exp.id}
                    />
                ))}
            </div>
        </Page>
    );
};

export default Expenses;