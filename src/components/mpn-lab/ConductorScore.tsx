'use client';

/**
 * Conductor's Score Display
 * Multi-stave musical notation visualization using VexFlow
 * Shows each actor on their own stave, synchronized with script playback
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
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
// NOTE MAPPING
// ============================================================================

const NOTE_POSITIONS: Record<string, number> = {
    'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6
};

function parseNote(pitch: string): { letter: string; octave: number; accidental: string } {
    const match = pitch.match(/^([A-G])(#|b)?(\d)$/);
    if (!match) return { letter: 'C', octave: 4, accidental: '' };
    return {
        letter: match[1],
        octave: parseInt(match[3]),
        accidental: match[2] || ''
    };
}

function noteToY(pitch: string, staveTop: number): number {
    const { letter, octave } = parseNote(pitch);
    const baseOctave = 4;
    const octaveOffset = (octave - baseOctave) * 35;
    const noteOffset = NOTE_POSITIONS[letter] * 5;
    return staveTop + 35 - noteOffset - octaveOffset;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ConductorScore({
    frame,
    showChordSymbols = true,
    showDynamics = true,
    scrolling = true,
    isPlaying = false,
    currentBeat = 0
}: ConductorScoreProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

    // Calculate required height based on number of staves
    const staveCount = frame?.staves?.length || 1;
    const staveHeight = 80;
    const requiredHeight = staveCount * staveHeight + 100;

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!frame) {
            // No frame - draw empty staves
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                drawEmptyStave(ctx, 60, 60 + i * staveHeight, canvas.width - 80);
            }
            return;
        }

        // Draw frame
        const staves = frame.staves || [];

        // Title bar
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 14px "IBM Plex Mono", monospace';
        ctx.fillText(`CONDUCTOR'S SCORE`, 20, 25);

        ctx.fillStyle = '#888';
        ctx.font = '12px "IBM Plex Mono", monospace';
        ctx.fillText(`Frame ${frame.frameIndex} | ${frame.global.key} | ${frame.global.tempo} BPM | ${frame.global.timeSignature}`, 200, 25);

        // Chord symbol
        if (showChordSymbols && frame.harmony) {
            ctx.fillStyle = '#facc15';
            ctx.font = 'bold 16px serif';
            ctx.fillText(frame.harmony.chord, canvas.width - 100, 25);
        }

        // Draw each actor stave
        staves.forEach((stave, index) => {
            const y = 50 + index * staveHeight;
            drawActorStave(ctx, stave, 60, y, canvas.width - 80, showDynamics);
        });

        // Environment stave (if present)
        if (frame.environment) {
            const y = 50 + staves.length * staveHeight;
            drawEnvironmentStave(ctx, frame.environment, 60, y, canvas.width - 80);
        }

        // Draw playback cursor if playing
        if (isPlaying && staves.length > 0) {
            const maxNotes = Math.max(...staves.map(s => s.notes?.length || 0));
            if (maxNotes > 0) {
                const noteWidth = (canvas.width - 140) / maxNotes;
                const cursorX = 60 + (currentBeat % maxNotes) * noteWidth;

                ctx.strokeStyle = '#facc15';
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.7;
                ctx.beginPath();
                ctx.moveTo(cursorX, 40);
                ctx.lineTo(cursorX, 50 + staves.length * staveHeight);
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }
        }

    }, [frame, showChordSymbols, showDynamics, isPlaying, currentBeat]);

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
                </div>
                <div className="text-gray-500 text-xs">
                    {frame?.speaker ? `Speaking: ${frame.speaker}` : 'Ready'}
                </div>
            </div>

            <div className="relative overflow-x-auto" style={{ maxHeight: 500 }}>
                <canvas
                    ref={canvasRef}
                    width={dimensions.width}
                    height={Math.max(requiredHeight, 300)}
                    className="w-full"
                />
            </div>

            {/* Legend */}
            <div className="p-2 border-t border-white/10 flex gap-4 text-[10px] text-gray-500">
                <span>🔴 Speaking</span>
                <span>🟢 Active</span>
                <span>⚫ Silent</span>
            </div>
        </motion.div>
    );
}

// ============================================================================
// DRAWING HELPERS
// ============================================================================

function drawEmptyStave(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // 5 lines
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y + i * 7);
        ctx.lineTo(x + width, y + i * 7);
        ctx.stroke();
    }

    // Clef placeholder
    ctx.fillStyle = '#555';
    ctx.font = '24px serif';
    ctx.fillText('𝄞', x + 5, y + 22);

    // Bar line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 28);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + width, y);
    ctx.lineTo(x + width, y + 28);
    ctx.stroke();
}

function drawActorStave(
    ctx: CanvasRenderingContext2D,
    stave: ActorStaveData,
    x: number,
    y: number,
    width: number,
    showDynamics: boolean
) {
    const isActive = stave.isSpeaking || stave.activation > 0.3;

    // Stave lines
    ctx.strokeStyle = isActive ? '#facc15' : '#444';
    ctx.lineWidth = isActive ? 1.5 : 1;

    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y + i * 7);
        ctx.lineTo(x + width, y + i * 7);
        ctx.stroke();
    }

    // Actor name
    ctx.fillStyle = stave.isSpeaking ? '#ef4444' : (isActive ? '#22c55e' : '#666');
    ctx.font = 'bold 11px "IBM Plex Mono", monospace';
    ctx.fillText(stave.actorName.substring(0, 12), x - 55, y + 17);

    // Instrument
    ctx.fillStyle = '#555';
    ctx.font = '9px "IBM Plex Mono", monospace';
    ctx.fillText(stave.instrument, x - 55, y + 28);

    // Clef
    ctx.fillStyle = isActive ? '#fff' : '#666';
    ctx.font = '22px serif';
    ctx.fillText('𝄞', x + 5, y + 20);

    // Dynamic marking
    if (showDynamics) {
        ctx.fillStyle = '#facc15';
        ctx.font = 'italic 12px serif';
        const dynLabel = velocityToDynamic(stave.dynamic);
        ctx.fillText(dynLabel, x + 35, y + 45);
    }

    // Notes
    if (stave.notes && stave.notes.length > 0) {
        const noteWidth = (width - 80) / Math.max(stave.notes.length, 1);

        stave.notes.forEach((note, i) => {
            const noteX = x + 60 + i * noteWidth;
            const noteY = noteToY(note.pitch, y);

            // Note head
            ctx.fillStyle = stave.isSpeaking ? '#facc15' : '#22c55e';
            ctx.beginPath();
            ctx.ellipse(noteX, noteY, 5, 4, Math.PI / 6, 0, Math.PI * 2);
            ctx.fill();

            // Stem
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            if (noteY > y + 14) {
                ctx.moveTo(noteX + 4, noteY);
                ctx.lineTo(noteX + 4, noteY - 25);
            } else {
                ctx.moveTo(noteX - 4, noteY);
                ctx.lineTo(noteX - 4, noteY + 25);
            }
            ctx.stroke();

            // Ledger lines if needed
            if (noteY < y - 3 || noteY > y + 31) {
                ctx.strokeStyle = '#666';
                ctx.lineWidth = 1;
                const ledgerY = noteY < y ? y - 7 : y + 35;
                ctx.beginPath();
                ctx.moveTo(noteX - 8, ledgerY);
                ctx.lineTo(noteX + 8, ledgerY);
                ctx.stroke();
            }
        });
    } else if (!isActive) {
        // Rest symbol
        ctx.fillStyle = '#555';
        ctx.font = '20px serif';
        ctx.fillText('𝄽', x + width / 2, y + 18);
    }

    // Transformation indicator
    if (stave.leitmotif?.currentTransformation && stave.leitmotif.currentTransformation !== 'original') {
        ctx.fillStyle = '#8b5cf6';
        ctx.font = '9px "IBM Plex Mono", monospace';
        ctx.fillText(`[${stave.leitmotif.currentTransformation}]`, x + width - 80, y + 45);
    }

    // Bar lines
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 28);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + width, y);
    ctx.lineTo(x + width, y + 28);
    ctx.stroke();
}

function drawEnvironmentStave(
    ctx: CanvasRenderingContext2D,
    env: { type: string; instrument: string; mood: string },
    x: number,
    y: number,
    width: number
) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // Single line for percussion
    ctx.beginPath();
    ctx.moveTo(x, y + 14);
    ctx.lineTo(x + width, y + 14);
    ctx.stroke();

    // Label
    ctx.fillStyle = '#666';
    ctx.font = 'bold 10px "IBM Plex Mono", monospace';
    ctx.fillText('STAGE', x - 50, y + 17);

    ctx.font = '9px "IBM Plex Mono", monospace';
    ctx.fillText(env.mood, x + 30, y + 17);
}

function velocityToDynamic(velocity: number): string {
    if (velocity < 30) return 'ppp';
    if (velocity < 50) return 'pp';
    if (velocity < 65) return 'p';
    if (velocity < 85) return 'mf';
    if (velocity < 100) return 'f';
    if (velocity < 115) return 'ff';
    return 'fff';
}
