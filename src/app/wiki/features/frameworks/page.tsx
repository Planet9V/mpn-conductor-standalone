'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Beaker, Calculator, Brain, Music } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * Theoretical Frameworks - Complete MPN Theory Documentation
 * 
 * Updated: 2026-01-04 13:00 CST
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

const FRAMEWORKS = {
    physics: [
        { name: 'Hamiltonian Mechanics', desc: 'Phase space evolution of psychometric states' },
        { name: 'Lyapunov Exponents', desc: 'Chaos/stability measurement' },
        { name: 'Ising Model', desc: 'Phase transitions in collective psychology' },
        { name: 'Granovetter Thresholds', desc: 'Influence cascade dynamics' },
        { name: 'Lorenz Attractors', desc: 'Strange attractor visualization' },
        { name: 'Entropy/Thermodynamics', desc: 'State disorder quantification' },
        { name: 'Quantum Observer Effect', desc: 'Audience-actor measurement dynamics' },
        { name: 'Relativity (Observer Frames)', desc: 'Perspective-dependent truth' },
        { name: 'Borromean Topology', desc: 'RSI knot structure' },
        { name: 'Spectral Analysis', desc: 'Signal decomposition' },
        { name: 'Tensor Calculus', desc: 'Multi-dimensional state representation' },
        { name: 'Information Theory', desc: 'Bit entropy of dialogue' },
    ],
    psychology: [
        { name: 'Lacanian RSI Registers', desc: 'Real, Symbolic, Imaginary topology' },
        { name: 'Object Relations (objet a)', desc: 'Object-cause of desire' },
        { name: 'DISC Personality', desc: 'Dominance, Influence, Steadiness, Compliance' },
        { name: 'Big Five / OCEAN', desc: 'Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism' },
        { name: 'Dark Triad', desc: 'Narcissism, Machiavellianism, Psychopathy' },
        { name: 'Cognitive Biases', desc: '12 systematic bias categories' },
        { name: 'Attachment Theory', desc: 'Secure, anxious, avoidant patterns' },
        { name: 'Defense Mechanisms', desc: 'Freudian protection strategies' },
        { name: 'Transference Dynamics', desc: 'Relationship projection patterns' },
        { name: 'Free Energy Principle', desc: 'Prediction error minimization' },
    ],
    musicology: [
        { name: 'Wagnerian Leitmotif', desc: 'Recurring thematic association' },
        { name: 'Modal Theory', desc: 'Greek mode affective qualities' },
        { name: 'Schenkerian Analysis', desc: 'Deep structure reduction' },
        { name: 'Voice Leading', desc: 'Part movement rules' },
        { name: 'Orchestration', desc: 'Instrument color assignment' },
        { name: 'Tonnetz', desc: 'Neo-Riemannian pitch space' },
        { name: 'Set Theory', desc: 'Pitch class operations' },
        { name: 'Species Counterpoint', desc: 'Multi-voice interaction rules' },
    ],
    dramaturgy: [
        { name: 'Stanislavski System', desc: 'Objective, obstacle, tactic' },
        { name: 'Character Arc Theory', desc: 'Transformation trajectory' },
        { name: 'Subtext Analysis', desc: 'Meaning beneath dialogue' },
        { name: 'Given Circumstances', desc: 'Contextual constraints' },
        { name: 'Emotional Memory', desc: 'Affective recall technique' },
        { name: 'Active Analysis', desc: 'Action-based character construction' },
    ],
};

export default function FrameworksPage() {
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
                                <Beaker className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">40+ Theoretical Frameworks</h1>
                                <p className="text-xs text-white/40">McKenney-Lacan Integration</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        The <span className="text-[#FFD700]">Grand Unified Codex</span>
                    </h2>
                    <p className="text-lg text-white/60">
                        MPN synthesizes 40+ theoretical frameworks across physics, psychology, musicology,
                        and dramaturgy through a category-theoretic isomorphism Φ.
                    </p>
                </div>

                {/* Isomorphism Diagram */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">The Isomorphism Φ: L → M</h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <div className="mermaid">
                            {`flowchart LR
    subgraph L["PSYCHOLOGICAL LOGS (L)"]
        Trauma[Trauma τ]
        Entropy[Entropy H]
        RSI[RSI Registers]
        DISC[DISC Profile]
    end

    subgraph Φ["ISOMORPHISM Φ"]
        PsychoCalc[Psychometric Calculus]
    end

    subgraph M["MUSICAL SCORES (M)"]
        Pitch[Pitch ν]
        Rhythm[Rhythm Δt]
        Mode[Mode σ]
        Timbre[Timbre τ]
    end

    Trauma --> PsychoCalc
    Entropy --> PsychoCalc
    RSI --> PsychoCalc
    DISC --> PsychoCalc
    PsychoCalc --> Pitch
    PsychoCalc --> Rhythm
    PsychoCalc --> Mode
    PsychoCalc --> Timbre`}
                        </div>
                    </div>
                </section>

                {/* Great Dictionary */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">The Great Dictionary</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Musical</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Mathematical</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Psychological</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Pitch (ν)</td>
                                    <td className="py-3 px-4">Eigenvalue (λ)</td>
                                    <td className="py-3 px-4">Emotional Valence</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Timbre (τ)</td>
                                    <td className="py-3 px-4">Spectral Decomposition</td>
                                    <td className="py-3 px-4">Identity / DISC Role</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Rhythm (Δt)</td>
                                    <td className="py-3 px-4">Entropy (S)</td>
                                    <td className="py-3 px-4">Cognitive Load</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Key Signature</td>
                                    <td className="py-3 px-4">Topology (Genus)</td>
                                    <td className="py-3 px-4">Environmental Context</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Dissonance</td>
                                    <td className="py-3 px-4">Cohomology (H¹)</td>
                                    <td className="py-3 px-4">Internal Conflict</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Resolution</td>
                                    <td className="py-3 px-4">Ricci Flow</td>
                                    <td className="py-3 px-4">Growth / Integration</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Tritone</td>
                                    <td className="py-3 px-4">Singularity</td>
                                    <td className="py-3 px-4">Crisis / Breaking Point</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4">Counterpoint</td>
                                    <td className="py-3 px-4">Game Theory</td>
                                    <td className="py-3 px-4">Multi-Actor Dynamics</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Framework Categories */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-6">Framework Categories</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Physics */}
                        <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                            <div className="flex items-center gap-3 mb-4">
                                <Calculator className="w-6 h-6 text-emerald-400" />
                                <h4 className="text-lg font-semibold text-emerald-400">Physics & Mathematics (12)</h4>
                            </div>
                            <ul className="space-y-2 text-sm">
                                {FRAMEWORKS.physics.map((f, i) => (
                                    <li key={i} className="flex justify-between">
                                        <span className="font-medium">{f.name}</span>
                                        <span className="text-white/50 text-xs">{f.desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Psychology */}
                        <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-500/5">
                            <div className="flex items-center gap-3 mb-4">
                                <Brain className="w-6 h-6 text-purple-400" />
                                <h4 className="text-lg font-semibold text-purple-400">Psychology (10)</h4>
                            </div>
                            <ul className="space-y-2 text-sm">
                                {FRAMEWORKS.psychology.map((f, i) => (
                                    <li key={i} className="flex justify-between">
                                        <span className="font-medium">{f.name}</span>
                                        <span className="text-white/50 text-xs">{f.desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Musicology */}
                        <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/5">
                            <div className="flex items-center gap-3 mb-4">
                                <Music className="w-6 h-6 text-amber-400" />
                                <h4 className="text-lg font-semibold text-amber-400">Musicology (8)</h4>
                            </div>
                            <ul className="space-y-2 text-sm">
                                {FRAMEWORKS.musicology.map((f, i) => (
                                    <li key={i} className="flex justify-between">
                                        <span className="font-medium">{f.name}</span>
                                        <span className="text-white/50 text-xs">{f.desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Dramaturgy */}
                        <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/5">
                            <div className="flex items-center gap-3 mb-4">
                                <Book className="w-6 h-6 text-blue-400" />
                                <h4 className="text-lg font-semibold text-blue-400">Dramaturgy (6)</h4>
                            </div>
                            <ul className="space-y-2 text-sm">
                                {FRAMEWORKS.dramaturgy.map((f, i) => (
                                    <li key={i} className="flex justify-between">
                                        <span className="font-medium">{f.name}</span>
                                        <span className="text-white/50 text-xs">{f.desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Academic Paper Link */}
                <section className="p-6 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/5">
                    <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">📄 Full Academic Dissertation</h3>
                    <p className="text-white/70 mb-4">
                        For complete mathematical formalizations, proofs, and implementation details,
                        see the full academic paper:
                    </p>
                    <Link
                        href="/theory/MPN_ACADEMIC_DISSERTATION.md"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD700]/20 text-[#FFD700] hover:bg-[#FFD700]/30 transition"
                    >
                        View Full Dissertation (25+ pages)
                    </Link>
                </section>

                {/* Related */}
                <section className="mt-12 p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Related Documentation</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link href="/wiki/features/leitmotif" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Leitmotif System</h4>
                            <p className="text-xs text-white/50 mt-1">Williams/Shore transformation techniques</p>
                        </Link>
                        <Link href="/wiki/architecture/data-flow" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Data Flow Architecture</h4>
                            <p className="text-xs text-white/50 mt-1">Complete system pipeline</p>
                        </Link>
                        <Link href="/mpn-lab" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">MPN Lab</h4>
                            <p className="text-xs text-white/50 mt-1">13 interactive visualizations</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • 40+ Theoretical Frameworks</span>
                    <span>Last updated: 2026-01-04 13:00 CST</span>
                </div>
            </footer>
        </div>
    );
}
