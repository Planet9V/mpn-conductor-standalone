'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Check, X, AlertTriangle } from 'lucide-react';

/**
 * Component Dependency Matrix
 * 
 * Updated: 2026-01-06 01:15 CST
 * Version: 3.9.0
 */

interface ComponentDep {
    name: string;
    file: string;
    dependsOn: string[];
    providesTo: string[];
    status: 'complete' | 'partial' | 'planned';
    description: string;
}

const COMPONENTS: ComponentDep[] = [
    {
        name: 'ScoreOrchestrator',
        file: 'score_orchestrator.ts',
        dependsOn: ['GeniusComposer', 'LeitmotifGenerator', 'PsychometricCalculus'],
        providesTo: ['MPNSynthesizer', 'page.tsx', 'OrchestratorWorker'],
        status: 'complete',
        description: 'Multi-stave coordination and frame processing'
    },
    {
        name: 'GeniusComposer',
        file: 'GeniusComposer.ts',
        dependsOn: ['AIMusicClient', 'StylePresets', 'LeitmotifTransformRules'],
        providesTo: ['ScoreOrchestrator'],
        status: 'complete',
        description: 'Melody/chord generation with AI and professional transformations'
    },
    {
        name: 'LeitmotifGenerator',
        file: 'leitmotif_generator.ts',
        dependsOn: ['PsychometricInstrumentMapper'],
        providesTo: ['GeniusComposer', 'ScoreOrchestrator'],
        status: 'complete',
        description: 'Actor-specific theme generation and variation'
    },
    {
        name: 'LeitmotifTransformRules',
        file: 'leitmotif_transformation_rules.ts',
        dependsOn: ['PsychometricCalculus'],
        providesTo: ['GeniusComposer'],
        status: 'complete',
        description: 'Williams/Shore professional transformation techniques'
    },
    {
        name: 'MPNSynthesizer',
        file: 'MPNSynthesizer.ts',
        dependsOn: ['Tone.js', 'Samplers'],
        providesTo: ['AudioOutput', 'LeadVoiceManager'],
        status: 'complete',
        description: 'Audio synthesis with Tone.js samplers'
    },
    {
        name: 'OrchestratorWorker',
        file: 'orchestrator.worker.ts',
        dependsOn: ['ScoreOrchestrator'],
        providesTo: ['page.tsx'],
        status: 'complete',
        description: 'WebWorker for off-thread score processing'
    },
    {
        name: 'ElevenLabsClient',
        file: 'voice_client.ts',
        dependsOn: ['ElevenLabs API'],
        providesTo: ['LeadVoiceManager', 'EmotionalTTSRenderer'],
        status: 'complete',
        description: 'Text-to-speech synthesis client with 9 emotion styles (2026-01-05)'
    },
    {
        name: 'EmotionalTTSRenderer',
        file: 'emotional_tts_renderer.ts',
        dependsOn: ['ElevenLabsClient', 'Azure Speech API'],
        providesTo: ['LeadVoiceManager'],
        status: 'complete',
        description: 'GST-based emotional speech synthesis'
    },
    {
        name: 'AIMusicClient',
        file: 'ai_music_client.ts',
        dependsOn: ['OpenRouter API', 'HuggingFace API'],
        providesTo: ['GeniusComposer'],
        status: 'complete',
        description: 'AI melody generation via HuggingFace MusicGen'
    },
    {
        name: 'Text2MidiClient',
        file: 'text2midi_client.ts',
        dependsOn: ['AMAAI-Lab API'],
        providesTo: ['GeniusComposer'],
        status: 'planned',
        description: 'Text-to-MIDI generation (planned)'
    },
    {
        name: 'MidiWriter',
        file: 'midi_writer.ts',
        dependsOn: [],
        providesTo: ['ScoreExporter'],
        status: 'complete',
        description: 'Dependency-free MIDI file generation'
    },
    {
        name: 'AudioExporter',
        file: 'audio_exporter.ts',
        dependsOn: ['Tone.js', 'lamejs'],
        providesTo: ['ExportButton'],
        status: 'complete',
        description: 'MP3 export via Tone.js offline rendering'
    },
    // === PHASE 7: DYNAMIC CONDUCTOR UI (Added 2026-01-05) ===
    {
        name: 'ActorInstrumentPicker',
        file: 'ActorInstrumentPicker.tsx',
        dependsOn: ['OrchestrationOptions', 'DISC Profiles'],
        providesTo: ['ConductorScore', 'page.tsx'],
        status: 'complete',
        description: 'Real-time actor-to-instrument mapping with volume/pan/octave controls (Added 2026-01-05)'
    },
    {
        name: 'TimelineScrubber',
        file: 'TimelineScrubber.tsx',
        dependsOn: ['PsychometricSnapshot', 'Transport Controls'],
        providesTo: ['ConductorScore', 'page.tsx'],
        status: 'complete',
        description: 'Psychometric heatmap timeline with beat scrubbing and markers (Added 2026-01-05)'
    },
    {
        name: 'RegenerationAPI',
        file: 'api/regenerate/route.ts',
        dependsOn: ['Database', 'AuditLog'],
        providesTo: ['TimelineScrubber', 'GeniusComposer'],
        status: 'complete',
        description: 'Real-time score regeneration from any beat with dynamic temperature (Added 2026-01-05)'
    },
    // === PHASE 4: AUTH & ADMIN (Added 2026-01-05) ===
    {
        name: 'AuthSystem',
        file: 'api/auth/login/route.ts',
        dependsOn: ['Database', 'bcryptjs'],
        providesTo: ['LoginPage', 'AdminDashboard'],
        status: 'complete',
        description: 'Invitation-only authentication with role-based access (Added 2026-01-05)'
    },
    {
        name: 'AdminDashboard',
        file: 'admin/page.tsx',
        dependsOn: ['AuthSystem', 'UserAPI', 'ConfigAPI'],
        providesTo: ['SystemAdmin'],
        status: 'complete',
        description: 'User management, system config, and audit log viewer (Added 2026-01-05)'
    },
    {
        name: 'UserDashboard',
        file: 'dashboard/page.tsx',
        dependsOn: ['AuthSystem', 'ProjectsAPI'],
        providesTo: ['EndUsers'],
        status: 'complete',
        description: 'Personal project management with shared library access (Added 2026-01-05)'
    },
    // === PHASE 8: SCRIPT PROCESSING PIPELINE (Added 2026-01-06) ===
    {
        name: 'AIScriptValidator',
        file: 'AIScriptValidator.tsx',
        dependsOn: ['OpenRouter API', 'Gemini-3-Flash'],
        providesTo: ['ProcessingWizard', 'PlayLibraryImport'],
        status: 'complete',
        description: 'ISA v2.3-HARDENED: Intelligent Script Analysis with aggressive metadata scrubbing (Updated 2026-01-06)'
    },
    {
        name: 'ProcessingWizard',
        file: 'ProcessingWizard.tsx',
        dependsOn: ['ElevenLabsClient', 'StylesAPI', 'VoicesAPI'],
        providesTo: ['ProcessingReport', 'PlayLibrary'],
        status: 'complete',
        description: '5-step wizard: Character voices, psychometrics, styles, music params (Updated 2026-01-06)'
    },
    {
        name: 'ProcessingReport',
        file: 'ProcessingReport.tsx',
        dependsOn: ['ProcessingWizard', 'CharacterConfig'],
        providesTo: ['PlayLibraryImport'],
        status: 'complete',
        description: 'Voice preview with ElevenLabs integration and psychometric display (Updated 2026-01-06)'
    },
    {
        name: 'PlayLibraryPage',
        file: 'play-library/page.tsx',
        dependsOn: ['PlaysAPI', 'ProcessingWizard', 'ProcessingReport'],
        providesTo: ['EndUsers', 'MPNConductorPage'],
        status: 'complete',
        description: 'Script/scenario management with CRUD operations (Updated 2026-01-06)'
    },
    {
        name: 'ScenarioLoader',
        file: 'mpn-conductor/page.tsx',
        dependsOn: ['PlaysAPI', 'LITERARY_SCENARIOS'],
        providesTo: ['MPNConductorPage'],
        status: 'complete',
        description: 'Dynamic scenario loading from DB with fallback to built-in scenarios (Added 2026-01-06)'
    },
    {
        name: 'PlaysAPI',
        file: 'api/plays/route.ts + [id]/route.ts',
        dependsOn: ['Database'],
        providesTo: ['PlayLibraryPage', 'ScenarioLoader'],
        status: 'complete',
        description: 'Full CRUD for plays with year column and processed_data JSONB (Updated 2026-01-06)'
    },
];

export default function ComponentsPage() {
    const complete = COMPONENTS.filter(c => c.status === 'complete').length;
    const planned = COMPONENTS.filter(c => c.status === 'planned').length;

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
                                <Book className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">Component Dependency Matrix</h1>
                                <p className="text-xs text-white/40">System Architecture → Components</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <span className="text-white/40">Updated: 2026-01-06</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Summary Stats */}
                <div className="grid md:grid-cols-3 gap-4 mb-12">
                    <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                        <div className="text-3xl font-bold text-emerald-400">{complete}</div>
                        <div className="text-sm text-white/60">Complete</div>
                    </div>
                    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                        <div className="text-3xl font-bold text-amber-400">{COMPONENTS.filter(c => c.status === 'partial').length}</div>
                        <div className="text-sm text-white/60">Partial</div>
                    </div>
                    <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
                        <div className="text-3xl font-bold text-blue-400">{planned}</div>
                        <div className="text-sm text-white/60">Planned</div>
                    </div>
                </div>

                {/* Component Matrix Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="text-left py-3 px-4 font-semibold text-[#FFD700]">Component</th>
                                <th className="text-left py-3 px-4 font-semibold text-[#FFD700]">File</th>
                                <th className="text-left py-3 px-4 font-semibold text-[#FFD700]">Depends On</th>
                                <th className="text-left py-3 px-4 font-semibold text-[#FFD700]">Provides To</th>
                                <th className="text-center py-3 px-4 font-semibold text-[#FFD700]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMPONENTS.map((comp, idx) => (
                                <tr key={comp.name} className={`border-b border-white/10 ${idx % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                                    <td className="py-4 px-4">
                                        <div>
                                            <div className="font-medium">{comp.name}</div>
                                            <div className="text-xs text-white/50 mt-1">{comp.description}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <code className="text-xs bg-white/10 px-2 py-1 rounded">{comp.file}</code>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {comp.dependsOn.map(dep => (
                                                <span key={dep} className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                                                    {dep}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {comp.providesTo.map(dep => (
                                                <span key={dep} className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                                    {dep}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        {comp.status === 'complete' && (
                                            <span className="inline-flex items-center gap-1 text-emerald-400">
                                                <Check className="w-4 h-4" /> Complete
                                            </span>
                                        )}
                                        {comp.status === 'partial' && (
                                            <span className="inline-flex items-center gap-1 text-amber-400">
                                                <AlertTriangle className="w-4 h-4" /> Partial
                                            </span>
                                        )}
                                        {comp.status === 'planned' && (
                                            <span className="inline-flex items-center gap-1 text-blue-400">
                                                <span className="w-2 h-2 rounded-full bg-blue-400" /> Planned
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Dependency Graph Legend */}
                <div className="mt-12 p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Understanding Dependencies</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <h4 className="font-medium text-[#FFD700] mb-2">Core Processing Chain</h4>
                            <div className="text-white/70 font-mono text-xs bg-black/50 p-3 rounded">
                                page.tsx → OrchestratorWorker → ScoreOrchestrator → GeniusComposer → LeitmotifGenerator
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-[#FFD700] mb-2">Audio Output Chain</h4>
                            <div className="text-white/70 font-mono text-xs bg-black/50 p-3 rounded">
                                ScoreOrchestrator → MPNSynthesizer → Tone.js → AudioContext
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-[#FFD700] mb-2">Voice Synthesis Chain</h4>
                            <div className="text-white/70 font-mono text-xs bg-black/50 p-3 rounded">
                                LeadVoiceManager → EmotionalTTSRenderer → ElevenLabs/Azure → AudioBuffer
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-[#FFD700] mb-2">Export Chain</h4>
                            <div className="text-white/70 font-mono text-xs bg-black/50 p-3 rounded">
                                ScoreExporter → MidiWriter / AudioExporter → Blob → Download
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Documentation */}
                <section className="mt-12 p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Related Documentation</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link href="/wiki/architecture/data-flow" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Data Flow Architecture</h4>
                            <p className="text-xs text-white/50 mt-1">Complete system data pipeline</p>
                        </Link>
                        <Link href="/wiki/deployment/docker" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Docker Deployment</h4>
                            <p className="text-xs text-white/50 mt-1">Container orchestration guide</p>
                        </Link>
                        <Link href="/wiki/ai/models" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">AI Model Inventory</h4>
                            <p className="text-xs text-white/50 mt-1">Complete model catalog</p>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • Component Dependency Matrix</span>
                    <span>Last updated: 2026-01-06 01:15 CST</span>
                </div>
            </footer>
        </div>
    );
}
