'use client';

/**
 * MPN Reference Dictionary Page
 * Interactive reference for all musical↔psychometric mappings
 * Changes here directly impact script→JSON conversion
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Music, Layers, Zap, Volume2,
    ChevronDown, ChevronRight, BookOpen, Code, Grid, List,
    Settings, Play, Users, Star, Wand2, Cpu, Brain, ExternalLink
} from 'lucide-react';
import { OXOTLogo } from '@/components/branding/OXOTLogo';
import { PageHeader } from '@/components/branding/PageHeader';
import {
    MPN_REFERENCE_DICTIONARY,
    getEntriesByCategory,
    searchEntries,
    getAdjustableEntries
} from '@/components/mpn-lab/mpn_reference_data';
import { MPNCategory, MPNReferenceEntry, PsychometricDimension } from '@/components/mpn-lab/mpn_reference_types';
import {
    OrchestrationOption,
    ORCHESTRATION_OPTIONS,
    LEITMOTIF_TRANSFORMATIONS,
    getRecommendedOption
} from '@/components/mpn-lab/mpn_orchestration_options';
import ParameterAdjustmentPanel from '@/components/mpn-lab/ParameterAdjustmentPanel';
import PresetManager from '@/components/mpn-lab/PresetManager';
import { MPNPreset } from '@/components/mpn-lab/mpn_preset_types';

// Category metadata
const CATEGORY_META: Record<MPNCategory, { name: string; icon: React.ReactNode; color: string }> = {
    [MPNCategory.TIMBRE]: { name: 'Timbre', icon: <Music className="w-4 h-4" />, color: 'text-purple-400' },
    [MPNCategory.RHYTHM]: { name: 'Rhythm', icon: <Zap className="w-4 h-4" />, color: 'text-yellow-400' },
    [MPNCategory.HARMONY]: { name: 'Harmony', icon: <Layers className="w-4 h-4" />, color: 'text-blue-400' },
    [MPNCategory.DYNAMICS]: { name: 'Dynamics', icon: <Volume2 className="w-4 h-4" />, color: 'text-red-400' },
    [MPNCategory.MELODY]: { name: 'Melody', icon: <Music className="w-4 h-4" />, color: 'text-green-400' },
    [MPNCategory.TEXTURE]: { name: 'Texture', icon: <Grid className="w-4 h-4" />, color: 'text-cyan-400' },
    [MPNCategory.MODE]: { name: 'Mode/Scale', icon: <Layers className="w-4 h-4" />, color: 'text-pink-400' },
    [MPNCategory.INTERVALS]: { name: 'Intervals', icon: <Zap className="w-4 h-4" />, color: 'text-orange-400' },
    [MPNCategory.ARTICULATION]: { name: 'Articulation', icon: <Play className="w-4 h-4" />, color: 'text-indigo-400' },
    [MPNCategory.SILENCE]: { name: 'Silence', icon: <Settings className="w-4 h-4" />, color: 'text-gray-400' },
};

const DIMENSION_LABELS: Record<PsychometricDimension, string> = {
    [PsychometricDimension.DISC]: 'DISC Profile',
    [PsychometricDimension.BIG_FIVE]: 'Big Five/OCEAN',
    [PsychometricDimension.DARK_TRIAD]: 'Dark Triad',
    [PsychometricDimension.LACANIAN]: 'Lacanian Register',
    [PsychometricDimension.COGNITIVE_BIAS]: 'Cognitive Bias',
    [PsychometricDimension.EMOTION]: 'Emotion',
    [PsychometricDimension.TRAUMA]: 'Trauma Level',
    [PsychometricDimension.ENTROPY]: 'Entropy',
    [PsychometricDimension.RELATIONSHIP]: 'Relationship',
    [PsychometricDimension.STABILITY]: 'Stability',
};

const ORCHESTRATION_ICONS: Record<OrchestrationOption, React.ReactNode> = {
    [OrchestrationOption.FULL_ORCHESTRA]: <Users className="w-5 h-5" />,
    [OrchestrationOption.STRING_QUARTET]: <Music className="w-5 h-5" />,
    [OrchestrationOption.JAZZ_ENSEMBLE]: <Zap className="w-5 h-5" />,
    [OrchestrationOption.LEITMOTIF_WAGNERIAN]: <Wand2 className="w-5 h-5" />,
};

type ViewMode = 'card' | 'table' | 'theory';

export default function MPNReferencePage() {
    const [selectedCategory, setSelectedCategory] = useState<MPNCategory | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDimension, setSelectedDimension] = useState<PsychometricDimension | 'all'>('all');
    const [showAdjustableOnly, setShowAdjustableOnly] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('card');
    const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
    const [selectedOrchestration, setSelectedOrchestration] = useState<OrchestrationOption>(
        OrchestrationOption.LEITMOTIF_WAGNERIAN
    );

    const currentOrchConfig = ORCHESTRATION_OPTIONS[selectedOrchestration];

    // Adjustment & Preset State
    const [adjustingEntry, setAdjustingEntry] = useState<MPNReferenceEntry | null>(null);
    const [currentAdjustments, setCurrentAdjustments] = useState<Record<string, any>>({});

    const handleLoadPreset = (preset: MPNPreset) => {
        console.log('Loading preset:', preset.name);
        setCurrentAdjustments(preset.adjustments);
        // Toast or notification here
    };

    // Filter entries
    const filteredEntries = useMemo(() => {
        let entries: MPNReferenceEntry[] = [];

        if (selectedCategory === 'all') {
            entries = Object.values(MPN_REFERENCE_DICTIONARY.categories).flat();
        } else {
            entries = getEntriesByCategory(selectedCategory);
        }

        if (searchTerm) {
            const searchResults = searchEntries(searchTerm);
            entries = entries.filter(e => searchResults.some(r => r.id === e.id));
        }

        if (selectedDimension !== 'all') {
            entries = entries.filter(e =>
                e.psychometricMappings.some(m => m.dimension === selectedDimension)
            );
        }

        if (showAdjustableOnly) {
            entries = entries.filter(e => e.adjustable);
        }

        return entries;
    }, [selectedCategory, searchTerm, selectedDimension, showAdjustableOnly]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
            {/* Hero */}
            <section className="py-16 px-6 border-b border-white/10">
                <div className="max-w-7xl mx-auto text-center">
                    <OXOTLogo className="w-12 h-12 mx-auto mb-4" />
                    <PageHeader
                        title="MPN REFERENCE DICTIONARY"
                        subtitle="The Authoritative Musical↔Psychometric Mapping Reference"
                        variant="hero"
                        accent="gold"
                    />
                    <p className="text-gray-500 mt-4 text-sm max-w-xl mx-auto">
                        v{MPN_REFERENCE_DICTIONARY.version} • {MPN_REFERENCE_DICTIONARY.totalEntries} entries •
                        Changes here directly impact script→JSON conversion
                    </p>
                </div>
            </section>

            {/* Orchestration Mode Selector */}
            <section className="py-6 px-6 border-b border-white/10 bg-black/50">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Orchestration Mode
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {Object.values(ORCHESTRATION_OPTIONS).map((config) => (
                            <button
                                key={config.id}
                                onClick={() => setSelectedOrchestration(config.id)}
                                className={`relative p-4 rounded-xl border text-left transition-all ${selectedOrchestration === config.id
                                    ? 'border-oxot-gold bg-oxot-gold/10'
                                    : 'border-white/10 bg-gray-900/50 hover:border-white/30'
                                    }`}
                            >
                                {config.recommended && (
                                    <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-oxot-gold">
                                        <Star className="w-3 h-3 fill-current" /> RECOMMENDED
                                    </span>
                                )}
                                <div className={`flex items-center gap-2 mb-2 ${selectedOrchestration === config.id ? 'text-oxot-gold' : 'text-gray-300'
                                    }`}>
                                    {ORCHESTRATION_ICONS[config.id]}
                                    <span className="font-semibold">{config.name}</span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2">{config.description}</p>
                                <div className="flex gap-2 mt-3">
                                    {config.pros.slice(0, 2).map((pro, i) => (
                                        <span key={i} className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                                            {pro.split(' ').slice(0, 2).join(' ')}
                                        </span>
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Selected mode details */}
                    <motion.div
                        key={selectedOrchestration}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-gray-900/50 rounded-xl border border-white/10"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">Voice Configuration</div>
                                <div className="space-y-1">
                                    {currentOrchConfig.voiceConfiguration.slice(0, 4).map((v, i) => (
                                        <div key={i} className="text-sm text-gray-300">
                                            <span className="text-oxot-gold">{v.role}:</span> {v.instruments.join(', ')}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">Harmonic Style</div>
                                <div className="text-sm text-gray-300 space-y-1">
                                    <div>Voicing: <span className="text-white">{currentOrchConfig.harmonicStyle.chordVoicingDensity}</span></div>
                                    <div>Modulation: <span className="text-white">{currentOrchConfig.harmonicStyle.modulation}</span></div>
                                    <div>Dissonance: <span className="text-white">{Math.round(currentOrchConfig.harmonicStyle.dissonanceTolerance * 100)}%</span></div>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">Rhythmic Style</div>
                                <div className="text-sm text-gray-300 space-y-1">
                                    <div>Time: <span className="text-white">{currentOrchConfig.rhythmicStyle.baseTimeSignatures.join(', ')}</span></div>
                                    <div>Tempo: <span className="text-white">{currentOrchConfig.rhythmicStyle.tempoRange.min}-{currentOrchConfig.rhythmicStyle.tempoRange.max} BPM</span></div>
                                    <div>Syncopation: <span className="text-white">{currentOrchConfig.rhythmicStyle.syncopation}</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Leitmotif transformations for Wagnerian mode */}
                        {selectedOrchestration === OrchestrationOption.LEITMOTIF_WAGNERIAN && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="text-xs text-gray-500 uppercase mb-2">Leitmotif Transformations</div>
                                <div className="flex flex-wrap gap-2">
                                    {LEITMOTIF_TRANSFORMATIONS.map((t) => (
                                        <div key={t.id} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                            <div className="text-xs text-purple-300 font-medium">{t.name}</div>
                                            <div className="text-[10px] text-gray-500">{t.trigger}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Controls Bar */}
            <section className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10 py-3 px-6">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search entries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500"
                        />
                    </div>

                    {/* Dimension Filter */}
                    <select
                        value={selectedDimension}
                        onChange={(e) => setSelectedDimension(e.target.value as PsychometricDimension | 'all')}
                        className="bg-gray-900 border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
                    >
                        <option value="all">All Dimensions</option>
                        {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>

                    {/* Adjustable Only */}
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showAdjustableOnly}
                            onChange={(e) => setShowAdjustableOnly(e.target.checked)}
                            className="rounded border-gray-600 bg-gray-800"
                        />
                        Adjustable Only
                    </label>

                    {/* View Toggles & Presets */}
                    <div className="flex items-center gap-2">
                        <PresetManager
                            onLoadPreset={handleLoadPreset}
                            currentAdjustments={currentAdjustments}
                        />
                        <div className="h-6 w-px bg-white/10 mx-2" />
                        <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1">
                            {(['card', 'table', 'theory'] as ViewMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === mode ? 'bg-oxot-gold text-black' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Count */}
                        <span className="text-gray-500 text-sm">
                            {filteredEntries.length} entries
                        </span>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
                {/* Category Sidebar */}
                <aside className="w-56 flex-shrink-0">
                    <div className="sticky top-24 bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
                        <div className="p-3 border-b border-white/10">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</h3>
                        </div>
                        <nav className="p-2">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'all' ? 'bg-oxot-gold/20 text-oxot-gold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Grid className="w-4 h-4" />
                                All Categories
                                <span className="ml-auto text-xs opacity-60">
                                    {MPN_REFERENCE_DICTIONARY.totalEntries}
                                </span>
                            </button>
                            {Object.entries(CATEGORY_META).map(([cat, meta]) => {
                                const count = getEntriesByCategory(cat as MPNCategory).length;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat as MPNCategory)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat ? 'bg-oxot-gold/20 text-oxot-gold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <span className={meta.color}>{meta.icon}</span>
                                        {meta.name}
                                        <span className="ml-auto text-xs opacity-60">{count}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Entries Grid */}
                <div className="flex-1">
                    {viewMode === 'card' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredEntries.map((entry) => (
                                <EntryCard
                                    key={entry.id}
                                    entry={entry}
                                    expanded={expandedEntry === entry.id}
                                    onToggle={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                                    onAdjust={() => setAdjustingEntry(entry)}
                                />
                            ))}
                        </div>
                    )}

                    {viewMode === 'table' && (
                        <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-black/40 border-b border-white/10">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-gray-400 font-medium">Entry</th>
                                        <th className="text-left px-4 py-3 text-gray-400 font-medium">Category</th>
                                        <th className="text-left px-4 py-3 text-gray-400 font-medium">Dimension</th>
                                        <th className="text-left px-4 py-3 text-gray-400 font-medium">Adjustable</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEntries.map((entry) => (
                                        <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-4 py-3">
                                                <div className="text-white font-medium">{entry.displayName}</div>
                                                <div className="text-gray-500 text-xs">{entry.musicalElement}</div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400">{CATEGORY_META[entry.category].name}</td>
                                            <td className="px-4 py-3 text-gray-400">
                                                {entry.psychometricMappings.map(m => DIMENSION_LABELS[m.dimension]).join(', ')}
                                            </td>
                                            <td className="px-4 py-3">
                                                {entry.adjustable ? (
                                                    <span className="text-green-400">Yes</span>
                                                ) : (
                                                    <span className="text-gray-600">No</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {viewMode === 'theory' && (
                        <div className="space-y-6">
                            {filteredEntries.map((entry) => (
                                <TheoryCard key={entry.id} entry={entry} />
                            ))}
                        </div>
                    )}

                    {filteredEntries.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No entries match your filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="py-8 border-t border-white/10 text-center text-gray-500 text-xs">
                <p>MPN Reference Dictionary v{MPN_REFERENCE_DICTIONARY.version}</p>
                <p className="mt-1">Based on Canon v3.0 • McKenney-Lacan Theory</p>
                <p className="mt-1 text-oxot-gold/60">OCEAN • Cognitive Biases • Dark Triad • DISC • Lacanian RSI</p>
            </footer>

            {/* Psychometric Framework Expansion Section */}
            <section className="py-12 px-6 border-t border-white/10 bg-gradient-to-b from-gray-950 to-black">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 rounded-xl bg-oxot-gold/10 border border-oxot-gold/30">
                            <Brain className="w-6 h-6 text-oxot-gold" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                                Psychometric Framework v3.0
                            </h2>
                            <p className="text-sm text-gray-500 font-mono">
                                Comprehensive Musical↔Psychological Mappings
                            </p>
                        </div>
                    </div>

                    {/* Framework Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* OCEAN */}
                        <div className="p-5 bg-gray-900/50 border border-white/10 rounded-xl">
                            <h3 className="text-lg font-bold text-blue-400 mb-3">OCEAN / Big Five</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Openness</span>
                                    <span className="text-white">→ Harmonic Complexity</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Conscientiousness</span>
                                    <span className="text-white">→ Articulation</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Extraversion</span>
                                    <span className="text-white">→ Dynamics/Volume</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Agreeableness</span>
                                    <span className="text-white">→ Intervals</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Neuroticism</span>
                                    <span className="text-white">→ Texture/Vibrato</span>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-500">
                                15 entries • Source: RSCH-39
                            </div>
                        </div>

                        {/* Cognitive Biases */}
                        <div className="p-5 bg-gray-900/50 border border-white/10 rounded-xl">
                            <h3 className="text-lg font-bold text-purple-400 mb-3">Cognitive Biases</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Authority Bias</span>
                                    <span className="text-white">→ Deep Brass</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Scarcity Bias</span>
                                    <span className="text-white">→ Accelerando</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Social Proof</span>
                                    <span className="text-white">→ Tutti/Unison</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Confirmation Bias</span>
                                    <span className="text-white">→ Ostinato</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">+26 more...</span>
                                    <span className="text-gray-500">Various mappings</span>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-500">
                                30 entries • Source: RSCH-34 (Kahneman-Tversky)
                            </div>
                        </div>

                        {/* Dark Triad */}
                        <div className="p-5 bg-gray-900/50 border border-white/10 rounded-xl">
                            <h3 className="text-lg font-bold text-red-400 mb-3">Dark Triad</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Machiavellianism</span>
                                    <span className="text-white">→ Syncopation, Hidden Voice</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Narcissism</span>
                                    <span className="text-white">→ Always Fortissimo</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Psychopathy</span>
                                    <span className="text-white">→ Uniform Velocity</span>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-500">
                                12 entries • Source: RSCH-33
                            </div>
                        </div>
                    </div>

                    {/* Source Documents */}
                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-sm">
                        <div className="font-bold text-blue-400 mb-2">📚 Theoretical Sources</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-400">
                            <div><span className="text-white font-mono">RSCH-39</span>: Musical Psychometric Notation</div>
                            <div><span className="text-white font-mono">RSCH-34</span>: Cognitive Bias Catalog</div>
                            <div><span className="text-white font-mono">RSCH-33</span>: Dark Triad Extension</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Models Infrastructure Section */}
            <section className="py-12 px-6 border-t border-white/10 bg-gradient-to-b from-black to-gray-950">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                            <Brain className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                                AI Model Infrastructure
                            </h2>
                            <p className="text-sm text-gray-500 font-mono">
                                OpenRouter & HuggingFace Integration
                            </p>
                        </div>
                        <a
                            href="/mckenney-lacan_theory/mckenney_lacan_appliced_2025_11_19/RSCH-42-AI_MODEL_FRAMEWORK.md"
                            target="_blank"
                            className="ml-auto flex items-center gap-2 text-xs text-oxot-gold hover:text-white transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Full Documentation
                        </a>
                    </div>

                    {/* OpenRouter Models */}
                    <div className="mb-8">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Cpu className="w-4 h-4" />
                            OpenRouter Models (Text/Analysis)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { model: 'google/gemini-3-flash-preview', role: 'PRIMARY', desc: 'Real-time psychometric analysis, score interpretation', latency: '~200ms' },
                                { model: 'google/gemini-2.5-flash-lite', role: 'FALLBACK', desc: 'Lightweight backup when primary unavailable', latency: '~150ms' },
                                { model: 'google/gemini-embedding-001', role: 'EMBEDDING', desc: 'Vector similarity for leitmotif matching', latency: '~100ms' },
                            ].map((m) => (
                                <div key={m.model} className="p-4 bg-gray-900/50 border border-white/10 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 text-[10px] rounded font-bold ${m.role === 'PRIMARY' ? 'bg-green-500/20 text-green-400' :
                                            m.role === 'FALLBACK' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>{m.role}</span>
                                        <span className="text-[10px] text-gray-500">{m.latency}</span>
                                    </div>
                                    <div className="text-sm text-white font-mono truncate">{m.model}</div>
                                    <div className="text-xs text-gray-500 mt-1">{m.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* HuggingFace Audio Models */}
                    <div className="mb-8">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            HuggingFace Audio Generation (API Accessible)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'facebook/musicgen-large', params: '1.5B', desc: 'High-quality text-to-music audio generation', useCase: 'Ambient background audio for visualizations', apiOk: true },
                                { id: 'facebook/musicgen-small', params: '300M', desc: 'Fast text-to-music audio generation', useCase: 'Quick audio previews for real-time playback', apiOk: true },
                                { id: 'facebook/musicgen-melody', params: '-', desc: 'Melody-conditioned music generation', useCase: 'Leitmotif variations from MPN analysis', apiOk: true },
                            ].map((m) => (
                                <div key={m.id} className="p-4 bg-gray-900/50 border border-white/10 rounded-xl hover:border-purple-500/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 text-[10px] rounded font-bold bg-green-500/20 text-green-400">
                                            ✓ API
                                        </span>
                                        <span className="text-[10px] text-gray-500">{m.params} params</span>
                                    </div>
                                    <div className="text-sm text-white font-mono truncate">{m.id}</div>
                                    <div className="text-xs text-gray-400 mt-1">{m.desc}</div>
                                    <div className="text-[10px] text-purple-400 mt-2">MPN: {m.useCase}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* HuggingFace MIDI Models */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            HuggingFace MIDI/Symbolic (Require Local Hosting)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'loubb/aria-medium-base', arch: 'LLaMA 3.2 (1B)', desc: 'Autoregressive MIDI for solo piano', useCase: 'Piano MIDI from psychometric state', register: 'Symbolic' },
                                { id: 'asigalov61/Giant-Music-Transformer', arch: 'Transformer', desc: 'Full MIDI using LA MIDI Dataset', useCase: 'Multi-instrument score generation', register: 'Full Orchestra' },
                                { id: 'skytnt/midi-model', arch: 'Transformer', desc: 'General-purpose MIDI generation', useCase: 'MPN conductor scores', register: 'Imaginary' },
                                { id: 'skytnt/midi-model-tv2o-medium', arch: 'Transformer', desc: 'Medium-sized MIDI generation', useCase: 'Balanced quality/speed', register: 'Hybrid' },
                                { id: 'brianflakes/rwkv-midi-piano', arch: 'RWKV (0.1B)', desc: 'Lightweight piano MIDI', useCase: 'Real register expressions', register: 'Real' },
                                { id: 'asigalov61/Heptabit-Music-Transformer', arch: 'Transformer', desc: 'Compact symbolic music generation', useCase: 'Low-latency MPN playback', register: 'Interactive' },
                            ].map((m) => (
                                <div key={m.id} className="p-4 bg-gray-900/50 border border-white/10 rounded-xl hover:border-orange-500/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 text-[10px] rounded font-bold bg-orange-500/20 text-orange-400">
                                            ⚠ LOCAL
                                        </span>
                                        <span className="text-[10px] text-gray-500">{m.arch}</span>
                                    </div>
                                    <div className="text-sm text-white font-mono truncate">{m.id}</div>
                                    <div className="text-xs text-gray-400 mt-1">{m.desc}</div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[10px] text-cyan-400">MPN: {m.useCase}</span>
                                        <span className="text-[10px] text-gray-600">Register: {m.register}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-sm text-yellow-400/80">
                        <strong>Note:</strong> MIDI models require local hosting with <code className="bg-black/30 px-1 rounded">trust_remote_code=True</code>.
                        See <a href="/mckenney-lacan_theory/mckenney_lacan_appliced_2025_11_19/RSCH-42-AI_MODEL_FRAMEWORK.md" className="underline hover:text-white">RSCH-42</a> for setup instructions.
                    </div>
                </div>
            </section>
            {/* Adjustment Panel */}
            <AnimatePresence>
                {adjustingEntry && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setAdjustingEntry(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <ParameterAdjustmentPanel
                            entry={adjustingEntry}
                            onClose={() => setAdjustingEntry(null)}
                            onSavePreset={(adj) => {
                                setCurrentAdjustments(prev => ({
                                    ...prev,
                                    [adjustingEntry.id]: adj
                                }));
                            }}
                        />
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}

// Entry Card Component
function EntryCard({ entry, expanded, onToggle, onAdjust }: {
    entry: MPNReferenceEntry;
    expanded: boolean;
    onToggle: () => void;
    onAdjust: () => void;
}) {
    const catMeta = CATEGORY_META[entry.category];

    return (
        <motion.div
            className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden"
            layout
        >
            <button
                onClick={onToggle}
                className="w-full p-4 flex items-start gap-3 text-left hover:bg-white/5 transition-colors"
            >
                <span className={`mt-0.5 ${catMeta.color}`}>{catMeta.icon}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{entry.displayName}</span>
                        {entry.adjustable && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded">
                                Adjustable
                            </span>
                        )}
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5 truncate">{entry.musicalElement}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {entry.psychometricMappings.map((m, i) => (
                            <span key={i} className="px-2 py-0.5 text-[10px] bg-white/10 text-gray-400 rounded">
                                {m.trait || DIMENSION_LABELS[m.dimension]}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2">
                    {entry.adjustable && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onAdjust(); }}
                            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            title="Adjust Parameters"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                    )}
                    {expanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                </div>
            </button>

            {expanded && (
                <div className="px-4 pb-4 pt-0 border-t border-white/10">
                    <div className="mt-3 space-y-3">
                        <div>
                            <div className="text-xs text-gray-500 uppercase mb-1">Description</div>
                            <div className="text-sm text-gray-300">{entry.theory.description}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase mb-1">Rationale</div>
                            <div className="text-sm text-gray-400">{entry.theory.rationale}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase mb-1">Source</div>
                            <div className="text-sm text-oxot-gold">{entry.theory.source}</div>
                        </div>
                        {entry.theory.examples.length > 0 && (
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">Examples</div>
                                <div className="text-sm text-gray-400">{entry.theory.examples.join(' • ')}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

// Theory Card Component
function TheoryCard({ entry }: { entry: MPNReferenceEntry }) {
    return (
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6">
            <div className="flex items-start gap-4">
                <span className={`${CATEGORY_META[entry.category].color} mt-1`}>
                    {CATEGORY_META[entry.category].icon}
                </span>
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{entry.displayName}</h3>
                    <p className="text-gray-500 text-sm mt-1">{entry.musicalElement}</p>

                    <div className="mt-4 prose prose-invert prose-sm max-w-none">
                        <p className="text-gray-300">{entry.theory.description}</p>
                        <blockquote className="border-l-2 border-oxot-gold/50 pl-4 italic text-gray-400">
                            {entry.theory.rationale}
                        </blockquote>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {entry.psychometricMappings.map((m, i) => (
                            <div key={i} className="px-3 py-1.5 bg-white/5 rounded-lg">
                                <div className="text-xs text-gray-500">{DIMENSION_LABELS[m.dimension]}</div>
                                <div className="text-sm text-white">{m.trait || m.condition}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{m.description}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                        Source: <span className="text-oxot-gold">{entry.theory.source}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
