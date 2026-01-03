'use client';

/**
 * Conductor's Score Display - Canvas2D Edition
 * Reliable fallback rendering using native Canvas 2D API
 * Provides immediate visual feedback while more complex notation loads
 */

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { PsychometricScoreFrame, ActorStaveData, NoteEvent } from './score_types';

// ============================================================================
// TYPES
// ============================================================================

interface ConductorScoreProps {
    frame?: PsychometricScoreFrame;
    showChordSymbols?: boolean;
    showDynamics?: boolean;
    scrolling?: boolean;
    isPlaying?: boolean;
    currentBeat?: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STAVE_HEIGHT = 80;
const NOTE_COLORS = {
    speaking: '#facc15',
    active: '#22c55e',
    silent: '#444'
};

// ============================================================================
// HELPERS
// ============================================================================

function velocityToDynamic(velocity: number): string {
    if (velocity < 30) return 'ppp';
    if (velocity < 50) return 'pp';
    if (velocity < 65) return 'p';
    if (velocity < 85) return 'mf';
    if (velocity < 100) return 'f';
    if (velocity < 115) return 'ff';
    return 'fff';
}

function midiToY(midiNote: number, staveY: number): number {
    // Map MIDI notes to vertical position on stave
    // Middle C (60) should be near the center
    const middleC = 60;
    const offset = (midiNote - middleC) * 4; // 4 pixels per semitone
    return staveY + 40 - offset;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ConductorScoreCanvas({
    frame,
    showChordSymbols = true,
    showDynamics = true,
    scrolling = true,
    isPlaying = false,
    currentBeat = 0
}: ConductorScoreProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Calculate dimensions
    const staveCount = frame?.staves?.length || 1;
    const canvasHeight = staveCount * STAVE_HEIGHT + 100;
    const canvasWidth = 900;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // High DPI scaling
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        ctx.scale(dpr, dpr);

        // Clear
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        if (!frame) {
            ctx.fillStyle = '#facc15';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('Waiting for scenario data...', 20, 50);
            return;
        }

        // Title bar
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`CONDUCTOR'S SCORE`, 20, 30);

        // Metadata
        ctx.fillStyle = '#888';
        ctx.font = '12px Arial';
        ctx.fillText(
            `Frame ${frame.frameIndex} | ${frame.global?.key || 'C Major'} | ${frame.global?.tempo || 80} BPM | ${frame.global?.timeSignature || '4/4'}`,
            200, 30
        );

        // Stave count
        ctx.fillStyle = '#666';
        ctx.fillText(`${frame.staves?.length || 0} Staves`, canvasWidth - 80, 30);

        // Chord symbol
        if (showChordSymbols && frame.harmony) {
            ctx.fillStyle = '#facc15';
            ctx.font = 'bold 18px Georgia';
            ctx.fillText(frame.harmony.chord, canvasWidth - 100, 55);
        }

        // Render staves
        if (!frame.staves || frame.staves.length === 0) {
            ctx.fillStyle = '#555';
            ctx.font = 'italic 14px Arial';
            ctx.fillText('No staves generated - check orchestrator', 20, 80);
            return;
        }

        frame.staves.forEach((stave, idx) => {
            const y = 60 + idx * STAVE_HEIGHT;
            renderStave(ctx, stave, 100, y, canvasWidth - 120, showDynamics);
        });

        // Playback cursor
        if (isPlaying && frame.staves.length > 0) {
            const maxNotes = Math.max(...frame.staves.map(s => s.notes?.length || 1));
            const noteWidth = (canvasWidth - 220) / Math.max(maxNotes, 4);
            const cursorX = 120 + (currentBeat % 4) * noteWidth;

            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cursorX, 55);
            ctx.lineTo(cursorX, 55 + frame.staves.length * STAVE_HEIGHT);
            ctx.stroke();
        }

    }, [frame, showChordSymbols, showDynamics, isPlaying, currentBeat, canvasHeight, canvasWidth]);

    return (
        <motion.div
            className="bg-gray-950 rounded-xl border border-white/10 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="p-2 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-oxot-gold text-xs font-mono">🎼</span>
                    <span className="text-white text-sm font-bold">Conductor's Score</span>
                    <span className="text-xs text-blue-500 px-2 py-0.5 bg-blue-500/10 rounded">Canvas2D</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    {frame?.staves?.length && (
                        <span className="text-gray-400">{frame.staves.length} Staves</span>
                    )}
                    <span className="text-gray-500">
                        {frame?.speaker ? `Speaking: ${frame.speaker}` : 'Ready'}
                    </span>
                </div>
            </div>

            <div className="relative overflow-x-auto bg-[#0a0a0f]" style={{ minHeight: 300, maxHeight: 800 }}>
                <canvas
                    ref={canvasRef}
                    style={{ width: canvasWidth, height: canvasHeight }}
                />
            </div>

            {/* Legend */}
            <div className="p-2 border-t border-white/10 flex gap-4 text-[10px] text-gray-500">
                <span>🔴 Speaking</span>
                <span>🟢 Active</span>
                <span>⚫ Silent</span>
                <span className="ml-auto text-blue-500">♪ Canvas2D Rendering</span>
            </div>
        </motion.div>
    );
}

// ============================================================================
// STAVE RENDERING
// ============================================================================

function renderStave(
    ctx: CanvasRenderingContext2D,
    stave: ActorStaveData,
    x: number,
    y: number,
    width: number,
    showDynamics: boolean
) {
    const isActive = stave.isSpeaking || stave.activation > 0.3;
    const color = stave.isSpeaking ? NOTE_COLORS.speaking : (isActive ? NOTE_COLORS.active : NOTE_COLORS.silent);

    // Stave lines (5 lines)
    ctx.strokeStyle = isActive ? '#555' : '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        const lineY = y + 20 + i * 8;
        ctx.beginPath();
        ctx.moveTo(x, lineY);
        ctx.lineTo(x + width, lineY);
        ctx.stroke();
    }

    // Actor name
    ctx.fillStyle = stave.isSpeaking ? '#ef4444' : (isActive ? '#22c55e' : '#666');
    ctx.font = 'bold 11px Courier';
    ctx.fillText(stave.actorName?.substring(0, 12) || 'Unknown', x - 90, y + 35);

    // Instrument
    ctx.fillStyle = '#555';
    ctx.font = '9px Courier';
    ctx.fillText(stave.instrument || 'Piano', x - 90, y + 48);

    // Dynamic marking
    if (showDynamics) {
        const dyn = velocityToDynamic(stave.dynamic || 72);
        ctx.fillStyle = '#facc15';
        ctx.font = 'italic 14px Times';
        ctx.fillText(dyn, x + 10, y + 70);
    }

    // Notes
    if (stave.notes && stave.notes.length > 0) {
        const noteSpacing = Math.min(60, (width - 40) / stave.notes.length);

        stave.notes.forEach((note, idx) => {
            const noteX = x + 40 + idx * noteSpacing;
            const noteY = note.midiNote ? midiToY(note.midiNote, y) : (y + 40);

            // Notehead (filled oval)
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(noteX, noteY, 6, 4, -0.3, 0, Math.PI * 2);
            ctx.fill();

            // Stem
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            if (noteY < y + 40) {
                // Stem down for high notes
                ctx.moveTo(noteX - 5, noteY);
                ctx.lineTo(noteX - 5, noteY + 30);
            } else {
                // Stem up for low notes
                ctx.moveTo(noteX + 5, noteY);
                ctx.lineTo(noteX + 5, noteY - 30);
            }
            ctx.stroke();

            // Ledger lines if needed
            if (noteY < y + 20 || noteY > y + 52) {
                ctx.strokeStyle = '#555';
                ctx.lineWidth = 1;
                const ledgerY = noteY < y + 20 ? y + 12 : y + 60;
                ctx.beginPath();
                ctx.moveTo(noteX - 10, ledgerY);
                ctx.lineTo(noteX + 10, ledgerY);
                ctx.stroke();
            }
        });
    } else {
        // Whole rest for empty stave
        ctx.fillStyle = '#555';
        ctx.fillRect(x + width / 2 - 8, y + 28, 16, 6);
    }

    // Transformation indicator
    if (stave.leitmotif?.currentTransformation && stave.leitmotif.currentTransformation !== 'original') {
        ctx.fillStyle = '#8b5cf6';
        ctx.font = '8px Courier';
        ctx.fillText(`[${stave.leitmotif.currentTransformation}]`, x + width - 80, y + 70);
    }

    // Clef symbol (treble clef approximation)
    ctx.fillStyle = isActive ? '#888' : '#555';
    ctx.font = '32px serif';
    ctx.fillText('𝄞', x - 5, y + 50);
}
