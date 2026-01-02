'use client';

import React from 'react';
import Image from 'next/image';

interface OXOTRibbonProps {
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
    className?: string;
}

const sizeMap = {
    sm: { width: 40, height: 40 },
    md: { width: 60, height: 60 },
    lg: { width: 100, height: 100 },
};

/**
 * OXOT Ribbon Icon - The brand's distinctive ribbon/X-wing symbol
 */
export const OXOTRibbon: React.FC<OXOTRibbonProps> = ({
    size = 'md',
    animated = false,
    className = '',
}) => {
    const { width, height } = sizeMap[size];

    return (
        <div
            className={`relative ${animated ? 'animate-float' : ''} ${className}`}
            style={{ width, height }}
        >
            <Image
                src="/OXOT_Gold_Ribbon.svg"
                alt="OXOT Ribbon"
                fill
                className="object-contain"
            />
        </div>
    );
};

export default OXOTRibbon;
