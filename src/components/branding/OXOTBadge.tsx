import React from 'react';

interface OXOTBadgeProps {
    children: React.ReactNode;
    className?: string;
}

export const OXOTBadge: React.FC<OXOTBadgeProps> = ({ children, className = "" }) => {
    return (
        <div className={`inline-flex items-center px-2.5 py-1 rounded-md bg-oxot-gold/10 border border-oxot-gold/30 text-oxot-gold text-xs font-medium tracking-wide shadow-[0_0_10px_-3px_rgba(255,215,0,0.3)] ${className}`}>
            <span className="font-bold mr-1.5 opacity-80">OXOT:</span>
            {children}
        </div>
    );
};
