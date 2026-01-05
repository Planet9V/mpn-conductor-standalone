'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Check, Copy, Terminal, ExternalLink, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

/**
 * Quick Start Guide - 5-Minute Setup
 * 
 * Updated: 2026-01-04 12:30 CST
 * Version: 3.2.0
 */

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="text-white/40 hover:text-white transition p-1"
        >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
    );
}

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
    return (
        <div className="relative group">
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition">
                <CopyButton text={code} />
            </div>
            <pre className="bg-black/60 border border-white/10 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-emerald-300 font-mono">{code}</code>
            </pre>
        </div>
    );
}

export default function QuickStartPage() {
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
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Terminal className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">Quick Start Guide</h1>
                                <p className="text-xs text-white/40">Setup & Deployment → Quick Start</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">5 min</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Introduction */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Get <span className="text-[#FFD700]">Running</span> in 5 Minutes
                    </h2>
                    <p className="text-lg text-white/60">
                        Follow these steps to set up MPN Conductor on your local machine.
                    </p>
                </div>

                {/* Prerequisites */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">0</span>
                        Prerequisites
                    </h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <ul className="space-y-3 text-white/80">
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-emerald-400" />
                                <span><strong>Node.js 20+</strong> (LTS recommended)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-emerald-400" />
                                <span><strong>npm 10+</strong> or yarn/pnpm</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-emerald-400" />
                                <span><strong>PostgreSQL 14+</strong> (optional, for persistence)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-emerald-400" />
                                <span><strong>Docker</strong> (optional, for containerized deployment)</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Step 1: Clone */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">1</span>
                        Clone the Repository
                    </h3>
                    <CodeBlock code={`git clone https://github.com/your-org/mpn-conductor-standalone.git
cd mpn-conductor-standalone`} />
                </section>

                {/* Step 2: Install */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">2</span>
                        Install Dependencies
                    </h3>
                    <CodeBlock code={`npm install`} />
                    <p className="mt-4 text-sm text-white/60">
                        This will install all required packages including Next.js 16, React 19, Tone.js, and Tailwind CSS 4.
                    </p>
                </section>

                {/* Step 3: Environment */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">3</span>
                        Configure Environment
                    </h3>
                    <CodeBlock code={`cp .env.example .env.local`} />
                    <p className="mt-4 text-sm text-white/60 mb-4">
                        Edit <code className="bg-white/10 px-2 py-0.5 rounded">.env.local</code> with your API keys:
                    </p>
                    <CodeBlock code={`# Required for AI features
OPENROUTER_API_KEY=your_openrouter_key
HUGGINGFACE_API_KEY=your_hf_key

# Required for voice features
ELEVENLABS_API_KEY=your_elevenlabs_key

# Optional: Azure for emotional TTS
AZURE_SPEECH_KEY=your_azure_key
AZURE_SPEECH_REGION=eastus

# Optional: PostgreSQL connection
DATABASE_URL=postgresql://user:pass@localhost:5432/mpn`} />

                    <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-amber-200 font-medium">API Keys are Optional</p>
                                <p className="text-xs text-amber-200/70 mt-1">
                                    The application works without API keys using algorithmic composition.
                                    AI features will be disabled until keys are configured.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 4: Run */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">4</span>
                        Start Development Server
                    </h3>
                    <CodeBlock code={`npm run dev`} />
                    <p className="mt-4 text-sm text-white/60">
                        Open <a href="http://localhost:3000" className="text-[#FFD700] hover:underline">http://localhost:3000</a> in your browser.
                    </p>
                </section>

                {/* Step 5: Test */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-sm text-emerald-400">✓</span>
                        Verify Installation
                    </h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <span>Visit <Link href="/mpn-conductor" className="text-[#FFD700] hover:underline">/mpn-conductor</Link> - Main orchestrator page</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <span>Select a scenario from the dropdown</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <span>Click "Play" to hear generated music</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <span>Try "Export MP3" or "Export MIDI" buttons</span>
                        </div>
                    </div>
                </section>

                {/* Docker Alternative */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm">🐳</span>
                        Docker Alternative
                    </h3>
                    <CodeBlock code={`# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down`} />
                </section>

                {/* Next Steps */}
                <section className="p-6 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/5">
                    <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Next Steps</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/wiki/architecture/data-flow" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium">Understand the Architecture</h4>
                            <p className="text-xs text-white/50 mt-1">Learn how data flows through the system</p>
                        </Link>
                        <Link href="/wiki/ai/voice" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium">Configure Voice Features</h4>
                            <p className="text-xs text-white/50 mt-1">Set up ElevenLabs or Azure TTS</p>
                        </Link>
                        <Link href="/wiki/database/schema" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium">Set Up PostgreSQL</h4>
                            <p className="text-xs text-white/50 mt-1">Enable script persistence and vector search</p>
                        </Link>
                        <Link href="/wiki/features/leitmotif" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium">Explore Leitmotif System</h4>
                            <p className="text-xs text-white/50 mt-1">Professional film score techniques</p>
                        </Link>
                    </div>
                </section>

                {/* Troubleshooting */}
                <section className="mt-12 p-6 rounded-xl border border-red-500/20 bg-red-500/5">
                    <h3 className="text-lg font-semibold mb-4 text-red-400">Common Issues</h3>
                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="font-medium text-white/90">Audio not playing?</p>
                            <p className="text-white/60 mt-1">Click the "Enable Audio" button - browsers require user interaction before playing audio.</p>
                        </div>
                        <div>
                            <p className="font-medium text-white/90">Build errors with Tone.js?</p>
                            <p className="text-white/60 mt-1">Ensure you're using Node.js 20+ and clear <code className="bg-white/10 px-1 rounded">.next</code> folder.</p>
                        </div>
                        <div>
                            <p className="font-medium text-white/90">Port 3000 already in use?</p>
                            <p className="text-white/60 mt-1">Use <code className="bg-white/10 px-1 rounded">npm run dev -- -p 3001</code> to run on a different port.</p>
                        </div>
                    </div>
                    <Link href="/wiki/troubleshooting/common-issues" className="inline-flex items-center gap-2 mt-4 text-red-400 hover:text-red-300 transition text-sm">
                        View all troubleshooting guides <ExternalLink className="w-4 h-4" />
                    </Link>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • Quick Start Guide</span>
                    <span>Last updated: 2026-01-04 12:30 CST</span>
                </div>
            </footer>
        </div>
    );
}
