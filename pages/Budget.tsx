
import React, { useState, useEffect, useMemo } from 'react';
import { Budget, Account, BudgetItem } from '../types';
import api from '../services/api';
import Page from '../components/Page';
import Card from '../components/Card';
import Button from '../components/Button';
import { TrashIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon } from '../components/icons/Icons';

const today = new Date().toISOString().split('T')[0];

const AddBudgetForm: React.FC<{ onAddBudget: (newBudget: Omit<Budget, 'id' | 'items'> & { items: Omit<BudgetItem, 'id'>[] }) => void; }> = ({ onAddBudget }) => {
    const [description, setDescription] = useState('');
    const [plannedDate, setPlannedDate] = useState(today);
    const [items, setItems] = useState<Omit<BudgetItem, 'id' | 'price'>[]>([{ name: '', quantity: 1, unitPrice: 0, notes: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleItemChange = (index: number, field: 'name' | 'quantity' | 'unitPrice' | 'notes', value: string) => {
        const newItems = [...items];
        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index][field] = parseFloat(value) || 0;
        } else {
            newItems[index][field] = value;
        }
        setItems(newItems);
    };

    const addItemRow = () => setItems([...items, { name: '', quantity: 1, unitPrice: 0, notes: '' }]);
    const removeItemRow = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validItems = items.filter(i => i.name.trim() && i.unitPrice > 0);
        if (!description.trim() || !plannedDate || validItems.length === 0) return;
        
        setIsSubmitting(true);
        const processedItems = validItems.map(i => ({
            ...i,
            price: i.quantity * i.unitPrice
        }));

        await onAddBudget({ description, plannedDate, items: processedItems });
        
        setDescription('');
        setPlannedDate(today);
        setItems([{ name: '', quantity: 1, unitPrice: 0, notes: '' }]);
        setIsSubmitting(false);
    };

    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Budget Plan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Budget Plan Description"
                    required
                    className="w-full bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                />
                <input
                    type="date"
                    value={plannedDate}
                    onChange={(e) => setPlannedDate(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                />
                
                <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between px-2">
                         <h4 className="font-semibold text-gray-700 dark:text-gray-300">Items</h4>
                         <div className="grid grid-cols-12 gap-2 w-2/3 text-xs text-gray-500 dark:text-secondary font-medium text-center">
                             <span className="col-span-2">Qty</span>
                             <span className="col-span-4">Unit Cost</span>
                             <span className="col-span-5">Total</span>
                         </div>
                    </div>
                   
                    {items.map((item, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-base p-2 rounded-md border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                <input
                                    type="text" placeholder="Item Name" value={item.name}
                                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                    className="flex-grow bg-white dark:bg-surface border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:ring-primary focus:border-primary"
                                />
                                <input
                                    type="text" placeholder="Notes (Optional)" value={item.notes || ''}
                                    onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                                    className="flex-grow bg-white dark:bg-surface border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:ring-primary focus:border-primary text-sm"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-grow"></div>
                                <div className="w-full sm:w-2/3 grid grid-cols-12 gap-2 items-center">
                                    <input
                                        type="number" min="1" placeholder="Qty" value={item.quantity || ''}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        className="col-span-2 bg-white dark:bg-surface border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:ring-primary focus:border-primary text-center"
                                    />
                                    <input
                                        type="number" placeholder="Unit Price" value={item.unitPrice || ''}
                                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                        className="col-span-4 bg-white dark:bg-surface border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:ring-primary focus:border-primary"
                                    />
                                    <span className="col-span-5 text-right text-sm font-mono text-gray-700 dark:text-gray-300">
                                        KSH {((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}
                                    </span>
                                    <div className="col-span-1 flex justify-end">
                                        <button type="button" onClick={() => removeItemRow(index)} className="text-red-500 hover:text-red-400 p-1" disabled={items.length === 1}>
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" onClick={addItemRow} className="text-sm py-1 px-2"><PlusIcon /> Add Item</Button>
                </div>

                <Button type="submit" isLoading={isSubmitting} className="w-full">Add Budget Plan</Button>
            </form>
        </Card>
    );
};


const BudgetPlan: React.FC<{
    budget: Budget;
    onDelete: (id: string) => void;
    onItemAdd: (budgetId: string, item: Omit<BudgetItem, 'id'>) => void;
    onItemDelete: (budgetId: string, itemId: string) => void;
}> = ({ budget, onDelete, onItemAdd, onItemDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState(1);
    const [newItemUnitPrice, setNewItemUnitPrice] = useState('');
    const [newItemNotes, setNewItemNotes] = useState('');

    const totalAmount = useMemo(() => budget.items.reduce((sum, item) => sum + item.price, 0), [budget.items]);

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        const unitPrice = parseFloat(newItemUnitPrice);
        const quantity = newItemQuantity;
        if (!newItemName.trim() || !unitPrice || unitPrice <= 0 || quantity <= 0) return;
        
        onItemAdd(budget.id, { 
            name: newItemName, 
            quantity, 
            unitPrice, 
            price: quantity * unitPrice,
            notes: newItemNotes
        });
        
        setNewItemName('');
        setNewItemQuantity(1);
        setNewItemUnitPrice('');
        setNewItemNotes('');
    };

    return (
        <Card>
            <div className="flex items-center justify-between">
                <div className="flex-grow cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    <p className="font-semibold text-gray-900 dark:text-white">{budget.description}</p>
                    <p className="text-sm text-gray-500 dark:text-secondary">{new Date(budget.plannedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="font-bold text-lg text-gray-900 dark:text-white">KSH {totalAmount.toLocaleString()}</p>
                    <Button variant="danger" onClick={() => onDelete(budget.id)} className="px-2 py-1 text-xs !h-auto">
                        <TrashIcon />
                    </Button>
                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 text-gray-500 dark:text-secondary hover:text-gray-900 dark:hover:text-white">
                        {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3 animate-fade-in">
                     <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 dark:text-secondary px-2 uppercase tracking-wider">
                        <span className="col-span-5">Item</span>
                        <span className="col-span-2 text-center">Qty</span>
                        <span className="col-span-2 text-right">Unit</span>
                        <span className="col-span-2 text-right">Total</span>
                        <span className="col-span-1"></span>
                    </div>
                    {budget.items.map(item => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-gray-100 dark:bg-base p-2 rounded-md">
                            <div className="col-span-5 overflow-hidden">
                                <p className="text-gray-700 dark:text-gray-300 truncate font-medium" title={item.name}>{item.name}</p>
                                {item.notes && <p className="text-xs text-gray-500 dark:text-secondary truncate" title={item.notes}>{item.notes}</p>}
                            </div>
                            <span className="col-span-2 text-gray-600 dark:text-gray-400 text-center">{item.quantity}</span>
                            <span className="col-span-2 text-gray-600 dark:text-gray-400 text-right text-xs">{item.unitPrice.toLocaleString()}</span>
                            <span className="col-span-2 font-mono text-gray-800 dark:text-gray-200 text-right font-medium">{item.price.toLocaleString()}</span>
                            <div className="col-span-1 flex justify-end">
                                <button onClick={() => onItemDelete(budget.id, item.id)} className="text-red-600 hover:text-red-400"><TrashIcon /></button>
                            </div>
                        </div>
                    ))}
                    {budget.items.length === 0 && <p className="text-gray-500 dark:text-secondary text-sm text-center">No items in this budget plan yet.</p>}
                    
                    <form onSubmit={handleAddItem} className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                        <div className="flex gap-2">
                            <input type="text" placeholder="New Item Name" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="flex-grow bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:ring-primary focus:border-primary text-sm"/>
                            <input type="text" placeholder="Notes (Optional)" value={newItemNotes} onChange={e => setNewItemNotes(e.target.value)} className="flex-grow bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:ring-primary focus:border-primary text-sm"/>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <input type="number" min="1" placeholder="Qty" value={newItemQuantity} onChange={e => setNewItemQuantity(parseFloat(e.target.value))} className="w-20 bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:ring-primary focus:border-primary text-sm"/>
                            <input type="number" placeholder="Unit Price" value={newItemUnitPrice} onChange={e => setNewItemUnitPrice(e.target.value)} className="w-24 bg-gray-50 dark:bg-base border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:ring-primary focus:border-primary text-sm"/>
                            <Button type="submit" variant="success" className="px-2 py-1 text-sm"><PlusIcon /> Add</Button>
                        </div>
                    </form>
                </div>
            )}
        </Card>
    );
};


const BudgetPage: React.FC = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [budgetData, accountData] = await Promise.all([api.getBudgets(), api.getAccounts()]);
                setBudgets(budgetData.sort((a,b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime()));
                setAccounts(accountData);
            } catch (error) {
                console.error("Failed to fetch budget data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const handleAddBudget = async (newBudget: Omit<Budget, 'id'>) => {
        try {
            const createdItem = await api.createBudget(newBudget);
            setBudgets(prev => [...prev, createdItem].sort((a,b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime()));
        } catch (error) {
            console.error("Failed to add budget plan", error);
        }
    };

    const handleDeleteBudget = async (id: string) => {
        const originalBudgets = [...budgets];
        setBudgets(prev => prev.filter(b => b.id !== id));
        try {
            await api.deleteBudget(id);
        } catch (error) {
            console.error("Failed to delete budget plan", error);
            setBudgets(originalBudgets);
        }
    };

    const handleAddItemToBudget = async (budgetId: string, item: Omit<BudgetItem, 'id'>) => {
        try {
            const addedItem = await api.addBudgetItem(budgetId, item);
            setBudgets(prev => prev.map(b => b.id === budgetId ? { ...b, items: [...b.items, addedItem] } : b));
        } catch (error) {
            console.error("Failed to add item", error);
        }
    };

    const handleDeleteItemFromBudget = async (budgetId: string, itemId: string) => {
         try {
            await api.deleteBudgetItem(budgetId, itemId);
            setBudgets(prev => prev.map(b => b.id === budgetId ? { ...b, items: b.items.filter(i => i.id !== itemId) } : b));
        } catch (error) {
            console.error("Failed to delete item", error);
        }
    };
    
    const totalAvailable = useMemo(() => accounts.reduce((sum, acc) => sum + acc.balance, 0), [accounts]);
    const totalBudgeted = useMemo(() => budgets.reduce((total, budget) => total + budget.items.reduce((sum, item) => sum + item.price, 0), 0), [budgets]);


    return (
        <Page title="Budget Management">
            <div className="space-y-8">
                <Card>
                    <div className="flex justify-around text-center">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-secondary">Total Budgeted</p>
                            <p className="text-2xl font-bold text-red-500">KSH {totalBudgeted.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-secondary">Total Available</p>
                            <p className="text-2xl font-bold text-green-500">KSH {totalAvailable.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>

                <AddBudgetForm onAddBudget={handleAddBudget} />

                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Planned Expenses</h3>
                    <div className="space-y-4">
                        {loading && <p className="text-gray-500 dark:text-secondary text-center">Loading budget...</p>}
                        {!loading && budgets.length === 0 && <Card><p className="text-gray-500 dark:text-secondary text-center">No budget plans found.</p></Card>}
                        {budgets.map(item => (
                            <BudgetPlan 
                                key={item.id} 
                                budget={item}
                                onDelete={handleDeleteBudget}
                                onItemAdd={handleAddItemToBudget}
                                onItemDelete={handleDeleteItemFromBudget}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default BudgetPage;
