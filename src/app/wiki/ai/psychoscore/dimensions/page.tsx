'use client';

import Link from 'next/link';
import { ArrowLeft, Database, Brain, Users, AlertTriangle, Gauge, Atom, Shield } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * PSYCHOSCORE 57D Input Space Documentation
 * 
 * Comprehensive documentation of all psychometric dimensions used
 * in the PSYCHOSCORE model.
 * 
 * Updated: 2026-01-05 07:15 CST
 * Version: 1.0.0
 */

function useMermaid() {
    const initialized = useRef(false);
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            window.mermaid?.initialize({ startOnLoad: true, theme: 'dark' });
            // @ts-ignore
            window.mermaid?.run();
        };
        document.head.appendChild(script);
    }, []);
}

function DimensionCard({
    icon,
    title,
    dimensions,
    description,
    color,
    tokens
}: {
    icon: React.ReactNode;
    title: string;
    dimensions: string;
    description: string;
    color: string;
    tokens: string[];
}) {
    return (
        <div className={`p-6 rounded-xl border ${color} bg-white/5`}>
            <div className="flex items-center gap-3 mb-4">
                {icon}
                <div>
                    <h4 className="font-semibold">{title}</h4>
                    <span className="text-xs text-white/50">{dimensions}</span>
                </div>
            </div>
            <p className="text-sm text-white/70 mb-4">{description}</p>
            <div className="flex flex-wrap gap-2">
                {tokens.map((token, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-black/30 text-xs font-mono text-white/60">
                        {token}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function DimensionsPage() {
    useMermaid();

    return (
        <div className="min-h-screen bg-black">
            <header className="border-b border-white/10 px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-lg z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/wiki/ai/psychoscore" className="flex items-center gap-2 text-white/60 hover:text-white transition">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to PSYCHOSCORE</span>
                        </Link>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                                <Database className="w-4 h-4 text-pink-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">57D Input Space</h1>
                                <p className="text-xs text-white/40">PSYCHOSCORE → Dimensions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Title */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        <span className="text-pink-400">57-Dimensional</span> Psychometric Input Space
                    </h2>
                    <p className="text-lg text-white/60">
                        PSYCHOSCORE integrates multiple established psychological frameworks into a unified
                        57-dimensional input vector for music generation.
                    </p>
                </div>

                {/* Dimension Breakdown */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Dimension Breakdown</h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 mb-6">
                        <div className="mermaid">
                            {`pie title PSYCHOSCORE 57D Input Distribution
    "DISC Personality" : 4
    "OCEAN (Big Five)" : 5
    "Lacanian RSI" : 3
    "McKenney-Lacan" : 2
    "Dark Triad" : 3
    "Cognitive Biases" : 30
    "Physics State" : 10`}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Framework</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Dimensions</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Range</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Music Mapping</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-medium text-red-400">DISC</td>
                                    <td className="py-3 px-4">4</td>
                                    <td className="py-3 px-4 font-mono">[0, 1]</td>
                                    <td className="py-3 px-4">Tempo, dynamics, articulation</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-medium text-blue-400">OCEAN</td>
                                    <td className="py-3 px-4">5</td>
                                    <td className="py-3 px-4 font-mono">[0, 1]</td>
                                    <td className="py-3 px-4">Harmonic complexity, texture</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-medium text-purple-400">Lacanian RSI</td>
                                    <td className="py-3 px-4">3</td>
                                    <td className="py-3 px-4 font-mono">[0, 1] (sum=1)</td>
                                    <td className="py-3 px-4">Mode selection (Phrygian/Major/Dorian)</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-medium text-amber-400">McKenney-Lacan</td>
                                    <td className="py-3 px-4">2</td>
                                    <td className="py-3 px-4 font-mono">[0, 1]</td>
                                    <td className="py-3 px-4">Trauma→dissonance, Entropy→variation</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-medium text-red-500">Dark Triad</td>
                                    <td className="py-3 px-4">3</td>
                                    <td className="py-3 px-4 font-mono">[0, 1]</td>
                                    <td className="py-3 px-4">Orchestration intensity, register</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-medium text-emerald-400">Cognitive Biases</td>
                                    <td className="py-3 px-4">30</td>
                                    <td className="py-3 px-4 font-mono">{'{0, 1}'}</td>
                                    <td className="py-3 px-4">Motif transformations, repetition</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium text-cyan-400">Physics State</td>
                                    <td className="py-3 px-4">10</td>
                                    <td className="py-3 px-4 font-mono">varies</td>
                                    <td className="py-3 px-4">Energy flow, phase transitions</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Detailed Frameworks */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-6">Framework Details</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <DimensionCard
                            icon={<Users className="w-6 h-6 text-red-400" />}
                            title="DISC Personality Model"
                            dimensions="4 Dimensions"
                            color="border-red-500/30"
                            description="Marston's behavioral assessment measuring workplace communication styles and interaction preferences."
                            tokens={['DISC_D', 'DISC_I', 'DISC_S', 'DISC_C']}
                        />

                        <DimensionCard
                            icon={<Brain className="w-6 h-6 text-blue-400" />}
                            title="OCEAN (Big Five)"
                            dimensions="5 Dimensions"
                            color="border-blue-500/30"
                            description="Costa & McCrae's five-factor model of personality, the most empirically validated trait taxonomy."
                            tokens={['OCEAN_O', 'OCEAN_C', 'OCEAN_E', 'OCEAN_A', 'OCEAN_N']}
                        />

                        <DimensionCard
                            icon={<div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-xs font-bold">RSI</div>}
                            title="Lacanian RSI Registers"
                            dimensions="3 Dimensions"
                            color="border-purple-500/30"
                            description="Jacques Lacan's tripartite model of psychic registers: Real (unsymbolizable), Symbolic (language/law), Imaginary (ego/identification)."
                            tokens={['RSI_REAL', 'RSI_SYMBOLIC', 'RSI_IMAGINARY']}
                        />

                        <DimensionCard
                            icon={<Gauge className="w-6 h-6 text-amber-400" />}
                            title="McKenney-Lacan Parameters"
                            dimensions="2 Dimensions"
                            color="border-amber-500/30"
                            description="Trauma coefficient (τ) and Shannon entropy (H) from the McKenney-Lacan applied theory framework."
                            tokens={['TRAUMA', 'ENTROPY']}
                        />

                        <DimensionCard
                            icon={<Shield className="w-6 h-6 text-red-500" />}
                            title="Dark Triad"
                            dimensions="3 Dimensions"
                            color="border-red-600/30"
                            description="Paulhus & Williams' subclinical personality construct measuring Machiavellianism, Narcissism, and Psychopathy."
                            tokens={['DARK_MACH', 'DARK_NARC', 'DARK_PSYC']}
                        />

                        <DimensionCard
                            icon={<Atom className="w-6 h-6 text-cyan-400" />}
                            title="Physics State"
                            dimensions="10 Dimensions"
                            color="border-cyan-500/30"
                            description="Grand Unified Codex physics parameters: Hamiltonian energy, Ising coupling, Granovetter threshold, Lyapunov exponent."
                            tokens={['HAMILTONIAN', 'ISING_J', 'GRANOVETTER', 'LYAPUNOV']}
                        />
                    </div>
                </section>

                {/* Cognitive Biases */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-emerald-400" />
                        Cognitive Biases (30 Dimensions)
                    </h3>
                    <p className="text-white/70 mb-4">
                        Based on Kahneman & Tversky's heuristics and biases research, encoded as binary flags
                        indicating active cognitive distortions.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {[
                            'CONFIRMATION', 'ANCHORING', 'AVAILABILITY', 'HINDSIGHT', 'SUNK_COST',
                            'FRAMING', 'LOSS_AVERSION', 'BANDWAGON', 'DUNNING_KRUGER', 'HALO',
                            'AUTHORITY', 'PROJECTION', 'IN_GROUP', 'JUST_WORLD', 'NEGATIVITY',
                            'OPTIMISM', 'PESSIMISM', 'REACTANCE', 'SELF_SERVING', 'SPOTLIGHT',
                            'STATUS_QUO', 'STEREOTYPING', 'SURVIVORSHIP', 'ZERO_SUM', 'OMISSION',
                            'PEAK_END', 'PLANNING', 'RECENCY', 'PRIMACY', 'CLUSTERING'
                        ].map((bias, i) => (
                            <span key={i} className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300">
                                BIAS_{bias}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Token Vocabulary */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Token Vocabulary Structure</h3>
                    <pre className="bg-black/60 border border-white/10 rounded-lg p-4 overflow-x-auto text-sm text-emerald-300 font-mono">
                        {`# Total Vocabulary: 1,700+ tokens

# Special Tokens (10)
[PAD], [BOS], [EOS], [SEP], [UNK], [PROFILE_START], [PROFILE_END],
[MUSIC_START], [MUSIC_END], [MASK]

# Psychometric Tokens (57)
DISC_D_0.0, DISC_D_0.1, ..., DISC_D_1.0  # 11 levels × 4 = 44
OCEAN_O_0.0, ..., OCEAN_N_1.0            # 11 levels × 5 = 55
RSI_REAL_0.0, ..., RSI_IMAGINARY_1.0     # 11 levels × 3 = 33
TRAUMA_0.0, ..., TRAUMA_1.0              # 11 levels
ENTROPY_0.0, ..., ENTROPY_1.0            # 11 levels
DARK_MACH_0.0, ..., DARK_PSYC_1.0        # 11 levels × 3 = 33
BIAS_CONFIRMATION, BIAS_ANCHORING, ...   # 30 binary tokens

# MIDI Tokens (REMI-style)
NOTE_ON_C4, NOTE_ON_D4, ..., NOTE_ON_B7  # 88 notes
NOTE_OFF_C4, NOTE_OFF_D4, ...            # 88 notes
DURATION_1/16, DURATION_1/8, ...         # 16 durations
VELOCITY_pp, VELOCITY_p, ..., VELOCITY_ff # 8 dynamics
BAR_1, BAR_2, ..., BAR_128               # 128 bar markers
TEMPO_60, TEMPO_120, ...                 # Tempo markers
TIME_SIG_4/4, TIME_SIG_3/4, ...          # Time signatures`}
                    </pre>
                </section>

                {/* Music Mapping Details */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Psychometric → Music Mapping</h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-semibold text-purple-400 mb-2">RSI → Mode Selection</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="p-3 rounded bg-purple-500/10">
                                    <div className="font-mono text-purple-300">Real-dominant</div>
                                    <div className="text-white/50">→ Phrygian (dark)</div>
                                </div>
                                <div className="p-3 rounded bg-blue-500/10">
                                    <div className="font-mono text-blue-300">Symbolic-dominant</div>
                                    <div className="text-white/50">→ Major/Ionian (bright)</div>
                                </div>
                                <div className="p-3 rounded bg-pink-500/10">
                                    <div className="font-mono text-pink-300">Imaginary-dominant</div>
                                    <div className="text-white/50">→ Dorian (introspective)</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-semibold text-amber-400 mb-2">Trauma/Entropy → Expression</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="font-mono text-amber-300">High Trauma (τ &gt; 0.7)</div>
                                    <ul className="text-white/50 ml-4 list-disc">
                                        <li>Increased dissonance</li>
                                        <li>Minor seconds, tritones</li>
                                        <li>Sparse orchestration</li>
                                    </ul>
                                </div>
                                <div>
                                    <div className="font-mono text-amber-300">High Entropy (H &gt; 0.7)</div>
                                    <ul className="text-white/50 ml-4 list-disc">
                                        <li>Irregular rhythms</li>
                                        <li>Theme fragmentation</li>
                                        <li>Dynamic variation</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-semibold text-red-400 mb-2">DISC → Performance</h4>
                            <div className="grid grid-cols-4 gap-2 text-sm">
                                <div className="p-2 rounded bg-red-500/10">
                                    <div className="font-mono text-red-300">High D</div>
                                    <div className="text-xs text-white/50">Fast tempo, staccato</div>
                                </div>
                                <div className="p-2 rounded bg-yellow-500/10">
                                    <div className="font-mono text-yellow-300">High I</div>
                                    <div className="text-xs text-white/50">Legato, crescendos</div>
                                </div>
                                <div className="p-2 rounded bg-green-500/10">
                                    <div className="font-mono text-green-300">High S</div>
                                    <div className="text-xs text-white/50">Stable rhythm, soft</div>
                                </div>
                                <div className="p-2 rounded bg-blue-500/10">
                                    <div className="font-mono text-blue-300">High C</div>
                                    <div className="text-xs text-white/50">Precise, structured</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related */}
                <section className="p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Related Documentation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/wiki/ai/psychoscore" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">PSYCHOSCORE Overview</h4>
                            <p className="text-xs text-white/50 mt-1">System introduction and quick start</p>
                        </Link>
                        <Link href="/wiki/theory/mckenney-lacan" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">McKenney-Lacan Theory</h4>
                            <p className="text-xs text-white/50 mt-1">Theoretical foundation</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • PSYCHOSCORE 57D Input Space</span>
                    <span>Last updated: 2026-01-05 07:15 CST</span>
                </div>
            </footer>
        </div>
    );
}
