'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScriptFrame {
    speaker: string;
    text: string;
    chord: string;
    analysis: string;
}

interface MPNPsychoacousticScoreProps {
    script?: ScriptFrame;
    trauma: number;
    entropy: number;
    focusLayer: number;
    scenarioName?: string;
}

const STAVE_LINES = [
    { id: 'imaginary', label: 'IMAGINARY (I)', color: '#a855f7', y: 30 }, // Top
    { id: 'symbolic', label: 'SYMBOLIC (S)', color: '#3b82f6', y: 60 },  // Middle
    { id: 'real', label: 'REAL (R)', color: '#ef4444', y: 90 },       // Bottom
];

export default function MPNPsychoacousticScore({
    script,
    trauma,
    entropy,
    focusLayer,
    scenarioName
}: MPNPsychoacousticScoreProps) {

    // If no script is active, show a resting state
    // If no script is active, show a resting state
    const activeData = script || {
        speaker: 'OFFLINE',
        text: 'Waiting for stream...',
        chord: '---',
        analysis: 'NO DATA SIGNAL RECEIVED'
    };

    // Determine Stave Position based on Trauma/Entropy balance
    // High Trauma -> Real (Bottom)
    // High Entropy -> Imaginary (Top)
    // Balanced -> Symbolic (Middle)
    const noteY = useMemo(() => {
        if (trauma > 0.7) return 90; // Real
        if (entropy > 0.7) return 30; // Imaginary
        return 60; // Symbolic
    }, [trauma, entropy]);

    const activeColor = useMemo(() => {
        if (trauma > 0.7) return '#ef4444';
        if (entropy > 0.7) return '#a855f7';
        return '#3b82f6';
    }, [trauma, entropy]);

    return (
        <div className="w-full bg-black/60 border-y border-oxot-gold/30 backdrop-blur-md overflow-hidden relative mb-4">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('/grid.png')]" />

            <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6 items-center">

                {/* LEFT: Identity / Clef */}
                <div className="w-full md:w-1/6 flex flex-col items-center justify-center border-r border-white/10 pr-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-serif mb-2 relative overflow-hidden">
                        {/* Avatar Simulation */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10" />
                        {activeData.speaker === 'REST' ? '∅' : activeData.speaker.charAt(0)}
                    </div>
                    <div className="text-oxot-gold font-bold text-sm tracking-widest uppercase text-center">
                        {activeData.speaker}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono text-center mt-1">
                        {scenarioName}
                    </div>
                </div>

                {/* CENTER: The Neural Stave */}
                <div className="w-full md:w-3/5 h-[140px] relative bg-black/20 rounded-lg border border-white/5 mx-auto">
                    {/* Stave Lines */}
                    <svg className="w-full h-full absolute inset-0">
                        {STAVE_LINES.map(line => (
                            <g key={line.id}>
                                <line
                                    x1="20" y1={line.y}
                                    x2="100%" y2={line.y}
                                    stroke={line.color}
                                    strokeWidth="1"
                                    opacity="0.3"
                                />
                                <text x="5" y={line.y + 4} fill={line.color} fontSize="8" opacity="0.5">
                                    {line.label}
                                </text>
                            </g>
                        ))}

                        {/* Bar Lines (Moving) */}
                        <motion.line
                            x1="50%" y1="20" x2="50%" y2="100"
                            stroke="white" strokeWidth="2" opacity="0.1"
                        />

                        {/* The "Note" / Psychoacoustic Event */}
                        <AnimatePresence mode="wait">
                            <motion.g
                                key={activeData.text} // Re-render on text change
                                initial={{ opacity: 0, x: 200 }}
                                animate={{ opacity: 1, x: '50%' }} // Move to center playhead
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                            >
                                {/* Connection to Stave */}
                                <line x1="0" y1={noteY} x2="0" y2="120" stroke={activeColor} strokeWidth="2" strokeDasharray="4 2" opacity="0.5" />

                                {/* Note Head */}
                                <circle cx="0" cy={noteY} r={trauma * 10 + 5} fill={activeColor} stroke="white" strokeWidth="2" />

                                {/* Chord Text */}
                                <text x="15" y={noteY + 5} fill="white" fontSize="14" fontWeight="bold" fontFamily="monospace">
                                    {activeData.chord}
                                </text>
                            </motion.g>
                        </AnimatePresence>
                    </svg>

                    {/* Script Text Overlay */}
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeData.text}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="inline-block px-4 py-1 bg-black/80 rounded border border-white/10 text-white font-serif italic text-lg shadow-xl"
                            >
                                "{activeData.text}"
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* RIGHT: Analysis Console */}
                <div className="w-full md:w-1/4 border-l border-white/10 pl-6 flex flex-col justify-center gap-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1">
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Psychoacoustic Analysis</span>
                        <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500" style={{ opacity: trauma }} title={`Trauma: ${trauma}`} />
                            <span className="w-2 h-2 rounded-full bg-purple-500" style={{ opacity: entropy }} title={`Entropy: ${entropy}`} />
                        </div>
                    </div>

                    <div className="text-sm font-mono text-oxot-gold min-h-[40px]">
                        {activeData.chord}
                    </div>

                    <div className="text-xs text-gray-300 leading-relaxed border-l-2 border-white/20 pl-2">
                        {activeData.analysis}
                    </div>

                    {focusLayer !== -1 && (
                        <div className="mt-2 text-[9px] font-mono text-cyan-500">
                            TARGET LAYER: L{focusLayer}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
