'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Play, RotateCcw, Save, X } from 'lucide-react';
import { MPNPresetAPI } from './mpn_preset_api';
import AdjustmentDial from './AdjustmentDial';
import { MPNReferenceEntry, MPNCategory } from './mpn_reference_types';
import * as Tone from 'tone';

interface ParameterAdjustmentPanelProps {
    entry: MPNReferenceEntry;
    onClose: () => void;
    onSavePreset?: (adjustments: any) => void;
}

export default function ParameterAdjustmentPanel({ entry, onClose, onSavePreset }: ParameterAdjustmentPanelProps) {
    // Initial state based on entry implementation or defaults
    const [tempo, setTempo] = useState(entry.implementation.bpmRange ? (entry.implementation.bpmRange.min + entry.implementation.bpmRange.max) / 2 : 120);
    const [dynamics, setDynamics] = useState(typeof entry.defaultValue === 'number' ? entry.defaultValue : 72);
    const [humanization, setHumanization] = useState(0.05);

    // Auto-save adjustments whenever they change
    useEffect(() => {
        const activeAdjustments = MPNPresetAPI.getActiveAdjustments();
        activeAdjustments[entry.id] = { id: entry.id, tempo, dynamics, humanization };
        MPNPresetAPI.saveActiveAdjustments(activeAdjustments);
    }, [tempo, dynamics, humanization, entry.id]);

    const handlePreview = async () => {
        try {
            await Tone.start();
            const synth = new Tone.PolySynth(Tone.Synth).toDestination();

            // Convert dynamics (MIDI velocity 0-127) to Tone.js volume (-60 to 0 dB)
            const volume = (dynamics / 127) * 60 - 60;
            synth.volume.value = volume;

            // Play a simple 4-note phrase using adjusted params
            const now = Tone.now();
            const noteDuration = 60 / tempo; // Convert BPM to seconds per beat

            synth.triggerAttackRelease('C4', noteDuration, now);
            synth.triggerAttackRelease('E4', noteDuration, now + noteDuration);
            synth.triggerAttackRelease('G4', noteDuration, now + noteDuration * 2);
            synth.triggerAttackRelease('C5', noteDuration, now + noteDuration * 3);

            // Clean up after sequence
            setTimeout(() => synth.dispose(), noteDuration * 4 * 1000 + 500);
        } catch (err) {
            console.error('Audio preview failed:', err);
        }
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-gray-950 border-l border-white/10 shadow-2xl z-50 flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                    <h3 className="text-white font-bold text-sm tracking-wide">{entry.displayName}</h3>
                    <div className="text-xs text-oxot-gold font-mono truncate max-w-[200px]">{entry.musicalElement}</div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Controls */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Tempo Control (if applicable) */}
                {entry.category === MPNCategory.RHYTHM && (
                    <div className="space-y-2">
                        <AdjustmentDial
                            label="Tempo"
                            value={tempo}
                            min={40}
                            max={220}
                            unit=" BPM"
                            onChange={setTempo}
                            color="text-cyan-400"
                        />
                        <div className="text-[10px] text-gray-500">
                            Base range: {entry.implementation.bpmRange?.min}-{entry.implementation.bpmRange?.max} BPM
                        </div>
                    </div>
                )}

                {/* Dynamics Control */}
                <div className="space-y-2">
                    <AdjustmentDial
                        label="Dynamics (Velocity)"
                        value={dynamics}
                        min={0}
                        max={127}
                        onChange={setDynamics}
                        onPreview={handlePreview}
                        color="text-purple-400"
                    />
                    <div className="text-[10px] text-gray-500">
                        Suggests: {entry.implementation.velocityRange?.min}-{entry.implementation.velocityRange?.max}
                    </div>
                </div>

                {/* Humanization/Rubato */}
                <div className="space-y-2">
                    <AdjustmentDial
                        label="Humanization"
                        value={humanization}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={setHumanization}
                        onPreview={handlePreview}
                        color="text-oxot-gold"
                    />
                    <div className="text-[10px] text-gray-500">
                        Timing deviation and velocity variance
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-black/20 flex gap-2">
                <button
                    onClick={handlePreview}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white transition-colors"
                >
                    <Play className="w-3 h-3" /> PREVIEW
                </button>
                <button
                    className="flex items-center justify-center gap-2 bg-oxot-gold/10 hover:bg-oxot-gold/20 border border-oxot-gold/30 rounded px-3 py-2 text-xs font-mono text-oxot-gold transition-colors"
                >
                    <Save className="w-3 h-3" /> SAVE
                </button>
            </div>
        </motion.div>
    );
}
