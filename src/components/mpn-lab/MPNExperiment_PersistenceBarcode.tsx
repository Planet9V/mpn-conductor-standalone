'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface PersistenceBarcodeProps {
    time: number;
    trauma: number;
    focusLayer: number;
}

const LAYER_COLORS = ['#6b7280', '#3b82f6', '#22c55e', '#ef4444', '#ec4899', '#f97316', '#a855f7'];
const LAYER_NAMES = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

interface PersistenceBar {
    id: number;
    birthLayer: number;
    deathLayer: number;
    significance: 'noise' | 'signal' | 'structure';
}

export default function MPNExperiment_PersistenceBarcode({ time, trauma, focusLayer }: PersistenceBarcodeProps) {
    // Generate simulated persistence bars based on trauma
    const bars = useMemo<PersistenceBar[]>(() => {
        const numBars = 12 + Math.floor(trauma * 8);
        const generatedBars: PersistenceBar[] = [];

        for (let i = 0; i < numBars; i++) {
            const birthLayer = Math.floor(Math.random() * 5);
            const lifespan = 1 + Math.floor(Math.random() * (trauma > 0.5 ? 5 : 3)); // Higher trauma = longer spanning issues
            const deathLayer = Math.min(6, birthLayer + lifespan);

            let significance: 'noise' | 'signal' | 'structure' = 'noise';
            if (deathLayer - birthLayer >= 4) significance = 'structure';
            else if (deathLayer - birthLayer >= 2) significance = 'signal';

            generatedBars.push({ id: i, birthLayer, deathLayer, significance });
        }

        // Sort by birth layer
        return generatedBars.sort((a, b) => a.birthLayer - b.birthLayer);
    }, [trauma, time]);

    return (
        <div className="relative w-full h-full bg-gray-950/90 rounded-xl border border-white/10 overflow-hidden p-4">
            {/* Title */}
            <div className="absolute top-4 left-4 z-10">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 3</div>
                <div className="text-lg font-bold text-white">Persistence Barcode</div>
                <div className="text-xs text-gray-500">RSCH-41 // Topological Feature Lifespans</div>
            </div>

            {/* Legend */}
            <div className="absolute top-4 right-4 z-10 flex gap-4 text-[10px] font-mono">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    <span className="text-gray-500">Noise</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                    <span className="text-cyan-400">Signal</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-red-400">Structure</span>
                </div>
            </div>

            {/* Barcode Display */}
            <div className="absolute inset-0 pt-20 pb-12 px-8 flex flex-col justify-center">
                {/* Layer Axis Labels */}
                <div className="flex justify-between mb-2 px-4">
                    {LAYER_NAMES.map((name, i) => (
                        <div
                            key={i}
                            className="text-[9px] font-mono uppercase"
                            style={{ color: LAYER_COLORS[i] }}
                        >
                            {name}
                        </div>
                    ))}
                </div>

                {/* Bars Container */}
                <div className="relative flex-1 bg-black/30 rounded-lg border border-white/5 overflow-hidden">
                    {/* Vertical Grid Lines (Layer Boundaries) */}
                    {[...Array(7)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-0 bottom-0 w-px"
                            style={{
                                left: `${(i / 6) * 100}%`,
                                backgroundColor: `${LAYER_COLORS[i]}30`
                            }}
                        />
                    ))}

                    {/* Persistence Bars */}
                    <div className="absolute inset-0 flex flex-col justify-center gap-1 py-4">
                        {bars.map((bar, i) => {
                            const left = (bar.birthLayer / 6) * 100;
                            const width = ((bar.deathLayer - bar.birthLayer) / 6) * 100;
                            const isActive = focusLayer === -1 || (bar.birthLayer <= focusLayer && bar.deathLayer >= focusLayer);

                            const barColor = bar.significance === 'structure' ? '#ef4444' :
                                bar.significance === 'signal' ? '#22d3ee' : '#4b5563';

                            return (
                                <motion.div
                                    key={bar.id}
                                    className="relative h-2 rounded-full"
                                    style={{
                                        marginLeft: `${left}%`,
                                        width: `${width}%`,
                                        minWidth: '4px',
                                        backgroundColor: barColor,
                                        opacity: isActive ? 1 : 0.2,
                                        boxShadow: bar.significance === 'structure' ? `0 0 10px ${barColor}` : 'none'
                                    }}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.5, delay: i * 0.03 }}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between mt-4 text-[10px] font-mono text-gray-500">
                    <span>Total Features: {bars.length}</span>
                    <span>Structural: {bars.filter(b => b.significance === 'structure').length}</span>
                    <span>Signal: {bars.filter(b => b.significance === 'signal').length}</span>
                </div>
            </div>
        </div>
    );
}
