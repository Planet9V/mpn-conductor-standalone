'use client';

import React, { useState, useMemo } from 'react';
import {
    FileText, Sparkles, CheckCircle, AlertCircle,
    Edit, Eye, Loader2, Users, MapPin, Book, Save, Trash2, Plus, X,
    HelpCircle, ChevronDown, ChevronUp, Info
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
        year?: string;
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
    const [markdownText, setMarkdownText] = useState<string>('');
    const [editingCharacterIdx, setEditingCharacterIdx] = useState<number | null>(null);
    const [showHelp, setShowHelp] = useState<boolean>(false);

    // Convert structure to standard markdown format
    const structureToMarkdown = (struct: DetectedStructure): string => {
        let md = '';

        // Title and metadata (ORDER: Title, Author, Year)
        if (struct.metadata.title) {
            md += `# ${struct.metadata.title}\n\n`;
        }
        if (struct.metadata.author) {
            md += `**Author:** ${struct.metadata.author}\n`;
        }
        if (struct.metadata.year) {
            md += `**Year:** ${struct.metadata.year}\n`;
        }
        md += '\n---\n\n';

        // Characters list
        md += '## Characters\n\n';
        struct.characters.forEach(char => {
            md += `- **${char.name}**`;
            if (char.aliases.length > 0) {
                md += ` (also: ${char.aliases.join(', ')})`;
            }
            md += `\n`;
        });
        md += '\n---\n\n';

        // Front matter / introduction
        if (struct.metadata.frontMatter) {
            md += '## Introduction\n\n';
            md += `${struct.metadata.frontMatter}\n\n`;
            md += '---\n\n';
        }

        // Acts and Scenes
        struct.acts.forEach(act => {
            md += `## ACT ${act.actNumber}`;
            // Only add title if it's not a redundant "Act X"
            if (act.title && !act.title.match(/^ACT\s+[IVX\d]+$/i)) {
                md += ` - ${act.title}`;
            }
            md += '\n\n';

            act.scenes.forEach(scene => {
                md += `### Scene ${scene.sceneNumber}`;
                if (scene.location) md += ` - ${scene.location}`;
                md += '\n\n';

                scene.lines.forEach(line => {
                    if (line.type === 'stage_direction') {
                        md += `*[${line.text}]*\n\n`;
                    } else if (line.type === 'dialogue' && line.character) {
                        md += `**${line.character}:** ${line.text}\n\n`;
                    } else if (line.type === 'scene_header') {
                        md += `#### ${line.text}\n\n`;
                    } else {
                        md += `${line.text}\n\n`;
                    }
                });
            });
        });

        return md;
    };
    // Convert standard markdown back to structure
    const markdownToStructure = (md: string): DetectedStructure => {
        const lines = md.split('\n');
        const struct: DetectedStructure = {
            format: editedStructure?.format || 'unknown',
            confidence: 1.0,
            acts: [],
            characters: [],
            metadata: {
                title: '',
                author: '',
                year: '',
                frontMatter: '',
                estimatedLineCount: 0
            }
        };

        let currentAct: Act | null = null;
        let currentScene: Scene | null = null;
        const charSet = new Set<string>();

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;

            // Metadata
            if (trimmed.startsWith('# ')) {
                struct.metadata.title = trimmed.replace('# ', '').trim();
            } else if (trimmed.startsWith('**Author:**')) {
                struct.metadata.author = trimmed.replace('**Author:**', '').trim();
            } else if (trimmed.startsWith('**Year:**')) {
                struct.metadata.year = trimmed.replace('**Year:**', '').trim();
            }
            // Acts
            else if (trimmed.startsWith('## ACT')) {
                if (currentAct) {
                    if (currentScene) currentAct.scenes.push(currentScene);
                    struct.acts.push(currentAct);
                }
                const actMatch = trimmed.match(/^## ACT\s+(\d+)(?:\s*-\s*(.*))?$/i);
                currentAct = {
                    actNumber: actMatch ? parseInt(actMatch[1]) : struct.acts.length + 1,
                    title: actMatch?.[2] || '',
                    scenes: []
                };
                currentScene = null;
            }
            // Scenes
            else if (trimmed.startsWith('### Scene')) {
                if (currentAct && currentScene) {
                    currentAct.scenes.push(currentScene);
                }
                const sceneMatch = trimmed.match(/^### Scene\s+(\d+)(?:\s*-\s*(.*))?$/i);
                currentScene = {
                    sceneNumber: sceneMatch ? parseInt(sceneMatch[1]) : (currentAct?.scenes.length || 0) + 1,
                    location: sceneMatch?.[2] || '',
                    lines: []
                };
            }
            // Dialogue
            else if (trimmed.startsWith('**') && trimmed.includes(':**')) {
                const diaMatch = trimmed.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
                if (diaMatch && currentScene) {
                    const charName = diaMatch[1].trim();
                    charSet.add(charName);
                    currentScene.lines.push({
                        lineNumber: 0,
                        type: 'dialogue',
                        character: charName,
                        text: diaMatch[2].trim(),
                        confidence: 1.0
                    });
                }
            }
            // Stage Directions
            else if (trimmed.startsWith('*[') && trimmed.endsWith(']*')) {
                if (currentScene) {
                    currentScene.lines.push({
                        lineNumber: 0,
                        type: 'stage_direction',
                        text: trimmed.slice(2, -2).trim(),
                        confidence: 1.0
                    });
                }
            }
            // Scene Headers (Fallback)
            else if (trimmed.startsWith('#### ')) {
                if (currentScene) {
                    currentScene.lines.push({
                        lineNumber: 0,
                        type: 'scene_header',
                        text: trimmed.replace('#### ', '').trim(),
                        confidence: 1.0
                    });
                }
            }
        });

        // Close last act/scene
        if (currentAct) {
            if (currentScene) currentAct.scenes.push(currentScene);
            struct.acts.push(currentAct);
        }

        // Finalize characters
        struct.characters = Array.from(charSet).map(name => ({
            name,
            aliases: [],
            estimatedLines: 0 // Will be recalculated if needed
        }));

        struct.metadata.estimatedLineCount = struct.acts.reduce((acc, act) =>
            acc + act.scenes.reduce((sAcc, s) => sAcc + s.lines.length, 0), 0);

        return struct;
    };

    // Update markdown when entering edit mode
    React.useEffect(() => {
        if (status === 'editing' && editedStructure) {
            setMarkdownText(structureToMarkdown(editedStructure));
        }
    }, [status, editedStructure]);

    // Character editing functions
    const updateCharacterName = (idx: number, newName: string) => {
        if (!editedStructure) return;
        const updated = { ...editedStructure };
        updated.characters = [...updated.characters];
        updated.characters[idx] = { ...updated.characters[idx], name: newName };
        setEditedStructure(updated);
    };

    const deleteCharacter = (idx: number) => {
        if (!editedStructure) return;
        const updated = { ...editedStructure };
        updated.characters = updated.characters.filter((_, i) => i !== idx);
        setEditedStructure(updated);
    };

    const addCharacter = () => {
        if (!editedStructure) return;
        const updated = { ...editedStructure };
        updated.characters = [...updated.characters, { name: 'NEW CHARACTER', aliases: [], estimatedLines: 0 }];
        setEditedStructure(updated);
    };

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
        addLog('🤖 Analyzing with Gemini-3-Flash [V2.2 HARDENED]...');
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

            // REPAIR: If metadata leaked into frontMatter, extract and SCRUB it
            if (detected.metadata) {
                let fm = detected.metadata.frontMatter || '';
                const titleMatch = fm.match(/Title:\s*([^\n]+)/i);
                const authorMatch = fm.match(/Author:\s*([^\n]+)/i);
                const yearMatch = fm.match(/Year:\s*([^\n]+)/i);

                if (!detected.metadata.title && titleMatch) detected.metadata.title = titleMatch[1].trim();
                if (!detected.metadata.author && authorMatch) detected.metadata.author = authorMatch[1].trim();
                if (!detected.metadata.year && yearMatch) detected.metadata.year = yearMatch[1].trim();

                // SCRUB: Remove metadata lines from frontMatter
                detected.metadata.frontMatter = fm.split('\n')
                    .filter(line => !line.match(/^(Title:|Author:|Year:|Year published:|By|Written by)/i))
                    .join('\n').trim();
            }

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
        const lines = text.split('\n');
        const characters = new Set<string>();
        const acts: Act[] = [];
        let currentAct: Act | null = null;
        let currentScene: Scene | null = null;

        let metadataTitle = '';
        let metadataAuthor = '';
        let metadataYear = '';
        const metadataIndices = new Set<number>();

        // Step 1: Detect Metadata headers within first 20 lines
        lines.slice(0, 20).forEach((line, idx) => {
            const t = line.trim();
            if (t.toLowerCase().startsWith('title:')) { metadataTitle = t.replace(/title:/i, '').trim(); metadataIndices.add(idx); }
            else if (t.toLowerCase().startsWith('author:')) { metadataAuthor = t.replace(/author:/i, '').trim(); metadataIndices.add(idx); }
            else if (t.toLowerCase().startsWith('year:')) { metadataYear = t.replace(/year:/i, '').trim(); metadataIndices.add(idx); }
        });

        // Step 2: Parse Body lines
        lines.forEach((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed || metadataIndices.has(idx)) return;

            // Header Detection
            if (trimmed.match(/^ACT\s+[IVX\d]+/i)) {
                if (currentAct) acts.push(currentAct);
                currentAct = { actNumber: acts.length + 1, scenes: [] };
                currentScene = null;
                return;
            }
            if (trimmed.match(/^SCENE\s+[IVX\d]+/i)) {
                if (!currentAct) currentAct = { actNumber: 1, scenes: [] };
                currentScene = { sceneNumber: currentAct.scenes.length + 1, location: trimmed, lines: [] };
                currentAct.scenes.push(currentScene);
                return;
            }

            if (!currentAct) currentAct = { actNumber: 1, scenes: [] };
            if (!currentScene) {
                currentScene = { sceneNumber: 1, lines: [] };
                currentAct.scenes.push(currentScene);
            }

            // Dialogue/Directions Detection
            const shawMatch = trimmed.match(/^([A-Z][A-Z\s\-']+)(?:\s*\[[^\]]+\])?\.\s*(.*)$/);
            if (trimmed.startsWith('[') || trimmed.startsWith('(')) {
                currentScene.lines.push({ lineNumber: idx + 1, type: 'stage_direction', text: trimmed, confidence: 0.8 });
            } else if (shawMatch) {
                const char = shawMatch[1].trim();
                characters.add(char);
                currentScene.lines.push({ lineNumber: idx + 1, type: 'dialogue', character: char, text: shawMatch[2].trim(), confidence: 0.8 });
            } else if (trimmed.includes(':') && trimmed.slice(0, 20).includes(':')) {
                const parts = trimmed.split(':');
                const char = parts[0].trim();
                characters.add(char);
                currentScene.lines.push({ lineNumber: idx + 1, type: 'dialogue', character: char, text: parts.slice(1).join(':').trim(), confidence: 0.8 });
            } else {
                currentScene.lines.push({ lineNumber: idx + 1, type: 'dialogue', text: trimmed, confidence: 0.5 });
            }
        });

        if (currentAct && !acts.includes(currentAct)) acts.push(currentAct);

        return {
            format: 'unknown',
            confidence: 0.5,
            acts: acts.length > 0 ? acts : [{ actNumber: 1, scenes: [{ sceneNumber: 1, lines: [] }] }],
            characters: Array.from(characters).map(c => ({ name: c, aliases: [], estimatedLines: 0 })),
            metadata: {
                title: metadataTitle || (lines[0].length < 50 ? lines[0] : 'Untitled'),
                author: metadataAuthor,
                year: metadataYear,
                estimatedLineCount: lines.length
            }
        };
    };

    const handleConfirm = () => {
        if (status === 'editing' && markdownText) {
            const finalStructure = markdownToStructure(markdownText);
            onValidated(finalStructure);
        } else if (editedStructure) {
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
                    <p className="text-gray-400 text-sm mt-2 flex items-center justify-between">
                        <span>Analyzing script structure • Detecting format • Extracting characters</span>
                        <span className="text-white/20 text-[10px] font-mono">v2.2-HARDENED</span>
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

                                {/* EDITING MODE */}
                                {status === 'editing' && editedStructure ? (
                                    <div className="space-y-6">
                                        {/* Help Guide - Collapsible */}
                                        <div className="border border-yellow-500/30 rounded-xl overflow-hidden bg-yellow-900/10">
                                            <button
                                                onClick={() => setShowHelp(!showHelp)}
                                                className="w-full p-3 flex items-center justify-between text-left hover:bg-yellow-900/20 transition"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <HelpCircle className="w-4 h-4 text-yellow-400" />
                                                    <span className="font-bold text-yellow-300 text-sm">Markdown Syntax Guide</span>
                                                </div>
                                                {showHelp ? (
                                                    <ChevronUp className="w-4 h-4 text-yellow-400" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-yellow-400" />
                                                )}
                                            </button>

                                            {showHelp && (
                                                <div className="p-4 border-t border-yellow-500/20 text-sm space-y-4">
                                                    <div>
                                                        <h5 className="font-bold text-white mb-2">📝 Standard Script Format</h5>
                                                        <div className="bg-black/30 p-3 rounded-lg font-mono text-xs text-gray-300 space-y-1">
                                                            <p><span className="text-blue-400"># Title</span> - Play title (H1 header)</p>
                                                            <p><span className="text-purple-400">**Author:** Name</span> - Author metadata</p>
                                                            <p><span className="text-green-400">## ACT 1</span> - Act header</p>
                                                            <p><span className="text-cyan-400">### Scene 1 - Location</span> - Scene header</p>
                                                            <p><span className="text-yellow-400">**CHARACTER:** Dialogue</span> - Character speech</p>
                                                            <p><span className="text-gray-400">*[Stage direction]*</span> - Stage directions</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h5 className="font-bold text-white mb-2">✏️ Editing Tips</h5>
                                                        <ul className="text-gray-400 space-y-1 text-xs">
                                                            <li>• <strong className="text-white">Characters:</strong> Edit names directly, add with +, remove with ×</li>
                                                            <li>• <strong className="text-white">Metadata:</strong> Edit title and author in the blue section</li>
                                                            <li>• <strong className="text-white">Markdown:</strong> Freely edit the script in the text area below</li>
                                                            <li>• <strong className="text-white">Dialogue:</strong> Use <code className="bg-black/40 px-1 rounded">**NAME:** text</code> format</li>
                                                            <li>• <strong className="text-white">Directions:</strong> Wrap in <code className="bg-black/40 px-1 rounded">*[brackets]*</code></li>
                                                        </ul>
                                                    </div>

                                                    <div className="flex items-start gap-2 p-2 bg-blue-900/20 rounded-lg border border-blue-500/20">
                                                        <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                                        <p className="text-xs text-blue-300">
                                                            This standardized format ensures consistent parsing for music generation.
                                                            The system will convert your script to musical notation based on character emotions and dialogue.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Editable Characters */}
                                        <div className="border border-purple-500/30 rounded-xl p-4 bg-purple-900/10">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-purple-400" />
                                                    <h4 className="font-bold text-white">Edit Characters</h4>
                                                </div>
                                                <button
                                                    onClick={addCharacter}
                                                    className="p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 transition"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {editedStructure.characters.map((char, i) => (
                                                    <div key={i} className="p-2 bg-black/30 rounded border border-white/10 flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={char.name}
                                                            onChange={(e) => updateCharacterName(i, e.target.value)}
                                                            className="flex-1 bg-transparent text-white text-sm font-bold border-none outline-none"
                                                        />
                                                        <button
                                                            onClick={() => deleteCharacter(i)}
                                                            className="p-1 rounded hover:bg-red-500/30 text-red-400 transition"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Editable Metadata */}
                                        <div className="border border-blue-500/30 rounded-xl p-4 bg-blue-900/10">
                                            <h4 className="font-bold text-white mb-3">Edit Metadata</h4>
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="text-xs text-gray-400">Title</label>
                                                    <input
                                                        type="text"
                                                        value={editedStructure.metadata.title || ''}
                                                        onChange={(e) => {
                                                            const updated = { ...editedStructure };
                                                            updated.metadata = { ...updated.metadata, title: e.target.value };
                                                            setEditedStructure(updated);
                                                        }}
                                                        className="w-full bg-black/30 text-white text-sm p-2 rounded border border-white/10 outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-400">Author</label>
                                                    <input
                                                        type="text"
                                                        value={editedStructure.metadata.author || ''}
                                                        onChange={(e) => {
                                                            const updated = { ...editedStructure };
                                                            updated.metadata = { ...updated.metadata, author: e.target.value };
                                                            setEditedStructure(updated);
                                                        }}
                                                        className="w-full bg-black/30 text-white text-sm p-2 rounded border border-white/10 outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-400">Year</label>
                                                    <input
                                                        type="text"
                                                        value={editedStructure.metadata.year || ''}
                                                        onChange={(e) => {
                                                            const updated = { ...editedStructure };
                                                            updated.metadata = { ...updated.metadata, year: e.target.value };
                                                            setEditedStructure(updated);
                                                        }}
                                                        className="w-full bg-black/30 text-white text-sm p-2 rounded border border-white/10 outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Markdown Preview/Edit */}
                                        <div className="border border-white/10 rounded-xl overflow-hidden">
                                            <div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                                                <h4 className="font-bold text-white text-sm">Standard Markdown Format</h4>
                                                <span className="text-xs text-gray-500">Editable</span>
                                            </div>
                                            <textarea
                                                value={markdownText}
                                                onChange={(e) => setMarkdownText(e.target.value)}
                                                className="w-full h-64 bg-black/40 text-gray-300 text-xs font-mono p-4 resize-none outline-none"
                                                placeholder="Markdown preview will appear here..."
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    /* REVIEWING MODE */
                                    <>
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
                                    </>
                                )}
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
