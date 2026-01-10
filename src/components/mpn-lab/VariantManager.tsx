import React, { useState, useEffect } from 'react';
import { ScoreVariant } from './score_types';
import { ORCHESTRATION_OPTIONS, OrchestrationOption } from './mpn_orchestration_options';

interface VariantManagerProps {
    playId: string;
    onLoadVariant: (variant: ScoreVariant) => void;
    className?: string;
}

export const VariantManager: React.FC<VariantManagerProps> = ({ playId, onLoadVariant, className }) => {
    const [variants, setVariants] = useState<ScoreVariant[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [newName, setNewName] = useState('');
    const [selectedModel, setSelectedModel] = useState<'psychoscore' | 'text2midi'>('psychoscore');
    const [selectedStyle, setSelectedStyle] = useState<string>(OrchestrationOption.LEITMOTIF_WAGNERIAN);

    const fetchVariants = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/variants?play_id=${playId}`);
            if (res.ok) {
                const data = await res.json();
                setVariants(data);
            }
        } catch (e) {
            console.error('Failed to fetch variants', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (playId) fetchVariants();
    }, [playId]);

    const handleCreate = async () => {
        if (!newName) return;

        try {
            const res = await fetch('/api/variants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    play_id: playId,
                    name: newName,
                    ai_model: selectedModel,
                    musical_style_id: selectedStyle,
                    voice_overrides: {},
                    parameter_overrides: {}
                })
            });

            if (res.ok) {
                const newVariant = await res.json();
                setVariants([newVariant, ...variants]);
                setIsCreating(false);
                setNewName('');
                onLoadVariant(newVariant);
            }
        } catch (e) {
            console.error('Failed to create variant', e);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this variant?')) return;

        try {
            const res = await fetch(`/api/variants/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setVariants(variants.filter(v => v.id !== id));
            }
        } catch (e) {
            console.error('Failed to delete variant', e);
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Project Variations</h3>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 text-xs rounded border border-blue-500/30 transition-colors"
                >
                    + New Variant
                </button>
            </div>

            {isCreating && (
                <div className="bg-gray-800/50 p-4 rounded border border-gray-700 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <input
                        type="text"
                        placeholder="Variant Name"
                        className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <select
                            className="bg-gray-900 border border-gray-700 rounded px-2 py-2 text-white text-xs"
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value as any)}
                        >
                            <option value="psychoscore">Psychoscore</option>
                            <option value="text2midi">Text2Midi</option>
                        </select>

                        <select
                            className="bg-gray-900 border border-gray-700 rounded px-2 py-2 text-white text-xs"
                            value={selectedStyle}
                            onChange={(e) => setSelectedStyle(e.target.value)}
                        >
                            {Object.values(OrchestrationOption).map(opt => (
                                <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsCreating(false)}
                            className="text-xs text-gray-400 hover:text-white px-3 py-1"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!newName}
                            className="px-3 py-1 bg-green-500/20 hover:bg-green-500/40 text-green-300 text-xs rounded border border-green-500/30 disabled:opacity-50"
                        >
                            Create
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {variants.map(variant => (
                    <div
                        key={variant.id}
                        onClick={() => onLoadVariant(variant)}
                        className="group flex flex-col p-3 bg-gray-800/30 hover:bg-gray-800/60 border border-gray-800 hover:border-blue-500/30 rounded cursor-pointer transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <span className="font-medium text-blue-100">{variant.name}</span>
                            <button
                                onClick={(e) => handleDelete(variant.id, e)}
                                className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex gap-2 mt-1">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/20">
                                {variant.ai_model}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 truncate max-w-[120px]">
                                {variant.musical_style_id.replace(/_/g, ' ')}
                            </span>
                        </div>
                    </div>
                ))}

                {!loading && variants.length === 0 && !isCreating && (
                    <div className="text-center py-4 text-gray-600 text-xs italic">
                        No variations created yet.
                    </div>
                )}
            </div>
        </div>
    );
};
