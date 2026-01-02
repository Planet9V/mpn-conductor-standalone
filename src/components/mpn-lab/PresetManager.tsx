import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, Plus, Check } from 'lucide-react';
import { MPNPresetAPI } from './mpn_preset_api';
import { MPNPreset } from './mpn_preset_types';

interface PresetManagerProps {
    onLoadPreset: (preset: MPNPreset) => void;
    currentAdjustments: any; // Type strictly in real usage
}

export default function PresetManager({ onLoadPreset, currentAdjustments }: PresetManagerProps) {
    const [presets, setPresets] = useState<MPNPreset[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadPresets();
    }, []);

    const loadPresets = async () => {
        setIsLoading(true);
        const data = await MPNPresetAPI.getAllPresets();
        setPresets(data);
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (!newPresetName.trim()) return;
        setIsLoading(true);
        await MPNPresetAPI.savePreset({
            name: newPresetName,
            description: 'Custom user preset',
            adjustments: currentAdjustments // In reality this would be the diff
        });

        setNewPresetName('');
        await loadPresets();
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete preset?')) {
            await MPNPresetAPI.deletePreset(id);
            await loadPresets();
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-xs font-mono text-gray-400 hover:text-white transition-colors"
            >
                <FolderOpen className="w-3.5 h-3.5" />
                PRESETS
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-white/10 rounded-lg shadow-xl z-50 p-3">
                    <h4 className="text-xs font-bold text-white mb-3">Saved Configurations</h4>

                    {/* List */}
                    <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                        {presets.length === 0 && (
                            <div className="text-[10px] text-gray-500 italic text-center py-2">No saved presets</div>
                        )}
                        {presets.map(preset => (
                            <div key={preset.id} className="group flex items-center justify-between p-2 rounded bg-black/40 hover:bg-white/5">
                                <button
                                    onClick={() => { onLoadPreset(preset); setIsOpen(false); }}
                                    className="text-xs text-gray-300 hover:text-white text-left flex-1"
                                >
                                    {preset.name}
                                </button>
                                <button
                                    onClick={() => handleDelete(preset.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* New */}
                    <div className="pt-2 border-t border-white/10">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newPresetName}
                                onChange={(e) => setNewPresetName(e.target.value)}
                                placeholder="New Preset Name"
                                className="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-oxot-gold/50"
                            />
                            <button
                                onClick={handleSave}
                                disabled={!newPresetName.trim()}
                                className="p-1.5 bg-oxot-gold/10 hover:bg-oxot-gold/20 disabled:opacity-50 border border-oxot-gold/30 rounded text-oxot-gold"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
