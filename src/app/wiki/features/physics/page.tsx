'use client';

import Link from 'next/link';
import { ArrowLeft, Atom, ExternalLink } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * Physics Framework Documentation
 * 
 * Updated: 2026-01-04 13:24 CST
 * Version: 3.2.0
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

export default function PhysicsFrameworksPage() {
    useMermaid();

    return (
        <div className="min-h-screen bg-black">
            <header className="border-b border-white/10 px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-lg z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/wiki" className="flex items-center gap-2 text-white/60 hover:text-white transition">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to Wiki</span>
                        </Link>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Atom className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">Physics Frameworks</h1>
                                <p className="text-xs text-white/40">McKenney-Lacan Theory → Physics</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        <span className="text-purple-400">Physics</span>-Musical Synthesis
                    </h2>
                    <p className="text-lg text-white/60">
                        MPN integrates four major physics frameworks to model psychological dynamics
                        and their musical manifestations, extending the Wagnerian leitmotif tradition
                        through rigorous mathematical formalism.
                    </p>
                </div>

                {/* Overview Diagram */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Framework Overview</h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <div className="mermaid">
                            {`flowchart TB
    subgraph Physics["PHYSICS FRAMEWORKS"]
        H[Hamiltonian Mechanics]
        I[Ising Model]
        G[Granovetter Thresholds]
        L[Lyapunov Stability]
    end

    subgraph Musical["MUSICAL MANIFESTATION"]
        Dynamics[Dynamic Evolution]
        Texture[Ensemble Texture]
        Cascade[Orchestral Cascade]
        Stability[Harmonic Stability]
    end

    H --> Dynamics
    I --> Texture
    G --> Cascade
    L --> Stability`}
                        </div>
                    </div>
                </section>

                {/* Hamiltonian */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-sm">H</span>
                        Hamiltonian Mechanics
                    </h3>
                    <p className="text-white/60 mb-4">
                        Psychological states evolve in phase space with conserved emotional energy.
                        Based on <code className="px-1 bg-white/10 rounded">dq/dt = ∂H/∂p</code> and <code className="px-1 bg-white/10 rounded">dp/dt = -∂V/∂q</code>.
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-emerald-400">Hamiltonian Term</th>
                                    <th className="text-left py-3 px-4 text-emerald-400">Musical Analog</th>
                                    <th className="text-left py-3 px-4 text-emerald-400">Implementation</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-medium">Position q</td>
                                    <td className="py-3 px-4">Pitch register, mode</td>
                                    <td className="py-3 px-4 text-xs text-white/50">Note selection, scale choice</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-medium">Momentum p</td>
                                    <td className="py-3 px-4">Tempo, rhythmic density</td>
                                    <td className="py-3 px-4 text-xs text-white/50">BPM, note frequency</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-medium">Potential V(q)</td>
                                    <td className="py-3 px-4">Harmonic tension</td>
                                    <td className="py-3 px-4 text-xs text-white/50">Chord function (T-S-D)</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">Kinetic T(p)</td>
                                    <td className="py-3 px-4">Melodic motion</td>
                                    <td className="py-3 px-4 text-xs text-white/50">Intervallic leaps</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <p className="text-sm text-emerald-200">
                            <strong>Conservation:</strong> In absence of external events, total psychic energy H is conserved—
                            the score maintains consistent intensity until dialogue or stage direction injects/drains energy.
                        </p>
                    </div>
                </section>

                {/* Ising Model */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm">I</span>
                        Ising Model
                    </h3>
                    <p className="text-white/60 mb-4">
                        The orchestra functions as a spin system. Ensemble alignment (unison) vs disorder (polyphony)
                        follows phase transition dynamics: <code className="px-1 bg-white/10 rounded">H = -J Σσᵢσⱼ</code>.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-medium text-blue-400 mb-2">T &lt; Tᶜ (Ordered)</h4>
                            <p className="text-sm text-white/60">Tutti passages, homophonic alignment, ensemble unison</p>
                        </div>
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-medium text-red-400 mb-2">T &gt; Tᶜ (Disordered)</h4>
                            <p className="text-sm text-white/60">Polytonal chaos, rhythmic divergence, polyphonic independence</p>
                        </div>
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                        <p className="text-sm text-blue-200">
                            <strong>Phase Transition:</strong> When entropy ≈ 0.6 (critical threshold), small perturbations
                            cascade into sudden tutti—all spins align, creating climactic orchestral moments.
                        </p>
                    </div>
                </section>

                {/* Granovetter */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-sm">G</span>
                        Granovetter Thresholds
                    </h3>
                    <p className="text-white/60 mb-4">
                        Instrument activation follows threshold cascade dynamics—instruments enter when their
                        activation threshold θ is exceeded by the proportion of active neighbors.
                    </p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/5">
                            <span className="w-16 text-xs text-amber-400 font-mono">θ = 0.0</span>
                            <span className="font-medium">Speaker's leitmotif</span>
                            <span className="text-xs text-white/50">Always active when speaking</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/5">
                            <span className="w-16 text-xs text-amber-400 font-mono">θ = 0.2</span>
                            <span className="font-medium">Listener 1</span>
                            <span className="text-xs text-white/50">Activates at 20%+ active</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/5">
                            <span className="w-16 text-xs text-amber-400 font-mono">θ = 0.6</span>
                            <span className="font-medium">Background ensemble</span>
                            <span className="text-xs text-white/50">Climactic moments only</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/5">
                            <span className="w-16 text-xs text-red-400 font-mono">θ = 0.9</span>
                            <span className="font-medium">Tutti percussion</span>
                            <span className="text-xs text-white/50">Crisis peaks only</span>
                        </div>
                    </div>
                </section>

                {/* Lyapunov */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-sm">L</span>
                        Lyapunov Stability
                    </h3>
                    <p className="text-white/60 mb-4">
                        The Lyapunov exponent λ determines whether emotional states return to equilibrium.
                        Negative λ = stability; Positive λ = chaos.
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-purple-400">λ Range</th>
                                    <th className="text-left py-3 px-4 text-purple-400">State</th>
                                    <th className="text-left py-3 px-4 text-purple-400">Musical Manifestation</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-mono text-emerald-400">λ &lt;&lt; 0</td>
                                    <td className="py-3 px-4">Deeply stable</td>
                                    <td className="py-3 px-4 text-xs text-white/60">Tonic pedal, regular rhythm, diatonic only</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-mono text-amber-400">λ ≈ 0</td>
                                    <td className="py-3 px-4">Neutral/threshold</td>
                                    <td className="py-3 px-4 text-xs text-white/60">Suspended chords, syncopation, modal mixture</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-mono text-orange-400">λ &gt; 0</td>
                                    <td className="py-3 px-4">Chaotic</td>
                                    <td className="py-3 px-4 text-xs text-white/60">Chromatic wandering, irregular meter</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-mono text-red-400">λ &gt;&gt; 0</td>
                                    <td className="py-3 px-4">Full crisis</td>
                                    <td className="py-3 px-4 text-xs text-white/60">Tritones, clusters, rhythmic breakdown</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Williams Example */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Applied Example: John Williams' Force Theme</h3>
                    <div className="p-6 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/5">
                        <p className="text-white/80 mb-4">
                            Williams' Force Theme demonstrates all four physics frameworks in its transformations
                            across the Star Wars saga:
                        </p>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 font-medium w-32">Hamiltonian:</span>
                                <span>Theme energy conserved—statements maintain intensity unless narrative events modulate</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 font-medium w-32">Ising:</span>
                                <span>Final Throne Room = T &lt; Tᶜ (ordered tutti); Dagobah training = T &gt; Tᶜ (solo/chamber)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400 font-medium w-32">Granovetter:</span>
                                <span>Binary Sunset = solo horn (θ=0) → strings join (θ=0.2) → brass cascade (θ=0.6)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 font-medium w-32">Lyapunov:</span>
                                <span>Luke training = λ≈0 (development); Luke vs Vader = λ&gt;0 (unstable combat)</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Related */}
                <section className="p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Related Documentation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/wiki/features/leitmotif" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Leitmotif Transformations</h4>
                            <p className="text-xs text-white/50 mt-1">Williams/Shore compositional techniques</p>
                        </Link>
                        <Link href="/theory/MPN_ACADEMIC_DISSERTATION.md" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-purple-400">Academic Paper</h4>
                                <p className="text-xs text-white/50 mt-1">Full dissertation with mathematical formalism</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-white/30" />
                        </Link>
                        <Link href="/mpn-reference" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-emerald-400">MPN Reference Dictionary</h4>
                            <p className="text-xs text-white/50 mt-1">Complete psychometric↔musical mappings</p>
                        </Link>
                        <Link href="/wiki/features/frameworks" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-amber-400">40+ Theoretical Frameworks</h4>
                            <p className="text-xs text-white/50 mt-1">Grand Unified Codex integration</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • Physics Frameworks</span>
                    <span>Last updated: 2026-01-04 13:24 CST</span>
                </div>
            </footer>
        </div>
    );
}
