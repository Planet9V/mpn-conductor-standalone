import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface AdjustmentDialProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    onChange: (value: number) => void;
    onPreview?: () => void;
    color?: string;
}

export default function AdjustmentDial({
    label,
    value,
    min,
    max,
    step = 1,
    unit = '',
    onChange,
    onPreview,
    color = 'text-oxot-gold'
}: AdjustmentDialProps) {
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Convert value to percentage for visual display
    const percentage = ((value - min) / (max - min)) * 100;

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        updateValue(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            updateValue(e.clientX);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (onPreview) onPreview();
    };

    const updateValue = (clientX: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const newPercentage = x / rect.width;

        let newValue = min + newPercentage * (max - min);
        // Snap to step
        if (step) {
            newValue = Math.round(newValue / step) * step;
        }

        // Clamp
        newValue = Math.max(min, Math.min(max, newValue));

        onChange(newValue);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className="flex flex-col gap-1 select-none">
            <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400 font-mono uppercase tracking-wider">{label}</span>
                <span className={`font-mono font-bold ${color}`}>
                    {value.toFixed(step < 1 ? 2 : 0)}{unit}
                </span>
            </div>

            <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                className="relative h-6 bg-black/40 rounded cursor-ew-resize border border-white/10 group overflow-hidden"
            >
                {/* Background Track */}
                <div className="absolute inset-0 bg-gray-800/30" />

                {/* Fill Track */}
                <motion.div
                    className={`absolute top-0 bottom-0 left-0 bg-current opacity-20 ${color.replace('text-', 'bg-')}`}
                    style={{ width: `${percentage}%` }}
                />

                {/* Indicator Line */}
                <motion.div
                    className={`absolute top-0 bottom-0 w-0.5 bg-white/50`}
                    style={{ left: `${percentage}%` }}
                />

                {/* Hover Glow */}
                <div className={`absolute top-0 bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none`} />
            </div>
        </div>
    );
}
