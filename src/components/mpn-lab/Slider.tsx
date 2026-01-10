import React, { useRef, useState, useEffect } from 'react';

interface SliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    label?: string;
    leftLabel?: string;
    rightLabel?: string;
    onChange: (value: number) => void;
    color?: string; // 'purple' | 'cyan' | 'amber' | 'mixed'
    className?: string;
}

export const Slider: React.FC<SliderProps> = ({
    value,
    min,
    max,
    step = 1,
    label,
    leftLabel,
    rightLabel,
    onChange,
    color = 'purple',
    className
}) => {
    const isMixed = color === 'mixed';

    // Gradient definitions
    const gradients: Record<string, string> = {
        purple: 'from-purple-600 to-fuchsia-400',
        cyan: 'from-cyan-600 to-blue-400',
        amber: 'from-amber-600 to-yellow-400',
        red: 'from-red-600 to-orange-400',
        mixed: 'from-indigo-500 via-purple-500 to-pink-500'
    };

    const gradientClass = gradients[color] || gradients['purple'];
    const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1) * 100;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <div className="flex justify-between mb-1.5 items-end">
                    <span className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                        {/* Icon placeholder if we want one later */}
                        {label}
                    </span>
                    <span className="text-xs font-mono text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">
                        {value}%
                    </span>
                </div>
            )}

            <div className="relative w-full h-3 bg-gray-800 rounded-full border border-gray-700 overflow-hidden shadow-inner">
                {/* Track Fill */}
                <div
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${gradientClass} transition-all duration-100 ease-out`}
                    style={{ width: `${percentage}%` }}
                />

                {/* Input (invisible but clickable/draggable) */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
            </div>

            {(leftLabel || rightLabel) && (
                <div className="flex justify-between mt-1 text-[9px] text-gray-500 font-medium uppercase tracking-wide">
                    <span>{leftLabel}</span>
                    <span>{rightLabel}</span>
                </div>
            )}
        </div>
    );
};
