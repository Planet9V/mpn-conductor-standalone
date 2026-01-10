'use client';

/**
 * ActorInstrumentPicker - Phase 7 Dynamic Conductor UI
 * Real-time actor-to-instrument mapping with per-actor parameter overrides
 * 
 * HIGH PRIORITY COMPONENT (per user feedback)
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Music,
    User,
    ChevronDown,
    RefreshCw,
    Save,
    Volume2,
    Sliders,
    Zap,
    Settings2
} from 'lucide-react';
import {
    ORCHESTRATION_OPTIONS,
    OrchestrationOption,
    InstrumentPalette,
    getInstrumentsForDisc
} from './mpn_orchestration_options';

// ============================================================================
// TYPES
// ============================================================================

export interface ActorInstrumentMapping {
    actorId: string;
    actorName: string;
    discProfile: 'D' | 'I' | 'S' | 'C' | 'mixed';
    assignedInstrument: string;
    instrumentCategory: keyof InstrumentPalette;
    volume: number;       // 0-100
    pan: number;          // -100 to 100
    octaveShift: number;  // -2 to +2
    velocityMod: number;  // -50 to +50
    muted: boolean;
    solo: boolean;
}

export interface ActorInstrumentPickerProps {
    actors: { id: string; name: string; disc: 'D' | 'I' | 'S' | 'C' | 'mixed' }[];
    orchestrationMode: OrchestrationOption;
    onMappingChange: (mappings: ActorInstrumentMapping[]) => void;
    initialMappings?: ActorInstrumentMapping[];
}

// ============================================================================
// INSTRUMENT ICONS (Emoji based for now, can swap for SVG)
// ============================================================================

const INSTRUMENT_ICONS: Record<string, string> = {
    trumpet: '🎺', horn: '📯', trombone: '🎺', tuba: '🎺',
    flute: '🎶', oboe: '🎵', clarinet: '🎵', bassoon: '🎵', piccolo: '🎵',
    violin1: '🎻', violin2: '🎻', viola: '🎻', cello: '🎻', contrabass: '🎻',
    piano: '🎹', harp: '🎵', celesta: '🎹', organ: '🎹',
    timpani: '🥁', drums: '🥁', percussion: '🥁', snare: '🥁',
    guitar: '🎸', bass_guitar: '🎸', upright_bass: '🎻',
    saxophone: '🎷', alto_sax: '🎷', tenor_sax: '🎷',
    default: '🎼'
};

const getInstrumentIcon = (instrument: string): string => {
    return INSTRUMENT_ICONS[instrument] || INSTRUMENT_ICONS['default'];
};

// ============================================================================
// COMPONENT
// ============================================================================

export function ActorInstrumentPicker({
    actors,
    orchestrationMode,
    onMappingChange,
    initialMappings
}: ActorInstrumentPickerProps) {
    const [mappings, setMappings] = useState<ActorInstrumentMapping[]>([]);
    const [expandedActor, setExpandedActor] = useState<string | null>(null);
    const [orchestration, setOrchestration] = useState(orchestrationMode);

    // Initialize mappings from props or generate defaults
    useEffect(() => {
        if (initialMappings && initialMappings.length > 0) {
            setMappings(initialMappings);
        } else {
            // Auto-assign based on DISC profile and orchestration mode
            const config = ORCHESTRATION_OPTIONS[orchestration];
            const newMappings = actors.map((actor, idx) => {
                const suggestedInstruments = getInstrumentsForDisc(orchestration, actor.disc === 'mixed' ? 'D' : actor.disc);
                const assignedInstrument = suggestedInstruments[idx % suggestedInstruments.length] || 'piano';
                const category = findInstrumentCategory(assignedInstrument, config.instrumentPalette);

                return {
                    actorId: actor.id,
                    actorName: actor.name,
                    discProfile: actor.disc,
                    assignedInstrument,
                    instrumentCategory: category,
                    volume: 80,
                    pan: 0,
                    octaveShift: 0,
                    velocityMod: 0,
                    muted: false,
                    solo: false
                };
            });
            setMappings(newMappings);
        }
    }, [actors, orchestration, initialMappings]);

    // Notify parent of changes
    useEffect(() => {
        if (mappings.length > 0) {
            onMappingChange(mappings);
        }
    }, [mappings, onMappingChange]);

    const updateMapping = useCallback((actorId: string, updates: Partial<ActorInstrumentMapping>) => {
        setMappings(prev => prev.map(m =>
            m.actorId === actorId ? { ...m, ...updates } : m
        ));
    }, []);

    const toggleMute = (actorId: string) => {
        updateMapping(actorId, { muted: !mappings.find(m => m.actorId === actorId)?.muted });
    };

    const toggleSolo = (actorId: string) => {
        updateMapping(actorId, { solo: !mappings.find(m => m.actorId === actorId)?.solo });
    };

    const resetToDefaults = () => {
        setMappings([]);
        // Trigger re-init via useEffect
        setTimeout(() => {
            const config = ORCHESTRATION_OPTIONS[orchestration];
            const newMappings = actors.map((actor, idx) => {
                const suggestedInstruments = getInstrumentsForDisc(orchestration, actor.disc === 'mixed' ? 'D' : actor.disc);
                const assignedInstrument = suggestedInstruments[idx % suggestedInstruments.length] || 'piano';
                const category = findInstrumentCategory(assignedInstrument, config.instrumentPalette);
                return {
                    actorId: actor.id,
                    actorName: actor.name,
                    discProfile: actor.disc,
                    assignedInstrument,
                    instrumentCategory: category,
                    volume: 80,
                    pan: 0,
                    octaveShift: 0,
                    velocityMod: 0,
                    muted: false,
                    solo: false
                };
            });
            setMappings(newMappings);
        }, 0);
    };

    const config = ORCHESTRATION_OPTIONS[orchestration];
    const allInstruments = [
        ...config.instrumentPalette.brass,
        ...config.instrumentPalette.woodwind,
        ...config.instrumentPalette.strings,
        ...config.instrumentPalette.keyboard,
        ...config.instrumentPalette.percussion,
        ...config.instrumentPalette.other
    ];

    return (
        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                        <Music className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Actor Instrument Picker</h3>
                        <p className="text-xs text-white/40">{config.name} Mode • {actors.length} actors</p>
                    </div>
                </div>
                <button
                    onClick={resetToDefaults}
                    className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Orchestration Mode Selector */}
            <div className="mb-6">
                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Orchestration Mode</label>
                <select
                    value={orchestration}
                    onChange={(e) => setOrchestration(e.target.value as OrchestrationOption)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-gold outline-none"
                >
                    {Object.values(OrchestrationOption).map(opt => (
                        <option key={opt} value={opt}>
                            {ORCHESTRATION_OPTIONS[opt].name}
                            {ORCHESTRATION_OPTIONS[opt].recommended ? ' ★' : ''}
                        </option>
                    ))}
                </select>
            </div>

            {/* Actor List */}
            <div className="space-y-3">
                {mappings.map((mapping) => (
                    <motion.div
                        key={mapping.actorId}
                        layout
                        className={`rounded-xl border transition-all overflow-hidden ${mapping.muted
                                ? 'bg-zinc-950 border-white/5 opacity-60'
                                : mapping.solo
                                    ? 'bg-gold/10 border-gold/30'
                                    : 'bg-black/30 border-white/10'
                            }`}
                    >
                        {/* Collapsed Row */}
                        <div
                            className="flex items-center gap-4 p-4 cursor-pointer"
                            onClick={() => setExpandedActor(expandedActor === mapping.actorId ? null : mapping.actorId)}
                        >
                            <div className="text-2xl">{getInstrumentIcon(mapping.assignedInstrument)}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <User className="w-3 h-3 text-white/40" />
                                    <span className="font-medium text-sm">{mapping.actorName}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${mapping.discProfile === 'D' ? 'bg-red-500/20 text-red-400' :
                                            mapping.discProfile === 'I' ? 'bg-yellow-500/20 text-yellow-400' :
                                                mapping.discProfile === 'S' ? 'bg-green-500/20 text-green-400' :
                                                    mapping.discProfile === 'C' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-white/10 text-white/40'
                                        }`}>
                                        {mapping.discProfile}
                                    </span>
                                </div>
                                <p className="text-xs text-white/40 capitalize">{mapping.assignedInstrument.replace(/_/g, ' ')}</p>
                            </div>

                            {/* Quick Controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleMute(mapping.actorId); }}
                                    className={`p-1.5 rounded transition ${mapping.muted ? 'bg-red-500/20 text-red-400' : 'text-white/30 hover:text-white'}`}
                                >
                                    <Volume2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleSolo(mapping.actorId); }}
                                    className={`p-1.5 rounded transition ${mapping.solo ? 'bg-gold text-black' : 'text-white/30 hover:text-white'}`}
                                >
                                    <Zap className="w-4 h-4" />
                                </button>
                                <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${expandedActor === mapping.actorId ? 'rotate-180' : ''}`} />
                            </div>
                        </div>

                        {/* Expanded Panel */}
                        <AnimatePresence>
                            {expandedActor === mapping.actorId && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-white/5 p-4 space-y-4 bg-black/20"
                                >
                                    {/* Instrument Selector */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Instrument</label>
                                        <select
                                            value={mapping.assignedInstrument}
                                            onChange={(e) => updateMapping(mapping.actorId, {
                                                assignedInstrument: e.target.value,
                                                instrumentCategory: findInstrumentCategory(e.target.value, config.instrumentPalette)
                                            })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none capitalize"
                                        >
                                            {allInstruments.map(inst => (
                                                <option key={inst} value={inst} className="capitalize">
                                                    {getInstrumentIcon(inst)} {inst.replace(/_/g, ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Volume & Pan */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Volume</label>
                                            <input
                                                type="range"
                                                min={0}
                                                max={100}
                                                value={mapping.volume}
                                                onChange={(e) => updateMapping(mapping.actorId, { volume: parseInt(e.target.value) })}
                                                className="w-full accent-gold"
                                            />
                                            <span className="text-xs text-white/40 block text-right">{mapping.volume}%</span>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Pan</label>
                                            <input
                                                type="range"
                                                min={-100}
                                                max={100}
                                                value={mapping.pan}
                                                onChange={(e) => updateMapping(mapping.actorId, { pan: parseInt(e.target.value) })}
                                                className="w-full accent-gold"
                                            />
                                            <span className="text-xs text-white/40 block text-right">{mapping.pan > 0 ? `R${mapping.pan}` : mapping.pan < 0 ? `L${Math.abs(mapping.pan)}` : 'C'}</span>
                                        </div>
                                    </div>

                                    {/* Octave & Velocity */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Octave Shift</label>
                                            <input
                                                type="range"
                                                min={-2}
                                                max={2}
                                                value={mapping.octaveShift}
                                                onChange={(e) => updateMapping(mapping.actorId, { octaveShift: parseInt(e.target.value) })}
                                                className="w-full accent-gold"
                                            />
                                            <span className="text-xs text-white/40 block text-right">{mapping.octaveShift > 0 ? `+${mapping.octaveShift}` : mapping.octaveShift}</span>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Velocity Mod</label>
                                            <input
                                                type="range"
                                                min={-50}
                                                max={50}
                                                value={mapping.velocityMod}
                                                onChange={(e) => updateMapping(mapping.actorId, { velocityMod: parseInt(e.target.value) })}
                                                className="w-full accent-gold"
                                            />
                                            <span className="text-xs text-white/40 block text-right">{mapping.velocityMod > 0 ? `+${mapping.velocityMod}` : mapping.velocityMod}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/30">
                <span>{mappings.filter(m => m.solo).length} solo • {mappings.filter(m => m.muted).length} muted</span>
                <a href="/wiki/conductor-actor-picker" className="hover:text-gold transition">Documentation →</a>
            </div>
        </div>
    );
}

// ============================================================================
// UTILITY
// ============================================================================

function findInstrumentCategory(instrument: string, palette: InstrumentPalette): keyof InstrumentPalette {
    if (palette.brass.includes(instrument)) return 'brass';
    if (palette.woodwind.includes(instrument)) return 'woodwind';
    if (palette.strings.includes(instrument)) return 'strings';
    if (palette.keyboard.includes(instrument)) return 'keyboard';
    if (palette.percussion.includes(instrument)) return 'percussion';
    return 'other';
}

export default ActorInstrumentPicker;
