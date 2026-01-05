'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Download, ExternalLink } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * Data Flow Architecture - Interactive Mermaid Diagrams
 * 
 * Updated: 2026-01-04 12:30 CST
 * Version: 3.2.0
 */

// Mermaid CDN loader
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
            window.mermaid?.initialize({
                startOnLoad: true,
                theme: 'dark',
                themeVariables: {
                    primaryColor: '#FFD700',
                    primaryTextColor: '#000',
                    primaryBorderColor: '#B8860B',
                    lineColor: '#7C7C7C',
                    secondaryColor: '#1A1A1A',
                    tertiaryColor: '#0a0a0a',
                    background: '#0a0a0a',
                    mainBkg: '#1A1A1A',
                    nodeBorder: '#FFD700',
                }
            });
            // @ts-ignore
            window.mermaid?.run();
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);
}

export default function DataFlowPage() {
    useMermaid();

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="border-b border-white/10 px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-lg z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/wiki" className="flex items-center gap-2 text-white/60 hover:text-white transition">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to Wiki</span>
                        </Link>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <Book className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">Data Flow Architecture</h1>
                                <p className="text-xs text-white/40">System Architecture → Data Flow</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <span className="text-white/40">Updated: 2026-01-04</span>
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">v3.2.0</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Page Title */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Complete <span className="text-[#FFD700]">Data Flow</span> Architecture
                    </h2>
                    <p className="text-lg text-white/60 max-w-3xl">
                        This document describes the complete data pipeline from user input to audio/visual output,
                        including all transformation stages, component interactions, and WebWorker offloading.
                    </p>
                </div>

                {/* Main Flow Diagram */}
                <section className="mb-16">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">1</span>
                        Complete System Data Flow
                    </h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <div className="mermaid">
                            {`flowchart TB
    subgraph Input["📥 INPUT LAYER"]
        Script[Script/Play Text]
        User[User Controls]
        Upload[File Upload]
    end

    subgraph Processing["⚙️ PROCESSING LAYER"]
        NER[NER Pipeline]
        Psycho[Psychometric Analyzer]
        AI[AI Composition Engine]
    end

    subgraph Core["🎼 CORE ENGINE"]
        direction TB
        Orch[ScoreOrchestrator]
        Composer[GeniusComposer]
        Leitmotif[Leitmotif Generator]
        Transform[Transformation Rules]
    end

    subgraph Worker["🔧 WEB WORKER"]
        WorkerOrch[Orchestrator Worker]
    end

    subgraph Output["📤 OUTPUT LAYER"]
        Synth[MPNSynthesizer]
        TTS[Emotional TTS]
        Export[MIDI/MP3 Export]
        Visual[Visualization]
    end

    subgraph Storage["💾 STORAGE"]
        DB[(PostgreSQL)]
        Cache[(Memory Cache)]
    end

    Script --> NER
    Upload --> NER
    NER --> Psycho
    Psycho --> DB
    DB --> AI
    AI --> Composer
    User --> Orch
    Orch --> WorkerOrch
    WorkerOrch --> Composer
    Composer --> Leitmotif
    Leitmotif --> Transform
    Transform --> Synth
    Synth --> Export
    Psycho --> TTS
    Transform --> Visual`}
                        </div>
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        <p className="text-sm text-amber-200">
                            <strong>Key Insight:</strong> The WebWorker offloads heavy computation (ScoreOrchestrator)
                            from the main thread, ensuring smooth UI animation during score generation.
                        </p>
                    </div>
                </section>

                {/* Real-Time Regeneration Flow */}
                <section className="mb-16">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">2</span>
                        Real-Time Regeneration Flow
                    </h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <div className="mermaid">
                            {`sequenceDiagram
    participant User
    participant UI as Conductor UI
    participant Worker as Orchestrator Worker
    participant Buffer as Score Buffer
    participant Synth as MPNSynthesizer

    User->>UI: Change Instrument/Parameter
    UI->>Worker: UPDATE_ACTOR_INSTRUMENT
    Worker->>Worker: Invalidate cached frames
    Worker->>Buffer: Clear affected frames
    Worker->>Worker: Regenerate with new settings
    Worker->>UI: FRAMES_UPDATED
    UI->>Synth: Trigger new audio
    Synth->>User: Play updated music`}
                        </div>
                    </div>
                </section>

                {/* Psychometric Transformation Pipeline */}
                <section className="mb-16">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">3</span>
                        Psychometric → Musical Transformation
                    </h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <div className="mermaid">
                            {`flowchart LR
    subgraph Psychometric["PSYCHOMETRIC INPUT"]
        Trauma[τ Trauma 0-1]
        Entropy[H Entropy 0-1]
        RSI[RSI Registers]
        DISC[DISC Profile]
    end

    subgraph Transform["TRANSFORMATION"]
        Calc[Psychometric Calculus]
    end

    subgraph Musical["MUSICAL OUTPUT"]
        Tempo[Tempo 40-180 BPM]
        Mode[Modal Selection]
        Dynamics[Dynamics ppp-fff]
        Instrument[Instrument Family]
    end

    Trauma --> Calc
    Entropy --> Calc
    RSI --> Calc
    DISC --> Calc
    Calc --> Tempo
    Calc --> Mode
    Calc --> Dynamics
    Calc --> Instrument`}
                        </div>
                    </div>

                    {/* Transformation Table */}
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 font-semibold text-[#FFD700]">Input Parameter</th>
                                    <th className="text-left py-3 px-4 font-semibold text-[#FFD700]">Transformation</th>
                                    <th className="text-left py-3 px-4 font-semibold text-[#FFD700]">Musical Output</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4"><code>trauma</code> (0→1)</td>
                                    <td className="py-3 px-4">Linear → Exponential</td>
                                    <td className="py-3 px-4">Dynamics (ppp→fff), Dissonance level</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4"><code>entropy</code> (0→1)</td>
                                    <td className="py-3 px-4">Scaling with bounds</td>
                                    <td className="py-3 px-4">Tempo variability, Rhythmic complexity</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4"><code>RSI.real</code></td>
                                    <td className="py-3 px-4">Modal weighting</td>
                                    <td className="py-3 px-4">Aeolian/Dorian (grounded minor)</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4"><code>RSI.symbolic</code></td>
                                    <td className="py-3 px-4">Modal weighting</td>
                                    <td className="py-3 px-4">Lydian/Mixolydian (magical #4)</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4"><code>RSI.imaginary</code></td>
                                    <td className="py-3 px-4">Modal weighting</td>
                                    <td className="py-3 px-4">Phrygian/Locrian (unstable)</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4"><code>DISC.D</code></td>
                                    <td className="py-3 px-4">Instrument family</td>
                                    <td className="py-3 px-4">Brass (trumpet, trombone)</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4"><code>DISC.I</code></td>
                                    <td className="py-3 px-4">Instrument family</td>
                                    <td className="py-3 px-4">Woodwinds (flute, clarinet)</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4"><code>DISC.S</code></td>
                                    <td className="py-3 px-4">Instrument family</td>
                                    <td className="py-3 px-4">Strings (violin, cello)</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4"><code>DISC.C</code></td>
                                    <td className="py-3 px-4">Instrument family</td>
                                    <td className="py-3 px-4">Keyboards (piano, harp)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Leitmotif Transformation */}
                <section className="mb-16">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">4</span>
                        Leitmotif Transformation System (Williams/Shore)
                    </h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <div className="mermaid">
                            {`flowchart LR
    subgraph Input["CHARACTER STATE"]
        T[Trauma Level]
        E[Entropy Level]
        R[RSI Register]
    end

    subgraph Transform["TRANSFORMATIONS"]
        Modal[Modal Transform]
        Frag[Fragmentation]
        Orch[Orchestration Level]
    end

    subgraph Output["LEITMOTIF OUTPUT"]
        Mode[Musical Mode]
        Notes[Note Sequence]
        Inst[Instruments]
    end

    T --> Modal
    T --> Frag
    T --> Orch
    E --> Frag
    E --> Orch
    R --> Modal
    Modal --> Mode
    Frag --> Notes
    Orch --> Inst`}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-semibold mb-3 text-[#FFD700]">Modal Transformation</h4>
                            <ul className="text-sm text-white/70 space-y-2">
                                <li>• <strong>Real dominant:</strong> Aeolian/Dorian (grounded)</li>
                                <li>• <strong>Symbolic dominant:</strong> Lydian #4 (magical)</li>
                                <li>• <strong>Imaginary dominant:</strong> Phrygian/Locrian (unstable)</li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-semibold mb-3 text-[#FFD700]">Fragmentation Algorithm</h4>
                            <ul className="text-sm text-white/70 space-y-2">
                                <li>• <strong>&lt;0.25:</strong> Full theme statement</li>
                                <li>• <strong>0.25-0.5:</strong> Truncated (60% of notes)</li>
                                <li>• <strong>0.5-0.75:</strong> Core motif (4 notes)</li>
                                <li>• <strong>&gt;0.75:</strong> Dissolution (sparse intervals)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Related Documentation */}
                <section className="mt-16 p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Related Documentation</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link href="/wiki/architecture/components" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Component Matrix</h4>
                            <p className="text-xs text-white/50 mt-1">Module dependencies and relationships</p>
                        </Link>
                        <Link href="/wiki/features/leitmotif" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Leitmotif System</h4>
                            <p className="text-xs text-white/50 mt-1">Deep dive into theme generation</p>
                        </Link>
                        <Link href="/wiki/troubleshooting/performance" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Performance Tuning</h4>
                            <p className="text-xs text-white/50 mt-1">WebWorker optimization guide</p>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • Data Flow Architecture</span>
                    <span>Last updated: 2026-01-04 12:30 CST</span>
                </div>
            </footer>
        </div>
    );
}
