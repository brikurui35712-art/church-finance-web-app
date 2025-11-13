
import React from 'react';

interface PageProps {
    title: string;
    children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children }) => {
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
            {children}
        </div>
    );
};

export default Page;