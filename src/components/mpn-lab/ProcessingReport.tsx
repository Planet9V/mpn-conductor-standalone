'use client';

import React from 'react';
import {
    FileText, CheckCircle, AlertTriangle,
    Download, ArrowLeft, Save, Sparkles,
    Users, Music, Brain, Volume2, Layout,
    Play, Pause, Loader2
} from 'lucide-react';

interface ProcessingReportProps {
    processedData: any;
    onSave: () => void;
    onBack: () => void;
    isSaving: boolean;
    error: string | null;
}

export default function ProcessingReport({
    processedData,
    onSave,
    onBack,
    isSaving,
    error
}: ProcessingReportProps) {
    const [playingVoiceId, setPlayingVoiceId] = React.useState<string | null>(null);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    const handlePlayPreview = (voiceId: string, previewUrl?: string) => {
        if (!previewUrl) return;

        if (playingVoiceId === voiceId) {
            audioRef.current?.pause();
            setPlayingVoiceId(null);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        const audio = new Audio(previewUrl);
        audioRef.current = audio;
        setPlayingVoiceId(voiceId);

        audio.play().catch(err => {
            console.error('Playback failed:', err);
            setPlayingVoiceId(null);
        });

        audio.onended = () => {
            setPlayingVoiceId(null);
        };
    };

    if (!processedData) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Sparkles className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Processing Report</h2>
                        <p className="text-gray-400 text-sm">Configuration successfully applied to {processedData.frames.length} frames</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Re-Configure
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold shadow-lg shadow-amber-900/40 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {isSaving ? 'Saving to Library...' : 'Confirm & Save to Library'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-4 animate-in shake-in">
                    <AlertTriangle className="w-6 h-6 shrink-0" />
                    <div className="flex-1">
                        <h4 className="font-bold text-red-300">Save Failed</h4>
                        <p className="text-sm opacity-80">{error}</p>
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={onSave}
                                className="px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-bold transition"
                            >
                                Try Again
                            </button>
                            <a
                                href="/play-library"
                                className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition"
                            >
                                Return to Library
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Metadata & Overall Stats */}
                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Layout className="w-4 h-4" />
                            Script Summary
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-2xl font-bold text-white">{processedData.title}</div>
                                <div className="text-gray-400 text-sm">by {processedData.author}</div>
                            </div>
                            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase">Frames</div>
                                    <div className="text-xl font-bold text-amber-500">{processedData.frames.length}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase">Characters</div>
                                    <div className="text-xl font-bold text-purple-500">{processedData.characters.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                            <Music className="w-4 h-4 text-amber-500" />
                            Engine Calibration
                        </h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Style Vector</span>
                                <span className="text-amber-400 font-bold px-2 py-0.5 bg-amber-500/10 rounded capitalize border border-amber-500/20">
                                    {processedData.stylePreset.replace(/_/g, ' ')}
                                </span>
                            </div>

                            {/* Mode Indicators */}
                            <div className="grid grid-cols-2 gap-2 pb-2">
                                <div className={`flex items-center gap-2 text-[10px] px-2 py-1.5 rounded-lg border ${processedData.options?.generateChords ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                    <Sparkles className="w-3 h-3" />
                                    Harmonics: {processedData.options?.generateChords ? 'ON' : 'OFF'}
                                </div>
                                <div className={`flex items-center gap-2 text-[10px] px-2 py-1.5 rounded-lg border ${processedData.options?.computePsychometrics ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                    <Brain className="w-3 h-3" />
                                    Psych: {processedData.options?.computePsychometrics ? 'ON' : 'OFF'}
                                </div>
                            </div>

                            <div className="pt-3 border-t border-white/5">
                                <span className="text-[10px] text-gray-500 uppercase block mb-3">Top Theory Overrides</span>
                                <div className="space-y-2">
                                    {Object.entries(processedData.musicParams || {}).slice(0, 4).map(([k, v]: [string, any]) => {
                                        const val = typeof v === 'number' ? v : 0;
                                        return (
                                            <div key={k} className="space-y-1">
                                                <div className="flex justify-between text-[10px]">
                                                    <span className="text-gray-400 truncate w-32">{k.replace(/-/g, ' ')}</span>
                                                    <span className="text-white font-mono">{val.toFixed(1)}</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-1000"
                                                        style={{ width: `${Math.min(100, Math.max(0, (val + 25) * 2))}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle: Character Profiles */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Actor Registration & Psychometrics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {processedData.characters.map((char: any) => (
                                <div key={char.name} className="p-4 bg-black/40 rounded-2xl border border-white/5 flex gap-4">
                                    <button
                                        onClick={() => handlePlayPreview(char.voiceId, char.previewUrl)}
                                        disabled={!char.previewUrl}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all shrink-0 ${playingVoiceId === char.voiceId
                                            ? 'bg-purple-500 border-purple-400 text-white animate-pulse'
                                            : char.previewUrl
                                                ? 'bg-purple-500/20 border-white/10 text-purple-400 hover:bg-purple-500/30 hover:border-purple-500/50'
                                                : 'bg-white/5 border-white/5 text-gray-600 grayscale cursor-not-allowed'
                                            }`}
                                        title={char.previewUrl ? 'Play Voice Preview' : 'No preview available'}
                                    >
                                        {playingVoiceId === char.voiceId ? (
                                            <Pause className="w-5 h-5" />
                                        ) : (
                                            <Volume2 className="w-5 h-5" />
                                        )}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <h4 className="font-bold text-white truncate">{char.name}</h4>
                                                <div className="text-[9px] text-gray-500 font-medium truncate uppercase tracking-tighter">
                                                    {char.voiceName || char.voiceId}
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-400 italic">
                                                {char.description?.split(',')[0] || 'Clear'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
                                            {Object.entries(char.psychometrics || {}).map(([k, v]: [string, any]) => (
                                                <div key={k} className="flex justify-between items-center text-[10px]">
                                                    <span className="text-gray-600 capitalize">{k}</span>
                                                    <span className="text-gray-300">{v}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Analysis Preview (First 5 Frames)
                        </h3>
                        <div className="space-y-3">
                            {processedData.frames.slice(0, 5).map((frame: any, i: number) => (
                                <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase font-mono">
                                            Frame {i + 1}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">{frame.character}</span>
                                    </div>
                                    <p className="text-sm text-gray-300 italic">"{frame.script.text}"</p>
                                    <div className="mt-3 flex gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] text-gray-500 uppercase">Trauma</span>
                                            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500" style={{ width: `${frame.trauma * 100}%` }} />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] text-gray-500 uppercase">Entropy</span>
                                            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${frame.entropy * 100}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {processedData.frames.length > 5 && (
                                <div className="text-center pt-2">
                                    <p className="text-xs text-gray-600 italic">... and {processedData.frames.length - 5} more frames calibrated</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
