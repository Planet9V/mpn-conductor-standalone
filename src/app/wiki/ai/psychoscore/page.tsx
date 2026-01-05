'use client';

import Link from 'next/link';
import { ArrowLeft, Brain, Cpu, Music, Database, Zap, ChevronRight, ExternalLink } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * PSYCHOSCORE System Documentation
 * 
 * Comprehensive academic-style documentation for the PSYCHOSCORE
 * transformer-based music generation system.
 * 
 * Updated: 2026-01-05 07:05 CST
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

function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
    return (
        <pre className="bg-black/60 border border-white/10 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-emerald-300 font-mono whitespace-pre">{code}</code>
        </pre>
    );
}

function InfoBox({ title, children, variant = 'info' }: { title: string; children: React.ReactNode; variant?: 'info' | 'warning' | 'success' }) {
    const colors = {
        info: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
        warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
        success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    };
    return (
        <div className={`p-4 rounded-lg border ${colors[variant]} my-4`}>
            <h4 className="font-semibold mb-2">{title}</h4>
            <div className="text-sm opacity-90">{children}</div>
        </div>
    );
}

export default function PsychoscorePage() {
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
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Brain className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">PSYCHOSCORE</h1>
                                <p className="text-xs text-white/40">AI Integration → Custom Model</p>
                            </div>
                        </div>
                    </div>
                    <span className="text-xs text-white/40">Updated: 2026-01-05 07:05 CST</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Title Section */}
                <div className="mb-12">
                    <h2 className="text-4xl font-bold mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">PSYCHOSCORE</span>
                    </h2>
                    <p className="text-xl text-white/60 mb-6">
                        A Novel Transformer-Based Music Generation System for Psychometric-to-MIDI Translation
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">GPT-2 Based</span>
                        <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs">QLoRA Fine-tuned</span>
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">57 Dimensions</span>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">CUDA Accelerated</span>
                    </div>
                </div>

                {/* Abstract */}
                <section className="mb-12 p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Abstract</h3>
                    <p className="text-white/70 leading-relaxed">
                        PSYCHOSCORE represents a groundbreaking approach to algorithmic music composition that bridges
                        psychometric profiling with musical expression. Built upon the GPT-2 architecture and fine-tuned
                        using QLoRA (Quantized Low-Rank Adaptation), this system maps a <strong>57-dimensional
                            psychometric input space</strong> directly to MIDI output, enabling unprecedented expressiveness
                        in computer-generated music. The model integrates established psychological frameworks including
                        DISC personality assessment, OCEAN (Big Five) traits, Lacanian psychoanalytic registers (RSI),
                        the Dark Triad personality construct, and Kahneman-Tversky cognitive biases—all unified through
                        the McKenney-Lacan theoretical framework for trauma and entropy quantification.
                    </p>
                </section>

                {/* Navigation Cards */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Documentation Sections</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/wiki/ai/psychoscore/architecture" className="group p-4 rounded-xl border border-white/10 hover:border-purple-500/50 bg-white/5 transition-all">
                            <div className="flex items-center gap-3">
                                <Cpu className="w-6 h-6 text-purple-400" />
                                <div className="flex-1">
                                    <h4 className="font-semibold group-hover:text-purple-400 transition">System Architecture</h4>
                                    <p className="text-xs text-white/50">Model structure, data flow, inference pipeline</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-purple-400 transition" />
                            </div>
                        </Link>
                        <Link href="/wiki/ai/psychoscore/dimensions" className="group p-4 rounded-xl border border-white/10 hover:border-pink-500/50 bg-white/5 transition-all">
                            <div className="flex items-center gap-3">
                                <Database className="w-6 h-6 text-pink-400" />
                                <div className="flex-1">
                                    <h4 className="font-semibold group-hover:text-pink-400 transition">57D Input Space</h4>
                                    <p className="text-xs text-white/50">DISC, OCEAN, RSI, Dark Triad, Biases</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-pink-400 transition" />
                            </div>
                        </Link>
                        <Link href="/wiki/ai/psychoscore/training" className="group p-4 rounded-xl border border-white/10 hover:border-blue-500/50 bg-white/5 transition-all">
                            <div className="flex items-center gap-3">
                                <Zap className="w-6 h-6 text-blue-400" />
                                <div className="flex-1">
                                    <h4 className="font-semibold group-hover:text-blue-400 transition">Training Pipeline</h4>
                                    <p className="text-xs text-white/50">QLoRA, hyperparameters, results</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition" />
                            </div>
                        </Link>
                        <Link href="/wiki/ai/psychoscore/api" className="group p-4 rounded-xl border border-white/10 hover:border-emerald-500/50 bg-white/5 transition-all">
                            <div className="flex items-center gap-3">
                                <Music className="w-6 h-6 text-emerald-400" />
                                <div className="flex-1">
                                    <h4 className="font-semibold group-hover:text-emerald-400 transition">Inference API</h4>
                                    <p className="text-xs text-white/50">FastAPI endpoints, TypeScript client</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-emerald-400 transition" />
                            </div>
                        </Link>
                    </div>
                </section>

                {/* System Overview Diagram */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">System Overview</h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <div className="mermaid">
                            {`flowchart TB
    subgraph Input["📊 PSYCHOMETRIC INPUT (57D)"]
        DISC["DISC (4D)"]
        OCEAN["OCEAN (5D)"]
        RSI["Lacanian RSI (3D)"]
        McKenney["McKenney-Lacan (2D)"]
        DarkTriad["Dark Triad (3D)"]
        Biases["Cognitive Biases (30D)"]
        Physics["Physics State (10D)"]
    end

    subgraph Tokenizer["🔤 TOKENIZER"]
        Encode["Encode Profile"]
        VocabMap["1,700+ Token Vocabulary"]
    end

    subgraph Model["🧠 PSYCHOSCORE MODEL"]
        GPT2["GPT-2 Base (124M)"]
        LoRA["QLoRA Adapters (6.35M)"]
        Generate["Autoregressive Generation"]
    end

    subgraph Output["🎵 MIDI OUTPUT"]
        Tokens["MIDI Tokens"]
        Decode["REMI Decode"]
        MIDI["MIDI Binary"]
    end

    DISC --> Encode
    OCEAN --> Encode
    RSI --> Encode
    McKenney --> Encode
    DarkTriad --> Encode
    Biases --> Encode
    Physics --> Encode

    Encode --> VocabMap
    VocabMap --> GPT2
    GPT2 --> LoRA
    LoRA --> Generate
    Generate --> Tokens
    Tokens --> Decode
    Decode --> MIDI`}
                        </div>
                    </div>
                </section>

                {/* Key Metrics */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Production Training Results</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Metric</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Value</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Base Model</td>
                                    <td className="py-3 px-4 font-mono">GPT-2 (124M params)</td>
                                    <td className="py-3 px-4 text-white/50">openai-community/gpt2</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Training Method</td>
                                    <td className="py-3 px-4">QLoRA (4-bit)</td>
                                    <td className="py-3 px-4 text-white/50">NF4 quantization</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Trainable Parameters</td>
                                    <td className="py-3 px-4 font-mono">6.35M / 130M (4.86%)</td>
                                    <td className="py-3 px-4 text-white/50">Rank 16, Alpha 32</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Synthetic Pairs</td>
                                    <td className="py-3 px-4 font-mono">15,000</td>
                                    <td className="py-3 px-4 text-white/50">Scaled production run</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Training Steps</td>
                                    <td className="py-3 px-4 font-mono">3,750</td>
                                    <td className="py-3 px-4 text-white/50">10 epochs</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Initial → Final Loss</td>
                                    <td className="py-3 px-4 font-mono text-emerald-400">9.99 → 6.09</td>
                                    <td className="py-3 px-4 text-white/50">39% reduction</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Training Time</td>
                                    <td className="py-3 px-4 font-mono">~2 hours</td>
                                    <td className="py-3 px-4 text-white/50">RTX 5060 Ti</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4">Model Size</td>
                                    <td className="py-3 px-4 font-mono">180MB</td>
                                    <td className="py-3 px-4 text-white/50">LoRA adapters + tokenizer</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Theoretical Foundation */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Theoretical Foundation</h3>
                    <p className="text-white/70 mb-4 leading-relaxed">
                        PSYCHOSCORE is grounded in the <strong>McKenney-Lacan Applied Theory</strong> (RSCH-39),
                        which provides a rigorous mathematical framework for quantifying psychological states
                        and their musical manifestations. The theory posits that:
                    </p>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 mb-4">
                        <p className="font-mono text-center text-lg">
                            ψ(τ, H) → ♪(mode, tempo, dynamics, orchestration)
                        </p>
                        <p className="text-center text-sm text-white/50 mt-2">
                            Psychometric state function maps to musical parameters
                        </p>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                        Where <code className="bg-black/40 px-1 rounded">τ</code> represents trauma coefficient (0-1) and
                        <code className="bg-black/40 px-1 rounded">H</code> represents Shannon entropy (system chaos).
                        The Lacanian RSI registers (Real, Symbolic, Imaginary) determine modal character:
                    </p>
                    <ul className="list-disc list-inside text-white/70 mt-2 space-y-1 ml-4">
                        <li><strong>Real-dominant</strong> → Phrygian mode (dark, grounded)</li>
                        <li><strong>Symbolic-dominant</strong> → Major/Ionian mode (bright, structured)</li>
                        <li><strong>Imaginary-dominant</strong> → Dorian mode (melancholic, introspective)</li>
                    </ul>
                </section>

                {/* Quick Start */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
                    <InfoBox title="Prerequisites" variant="info">
                        Docker with NVIDIA GPU support, CUDA 12.0+, 16GB VRAM recommended
                    </InfoBox>
                    <CodeBlock code={`# Start PSYCHOSCORE inference server
cd ml/psychoscore
docker compose --profile inference up -d psychoscore-inference

# Verify health
curl http://localhost:8001/health
# {"status":"healthy","model_loaded":true,"device":"cuda"}

# Generate MIDI from psychometric profile
curl -X POST http://localhost:8001/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "disc": {"D": 0.8, "I": 0.3, "S": 0.2, "C": 0.5},
    "rsi": {"real": 0.5, "symbolic": 0.3, "imaginary": 0.2},
    "trauma": 0.7,
    "entropy": 0.5,
    "max_bars": 8
  }'`} language="bash" />
                </section>

                {/* Related Documentation */}
                <section className="p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Related Documentation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/wiki/theory/mckenney-lacan" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">McKenney-Lacan Theory</h4>
                            <p className="text-xs text-white/50 mt-1">Foundational academic paper</p>
                        </Link>
                        <Link href="/wiki/features/physics" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Physics Frameworks</h4>
                            <p className="text-xs text-white/50 mt-1">Hamiltonian, Ising, Lyapunov integration</p>
                        </Link>
                        <Link href="/wiki/ai/voice" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Emotional TTS System</h4>
                            <p className="text-xs text-white/50 mt-1">ElevenLabs voice synthesis</p>
                        </Link>
                        <Link href="/wiki/features/leitmotif" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Leitmotif System</h4>
                            <p className="text-xs text-white/50 mt-1">Williams/Shore techniques</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • PSYCHOSCORE System Documentation</span>
                    <span>Version 1.0.0 • Last updated: 2026-01-05 07:05 CST</span>
                </div>
            </footer>
        </div>
    );
}
