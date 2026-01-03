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
// VexFlow 5.0 uses named exports directly
let VexFlowModule: typeof import('vexflow') | null = null;

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
    totalFrames?: number;
    currentFrameIndex?: number;
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
    currentBeat = 0,
    totalFrames = 1,
    currentFrameIndex = 0
}: ConductorScoreProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [vexLoaded, setVexLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate dimensions based on stave count
    const staveCount = frame?.staves?.length || 1;
    const staveHeight = 100;
    const requiredHeight = staveCount * staveHeight + 120;
    const width = 1200; // Wider canvas for more frames

    // Load VexFlow dynamically (client-side only)
    useEffect(() => {
        import('vexflow').then((module) => {
            VexFlowModule = module;
            setVexLoaded(true);
        }).catch((err) => {
            console.error('Failed to load VexFlow:', err);
            setError('Failed to load music notation library');
        });
    }, []);

    // Render score when frame changes
    useEffect(() => {
        if (!vexLoaded || !VexFlowModule || !containerRef.current) return;

        try {
            // Clear previous render
            containerRef.current.innerHTML = '';

            // VexFlow 5.0 uses direct named exports
            const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, Annotation } = VexFlowModule;

            // Create SVG renderer
            const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
            renderer.resize(width, requiredHeight);
            const context = renderer.getContext();
            context.setFont('Arial', 10);

            // Background - professional score paper color
            context.setFillStyle('#faf8f0'); // Cream/ivory like real sheet music
            context.fillRect(0, 0, width, requiredHeight);

            if (!frame || !frame.staves || frame.staves.length === 0) {
                // Draw placeholder text
                context.setFillStyle('#555');
                context.setFont('Arial', 14, 'italic');
                context.fillText('Awaiting score data...', 20, 60);
                return;
            }



            // Title bar - dark text on cream background
            context.setFillStyle('#1a1a1a');
            context.setFont('Georgia', 14, 'bold');
            context.fillText(`CONDUCTOR'S SCORE`, 20, 25);

            context.setFillStyle('#555');
            context.setFont('Georgia', 11);
            context.fillText(
                `Frame ${frame.frameIndex} | ${frame.global.key} | ${frame.global.tempo} BPM | ${frame.global.timeSignature}`,
                200, 25
            );

            // Chord symbol (top right)
            if (showChordSymbols && frame.harmony) {
                context.setFillStyle('#333');
                context.setFont('Georgia', 16, 'bold');
                context.fillText(frame.harmony.chord, width - 100, 25);
            }

            // Render each actor's stave
            frame.staves.forEach((stave, index) => {
                const y = 50 + index * staveHeight;
                renderActorStave(context, stave, 80, y, width - 100, showDynamics, VexFlowModule!);
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

    // Calculate frame progress
    const frameProgress = totalFrames > 0 ? (currentFrameIndex / totalFrames) * 100 : 0;

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

            {/* Frame Progress Timeline */}
            <div className="px-4 py-2 bg-[#0a0a0f] border-b border-white/5">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-gray-500 font-mono">FRAME TIMELINE</span>
                    <span className="text-[10px] text-oxot-gold font-mono">
                        {currentFrameIndex + 1} / {totalFrames}
                    </span>
                </div>
                <div className="relative h-4 bg-gray-900 rounded-full overflow-hidden border border-white/10">
                    {/* Dotted lines for each frame */}
                    <div className="absolute inset-0 flex">
                        {Array.from({ length: totalFrames }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 border-r border-dashed border-white/20 last:border-r-0"
                                style={{
                                    backgroundColor: i < currentFrameIndex ? 'rgba(250, 204, 21, 0.15)' : 'transparent'
                                }}
                            />
                        ))}
                    </div>
                    {/* Current frame indicator */}
                    <div
                        className="absolute top-0 bottom-0 w-1 bg-oxot-gold shadow-lg shadow-amber-500/50"
                        style={{ left: `${frameProgress}%`, transition: 'left 0.3s ease' }}
                    />
                    {/* Progress fill */}
                    <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-oxot-gold/30 to-oxot-gold/10"
                        style={{ width: `${frameProgress}%`, transition: 'width 0.3s ease' }}
                    />
                </div>
            </div>

            <div
                className="relative overflow-x-auto bg-[#faf8f0] border border-gray-300"
                style={{ minHeight: 350, maxHeight: 700 }}
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
    const { Stave, StaveNote, Voice, Formatter, Accidental, Annotation, TextNote, Beam } = Flow;
    const isActive = stave.isSpeaking || stave.activation > 0.3;

    // Create the stave with professional engraving style
    const vexStave = new Stave(x, y, width);
    vexStave.addClef('treble');

    // Professional black staff lines
    vexStave.setStyle({
        strokeStyle: '#1a1a1a',
        fillStyle: '#1a1a1a'
    });

    vexStave.setContext(context).draw();

    // Actor name label - professional typography
    context.setFillStyle(stave.isSpeaking ? '#b91c1c' : '#333');
    context.setFont('Georgia', 10, stave.isSpeaking ? 'bold' : 'normal');
    context.fillText(stave.actorName.substring(0, 14), x - 75, y + 30);

    // Instrument label
    context.setFillStyle('#666');
    context.setFont('Georgia', 8, 'italic');
    context.fillText(stave.instrument, x - 75, y + 42);

    // Dynamic marking - traditional italic style
    if (showDynamics) {
        const dyn = velocityToDynamic(stave.dynamic);
        context.setFillStyle('#333');
        context.setFont('Times', 14, 'bold italic');
        context.fillText(dyn, x + 45, y + 75);
    }

    // Transformation indicator
    if (stave.leitmotif?.currentTransformation && stave.leitmotif.currentTransformation !== 'original') {
        context.setFillStyle('#666');
        context.setFont('Georgia', 8, 'italic');
        context.fillText(`(${stave.leitmotif.currentTransformation})`, x + width - 80, y + 75);
    }

    // Generate notes to render - use actual notes or generate demo notes for active staves
    let notesToRender = stave.notes || [];

    // If no notes but actor is speaking/active, generate visual demo notes
    if (notesToRender.length === 0 && isActive) {
        // Generate demo notes based on leitmotif or default pattern
        const pitchClasses = stave.leitmotif?.pitchClasses || [0, 2, 4, 5, 7]; // C major scale
        const baseOctave = stave.leitmotif?.baseOctave || 4;
        const demoNotes: NoteEvent[] = [];

        // Create 4 notes for the measure
        for (let i = 0; i < 4; i++) {
            const pitch = pitchClasses[i % pitchClasses.length];
            const noteName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][pitch % 12];
            demoNotes.push({
                pitch: `${noteName}${baseOctave}`,
                midiNote: pitch + (baseOctave + 1) * 12,
                duration: 0.25, // quarter notes
                startBeat: i,
                velocity: stave.dynamic || 72,
                articulation: 'legato'
            });
        }
        notesToRender = demoNotes;
    }

    // Create notes
    if (notesToRender.length > 0) {
        const vexNotes: any[] = [];
        const beamableNotes: any[] = []; // Collect 8th/16th notes for beaming

        notesToRender.forEach((note: NoteEvent) => {
            const vexPitch = pitchToVexFlow(note.pitch);
            const vexDuration = durationToVexFlow(note.duration);

            const staveNote = new StaveNote({
                keys: [vexPitch],
                duration: vexDuration,
            });

            // Color notes differently for speaking actor
            const noteColor = stave.isSpeaking ? '#dc2626' : '#1a1a1a'; // Red for speaking, black for others
            staveNote.setStyle({
                fillStyle: noteColor,
                strokeStyle: noteColor
            });

            // Add accidental if present
            const acc = getAccidental(note.pitch);
            if (acc) {
                staveNote.addModifier(new Accidental(acc));
            }

            // Add articulation annotation
            if (note.articulation && note.articulation !== 'normal') {
                const artSymbol = getArticulationSymbol(note.articulation);
                if (artSymbol) {
                    const annotation = new Annotation(artSymbol);
                    annotation.setFont('Arial', 10);
                    annotation.setVerticalJustification(Annotation.VerticalJustify.TOP);
                    staveNote.addModifier(annotation);
                }
            }

            vexNotes.push(staveNote);

            // Track beamable notes (8th and 16th)
            if (vexDuration === '8' || vexDuration === '16' || vexDuration === '32') {
                beamableNotes.push(staveNote);
            }
        });

        // Create voice and format
        const voice = new Voice({ num_beats: 4, beat_value: 4 });
        voice.setStrict(false); // Allow flexible beat counts
        voice.addTickables(vexNotes);

        new Formatter().joinVoices([voice]).format([voice], width - 80);
        voice.draw(context, vexStave);

        // Apply beaming to groups of 8th/16th notes
        if (beamableNotes.length >= 2) {
            try {
                // Group beamable notes into groups of 2-4 for beaming
                const beamGroups = groupNotesForBeaming(beamableNotes);
                beamGroups.forEach(group => {
                    if (group.length >= 2) {
                        const beam = new Beam(group);
                        beam.setContext(context).draw();
                    }
                });
            } catch (e) {
                // Beaming can fail if notes don't align - silently skip
                console.debug('Beaming skipped:', e);
            }
        }
    } else {
        // Draw rest for completely inactive actors
        const restNote = new StaveNote({
            keys: ['b/4'],
            duration: 'wr' // whole rest
        });
        restNote.setStyle({ fillStyle: '#1a1a1a', strokeStyle: '#1a1a1a' });

        const voice = new Voice({ num_beats: 4, beat_value: 4 });
        voice.setStrict(false);
        voice.addTickables([restNote]);

        new Formatter().joinVoices([voice]).format([voice], width - 80);
        voice.draw(context, vexStave);
    }
}

/**
 * Get articulation symbol for display
 */
function getArticulationSymbol(articulation: string): string | null {
    const symbols: Record<string, string> = {
        'staccato': '•',
        'marcato': '^',
        'tenuto': '–',
        'legato': '⌒',
        'accent': '>',
        'fermata': '𝄐'
    };
    return symbols[articulation] || null;
}

/**
 * Group notes into beamable groups (2-4 notes per beam)
 */
function groupNotesForBeaming(notes: any[]): any[][] {
    const groups: any[][] = [];
    let currentGroup: any[] = [];

    for (let i = 0; i < notes.length; i++) {
        currentGroup.push(notes[i]);

        // Create beam groups of 2-4 notes
        if (currentGroup.length >= 4 || i === notes.length - 1) {
            if (currentGroup.length >= 2) {
                groups.push([...currentGroup]);
            }
            currentGroup = [];
        }
    }

    return groups;
}
