'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, Check, AlertTriangle, ArrowLeft, Sparkles, Save, Download, BookOpen, Library } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AIScriptValidator from '@/components/mpn-lab/AIScriptValidator';

interface ParsedFrame {
    speaker: string;
    text: string;
    description: string;
}

interface ImportResult {
    title: string;
    author: string;
    frameCount: number;
    characters: string[];
    preview: ParsedFrame[];
    fullFrames: ParsedFrame[];
}

export default function ImportPlayPage() {
    const router = useRouter();
    const [rawText, setRawText] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [theme, setTheme] = useState('');
    const [parseResult, setParseResult] = useState<ImportResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // NEW: AI Validation State
    const [showAIValidator, setShowAIValidator] = useState(false);
    const [validatedScript, setValidatedScript] = useState<any>(null);

    // Parse the raw play text (Secondary Feature)
    const parsePlay = useCallback(() => {
        if (!rawText.trim()) return;

        setIsProcessing(true);
        setError(null);

        try {
            const lines = rawText.split('\n');
            const frames: ParsedFrame[] = [];
            const speakers = new Set<string>();

            const speakerPatterns = [
                /^([A-Z][A-Z\s]+)[\.:]\s*(.*)$/,
                /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*[\.:]\s*(.*)$/,
                /^([A-Z]{2,}(?:\s+[A-Z]+)*)\.\s+(.*)$/,
            ];

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.length < 5) continue;
                if (/^\s*\[.*\]\s*$/.test(trimmed)) continue;
                if (/^\s*\(.*\)\s*$/.test(trimmed)) continue;
                if (/^ACT\s+[IVX]+/i.test(trimmed)) continue;

                for (const pattern of speakerPatterns) {
                    const match = trimmed.match(pattern);
                    if (match && match[2] && match[2].length > 10) {
                        const speaker = match[1].trim();
                        const text = match[2].trim();
                        speakers.add(speaker);
                        frames.push({
                            speaker,
                            text,
                            description: text.substring(0, 60),
                        });
                        break;
                    }
                }
            }

            if (frames.length < 3) {
                setError('Analysis failed: Could not detect enough dialogue.');
                setIsProcessing(false);
                return;
            }

            setParseResult({
                title: title || 'Untitled',
                author: author || 'Unknown',
                frameCount: frames.length,
                characters: Array.from(speakers),
                preview: frames.slice(0, 5),
                fullFrames: frames
            });
        } catch (err) {
            setError('Analysis failed.');
        }

        setIsProcessing(false);
    }, [rawText, title, author]);

    // Handle file upload
    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setRawText(text);
            const filename = file.name.replace(/\.[^/.]+$/, '');
            if (!title) setTitle(filename.replace(/_/g, ' ').replace(/-/g, ' '));
        };
        reader.readAsText(file);
    }, [title]);

    // Main Save Action
    const handleSaveToLibrary = async (isProcessed: boolean = false) => {
        if (!title) {
            setError('Title is required to save');
            return;
        }
        setIsSaving(true);
        try {
            let processedData = null;

            // Only attach processed data if explicitly requested and available
            if (isProcessed && parseResult) {
                const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
                processedData = {
                    id: title.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
                    title,
                    author: author || 'Unknown',
                    theme: theme || 'Drama',
                    color: colors[Math.floor(Math.random() * colors.length)],
                    frames: parseResult.fullFrames.map((frame, i) => ({
                        name: `Scene ${i + 1}`,
                        description: frame.description,
                        trauma: Math.random(),
                        entropy: Math.random(),
                        focusLayer: i % 7,
                        script: {
                            speaker: frame.speaker,
                            text: frame.text,
                            chord: 'TBD',
                            analysis: 'Auto-generated'
                        }
                    }))
                };
            }

            const payload = {
                title,
                author,
                theme,
                description: isProcessed ? `Processed Scenario (${parseResult?.frameCount} scenes)` : 'Raw Script',
                source_text: rawText,
                is_processed: isProcessed,
                processed_data: processedData
            };

            const res = await fetch('/api/plays', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to save');
            router.push('/play-library'); // Return to library

        } catch (err) {
            console.error(err);
            setError('Failed to save to library.');
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/play-library"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
                                Add to Library
                            </h1>
                            <p className="text-gray-500 text-sm">Upload or paste scripts for the repository</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Metadata & Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. Metadata */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-amber-500" />
                                Script Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Macbeth"
                                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">Author</label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="e.g. Shakespeare"
                                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Content Source */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-amber-500" />
                                Script Source
                            </h2>

                            <label className="block p-4 border border-dashed border-white/10 rounded-xl hover:bg-white/5 cursor-pointer mb-4 transition text-center group">
                                <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
                                <Upload className="w-6 h-6 mx-auto text-gray-500 group-hover:text-amber-400 mb-2 transition" />
                                <span className="text-sm text-gray-400 group-hover:text-white">Upload .txt or .md file</span>
                            </label>

                            <textarea
                                value={rawText}
                                onChange={(e) => setRawText(e.target.value)}
                                placeholder="# Act 1&#10;Scene 1...&#10;&#10;Use Markdown for best results."
                                className="w-full h-96 p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-sm text-gray-300 focus:border-amber-500/50 outline-none resize-none leading-relaxed"
                            />
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                                <span>Markdown Supported</span>
                                <span>{rawText.length.toLocaleString()} chars</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Actions & Tools */}
                    <div className="space-y-6">

                        {/* Primary Action */}
                        <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 sticky top-24">
                            <h3 className="font-semibold text-lg text-amber-400 mb-2">Actions</h3>
                            <p className="text-sm text-gray-400 mb-6">
                                Save this script to your library. It will be available in the Script Reference view.
                            </p>

                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2">
                                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={() => handleSaveToLibrary(false)}
                                disabled={isSaving || !title || !rawText}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold shadow-lg shadow-amber-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
                            >
                                <Library className="w-5 h-5" />
                                {isSaving ? 'Saving...' : 'Add to Script Library'}
                            </button>

                            <div className="border-t border-white/10 my-6"></div>

                            {/* Experimental Analysis */}
                            <div className="opacity-75 hover:opacity-100 transition">
                                <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-purple-400" />
                                    AI-Powered Validation
                                </h4>
                                <p className="text-xs text-gray-500 mb-4">
                                    Let AI analyze your script format, extract structure, and validate before processing.
                                </p>

                                {!validatedScript ? (
                                    <button
                                        onClick={() => setShowAIValidator(true)}
                                        disabled={!rawText || !title}
                                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 text-purple-300 text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Validate with AI
                                    </button>
                                ) : (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-300">
                                            ✓ Validated: {validatedScript.format} format
                                            <br />
                                            {validatedScript.acts.length} acts, {validatedScript.characters.length} characters
                                        </div>
                                        <button
                                            onClick={() => handleSaveToLibrary(true)}
                                            className="w-full py-2.5 rounded-lg bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 text-sm font-medium transition"
                                        >
                                            Save Validated Script
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* AI Validation Modal */}
            {showAIValidator && (
                <AIScriptValidator
                    rawText={rawText}
                    playId={title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}
                    onValidated={(structure) => {
                        setValidatedScript(structure);
                        setShowAIValidator(false);
                        // Auto-populate metadata if detected
                        if (structure.metadata.title) setTitle(structure.metadata.title);
                        if (structure.metadata.author) setAuthor(structure.metadata.author);
                    }}
                    onCancel={() => setShowAIValidator(false)}
                />
            )}
        </main>
    );
}
