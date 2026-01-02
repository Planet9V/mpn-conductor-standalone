'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useMPNSynthesizer } from './MPNSynthesizer';
import { LITERARY_SCENARIOS } from './literary_data';
import { LiteraryScenario, ScenarioFrame } from './types';

interface ScenarioDriverProps {
    onScenarioChange: (trauma: number, entropy: number, focusLayer: number, scenarioName: string, frameName: string, script?: { speaker: string; text: string; chord: string; analysis: string }) => void;
}

export default function ScenarioDriver({ onScenarioChange }: ScenarioDriverProps) {
    const [selectedScenario, setSelectedScenario] = useState<LiteraryScenario>(LITERARY_SCENARIOS[0]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(2000); // ms between frames
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [audioInitialized, setAudioInitialized] = useState(false);

    // Synthesizer hook
    const synth = useMPNSynthesizer();
    const lastFrameRef = useRef(-1);

    // Initialize audio on first user interaction
    const handleEnableAudio = useCallback(async () => {
        if (!audioInitialized) {
            await synth.initialize();
            setAudioInitialized(true);
        }
        setAudioEnabled(!audioEnabled);
    }, [synth, audioInitialized, audioEnabled]);

    // Update volume
    useEffect(() => {
        synth.setVolume(volume);
    }, [volume, synth]);

    // Play sound when frame changes
    useEffect(() => {
        const frame = selectedScenario.frames[currentFrame];
        if (!frame || !audioEnabled) return;

        // Prevent double-playing on mount
        if (lastFrameRef.current === currentFrame) return;
        lastFrameRef.current = currentFrame;

        // Play orchestral chord based on trauma level
        synth.playFullOrchestra(frame.trauma, frame.entropy, frame.focusLayer);

        // Crisis alert for high trauma
        if (frame.trauma > 0.9) {
            setTimeout(() => synth.playCrisisAlert(), 300);
        }
    }, [currentFrame, selectedScenario, audioEnabled, synth]);

    // Update parent when frame changes
    useEffect(() => {
        const frame = selectedScenario.frames[currentFrame];
        if (frame) {
            // console.log('Emitting Frame:', currentFrame, frame.script); // Debug 
            onScenarioChange(
                frame.trauma,
                frame.entropy,
                frame.focusLayer,
                selectedScenario.title,
                frame.name,
                frame.script
            );
        }
    }, [selectedScenario, currentFrame, onScenarioChange]);

    // Auto-play logic
    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setCurrentFrame(prev => {
                if (prev >= selectedScenario.frames.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, playSpeed);

        return () => clearInterval(timer);
    }, [isPlaying, playSpeed, selectedScenario.frames.length]);

    const handleScenarioSelect = (scenario: LiteraryScenario) => {
        setSelectedScenario(scenario);
        setCurrentFrame(0);
        lastFrameRef.current = -1; // Reset to allow first frame sound
        setIsPlaying(false);
    };

    const handleReset = () => {
        setCurrentFrame(0);
        lastFrameRef.current = -1;
        setIsPlaying(false);
        synth.stopAll();
    };

    const handleNextFrame = () => {
        if (currentFrame < selectedScenario.frames.length - 1) {
            setCurrentFrame(prev => prev + 1);
        }
    };

    const handlePlay = async () => {
        // Initialize audio if not done yet
        if (!audioInitialized && audioEnabled) {
            await synth.initialize();
            setAudioInitialized(true);
        }
        setIsPlaying(!isPlaying);
    };

    const frame = selectedScenario.frames[currentFrame];

    return (
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-oxot-gold">📜</span> Literary Scenario Test Driver
                </h3>
                <div className="flex items-center gap-4">
                    {/* Audio Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleEnableAudio}
                            className={`p-2 rounded-lg transition-colors ${audioEnabled
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                }`}
                            title={audioEnabled ? 'Mute Audio' : 'Enable Audio'}
                        >
                            {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>
                        {audioEnabled && (
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-16 h-1 accent-green-500"
                                title={`Volume: ${Math.round(volume * 100)}%`}
                            />
                        )}
                    </div>

                    {/* Speed Control */}
                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                        <span>Speed:</span>
                        <select
                            value={playSpeed}
                            onChange={(e) => setPlaySpeed(Number(e.target.value))}
                            className="bg-black/50 border border-white/20 rounded px-2 py-1 text-white"
                        >
                            <option value={1000}>Fast (1s)</option>
                            <option value={2000}>Normal (2s)</option>
                            <option value={3000}>Slow (3s)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Audio Status Banner */}
            {!audioEnabled && (
                <div className="mb-4 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
                    <span className="text-yellow-400 text-sm">
                        🔇 Click the speaker icon to enable audio sonification
                    </span>
                </div>
            )}

            {/* Scenario Selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                {LITERARY_SCENARIOS.map(scenario => (
                    <button
                        key={scenario.id}
                        onClick={() => handleScenarioSelect(scenario)}
                        className={`p-3 rounded-lg border transition-all ${selectedScenario.id === scenario.id
                            ? 'border-oxot-gold bg-oxot-gold/10'
                            : 'border-white/10 hover:border-white/30'
                            }`}
                    >
                        <div className="text-sm font-bold text-white">{scenario.title}</div>
                        <div className="text-[9px] text-gray-500">{scenario.author}</div>
                        <div className="text-[8px] font-mono mt-1" style={{ color: scenario.color }}>
                            {scenario.theme}
                        </div>
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div className="relative mb-4">
                <div className="flex justify-between mb-2">
                    {selectedScenario.frames.map((f, i) => (
                        <button
                            key={i}
                            onClick={() => { setCurrentFrame(i); setIsPlaying(false); }}
                            className={`relative flex-1 py-2 text-center transition-all ${i === currentFrame ? 'bg-white/10' : 'hover:bg-white/5'
                                }`}
                        >
                            <div className={`text-[9px] font-mono ${i === currentFrame ? 'text-white' : 'text-gray-600'}`}>
                                {i + 1}
                            </div>
                            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${i < currentFrame ? 'bg-oxot-gold' : i === currentFrame ? 'bg-white' : 'bg-gray-700'
                                }`} />
                        </button>
                    ))}
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-oxot-gold"
                        animate={{ width: `${((currentFrame + 1) / selectedScenario.frames.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Current Frame Display */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${selectedScenario.id}-${currentFrame}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-black/30 rounded-lg border border-white/10 mb-4"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-white font-bold">{frame.name}</div>
                            <div className="text-sm text-gray-400">{frame.description}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[9px] font-mono text-gray-500 uppercase">Frame {currentFrame + 1}/{selectedScenario.frames.length}</div>
                            {audioEnabled && (
                                <div className="text-[8px] font-mono text-green-400 flex items-center gap-1 mt-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    Audio Active
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Parameters */}
                    <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                            <div className="text-[8px] font-mono text-gray-500 uppercase">Trauma (τ)</div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500"
                                        style={{ width: `${frame.trauma * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-mono text-red-400">{frame.trauma.toFixed(2)}</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-[8px] font-mono text-gray-500 uppercase">Entropy (η)</div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500"
                                        style={{ width: `${frame.entropy * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-mono text-purple-400">{frame.entropy.toFixed(2)}</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-[8px] font-mono text-gray-500 uppercase">Layer Focus</div>
                            <span className="text-sm font-mono text-cyan-400">
                                {frame.focusLayer === -1 ? 'ALL' : `L${frame.focusLayer}`}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex justify-center gap-2">
                <button
                    onClick={handleReset}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    title="Reset"
                >
                    <RotateCcw size={18} className="text-gray-400" />
                </button>
                <button
                    onClick={handlePlay}
                    className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${isPlaying ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    {isPlaying ? 'Pause' : 'Play Scenario'}
                </button>
                <button
                    onClick={handleNextFrame}
                    disabled={currentFrame >= selectedScenario.frames.length - 1}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30"
                    title="Next Frame"
                >
                    <SkipForward size={18} className="text-gray-400" />
                </button>
            </div>

            {/* Musical Info */}
            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <div className="text-[9px] font-mono text-gray-600">
                    🎼 Audio maps to 7-Layer Orchestra: L0=Bass(C3) → L6=Pad(C5) |
                    τ↑ = faster attack, higher pitch | η↑ = vibrato intensity
                </div>
            </div>
        </div>
    );
}
