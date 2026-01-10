'use client';

import Link from 'next/link';
import { Book, ArrowLeft, ChevronRight, FileText, Cpu, Database, Volume2, Music, GitBranch, Server, Layers } from 'lucide-react';
import { useState } from 'react';

/**
 * MPN Wiki - Comprehensive Documentation Hub
 * 
 * Updated: 2026-01-10 17:15 CST
 * Version: 3.6.1
 */

interface WikiSection {
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
    articles: WikiArticle[];
}

interface WikiArticle {
    id: string;
    title: string;
    description: string;
    updated: string;
}

const WIKI_SECTIONS: WikiSection[] = [
    {
        id: 'architecture',
        title: 'System Architecture',
        icon: <Layers className="w-5 h-5" />,
        description: 'Complete system design, data flows, and component relationships',
        articles: [
            { id: 'overview', title: 'Architecture Overview', description: 'High-level system design and stack', updated: '2026-01-04' },
            { id: 'data-flow', title: 'Data Flow Architecture', description: 'Complete data pipeline from input to output', updated: '2026-01-04' },
            { id: 'components', title: 'Component Dependency Matrix', description: 'Module relationships and dependencies', updated: '2026-01-04' },
        ]
    },
    {
        id: 'features',
        title: 'Core Features',
        icon: <Music className="w-5 h-5" />,
        description: 'Detailed documentation of MPN capabilities',
        articles: [
            { id: 'leitmotif', title: 'Leitmotif Transformation System', description: 'Williams/Shore professional techniques', updated: '2026-01-04' },
            { id: 'physics', title: 'Physics Frameworks', description: 'Hamiltonian, Ising, Granovetter, Lyapunov', updated: '2026-01-04' },
            { id: 'frameworks', title: '40+ Theoretical Frameworks', description: 'Grand Unified Codex integration', updated: '2026-01-04' },
            { id: 'psychometric', title: 'Psychometric Calculus', description: 'ψ → ♪ transformation engine', updated: '2026-01-04' },
            { id: 'orchestration', title: 'Orchestration Modes', description: '15 distinct musical styles', updated: '2026-01-04' },
        ]
    },
    {
        id: 'ai',
        title: 'AI Integration',
        icon: <Cpu className="w-5 h-5" />,
        description: 'Machine learning models and AI-powered features',
        articles: [
            { id: 'psychoscore', title: 'PSYCHOSCORE System', description: 'Custom transformer for ψ→MIDI generation', updated: '2026-01-05' },
            { id: 'music-gen', title: 'AI Music Generation', description: 'HuggingFace MusicGen integration', updated: '2026-01-04' },
            { id: 'voice', title: 'Emotional TTS System', description: 'Multi-provider speech synthesis', updated: '2026-01-05' },
            { id: 'elevenlabs-api', title: 'ElevenLabs API', description: 'Audio Tags, SSML, voice settings', updated: '2026-01-05' },
            { id: 'models', title: 'AI Model Inventory', description: 'Text2midi, PSYCHOSCORE, MusicGen', updated: '2026-01-05' },
        ]
    },
    {
        id: 'database',
        title: 'Database & Storage',
        icon: <Database className="w-5 h-5" />,
        description: 'PostgreSQL schema, pgvector, and optimization',
        articles: [
            { id: 'schema', title: 'Database Schema', description: 'Tables, indexes, and relationships', updated: '2026-01-04' },
            { id: 'jsonb-optimization', title: 'JSONB Optimization', description: 'GIN indexes for psychometric metadata', updated: '2026-01-05' },
            { id: 'optimization', title: 'Query Optimization', description: 'B-tree indexes, full-text search', updated: '2026-01-04' },
            { id: 'pgvector', title: 'Vector Embeddings', description: 'pgvector setup and usage', updated: '2026-01-04' },
        ]
    },
    {
        id: 'deployment',
        title: 'Setup & Deployment',
        icon: <Server className="w-5 h-5" />,
        description: 'Installation, configuration, and operations',
        articles: [
            { id: 'quickstart', title: 'Quick Start Guide', description: '5-minute setup walkthrough', updated: '2026-01-04' },
            { id: 'docker', title: 'Docker Deployment', description: 'Container orchestration guide', updated: '2026-01-04' },
            { id: 'env-config', title: 'Environment Configuration', description: 'API keys and settings', updated: '2026-01-04' },
        ]
    },
    {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        icon: <GitBranch className="w-5 h-5" />,
        description: 'Common issues and debugging guides',
        articles: [
            { id: 'common-issues', title: 'Common Issues', description: 'FAQ and quick fixes', updated: '2026-01-04' },
            { id: 'audio', title: 'Audio Debugging', description: 'Tone.js and synthesis issues', updated: '2026-01-04' },
            { id: 'performance', title: 'Performance Tuning', description: 'WebWorker and optimization', updated: '2026-01-04' },
        ]
    },
];

export default function WikiPage() {
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="border-b border-white/10 px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-lg z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to App</span>
                        </Link>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center">
                                <Book className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">
                                    <span className="text-[#FFD700]">MPN</span>
                                    <span className="text-white/60 ml-2">Wiki</span>
                                </h1>
                                <p className="text-xs text-white/40">Documentation v3.6.1</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                        <span>Last Updated: 2026-01-10 17:15 CST</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">
                        <span className="text-[#FFD700]">Complete</span> System Documentation
                    </h2>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        In-depth guides, architecture diagrams, API references, and troubleshooting
                        for the Musical Psychometric Notation system.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-3 gap-4 mb-16">
                    <Link href="/wiki/architecture/data-flow" className="group p-4 rounded-xl border border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <Layers className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-emerald-400">Data Flow Diagram</h3>
                                <p className="text-xs text-white/50">Interactive architecture visualization</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/wiki/deployment/quickstart" className="group p-4 rounded-xl border border-blue-500/30 hover:border-blue-500 bg-blue-500/5 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Server className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-400">Quick Start</h3>
                                <p className="text-xs text-white/50">Get running in 5 minutes</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/wiki/ai/voice" className="group p-4 rounded-xl border border-purple-500/30 hover:border-purple-500 bg-purple-500/5 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Volume2 className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-purple-400">Voice Integration</h3>
                                <p className="text-xs text-white/50">Emotional TTS setup guide</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/mpn-reference" className="group p-4 rounded-xl border border-[#FFD700]/30 hover:border-[#FFD700] bg-[#FFD700]/5 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                                <Book className="w-5 h-5 text-[#FFD700]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#FFD700]">Reference Dictionary</h3>
                                <p className="text-xs text-white/50">Interactive psychometric criteria</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Section Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {WIKI_SECTIONS.map((section) => (
                        <div
                            key={section.id}
                            className="group p-6 rounded-xl border border-white/10 hover:border-[#FFD700]/30 bg-white/5 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-[#FFD700]/20 flex items-center justify-center group-hover:bg-[#FFD700]/30 transition">
                                    <span className="text-[#FFD700]">{section.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{section.title}</h3>
                                    <p className="text-xs text-white/50">{section.articles.length} articles</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/60 mb-4">{section.description}</p>
                            <div className="space-y-2">
                                {section.articles.map((article) => (
                                    <Link
                                        key={article.id}
                                        href={`/wiki/${section.id}/${article.id}`}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition group/item"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-white/40" />
                                            <span className="text-sm">{article.title}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/20 group-hover/item:text-[#FFD700] transition" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Version History */}
                <div className="mt-16 p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-[#FFD700]" />
                        Recent Updates
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-white/40 font-mono">2026-01-10</span>
                            <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">VERIFIED</span>
                            <span>Full system verification: 293 unit + 64 E2E tests passing, PSYCHOSCORE on CUDA</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-white/40 font-mono">2026-01-10</span>
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs">AUTH</span>
                            <span>Login/Auth flow complete: bcrypt + httpOnly cookies, middleware protection</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-white/40 font-mono">2026-01-10</span>
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-xs">UPDATE</span>
                            <span>Emotion→Voice mapping enhanced with Dark Triad modulation</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-white/40 font-mono">2026-01-06</span>
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs">UPDATE</span>
                            <span>ISA v2.0: Strict Act detection, corrected metadata ordering, and Gemini-3-Flash alignment</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-white/40 font-mono">2026-01-05</span>
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-xs">NEW</span>
                            <span>PSYCHOSCORE documentation suite (5 pages: overview, architecture, 57D, training, API)</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-white/40 font-mono">2026-01-05</span>
                            <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-400 text-xs">NEW</span>
                            <span>ElevenLabs API reference (Audio Tags, SSML, emotion mapping)</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-white/40 font-mono">2026-01-05</span>
                            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs">NEW</span>
                            <span>JSONB Optimization guide (GIN indexes for psychometric metadata)</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-white/40 font-mono">2026-01-04</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">NEW</span>
                            <span>Added Leitmotif Transformation documentation (Williams/Shore techniques)</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-white/40 font-mono">2026-01-04</span>
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs">UPDATE</span>
                            <span>PostgreSQL optimization with GIN/B-tree indexing guide</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 px-6 py-8 mt-16">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-white/40">
                        MPN Conductor Documentation • McKenney-Lacan Applied Theory v3.2
                    </div>
                    <div className="flex items-center gap-6 text-xs">
                        <Link href="/mpn-conductor" className="text-white/60 hover:text-[#FFD700] transition">Conductor</Link>
                        <Link href="/mpn-reference" className="text-white/60 hover:text-[#FFD700] transition">Reference</Link>
                        <Link href="/mpn-lab" className="text-white/60 hover:text-[#FFD700] transition">Lab</Link>
                        <Link href="/play-library" className="text-white/60 hover:text-[#FFD700] transition">Library</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
