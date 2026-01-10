'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, Music, FileText, Plus, LayoutGrid, List as ListIcon, X, Wand2, Trash2, Edit, AlertCircle, Eye, Layers } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LITERARY_SCENARIOS } from '@/components/mpn-lab/literary_data';
import { LiteraryScenario } from '@/components/mpn-lab/types';
import { useRouter } from 'next/navigation';
import ScriptProcessor from '@/components/mpn-lab/ScriptProcessor';
import ProcessingWizard from '@/components/mpn-lab/ProcessingWizard';
import ProcessingReport from '@/components/mpn-lab/ProcessingReport';
import { VariantManager } from '@/components/mpn-lab/VariantManager';
import { ScoreVariant } from '@/components/mpn-lab/score_types';

// --- Types ---

interface PlayRecord {
    id: string;
    title: string;
    author: string;
    year?: string;
    theme: string;
    description?: string;
    source_text?: string;
    is_processed: boolean;
    created_at: string;
    processed_data?: LiteraryScenario;
}

// --- Components ---

const TabButton = ({ active, onClick, icon: Icon, label, count }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all ${active
            ? 'bg-white/10 text-white border-b-2 border-amber-500'
            : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <Icon className="w-4 h-4" />
        <span className="font-medium">{label}</span>
        {count !== undefined && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-gray-400'}`}>
                {count}
            </span>
        )}
    </button>
);

const ScriptReader = ({ play, onClose, onProcess }: { play: PlayRecord, onClose: () => void, onProcess: () => void }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-gray-950 flex flex-col animate-in fade-in duration-200">
            {/* Reader Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition">
                        <X className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-xl font-serif font-bold text-white">{play.title}</h2>
                        <p className="text-sm text-gray-400">{play.author}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onProcess}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition shadow-lg shadow-amber-900/20"
                    >
                        <Wand2 className="w-4 h-4" />
                        <span>Process to Music</span>
                    </button>
                </div>
            </div>

            {/* Reader Content */}
            <div className="flex-1 overflow-y-auto bg-[#1a1a1a]">
                <div className="max-w-3xl mx-auto px-8 py-12 min-h-full bg-[#1e1e1e] shadow-2xl">
                    <div className="prose prose-invert prose-lg max-w-none font-serif leading-relaxed text-gray-200 selection:bg-amber-500/30">
                        {play.source_text ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {play.source_text}
                            </ReactMarkdown>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                <FileText className="w-16 h-16 mb-4 opacity-50" />
                                <p>No source text available specifically for reading.</p>
                                <p className="text-sm">This might be a pre-processed legacy scenario.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function PlayLibraryPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'scripts' | 'scenarios'>('scripts');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [dbPlays, setDbPlays] = useState<PlayRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Selection state
    const [selectedScript, setSelectedScript] = useState<PlayRecord | null>(null);
    const [processModalOpen, setProcessModalOpen] = useState(false);
    const [editingScenario, setEditingScenario] = useState<PlayRecord | null>(null);
    const [viewingScenario, setViewingScenario] = useState<PlayRecord | null>(null);

    const [isUpdating, setIsUpdating] = useState(false);

    // Variant Management State
    const [managingVariantPlayId, setManagingVariantPlayId] = useState<string | null>(null);

    // Fetch DB plays
    const fetchPlays = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/plays');
            if (res.ok) {
                const data = await res.json();
                setDbPlays(data);
            }
        } catch (error) {
            console.error("Failed to fetch plays", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlays();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this script? This cannot be undone.')) return;

        setDeletingId(id);
        try {
            await fetch(`/api/plays/${id}`, { method: 'DELETE' });
            setDbPlays(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Delete failed', error);
            alert('Failed to delete script');
        } finally {
            setDeletingId(null);
        }
    };

    const handleUpdateScenario = async (playId: string, config: any) => {
        setIsUpdating(true);
        try {
            // Reconstruct processed_data like in import/page.tsx
            // We need to keep the original structure if possible
            const originalPlay = dbPlays.find(p => p.id === playId);
            const originalData = originalPlay?.processed_data as any;

            const updatedProcessedData = {
                ...originalData,
                stylePreset: config.stylePreset,
                characters: config.characters,
                musicParams: config.musicParams,
                options: {
                    generateChords: config.generateChords,
                    generateMusic: config.generateMusic,
                    computePsychometrics: config.computePsychometrics
                },
                // We'd also need to update frames, but for the "Edit Config" 
                // we'll focus on the metadata/params for now or use a dedicated API.
                // For simplicity in this demo, we'll just update the config parts.
            };

            const res = await fetch(`/api/plays/${playId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ processed_data: updatedProcessedData })
            });

            if (!res.ok) throw new Error('Update failed');

            setEditingScenario(null);
            fetchPlays(); // Refresh
        } catch (error) {
            console.error('Update failed', error);
            alert('Failed to update scenario configuration');
        } finally {
            setIsUpdating(false);
        }

    };

    const handleVariantLoad = (variant: ScoreVariant) => {
        router.push(`/mpn-conductor?variant=${variant.id}`);
    };

    // Combine Data
    const rawScripts = useMemo(() => dbPlays.filter(p => !p.is_processed), [dbPlays]);

    const processedScenarios = useMemo(() => {
        const staticScenarios = LITERARY_SCENARIOS.map(s => ({
            id: s.id,
            title: s.title,
            author: s.author,
            theme: s.theme,
            description: `Processed Scenario (${s.frames.length} frames)`,
            is_processed: true,
            created_at: new Date().toISOString(),
            processed_data: s
        }));

        const dbProcessed = dbPlays.filter(p => p.is_processed);

        // Merge: Prefer DB if conflicts (though IDs likely distinct)
        return [...staticScenarios, ...dbProcessed];
    }, [dbPlays]);

    // Filter
    const filteredItems = useMemo(() => {
        const items = activeTab === 'scripts' ? rawScripts : processedScenarios;
        if (!searchQuery) return items;
        const q = searchQuery.toLowerCase();
        return items.filter(i =>
            i.title.toLowerCase().includes(q) ||
            i.author.toLowerCase().includes(q)
        );
    }, [activeTab, rawScripts, processedScenarios, searchQuery]);

    const handleProcessingComplete = () => {
        setProcessModalOpen(false);
        setSelectedScript(null); // Close reader
        setActiveTab('scenarios'); // Switch to results
        fetchPlays(); // Refresh data
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-amber-500/30">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Library & Conductor
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">
                                Manage raw scripts and conduct processed musical psychometrics
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/play-library/import"
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg transition font-bold shadow-lg shadow-amber-900/20 border border-amber-500/50"
                            >
                                <Plus className="w-5 h-5" />
                                Import / Load Scripts
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1 border-b border-white/10">
                        <TabButton
                            active={activeTab === 'scripts'}
                            onClick={() => setActiveTab('scripts')}
                            icon={BookOpen}
                            label="Script Reference"
                            count={rawScripts.length}
                        />
                        <TabButton
                            active={activeTab === 'scenarios'}
                            onClick={() => setActiveTab('scenarios')}
                            icon={Music}
                            label="Musical Scenarios"
                            count={processedScenarios.length}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-end">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder={activeTab === 'scripts' ? "Search metadata..." : "Search scenarios..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 text-amber-500"></div>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className={`group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all hover:bg-white/[0.07] ${viewMode === 'list' ? 'flex items-center p-4 gap-6' : 'p-6 flex flex-col'}`}
                            >
                                {/* Management Overlay */}
                                <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => handleDelete(item.id, e)}
                                        className="p-2 bg-black/50 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg backdrop-blur-sm border border-white/10"
                                        title="Delete Script"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2 pr-10">
                                        <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1">{item.title}</h3>
                                        <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">{item.theme}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-4">{item.author}</p>

                                    {viewMode === 'grid' && (
                                        <div className="h-24 p-3 bg-black/30 rounded-lg mb-4 text-xs text-gray-500 overflow-hidden relative">
                                            {item.description || (item.source_text ? item.source_text.substring(0, 150) : 'No description available')}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                                        </div>
                                    )}
                                </div>

                                <div className={`flex items-center gap-3 ${viewMode === 'list' ? '' : 'mt-auto'}`}>
                                    {activeTab === 'scripts' ? (
                                        <button
                                            onClick={() => setSelectedScript(item)}
                                            className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            Open Reader
                                        </button>
                                    ) : (
                                        <div className="flex-1 flex flex-col gap-2">
                                            <Link
                                                href={`/mpn-conductor?scenario=${item.id}`}
                                                className="flex-1 py-2.5 bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 border border-amber-600/50 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                                            >
                                                <Music className="w-4 h-4" />
                                                Open Conductor
                                            </Link>
                                            <button
                                                onClick={() => setViewingScenario(item)}
                                                className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white rounded-lg text-xs font-medium transition flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (!item.processed_data || !(item.processed_data as any).structure) {
                                                        alert("This legacy scenario lacks structure data and cannot be re-configured in the wizard.");
                                                        return;
                                                    }
                                                    setEditingScenario(item);
                                                }}
                                                className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-xs font-medium transition flex items-center justify-center gap-2"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                Edit Config
                                            </button>
                                            <button
                                                onClick={() => setManagingVariantPlayId(item.id)}
                                                className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-purple-400 hover:text-white rounded-lg text-xs font-medium transition flex items-center justify-center gap-2 border border-purple-500/20"
                                            >
                                                <Layers className="w-3.5 h-3.5" />
                                                Variants
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed animate-in fade-in zoom-in duration-500">
                        {activeTab === 'scripts' ? (
                            <div className="relative inline-block mb-4">
                                <BookOpen className="w-16 h-16 mx-auto text-gray-700" />
                                <AlertCircle className="w-6 h-6 absolute -top-1 -right-1 text-amber-500 animate-bounce" />
                            </div>
                        ) : (
                            <Music className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                        )}

                        <h3 className="text-xl font-semibold text-gray-300">
                            {activeTab === 'scripts' ? 'Script Library is Empty' : 'No Scenarios Found'}
                        </h3>
                        <p className="text-gray-500 mt-2 mb-8 max-w-md mx-auto">
                            {activeTab === 'scripts'
                                ? 'You need to import raw text scripts before you can analyze or read them. Click the button below to load your first script.'
                                : 'Process a script to create a scenario.'}
                        </p>
                        <Link
                            href="/play-library/import"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500 transition shadow-xl shadow-amber-900/40 hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            {activeTab === 'scripts' ? 'Import First Script' : 'Import New'}
                        </Link>
                    </div>
                )}
            </div>

            {/* Script Reader Modal */}
            {selectedScript && (
                <ScriptReader
                    play={selectedScript}
                    onClose={() => setSelectedScript(null)}
                    onProcess={() => setProcessModalOpen(true)}
                />
            )}

            {/* Processing Lab UI */}
            <ScriptProcessor
                isOpen={processModalOpen}
                onClose={() => setProcessModalOpen(false)}
                playTitle={selectedScript?.title}
                playId={selectedScript?.id}
                onProcessingComplete={handleProcessingComplete}
            />
            {/* Processing Wizard for Editing */}
            {editingScenario && (
                <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <ProcessingWizard
                        validatedStructure={(editingScenario.processed_data as any).structure}
                        initialConfig={{
                            stylePreset: (editingScenario.processed_data as any).stylePreset,
                            characters: (editingScenario.processed_data as any).characters,
                            musicParams: (editingScenario.processed_data as any).musicParams,
                            generateChords: (editingScenario.processed_data as any).options?.generateChords,
                            generateMusic: (editingScenario.processed_data as any).options?.generateMusic,
                            computePsychometrics: (editingScenario.processed_data as any).options?.computePsychometrics
                        }}
                        onComplete={(config) => handleUpdateScenario(editingScenario.id, config)}
                        onCancel={() => setEditingScenario(null)}
                    />
                </div>
            )}

            {/* Processing Report for Viewing */}
            {viewingScenario && (
                <div className="fixed inset-0 z-[160] bg-gray-950 overflow-y-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="max-w-6xl mx-auto">
                        <ProcessingReport
                            processedData={viewingScenario.processed_data}
                            isSaving={false}
                            error={null}
                            onBack={() => setViewingScenario(null)}
                            onSave={() => {
                                setViewingScenario(null);
                                if (!viewingScenario.processed_data || !(viewingScenario.processed_data as any).structure) {
                                    alert("Structure missing: Cannot re-configure.");
                                    return;
                                }
                                setEditingScenario(viewingScenario);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Variant Manager Modal */}
            {managingVariantPlayId && (
                <div className="fixed inset-0 z-[170] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto relative shadow-2xl">
                        <button
                            onClick={() => setManagingVariantPlayId(null)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-purple-400" />
                                Project Variants
                            </h2>
                            <p className="text-sm text-gray-400 mb-6">Create and manage different musical interpretations of this script.</p>
                            <VariantManager
                                playId={managingVariantPlayId}
                                onLoadVariant={handleVariantLoad}
                            />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
