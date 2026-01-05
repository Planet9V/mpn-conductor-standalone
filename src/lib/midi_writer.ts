
/**
 * Lightweight MIDI Writer for MPN Conductor
 * Generates Standard MIDI File (SMF) Type 1 binary data
 * No external dependencies required.
 */

import { NoteEvent } from "@/components/mpn-lab/score_types";

// Constants
const TICKS_PER_BEAT = 480;
const MICROSECONDS_PER_MINUTE = 60000000;

class MidiTrack {
    events: Uint8Array[] = [];
    currentTick: number = 0;

    addEvent(deltaTicks: number, data: number[]) {
        this.currentTick += deltaTicks;
        this.events.push(this.encodeVariableLengthQuantity(deltaTicks));
        this.events.push(new Uint8Array(data));
    }

    addNoteOn(deltaTicks: number, channel: number, note: number, velocity: number) {
        this.addEvent(deltaTicks, [0x90 | channel, note, velocity]);
    }

    addNoteOff(deltaTicks: number, channel: number, note: number) {
        this.addEvent(deltaTicks, [0x80 | channel, note, 0]); // Note off (or velocity 0)
    }

    addTempo(deltaTicks: number, bpm: number) {
        const microsecondsPerQuarter = Math.round(MICROSECONDS_PER_MINUTE / bpm);
        this.addEvent(deltaTicks, [
            0xFF, 0x51, 0x03,
            (microsecondsPerQuarter >> 16) & 0xFF,
            (microsecondsPerQuarter >> 8) & 0xFF,
            microsecondsPerQuarter & 0xFF
        ]);
    }

    addTrackName(deltaTicks: number, name: string) {
        const encoded = new TextEncoder().encode(name);
        this.addEvent(deltaTicks, [0xFF, 0x03, encoded.length, ...encoded]);
    }

    addEndOfTrack(deltaTicks: number) {
        this.addEvent(deltaTicks, [0xFF, 0x2F, 0x00]);
    }

    private encodeVariableLengthQuantity(value: number): Uint8Array {
        const bytes = [];
        let buffer = value & 0x7F;

        while ((value >>= 7) > 0) {
            buffer <<= 8;
            buffer |= 0x80;
            buffer += (value & 0x7F);
        }

        while (true) {
            bytes.push(buffer & 0xFF);
            if (buffer & 0x80) buffer >>= 8;
            else break;
        }
        return new Uint8Array(bytes);
    }

    toBytes(): Uint8Array {
        const size = this.events.reduce((acc, curr) => acc + curr.length, 0);
        const buffer = new Uint8Array(8 + size);

        // MTrk chunk header
        buffer.set([0x4D, 0x54, 0x72, 0x6B], 0); // "MTrk"

        // chunk length
        buffer[4] = (size >> 24) & 0xFF;
        buffer[5] = (size >> 16) & 0xFF;
        buffer[6] = (size >> 8) & 0xFF;
        buffer[7] = size & 0xFF;

        let offset = 8;
        for (const event of this.events) {
            buffer.set(event, offset);
            offset += event.length;
        }

        return buffer;
    }
}

/**
 * Convert scale-based note string ("C4", "Bb5") to MIDI number
 */
export function noteToMidi(noteName: string): number {
    const NOTE_TO_OFFSET: Record<string, number> = {
        'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
        'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8,
        'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };

    const match = noteName.match(/^([A-G][b#]?)(\d+)$/);
    if (!match) return 60; // Default C4

    const pitch = match[1];
    const octave = parseInt(match[2]);
    const offset = NOTE_TO_OFFSET[pitch] ?? 0;

    return (octave + 1) * 12 + offset;
}

export class MidiWriter {
    tracks: MidiTrack[] = [];

    constructor() {
        // Track 0 is usually tempo map / meta track
        this.tracks.push(new MidiTrack());
    }

    addTrack(name: string): MidiTrack {
        const track = new MidiTrack();
        track.addTrackName(0, name);
        this.tracks.push(track);
        return track;
    }

    setTempo(bpm: number) {
        this.tracks[0].addTempo(0, bpm);
    }

    toBytes(): Uint8Array {
        const trackBuffers = this.tracks.map(t => t.toBytes());
        const totalSize = 14 + trackBuffers.reduce((acc, curr) => acc + curr.length, 0);
        const buffer = new Uint8Array(totalSize);

        // Header Chunk
        buffer.set([0x4D, 0x54, 0x68, 0x64], 0); // "MThd"
        buffer.set([0x00, 0x00, 0x00, 0x06], 4); // Header length 6
        buffer.set([0x00, 0x01], 8); // Format 1
        buffer.set([(this.tracks.length >> 8) & 0xFF, this.tracks.length & 0xFF], 10); // Track count
        buffer.set([(TICKS_PER_BEAT >> 8) & 0xFF, TICKS_PER_BEAT & 0xFF], 12); // Ticks per beat

        let offset = 14;
        for (const trackBuffer of trackBuffers) {
            buffer.set(trackBuffer, offset);
            offset += trackBuffer.length;
        }

        return buffer;
    }
}
