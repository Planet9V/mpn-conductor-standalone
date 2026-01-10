'use client';

/**
 * AI Model Selector Component
 * 
 * Dropdown component for selecting the AI model source for music generation.
 * Options: Text2midi | PSYCHOSCORE | Hybrid | Off
 * 
 * @since Phase 6 - PSYCHOSCORE Integration
 */

import React, { useState, useEffect } from 'react';
import { Bot, Cpu, Zap, Power } from 'lucide-react';
import type { AIModelSource } from '@/components/mpn-lab/GeniusComposer';

interface AIModelSelectorProps {
    value: AIModelSource;
    onChange: (source: AIModelSource) => void;
    disabled?: boolean;
    showStatus?: boolean;
}

interface ModelOption {
    value: AIModelSource;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const MODEL_OPTIONS: ModelOption[] = [
    {
        value: 'text2midi',
        label: 'Text2midi',
        description: 'HuggingFace symbolic MIDI',
        icon: <Bot className="w-4 h-4" />,
        color: 'text-blue-400'
    },
    {
        value: 'psychoscore',
        label: 'PSYCHOSCORE',
        description: 'Custom 57D trained model',
        icon: <Cpu className="w-4 h-4" />,
        color: 'text-purple-400'
    },
    {
        value: 'hybrid',
        label: 'Hybrid',
        description: 'PSYCHOSCORE → Text2midi fallback',
        icon: <Zap className="w-4 h-4" />,
        color: 'text-amber-400'
    },
    {
        value: 'off',
        label: 'Off',
        description: 'Algorithmic generation only',
        icon: <Power className="w-4 h-4" />,
        color: 'text-gray-400'
    }
];

export function AIModelSelector({
    value,
    onChange,
    disabled = false,
    showStatus = true
}: AIModelSelectorProps) {
    const [psychoscoreStatus, setPsychoscoreStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

    // Check PSYCHOSCORE availability on mount
    useEffect(() => {
        const checkPsychoscore = async () => {
            try {
                const response = await fetch('/api/psychoscore/generate', { method: 'GET' });
                const data = await response.json();
                setPsychoscoreStatus(data.status === 'healthy' ? 'available' : 'unavailable');
            } catch {
                setPsychoscoreStatus('unavailable');
            }
        };

        if (showStatus) {
            checkPsychoscore();
            // Refresh status every 30 seconds
            const interval = setInterval(checkPsychoscore, 30000);
            return () => clearInterval(interval);
        }
    }, [showStatus]);

    const currentOption = MODEL_OPTIONS.find(o => o.value === value) || MODEL_OPTIONS[0];

    return (
        <div className="space-y-2">
            <label className="block text-xs text-white/60 uppercase tracking-wide">
                AI Model Source
            </label>

            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value as AIModelSource)}
                    disabled={disabled}
                    className={`
                        w-full appearance-none px-4 py-3 rounded-lg
                        bg-black/40 border border-white/20
                        text-transparent text-sm
                        focus:outline-none focus:border-purple-500/50
                        disabled:opacity-50 disabled:cursor-not-allowed
                        cursor-pointer
                    `}
                >
                    {MODEL_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label} - {option.description}
                        </option>
                    ))}
                </select>

                {/* Custom display overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center px-4">
                    <span className={currentOption.color}>{currentOption.icon}</span>
                    <span className="ml-2 text-sm font-medium">{currentOption.label}</span>
                </div>

                {/* Dropdown arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Status indicator */}
            {showStatus && (
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/40">PSYCHOSCORE:</span>
                    {psychoscoreStatus === 'checking' && (
                        <span className="text-amber-400 animate-pulse">Checking...</span>
                    )}
                    {psychoscoreStatus === 'available' && (
                        <span className="text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            Available
                        </span>
                    )}
                    {psychoscoreStatus === 'unavailable' && (
                        <span className="text-red-400 flex items-center gap-1">
                            <span className="w-2 h-2 bg-red-400 rounded-full" />
                            Unavailable
                        </span>
                    )}
                </div>
            )}

            {/* Description */}
            <p className="text-xs text-white/40">{currentOption.description}</p>
        </div>
    );
}

export default AIModelSelector;
