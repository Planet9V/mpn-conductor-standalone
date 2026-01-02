'use client';

import { useCallback, useRef, useEffect, useMemo } from 'react';
import * as Tone from 'tone';

// Musical constants
const NOTE_FREQUENCIES: { [key: string]: string } = {
    'C3': 'C3', 'D3': 'D3', 'E3': 'E3', 'F3': 'F3', 'G3': 'G3', 'A3': 'A3', 'B3': 'B3',
    'C4': 'C4', 'D4': 'D4', 'E4': 'E4', 'F4': 'F4', 'G4': 'G4', 'A4': 'A4', 'B4': 'B4',
    'C5': 'C5', 'D5': 'D5', 'E5': 'E5', 'F5': 'F5', 'G5': 'G5', 'A5': 'A5', 'B5': 'B5',
    'C6': 'C6', 'D6': 'D6', 'E6': 'E6'
};

// 7-Layer mapping to notes (Orchestral voicing)
const LAYER_NOTES = [
    ['C2', 'G2', 'C3'],      // L0 Catalog - Sub Bass
    ['E3', 'G3', 'B3'],      // L1 Equipment - Cello
    ['A3', 'C4', 'E4'],      // L2 SBOM - Viola
    ['F4', 'A4', 'C5'],      // L3 Threats - Clarinet
    ['G4', 'B4', 'D5'],      // L4 Psychology - Flute
    ['C5', 'E5', 'G5'],      // L5 Info Streams - Violins
    ['E5', 'G5', 'B5', 'D6'] // L6 Predictions - Ethereal Pad
];

interface MPNSynthesizerOptions {
    masterVolume?: number;
}

export class MPNSynthesizer {
    private isInitialized: boolean = false;
    private stringsSynth: Tone.PolySynth | null = null;
    private brassSynth: Tone.PolySynth | null = null;
    private woodwindSynth: Tone.PolySynth | null = null;
    private keyboardSynth: Tone.PolySynth | null = null;
    private bassSynth: Tone.MembraneSynth | null = null;
    private padSynth: Tone.PolySynth | null = null;
    private noiseSynth: Tone.NoiseSynth | null = null;

    // Effects Chain
    private reverb: Tone.Reverb | null = null;
    private chorus: Tone.Chorus | null = null;
    private distortion: Tone.Distortion | null = null;
    private delay: Tone.PingPongDelay | null = null;
    private masterLimit: Tone.Limiter | null = null;

    constructor(private options: MPNSynthesizerOptions = {}) {
        this.options = {
            masterVolume: -6, // Decibels
            ...options
        };
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            await Tone.start();
            console.log('Using Tone.js Audio Context');

            // --- Spatial & Effects Chain ---

            // Orchestral Seating Plan (Panning)
            const stringsPan = new Tone.Panner(-0.6).toDestination(); // Left
            const brassPan = new Tone.Panner(0.5).toDestination();  // Right
            const woodwindPan = new Tone.Panner(-0.2).toDestination(); // Center-Left
            const percPan = new Tone.Panner(0).toDestination();     // Center
            const padPan = new Tone.Panner(0).toDestination();      // Stereo (via Reverb/Delay mostly)

            // Reverb (Concert Hall)
            this.reverb = new Tone.Reverb({
                decay: 3.5,
                wet: 0.3,
                preDelay: 0.05
            }).toDestination();

            // Connect Panners to Reverb for 'Room Sound'
            stringsPan.connect(this.reverb);
            brassPan.connect(this.reverb);
            woodwindPan.connect(this.reverb);
            percPan.connect(this.reverb);
            padPan.connect(this.reverb);

            this.chorus = new Tone.Chorus({
                frequency: 4,
                delayTime: 2.5,
                depth: 0.5,
                wet: 0.3
            }).connect(this.reverb);

            this.delay = new Tone.PingPongDelay({
                delayTime: "8n",
                feedback: 0.2,
                wet: 0.2
            }).connect(padPan);

            this.distortion = new Tone.Distortion({
                distortion: 0.4,
                wet: 0.1
            }).connect(brassPan);

            this.masterLimit = new Tone.Limiter(-2).toDestination();

            // --- Instruments (High Fidelity) ---

            // 1. Strings (Bowed String Physical Model approx via FM)
            this.stringsSynth = new Tone.PolySynth(Tone.FMSynth, {
                harmonicity: 3.01,
                modulationIndex: 12,
                oscillator: { type: "sawtooth" },
                envelope: { attack: 0.5, decay: 1, sustain: 0.8, release: 1.2 },
                modulation: { type: "sine" },
                modulationEnvelope: { attack: 0.15, decay: 0.5, sustain: 0.5, release: 1.5 }
            }).connect(stringsPan);
            this.stringsSynth.volume.value = -10;

            // 2. Brass (Bright Sawtooth w/ Filter)
            this.brassSynth = new Tone.PolySynth(Tone.MonoSynth, {
                oscillator: { type: "sawtooth" },
                filter: { Q: 2, type: "lowpass", rolloff: -24 },
                envelope: { attack: 0.05, decay: 0.2, sustain: 0.6, release: 1 },
                filterEnvelope: { attack: 0.05, decay: 0.2, sustain: 0.6, release: 1, baseFrequency: 200, octaves: 4 }
            }).connect(this.distortion);
            this.brassSynth.volume.value = -8;

            // 3. Woodwinds (Pulse/Triangle Mix via AM)
            this.woodwindSynth = new Tone.PolySynth(Tone.AMSynth, {
                harmonicity: 2.5,
                oscillator: { type: "triangle" },
                envelope: { attack: 0.1, decay: 0.3, sustain: 0.8, release: 0.5 },
                modulation: { type: "square" },
                modulationEnvelope: { attack: 0.1, decay: 0.5, sustain: 0.2, release: 0.5 }
            }).connect(woodwindPan);
            this.woodwindSynth.volume.value = -12;

            // 4. Keyboard/Percussion (FM for Bell/Piano tones)
            this.keyboardSynth = new Tone.PolySynth(Tone.FMSynth, {
                harmonicity: 1,
                modulationIndex: 10,
                detune: 0,
                oscillator: { type: "sine" },
                envelope: { attack: 0.01, decay: 0.5, sustain: 0.1, release: 1.2 },
                modulation: { type: "square" },
                modulationEnvelope: { attack: 0.01, decay: 0.5, sustain: 0.1, release: 0.1 }
            }).connect(percPan);
            this.keyboardSynth.volume.value = -10;

            // 5. Deep Bass (L0-L1)
            this.bassSynth = new Tone.MembraneSynth({
                pitchDecay: 0.05,
                octaves: 4,
                oscillator: { type: "sine" },
                envelope: { attack: 0.01, decay: 0.4, sustain: 0.01, release: 1.4 }
            }).connect(percPan);
            this.bassSynth.volume.value = -6;

            // 6. Ethereal Pad (L6)
            this.padSynth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: "fatcustom", partials: [0.2, 1, 0, 0.5, 0.1], spread: 40, count: 3 },
                envelope: { attack: 2, decay: 1, sustain: 0.9, release: 3 }
            }).connect(padPan);
            this.padSynth.volume.value = -15;

            // 7. White Noise (Entropy)
            this.noiseSynth = new Tone.NoiseSynth({
                noise: { type: 'pink' },
                envelope: { attack: 0.5, decay: 2, sustain: 0, release: 2 }
            }).connect(this.reverb);
            this.noiseSynth.volume.value = -30;

            this.isInitialized = true;

            // Set initial volumes
            Tone.Destination.volume.value = this.options.masterVolume || -6;

        } catch (error) {
            console.error('Failed to initialize Tone.js:', error);
        }
    }

    /**
     * Play the Orchestral Manifold based on parameters
     */
    triggerOrchestra(
        trauma: number,
        entropy: number,
        focusLayer: number = -1
    ): void {
        if (!this.isInitialized) return;

        // 1. Affect Effects Parameters
        if (this.distortion && this.chorus && this.reverb) {
            this.distortion.distortion = Math.max(0, (trauma - 0.7) * 2);
            this.distortion.wet.value = Math.max(0, (trauma - 0.7));
            this.chorus.frequency.value = 2 + entropy * 10;
            this.reverb.wet.value = 0.3 + entropy * 0.4;
        }

        const now = Tone.now();

        // 2. Select Chord Voicing based on Layer & Trauma
        let notes: string[] = [];
        const layerIdx = focusLayer === -1 ? 4 : focusLayer;
        const baseNotes = LAYER_NOTES[Math.min(layerIdx, 6)];

        baseNotes.forEach(note => {
            // Apply music theory transformations based on trauma
            if (trauma > 0.8) {
                // Crisis: Add tritone or chromatic intervals
                notes.push(note);
                // Add dissonance
                const freq = Tone.Frequency(note).transpose(6).toNote();
                notes.push(freq);
            } else if (trauma > 0.5) {
                // Tension: Minor/Diminished
                notes.push(note);
            } else {
                notes.push(note);
            }
        });

        // 3. Trigger Instruments with new Synths
        const duration = 2.0;

        if (notes.length > 0) {
            // Bass gets the root
            this.bassSynth?.triggerAttackRelease(notes[0], duration, now);

            // Strings get the chords
            this.stringsSynth?.triggerAttackRelease(notes.slice(1), duration, now);

            // Woodwinds add color for high entropy
            if (entropy > 0.6) {
                this.woodwindSynth?.triggerAttackRelease(notes.slice(2), duration, now + 0.1);
            }

            // Brass mainly for high trauma/tension
            if (trauma > 0.5) {
                this.brassSynth?.triggerAttackRelease(notes.slice(0, 3), duration, now + 0.05);
            }

            // Pad is always there for atmosphere (L6)
            this.padSynth?.triggerAttackRelease(notes.slice(1), duration * 1.5, now);
        }

        // Noise burst for high entropy
        if (entropy > 0.6 && this.noiseSynth) {
            this.noiseSynth.triggerAttackRelease(duration, now);
            this.noiseSynth.volume.value = -30 + (entropy * 10);
        }
    }

    /**
     * Play specific Staves from the Conductor Score
     */
    playStaves(staves: any[], tempo: number): void {
        if (!this.isInitialized) return;
        const now = Tone.now();
        const beatDuration = 60 / tempo;

        staves.forEach(stave => {
            let instrument = stave.instrumentFamily || stave.instrument || 'keyboard';
            let synthToUse: Tone.PolySynth | null = this.keyboardSynth;

            // Normalize
            instrument = instrument.toLowerCase().replace(" ", "_");

            if (["french_horn", "trumpet", "trombone", "tuba"].includes(instrument)) {
                synthToUse = this.brassSynth;
            } else if (["oboe", "flute", "clarinet", "bass_clarinet", "piccolo", "bassoon"].includes(instrument)) {
                synthToUse = this.woodwindSynth;
            } else if (["viola", "violin", "cello", "double_bass", "strings"].includes(instrument)) {
                synthToUse = this.stringsSynth;
            } else if (["timpani", "percussion", "drums"].includes(instrument)) {
                synthToUse = this.keyboardSynth;
            } else if (["piano", "harpsichord", "organ"].includes(instrument)) {
                synthToUse = this.keyboardSynth;
            } else {
                switch (instrument) {
                    case "strings": synthToUse = this.stringsSynth; break;
                    case "brass": synthToUse = this.brassSynth; break;
                    case "woodwind": synthToUse = this.woodwindSynth; break;
                    case "percussion": synthToUse = this.keyboardSynth; break;
                    default: synthToUse = this.keyboardSynth;
                }
            }

            // Play notes
            if (stave.notes && stave.notes.length > 0) {
                stave.notes.forEach((note: any) => {
                    if (synthToUse) {
                        const time = now + (note.startBeat * beatDuration);
                        const duration = note.duration * beatDuration;
                        // Velocity 0-127 -> 0-1
                        const velocity = Math.min(1, Math.max(0.1, note.velocity / 127));

                        synthToUse.triggerAttackRelease(
                            note.pitch,
                            duration,
                            time,
                            velocity
                        );
                    }
                });
            }
        });
    }

    /**
     * Set master volume
     * @param volume 0 to 1
     */
    setVolume(volume: number): void {
        // Map 0-1 to Decibels (-60 to 0)
        // Simple log mapping
        const db = volume > 0 ? 20 * Math.log10(volume) : -Infinity;
        Tone.Destination.volume.rampTo(Math.max(-60, db), 0.1);
    }

    playCrisisAlert(): void {
        if (!this.brassSynth) return;

        const now = Tone.now();
        // Siren effect using synthesized interval
        this.brassSynth.triggerAttackRelease(["C5", "F#5"], 0.5, now);
        this.brassSynth.triggerAttackRelease(["C5", "F#5"], 0.5, now + 0.3);
        this.brassSynth.triggerAttackRelease(["C5", "F#5"], 0.5, now + 0.6);
    }

    stopAll(): void {
        this.stringsSynth?.releaseAll();
        this.brassSynth?.releaseAll();
        this.woodwindSynth?.releaseAll();
        this.keyboardSynth?.releaseAll();
        this.padSynth?.releaseAll();
    }

    dispose(): void {
        this.stopAll();
        this.stringsSynth?.dispose();
        this.brassSynth?.dispose();
        this.woodwindSynth?.dispose();
        this.keyboardSynth?.dispose();
        this.bassSynth?.dispose();
        this.padSynth?.dispose();
        this.reverb?.dispose();
        this.chorus?.dispose();
        this.isInitialized = false;
    }
}

// React Hook
export function useMPNSynthesizer() {
    const synthRef = useRef<MPNSynthesizer | null>(null);

    useEffect(() => {
        synthRef.current = new MPNSynthesizer();
        return () => {
            synthRef.current?.dispose();
        };
    }, []);

    const initialize = useCallback(async () => {
        await synthRef.current?.initialize();
    }, []);

    const playFullOrchestra = useCallback((trauma: number, entropy: number, focusLayer: number = -1) => {
        // Debounce slightly to prevent click-spamming artifacts
        if (Tone.context.state === 'suspended') Tone.start();
        synthRef.current?.triggerOrchestra(trauma, entropy, focusLayer);
    }, []);

    const playScore = useCallback((staves: any[], tempo: number) => {
        if (Tone.context.state === 'suspended') Tone.start();
        synthRef.current?.playStaves(staves, tempo);
    }, []);

    const playCrisisAlert = useCallback(() => {
        synthRef.current?.playCrisisAlert();
    }, []);

    const setVolume = useCallback((volume: number) => {
        synthRef.current?.setVolume(volume);
    }, []);

    const stopAll = useCallback(() => {
        synthRef.current?.stopAll();
    }, []);

    return useMemo(() => ({
        initialize,
        playFullOrchestra,
        playScore,
        playCrisisAlert,
        setVolume,
        stopAll,
    }), [initialize, playFullOrchestra, playScore, playCrisisAlert, setVolume, stopAll]);
}

export default MPNSynthesizer;
