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

import React, { useState, useCallback, useEffect, useMemo, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import {
    BookOpen, Volume2, VolumeX, RotateCcw, BarChart, Users, Brain, AlertTriangle, FileDown, FileText, Sliders, Save, Activity, Zap, Music, Layers, ChevronDown, Play, Pause, SkipForward
} from 'lucide-react';
import Link from 'next/link';
import { OXOTLogo } from '@/components/branding/OXOTLogo';
import { PageHeader } from '@/components/branding/PageHeader';
import { MPNPresetAPI } from '@/components/mpn-lab/mpn_preset_api';
import { OrchestratorWorkerClient } from '@/components/mpn-lab/OrchestratorWorkerClient';
import { useMPNSynthesizer } from '@/components/mpn-lab/MPNSynthesizer';
import { LeadVoiceManager } from '@/components/mpn-lab/LeadVoiceManager';
import { ORCHESTRATION_MODES, type OrchestrationMode } from '@/components/mpn-lab/GeniusComposer';
import StyleSelector from '@/components/mpn-lab/StyleSelector';
import { OrchestratorDashboard } from '@/components/mpn-lab/OrchestratorDashboard';
import { AIModelSelector } from '@/components/conductor/AIModelSelector';
import type { AIModelSource } from '@/components/mpn-lab/GeniusComposer';

import { LITERARY_SCENARIOS, LiteraryScenario } from '@/components/mpn-lab/literary_data';
import { PsychometricScoreFrame, ActorStaveData, ActorProfile, ScoreVariant } from '@/components/mpn-lab/score_types';
import { downloadScorePDF } from '@/components/mpn-lab/score_exporter';
import ExportButton from '@/components/mpn-lab/ExportButton';

// ScriptViewer Component - displays dialogue frames in left panel
function ScriptViewer({ scenario, currentIndex, onFrameClick }: { scenario: LiteraryScenario, currentIndex: number, onFrameClick: (idx: number) => void }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            const activeEl = scrollRef.current.querySelector(`[data-frame="${currentIndex}"]`);
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentIndex]);

    return (
        <div ref={scrollRef} className="h-full overflow-y-auto custom-scrollbar p-8 space-y-6 pb-40">
            {scenario.frames.map((frame, idx) => (
                <div
                    key={idx}
                    data-frame={idx}
                    onClick={() => onFrameClick(idx)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${currentIndex === idx
                        ? 'bg-gray-800/80 border-gold/50 shadow-[0_0_15px_rgba(250,204,21,0.1)]'
                        : 'bg-gray-900/40 border-transparent hover:bg-gray-900 hover:border-white/10'
                        }`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-bold uppercase tracking-widest ${currentIndex === idx ? 'text-gold' : 'text-gray-500'}`}>
                            {frame.character || frame.script?.speaker || 'SCENE'}
                        </span>
                        <span className="text-[10px] font-mono text-gray-600">
                            #{idx + 1}
                        </span>
                    </div>
                    <p className={`text-sm leading-relaxed font-serif ${currentIndex === idx ? 'text-white' : 'text-gray-400'}`}>
                        {frame.name || frame.script?.text}
                    </p>
                    {frame.script?.analysis && (
                        <div className="mt-2 text-[10px] text-gray-500 border-l-2 border-gray-700 pl-2">
                            {frame.script.analysis}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}


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

function MPNConductorPageContent() {
    // Scenario state
    const [selectedScenario, setSelectedScenario] = useState<LiteraryScenario>(LITERARY_SCENARIOS[0]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const [actors, setActors] = useState<ActorProfile[]>([]);

    // Variant State
    const [currentVariant, setCurrentVariant] = useState<ScoreVariant | null>(null);
    const [isBoardOpen, setIsBoardOpen] = useState(false);

    // Orchestration Mode State
    const [orchestrationMode, setOrchestrationMode] = useState<OrchestrationMode>('FULL_ORCHESTRA' as OrchestrationMode);
    const [aiEnabled, setAiEnabled] = useState(false);
    const [aiModelSource, setAiModelSource] = useState<AIModelSource>('text2midi');
    const [aiTemperature, setAiTemperature] = useState(0.7);
    const [currentStyleId, setCurrentStyleId] = useState('orchestral'); // Musical style
    const [leadVoiceEnabled, setLeadVoiceEnabled] = useState(false);
    const [voiceManager, setVoiceManager] = useState<LeadVoiceManager | null>(null);
    const searchParams = useSearchParams();
    const [isLoadingScenario, setIsLoadingScenario] = useState(false);
    const [isDbScenario, setIsDbScenario] = useState(false); // Track if viewing a DB-loaded scenario

    // Combined scenario list: LITERARY_SCENARIOS + current DB scenario if loaded
    const availableScenarios = useMemo(() => {
        if (isDbScenario && !LITERARY_SCENARIOS.find(s => s.title === selectedScenario.title)) {
            return [selectedScenario, ...LITERARY_SCENARIOS];
        }
        return LITERARY_SCENARIOS;
    }, [isDbScenario, selectedScenario]);

    // Update Orchestration Mode
    useEffect(() => {
        orchestratorRef.current?.setOrchestrationMode(orchestrationMode);
    }, [orchestrationMode]);

    // Update Musical Style
    useEffect(() => {
        orchestratorRef.current?.setMusicalStyle(currentStyleId);
    }, [currentStyleId]);

    // Handle style change from selector
    const handleStyleChange = useCallback((styleId: string) => {
        setCurrentStyleId(styleId);
    }, []);

    // Load scenario from database if ID provided
    useEffect(() => {
        const scenarioId = searchParams.get('scenario');
        const variantId = searchParams.get('variant');

        if (!scenarioId && !variantId) return;

        const loadContent = async () => {
            setIsLoadingScenario(true);
            try {
                let playToLoad: any = null;

                if (variantId) {
                    // Load variant
                    const vRes = await fetch(`/api/variants/${variantId}`);
                    if (!vRes.ok) throw new Error('Failed to fetch variant');
                    const variant = await vRes.json();
                    setCurrentVariant(variant);

                    // Propagate overrides to orchestrator immediately if ready, or after init
                    orchestratorRef.current?.setVariantOverrides(variant);

                    // Fetch associated play
                    const pRes = await fetch(`/api/plays/${variant.play_id}`);
                    if (!pRes.ok) throw new Error('Failed to fetch play');
                    playToLoad = await pRes.json();
                } else if (scenarioId) {
                    const res = await fetch(`/api/plays/${scenarioId}`);
                    if (!res.ok) throw new Error('Failed to fetch scenario');
                    playToLoad = await res.json();
                    setCurrentVariant(null);
                    orchestratorRef.current?.setVariantOverrides(null);
                }

                if (playToLoad && playToLoad.processed_data) {
                    const data = playToLoad.processed_data;
                    const formattedScenario: LiteraryScenario = {
                        id: playToLoad.id,
                        title: playToLoad.title,
                        description: `Scenario: ${playToLoad.title} by ${data.author || 'Unknown'}`,
                        author: data.author || 'Unknown',
                        theme: data.theme || 'Drama',
                        color: data.color || '#F59E0B',
                        frames: data.frames || [],
                    };

                    // Clear stale score data from previous scenario
                    setScoreFrame(null);
                    setScoreBuffer([]);
                    setProcessedIndex(-1);
                    setCurrentFrameIndex(0);
                    setIsPlaying(false);
                    orchestratorRef.current?.reset();

                    setSelectedScenario(formattedScenario);
                    setIsDbScenario(true);
                    if (data.stylePreset) setCurrentStyleId(data.stylePreset);
                }
            } catch (err) {
                console.error('Error loading content:', err);
            } finally {
                setIsLoadingScenario(false);
            }
        };

        loadContent();
    }, [searchParams]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(2500); // ms between frames

    // Audio state
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [audioInitialized, setAudioInitialized] = useState(false);
    const [volume, setVolume] = useState(0.4);

    // Orchestrator Worker Client
    const orchestratorRef = useRef<OrchestratorWorkerClient | null>(null);
    const synth = useMPNSynthesizer();

    // Initialize Worker
    useEffect(() => {
        if (!orchestratorRef.current) {
            orchestratorRef.current = new OrchestratorWorkerClient();
        }
        return () => {
            // Optional: orchestratorRef.current?.terminate();
            // Keeping it alive for navigation efficiency, usually fine.
        };
    }, []);

    // Init Voice Manager
    useEffect(() => {
        if (!voiceManager && synth) {
            setVoiceManager(new LeadVoiceManager(synth));
        }
    }, [voiceManager, synth]);


    useEffect(() => {
        if (voiceManager) {
            voiceManager.setEnabled(leadVoiceEnabled);
        }
    }, [voiceManager, leadVoiceEnabled]);

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

    // RSI (Real-Symbolic-Imaginary) register values for style recommendation
    const rsi = {
        real: currentFrame?.real ?? 0.33,
        symbolic: currentFrame?.symbolic ?? 0.33,
        imaginary: currentFrame?.imaginary ?? 0.34
    };

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
            orchestratorRef.current?.updateAdjustments(adjustments);
        }
    }, []);

    // Register actors when scenario changes
    useEffect(() => {
        setScoreBuffer([]);
        setProcessedIndex(-1);
        setIsPlaying(false);
        setCurrentFrameIndex(0);

        if (orchestratorRef.current) {
            orchestratorRef.current.reset();

            // Extract unique speakers from all frames
            // Extract unique speakers from all frames
            const speakerSet = new Set<string>();
            selectedScenario.frames.forEach(frame => {
                // Check script.speaker first, then frame.character
                const speaker = frame.script?.speaker || frame.character;
                if (speaker) {
                    speakerSet.add(speaker);
                }
            });

            // If no speakers found (e.g. legacy data or purely instrumental), add default ensemble
            if (speakerSet.size === 0) {
                speakerSet.add('Instrumental Ensemble');
            }

            // Register each speaker as an actor
            const actors: ActorProfile[] = [];
            let index = 0;
            speakerSet.forEach(speaker => {
                actors.push(createActorProfile(speaker, index));
                index++;
            });

            setActors(actors);
            orchestratorRef.current.init(actors);

            // Re-apply variant overrides if they exist (since init might clear state or we just loaded)
            if (currentVariant) {
                orchestratorRef.current.setVariantOverrides(currentVariant);
            }

            console.log(`Initialized Orchestrator Worker with ${actors.length} actors for scenario: ${selectedScenario.title}`);
        }
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
                if (!orchestratorRef.current) return;

                orchestratorRef.current.setAIConfig(aiEnabled, aiTemperature);

                // Process frames sequentially from stored index + 1 up to target
                let nextIdx = processedIndex + 1;
                const newFrames: PsychometricScoreFrame[] = [];

                while (nextIdx <= targetIndex) {
                    const rawFrame = selectedScenario.frames[nextIdx];

                    // Robust script extraction with fallback speaker
                    const script = rawFrame.script || { speaker: '', text: '', chord: 'Cm', analysis: '' };

                    // If speaker is missing (legacy DB data), allow fallback to character field or default
                    if (!script.speaker) {
                        script.speaker = rawFrame.character || 'Instrumental Ensemble';
                    }

                    // Ensure text exists even if empty
                    if (!script.text) script.text = rawFrame.name || '...';

                    // We need to use current parameter states (trauma, etc)
                    // Note: This applies current UI knobs to future frames. 
                    // Ideally prompts would evolve, but for manual knobs this is expected.
                    const output = await orchestratorRef.current.processFrame(script, trauma, entropy);

                    const frame: PsychometricScoreFrame = {
                        frameIndex: nextIdx,
                        timestamp: Date.now(),
                        speaker: script.speaker,
                        scriptLine: script.text,
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

                // Trigger Voice if enabled and script line exists
                if (leadVoiceEnabled && voiceManager && frameToPlay.scriptLine && frameToPlay.speaker) {
                    voiceManager.speak(
                        frameToPlay.speaker,
                        frameToPlay.scriptLine,
                        { trauma, entropy }
                    );
                }

                if (trauma > 0.9) {
                    setTimeout(() => synth.playCrisisAlert(), 300);
                }
            }
        }
    }, [currentFrameIndex, scoreBuffer, audioEnabled, audioInitialized, isPlaying, leadVoiceEnabled, voiceManager, trauma, entropy]);

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
        orchestratorRef.current?.reset();
    };
    const handleScenarioChange = (scenario: LiteraryScenario) => {
        // Clear stale score data
        setScoreFrame(null);
        setScoreBuffer([]);
        setProcessedIndex(-1);
        orchestratorRef.current?.reset();

        setSelectedScenario(scenario);
        setCurrentFrameIndex(0);
        setIsPlaying(false);
    };

    const handleSaveScore = async () => {
        if (!currentVariant) return;

        // Build Score Object
        const score = {
            id: currentVariant.id,
            title: selectedScenario.title,
            source: selectedScenario.author,
            generatedAt: new Date().toISOString(),
            version: '1.0',
            actors: actors,
            leitmotifs: {}, // TODO: extract from Orchestrator
            frames: scoreBuffer,
            statistics: {
                totalFrames: selectedScenario.frames.length,
                duration: selectedScenario.frames.length * 4000,
                averageTrauma: selectedScenario.frames.reduce((sum, f) => sum + f.trauma, 0) / selectedScenario.frames.length,
                averageEntropy: selectedScenario.frames.reduce((sum, f) => sum + f.entropy, 0) / selectedScenario.frames.length,
                dominantKey: scoreFrame?.global?.key || 'C Major',
                dominantMode: 'Ionian'
            }
        };

        try {
            const res = await fetch(`/api/variants/${currentVariant.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    generated_score: score,
                    is_generated: true
                })
            });

            if (res.ok) {
                alert("Score saved to variant successfully!");
            } else {
                throw new Error("Failed to save");
            }
        } catch (e) {
            console.error("Save failed", e);
            alert("Failed to save score");
        }
    };


    const activeSpeakerLabel = currentFrame?.character || currentFrame?.script?.speaker;
    const activeActorId = activeSpeakerLabel ? activeSpeakerLabel.toLowerCase().replace(/\s+/g, '_') : null;

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
                                data-testid="ai-toggle"
                                onClick={() => setAiEnabled(!aiEnabled)}
                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all ${aiEnabled ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <span className="text-[10px] font-mono font-bold">AI</span>
                                <div className={`w-1.5 h-1.5 rounded-full ${aiEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                            </button>

                            {/* Voice Control */}
                            <button
                                onClick={() => setLeadVoiceEnabled(!leadVoiceEnabled)}
                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all ${leadVoiceEnabled ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <span className="text-[10px] font-mono font-bold">VOICE</span>
                                <div className={`w-1.5 h-1.5 rounded-full ${leadVoiceEnabled ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`} />
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
                                data-testid="scenario-selector"
                                value={selectedScenario.title}
                                onChange={(e) => {
                                    const s = availableScenarios.find(sc => sc.title === e.target.value);
                                    if (s) {
                                        handleScenarioChange(s);
                                        // If switching to a built-in scenario, clear DB flag
                                        if (LITERARY_SCENARIOS.find(sc => sc.title === s.title)) {
                                            setIsDbScenario(false);
                                        }
                                    }
                                }}
                                className="bg-transparent border-none text-sm text-white font-medium focus:outline-none cursor-pointer hover:text-gold transition-colors"
                            >
                                {availableScenarios.map(s => (
                                    <option key={s.title} value={s.title} className="bg-gray-900">
                                        {s.title}{isDbScenario && s.title === selectedScenario.title ? ' (Library)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <span className="text-gray-500 text-xs font-mono" data-testid="frame-counter">
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
                            data-testid="play-button"
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
                        {audioEnabled && !synth.isLoaded && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 rounded border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                <Activity className="w-3 h-3" />
                                <span>Loading Samples</span>
                            </div>
                        )}


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
                            <Link href="/play-library" className="p-2 rounded-full text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors" title="Library">
                                <FileText className="w-4 h-4" />
                            </Link>

                            {/* Orchestrator Board Toggle */}
                            {currentVariant && (
                                <button
                                    onClick={() => setIsBoardOpen(!isBoardOpen)}
                                    className={`p-2 rounded-full transition-colors ${isBoardOpen ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10'}`}
                                    title="Open Orchestrator Board"
                                >
                                    <Sliders className="w-4 h-4" />
                                </button>
                            )}

                            {/* MP3 Export Button */}
                            <ExportButton
                                frames={scoreBuffer}
                                title={selectedScenario.title}
                                author={selectedScenario.author}
                                scenario={selectedScenario.title}
                                tempo={tempo}
                                disabled={scoreBuffer.length === 0}
                            />

                            {/* Save Score Button */}
                            {currentVariant && (
                                <button
                                    onClick={handleSaveScore}
                                    className="p-2 rounded-full text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                                    title="Save Generated Score"
                                    disabled={scoreBuffer.length === 0}
                                >
                                    <Save className="w-4 h-4" />
                                </button>
                            )}

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

            {/* Split View Layout */}
            <div className="flex flex-1 overflow-hidden h-[calc(100vh-140px)]">
                {/* Left Panel: Script Viewer */}
                <div className="w-5/12 border-r border-white/10 bg-black/60 relative flex flex-col">
                    <ScriptViewer
                        scenario={selectedScenario}
                        currentIndex={currentFrameIndex}
                        onFrameClick={(idx) => {
                            setCurrentFrameIndex(idx);
                            orchestratorRef.current?.jumpToFrame(idx);
                        }}
                    />
                </div>

                {/* Right Panel: Orchestrator Dashboard & Score */}
                <div className="w-7/12 flex flex-col bg-gray-950">
                    {/* Top: Orchestrator Dashboard (Controls) */}
                    <div data-testid="orchestrator-dashboard" className="min-h-[500px] flex-1 border-b border-white/10 overflow-hidden relative">
                        {/* Pass derived actors if state is empty, to ensure the dashboard populates even if initial state is lagging */}
                        <OrchestratorDashboard
                            variant={currentVariant}
                            activeActorId={activeActorId}
                            actors={actors.length > 0 ? actors : (scoreFrame?.staves || []).map((s, i) => createActorProfile(s.actorName, i))}
                            onUpdateVariant={async (updated) => {
                                setCurrentVariant(updated);
                                orchestratorRef.current?.setVariantOverrides(updated);
                            }}
                            onGenerate={() => {
                                // Reset for new generation run
                                if (confirm('This will clear the current score buffer and restart the scenario. Continue?')) {
                                    setScoreBuffer([]);
                                    setProcessedIndex(-1);
                                    setCurrentFrameIndex(0);
                                    orchestratorRef.current?.reset();
                                    setIsPlaying(true);
                                }
                            }}
                            onSave={async () => {
                                if (!currentVariant) return;
                                try {
                                    // Save both overrides and the generated score buffer
                                    const response = await fetch(`/api/variants/${currentVariant.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            voice_overrides: currentVariant.voice_overrides || {},
                                            parameter_overrides: currentVariant.parameter_overrides || {},
                                            generated_score: {
                                                frames: scoreBuffer,
                                                metadata: {
                                                    savedAt: new Date().toISOString(),
                                                    frameCount: scoreBuffer.length,
                                                    finalTrauma: trauma,
                                                    finalEntropy: entropy
                                                }
                                            }
                                        })
                                    });
                                    if (!response.ok) throw new Error('Failed to save');
                                    alert('Variant and Generated Score saved successfully!');
                                } catch (e) {
                                    console.error("Failed to save variant", e);
                                    alert('Failed to save variant. Check console for details.');
                                }
                            }}
                            className="h-full w-full"
                        />
                    </div>

                    {/* Bottom: Score Visualization & Analysis */}
                    <div className="h-[400px] overflow-y-auto relative bg-black/80 flex flex-col">
                        {/* Metrics Bar */}
                        <div data-testid="metrics-bar" className="sticky top-0 z-10 flex items-center gap-4 px-4 py-2 bg-black/90 border-b border-white/10 text-xs font-mono">
                            <div className="flex items-center gap-2 text-red-400">
                                <Activity className="w-3 h-3" />
                                <span data-testid="trauma-value">Trauma: {trauma.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-yellow-400">
                                <Zap className="w-3 h-3" />
                                <span data-testid="entropy-value">Entropy: {entropy.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-400">
                                <Users className="w-3 h-3" />
                                <span>Stability: {borromeanStability.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Score View */}
                        <div data-testid="score-canvas-container" className="p-4 min-h-[300px]">
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
            </div>

            {/* Footer */}
            <footer className="py-8 border-t border-white/10 text-center text-gray-500 text-xs">
                <p>MPN Conductor Score v3.0 | Based on McKenney-Lacan Theory</p>
                <p className="mt-1">Canon v2.3 | {LITERARY_SCENARIOS.length} Scenarios | Full Psychometric Analysis</p>
            </footer>
        </main>
    );
}

// Wrap in Suspense for useSearchParams SSR compatibility
export default function MPNConductorPage() {
    return (
        <Suspense fallback={<LoadingPlaceholder label="Loading MPN Conductor..." />}>
            <MPNConductorPageContent />
        </Suspense>
    );
}
