'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    X, Wand2, Loader2, Sparkles, Activity,
    Music2, Radio, Zap, BrainCircuit, Waves
} from 'lucide-react';
import { STYLE_PRESETS, MusicalStyle } from './styles';

// --- Types ---
interface ScriptProcessorProps {
    isOpen: boolean;
    onClose: () => void;
    playTitle?: string;
    playId?: string;
    onProcessingComplete: () => void;
}

// --- Radar Chart Component ---
const RadarChart = ({ style }: { style: MusicalStyle | null }) => {
    if (!style) return (
        <div className="w-full h-64 flex items-center justify-center text-gray-600">
            <Activity className="w-12 h-12 opacity-20 animate-pulse" />
        </div>
    );

    // Normalize values to 0-1 range
    const metrics = [
        { label: 'Syncopation', value: style.rhythm.syncopation_weight },
        { label: 'Complexity', value: style.harmony.complexity },
        { label: 'Dissonance', value: style.harmony.dissonance_tolerance },
        { label: 'Density', value: style.texture.density },
        { label: 'Rigidity', value: style.texture.voice_leading_strictness },
    ];

    const size = 200;
    const center = size / 2;
    const radius = size * 0.4;
    const angleStep = (Math.PI * 2) / metrics.length;

    // Calculate points
    const points = metrics.map((m, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + Math.cos(angle) * (radius * m.value);
        const y = center + Math.sin(angle) * (radius * m.value);
        return `${x},${y}`;
    }).join(' ');

    const bgPoints = metrics.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        return { x, y, label: metrics[i].label };
    });

    return (
        <div className="relative w-full h-64 flex items-center justify-center">
            <svg width={size} height={size} className="overflow-visible">
                {/* Background Grid */}
                {[0.2, 0.4, 0.6, 0.8, 1].map((r, idx) => (
                    <circle
                        key={r}
                        cx={center}
                        cy={center}
                        r={radius * r}
                        fill="none"
                        stroke="#ffffff"
                        strokeOpacity="0.1"
                    />
                ))}

                {/* Axes */}
                {bgPoints.map((p, i) => (
                    <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={p.x}
                        y2={p.y}
                        stroke="#ffffff"
                        strokeOpacity="0.1"
                    />
                ))}

                {/* Data Polygon */}
                <polygon
                    points={points}
                    fill="rgba(245, 158, 11, 0.2)"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    className="transition-all duration-500 ease-out"
                />

                {/* Data Points */}
                {metrics.map((m, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const x = center + Math.cos(angle) * (radius * m.value);
                    const y = center + Math.sin(angle) * (radius * m.value);
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="3"
                            fill="#f59e0b"
                            className="transition-all duration-500 ease-out"
                        />
                    );
                })}
            </svg>

            {/* Labels */}
            {bgPoints.map((p, i) => (
                <div
                    key={i}
                    className="absolute text-[10px] uppercase tracking-wider text-gray-400 font-medium"
                    style={{
                        left: p.x > center ? `${(p.x / size) * 100}%` : 'auto',
                        right: p.x < center ? `${100 - (p.x / size) * 100}%` : 'auto',
                        top: p.y > center ? `${(p.y / size) * 100}%` : 'auto',
                        bottom: p.y < center ? `${100 - (p.y / size) * 100}%` : 'auto',
                        transform: `translate(${p.x > center ? '5px' : '-5px'}, ${p.y > center ? '5px' : '-5px'})`
                    }}
                >
                    {p.label}
                </div>
            ))}
        </div>
    );
};

// --- Main Processor Component ---
export default function ScriptProcessor({ isOpen, onClose, playTitle, playId, onProcessingComplete }: ScriptProcessorProps) {
    const [selectedStyle, setSelectedStyle] = useState<string | null>('orchestral');
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'generating' | 'complete'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    // Reset logs/status on open
    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setLogs([]);
            setError(null);
        }
    }, [isOpen]);

    const activeStyle = useMemo(() => selectedStyle ? STYLE_PRESETS[selectedStyle] : null, [selectedStyle]);

    const handleProcess = async () => {
        if (!playId || !selectedStyle) return;

        // Start Sequence
        setStatus('analyzing');
        setLogs(prev => [...prev, '> Initializing Psychometric Engine...']);

        // Mock sequence delays for effect
        setTimeout(() => setLogs(prev => [...prev, '> Parsing Script Structure...']), 500);
        setTimeout(() => setLogs(prev => [...prev, `> Applying Style Vector: ${activeStyle?.name.toUpperCase()}...`]), 1200);

        try {
            await new Promise(r => setTimeout(r, 2000)); // Minimum cinematic wait
            setStatus('generating');

            const res = await fetch('/api/process-play', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playId, styleId: selectedStyle })
            });

            if (!res.ok) throw new Error('Processing failed');

            setLogs(prev => [...prev, '> Generation Complete.']);
            setStatus('complete');

            setTimeout(() => {
                onProcessingComplete();
                onClose();
            }, 1000);

        } catch (err) {
            setError('Failed to process play. Connection interrupted.');
            setStatus('idle');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-5xl h-[85vh] bg-gray-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* LEFT: Style Selection */}
                <div className="w-full md:w-1/2 lg:w-2/5 border-r border-white/10 flex flex-col bg-black/20">
                    <div className="p-8 border-b border-white/10">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <BrainCircuit className="w-6 h-6 text-amber-500" />
                            Processing Lab
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm">
                            Select a <span className="text-amber-400">Psychometric Style Vector</span> to transform <span className="italic text-white">"{playTitle}"</span>.
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                        {Object.values(STYLE_PRESETS).map((style) => (
                            <button
                                key={style.id}
                                onClick={() => status === 'idle' && setSelectedStyle(style.id)}
                                disabled={status !== 'idle'}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden ${selectedStyle === style.id
                                        ? 'bg-amber-900/20 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <span className={`font-bold ${selectedStyle === style.id ? 'text-amber-400' : 'text-gray-300'}`}>
                                        {style.name}
                                    </span>
                                    {selectedStyle === style.id && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                                </div>
                                <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors relative z-10">
                                    {style.description}
                                </p>

                                {/* Background Gradient for Active */}
                                {selectedStyle === style.id && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Data Visualization & Console */}
                <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 to-black relative">
                    {/* Visualizer Area */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                        {/* Background Decor */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent opacity-50" />

                        <div className="relative z-10 w-full max-w-md">
                            <div className="text-center mb-8">
                                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">Vector Analysis</h3>
                                <div className="text-3xl font-serif text-white">{activeStyle?.name || 'Select Style'}</div>
                            </div>

                            <RadarChart style={activeStyle} />

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                                    <div className="text-[10px] uppercase text-gray-500 mb-1">Tempo Range</div>
                                    <div className="text-amber-400 font-mono font-bold">
                                        {activeStyle?.rhythm.tempo_range[0]}-{activeStyle?.rhythm.tempo_range[1]} <span className="text-[10px] text-gray-600">BPM</span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                                    <div className="text-[10px] uppercase text-gray-500 mb-1">Rhythm Base</div>
                                    <div className="text-amber-400 font-mono font-bold capitalize">
                                        1/{activeStyle?.rhythm.base_division} <span className="text-[10px] text-gray-600">Note</span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                                    <div className="text-[10px] uppercase text-gray-500 mb-1">Modes</div>
                                    <div className="text-amber-400 font-mono font-bold text-xs truncate px-1">
                                        {activeStyle?.harmony.preferred_modes[0]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Console / Action Area */}
                    <div className="h-48 bg-black/40 border-t border-white/10 backdrop-blur-xl p-6 flex flex-col justify-between">
                        {/* Log Output */}
                        <div className="font-mono text-xs space-y-1 mb-4 h-full overflow-hidden flex flex-col justify-end">
                            {logs.map((log, i) => (
                                <div key={i} className="text-amber-500/80 animate-in slide-in-from-left-2 fade-in duration-300">
                                    {log}
                                </div>
                            ))}
                            {status === 'analyzing' && (
                                <div className="text-gray-500 animate-pulse">_ Processing textual entropy...</div>
                            )}
                        </div>

                        {/* Action Component */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Zap className={`w-3 h-3 ${status !== 'idle' ? 'text-amber-500' : ''}`} />
                                Server Ready
                            </div>

                            {error ? (
                                <div className="text-red-400 text-sm">{error}</div>
                            ) : (
                                <button
                                    onClick={handleProcess}
                                    disabled={status !== 'idle' || !selectedStyle}
                                    className={`
                                        px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center gap-2
                                        ${status === 'idle'
                                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20 hover:scale-105'
                                            : 'bg-white/5 text-gray-500 cursor-wait'}
                                    `}
                                >
                                    {status === 'idle' ? (
                                        <>
                                            INITIALIZE SEQUENCE
                                            <Sparkles className="w-4 h-4" />
                                        </>
                                    ) : (
                                        <>
                                            PROCESSING
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
