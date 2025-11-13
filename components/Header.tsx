
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { UserCircleIcon, ChevronDownIcon } from './icons/Icons';

const Header: React.FC = () => {
    const { userRole, setUserRole } = useContext(AppContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleRoleChange = (role: UserRole) => {
        setUserRole(role);
        setIsDropdownOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-gray-100/80 dark:bg-base/80 backdrop-blur-md z-50">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-green to-primary">
                        FaithFinance
                    </h1>
                </div>
                <div className="relative">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-surface transition-colors">
                        <UserCircleIcon />
                        <span className="hidden sm:inline text-sm font-medium text-gray-800 dark:text-gray-200">{userRole}</span>
                        <ChevronDownIcon />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700">
                            {Object.values(UserRole).map((role) => (
                                <button
                                    key={role}
                                    onClick={() => handleRoleChange(role)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${userRole === role ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;