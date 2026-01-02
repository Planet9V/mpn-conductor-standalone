'use client';

import { Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MPNLogoProps {
    className?: string;
    showSubtitle?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function MPNLogo({ className, showSubtitle = false, size = 'md' }: MPNLogoProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    const textSizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-3xl',
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className={cn(
                'rounded-lg bg-gradient-to-br from-[#FFD700] to-yellow-600 flex items-center justify-center',
                sizeClasses[size]
            )}>
                <Music className={cn('text-black', size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-7 h-7')} />
            </div>
            <div>
                <h1 className={cn('font-bold', textSizes[size])}>
                    <span className="text-[#FFD700]">MPN</span>
                    <span className="text-white/60 ml-1 text-sm font-normal">Conductor</span>
                </h1>
                {showSubtitle && (
                    <p className="text-xs text-white/40">Musical Psychometric Notation</p>
                )}
            </div>
        </div>
    );
}

// Alias for backwards compatibility with OXOTLogo imports
export { MPNLogo as OXOTLogo };
