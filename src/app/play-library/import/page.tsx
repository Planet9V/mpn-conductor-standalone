'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, Check, X, AlertTriangle, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

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
}

export default function ImportPlayPage() {
    const [rawText, setRawText] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [theme, setTheme] = useState('');
    const [parseResult, setParseResult] = useState<ImportResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Parse the raw play text
    const parsePlay = useCallback(() => {
        if (!rawText.trim()) {
            setError('Please paste play text first');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const lines = rawText.split('\n');
            const frames: ParsedFrame[] = [];
            const speakers = new Set<string>();

            // Speaker detection patterns
            const speakerPatterns = [
                /^([A-Z][A-Z\s]+)[\.:]\s*(.*)$/,      // ALL CAPS: text
                /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*[\.:]\s*(.*)$/,  // Title Case: text
                /^([A-Z]{2,}(?:\s+[A-Z]+)*)\.\s+(.*)$/,  // SPEAKER. text
            ];

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.length < 5) continue;

                // Skip stage directions and act/scene markers
                if (/^\s*\[.*\]\s*$/.test(trimmed)) continue;
                if (/^\s*\(.*\)\s*$/.test(trimmed)) continue;
                if (/^ACT\s+[IVX]+/i.test(trimmed)) continue;
                if (/^SCENE\s+[IVX\d]+/i.test(trimmed)) continue;
                if (/^Enter\s+/i.test(trimmed)) continue;
                if (/^Exit/i.test(trimmed)) continue;

                // Try to match speaker patterns
                for (const pattern of speakerPatterns) {
                    const match = trimmed.match(pattern);
                    if (match && match[2] && match[2].length > 10) {
                        const speaker = match[1].trim();
                        const text = match[2].trim();
                        speakers.add(speaker);
                        frames.push({
                            speaker,
                            text,
                            description: text.substring(0, 60) + (text.length > 60 ? '...' : '')
                        });
                        break;
                    }
                }
            }

            if (frames.length < 3) {
                setError('Could not parse enough dialogue. Try a different format or paste more text.');
                setIsProcessing(false);
                return;
            }

            setParseResult({
                title: title || 'Untitled Play',
                author: author || 'Unknown Author',
                frameCount: frames.length,
                characters: Array.from(speakers),
                preview: frames.slice(0, 10)
            });
        } catch (err) {
            setError('Failed to parse play text. Please check the format.');
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

            // Try to extract title from filename
            const filename = file.name.replace(/\.[^/.]+$/, '');
            if (!title) setTitle(filename.replace(/_/g, ' ').replace(/-/g, ' '));
        };
        reader.readAsText(file);
    }, [title]);

    const handleImport = async () => {
        if (!parseResult) return;

        // In a real implementation, this would save to PostgreSQL
        // For now, we'll generate the TypeScript code to add manually
        const code = generateScenarioCode(parseResult, theme);

        // Download the generated code
        const blob = new Blob([code], { type: 'text/typescript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${parseResult.title.toLowerCase().replace(/\s+/g, '_')}_scenario.ts`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link
                        href="/play-library"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Import New Play</h1>
                        <p className="text-sm text-gray-400">
                            Add a complete play to the library for psychometric analysis
                        </p>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        {/* Metadata */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h2 className="text-lg font-semibold text-white mb-4">Play Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., The Cherry Orchard"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Author</label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="e.g., Anton Chekhov"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Theme</label>
                                    <input
                                        type="text"
                                        value={theme}
                                        onChange={(e) => setTheme(e.target.value)}
                                        placeholder="e.g., Loss and Memory"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h2 className="text-lg font-semibold text-white mb-4">Upload Text File</h2>
                            <label className="relative block p-8 border-2 border-dashed border-white/20 rounded-xl hover:border-amber-500/50 transition cursor-pointer">
                                <input
                                    type="file"
                                    accept=".txt,.md"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-center">
                                    <Upload className="w-12 h-12 mx-auto text-gray-500 mb-3" />
                                    <p className="text-gray-400">Drop a .txt file or click to upload</p>
                                    <p className="text-sm text-gray-500 mt-1">Project Gutenberg format works best</p>
                                </div>
                            </label>
                        </div>

                        {/* Text Input */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h2 className="text-lg font-semibold text-white mb-4">Or Paste Text Directly</h2>
                            <textarea
                                value={rawText}
                                onChange={(e) => setRawText(e.target.value)}
                                placeholder="Paste the full play text here...

Example format:
HAMLET. To be, or not to be, that is the question.
OPHELIA. My lord, I have remembrances of yours."
                                className="w-full h-64 px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-600 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                            />
                            <div className="mt-3 text-sm text-gray-500">
                                {rawText.length.toLocaleString()} characters
                            </div>
                        </div>

                        {/* Parse Button */}
                        <button
                            onClick={parsePlay}
                            disabled={isProcessing || !rawText.trim()}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold hover:from-amber-400 hover:to-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Sparkles className="w-5 h-5" />
                            {isProcessing ? 'Analyzing...' : 'Parse & Analyze Play'}
                        </button>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-red-300">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    <div className="space-y-6">
                        {parseResult ? (
                            <>
                                {/* Parse Results */}
                                <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Check className="w-6 h-6 text-green-400" />
                                        <h2 className="text-lg font-semibold text-green-400">Parse Successful</h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Scenes detected:</span>
                                            <span className="ml-2 text-white font-semibold">{parseResult.frameCount}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Characters:</span>
                                            <span className="ml-2 text-white font-semibold">{parseResult.characters.length}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-gray-400 text-sm">Characters found:</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {parseResult.characters.map(char => (
                                                <span key={char} className="px-2 py-1 rounded-md bg-white/10 text-xs text-gray-300">
                                                    {char}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <h2 className="text-lg font-semibold text-white mb-4">Preview (First 10 Lines)</h2>
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {parseResult.preview.map((frame, i) => (
                                            <div key={i} className="p-3 rounded-lg bg-black/30 border border-white/5">
                                                <div className="text-amber-400 font-semibold text-sm">{frame.speaker}</div>
                                                <div className="text-gray-300 text-sm mt-1">"{frame.text}"</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Import Button */}
                                <button
                                    onClick={handleImport}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold hover:from-green-400 hover:to-emerald-400 transition flex items-center justify-center gap-2"
                                >
                                    <FileText className="w-5 h-5" />
                                    Download Scenario File
                                </button>
                                <p className="text-center text-sm text-gray-500">
                                    Add the downloaded file to <code className="text-amber-400">src/components/mpn-lab/</code>
                                </p>
                            </>
                        ) : (
                            <div className="p-12 rounded-2xl bg-white/5 border border-white/10 border-dashed text-center">
                                <FileText className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-400 mb-2">No Preview Yet</h3>
                                <p className="text-gray-500">
                                    Paste or upload play text and click "Parse" to see a preview
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

// Generate TypeScript code for the scenario
function generateScenarioCode(result: ImportResult, theme: string): string {
    const id = result.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return `/**
 * ${result.title} - Auto-generated scenario
 * Author: ${result.author}
 * Generated: ${new Date().toISOString()}
 */

import { LiteraryScenario } from './types';

export const ${id.toUpperCase()}_SCENARIO: LiteraryScenario = {
    id: '${id}',
    title: '${result.title}',
    author: '${result.author}',
    theme: '${theme || 'Drama'}',
    color: '${color}',
    frames: [
${result.preview.map((frame, i) => `        {
            name: 'Scene ${i + 1}',
            description: '${frame.description.replace(/'/g, "\\'")}',
            trauma: ${(0.3 + Math.random() * 0.5).toFixed(2)},
            entropy: ${(0.3 + Math.random() * 0.5).toFixed(2)},
            focusLayer: ${i % 7},
            script: {
                speaker: '${frame.speaker}',
                text: "${frame.text.replace(/"/g, '\\"').substring(0, 200)}",
                chord: 'TBD',
                analysis: 'Auto-generated. Edit to add Lacanian analysis.'
            }
        }`).join(',\n')}
    ]
};
`;
}
