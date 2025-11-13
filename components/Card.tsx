
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-surface rounded-xl p-4 shadow-md dark:shadow-lg ${className}`}>
            {children}
        </div>
    );
};

export default Card;