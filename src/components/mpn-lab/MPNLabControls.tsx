'use client';

import React from 'react';
import { Sliders, Layers, Activity, Zap } from 'lucide-react';

interface MPNLabControlsProps {
    time: number;
    setTime: (t: number) => void;
    trauma: number;
    setTrauma: (r: number) => void;
    entropy: number;
    setEntropy: (h: number) => void;
    focusLayer: number;
    setFocusLayer: (l: number) => void;
}

const LAYER_NAMES = ['L0 Catalog', 'L1 Equipment', 'L2 SBOM', 'L3 Threats', 'L4 Psychology', 'L5 Streams', 'L6 Predictions'];
const LAYER_COLORS = ['gray', 'blue', 'green', 'red', 'pink', 'orange', 'purple'];

export default function MPNLabControls({
    time, setTime,
    trauma, setTrauma,
    entropy, setEntropy,
    focusLayer, setFocusLayer
}: MPNLabControlsProps) {
    return (
        <div className="bg-black/60 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
                <Sliders className="w-5 h-5 text-oxot-gold" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">MPN Lab Controls</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Time Slider */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-wider">
                        <Activity className="w-3 h-3" /> Time (t)
                    </label>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-oxot-blue"
                    />
                    <div className="text-right text-xs font-mono text-oxot-blue">{time}</div>
                </div>

                {/* Trauma Slider */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-wider">
                        <Zap className="w-3 h-3 text-red-400" /> Trauma (R)
                    </label>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={trauma * 100}
                        onChange={(e) => setTrauma(Number(e.target.value) / 100)}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                    <div className="text-right text-xs font-mono text-red-400">{trauma.toFixed(2)}</div>
                </div>

                {/* Entropy Slider */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-wider">
                        <Activity className="w-3 h-3 text-cyan-400" /> Entropy (H)
                    </label>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={entropy * 100}
                        onChange={(e) => setEntropy(Number(e.target.value) / 100)}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="text-right text-xs font-mono text-cyan-400">{entropy.toFixed(2)}</div>
                </div>

                {/* Layer Focus */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-wider">
                        <Layers className="w-3 h-3" /> Focus Layer
                    </label>
                    <select
                        value={focusLayer}
                        onChange={(e) => setFocusLayer(Number(e.target.value))}
                        className="w-full bg-gray-800 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-oxot-blue"
                    >
                        <option value={-1}>All Layers</option>
                        {LAYER_NAMES.map((name, i) => (
                            <option key={i} value={i}>{name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
