/**
 * Score JSON Exporter
 * Exports psychometric scores to JSON, MIDI, and notation formats
 */

import type {
    PsychometricScore,
    PsychometricScoreFrame,
    ActorProfile,
    LeitmotifSpec,
    MIDIExportOptions,
    NotationExportOptions
} from './score_types';
import { ScoreOrchestrator, ScriptFrame, OrchestratorOutput } from './score_orchestrator';
import { ensureLeitmotif, clearLeitmotifRegistry } from './leitmotif_generator';

// ============================================================================
// SCORE GENERATOR
// ============================================================================

export interface GenerateScoreOptions {
    title: string;
    source: string;
    actors: ActorProfile[];
    frames: ScriptFrame[];
    traumaSequence?: number[];      // Per-frame trauma values
    entropySequence?: number[];     // Per-frame entropy values
}

/**
 * Generate a complete psychometric score from script frames
 */
export async function generateScore(options: GenerateScoreOptions): Promise<PsychometricScore> {
    const { title, source, actors, frames, traumaSequence, entropySequence } = options;

    // Reset and initialize
    clearLeitmotifRegistry();
    const orchestrator = new ScoreOrchestrator(actors);

    // Generate leitmotifs for all actors
    const leitmotifs: Record<string, LeitmotifSpec> = {};
    actors.forEach(actor => {
        const motif = ensureLeitmotif(actor);
        leitmotifs[actor.id] = motif as LeitmotifSpec;
    });

    // Process all frames
    const outputFrames: PsychometricScoreFrame[] = [];
    let totalTrauma = 0;
    let totalEntropy = 0;

    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const trauma = traumaSequence?.[i] ?? 0.3;
        const entropy = entropySequence?.[i] ?? 0.3;

        totalTrauma += trauma;
        totalEntropy += entropy;

        const output = await orchestrator.processFrame(frame, trauma, entropy);

        // Convert to PsychometricScoreFrame format
        const scoreFrame: PsychometricScoreFrame = {
            frameIndex: output.frameIndex,
            timestamp: output.timestamp,
            scriptLine: frame.text,
            speaker: frame.speaker,

            global: {
                tempo: output.global.tempo,
                timeSignature: output.global.timeSignature,
                key: output.global.key,
                mode: 'ionian', // TODO: extract from params
                dynamics: output.global.dynamics
            },

            staves: output.staves.map(s => ({
                actorId: s.actorId,
                actorName: s.actorName,
                instrument: s.instrument,
                instrumentFamily: s.musicParams.instrumentFamily || 'keyboard',
                leitmotif: s.leitmotif as LeitmotifSpec,
                notes: s.notes,
                timbre: s.musicParams.timbre || {
                    attack: 0.1, decay: 0.3, sustain: 0.7, release: 0.4,
                    vibrato: 0.3, detuning: 0, filterCutoff: 5000
                },
                dynamic: s.musicParams.dynamic || 80,
                articulation: s.musicParams.articulation || 'legato',
                isSpeaking: s.isSpeaking,
                activation: s.activation,
                psychometricState: {
                    trauma,
                    entropy,
                    rsi: { real: 0.33, symbolic: 0.33, imaginary: 0.34 }
                }
            })),

            harmony: output.harmony,

            graph: output.graph
        };

        outputFrames.push(scoreFrame);
    }

    // Calculate statistics
    const avgTrauma = totalTrauma / frames.length;
    const avgEntropy = totalEntropy / frames.length;

    // Find dominant key (most frequent)
    const keyCounts: Record<string, number> = {};
    outputFrames.forEach(f => {
        keyCounts[f.global.key] = (keyCounts[f.global.key] || 0) + 1;
    });
    const dominantKey = Object.entries(keyCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    return {
        id: `score_${Date.now()}`,
        title,
        source,
        generatedAt: new Date().toISOString(),
        version: '2.0.0',
        actors,
        leitmotifs,
        frames: outputFrames,
        statistics: {
            totalFrames: outputFrames.length,
            duration: outputFrames.length * 4000,
            averageTrauma: avgTrauma,
            averageEntropy: avgEntropy,
            dominantKey,
            dominantMode: dominantKey.includes('minor') ? 'minor' : 'major'
        }
    };
}

// ============================================================================
// JSON EXPORT
// ============================================================================

/**
 * Export score to JSON string
 */
export function exportToJSON(score: PsychometricScore, pretty: boolean = true): string {
    return JSON.stringify(score, null, pretty ? 2 : 0);
}

/**
 * Export score to downloadable blob
 */
export function exportToBlob(score: PsychometricScore): Blob {
    const json = exportToJSON(score);
    return new Blob([json], { type: 'application/json' });
}

/**
 * Trigger download of score JSON
 */
export function downloadScore(score: PsychometricScore, filename?: string): void {
    const blob = exportToBlob(score);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${score.title.replace(/\s+/g, '_')}_score.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================================================
// GRAPH-ONLY EXPORT
// ============================================================================

/**
 * Extract just the graph topology data
 */
export function extractGraphData(score: PsychometricScore): {
    nodes: Array<{ id: string; label: string; type: string }>;
    edges: Array<{ source: string; target: string; type: string; frames: number[] }>;
    timeline: Array<{ frame: number; activeEdges: string[] }>;
} {
    const allNodes = new Map<string, { id: string; label: string; type: string }>();
    const edgeMap = new Map<string, { source: string; target: string; type: string; frames: number[] }>();
    const timeline: Array<{ frame: number; activeEdges: string[] }> = [];

    score.frames.forEach((frame, i) => {
        const activeEdges: string[] = [];

        // Collect nodes
        frame.graph.nodes.forEach(n => {
            if (!allNodes.has(n.id)) {
                allNodes.set(n.id, { id: n.id, label: n.label, type: n.type });
            }
        });

        // Collect edges
        frame.graph.edges.forEach(e => {
            const key = `${e.source}-${e.target}-${e.type}`;
            if (!edgeMap.has(key)) {
                edgeMap.set(key, { source: e.source, target: e.target, type: e.type, frames: [] });
            }
            edgeMap.get(key)!.frames.push(i);
            activeEdges.push(key);
        });

        timeline.push({ frame: i, activeEdges });
    });

    return {
        nodes: Array.from(allNodes.values()),
        edges: Array.from(edgeMap.values()),
        timeline
    };
}

// ============================================================================
// MIDI EXPORT (Placeholder)
// ============================================================================

/**
 * Export to MIDI (requires @tonejs/midi)
 * Note: This is a placeholder - full implementation requires the midi library
 */
export function exportToMIDI(
    score: PsychometricScore,
    options: MIDIExportOptions = { tracksPerActor: true, includeTempoChanges: true, velocityScaling: 1 }
): ArrayBuffer {
    // Placeholder implementation
    // Full implementation would use @tonejs/midi
    console.warn('MIDI export not fully implemented. Install @tonejs/midi for full support.');

    const midiData: number[] = [
        // MIDI header (SMF type 1)
        0x4D, 0x54, 0x68, 0x64, // "MThd"
        0x00, 0x00, 0x00, 0x06, // Header length
        0x00, 0x01,             // Format type 1
        0x00, score.actors.length + 1, // Number of tracks
        0x01, 0xE0              // 480 ticks per quarter
    ];

    return new Uint8Array(midiData).buffer;
}

// ============================================================================
// NOTATION EXPORT (Placeholder)
// ============================================================================

/**
 * Export to MusicXML (placeholder)
 */
export function exportToMusicXML(
    score: PsychometricScore,
    options: NotationExportOptions = { format: 'musicxml', stavesPerPage: 4, showLyrics: true, showChordSymbols: true }
): string {
    // Placeholder - would generate actual MusicXML
    console.warn('MusicXML export not fully implemented.');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work>
    <work-title>${score.title}</work-title>
  </work>
  <part-list>
    ${score.actors.map((a, i) => `
    <score-part id="P${i + 1}">
      <part-name>${a.name}</part-name>
    </score-part>
    `).join('')}
  </part-list>
  <!-- Parts would contain actual notes here -->
</score-partwise>`;
}

// ============================================================================
// PDF EXPORT
// ============================================================================

export interface PDFExportOptions {
    title?: string;
    includeMetadata?: boolean;
    includeActorProfiles?: boolean;
    includeAnalysis?: boolean;
    framesPerPage?: number;
    pageSize?: 'a4' | 'letter';
    orientation?: 'portrait' | 'landscape';
}

/**
 * Export score to PDF document
 * Uses jsPDF to generate a professional score document
 */
export async function exportToPDF(
    score: PsychometricScore,
    options: PDFExportOptions = {}
): Promise<Blob> {
    const {
        title = score.title || 'Psychometric Score',
        includeMetadata = true,
        includeActorProfiles = true,
        includeAnalysis = true,
        framesPerPage = 8,
        pageSize = 'letter',
        orientation = 'landscape'
    } = options;

    // Dynamic import of jsPDF
    const { jsPDF } = await import('jspdf');

    const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;

    // Helper to add a new page
    const addNewPage = () => {
        doc.addPage();
        yPos = margin;
    };

    // ========== TITLE PAGE ==========
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), pageWidth / 2, 40, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Musical Psychometric Notation Score', pageWidth / 2, 55, { align: 'center' });

    doc.setFontSize(11);
    doc.text(`Source: ${score.source}`, pageWidth / 2, 70, { align: 'center' });
    doc.text(`Generated: ${new Date(score.generatedAt).toLocaleString()}`, pageWidth / 2, 78, { align: 'center' });

    // Score statistics box
    doc.setDrawColor(100);
    doc.setFillColor(245, 245, 240);
    doc.roundedRect(margin + 30, 90, pageWidth - margin * 2 - 60, 45, 3, 3, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SCORE STATISTICS', pageWidth / 2, 100, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    const stats = score.statistics;
    const statsText = [
        `Total Frames: ${stats.totalFrames}`,
        `Duration: ${Math.round(stats.duration / 1000)}s`,
        `Average Trauma: ${stats.averageTrauma.toFixed(2)}`,
        `Average Entropy: ${stats.averageEntropy.toFixed(2)}`,
        `Dominant Key: ${stats.dominantKey}`,
        `Mode: ${stats.dominantMode}`
    ];

    statsText.forEach((text, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = margin + 50 + col * 70;
        const y = 112 + row * 10;
        doc.text(text, x, y);
    });

    // ========== ACTOR PROFILES PAGE ==========
    if (includeActorProfiles && score.actors.length > 0) {
        addNewPage();

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('DRAMATIS PERSONAE', margin, yPos + 5);
        yPos += 15;

        score.actors.forEach((actor, idx) => {
            if (yPos > pageHeight - 40) {
                addNewPage();
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('DRAMATIS PERSONAE (continued)', margin, yPos + 5);
                yPos += 15;
            }

            // Actor box
            doc.setFillColor(250, 248, 240);
            doc.setDrawColor(180);
            doc.roundedRect(margin, yPos, pageWidth - margin * 2, 25, 2, 2, 'FD');

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(actor.name, margin + 5, yPos + 7);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            // DISC profile
            if (actor.disc) {
                const discText = `DISC: D${(actor.disc.D * 100).toFixed(0)} I${(actor.disc.I * 100).toFixed(0)} S${(actor.disc.S * 100).toFixed(0)} C${(actor.disc.C * 100).toFixed(0)}`;
                doc.text(discText, margin + 80, yPos + 7);
            }

            // Archetype
            if (actor.archetype) {
                doc.text(`Archetype: ${actor.archetype}`, margin + 5, yPos + 15);
            }

            // Dark Triad
            if (actor.darkTriad) {
                const dtText = `Dark Triad: M${(actor.darkTriad.machiavellianism * 100).toFixed(0)} N${(actor.darkTriad.narcissism * 100).toFixed(0)} P${(actor.darkTriad.psychopathy * 100).toFixed(0)}`;
                doc.text(dtText, margin + 80, yPos + 15);
            }

            // Biases
            if (actor.biases && actor.biases.length > 0) {
                doc.text(`Biases: ${actor.biases.slice(0, 3).join(', ')}`, margin + 5, yPos + 21);
            }

            yPos += 30;
        });
    }

    // ========== FRAME ANALYSIS PAGES ==========
    if (includeAnalysis && score.frames.length > 0) {
        addNewPage();

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('FRAME ANALYSIS', margin, yPos + 5);
        yPos += 15;

        let frameCount = 0;

        score.frames.forEach((frame, frameIdx) => {
            if (frameCount >= framesPerPage) {
                addNewPage();
                frameCount = 0;
            }

            if (yPos > pageHeight - 30) {
                addNewPage();
                frameCount = 0;
            }

            // Frame header
            doc.setFillColor(40, 40, 40);
            doc.setTextColor(255);
            doc.roundedRect(margin, yPos, pageWidth - margin * 2, 8, 1, 1, 'F');

            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text(`Frame ${frame.frameIndex}`, margin + 3, yPos + 5.5);

            if (frame.speaker) {
                doc.text(frame.speaker, margin + 35, yPos + 5.5);
            }

            doc.text(`${frame.global.key} | ${frame.global.tempo} BPM | ${frame.harmony?.chord || ''}`, pageWidth - margin - 60, yPos + 5.5);

            doc.setTextColor(0);
            yPos += 10;

            // Script line
            if (frame.scriptLine) {
                doc.setFontSize(8);
                doc.setFont('helvetica', 'italic');
                const lines = doc.splitTextToSize(`"${frame.scriptLine}"`, pageWidth - margin * 2 - 10);
                doc.text(lines.slice(0, 2), margin + 3, yPos + 4);
                yPos += lines.length * 4;
            }

            yPos += 5;
            frameCount++;
        });
    }

    // Footer on each page
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(128);
        doc.text(`MPN Score - ${title} - Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
        doc.text('Generated by MPN Conductor', pageWidth - margin, pageHeight - 8, { align: 'right' });
        doc.setTextColor(0);
    }

    return doc.output('blob');
}

/**
 * Export score to PDF and trigger download
 */
export async function downloadScorePDF(
    score: PsychometricScore,
    options: PDFExportOptions = {},
    filename?: string
): Promise<void> {
    const blob = await exportToPDF(score, options);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${score.title || 'score'}_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
