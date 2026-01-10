'use client';

/**
 * TimelineScrubber - Phase 7 Dynamic Conductor UI
 * Allows scrubbing through the musical timeline and viewing psychometric state at each beat
 * 
 * HIGH PRIORITY COMPONENT (per user feedback)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Clock,
    Repeat,
    Zap,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface TimelineMarker {
    beat: number;
    type: 'scene' | 'actor' | 'emotion' | 'custom';
    label: string;
    color?: string;
}

export interface PsychometricSnapshot {
    beat: number;
    trauma: number;
    entropy: number;
    rsi: { real: number; symbolic: number; imaginary: number };
    dominantActor?: string;
    emotionStyle?: string;
}

export interface TimelineScrubberProps {
    totalBeats: number;
    currentBeat: number;
    isPlaying: boolean;
    tempo: number;
    markers?: TimelineMarker[];
    snapshots?: PsychometricSnapshot[];
    onSeek: (beat: number) => void;
    onPlayPause: () => void;
    onTempoChange?: (tempo: number) => void;
    onRegenerate?: (fromBeat: number) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function TimelineScrubber({
    totalBeats,
    currentBeat,
    isPlaying,
    tempo = 120,
    markers = [],
    snapshots = [],
    onSeek,
    onPlayPause,
    onTempoChange,
    onRegenerate
}: TimelineScrubberProps) {
    const [hoverBeat, setHoverBeat] = useState<number | null>(null);
    const [dragging, setDragging] = useState(false);
    const [localTempo, setLocalTempo] = useState(tempo);
    const [loop, setLoop] = useState(false);
    const [muted, setMuted] = useState(false);
    const timelineRef = useRef<HTMLDivElement>(null);

    // Sync tempo
    useEffect(() => {
        setLocalTempo(tempo);
    }, [tempo]);

    const calculateBeatFromMouse = useCallback((clientX: number) => {
        if (!timelineRef.current) return 0;
        const rect = timelineRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, x / rect.width));
        return Math.round(ratio * totalBeats);
    }, [totalBeats]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        const beat = calculateBeatFromMouse(e.clientX);
        onSeek(beat);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const beat = calculateBeatFromMouse(e.clientX);
        setHoverBeat(beat);
        if (dragging) {
            onSeek(beat);
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleMouseLeave = () => {
        setHoverBeat(null);
        setDragging(false);
    };

    const formatTime = (beats: number) => {
        const seconds = (beats / localTempo) * 60;
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getSnapshotAtBeat = (beat: number): PsychometricSnapshot | null => {
        return snapshots.find(s => s.beat === beat) ||
            snapshots.reduce((prev, curr) =>
                curr.beat <= beat && curr.beat > (prev?.beat || -1) ? curr : prev
                , null as PsychometricSnapshot | null);
    };

    const hoverSnapshot = hoverBeat !== null ? getSnapshotAtBeat(hoverBeat) : null;
    const currentSnapshot = getSnapshotAtBeat(currentBeat);

    return (
        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Timeline Scrubber</h3>
                        <p className="text-xs text-white/40">{formatTime(totalBeats)} • {totalBeats} beats @ {localTempo} BPM</p>
                    </div>
                </div>

                {/* Tempo Control */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest">Tempo</span>
                    <input
                        type="range"
                        min={40}
                        max={200}
                        value={localTempo}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setLocalTempo(val);
                            onTempoChange?.(val);
                        }}
                        className="w-24 accent-gold"
                    />
                    <span className="text-sm font-mono text-white/60 w-12">{localTempo}</span>
                </div>
            </div>

            {/* Main Timeline */}
            <div className="relative mb-6">
                {/* Track */}
                <div
                    ref={timelineRef}
                    className="relative h-16 bg-black/40 rounded-xl overflow-hidden cursor-pointer"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Psychometric Heatmap Background */}
                    <div className="absolute inset-0 flex">
                        {snapshots.map((snap, i) => {
                            const width = i < snapshots.length - 1
                                ? ((snapshots[i + 1].beat - snap.beat) / totalBeats) * 100
                                : ((totalBeats - snap.beat) / totalBeats) * 100;
                            const gradient = `hsl(${(1 - snap.trauma) * 120}, 70%, ${30 + snap.entropy * 20}%)`;

                            return (
                                <div
                                    key={i}
                                    className="h-full"
                                    style={{
                                        width: `${width}%`,
                                        backgroundColor: gradient,
                                        opacity: 0.4
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Markers */}
                    {markers.map((marker, i) => (
                        <div
                            key={i}
                            className="absolute top-0 h-full w-0.5"
                            style={{
                                left: `${(marker.beat / totalBeats) * 100}%`,
                                backgroundColor: marker.color || (
                                    marker.type === 'scene' ? '#fbbf24' :
                                        marker.type === 'actor' ? '#60a5fa' :
                                            marker.type === 'emotion' ? '#f472b6' :
                                                '#9ca3af'
                                )
                            }}
                        >
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-widest whitespace-nowrap text-white/60">
                                {marker.label}
                            </div>
                        </div>
                    ))}

                    {/* Progress Bar */}
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gold/30"
                        animate={{ width: `${(currentBeat / totalBeats) * 100}%` }}
                        transition={{ duration: 0.1 }}
                    />

                    {/* Playhead */}
                    <motion.div
                        className="absolute top-0 h-full w-1 bg-gold shadow-lg shadow-gold/50"
                        animate={{ left: `${(currentBeat / totalBeats) * 100}%` }}
                        transition={{ duration: 0.1 }}
                    />

                    {/* Hover Indicator */}
                    {hoverBeat !== null && (
                        <div
                            className="absolute top-0 h-full w-0.5 bg-white/50"
                            style={{ left: `${(hoverBeat / totalBeats) * 100}%` }}
                        />
                    )}
                </div>

                {/* Beat Numbers */}
                <div className="flex justify-between mt-2 text-[10px] text-white/30 font-mono">
                    <span>0</span>
                    <span>{Math.round(totalBeats / 4)}</span>
                    <span>{Math.round(totalBeats / 2)}</span>
                    <span>{Math.round((totalBeats * 3) / 4)}</span>
                    <span>{totalBeats}</span>
                </div>
            </div>

            {/* Hover Tooltip */}
            {hoverBeat !== null && hoverSnapshot && (
                <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs grid grid-cols-4 gap-4">
                    <div>
                        <span className="text-white/30">Beat</span>
                        <p className="font-mono text-gold">{hoverBeat}</p>
                    </div>
                    <div>
                        <span className="text-white/30">Trauma</span>
                        <p className="font-mono text-red-400">{(hoverSnapshot.trauma * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                        <span className="text-white/30">Entropy</span>
                        <p className="font-mono text-purple-400">{(hoverSnapshot.entropy * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                        <span className="text-white/30">RSI</span>
                        <p className="font-mono text-blue-400">
                            R{(hoverSnapshot.rsi.real * 10).toFixed(0)}
                            S{(hoverSnapshot.rsi.symbolic * 10).toFixed(0)}
                            I{(hoverSnapshot.rsi.imaginary * 10).toFixed(0)}
                        </p>
                    </div>
                </div>
            )}

            {/* Transport Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onSeek(0)}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition"
                    >
                        <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onSeek(Math.max(0, currentBeat - 16))}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onPlayPause}
                        className="p-4 rounded-full bg-gold text-black hover:scale-105 transition"
                    >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>
                    <button
                        onClick={() => onSeek(Math.min(totalBeats, currentBeat + 16))}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onSeek(totalBeats)}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition"
                    >
                        <SkipForward className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <span className="font-mono text-gold text-lg">
                        {formatTime(currentBeat)} / {formatTime(totalBeats)}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setLoop(!loop)}
                        className={`p-2 rounded-lg transition ${loop ? 'bg-gold text-black' : 'text-white/40 hover:text-white'}`}
                    >
                        <Repeat className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setMuted(!muted)}
                        className={`p-2 rounded-lg transition ${muted ? 'bg-red-500/20 text-red-400' : 'text-white/40 hover:text-white'}`}
                    >
                        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    {onRegenerate && (
                        <button
                            onClick={() => onRegenerate(currentBeat)}
                            className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition"
                        >
                            <Zap className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TimelineScrubber;
