'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import MPNLabControls from '@/components/mpn-lab/MPNLabControls';
import MPNPsychoacousticScore from '@/components/mpn-lab/MPNPsychoacousticScore';
// Static imports removed in favor of dynamic imports below

import MPNEvaluationSection from '@/components/mpn-lab/MPNEvaluationSection';
import ScenarioDriver from '@/components/mpn-lab/ScenarioDriver';
import HybridComposites from '@/components/mpn-lab/HybridComposites';
import { OXOTLogo } from '@/components/branding/OXOTLogo';
import { PageHeader } from '@/components/branding/PageHeader';

// Dynamic imports for 3D components to avoid SSR issues
const MPNExperiment_SevenBandWaveform = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_SevenBandWaveform'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading Waveform..." /> }
);
const MPNExperiment_PersistenceBarcode = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_PersistenceBarcode'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading Barcode..." /> }
);
const MPNExperiment_TuringPatterns = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_TuringPatterns'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading Turing..." /> }
);
const MPNExperiment_NeuralPlasma = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_NeuralPlasma'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading Plasma..." /> }
);
const MPNExperiment_NeuralPropagation = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_NeuralPropagation'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading Neural Prop..." /> }
);
const MPNExperiment_EpidemicPhase = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_EpidemicPhase'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading Epidemic..." /> }
);
const MPNExperiment_SpectralWaterfall = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_SpectralWaterfall'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading Waterfall..." /> }
);
const MPNExperiment_PercolationMap = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_PercolationMap'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading Percolation..." /> }
);

const MPNExperiment_TonnetzGrid = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_TonnetzGrid'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading Tonnetz..." /> }
);

const MPNExperiment_StateEvolution7D = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_StateEvolution7D'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading 7D State..." /> }
);

const MPNExperiment_BorromeanKnot = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_BorromeanKnot'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading Borromean Knot..." /> }
);

const MPNExperiment_LorenzAttractor = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_LorenzAttractor'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading Lorenz Attractor..." /> }
);

const MPNExperiment_TensorHypercube = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_TensorHypercube'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading Tensor Hypercube..." /> }
);

const MPNExperiment_NematicDirector = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_NematicDirector'),
    { ssr: false, loading: () => <ExperimentPlaceholder label="Loading Nematic Director..." /> }
);

// Placeholder component
function ExperimentPlaceholder({ label }: { label: string }) {
    return (
        <div className="w-full h-full bg-black/40 rounded-xl animate-pulse flex items-center justify-center">
            <span className="text-gray-500 text-sm font-mono">{label}</span>
        </div>
    );
}

// Section navigation IDs
const SECTIONS = [
    { id: 'experiments', label: 'Experiments (13)' },
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'scenarios', label: 'Scenario Testing' },
    { id: 'hybrids', label: 'Hybrid Composites' },
];

export default function MPNLabPage() {
    // Shared state for all experiments
    const [time, setTime] = useState(0);
    const [trauma, setTrauma] = useState(0.25);
    const [entropy, setEntropy] = useState(0.4);
    const [focusLayer, setFocusLayer] = useState(-1); // -1 = All layers

    // Scenario override state
    const [scenarioActive, setScenarioActive] = useState(false);
    const [scenarioInfo, setScenarioInfo] = useState<{ name: string; frame: string }>({ name: '', frame: '' });
    const [currentScript, setCurrentScript] = useState<{ speaker: string; text: string; chord: string; analysis: string } | undefined>(undefined);

    // Callback for scenario driver
    const handleScenarioChange = useCallback((
        newTrauma: number,
        newEntropy: number,
        newFocusLayer: number,
        scenarioName: string,
        frameName: string,
        script?: { speaker: string; text: string; chord: string; analysis: string }
    ) => {
        setTrauma(newTrauma);
        setEntropy(newEntropy);
        setFocusLayer(newFocusLayer);
        setScenarioActive(true);
        setScenarioInfo({ name: scenarioName, frame: frameName });
        setCurrentScript(script);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative h-[20vh] flex flex-col items-center justify-center border-b border-white/10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <OXOTLogo size="md" animated={true} />
                    <PageHeader
                        title="MPN LABORATORY"
                        subtitle="Neural Network Evaluation Framework // Divergent Visualization Testing"
                        variant="hero"
                        accent="gold"
                        className="mt-4"
                    />
                </motion.div>
            </section>

            {/* Section Navigation */}
            <section className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
                    <div className="flex gap-1">
                        {SECTIONS.map(section => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                            >
                                {section.label}
                            </a>
                        ))}
                    </div>

                    {/* Scenario Active Indicator */}
                    {scenarioActive && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 px-3 py-1 bg-oxot-gold/10 border border-oxot-gold/30 rounded-full"
                        >
                            <span className="w-2 h-2 bg-oxot-gold rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-mono text-oxot-gold">
                                {scenarioInfo.name}: {scenarioInfo.frame}
                            </span>
                            <button
                                onClick={() => setScenarioActive(false)}
                                className="text-oxot-gold hover:text-white ml-1"
                            >
                                ×
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Controls Section */}
            <section className="py-4 px-4 max-w-7xl mx-auto">
                <MPNLabControls
                    time={time}
                    setTime={setTime}
                    trauma={trauma}
                    setTrauma={setTrauma}
                    entropy={entropy}
                    setEntropy={setEntropy}
                    focusLayer={focusLayer}
                    setFocusLayer={setFocusLayer}
                />
            </section>

            {/* SECTION 1: Experiments Grid - 3 Rows */}
            <section id="experiments" className="px-4 pb-8 max-w-[1900px] mx-auto scroll-mt-16">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">13 Visualization Experiments</h2>
                    <p className="text-gray-500 text-sm">Conventional • Topology/Dynamics • Neural Physics</p>
                </div>

                {/* Row 1: Conventional Approaches (1-4) */}
                <div className="mb-6">
                    <div className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-2 px-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                        Conventional Approaches (1-4)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[280px]">
                            <MPNExperiment_SevenBandWaveform time={time} trauma={trauma} entropy={entropy} focusLayer={focusLayer} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[280px]">
                            <MPNExperiment_TonnetzGrid trauma={trauma} entropy={entropy} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[280px]">
                            <MPNExperiment_PersistenceBarcode time={time} trauma={trauma} focusLayer={focusLayer} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[280px]">
                            <MPNExperiment_StateEvolution7D trauma={trauma} entropy={entropy} focusLayer={focusLayer} />
                        </motion.div>
                    </div>
                </div>

                {/* Row 2: Radical Experiments I (5-8) - Topology/Dynamics */}
                <div className="mb-6">
                    <div className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-2 px-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                        Radical I — Topology &amp; Dynamics (5-8)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[280px]">
                            <MPNExperiment_BorromeanKnot trauma={trauma} entropy={entropy} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[280px]">
                            <MPNExperiment_LorenzAttractor trauma={trauma} entropy={entropy} time={time} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[280px]">
                            <MPNExperiment_TuringPatterns trauma={trauma} entropy={entropy} focusLayer={focusLayer} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[280px]">
                            <MPNExperiment_NeuralPlasma trauma={trauma} entropy={entropy} focusLayer={focusLayer} />
                        </motion.div>
                    </div>
                </div>

                {/* Row 3: Radical Experiments II (9-13) - Physics/Neural */}
                <div className="mb-6">
                    <div className="text-xs font-mono text-oxot-gold uppercase tracking-widest mb-2 px-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-oxot-gold rounded-full animate-pulse"></span>
                        Radical II — Neural Physics (9-13)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[280px]">
                            <MPNExperiment_NeuralPropagation
                                trauma={trauma}
                                entropy={entropy}
                                focusLayer={focusLayer}
                                script={currentScript}
                                scenarioName={scenarioInfo.name}
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[280px]">
                            <MPNExperiment_EpidemicPhase trauma={trauma} entropy={entropy} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[280px]">
                            <MPNExperiment_TensorHypercube trauma={trauma} entropy={entropy} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[280px]">
                            <MPNExperiment_SpectralWaterfall trauma={trauma} entropy={entropy} time={time} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[280px]">
                            <MPNExperiment_PercolationMap trauma={trauma} entropy={entropy} />
                        </motion.div>
                    </div>
                </div>


                {/* Row 4: The Breakthrough (14) - Active Matter */}
                <div className="mb-6">
                    <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-2 px-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                        Breakthrough — Active Matter Swarm (14)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-3">
                        <div className="h-[400px] border border-purple-500/30 rounded-xl overflow-hidden relative">
                            <div className="absolute top-2 left-3 z-10 flex flex-col">
                                <span className="text-xs font-bold text-white tracking-widest">THE NEMATIC DIRECTOR</span>
                                <span className="text-[9px] text-purple-300 font-mono">ACTIVE STRESS: {(trauma * 4.5 + 0.5).toFixed(2)} // DEFECTS: {trauma > 0.6 ? 'NUCLEATING' : 'STABLE'}</span>
                            </div>
                            <MPNExperiment_NematicDirector trauma={trauma} entropy={entropy} focusLayer={focusLayer} />
                        </div>
                    </div>
                </div>
            </section >

            {/* SECTION 2: Evaluation */}
            < section id="evaluation" className="px-4 py-8 max-w-7xl mx-auto border-t border-white/10 scroll-mt-16" >
                <MPNEvaluationSection />
            </section >

            {/* SECTION 3: Scenario Testing */}
            < section id="scenarios" className="px-4 py-8 max-w-7xl mx-auto border-t border-white/10 scroll-mt-16" >
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Literary Scenario Testing</h2>
                    <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                        Test visualizations with dramatic arcs from Hamlet, Oedipus Rex, and Macbeth.
                        Play scenarios to drive all experiments with realistic crisis progressions.
                    </p>
                </div>
                <ScenarioDriver onScenarioChange={handleScenarioChange} />
            </section >

            {/* SECTION 4: Hybrid Composites */}
            <section id="hybrids" className="px-4 py-8 max-w-7xl mx-auto border-t border-white/10 scroll-mt-16">
                {/* Psychoacoustic Script Overlay - Positioned above Console */}
                <MPNPsychoacousticScore
                    script={currentScript}
                    trauma={trauma}
                    entropy={entropy}
                    focusLayer={focusLayer}
                    scenarioName={scenarioInfo.name}
                />

                <HybridComposites
                    trauma={trauma}
                    entropy={entropy}
                    time={time}
                    focusLayer={focusLayer}
                    script={currentScript}
                    scenarioName={scenarioInfo.name}
                />
            </section>

            {/* Theory Links */}
            < section className="py-8 px-4 max-w-7xl mx-auto border-t border-white/10" >
                <h2 className="text-lg font-bold text-white mb-4">Underlying Theory</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {[
                        { id: 'RSCH-39', name: 'Musical Psychometrics' },
                        { id: 'RSCH-40', name: 'Orchestral Manifolds' },
                        { id: 'RSCH-41', name: 'Seven-Staff Fugue' },
                        { id: 'RSCH-42', name: 'Visualization Physics', highlight: true },
                        { id: 'RSCH-07', name: 'Psychometric Tensors' },
                        { id: 'RSCH-33/34', name: 'Dark Triad + Biases' },
                    ].map(doc => (
                        <div key={doc.id} className="p-3 bg-black/40 border border-white/10 rounded-lg">
                            <div className={`text-[8px] font-mono uppercase tracking-wider mb-1 ${doc.highlight ? 'text-cyan-400' : 'text-oxot-gold'}`}>{doc.id}</div>
                            <div className="text-white text-sm font-medium">{doc.name}</div>
                        </div>
                    ))}
                </div>
            </section >

            {/* Footer Stats */}
            < section className="py-4 px-4 max-w-7xl mx-auto border-t border-white/5 mb-8" >
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-black text-white">14</div>
                        <div className="text-[9px] font-mono text-gray-500 uppercase">Experiments</div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white">8</div>
                        <div className="text-[9px] font-mono text-gray-500 uppercase">Criteria</div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white">3</div>
                        <div className="text-[9px] font-mono text-gray-500 uppercase">Scenarios</div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white">3</div>
                        <div className="text-[9px] font-mono text-gray-500 uppercase">Hybrids</div>
                    </div>
                </div>
            </section >
        </div >
    );
}
