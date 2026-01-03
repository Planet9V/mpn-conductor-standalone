'use client';

/**
 * MPN Conductor Score Page v3.0
 * Advanced Musical Psychometric Notation visualization with:
 * - Multi-stave conductor's score (populated from script frames)
 * - Audio playback via Tone.js
 * - Tonnetz Grid / Neo-Riemannian Torus
 * - Lorenz Attractor Phase Space
 * - Leitmotif Registry
 * - Real-time psychometric analysis dashboard
 */

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
    ChevronDown, Music, Activity, Layers, Zap, Play, Pause, SkipForward,
    BookOpen, Volume2, VolumeX, RotateCcw, BarChart, Users, Brain, AlertTriangle, FileDown, FileText
} from 'lucide-react';
import Link from 'next/link';
import { OXOTLogo } from '@/components/branding/OXOTLogo';
import { PageHeader } from '@/components/branding/PageHeader';
import { MPNPresetAPI } from '@/components/mpn-lab/mpn_preset_api';
import { getOrchestrator, ScoreOrchestrator } from '@/components/mpn-lab/score_orchestrator';
import { useMPNSynthesizer } from '@/components/mpn-lab/MPNSynthesizer';
import { ORCHESTRATION_MODES, type OrchestrationMode } from '@/components/mpn-lab/GeniusComposer';

import { LITERARY_SCENARIOS } from '@/components/mpn-lab/literary_data';
import { LiteraryScenario, ScenarioFrame } from '@/components/mpn-lab/types';
import { PsychometricScoreFrame, ActorStaveData, ActorProfile } from '@/components/mpn-lab/score_types';
import { downloadScorePDF } from '@/components/mpn-lab/score_exporter';

// Instrument assignment based on DISC profile (from reference dictionary)
const DISC_INSTRUMENTS: Record<string, string> = {
    'D': 'Trumpet',
    'I': 'Flute',
    'S': 'Cello',
    'C': 'Piano'
};

// Generate actor profile from speaker name
function createActorProfile(speakerName: string, index: number): ActorProfile {
    // Default DISC profiles for common character archetypes
    const archetypes: Record<string, { disc: { D: number; I: number; S: number; C: number }; darkTriad: { machiavellianism: number; narcissism: number; psychopathy: number } }> = {
        'hamlet': { disc: { D: 0.3, I: 0.4, S: 0.5, C: 0.7 }, darkTriad: { machiavellianism: 0.3, narcissism: 0.4, psychopathy: 0.2 } },
        'claudius': { disc: { D: 0.8, I: 0.6, S: 0.2, C: 0.5 }, darkTriad: { machiavellianism: 0.9, narcissism: 0.7, psychopathy: 0.6 } },
        'ophelia': { disc: { D: 0.2, I: 0.5, S: 0.8, C: 0.4 }, darkTriad: { machiavellianism: 0.1, narcissism: 0.2, psychopathy: 0.1 } },
        'ghost': { disc: { D: 0.6, I: 0.2, S: 0.3, C: 0.4 }, darkTriad: { machiavellianism: 0.4, narcissism: 0.3, psychopathy: 0.2 } },
        'gertrude': { disc: { D: 0.4, I: 0.7, S: 0.6, C: 0.3 }, darkTriad: { machiavellianism: 0.3, narcissism: 0.4, psychopathy: 0.1 } },
        'oedipus': { disc: { D: 0.7, I: 0.5, S: 0.4, C: 0.6 }, darkTriad: { machiavellianism: 0.2, narcissism: 0.5, psychopathy: 0.3 } },
        'jocasta': { disc: { D: 0.5, I: 0.6, S: 0.7, C: 0.4 }, darkTriad: { machiavellianism: 0.3, narcissism: 0.4, psychopathy: 0.1 } },
        'creon': { disc: { D: 0.6, I: 0.4, S: 0.5, C: 0.7 }, darkTriad: { machiavellianism: 0.5, narcissism: 0.4, psychopathy: 0.2 } },
        'tiresias': { disc: { D: 0.3, I: 0.3, S: 0.6, C: 0.8 }, darkTriad: { machiavellianism: 0.2, narcissism: 0.2, psychopathy: 0.1 } },
        'macbeth': { disc: { D: 0.8, I: 0.4, S: 0.3, C: 0.5 }, darkTriad: { machiavellianism: 0.7, narcissism: 0.8, psychopathy: 0.6 } },
        'lady macbeth': { disc: { D: 0.9, I: 0.6, S: 0.2, C: 0.4 }, darkTriad: { machiavellianism: 0.9, narcissism: 0.7, psychopathy: 0.8 } },
        'priest': { disc: { D: 0.4, I: 0.5, S: 0.7, C: 0.8 }, darkTriad: { machiavellianism: 0.2, narcissism: 0.3, psychopathy: 0.1 } },
        'chorus': { disc: { D: 0.3, I: 0.5, S: 0.8, C: 0.6 }, darkTriad: { machiavellianism: 0.1, narcissism: 0.2, psychopathy: 0.1 } },
    };

    const key = speakerName.toLowerCase();
    const profile = archetypes[key] || {
        disc: { D: 0.5, I: 0.5, S: 0.5, C: 0.5 },
        darkTriad: { machiavellianism: 0.3, narcissism: 0.3, psychopathy: 0.3 }
    };

    return {
        id: key.replace(/\s+/g, '_'),
        name: speakerName,
        disc: profile.disc,
        darkTriad: profile.darkTriad,
    };
}

// Dynamic imports for heavy 3D components
const ConductorScoreView = dynamic(
    () => import('@/components/mpn-lab/ConductorScoreVexFlow'),
    { ssr: false, loading: () => <LoadingPlaceholder label="Loading VexFlow Score..." /> }
);

const MPNExperiment_TonnetzGrid = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_TonnetzGrid'),
    { ssr: false, loading: () => <LoadingPlaceholder label="Loading Tonnetz Grid..." /> }
);

const MPNExperiment_LorenzAttractor = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_LorenzAttractor'),
    { ssr: false, loading: () => <LoadingPlaceholder label="Loading Lorenz Attractor..." /> }
);

// Loading placeholder
function LoadingPlaceholder({ label }: { label: string }) {
    return (
        <div className="w-full h-full min-h-[300px] bg-black/40 rounded-xl animate-pulse flex items-center justify-center border border-white/10">
            <span className="text-gray-500 text-sm font-mono">{label}</span>
        </div>
    );
}

export default function MPNConductorPage() {
    // Scenario state
    const [selectedScenario, setSelectedScenario] = useState<LiteraryScenario>(LITERARY_SCENARIOS[0]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

    // Orchestration Mode State
    const [orchestrationMode, setOrchestrationMode] = useState<OrchestrationMode>('FULL_ORCHESTRA' as OrchestrationMode);
    const [aiEnabled, setAiEnabled] = useState(false);
    const [aiTemperature, setAiTemperature] = useState(0.7);

    // Update Orchestration Mode
    useEffect(() => {
        const orchestrator = getOrchestrator();
        orchestrator.setOrchestrationMode(orchestrationMode);
    }, [orchestrationMode]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(2500); // ms between frames

    // Audio state
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [audioInitialized, setAudioInitialized] = useState(false);
    const [volume, setVolume] = useState(0.4);
    const synth = useMPNSynthesizer();

    // Score frame state
    const [scoreFrame, setScoreFrame] = useState<PsychometricScoreFrame | null>(null);
    const [scoreBuffer, setScoreBuffer] = useState<PsychometricScoreFrame[]>([]);
    const [processedIndex, setProcessedIndex] = useState(-1);
    const processingRef = useRef(false);

    // UI State
    const [isHeroCollapsed, setIsHeroCollapsed] = useState(false);

    // Scroll listener for hero collapse
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100 && !isHeroCollapsed) {
                setIsHeroCollapsed(true);
            } else if (window.scrollY < 50 && isHeroCollapsed) {
                setIsHeroCollapsed(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHeroCollapsed]);

    // Current frame data
    const currentFrame = useMemo(() => {
        return selectedScenario.frames[currentFrameIndex] || null;
    }, [selectedScenario, currentFrameIndex]);

    // Psychometric values from frame
    const trauma = currentFrame?.trauma ?? 0.3;
    const entropy = currentFrame?.entropy ?? 0.25;
    const focusLayer = currentFrame?.focusLayer ?? -1;

    // Lyapunov calculation
    const lyapunov = (trauma + entropy - 0.5) * 0.5;
    const stabilityLabel = lyapunov < 0 ? 'STABLE' : lyapunov < 0.1 ? 'EDGE' : 'CHAOTIC';
    const stabilityColor = lyapunov < 0 ? 'text-green-400' : lyapunov < 0.1 ? 'text-yellow-400' : 'text-red-400';
    const borromeanStability = Math.max(0.3, 1 - Math.abs(lyapunov));

    // Velocity and Tempo calculations
    const velocity = Math.round(20 + 107 * trauma);
    const dynamicLabel = trauma < 0.2 ? 'pp' : trauma < 0.4 ? 'mp' : trauma < 0.6 ? 'mf' : trauma < 0.8 ? 'f' : 'ff';
    const tempo = entropy < 0.4 ? Math.round(40 + entropy * 50) :
        entropy < 0.7 ? Math.round(80 + (entropy - 0.4) * 67) :
            Math.round(120 + (entropy - 0.7) * 200);

    // Enable audio
    const handleEnableAudio = useCallback(async () => {
        if (!audioInitialized) {
            await synth.initialize();
            setAudioInitialized(true);
        }
        setAudioEnabled(!audioEnabled);
    }, [synth, audioInitialized, audioEnabled]);

    // Load adjustments on mount
    useEffect(() => {
        const adjustments = MPNPresetAPI.getActiveAdjustments();
        if (Object.keys(adjustments).length > 0) {
            getOrchestrator().updateAdjustments(adjustments);
        }
    }, []);

    // Register actors when scenario changes
    useEffect(() => {
        const orchestrator = getOrchestrator();
        orchestrator.reset();
        setScoreBuffer([]);
        setProcessedIndex(-1);
        setIsPlaying(false);
        setCurrentFrameIndex(0);

        // Extract unique speakers from all frames
        const speakerSet = new Set<string>();
        selectedScenario.frames.forEach(frame => {
            if (frame.script?.speaker) {
                speakerSet.add(frame.script.speaker);
            }
        });

        // Register each speaker as an actor
        let index = 0;
        speakerSet.forEach(speaker => {
            const profile = createActorProfile(speaker, index);
            orchestrator.registerActor(profile);
            index++;
        });

        console.log(`Registered ${speakerSet.size} actors for scenario: ${selectedScenario.title}`);
    }, [selectedScenario]);

    // Update volume
    useEffect(() => {
        synth.setVolume(volume);
    }, [volume, synth]);

    // Buffer Management: content generation (Look-ahead)
    useEffect(() => {
        const ensureBuffer = async () => {
            if (processingRef.current) return;
            // Target: Keep 4 frames ahead of current, but don't exceed scenario length
            const targetIndex = Math.min(currentFrameIndex + 4, selectedScenario.frames.length - 1);

            if (processedIndex >= targetIndex) return;

            processingRef.current = true;

            try {
                const orchestrator = getOrchestrator();
                orchestrator.setAIConfig(aiEnabled, aiTemperature);

                // Process frames sequentially from stored index + 1 up to target
                let nextIdx = processedIndex + 1;
                const newFrames: PsychometricScoreFrame[] = [];

                while (nextIdx <= targetIndex) {
                    const rawFrame = selectedScenario.frames[nextIdx];
                    const script = rawFrame.script || { speaker: '', text: '', chord: 'Cm', analysis: '' };

                    // We need to use current parameter states (trauma, etc)
                    // Note: This applies current UI knobs to future frames. 
                    // Ideally prompts would evolve, but for manual knobs this is expected.
                    const output = await orchestrator.processFrame(script, trauma, entropy);

                    const frame: PsychometricScoreFrame = {
                        frameIndex: nextIdx,
                        timestamp: Date.now(),
                        speaker: script.speaker,
                        global: {
                            tempo: output.global?.tempo || tempo,
                            timeSignature: output.global?.timeSignature || '4/4',
                            key: output.global?.key || 'C Major',
                            mode: (output.global as any)?.mode || (lyapunov < 0 ? 'Ionian' : lyapunov < 0.1 ? 'Lydian' : 'Phrygian'),
                            dynamics: output.global?.dynamics || dynamicLabel,
                        },
                        staves: (output.staves || []).map((s: any) => ({
                            actorId: s.actorId || '',
                            actorName: s.actorName || 'Unknown',
                            instrument: s.instrument || 'Piano',
                            instrumentFamily: s.instrumentFamily || 'keyboard',
                            isSpeaking: s.isSpeaking || false,
                            activation: s.activation || 0,
                            notes: s.notes || [],
                            leitmotif: s.leitmotif || null,
                            timbre: s.timbre || { attack: 0.1, decay: 0.1, sustain: 0.8, release: 0.2, vibrato: 0, detuning: 0, filterCutoff: 8000 },
                            dynamic: s.dynamic || velocity,
                            articulation: s.articulation || 'legato',
                            psychometricState: s.psychometricState || { trauma, entropy, rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 } },
                        })) as unknown as ActorStaveData[],
                        harmony: output.harmony || { chord: script.chord, tension: trauma },
                        graph: output.graph || { nodes: [], edges: [] },
                    };

                    newFrames.push(frame);
                    nextIdx++;
                }

                if (newFrames.length > 0) {
                    setScoreBuffer(prev => {
                        // Deduplicate just in case, though sequential logic should prevent it
                        const existingIndices = new Set(prev.map(f => f.frameIndex));
                        const uniqueNew = newFrames.filter(f => !existingIndices.has(f.frameIndex));
                        return [...prev, ...uniqueNew].sort((a, b) => a.frameIndex - b.frameIndex);
                    });
                    setProcessedIndex(targetIndex);
                }

            } catch (err) {
                console.error("Orchestration error:", err);
            } finally {
                processingRef.current = false;
            }
        };

        ensureBuffer();
    }, [currentFrameIndex, processedIndex, selectedScenario, trauma, entropy, lyapunov, tempo, dynamicLabel, velocity, aiEnabled, aiTemperature]);

    // Playback Logic: Audio trigger & Current Frame update
    useEffect(() => {
        const frameToPlay = scoreBuffer.find(f => f.frameIndex === currentFrameIndex);

        if (frameToPlay) {
            setScoreFrame(frameToPlay);

            if (audioEnabled && audioInitialized && isPlaying) {
                // Prevent duplicate triggers if we just re-rendered
                // We rely on currentFrameIndex changing to trigger this effect
                synth.playScore(frameToPlay.staves, frameToPlay.global.tempo);
                if (trauma > 0.9) {
                    setTimeout(() => synth.playCrisisAlert(), 300);
                }
            }
        }
    }, [currentFrameIndex, scoreBuffer, audioEnabled, audioInitialized, isPlaying]);

    // Auto-play logic
    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setCurrentFrameIndex(prev => {
                if (prev >= selectedScenario.frames.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, playSpeed);

        return () => clearInterval(timer);
    }, [isPlaying, playSpeed, selectedScenario.frames.length]);

    // Control handlers
    const handlePlay = () => setIsPlaying(!isPlaying);
    const handleNextFrame = () => setCurrentFrameIndex(prev => Math.min(prev + 1, selectedScenario.frames.length - 1));
    const handleReset = () => {
        // Full reset
        setCurrentFrameIndex(0);
        setIsPlaying(false);
        setScoreBuffer([]);
        setProcessedIndex(-1);
        getOrchestrator().reset();
    };
    const handleScenarioChange = (scenario: LiteraryScenario) => {
        setSelectedScenario(scenario);
        setCurrentFrameIndex(0);
        setIsPlaying(false);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
            {/* Hero Section */}
            <section className={`flex flex-col items-center justify-center relative px-4 transition-all duration-700 ease-in-out ${isHeroCollapsed ? 'h-[40vh] opacity-50' : 'h-screen opacity-100'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={`text-center transition-all duration-700 ${isHeroCollapsed ? 'scale-75' : 'scale-100'}`}
                >
                    <OXOTLogo className="w-16 h-16 mx-auto mb-6" />
                    <PageHeader
                        title="CONDUCTOR'S SCORE"
                        subtitle="Psychometric Musical Notation // Real-Time Orchestration"
                        variant="hero"
                        accent="gold"
                    />
                    <div className={`overflow-hidden transition-all duration-700 ${isHeroCollapsed ? 'max-h-0 opacity-0' : 'max-h-40 opacity-100'}`}>
                        <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-base leading-relaxed">
                            Transform literary scripts into living orchestral scores using:
                        </p>
                        <ul className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm space-y-1">
                            <li>• <span className="text-white">151-entry psychometric dictionary</span> (DISC, OCEAN, Dark Triad, Lacanian Registers)</li>
                            <li>• <span className="text-white">7 orchestration modes</span> with dynamic voice leading and leitmotif generation</li>
                            <li>• <span className="text-white">Multi-measure conductor view</span> with 4-frame look-ahead buffer</li>
                            <li>• <span className="text-white">AI-enhanced melody generation</span> via OpenRouter & HuggingFace models</li>
                            <li>• <span className="text-white">Crisis detection</span> with Lyapunov stability and Borromean analysis</li>
                        </ul>
                    </div>
                </motion.div>

                {/* Orchestration Mode Selector */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 relative z-20"
                >
                    <div className="flex items-center space-x-2 bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-gold/50 transition-colors">
                        <Music className="w-4 h-4 text-gold" />
                        <span className="text-xs uppercase tracking-widest text-gray-400">Mode</span>
                        <select
                            value={orchestrationMode}
                            onChange={(e) => setOrchestrationMode(e.target.value as OrchestrationMode)}
                            className="bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer appearance-none pl-2"
                        >
                            {ORCHESTRATION_MODES.map((mode) => (
                                <option key={mode} value={mode} className="bg-gray-900">
                                    {mode.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-gray-500 pointer-events-none" />

                        {/* AI Separator */}
                        <div className="w-px h-4 bg-white/20 mx-2" />

                        {/* AI Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setAiEnabled(!aiEnabled)}
                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all ${aiEnabled ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <span className="text-[10px] font-mono font-bold">AI</span>
                                <div className={`w-1.5 h-1.5 rounded-full ${aiEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                            </button>

                            {aiEnabled && (
                                <div className="flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1.5"
                                        step="0.1"
                                        value={aiTemperature}
                                        onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                                        className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold"
                                        title={`Temperature: ${aiTemperature}`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-10 flex flex-col items-center gap-2"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <span className="text-gray-500 text-xs uppercase tracking-widest">Scroll to Explore</span>
                    <ChevronDown className="w-5 h-5 text-oxot-gold" />
                </motion.div>
            </section>

            {/* Controls Bar */}
            <section className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4 px-6 shadow-2xl shadow-black/50 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">

                    {/* LEFT GROUP: Scenario & Status */}
                    <div className="flex items-center gap-4 bg-gray-900/50 rounded-full px-4 py-1.5 border border-white/5">
                        <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Scenario</span>
                            <select
                                value={selectedScenario.title}
                                onChange={(e) => {
                                    const s = LITERARY_SCENARIOS.find(sc => sc.title === e.target.value);
                                    if (s) handleScenarioChange(s);
                                }}
                                className="bg-transparent border-none text-sm text-white font-medium focus:outline-none cursor-pointer hover:text-gold transition-colors"
                            >
                                {LITERARY_SCENARIOS.map(s => (
                                    <option key={s.title} value={s.title} className="bg-gray-900">{s.title}</option>
                                ))}
                            </select>
                        </div>
                        <span className="text-gray-500 text-xs font-mono">
                            Frame <span className="text-white">{currentFrameIndex + 1}</span> / {selectedScenario.frames.length}
                        </span>
                    </div>

                    {/* CENTER GROUP: Playback */}
                    <div className="flex items-center gap-1 bg-gray-900/80 rounded-full p-1 border border-white/10 shadow-inner">
                        <button
                            onClick={handleReset}
                            className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            title="Reset"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handlePlay}
                            className={`p-3 rounded-full ${isPlaying ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-gold hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.4)]'} transition-all mx-1`}
                            title={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                        </button>
                        <button
                            onClick={handleNextFrame}
                            className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            title="Next Frame"
                        >
                            <SkipForward className="w-4 h-4" />
                        </button>
                    </div>

                    {/* RIGHT GROUP: Audio & Tools */}
                    <div className="flex items-center gap-3">
                        {/* Audio Pill */}
                        <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 border transition-all ${audioEnabled ? 'bg-green-900/20 border-green-500/30' : 'bg-gray-900/50 border-white/5'}`}>
                            <button
                                onClick={handleEnableAudio}
                                className={`p-1.5 rounded-full ${audioEnabled ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400'} transition-colors`}
                            >
                                {audioEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                            </button>
                            {audioEnabled && (
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume * 100}
                                    onChange={(e) => setVolume(Number(e.target.value) / 100)}
                                    className="w-16 h-1 bg-gray-700 rounded cursor-pointer accent-green-500"
                                />
                            )}
                        </div>

                        {/* Tools Pill */}
                        <div className="flex items-center gap-1 bg-gray-900/50 rounded-full p-1 border border-white/5">
                            <Link href="/mpn-reference" className="p-2 rounded-full text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors" title="Reference">
                                <BookOpen className="w-4 h-4" />
                            </Link>
                            <Link href="/play-library" className="p-2 rounded-full text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors" title="Library">
                                <FileText className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={async () => {
                                    // Derive actors from scoreFrame staves
                                    const actors = (scoreFrame?.staves || []).map(s => ({
                                        id: s.actorId,
                                        name: s.actorName,
                                        disc: { D: 0.5, I: 0.5, S: 0.5, C: 0.5 },
                                        archetype: 'hero' as const
                                    }));

                                    // Build minimal score object for PDF export
                                    const score = {
                                        id: `score_${Date.now()}`,
                                        title: selectedScenario.title,
                                        source: selectedScenario.author,
                                        generatedAt: new Date().toISOString(),
                                        version: '1.0',
                                        actors: actors,
                                        leitmotifs: {},
                                        frames: selectedScenario.frames.map((f, i) => ({
                                            frameIndex: i,
                                            timestamp: i * 4000,
                                            scriptLine: f.script?.text || f.description,
                                            speaker: f.script?.speaker || f.name,
                                            global: {
                                                key: scoreFrame?.global?.key || 'C Major',
                                                tempo: scoreFrame?.global?.tempo || 80,
                                                timeSignature: '4/4',
                                                mode: 'Ionian',
                                                dynamics: 'mf'
                                            },
                                            harmony: { chord: f.script?.chord || 'Cmaj' },
                                            staves: [],
                                            graph: { nodes: [], edges: [] }
                                        })),
                                        statistics: {
                                            totalFrames: selectedScenario.frames.length,
                                            duration: selectedScenario.frames.length * 4000,
                                            averageTrauma: selectedScenario.frames.reduce((sum, f) => sum + f.trauma, 0) / selectedScenario.frames.length,
                                            averageEntropy: selectedScenario.frames.reduce((sum, f) => sum + f.entropy, 0) / selectedScenario.frames.length,
                                            dominantKey: scoreFrame?.global?.key || 'C Major',
                                            dominantMode: 'Ionian'
                                        }
                                    };
                                    await downloadScorePDF(score as any, { title: selectedScenario.title });
                                }}
                                className="p-2 rounded-full text-gray-400 hover:text-green-400 hover:bg-green-400/10 transition-colors"
                                title="Export PDF"
                            >
                                <FileDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Script Dialog Panel */}
            {
                currentFrame?.script && (
                    <section className="px-6 py-4 bg-black/40 border-b border-white/10">
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-gray-900/80 rounded-xl border border-white/10 p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Users className="w-4 h-4 text-oxot-gold" />
                                    <span className="text-oxot-gold font-bold text-sm uppercase">
                                        {currentFrame.script.speaker}
                                    </span>
                                    <span className="text-gray-600 text-xs">
                                        {currentFrame.name}
                                    </span>
                                </div>
                                <p className="text-white italic text-sm leading-relaxed">
                                    "{currentFrame.script.text}"
                                </p>
                                {currentFrame.script.analysis && (
                                    <p className="text-gray-500 text-xs mt-2 font-mono">
                                        Analysis: {currentFrame.script.analysis}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* Psychometric Analysis Dashboard */}
            <section className="px-6 py-6 border-b border-white/10">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-oxot-gold" />
                        <h2 className="text-white font-semibold">Psychometric Analysis</h2>
                    </div>

                    {/* Core Metrics - Large Primary Cards */}
                    <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-bold">Core Metrics</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Trauma */}
                            <div className="bg-gradient-to-br from-red-900/30 to-gray-900/60 rounded-xl p-5 border border-red-500/20 shadow-lg shadow-red-900/10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-sm text-red-300 uppercase tracking-wider font-bold">Trauma (τ)</div>
                                    <Activity className="w-5 h-5 text-red-400" />
                                </div>
                                <div className="text-4xl font-bold text-red-400 mb-3">{trauma.toFixed(2)}</div>
                                <div className="w-full h-2 bg-gray-800/80 rounded-full overflow-hidden">
                                    <div className="h-2 bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500" style={{ width: `${trauma * 100}%` }} />
                                </div>
                            </div>

                            {/* Entropy */}
                            <div className="bg-gradient-to-br from-yellow-900/30 to-gray-900/60 rounded-xl p-5 border border-yellow-500/20 shadow-lg shadow-yellow-900/10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-sm text-yellow-300 uppercase tracking-wider font-bold">Entropy (H)</div>
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div className="text-4xl font-bold text-yellow-400 mb-3">{entropy.toFixed(2)}</div>
                                <div className="w-full h-2 bg-gray-800/80 rounded-full overflow-hidden">
                                    <div className="h-2 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all duration-500" style={{ width: `${entropy * 100}%` }} />
                                </div>
                            </div>

                            {/* Lyapunov */}
                            <div className={`bg-gradient-to-br ${lyapunov < 0 ? 'from-green-900/30' : lyapunov < 0.1 ? 'from-yellow-900/30' : 'from-red-900/30'} to-gray-900/60 rounded-xl p-5 border ${lyapunov < 0 ? 'border-green-500/20 shadow-green-900/10' : lyapunov < 0.1 ? 'border-yellow-500/20 shadow-yellow-900/10' : 'border-red-500/20 shadow-red-900/10'} shadow-lg`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`text-sm uppercase tracking-wider font-bold ${stabilityColor}`}>Lyapunov (λ)</div>
                                    <Activity className={`w-5 h-5 ${stabilityColor}`} />
                                </div>
                                <div className={`text-4xl font-bold ${stabilityColor} mb-1`}>{lyapunov.toFixed(3)}</div>
                                <div className={`text-xs font-mono ${stabilityColor} opacity-80`}>{stabilityLabel}</div>
                            </div>
                        </div>
                    </div>

                    {/* Musical State - Compact Secondary Cards */}
                    <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-bold">Musical State</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* Tempo */}
                            <div className="bg-gray-900/60 rounded-lg p-3 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Music className="w-3 h-3 text-cyan-400" />
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Tempo</div>
                                </div>
                                <div className="text-2xl font-bold text-cyan-400">{tempo}</div>
                                <div className="text-xs text-gray-600 mt-1">BPM</div>
                            </div>

                            {/* Velocity */}
                            <div className="bg-gray-900/60 rounded-lg p-3 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-3 h-3 text-blue-400" />
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Velocity</div>
                                </div>
                                <div className="text-2xl font-bold text-blue-400">{velocity}</div>
                                <div className="text-xs text-gray-600 mt-1">{dynamicLabel}</div>
                            </div>

                            {/* Chord */}
                            <div className="bg-gray-900/60 rounded-lg p-3 border border-gold/20 hover:border-gold/40 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Music className="w-3 h-3 text-oxot-gold" />
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Chord</div>
                                </div>
                                <div className="text-2xl font-bold text-oxot-gold">{currentFrame?.script?.chord || 'Cm'}</div>
                            </div>

                            {/* BSI */}
                            <div className="bg-gray-900/60 rounded-lg p-3 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Layers className="w-3 h-3 text-purple-400" />
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">BSI</div>
                                </div>
                                <div className="text-2xl font-bold text-purple-400">{borromeanStability.toFixed(2)}</div>
                                <div className="text-xs text-gray-600 mt-1">Stability</div>
                            </div>
                        </div>
                    </div>

                    {/* Status Panel - Alert Style */}
                    <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-bold">System Status</div>
                        <div className={`rounded-xl p-4 border transition-all duration-300 ${trauma > 0.8 ? 'bg-red-900/40 border-red-500/50 shadow-lg shadow-red-900/30' : 'bg-gray-900/40 border-white/10'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className={`w-6 h-6 ${trauma > 0.8 ? 'text-red-400 animate-pulse' : 'text-gray-600'}`} />
                                    <div>
                                        <div className="text-sm uppercase tracking-wider text-gray-400 mb-1">Crisis Detection</div>
                                        <div className="flex items-center gap-2">
                                            {trauma > 0.8 ? (
                                                <span className="text-red-400 font-bold text-lg">ACTIVE</span>
                                            ) : (
                                                <span className="text-green-400 font-medium">Normal Operations</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {trauma > 0.8 && (
                                    <div className="hidden md:block text-right">
                                        <div className="text-xs text-gray-500 mb-1">Trauma Level</div>
                                        <div className="text-2xl font-bold text-red-400">{(trauma * 100).toFixed(0)}%</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Grid */}
            <section className="py-8 px-6 min-h-[60vh]">
                <div className="max-w-[95%] mx-auto">
                    {/* Conductor Score */}
                    <div className="bg-gray-950/80 rounded-2xl border border-white/10 overflow-hidden mb-8 shadow-2xl shadow-blue-900/10">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <Music className="w-4 h-4 text-oxot-gold" />
                                <h3 className="text-white font-semibold">Conductor's Score: {selectedScenario.title}</h3>
                            </div>
                            <span className="text-gray-500 text-xs">{scoreFrame?.staves?.length || 0} Staves</span>
                        </div>
                        <div className="p-6 relative">
                            {/* Score Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-blue-900/5 pointer-events-none" />
                            <div className="min-h-[600px] flex items-center justify-center">
                                <ConductorScoreView
                                    frame={scoreFrame as any}
                                    frames={scoreBuffer.slice(currentFrameIndex, currentFrameIndex + 4)}
                                    showChordSymbols={true}
                                    showDynamics={true}
                                    isPlaying={isPlaying}
                                    currentBeat={currentFrameIndex}
                                    totalFrames={selectedScenario.frames.length}
                                    currentFrameIndex={currentFrameIndex}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Phase Space Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Lorenz Attractor */}
                        <div className="bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
                            <div className="p-4 border-b border-white/10 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-oxot-gold" />
                                <h3 className="text-white font-semibold">Phase Space: Lorenz Attractor</h3>
                            </div>
                            <div className="h-[350px]">
                                <MPNExperiment_LorenzAttractor
                                    trauma={trauma}
                                    entropy={entropy}
                                    time={currentFrameIndex * 0.1}
                                />
                            </div>
                            <div className="p-3 bg-black/40 grid grid-cols-3 gap-2 text-xs font-mono">
                                <div>
                                    <span className="text-gray-500">X (Trauma)</span>
                                    <div className="text-red-400">{trauma.toFixed(2)}</div>
                                </div>
                                <div>
                                    <span className="text-gray-500">Y (Entropy)</span>
                                    <div className="text-yellow-400">{entropy.toFixed(2)}</div>
                                </div>
                                <div>
                                    <span className="text-gray-500">Z (λ)</span>
                                    <div className="text-blue-400">{lyapunov.toFixed(3)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Tonnetz Grid */}
                        <div className="bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
                            <div className="p-4 border-b border-white/10 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-oxot-gold" />
                                <h3 className="text-white font-semibold">Tonnetz Grid: Neo-Riemannian Torus</h3>
                            </div>
                            <div className="h-[350px]">
                                <MPNExperiment_TonnetzGrid
                                    trauma={trauma}
                                    entropy={entropy}
                                />
                            </div>
                            <div className="p-3 bg-black/40 text-xs font-mono text-gray-400">
                                Current Chord: <span className="text-oxot-gold">{currentFrame?.script?.chord || 'Cm'}</span> →
                                {lyapunov < 0 ? ' R (Symbolic)' : lyapunov < 0.1 ? ' L (Imaginary)' : ' P (Real)'}
                            </div>
                        </div>
                    </div>

                    {/* Leitmotif Registry */}
                    <div className="bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex items-center gap-2">
                            <BarChart className="w-4 h-4 text-oxot-gold" />
                            <h3 className="text-white font-semibold">Leitmotif Registry</h3>
                        </div>
                        <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {(scoreFrame?.staves || []).slice(0, 5).map((stave, i) => (
                                <div
                                    key={stave.actorId || i}
                                    className={`rounded-lg p-3 border ${stave.isSpeaking ? 'bg-oxot-gold/10 border-oxot-gold/50' : 'bg-black/40 border-white/10'}`}
                                >
                                    <div className={`text-sm font-medium mb-1 ${stave.isSpeaking ? 'text-oxot-gold' : 'text-white'}`}>
                                        {stave.actorName}
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono">
                                        {stave.instrument}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        Activation: {((stave.activation || 0) * 100).toFixed(0)}%
                                    </div>
                                </div>
                            ))}
                            {(!scoreFrame?.staves || scoreFrame.staves.length === 0) && (
                                <div className="col-span-full text-center text-gray-500 py-8">
                                    Press Play or Step Forward to generate score data
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-white/10 text-center text-gray-500 text-xs">
                <p>MPN Conductor Score v3.0 | Based on McKenney-Lacan Theory</p>
                <p className="mt-1">Canon v2.3 | {LITERARY_SCENARIOS.length} Scenarios | Full Psychometric Analysis</p>
            </footer>
        </main>
    );
}
