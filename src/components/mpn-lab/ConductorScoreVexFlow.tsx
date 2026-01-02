'use client';

/**
 * Conductor's Score Display - VexFlow Edition
 * Professional music engraving using VexFlow library
 * Provides accurate note rendering, proper spacing, beaming, and accidentals
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { PsychometricScoreFrame, ActorStaveData, NoteEvent } from './score_types';

// VexFlow imports - using dynamic import for SSR compatibility
let Vex: typeof import('vexflow').Vex | null = null;

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
// NOTE CONVERSION
// ============================================================================

/**
 * Convert MIDI-style pitch (e.g., "C4", "F#5") to VexFlow format (e.g., "c/4", "f#/5")
 */
function pitchToVexFlow(pitch: string): string {
    const match = pitch.match(/^([A-G])(#|b)?(\d)$/);
    if (!match) return 'c/4';

    const letter = match[1].toLowerCase();
    const accidental = match[2] || '';
    const octave = match[3];

    return `${letter}${accidental}/${octave}`;
}

/**
 * Convert duration to VexFlow duration
 * Our system uses 0.25 = quarter, 0.5 = half, 1 = whole
 */
function durationToVexFlow(duration: number): string {
    if (duration >= 1) return 'w';      // whole
    if (duration >= 0.5) return 'h';    // half
    if (duration >= 0.25) return 'q';   // quarter
    if (duration >= 0.125) return '8';  // eighth
    return '16';                         // sixteenth
}

/**
 * Get accidental for VexFlow if present
 */
function getAccidental(pitch: string): string | null {
    const match = pitch.match(/^[A-G](#|b)/);
    if (!match) return null;
    return match[1] === '#' ? '#' : 'b';
}

/**
 * Convert velocity to dynamic marking
 */
function velocityToDynamic(velocity: number): string {
    if (velocity < 30) return 'ppp';
    if (velocity < 50) return 'pp';
    if (velocity < 65) return 'p';
    if (velocity < 85) return 'mf';
    if (velocity < 100) return 'f';
    if (velocity < 115) return 'ff';
    return 'fff';
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ConductorScoreVexFlow({
    frame,
    showChordSymbols = true,
    showDynamics = true,
    scrolling = true,
    isPlaying = false,
    currentBeat = 0
}: ConductorScoreProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [vexLoaded, setVexLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate dimensions based on stave count
    const staveCount = frame?.staves?.length || 1;
    const staveHeight = 100;
    const requiredHeight = staveCount * staveHeight + 120;
    const width = 800;

    // Load VexFlow dynamically (client-side only)
    useEffect(() => {
        import('vexflow').then((module) => {
            Vex = module.Vex;
            setVexLoaded(true);
        }).catch((err) => {
            console.error('Failed to load VexFlow:', err);
            setError('Failed to load music notation library');
        });
    }, []);

    // Render score when frame changes
    useEffect(() => {
        if (!vexLoaded || !Vex || !containerRef.current) return;

        try {
            // Clear previous render
            containerRef.current.innerHTML = '';

            const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, Annotation } = Vex.Flow;

            // Create SVG renderer
            const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
            renderer.resize(width, requiredHeight);
            const context = renderer.getContext();
            context.setFont('Arial', 10);

            // Background
            context.setFillStyle('#0a0a0f');
            context.fillRect(0, 0, width, requiredHeight);

            if (!frame || !frame.staves || frame.staves.length === 0) {
                // Draw placeholder text
                context.setFillStyle('#555');
                context.setFont('Arial', 14, 'italic');
                context.fillText('Awaiting score data...', 20, 60);
                return;
            }

            // Title bar
            context.setFillStyle('#facc15');
            context.setFont('Arial', 14, 'bold');
            context.fillText(`CONDUCTOR'S SCORE`, 20, 25);

            context.setFillStyle('#888');
            context.setFont('Arial', 11);
            context.fillText(
                `Frame ${frame.frameIndex} | ${frame.global.key} | ${frame.global.tempo} BPM | ${frame.global.timeSignature}`,
                200, 25
            );

            // Chord symbol (top right)
            if (showChordSymbols && frame.harmony) {
                context.setFillStyle('#facc15');
                context.setFont('Georgia', 16, 'bold');
                context.fillText(frame.harmony.chord, width - 100, 25);
            }

            // Render each actor's stave
            frame.staves.forEach((stave, index) => {
                const y = 50 + index * staveHeight;
                renderActorStave(context, stave, 80, y, width - 100, showDynamics, Vex!.Flow);
            });

            // Playback cursor
            if (isPlaying && frame.staves.length > 0) {
                const maxNotes = Math.max(...frame.staves.map(s => s.notes?.length || 1));
                const noteWidth = (width - 180) / maxNotes;
                const cursorX = 100 + (currentBeat % maxNotes) * noteWidth;

                context.setStrokeStyle('#facc15');
                context.setLineWidth(2);
                context.beginPath();
                context.moveTo(cursorX, 45);
                context.lineTo(cursorX, 45 + frame.staves.length * staveHeight);
                context.stroke();
            }

        } catch (err) {
            console.error('VexFlow render error:', err);
            setError('Error rendering score');
        }
    }, [frame, vexLoaded, showChordSymbols, showDynamics, isPlaying, currentBeat, requiredHeight]);

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
                    <span className="text-xs text-green-500 px-2 py-0.5 bg-green-500/10 rounded">VexFlow</span>
                </div>
                <div className="text-gray-500 text-xs">
                    {frame?.speaker ? `Speaking: ${frame.speaker}` : 'Ready'}
                </div>
            </div>

            <div
                className="relative overflow-x-auto bg-[#0a0a0f]"
                style={{ minHeight: 300, maxHeight: 600 }}
            >
                {error ? (
                    <div className="p-4 text-red-500">{error}</div>
                ) : !vexLoaded ? (
                    <div className="p-4 text-gray-500">Loading notation engine...</div>
                ) : (
                    <div ref={containerRef} style={{ width, minHeight: requiredHeight }} />
                )}
            </div>

            {/* Legend */}
            <div className="p-2 border-t border-white/10 flex gap-4 text-[10px] text-gray-500">
                <span>🔴 Speaking</span>
                <span>🟢 Active</span>
                <span>⚫ Silent</span>
                <span className="ml-auto text-green-500">♪ VexFlow Rendering</span>
            </div>
        </motion.div>
    );
}

// ============================================================================
// STAVE RENDERING
// ============================================================================

function renderActorStave(
    context: any,
    stave: ActorStaveData,
    x: number,
    y: number,
    width: number,
    showDynamics: boolean,
    Flow: any
) {
    const { Stave, StaveNote, Voice, Formatter, Accidental, Annotation, TextNote } = Flow;
    const isActive = stave.isSpeaking || stave.activation > 0.3;

    // Create the stave
    const vexStave = new Stave(x, y, width);
    vexStave.addClef('treble');

    // Color based on state
    vexStave.setStyle({
        strokeStyle: isActive ? '#facc15' : '#444',
        fillStyle: isActive ? '#facc15' : '#444'
    });

    vexStave.setContext(context).draw();

    // Actor name label
    context.setFillStyle(stave.isSpeaking ? '#ef4444' : (isActive ? '#22c55e' : '#666'));
    context.setFont('Courier', 10, 'bold');
    context.fillText(stave.actorName.substring(0, 14), x - 75, y + 30);

    // Instrument label
    context.setFillStyle('#555');
    context.setFont('Courier', 8);
    context.fillText(stave.instrument, x - 75, y + 42);

    // Dynamic marking
    if (showDynamics) {
        const dyn = velocityToDynamic(stave.dynamic);
        context.setFillStyle('#facc15');
        context.setFont('Times', 12, 'italic');
        context.fillText(dyn, x + 45, y + 75);
    }

    // Transformation indicator
    if (stave.leitmotif?.currentTransformation && stave.leitmotif.currentTransformation !== 'original') {
        context.setFillStyle('#8b5cf6');
        context.setFont('Courier', 8);
        context.fillText(`[${stave.leitmotif.currentTransformation}]`, x + width - 80, y + 75);
    }

    // Create notes
    if (stave.notes && stave.notes.length > 0) {
        const vexNotes = stave.notes.map((note: NoteEvent) => {
            const vexPitch = pitchToVexFlow(note.pitch);
            const vexDuration = durationToVexFlow(note.duration);

            const staveNote = new StaveNote({
                keys: [vexPitch],
                duration: vexDuration,
            });

            // Set color based on state
            staveNote.setStyle({
                fillStyle: stave.isSpeaking ? '#facc15' : '#22c55e',
                strokeStyle: stave.isSpeaking ? '#facc15' : '#22c55e'
            });

            // Add accidental if present
            const acc = getAccidental(note.pitch);
            if (acc) {
                staveNote.addModifier(new Accidental(acc));
            }

            return staveNote;
        });

        // Create voice and format
        const voice = new Voice({ num_beats: stave.notes.length, beat_value: 4 });
        voice.setStrict(false); // Allow flexible beat counts
        voice.addTickables(vexNotes);

        new Formatter().joinVoices([voice]).format([voice], width - 80);
        voice.draw(context, vexStave);
    } else if (!isActive) {
        // Draw rest for inactive actors
        const restNote = new StaveNote({
            keys: ['b/4'],
            duration: 'wr' // whole rest
        });
        restNote.setStyle({ fillStyle: '#555', strokeStyle: '#555' });

        const voice = new Voice({ num_beats: 4, beat_value: 4 });
        voice.setStrict(false);
        voice.addTickables([restNote]);

        new Formatter().joinVoices([voice]).format([voice], width - 80);
        voice.draw(context, vexStave);
    }
}
