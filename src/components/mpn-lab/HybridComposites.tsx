'use client';

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic imports for the hybrid components
const MPNExperiment_SevenBandWaveform = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_SevenBandWaveform'),
    { ssr: false }
);
const MPNExperiment_NeuralPropagation = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_NeuralPropagation'),
    { ssr: false }
);
const MPNExperiment_DialecticGraph = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_DialecticGraph'),
    { ssr: false }
);
const MPNExperiment_SpectralWaterfall = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_SpectralWaterfall'),
    { ssr: false }
);
const MPNExperiment_BorromeanKnot = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_BorromeanKnot'),
    { ssr: false }
);
const MPNExperiment_EpidemicPhase = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_EpidemicPhase'),
    { ssr: false }
);
const MPNExperiment_PercolationMap = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_PercolationMap'),
    { ssr: false }
);
const MPNExperiment_TensorHypercube = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_TensorHypercube'),
    { ssr: false }
);
const MPNExperiment_TonnetzGrid = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_TonnetzGrid'),
    { ssr: false }
);
const MPNExperiment_PersistenceBarcode = dynamic(
    () => import('@/components/mpn-lab/MPNExperiment_PersistenceBarcode'),
    { ssr: false }
);

interface HybridProps {
    trauma: number;
    entropy: number;
    time: number;
    focusLayer: number;
    script?: any; // Using any to avoid importing ScriptFrame type duplication, or could import
    scenarioName?: string;
}

/**
 * HYBRID A: The Conductor's Console
 * Combines: Seven-Band Waveform + Neural Propagation + Spectral Waterfall
 * Purpose: Complete operational view for the analyst
 */
export function HybridConductorConsole({ trauma, entropy, time, focusLayer, script, scenarioName }: HybridProps) {
    return (
        <div className="bg-black/40 border border-oxot-gold/30 rounded-xl p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <div className="text-oxot-gold font-bold flex items-center gap-2">
                        <span>🎼</span> Conductor&apos;s Console
                    </div>
                    <div className="text-[9px] text-gray-500 font-mono">
                        HYBRID A: Waveform + Neural Graph + Musical Score
                    </div>
                </div>
                <div className="text-[8px] font-mono text-gray-600">
                    Best for: Operational Monitoring
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {/* Top: Compact Waveform */}
                <div className="h-[100px]">
                    <MPNExperiment_SevenBandWaveform
                        time={time}
                        trauma={trauma}
                        entropy={entropy}
                        focusLayer={focusLayer}
                    />
                </div>

                {/* Center: Dialectic Graph (main focus - actors traverse through dialectic) */}
                <div className="h-[400px]">
                    <MPNExperiment_DialecticGraph
                        trauma={trauma}
                        entropy={entropy}
                        focusLayer={focusLayer}
                        script={script}
                        scenarioName={scenarioName}
                    />
                </div>

                {/* Bottom: Spectral Waterfall */}
                <div className="h-[150px]">
                    <MPNExperiment_SpectralWaterfall
                        trauma={trauma}
                        entropy={entropy}
                        time={time}
                    />
                </div>
            </div>

            <div className="mt-2 text-[8px] font-mono text-gray-600 text-center">
                TOP: Layer Activity | CENTER: Contagion Network | BOTTOM: Musical Output
            </div>
        </div>
    );
}

/**
 * HYBRID B: The Crisis Prophet
 * Combines: Percolation Map + Epidemic Phase + Borromean Knot
 * Purpose: Multi-modal crisis detection
 */
export function HybridCrisisProphet({ trauma, entropy }: HybridProps) {
    return (
        <div className="bg-black/40 border border-red-500/30 rounded-xl p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <div className="text-red-400 font-bold flex items-center gap-2">
                        <span>⚠️</span> Crisis Prophet
                    </div>
                    <div className="text-[9px] text-gray-500 font-mono">
                        HYBRID B: Percolation + Epidemic Phase + R/S/I Knot
                    </div>
                </div>
                <div className="text-[8px] font-mono text-gray-600">
                    Best for: Threshold Detection
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {/* Left: Percolation Map (WHERE) */}
                <div className="h-[280px]">
                    <MPNExperiment_PercolationMap
                        trauma={trauma}
                        entropy={entropy}
                    />
                </div>

                {/* Center: Epidemic Phase (WHEN) */}
                <div className="h-[280px]">
                    <MPNExperiment_EpidemicPhase
                        trauma={trauma}
                        entropy={entropy}
                    />
                </div>

                {/* Right: Borromean Knot (WHY) */}
                <div className="h-[280px]">
                    <MPNExperiment_BorromeanKnot
                        trauma={trauma}
                        entropy={entropy}
                    />
                </div>
            </div>

            <div className="mt-2 grid grid-cols-3 text-[8px] font-mono text-gray-600 text-center">
                <div>WHERE (Spatial)</div>
                <div>WHEN (Threshold)</div>
                <div>WHY (Structural)</div>
            </div>
        </div>
    );
}

/**
 * HYBRID C: The Theorist's Observatory
 * Combines: Tensor Hypercube + Tonnetz Grid + Persistence Barcode
 * Purpose: Maximum theoretical fidelity
 */
export function HybridTheoristObservatory({ trauma, entropy, time, focusLayer }: HybridProps) {
    return (
        <div className="bg-black/40 border border-purple-500/30 rounded-xl p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <div className="text-purple-400 font-bold flex items-center gap-2">
                        <span>🔬</span> Theorist&apos;s Observatory
                    </div>
                    <div className="text-[9px] text-gray-500 font-mono">
                        HYBRID C: Tensor Space + Harmonic Grid + Topological Barcode
                    </div>
                </div>
                <div className="text-[8px] font-mono text-gray-600">
                    Best for: Deep Analysis
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {/* Left: Tensor Hypercube (P tensor) */}
                <div className="h-[280px]">
                    <MPNExperiment_TensorHypercube
                        trauma={trauma}
                        entropy={entropy}
                    />
                </div>

                {/* Center: Tonnetz Grid (Harmonic) */}
                <div className="h-[280px]">
                    <MPNExperiment_TonnetzGrid
                        trauma={trauma}
                        entropy={entropy}
                    />
                </div>

                {/* Right: Persistence Barcode (Topology) */}
                <div className="h-[280px]">
                    <MPNExperiment_PersistenceBarcode
                        time={time}
                        trauma={trauma}
                        focusLayer={focusLayer}
                    />
                </div>
            </div>

            <div className="mt-2 grid grid-cols-3 text-[8px] font-mono text-gray-600 text-center">
                <div>P = DISC⊗OCEAN⊕...</div>
                <div>Neo-Riemannian</div>
                <div>H₁ Homology</div>
            </div>
        </div>
    );
}

export default function HybridComposites({ trauma, entropy, time, focusLayer, script, scenarioName }: HybridProps) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Hybrid Composite Views</h2>
                <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                    Combining top-performing experiments for specialized use cases
                </p>
            </div>

            <HybridConductorConsole trauma={trauma} entropy={entropy} time={time} focusLayer={focusLayer} script={script} scenarioName={scenarioName} />
            <HybridCrisisProphet trauma={trauma} entropy={entropy} time={time} focusLayer={focusLayer} />
            <HybridTheoristObservatory trauma={trauma} entropy={entropy} time={time} focusLayer={focusLayer} />
        </div>
    );
}
