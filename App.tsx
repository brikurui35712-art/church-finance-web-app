
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import { UserRole, Theme } from './types';
import Dashboard from './pages/Dashboard';
import Reconciliation from './pages/Reconciliation';
import CashCollections from './pages/CashCollections';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Budget from './pages/Budget';
import Campaigns from './pages/Campaigns';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';
import Header from './components/Header';

const App: React.FC = () => {
    const [userRole, setUserRole] = useState<UserRole>(UserRole.Treasurer);
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme && Object.values(Theme).includes(storedTheme as Theme)) {
            return storedTheme as Theme;
        }
        return Theme.System;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        const isDark = theme === Theme.Dark || (theme === Theme.System && window.matchMedia('(prefers-color-scheme: dark)').matches);

        root.classList.remove(isDark ? 'light' : 'dark');
        root.classList.add(isDark ? 'dark' : 'light');
        
        localStorage.setItem('theme', theme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (theme === Theme.System) {
                root.classList.remove(e.matches ? 'light' : 'dark');
                root.classList.add(e.matches ? 'dark' : 'light');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const contextValue = useMemo(() => ({
        userRole,
        setUserRole,
        theme,
        setTheme,
    }), [userRole, theme]);

    const hasFinanceAccess = userRole === UserRole.Admin || userRole === UserRole.Treasurer;

    return (
        <AppContext.Provider value={contextValue}>
            <HashRouter>
                <div className="min-h-screen bg-gray-100 dark:bg-base font-sans flex flex-col">
                    <Header />
                    <main className="flex-grow container mx-auto px-4 pb-24 pt-20">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
                            
                            <Route path="/reconciliation" element={hasFinanceAccess ? <Reconciliation /> : <Navigate to="/dashboard" replace />} />
                            <Route path="/cash-collections" element={hasFinanceAccess ? <CashCollections /> : <Navigate to="/dashboard" replace />} />
                            <Route path="/expenses" element={hasFinanceAccess ? <Expenses /> : <Navigate to="/dashboard" replace />} />
                            <Route path="/budget" element={hasFinanceAccess ? <Budget /> : <Navigate to="/dashboard" replace />} />
                            <Route path="/campaigns" element={hasFinanceAccess ? <Campaigns /> : <Navigate to="/dashboard" replace />} />
                        </Routes>
                    </main>
                    <BottomNav />
                </div>
            </HashRouter>
        </AppContext.Provider>
    );
};

export default App;