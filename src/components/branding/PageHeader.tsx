'use client';

import React from 'react';

type PageHeaderVariant = 'default' | 'hero' | 'compact';

interface PageHeaderProps {
    /** Section label (small caps above title) */
    label?: string;
    /** Page title */
    title: string;
    /** Optional subtitle */
    subtitle?: string;
    /** Header variant style */
    variant?: PageHeaderVariant;
    /** Accent color: 'red' | 'gold' | 'blue' | 'green' */
    accent?: 'red' | 'gold' | 'blue' | 'green';
    /** Additional classes */
    className?: string;
    /** Children content (e.g., CTAs) */
    children?: React.ReactNode;
}

const accentColors = {
    red: 'text-oxot-red border-oxot-red',
    gold: 'text-oxot-gold border-oxot-gold',
    blue: 'text-oxot-blue border-oxot-blue',
    green: 'text-emerald-400 border-emerald-400',
};

const accentBg = {
    red: 'bg-oxot-red',
    gold: 'bg-oxot-gold',
    blue: 'bg-oxot-blue',
    green: 'bg-emerald-400',
};

export const PageHeader: React.FC<PageHeaderProps> = ({
    label,
    title,
    subtitle,
    variant = 'default',
    accent = 'red',
    className = '',
    children,
}) => {
    const isHero = variant === 'hero';
    const isCompact = variant === 'compact';

    return (
        <header className={`mb-12 ${isHero ? 'mb-20' : ''} ${className}`}>
            {/* Section Label */}
            {label && (
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-[2px] ${accentBg[accent]}`} />
                    <span className={`section-label ${accentColors[accent].split(' ')[0]}`}>
                        {label}
                    </span>
                </div>
            )}

            {/* Title */}
            <h1 className={`
                ${isHero ? 'heading-1' : isCompact ? 'heading-2' : 'heading-1'}
                text-white mb-4
            `}>
                {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
                <p className={`
                    ${isHero ? 'text-xl' : 'text-lg'} 
                    text-grey max-w-3xl leading-relaxed
                `}>
                    {subtitle}
                </p>
            )}

            {/* Children (CTAs, etc.) */}
            {children && (
                <div className="mt-8">
                    {children}
                </div>
            )}

            {/* Decorative accent line for hero variant */}
            {isHero && (
                <div className={`mt-12 w-24 h-1 ${accentBg[accent]} opacity-60`} />
            )}
        </header>
    );
};

export default PageHeader;
