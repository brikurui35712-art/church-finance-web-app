import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { HomeIcon, ChartBarIcon, ClipboardCheckIcon, CalculatorIcon, MegaphoneIcon, CogIcon, CashIcon, ClipboardListIcon } from './icons/Icons';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white ${
                isActive ? 'text-primary' : 'text-gray-500 dark:text-secondary'
            }`
        }
    >
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </NavLink>
);

const BottomNav: React.FC = () => {
    const { userRole } = useContext(AppContext);
    const hasFinanceAccess = userRole === UserRole.Admin || userRole === UserRole.Treasurer;

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-surface/80 backdrop-blur-md z-50 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto h-full max-w-lg">
                <div className="flex justify-around items-center h-full">
                    <NavItem to="/dashboard" icon={<HomeIcon />} label="Home" />
                    <NavItem to="/reports" icon={<ChartBarIcon />} label="Reports" />
                    {hasFinanceAccess && (
                        <>
                            <NavItem to="/reconciliation" icon={<ClipboardCheckIcon />} label="Reconcile" />
                            <NavItem to="/transactions" icon={<ClipboardListIcon />} label="History" />
                            <NavItem to="/cash-collections" icon={<CashIcon />} label="Cash" />
                            <NavItem to="/budget" icon={<CalculatorIcon />} label="Budget" />
                            <NavItem to="/campaigns" icon={<MegaphoneIcon />} label="Campaigns" />
                        </>
                    )}
                    <NavItem to="/settings" icon={<CogIcon />} label="Settings" />
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;