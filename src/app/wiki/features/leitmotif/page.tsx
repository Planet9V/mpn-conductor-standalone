'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Music, ExternalLink } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * Leitmotif Transformation System Documentation
 * 
 * Updated: 2026-01-04 12:30 CST
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

export default function LeitmotifPage() {
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
                            <div className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                                <Music className="w-4 h-4 text-[#FFD700]" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">Leitmotif Transformation System</h1>
                                <p className="text-xs text-white/40">Core Features → Leitmotif</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Professional <span className="text-[#FFD700]">Film Score</span> Techniques
                    </h2>
                    <p className="text-lg text-white/60">
                        MPN implements professional leitmotif transformation techniques derived from
                        John Williams (Star Wars, Harry Potter) and Howard Shore (Lord of the Rings).
                    </p>
                </div>

                {/* Transformation Overview */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Transformation Techniques</h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <div className="mermaid">
                            {`flowchart TB
    subgraph Williams["JOHN WILLIAMS TECHNIQUES"]
        Modal[Modal Transformation]
        Orch[Orchestration Evolution]
        Harmony[Harmonic Recontextualization]
    end

    subgraph Shore["HOWARD SHORE TECHNIQUES"]
        Frag[Theme Fragmentation]
        Contra[Contrapuntal Layering]
        Corrupt[Corruption Motifs]
    end

    subgraph Input["PSYCHOMETRIC INPUT"]
        Trauma[Trauma Level]
        Entropy[Entropy Level]
        RSI[RSI Register]
    end

    Trauma --> Frag
    Trauma --> Orch
    Entropy --> Frag
    RSI --> Modal`}
                        </div>
                    </div>
                </section>

                {/* Modal Transformation */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">1</span>
                        Modal Transformation (RSI → Mode)
                    </h3>
                    <p className="text-white/60 mb-4">
                        Based on Williams' use of Lydian (#4) for magic in Harry Potter's "Hedwig's Theme".
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Dominant RSI</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Low Trauma Mode</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">High Trauma Mode</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Example</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-medium text-emerald-400">Real</td>
                                    <td className="py-3 px-4">Dorian (noble)</td>
                                    <td className="py-3 px-4">Aeolian (melancholic)</td>
                                    <td className="py-3 px-4 text-xs text-white/50">Rohan theme (LOTR)</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-medium text-blue-400">Symbolic</td>
                                    <td className="py-3 px-4">Lydian (magical #4)</td>
                                    <td className="py-3 px-4">Mixolydian (heroic)</td>
                                    <td className="py-3 px-4 text-xs text-white/50">Hedwig's Theme, Force Theme</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium text-purple-400">Imaginary</td>
                                    <td className="py-3 px-4">Phrygian (anxious b2)</td>
                                    <td className="py-3 px-4">Locrian (dissolution)</td>
                                    <td className="py-3 px-4 text-xs text-white/50">Ring corruption motif</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Fragmentation */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">2</span>
                        Theme Fragmentation (Shore)
                    </h3>
                    <p className="text-white/60 mb-4">
                        Based on Shore's Fellowship theme progressively breaking down as the group splinters.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-medium text-emerald-400 mb-2">Score &lt; 0.25</h4>
                            <p className="text-sm text-white/60">Full thematic statement - complete melody</p>
                        </div>
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-medium text-blue-400 mb-2">Score 0.25 - 0.5</h4>
                            <p className="text-sm text-white/60">Truncated - first 60% of notes only</p>
                        </div>
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-medium text-amber-400 mb-2">Score 0.5 - 0.75</h4>
                            <p className="text-sm text-white/60">Core motif - essential 4-note cell</p>
                        </div>
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-medium text-red-400 mb-2">Score &gt; 0.75</h4>
                            <p className="text-sm text-white/60">Dissolution - sparse intervallic fragments</p>
                        </div>
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        <p className="text-sm text-amber-200">
                            <strong>Formula:</strong> fragmentationScore = (entropy × 0.6) + (trauma × 0.4)
                        </p>
                    </div>
                </section>

                {/* Orchestration Evolution */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">3</span>
                        Orchestration Evolution
                    </h3>
                    <p className="text-white/60 mb-4">
                        Based on Williams' Force Theme growing from solo French horn to full orchestra as Luke matures.
                    </p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/5">
                            <span className="w-24 text-xs text-white/40">intensity &lt; 0.2</span>
                            <span className="font-medium">SOLO</span>
                            <span className="text-xs text-white/50">Piano, celeste, solo violin</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/5">
                            <span className="w-24 text-xs text-white/40">0.2 - 0.4</span>
                            <span className="font-medium">CHAMBER</span>
                            <span className="text-xs text-white/50">Violin, cello, clarinet, oboe</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/5">
                            <span className="w-24 text-xs text-white/40">0.4 - 0.6</span>
                            <span className="font-medium">SECTION</span>
                            <span className="text-xs text-white/50">Full string/brass/woodwind sections</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/5">
                            <span className="w-24 text-xs text-white/40">0.6 - 0.85</span>
                            <span className="font-medium">FULL_ORCHESTRA</span>
                            <span className="text-xs text-white/50">All sections with harp</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 bg-white/5">
                            <span className="w-24 text-xs text-white/40">&gt; 0.85</span>
                            <span className="font-medium text-red-400">TUTTI_FORTISSIMO</span>
                            <span className="text-xs text-white/50">Full orchestra + timpani, cymbals, choir</span>
                        </div>
                    </div>
                </section>

                {/* Harmonic Recontextualization */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">4</span>
                        Harmonic Recontextualization
                    </h3>
                    <p className="text-white/60 mb-4">
                        Same melody over different harmonies creates emotional shift (Williams' Force Theme technique).
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Transformation</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Original</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Transformed</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Hope → Despair</td>
                                    <td className="py-3 px-4 font-mono">Cmaj → Gmaj</td>
                                    <td className="py-3 px-4 font-mono">Cm → Gm</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Innocence → Corruption</td>
                                    <td className="py-3 px-4 font-mono">Cmaj7</td>
                                    <td className="py-3 px-4 font-mono">Cdim7</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4">Unity → Fragmentation</td>
                                    <td className="py-3 px-4 font-mono">Cmaj</td>
                                    <td className="py-3 px-4 font-mono">Csus2</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Implementation */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Implementation</h3>
                    <div className="p-4 rounded-lg border border-white/10 bg-black/40 font-mono text-sm">
                        <p className="text-white/40 mb-2">// File: src/lib/leitmotif_transformation_rules.ts</p>
                        <p className="text-emerald-300">export function applyProfessionalTransformations(</p>
                        <p className="text-emerald-300 pl-4">leitmotif: Leitmotif,</p>
                        <p className="text-emerald-300 pl-4">originalNotes: NoteEvent[],</p>
                        <p className="text-emerald-300 pl-4">chord: string,</p>
                        <p className="text-emerald-300 pl-4">context: TransformationContext</p>
                        <p className="text-emerald-300">): TransformedLeitmotif</p>
                    </div>
                </section>

                {/* Related */}
                <section className="p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Related Documentation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/wiki/architecture/data-flow" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Data Flow Architecture</h4>
                            <p className="text-xs text-white/50 mt-1">See how leitmotifs flow through the system</p>
                        </Link>
                        <Link href="/wiki/features/psychometric" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Psychometric Calculus</h4>
                            <p className="text-xs text-white/50 mt-1">The ψ → ♪ transformation engine</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • Leitmotif Transformation System</span>
                    <span>Last updated: 2026-01-04 12:30 CST</span>
                </div>
            </footer>
        </div>
    );
}
