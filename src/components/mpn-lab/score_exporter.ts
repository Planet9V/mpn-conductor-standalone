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
