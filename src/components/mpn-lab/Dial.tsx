import React, { useState, useEffect, useRef } from 'react';

interface DialProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    label?: string;
    units?: string;
    onChange: (value: number) => void;
    size?: number;
    color?: string;
    className?: string;
}

export const Dial: React.FC<DialProps> = ({
    value,
    min,
    max,
    step = 1,
    label,
    units,
    onChange,
    size = 64,
    color = '#A855F7', // Default Purple
    className
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const dialRef = useRef<HTMLDivElement>(null);
    const startY = useRef<number>(0);
    const startValue = useRef<number>(0);

    // Calculate rotation based on value
    // Map value (min-max) to angle (-135 to 135 degrees)
    const range = max - min;
    const items = range / step;
    const angleRange = 270;
    const startAngle = -135;

    const normalizedValue = Math.min(Math.max((value - min) / range, 0), 1);
    const rotation = startAngle + (normalizedValue * angleRange);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        startY.current = e.clientY;
        startValue.current = value;
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const deltaY = startY.current - e.clientY;
            // Sensitivity: 200px drag = full range
            const change = (deltaY / 200) * range;

            let newValue = startValue.current + change;

            // Snap to step
            newValue = Math.round(newValue / step) * step;

            // Clamp
            newValue = Math.max(min, Math.min(max, newValue));

            if (newValue !== value) {
                onChange(newValue);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, min, max, step, range, value, onChange]);

    // SVG Geometry
    const strokeWidth = size * 0.08;
    const radius = (size / 2) - strokeWidth;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;
    // 75% of circle is visible (270 degrees)
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - (0.75 * normalizedValue));

    // Background track (270 degrees constant)
    const trackDashoffset = circumference * 0.25;

    return (
        <div className={`flex flex-col items-center gap-1 ${className}`}>
            <div
                ref={dialRef}
                className={`relative cursor-ns-resize touch-none select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{ width: size, height: size }}
                onMouseDown={handleMouseDown}
            >
                {/* Dial SVG */}
                <svg width={size} height={size} className="overflow-visible transform rotate-90">
                    {/* Track */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="#374151" // gray-700
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={trackDashoffset}
                        strokeLinecap="round"
                        className="opacity-50"
                        transform={`rotate(135 ${center} ${center})`}
                    />
                    {/* Valye Arc */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - (0.75 * normalizedValue))}
                        strokeLinecap="round"
                        transform={`rotate(135 ${center} ${center})`}
                        className="transition-all duration-75 ease-out"
                    />
                </svg>

                {/* Knob Indicator (Dot) */}
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    <div
                        className="absolute top-0 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        style={{ marginTop: strokeWidth + 2 }}
                    />
                </div>

                {/* Value Center Display */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-gray-200 select-none">
                        {value}
                    </span>
                </div>
            </div>

            {label && (
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{label}</span>
                    {units && <span className="text-[9px] text-gray-600 font-mono">{units}</span>}
                </div>
            )}
        </div>
    );
};
