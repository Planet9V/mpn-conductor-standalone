import React, { useState, useEffect } from 'react';
import { ScoreVariant, ActorProfile } from './score_types';
import { ORCHESTRATION_OPTIONS, OrchestrationOption } from './mpn_orchestration_options';

interface OrchestratorBoardProps {
    variant: ScoreVariant;
    actors: ActorProfile[];
    onUpdateVariant: (updatedVariant: ScoreVariant) => void;
    className?: string;
}

// Available instruments grouping for the dropdown
const INSTRUMENT_GROUPS = {
    'Strings': ['Violin', 'Viola', 'Cello', 'Double Bass', 'Harp'],
    'Woodwinds': ['Flute', 'Oboe', 'Clarinet', 'Bassoon', 'Saxophone'],
    'Brass': ['Trumpet', 'French Horn', 'Trombone', 'Tuba'],
    'Keyboards': ['Piano', 'Harpsichord', 'Celesta', 'Synthesizer'],
    'Percussion': ['Timpani', 'Snare Drum', 'Cymbals', 'Gong'],
    'Guitar': ['Acoustic Guitar', 'Electric Guitar', 'Bass Guitar']
};

export const OrchestratorBoard: React.FC<OrchestratorBoardProps> = ({ variant, actors, onUpdateVariant, className }) => {

    // We update local state immediately for UI, but might want to debounce saves to API
    const [availableVoices, setAvailableVoices] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/voices')
            .then(res => res.json())
            .then(data => setAvailableVoices(data.voices || []))
            .catch(e => console.error("Failed to fetch voices", e));
    }, []);

    const handleOverrideChange = (actorId: string, type: 'voiceId' | 'instrument' | 'dynamics', value: any) => {
        const updated = { ...variant };

        if (type === 'voiceId') {
            updated.voice_overrides = {
                ...updated.voice_overrides,
                [actorId]: { ...(updated.voice_overrides || {})[actorId], voiceId: value }
            };
        } else if (type === 'instrument') {
            updated.parameter_overrides = {
                ...updated.parameter_overrides,
                [actorId]: { ...(updated.parameter_overrides || {})[actorId], timbre: { instrument: value } }
            };
            // Note: In the future we might want deep merge
        } else if (type === 'dynamics') {
            updated.parameter_overrides = {
                ...updated.parameter_overrides,
                [actorId]: { ...(updated.parameter_overrides || {})[actorId], dynamics: parseInt(value) }
            };
        }

        onUpdateVariant(updated);
        // TODO: Call API to persist PUT /api/variants/[id]
    };

    return (
        <div className={`bg-gray-900/50 rounded-lg border border-gray-700 p-4 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">🎛️ The Board <span className="text-gray-500 text-sm font-normal ml-2">{variant.name}</span></h3>
                <div className="text-xs text-gray-400">
                    {variant.ai_model} / {variant.musical_style_id}
                </div>
            </div>

            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 text-xs text-gray-500 uppercase font-semibold mb-2 px-2">
                <div>Actor</div>
                <div>Voice Override</div>
                <div>Instrument Override</div>
                <div>Dynamics Offset</div>
            </div>

            <div className="space-y-2">
                {actors.map(actor => {
                    const voiceOverride = variant.voice_overrides?.[actor.id]?.voiceId || '';
                    const paramOverride = variant.parameter_overrides?.[actor.id] || {};
                    const instrumentOverride = paramOverride.timbre?.instrument || '';
                    const dynamicsOverride = paramOverride.dynamics || 0; // 0 means no offset/default

                    return (
                        <div key={actor.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 items-center bg-gray-800/40 px-3 py-2 rounded hover:bg-gray-800/60 transition-colors border border-transparent hover:border-gray-600">
                            <div className="flex flex-col">
                                <span className="font-medium text-white">{actor.name}</span>
                                <span className="text-[10px] text-gray-500">{actor.archetype || 'No Archetype'}</span>
                            </div>

                            {/* Voice Selector */}
                            <select
                                className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-gray-300 text-xs focus:text-white"
                                value={voiceOverride}
                                onChange={(e) => handleOverrideChange(actor.id, 'voiceId', e.target.value)}
                            >
                                <option value="">(Auto-Assigned)</option>
                                {availableVoices.map((v: any) => (
                                    <option key={v.voice_id} value={v.voice_id}>{v.name}</option>
                                ))}
                            </select>

                            {/* Instrument Selector */}
                            <select
                                className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-gray-300 text-xs focus:text-white"
                                value={instrumentOverride}
                                onChange={(e) => handleOverrideChange(actor.id, 'instrument', e.target.value)}
                            >
                                <option value="">(Psychometric Calc)</option>
                                {Object.entries(INSTRUMENT_GROUPS).map(([group, instruments]) => (
                                    <optgroup key={group} label={group}>
                                        {instruments.map(inst => (
                                            <option key={inst} value={inst}>{inst}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>

                            {/* Dynamics Knob (Simple Slider for now) */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="-20"
                                    max="20"
                                    step="5"
                                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    value={dynamicsOverride}
                                    title={`Offset: ${dynamicsOverride}`}
                                    onChange={(e) => handleOverrideChange(actor.id, 'dynamics', e.target.value)}
                                />
                                <span className="text-[10px] w-6 text-right text-gray-400">
                                    {dynamicsOverride > 0 ? `+${dynamicsOverride}` : dynamicsOverride}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
