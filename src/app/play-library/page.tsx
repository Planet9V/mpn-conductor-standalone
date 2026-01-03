'use client';

import React, { useState, useEffect } from 'react';
import { Book, Upload, Search, Clock, User, ChevronRight, ExternalLink, Download, Plus } from 'lucide-react';
import Link from 'next/link';
import { LITERARY_SCENARIOS } from '@/components/mpn-lab/literary_data';
import { LiteraryScenario, ScenarioFrame } from '@/components/mpn-lab/types';

export default function PlayLibraryPage() {
    const [selectedPlay, setSelectedPlay] = useState<LiteraryScenario | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredPlays = LITERARY_SCENARIOS.filter(play =>
        play.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        play.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        play.theme.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group by author
    const playsByAuthor = filteredPlays.reduce((acc, play) => {
        const author = play.author;
        if (!acc[author]) acc[author] = [];
        acc[author].push(play);
        return acc;
    }, {} as Record<string, LiteraryScenario[]>);

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Book className="w-8 h-8 text-amber-400" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Play Library</h1>
                            <p className="text-sm text-gray-400">
                                {LITERARY_SCENARIOS.length} plays • Complete texts for psychometric analysis
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/mpn-conductor"
                            className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition flex items-center gap-2"
                        >
                            <ChevronRight className="w-4 h-4" />
                            MPN Conductor
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Search & Actions Bar */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="flex-1 min-w-64 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search plays by title, author, or theme..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>
                    <button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition"
                    >
                        {viewMode === 'grid' ? 'List View' : 'Grid View'}
                    </button>
                    <Link
                        href="/play-library/import"
                        className="px-4 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Import New Play
                    </Link>
                </div>

                {/* If a play is selected, show the full text view */}
                {selectedPlay ? (
                    <PlayFullView play={selectedPlay} onClose={() => setSelectedPlay(null)} />
                ) : (
                    /* Play Grid/List */
                    <div className="space-y-8">
                        {Object.entries(playsByAuthor).map(([author, plays]) => (
                            <section key={author}>
                                <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-amber-400" />
                                    {author}
                                    <span className="text-sm text-gray-500 font-normal">({plays.length} plays)</span>
                                </h2>
                                <div className={viewMode === 'grid'
                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                    : "space-y-3"
                                }>
                                    {plays.map((play) => (
                                        <PlayCard
                                            key={play.id}
                                            play={play}
                                            viewMode={viewMode}
                                            onClick={() => setSelectedPlay(play)}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

// ============================================================================
// PLAY CARD COMPONENT
// ============================================================================

function PlayCard({
    play,
    viewMode,
    onClick
}: {
    play: LiteraryScenario;
    viewMode: 'grid' | 'list';
    onClick: () => void;
}) {
    const avgTrauma = play.frames.reduce((sum, f) => sum + f.trauma, 0) / play.frames.length;
    const avgEntropy = play.frames.reduce((sum, f) => sum + f.entropy, 0) / play.frames.length;
    const speakers = [...new Set(play.frames.map(f => f.script.speaker))];

    if (viewMode === 'list') {
        return (
            <button
                onClick={onClick}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition text-left flex items-center gap-4"
            >
                <div
                    className="w-2 h-12 rounded-full"
                    style={{ backgroundColor: play.color }}
                />
                <div className="flex-1">
                    <h3 className="font-semibold text-white">{play.title}</h3>
                    <p className="text-sm text-gray-400">{play.theme}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                    <p>{play.frames.length} scenes</p>
                    <p>{speakers.length} characters</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className="group p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-all text-left"
        >
            <div className="flex items-start justify-between mb-3">
                <div
                    className="w-3 h-12 rounded-full"
                    style={{ backgroundColor: play.color }}
                />
                <div className="text-right text-xs text-gray-500">
                    <p>{play.frames.length} scenes</p>
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition">{play.title}</h3>
            <p className="text-sm text-gray-400 mb-3">{play.theme}</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {speakers.slice(0, 4).map(speaker => (
                    <span
                        key={speaker}
                        className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-400"
                    >
                        {speaker}
                    </span>
                ))}
                {speakers.length > 4 && (
                    <span className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-500">
                        +{speakers.length - 4} more
                    </span>
                )}
            </div>
            <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-gray-500">τ: {avgTrauma.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-gray-500">H: {avgEntropy.toFixed(2)}</span>
                </div>
            </div>
        </button>
    );
}

// ============================================================================
// FULL PLAY VIEW COMPONENT
// ============================================================================

function PlayFullView({ play, onClose }: { play: LiteraryScenario; onClose: () => void }) {
    const [activeScene, setActiveScene] = useState(0);
    const speakers = [...new Set(play.frames.map(f => f.script.speaker))];

    // Assign colors to speakers
    const speakerColors: Record<string, string> = {};
    const colorPalette = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
    speakers.forEach((speaker, i) => {
        speakerColors[speaker] = colorPalette[i % colorPalette.length];
    });

    return (
        <div className="fixed inset-0 z-50 bg-black/95 overflow-hidden flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div
                        className="w-3 h-10 rounded-full"
                        style={{ backgroundColor: play.color }}
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-white">{play.title}</h1>
                        <p className="text-sm text-gray-400">{play.author} • {play.theme}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href={`/mpn-conductor?scenario=${play.id}`}
                        className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition flex items-center gap-2"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Analyze in Conductor
                    </Link>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition"
                    >
                        Close
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Scene Navigator */}
                <aside className="w-64 flex-shrink-0 border-r border-white/10 overflow-y-auto bg-black/50">
                    <div className="p-4">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Scenes ({play.frames.length})
                        </h2>
                        <div className="space-y-1">
                            {play.frames.map((frame, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveScene(index)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${activeScene === index
                                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <div className="font-medium truncate">{frame.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{frame.script.speaker}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content - Full Script */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Character Legend */}
                        <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                Characters
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {speakers.map(speaker => (
                                    <div
                                        key={speaker}
                                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: speakerColors[speaker] }}
                                        />
                                        <span className="text-sm text-gray-300">{speaker}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Full Script */}
                        <div className="space-y-6">
                            {play.frames.map((frame, index) => (
                                <div
                                    key={index}
                                    id={`scene-${index}`}
                                    className={`p-6 rounded-xl border transition ${activeScene === index
                                            ? 'bg-amber-500/10 border-amber-500/30'
                                            : 'bg-white/5 border-white/10'
                                        }`}
                                >
                                    {/* Scene Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <span className="text-gray-500">#{index + 1}</span>
                                            {frame.name}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className="px-2 py-1 rounded bg-red-500/20 text-red-400">
                                                τ: {frame.trauma.toFixed(2)}
                                            </span>
                                            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                                                H: {frame.entropy.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stage Direction / Description */}
                                    <p className="text-sm text-gray-500 italic mb-4">{frame.description}</p>

                                    {/* Dialogue */}
                                    <div className="flex gap-4 mb-4">
                                        <div
                                            className="w-1 rounded-full"
                                            style={{ backgroundColor: speakerColors[frame.script.speaker] }}
                                        />
                                        <div className="flex-1">
                                            <span
                                                className="font-bold text-sm uppercase tracking-wider"
                                                style={{ color: speakerColors[frame.script.speaker] }}
                                            >
                                                {frame.script.speaker}
                                            </span>
                                            <p className="text-white mt-1 leading-relaxed">
                                                "{frame.script.text}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Musical/Analytical Notes */}
                                    <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Chord:</span>
                                            <span className="ml-2 text-amber-400">{frame.script.chord}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Analysis:</span>
                                            <span className="ml-2 text-gray-300">{frame.script.analysis}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Stats Sidebar */}
                <aside className="w-72 flex-shrink-0 border-l border-white/10 overflow-y-auto bg-black/50 p-4">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Play Statistics
                    </h2>

                    <div className="space-y-4">
                        <StatCard
                            label="Total Scenes"
                            value={play.frames.length.toString()}
                        />
                        <StatCard
                            label="Characters"
                            value={speakers.length.toString()}
                        />
                        <StatCard
                            label="Avg Trauma (τ)"
                            value={(play.frames.reduce((s, f) => s + f.trauma, 0) / play.frames.length).toFixed(3)}
                        />
                        <StatCard
                            label="Avg Entropy (H)"
                            value={(play.frames.reduce((s, f) => s + f.entropy, 0) / play.frames.length).toFixed(3)}
                        />
                        <StatCard
                            label="Peak Trauma"
                            value={Math.max(...play.frames.map(f => f.trauma)).toFixed(2)}
                        />

                        <div className="pt-4 border-t border-white/10">
                            <h3 className="text-sm font-semibold text-gray-400 mb-3">Lines by Character</h3>
                            <div className="space-y-2">
                                {speakers.map(speaker => {
                                    const count = play.frames.filter(f => f.script.speaker === speaker).length;
                                    const pct = (count / play.frames.length) * 100;
                                    return (
                                        <div key={speaker} className="text-sm">
                                            <div className="flex justify-between text-gray-400 mb-1">
                                                <span>{speaker}</span>
                                                <span>{count} ({pct.toFixed(0)}%)</span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${pct}%`,
                                                        backgroundColor: speakerColors[speaker]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
            <div className="text-xl font-bold text-white mt-1">{value}</div>
        </div>
    );
}
