import React, { useState, useEffect } from 'react';
import { Dial } from './Dial';
import { Slider } from './Slider';
import { ScoreVariant, ActorProfile } from './score_types';
import { ORCHESTRATION_OPTIONS, OrchestrationOption } from './mpn_orchestration_options';
import { Sliders, Music, Zap, Layers, Mic2 } from 'lucide-react';

import { AIModelSelector } from '../conductor/AIModelSelector';
import type { AIModelSource } from './GeniusComposer';

interface OrchestratorDashboardProps {
    variant: ScoreVariant;
    actors: ActorProfile[];
    onUpdateVariant: (updatedVariant: ScoreVariant) => void;
    onGenerate: () => void;
    onSave: () => void;
    className?: string;
    activeActorId?: string | null;
}

const INSTRUMENT_GROUPS = {
    'Strings': ['Violin', 'Viola', 'Cello', 'Double Bass', 'Harp'],
    'Woodwinds': ['Flute', 'Oboe', 'Clarinet', 'Bassoon', 'Saxophone'],
    'Brass': ['Trumpet', 'French Horn', 'Trombone', 'Tuba'],
    'Keyboards': ['Piano', 'Harpsichord', 'Celesta', 'Synthesizer'],
    'Percussion': ['Timpani', 'Snare Drum', 'Cymbals', 'Gong'],
    'Guitar': ['Acoustic Guitar', 'Electric Guitar', 'Bass Guitar', 'Lute']
};

export const OrchestratorDashboard: React.FC<OrchestratorDashboardProps> = ({
    variant,
    actors,
    onUpdateVariant,
    onGenerate,
    onSave,
    className,
    activeActorId
}) => {
    const [availableVoices, setAvailableVoices] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/voices')
            .then(res => res.json())
            .then(data => setAvailableVoices(data.voices || []))
            .catch(e => console.error("Failed to fetch voices", e));
    }, []);

    // Handlers
    const handleVoiceChange = (actorId: string, voiceId: string) => {
        onUpdateVariant({
            ...variant,
            voice_overrides: {
                ...variant.voice_overrides,
                [actorId]: { ...variant.voice_overrides?.[actorId], voiceId }
            }
        });
    };

    const handleParamChange = (actorId: string, param: 'dynamics' | 'articulation', value: number) => {
        const currentParams = variant.parameter_overrides?.[actorId] || {};
        onUpdateVariant({
            ...variant,
            parameter_overrides: {
                ...variant.parameter_overrides,
                [actorId]: { ...currentParams, [param]: value }
            }
        });
    };

    const handleInstrumentChange = (actorId: string, instrument: string) => {
        const currentParams = variant.parameter_overrides?.[actorId] || {};
        onUpdateVariant({
            ...variant,
            parameter_overrides: {
                ...variant.parameter_overrides,
                [actorId]: {
                    ...currentParams,
                    timbre: { ...currentParams.timbre, instrument }
                }
            }
        });
    };

    // Dummy State for Global Sliders (in a real app, these would also be in Variant config)
    const [rhythmSyncopation, setRhythmSyncopation] = useState(10);
    const [harmonyComplexity, setHarmonyComplexity] = useState(40);
    const [harmonyDissonance, setHarmonyDissonance] = useState(30);
    const [textureDensity, setTextureDensity] = useState(30);


    // Guard against null variant
    if (!variant) {
        return (
            <div className={`bg-gray-950/90 backdrop-blur-xl border-l border-white/10 h-full flex flex-col ${className}`}>
                <div className="p-6 flex items-center justify-center text-gray-500">
                    <p>Select a scenario to configure orchestration</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-gray-950/90 backdrop-blur-xl border-l border-white/10 h-full flex flex-col ${className}`}>

            {/* Header */}
            <div className="p-6 border-b border-white/5 flex flex-col gap-4 bg-black/40">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                            <Sliders className="w-5 h-5 text-cyan-400" />
                            Orchestration Dashboard
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-mono">
                            {variant?.name || 'Unsaved'}
                        </p>
                    </div>
                </div>

                {/* AI Model Selection */}
                <div className="bg-gray-900/50 p-3 rounded-lg border border-white/5">
                    <AIModelSelector
                        value={(variant.ai_model as AIModelSource) || 'hybrid'}
                        onChange={(model) => onUpdateVariant({ ...variant, ai_model: model })}
                        showStatus={true}
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onGenerate}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded border border-white/10 shadow-lg shadow-cyan-900/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        Generate
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded border border-white/10 active:scale-95 transition-all"
                    >
                        Save Variant
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">

                {/* 1. Global Style Controls */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <Music className="w-4 h-4 text-purple-400" />
                            Musical Style & Parameters
                        </h3>
                        {/* Style Selector */}
                        <select
                            className="bg-gray-900 border border-gray-700 text-xs text-gray-300 rounded px-2 py-1 focus:border-purple-500 focus:outline-none"
                            value={variant.musical_style_id}
                            onChange={(e) => onUpdateVariant({ ...variant, musical_style_id: e.target.value })}
                        >
                            {Object.values(OrchestrationOption).map(opt => (
                                <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900/40 p-5 rounded-xl border border-white/5">
                        <div className="space-y-6">
                            <Slider
                                label="Rhythm: Syncopation"
                                value={rhythmSyncopation}
                                min={0} max={100}
                                onChange={setRhythmSyncopation}
                                color="purple"
                                leftLabel="Strict"
                                rightLabel="Loose"
                            />
                            <Slider
                                label="Harmony: Complexity"
                                value={harmonyComplexity}
                                min={0} max={100}
                                onChange={setHarmonyComplexity}
                                color="cyan"
                                leftLabel="Simple"
                                rightLabel="Dense"
                            />
                        </div>
                        <div className="space-y-6">
                            <Slider
                                label="Texture: Density"
                                value={textureDensity}
                                min={0} max={100}
                                onChange={setTextureDensity}
                                color="mixed"
                                leftLabel="Sparse"
                                rightLabel="Full"
                            />
                            <Slider
                                label="Harmony: Dissonance"
                                value={harmonyDissonance}
                                min={0} max={100}
                                onChange={setHarmonyDissonance}
                                color="red"
                                leftLabel="Consonant"
                                rightLabel="Dissonant"
                            />
                        </div>
                    </div>
                </section>

                {/* 2. Per-Actor Overrides */}
                <section>
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-500" />
                        Character Orchestration
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                        {actors.map(actor => {
                            const voiceOverride = variant.voice_overrides?.[actor.id]?.voiceId || '';
                            const paramOverride = variant.parameter_overrides?.[actor.id] || {};
                            const instrumentOverride = paramOverride.timbre?.instrument || '';
                            const dynamicsOverride = paramOverride.dynamics || 0;
                            const artOverride = paramOverride.articulation || 50;

                            return (
                                <div
                                    key={actor.id}
                                    className={`
                                        border rounded-lg p-4 transition-all duration-300 group
                                        ${activeActorId === actor.id
                                            ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gold/60 shadow-[0_0_15px_rgba(250,204,21,0.1)] scale-[1.02]'
                                            : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                                        }
                                    `}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-600">
                                                {actor.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-200 text-sm">{actor.name}</div>
                                                <div className="text-[10px] text-gray-500">{actor.archetype}</div>
                                            </div>
                                        </div>

                                        {/* Quick Toggles could go here */}
                                    </div>

                                    <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-6 items-end">

                                        {/* Dropdowns */}
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1 block">Voice Model</label>
                                                <div className="relative">
                                                    <Mic2 className="absolute left-2 top-1.5 w-3 h-3 text-gray-500" />
                                                    <select
                                                        className="w-full bg-black/40 border border-gray-700 rounded pl-7 pr-2 py-1 text-xs text-gray-300 focus:border-cyan-500 focus:outline-none appearance-none"
                                                        value={voiceOverride}
                                                        onChange={(e) => handleVoiceChange(actor.id, e.target.value)}
                                                    >
                                                        <option value="">Auto-Assign</option>
                                                        {availableVoices.map((v: any) => (
                                                            <option key={v.voice_id} value={v.voice_id}>{v.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1 block">Timbre / Instrument</label>
                                                <select
                                                    className="w-full bg-black/40 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 focus:border-purple-500 focus:outline-none appearance-none"
                                                    value={instrumentOverride}
                                                    onChange={(e) => handleInstrumentChange(actor.id, e.target.value as string)}
                                                >
                                                    <option value="">Psychometric Default</option>
                                                    {Object.entries(INSTRUMENT_GROUPS).map(([group, instruments]) => (
                                                        <optgroup key={group} label={group}>
                                                            {instruments.map(inst => (
                                                                <option key={inst} value={inst}>{inst}</option>
                                                            ))}
                                                        </optgroup>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Dials */}
                                        <div className="flex justify-center">
                                            <Dial
                                                label="Dynamics"
                                                units="+/- dB"
                                                value={dynamicsOverride}
                                                min={-20}
                                                max={20}
                                                step={1}
                                                onChange={(v) => handleParamChange(actor.id, 'dynamics', v)}
                                                size={56}
                                                color="#F59E0B" // Amber
                                            />
                                        </div>

                                        <div className="flex justify-center">
                                            <Dial
                                                label="Articulation"
                                                units="%"
                                                value={artOverride}
                                                min={0}
                                                max={100}
                                                step={5}
                                                onChange={(v) => handleParamChange(actor.id, 'articulation', v)}
                                                size={56}
                                                color="#22D3EE" // Cyan
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};
