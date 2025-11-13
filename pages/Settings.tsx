
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Theme } from '../types';
import Page from '../components/Page';
import Card from '../components/Card';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '../components/icons/Icons';

const Settings: React.FC = () => {
    const { theme, setTheme } = useContext(AppContext);

    const options = [
        { name: Theme.Light, icon: <SunIcon /> },
        { name: Theme.Dark, icon: <MoonIcon /> },
        { name: Theme.System, icon: <ComputerDesktopIcon /> },
    ];

    return (
        <Page title="Settings">
            <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Appearance</h3>
                <p className="text-sm text-gray-500 dark:text-secondary mb-4">
                    Choose how FaithFinance looks to you. Select a single theme, or sync with your system.
                </p>
                <div className="flex items-center space-x-2 rounded-lg bg-gray-200 dark:bg-base p-1">
                    {options.map((option) => (
                        <button
                            key={option.name}
                            onClick={() => setTheme(option.name)}
                            className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 px-4 text-sm font-medium transition-colors ${
                                theme === option.name
                                    ? 'bg-primary text-black shadow'
                                    : 'text-gray-600 dark:text-secondary hover:bg-white/50 dark:hover:bg-surface/50'
                            }`}
                        >
                            {option.icon}
                            {option.name}
                        </button>
                    ))}
                </div>
            </Card>
        </Page>
    );
};

export default Settings;
