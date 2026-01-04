/**
 * Audio Exporter for MPN Conductor
 * 
 * CRITICAL: Score Preservation System
 * Exports Tone.js psychometric scores to high-quality MP3 format.
 * 
 * Purpose:
 * - Preserve original scores before system upgrades
 * - Share compositions with stakeholders
 * - Archive psychometric musical interpretations
 * 
 * Technical Architecture:
 * 1. Offline Rendering: Uses Tone.OfflineContext to render audio without realtime playback
 * 2. Frame Processing: Each PsychometricScoreFrame represents 4 beats of music
 * 3. MP3 Encoding: lamejs encoder creates high-quality compressed audio (192kbps)
 * 4. Stereo Output: Full stereo field preserved from Tone.js spatial positioning
 * 
 * Integration with MPN System:
 * - Reads PsychometricScoreFrame[] (psychometric states + musical events)
 * - Uses MPNSynthesizer for consistent audio generation
 * - Maintains all psychometric → musical parameter mappings
 * - Preserves leitmotifs, orchestration, and dynamic mixing
 * 
 * Quality Settings:
 * - Sample Rate: 44.1kHz (CD quality)
 * - Bit Rate: 192kbps (high-quality MP3)
 * - Channels: 2 (stereo)
 * 
 * Usage:
 * ```typescript
 * const mp3Blob = await exportScoreToMP3(scoreFrames, tempo);
 * downloadMP3(mp3Blob, 'hamlet_original_v3.0.mp3');
 * ```
 * 
 * @module audio_exporter
 * @requires tone - Audio synthesis and offline rendering
 * @requires lamejs - MP3 encoding
 */

import * as Tone from 'tone';
import lamejs from 'lamejs';
import { PsychometricScoreFrame } from '@/components/mpn-lab/score_types';
import { MPNSynthesizer } from '@/components/mpn-lab/MPNSynthesizer';

export interface ExportOptions {
    sampleRate?: number;
    bitRate?: number;
    filename?: string;
    includeMetadata?: boolean;
}

const DEFAULT_OPTIONS: ExportOptions = {
    sampleRate: 44100,
    bitRate: 192,
    filename: 'mpn_score.mp3',
    includeMetadata: true
};

/**
 * Export a psychometric score to MP3 format
 * 
 * CORE FUNCTIONALITY: Offline Audio Rendering & Compression
 * 
 * Process Flow:
 * 1. Calculate total duration from frame count and tempo
 * 2. Create Tone.OfflineContext for non-realtime rendering
 * 3. Initialize MPNSynthesizer in offline context
 * 4. Schedule all musical events from frames
 * 5. Render complete audio buffer
 * 6. Encode to MP3 using lamejs
 * 7. Return Blob for download
 * 
 * Performance:
 * - Faster than realtime (no playback delay)
 * - Memory efficient (processes in chunks)
 * - Progress updates via console.log
 * 
 * Psychometric Preservation:
 * - ALL 498 mappings applied during rendering
 * - Actor DISC profiles → instrument selection
 * - Trauma/entropy → rhythm & harmony
 * - RSI registers → harmonic choices
 * - Leitmotifs preserved with transformations
 * 
 * @param frames - Array of psychometric score frames (each = 4 beats)
 * @param tempo - Beats per minute (default: 80 BPM)
 * @param options - Export configuration (sample rate, bit rate, filename)
 * @returns Promise<Blob> - MP3 audio file as Blob
 * @throws Error if rendering or encoding fails
 * 
 * @example
 * // Export Hamlet score at 90 BPM
 * const mp3 = await exportScoreToMP3(hamletFrames, 90, {
 *   bitRate: 256,
 *   filename: 'hamlet_final.mp3'
 * });
 */
export async function exportScoreToMP3(
    frames: PsychometricScoreFrame[],
    tempo: number = 80,
    options: ExportOptions = {}
): Promise<Blob> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    console.log('[AudioExporter] Starting export...');
    console.log(`[AudioExporter] Frames: ${frames.length}, Tempo: ${tempo} BPM`);

    // Calculate total duration (each frame = 4 beats at given tempo)
    const beatsPerFrame = 4;
    const secondsPerBeat = 60 / tempo;
    const totalDuration = frames.length * beatsPerFrame * secondsPerBeat;

    console.log(`[AudioExporter] Total duration: ${totalDuration.toFixed(2)}s`);

    // Set up offline rendering context
    const offlineContext = new Tone.OfflineContext(
        2, // stereo
        totalDuration,
        opts.sampleRate!
    );

    // Initialize synthesizer in offline context
    Tone.setContext(offlineContext);
    const synth = new MPNSynthesizer();
    await synth.initialize();

    // Render each frame
    let currentTime = 0;
    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        console.log(`[AudioExporter] Rendering frame ${i + 1}/${frames.length}`);

        // Schedule notes for this frame
        synth.playScore(frame.staves, tempo, currentTime);

        // Advance time
        currentTime += beatsPerFrame * secondsPerBeat;
    }

    // Render the audio
    console.log('[AudioExporter] Rendering audio...');
    const buffer = await offlineContext.render();

    // Reset to default context
    Tone.setContext(new Tone.Context());

    // Convert AudioBuffer to MP3
    console.log('[AudioExporter] Encoding to MP3...');
    const mp3Blob = await encodeToMP3(buffer, opts);

    console.log(`[AudioExporter] Export complete! Size: ${(mp3Blob.size / 1024 / 1024).toFixed(2)}MB`);
    return mp3Blob;
}

/**
 * Encode AudioBuffer to MP3 using lamejs
 */
async function encodeToMP3(
    audioBuffer: AudioBuffer,
    options: ExportOptions
): Promise<Blob> {
    const channels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const bitRate = options.bitRate!;

    // Get audio data
    const leftChannel = audioBuffer.getChannelData(0);
    const rightChannel = channels > 1 ? audioBuffer.getChannelData(1) : leftChannel;

    // Initialize MP3 encoder
    const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, bitRate);
    const mp3Data: Int8Array[] = [];

    const sampleBlockSize = 1152; // Standard MP3 frame size

    for (let i = 0; i < leftChannel.length; i += sampleBlockSize) {
        // Convert float32 to int16
        const leftChunk = convertFloat32ToInt16(
            leftChannel.subarray(i, i + sampleBlockSize)
        );
        const rightChunk = convertFloat32ToInt16(
            rightChannel.subarray(i, i + sampleBlockSize)
        );

        // Encode chunk
        const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
        if (mp3buf.length > 0) {
            mp3Data.push(mp3buf);
        }
    }

    // Flush remaining data
    const mp3buf = mp3encoder.flush();
    if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
    }

    // Combine all MP3 chunks
    const totalLength = mp3Data.reduce((acc, chunk) => acc + chunk.length, 0);
    const mp3Buffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of mp3Data) {
        mp3Buffer.set(chunk, offset);
        offset += chunk.length;
    }

    return new Blob([mp3Buffer], { type: 'audio/mp3' });
}

/**
 * Convert Float32Array to Int16Array
 */
function convertFloat32ToInt16(buffer: Float32Array): Int16Array {
    const int16 = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        const s = Math.max(-1, Math.min(1, buffer[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16;
}

/**
 * Trigger download of MP3 file
 */
export function downloadMP3(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.mp3') ? filename : `${filename}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Export score with metadata
 */
export async function exportScoreWithMetadata(
    frames: PsychometricScoreFrame[],
    metadata: {
        title: string;
        author?: string;
        scenario?: string;
        generatedAt: string;
    },
    tempo: number = 80
): Promise<Blob> {
    const filename = `${metadata.title.toLowerCase().replace(/\s+/g, '_')}_${metadata.generatedAt.split('T')[0]}.mp3`;

    const mp3Blob = await exportScoreToMP3(frames, tempo, {
        filename,
        includeMetadata: true
    });

    // Note: ID3 tags would require additional library (node-id3)
    // For now, filename contains metadata

    return mp3Blob;
}
