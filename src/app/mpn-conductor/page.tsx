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

import React, { useState, useCallback, useEffect, useMemo } from 'react';
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

    // Generate score frame when frame changes
    useEffect(() => {
        if (!currentFrame) return;

        const updateScore = async () => {
            const script = currentFrame.script || { speaker: '', text: '', chord: 'Cm', analysis: '' };
            const orchestrator = getOrchestrator();

            // Ensure AI settings are synced
            orchestrator.setAIConfig(aiEnabled, aiTemperature);

            const output = await orchestrator.processFrame(script, trauma, entropy);

            // Convert orchestrator output to PsychometricScoreFrame
            const frame: PsychometricScoreFrame = {
                frameIndex: currentFrameIndex,
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

            setScoreFrame(frame);

            // Play audio if enabled
            if (audioEnabled && audioInitialized) {
                synth.playScore(frame.staves, frame.global.tempo);
                if (trauma > 0.9) {
                    setTimeout(() => synth.playCrisisAlert(), 300);
                }
            }
        };

        updateScore();
    }, [currentFrame, currentFrameIndex, trauma, entropy, lyapunov, tempo, dynamicLabel, velocity, aiEnabled, aiTemperature, audioEnabled, audioInitialized, synth]);

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
        setCurrentFrameIndex(0);
        setIsPlaying(false);
    };
    const handleScenarioChange = (scenario: LiteraryScenario) => {
        setSelectedScenario(scenario);
        setCurrentFrameIndex(0);
        setIsPlaying(false);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
            {/* Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center relative px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <OXOTLogo className="w-16 h-16 mx-auto mb-6" />
                    <PageHeader
                        title="CONDUCTOR'S SCORE"
                        subtitle="Psychometric Musical Notation // Real-Time Orchestration"
                        variant="hero"
                        accent="gold"
                    />
                    <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-lg">
                        Multi-stave musical score generation from psychometric analysis.
                        Each actor receives a unique stave driven by DISC, OCEAN, Dark Triad,
                        and cognitive bias profiles.
                    </p>
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
            <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 py-3 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
                    {/* Scenario Selector */}
                    <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-xs uppercase">Scenario:</span>
                        <select
                            value={selectedScenario.title}
                            onChange={(e) => {
                                const s = LITERARY_SCENARIOS.find(sc => sc.title === e.target.value);
                                if (s) handleScenarioChange(s);
                            }}
                            className="bg-gray-900 border border-white/20 rounded px-3 py-1 text-sm text-white"
                        >
                            {LITERARY_SCENARIOS.map(s => (
                                <option key={s.title} value={s.title}>{s.title}</option>
                            ))}
                        </select>
                        <span className="text-gray-600 text-xs">
                            Frame {currentFrameIndex + 1} / {selectedScenario.frames.length}
                        </span>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleReset}
                            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
                            title="Reset"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handlePlay}
                            className={`p-2 rounded-full ${isPlaying ? 'bg-red-600' : 'bg-oxot-gold'} text-black`}
                            title={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleNextFrame}
                            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
                            title="Next Frame"
                        >
                            <SkipForward className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Audio Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleEnableAudio}
                            className={`p-2 rounded-full ${audioEnabled ? 'bg-green-600' : 'bg-gray-800'} text-white`}
                            title={audioEnabled ? 'Mute Audio' : 'Enable Audio'}
                        >
                            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>
                        {audioEnabled && (
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume * 100}
                                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                                className="w-16 h-1 bg-gray-700 rounded cursor-pointer"
                            />
                        )}
                    </div>

                    {/* Lyapunov Indicator */}
                    <div className="flex items-center gap-3">
                        <Activity className={`w-4 h-4 ${stabilityColor}`} />
                        <span className={`text-sm font-mono ${stabilityColor}`}>
                            λ = {lyapunov.toFixed(2)} [{stabilityLabel}]
                        </span>
                    </div>

                    {/* Reference Link */}
                    <Link
                        href="/mpn-reference"
                        className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-oxot-gold transition-colors border border-white/10"
                        title="Open MPN Reference Dictionary"
                    >
                        <BookOpen className="w-4 h-4" />
                        <span className="hidden md:inline text-xs font-mono uppercase tracking-wider">Reference</span>
                    </Link>

                    {/* Library Link */}
                    <Link
                        href="/play-library"
                        className="flex items-center gap-2 px-3 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 hover:text-amber-400 transition-colors border border-amber-500/20"
                        title="Manage Scripts"
                    >
                        <FileText className="w-4 h-4" />
                        <span className="hidden md:inline text-xs font-mono uppercase tracking-wider">Library</span>
                    </Link>

                    {/* PDF Export */}
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
                        className="flex items-center gap-2 px-3 py-1.5 rounded bg-green-600/20 hover:bg-green-600/40 text-green-400 hover:text-green-300 transition-colors border border-green-500/30"
                        title="Export Score as PDF"
                    >
                        <FileDown className="w-4 h-4" />
                        <span className="hidden md:inline text-xs font-mono uppercase tracking-wider">PDF</span>
                    </button>
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
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-5 h-5 text-oxot-gold" />
                        <h2 className="text-white font-semibold">Psychometric Analysis</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                        {/* Trauma */}
                        <div className="bg-gray-900/60 rounded-lg p-3 border border-white/10">
                            <div className="text-xs text-gray-500 uppercase mb-1">Trauma (τ)</div>
                            <div className="text-xl font-bold text-red-400">{trauma.toFixed(2)}</div>
                            <div className="w-full h-1 bg-gray-800 rounded mt-2">
                                <div className="h-1 bg-red-500 rounded" style={{ width: `${trauma * 100}%` }} />
                            </div>
                        </div>
                        {/* Entropy */}
                        <div className="bg-gray-900/60 rounded-lg p-3 border border-white/10">
                            <div className="text-xs text-gray-500 uppercase mb-1">Entropy (H)</div>
                            <div className="text-xl font-bold text-yellow-400">{entropy.toFixed(2)}</div>
                            <div className="w-full h-1 bg-gray-800 rounded mt-2">
                                <div className="h-1 bg-yellow-500 rounded" style={{ width: `${entropy * 100}%` }} />
                            </div>
                        </div>
                        {/* Velocity */}
                        <div className="bg-gray-900/60 rounded-lg p-3 border border-white/10">
                            <div className="text-xs text-gray-500 uppercase mb-1">Velocity</div>
                            <div className="text-xl font-bold text-blue-400">{velocity}</div>
                            <div className="text-xs text-gray-600 mt-1">{dynamicLabel}</div>
                        </div>
                        {/* Tempo */}
                        <div className="bg-gray-900/60 rounded-lg p-3 border border-white/10">
                            <div className="text-xs text-gray-500 uppercase mb-1">Tempo</div>
                            <div className="text-xl font-bold text-cyan-400">{tempo}</div>
                            <div className="text-xs text-gray-600 mt-1">BPM</div>
                        </div>
                        {/* Lyapunov */}
                        <div className="bg-gray-900/60 rounded-lg p-3 border border-white/10">
                            <div className="text-xs text-gray-500 uppercase mb-1">Lyapunov (λ)</div>
                            <div className={`text-xl font-bold ${stabilityColor}`}>{lyapunov.toFixed(3)}</div>
                            <div className="text-xs text-gray-600 mt-1">{stabilityLabel}</div>
                        </div>
                        {/* BSI */}
                        <div className="bg-gray-900/60 rounded-lg p-3 border border-white/10">
                            <div className="text-xs text-gray-500 uppercase mb-1">BSI</div>
                            <div className="text-xl font-bold text-purple-400">{borromeanStability.toFixed(2)}</div>
                            <div className="text-xs text-gray-600 mt-1">Stability</div>
                        </div>
                        {/* Chord */}
                        <div className="bg-gray-900/60 rounded-lg p-3 border border-white/10">
                            <div className="text-xs text-gray-500 uppercase mb-1">Chord</div>
                            <div className="text-xl font-bold text-oxot-gold">{currentFrame?.script?.chord || 'Cm'}</div>
                        </div>
                        {/* Crisis */}
                        <div className={`rounded-lg p-3 border ${trauma > 0.8 ? 'bg-red-900/40 border-red-500/50' : 'bg-gray-900/60 border-white/10'}`}>
                            <div className="text-xs text-gray-500 uppercase mb-1">Crisis</div>
                            <div className="flex items-center gap-2">
                                {trauma > 0.8 ? (
                                    <>
                                        <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                                        <span className="text-red-400 font-bold">ACTIVE</span>
                                    </>
                                ) : (
                                    <span className="text-green-400">None</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Grid */}
            <section className="py-8 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Conductor Score */}
                    <div className="bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden mb-8">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Music className="w-4 h-4 text-oxot-gold" />
                                <h3 className="text-white font-semibold">Conductor's Score: {selectedScenario.title}</h3>
                            </div>
                            <span className="text-gray-500 text-xs">{scoreFrame?.staves?.length || 0} Staves</span>
                        </div>
                        <div className="p-4">
                            <ConductorScoreView
                                frame={scoreFrame as any}
                                showChordSymbols={true}
                                showDynamics={true}
                                isPlaying={isPlaying}
                                currentBeat={currentFrameIndex}
                                totalFrames={selectedScenario.frames.length}
                                currentFrameIndex={currentFrameIndex}
                            />
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
        </main >
    );
}
