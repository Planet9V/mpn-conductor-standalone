'use client';

import React, { useState } from 'react';
import {
    FileText, Sparkles, CheckCircle, AlertCircle,
    Edit, Eye, Loader2, Users, MapPin, Book
} from 'lucide-react';

/**
 * AI Script Validator
 * 
 * Pre-processing wizard that uses AI to:
 * 1. Detect script format (Shakespeare, modern play, screenplay)
 * 2. Extract structure (acts, scenes, characters)
 * 3. Parse dialogue vs stage directions
 * 4. Show preview for human review
 * 5. Allow corrections before final processing
 */

interface DetectedStructure {
    format: 'shakespeare' | 'modern_play' | 'screenplay' | 'unknown';
    confidence: number;
    acts: Act[];
    characters: Character[];
    metadata: {
        title?: string;
        author?: string;
        frontMatter?: string; // Historical notes, introduction
        estimatedLineCount: number;
    };
}

interface Act {
    actNumber: number;
    title?: string;
    scenes: Scene[];
}

interface Scene {
    sceneNumber: number;
    location?: string;
    lines: ScriptLine[];
}

interface ScriptLine {
    lineNumber: number;
    type: 'dialogue' | 'stage_direction' | 'character_name' | 'scene_header';
    character?: string;
    text: string;
    confidence: number; // AI confidence in classification
}

interface Character {
    name: string;
    aliases: string[]; // e.g., "HAMLET" and "Ham."
    estimatedLines: number;
}

interface Props {
    rawText: string;
    playId: string;
    onValidated: (structure: DetectedStructure) => void;
    onCancel: () => void;
}

export default function AIScriptValidator({ rawText, playId, onValidated, onCancel }: Props) {
    const [status, setStatus] = useState<'analyzing' | 'reviewing' | 'editing' | 'validated'>('analyzing');
    const [structure, setStructure] = useState<DetectedStructure | null>(null);
    const [editedStructure, setEditedStructure] = useState<DetectedStructure | null>(null);
    const [analysisLog, setAnalysisLog] = useState<string[]>([]);

    // Simulate AI analysis (replace with actual API call)
    const analyzeScript = async () => {
        setStatus('analyzing');
        setAnalysisLog([]);

        const addLog = (msg: string) => setAnalysisLog(prev => [...prev, msg]);

        addLog('🔍 Initializing AI script parser...');
        await delay(500);

        addLog('📚 Detecting script format...');
        await delay(800);

        // Call AI API (OpenRouter/HuggingFace)
        addLog('🤖 Analyzing with GPT-4...');
        await delay(1200);

        try {
            const response = await fetch('/api/analyze-script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playId, rawText })
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const detected: DetectedStructure = await response.json();

            addLog(`✅ Format detected: ${detected.format} (${(detected.confidence * 100).toFixed(0)}% confidence)`);
            addLog(`📖 Found ${detected.acts.length} acts, ${detected.characters.length} characters`);

            setStructure(detected);
            setEditedStructure(detected); // Initialize editable copy
            setStatus('reviewing');

        } catch (error) {
            addLog('❌ Analysis failed. Using fallback parser...');
            // Fallback to simple regex-based parsing
            const fallback = simpleFallbackParse(rawText);
            setStructure(fallback);
            setEditedStructure(fallback);
            setStatus('reviewing');
        }
    };

    const simpleFallbackParse = (text: string): DetectedStructure => {
        // Basic parsing logic
        const lines = text.split('\n');
        const characters = new Set<string>();
        const scriptLines: ScriptLine[] = [];

        lines.forEach((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return;

            // Detect character names (ALL CAPS, short line)
            if (/^[A-Z\s]{2,}$/.test(trimmed) && trimmed.length < 30) {
                characters.add(trimmed);
                scriptLines.push({
                    lineNumber: idx,
                    type: 'character_name',
                    character: trimmed,
                    text: trimmed,
                    confidence: 0.7
                });
            }
            // Stage directions (parentheses or brackets)
            else if (/^\(.*\)$|^\[.*\]$/.test(trimmed)) {
                scriptLines.push({
                    lineNumber: idx,
                    type: 'stage_direction',
                    text: trimmed,
                    confidence: 0.8
                });
            }
            // Scene/Act headers
            else if (/^(ACT|SCENE|Act|Scene)/i.test(trimmed)) {
                scriptLines.push({
                    lineNumber: idx,
                    type: 'scene_header',
                    text: trimmed,
                    confidence: 0.9
                });
            }
            // Dialogue
            else {
                scriptLines.push({
                    lineNumber: idx,
                    type: 'dialogue',
                    text: trimmed,
                    confidence: 0.6
                });
            }
        });

        return {
            format: 'unknown',
            confidence: 0.5,
            acts: [{
                actNumber: 1,
                scenes: [{
                    sceneNumber: 1,
                    lines: scriptLines
                }]
            }],
            characters: Array.from(characters).map(name => ({
                name,
                aliases: [],
                estimatedLines: scriptLines.filter(l => l.character === name).length
            })),
            metadata: {
                frontMatter: lines.slice(0, 10).join('\n'),
                estimatedLineCount: scriptLines.length
            }
        };
    };

    const handleConfirm = () => {
        if (editedStructure) {
            onValidated(editedStructure);
        }
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Auto-start analysis on mount
    React.useEffect(() => {
        analyzeScript();
    }, []);

    return (
        <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="w-full max-w-6xl h-[90vh] bg-gray-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        <h2 className="text-2xl font-bold text-white">AI Script Validator</h2>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                        Analyzing script structure • Detecting format • Extracting characters
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">

                    {/* Left: Analysis Log */}
                    <div className="w-1/3 border-r border-white/10 bg-black/20 p-6 overflow-y-auto">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-bold">Analysis Log</h3>
                        <div className="space-y-2 font-mono text-xs">
                            {analysisLog.map((log, i) => (
                                <div key={i} className="text-purple-300/80 animate-in slide-in-from-left-2 fade-in">
                                    {log}
                                </div>
                            ))}
                            {status === 'analyzing' && (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Processing...
                                </div>
                            )}
                        </div>

                        {/* Detected Metadata */}
                        {structure && (
                            <div className="mt-8 space-y-4">
                                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Format</div>
                                    <div className="text-purple-400 font-bold capitalize">{structure.format.replace('_', ' ')}</div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        {(structure.confidence * 100).toFixed(0)}% confidence
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Structure</div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div>
                                            <span className="text-white font-bold">{structure.acts.length}</span>
                                            <span className="text-gray-500 ml-1">Acts</span>
                                        </div>
                                        <div>
                                            <span className="text-white font-bold">{structure.characters.length}</span>
                                            <span className="text-gray-500 ml-1">Characters</span>
                                        </div>
                                    </div>
                                </div>

                                {structure.metadata.frontMatter && (
                                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Front Matter</div>
                                        <div className="text-xs text-gray-400 line-clamp-3">
                                            {structure.metadata.frontMatter}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Preview/Edit */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {status === 'analyzing' ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                                <p>Analyzing script structure...</p>
                            </div>
                        ) : structure ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white">Detected Structure</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setStatus('reviewing')}
                                            className={`p-2 rounded-lg ${status === 'reviewing' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400'}`}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setStatus('editing')}
                                            className={`p-2 rounded-lg ${status === 'editing' ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400'}`}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Characters List */}
                                <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Users className="w-4 h-4 text-purple-400" />
                                        <h4 className="font-bold text-white">Characters</h4>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {structure.characters.map((char, i) => (
                                            <div key={i} className="p-2 bg-black/20 rounded text-sm">
                                                <div className="font-bold text-white">{char.name}</div>
                                                <div className="text-xs text-gray-500">{char.estimatedLines} lines</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Acts/Scenes Preview */}
                                <div className="space-y-4">
                                    {structure.acts.map((act, actIdx) => (
                                        <div key={actIdx} className="border border-white/10 rounded-xl overflow-hidden">
                                            <div className="p-3 bg-white/5 border-b border-white/10">
                                                <div className="flex items-center gap-2">
                                                    <Book className="w-4 h-4 text-blue-400" />
                                                    <span className="font-bold text-white">Act {act.actNumber}</span>
                                                    {act.title && <span className="text-gray-400 text-sm">• {act.title}</span>}
                                                </div>
                                            </div>
                                            <div className="p-4 space-y-2">
                                                {act.scenes.map((scene, sceneIdx) => (
                                                    <div key={sceneIdx} className="p-3 bg-black/20 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <MapPin className="w-3 h-3 text-green-400" />
                                                            <span className="text-sm font-bold text-white">Scene {scene.sceneNumber}</span>
                                                            {scene.location && <span className="text-xs text-gray-500">• {scene.location}</span>}
                                                        </div>
                                                        <div className="text-xs text-gray-600">
                                                            {scene.lines.length} lines detected
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 bg-black/40 flex items-center justify-between">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                    >
                        Cancel
                    </button>

                    <div className="flex items-center gap-3">
                        {structure && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                {structure.confidence > 0.8 ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400">High confidence</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                                        <span className="text-yellow-400">Review recommended</span>
                                    </>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleConfirm}
                            disabled={status === 'analyzing'}
                            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            Confirm & Process
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
