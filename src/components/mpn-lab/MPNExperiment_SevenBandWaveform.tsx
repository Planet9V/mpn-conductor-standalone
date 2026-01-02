'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface SevenBandWaveformProps {
    time: number;
    trauma: number;
    entropy: number;
    focusLayer: number;
}

const LAYER_COLORS = ['#6b7280', '#3b82f6', '#22c55e', '#ef4444', '#ec4899', '#f97316', '#a855f7'];
const LAYER_NAMES = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

export default function MPNExperiment_SevenBandWaveform({ time, trauma, entropy, focusLayer }: SevenBandWaveformProps) {
    // Generate sine wave points for each layer
    const waveforms = useMemo(() => {
        return LAYER_COLORS.map((color, layerIndex) => {
            const frequency = 0.5 + layerIndex * 0.3; // Higher layers = higher frequency
            const amplitude = 15 + trauma * 25 * (layerIndex === 3 ? 1.5 : 1); // L3 (Threats) is most affected by trauma
            const phase = time * 0.1 + layerIndex * Math.PI / 4;

            // Generate 100 points
            const points = [];
            for (let i = 0; i <= 100; i++) {
                const x = (i / 100) * 100;
                const y = amplitude * Math.sin(frequency * (x / 10) + phase) * (1 + entropy * 0.5 * Math.sin(i * 0.5));
                points.push(`${x},${50 + y}`);
            }
            return {
                path: `M ${points.join(' L ')}`,
                color,
                name: LAYER_NAMES[layerIndex],
                layerIndex
            };
        });
    }, [time, trauma, entropy]);

    return (
        <div className="relative w-full h-full bg-gray-950/90 rounded-xl border border-white/10 overflow-hidden p-4">
            {/* Title */}
            <div className="absolute top-4 left-4 z-10">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 1</div>
                <div className="text-lg font-bold text-white">Seven-Band Waveform</div>
                <div className="text-xs text-gray-500">RSCH-41 // L0-L6 as Frequency Bands</div>
            </div>

            {/* Waveform Display */}
            <div className="absolute inset-0 flex items-center justify-center pt-16">
                <svg viewBox="0 0 100 100" className="w-full h-full max-h-[300px]" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {[...Array(7)].map((_, i) => (
                        <line
                            key={`h-${i}`}
                            x1="0"
                            y1={14 * i + 7}
                            x2="100"
                            y2={14 * i + 7}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="0.2"
                        />
                    ))}

                    {/* Waveforms */}
                    {waveforms.map((wave, i) => {
                        const isActive = focusLayer === -1 || focusLayer === wave.layerIndex;
                        return (
                            <motion.path
                                key={i}
                                d={wave.path}
                                fill="none"
                                stroke={wave.color}
                                strokeWidth={isActive ? 0.8 : 0.3}
                                opacity={isActive ? 0.9 : 0.2}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                style={{
                                    filter: isActive ? `drop-shadow(0 0 4px ${wave.color})` : 'none'
                                }}
                            />
                        );
                    })}
                </svg>
            </div>

            {/* Layer Legend */}
            <div className="absolute bottom-4 right-4 flex gap-2">
                {LAYER_NAMES.map((name, i) => (
                    <div
                        key={i}
                        className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${focusLayer === i || focusLayer === -1 ? 'opacity-100' : 'opacity-30'}`}
                        style={{ backgroundColor: `${LAYER_COLORS[i]}20`, color: LAYER_COLORS[i] }}
                    >
                        {name}
                    </div>
                ))}
            </div>
        </div>
    );
}
