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

    // Instrument Samplers
    private samplers: Map<string, Tone.Sampler> = new Map();
    private isSamplesLoaded: boolean = false;

    // Fallback Synths (for when samples fail or are missing)
    private fallbackSynths: Map<string, Tone.PolySynth> = new Map();

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

            // --- LOAD SAMPLES ---
            const instruments = [
                'violin', 'cello', 'bass',
                'trumpet', 'trombone', 'french_horn', 'tuba',
                'flute', 'clarinet', 'oboe', 'bassoon',
                'piano'
            ];

            const noteMap = {
                "C3": "C3.mp3", "E3": "E3.mp3", "G3": "G3.mp3", "A3": "A3.mp3",
                "C4": "C4.mp3", "E4": "E4.mp3", "G4": "G4.mp3", "A4": "A4.mp3",
                "C5": "C5.mp3", "E5": "E5.mp3", "G5": "G5.mp3"
            };

            const loadPromises = instruments.map(inst => {
                return new Promise<void>((resolve) => {
                    const sampler = new Tone.Sampler({
                        urls: noteMap,
                        baseUrl: `/audio/samples/${inst}/`,
                        onload: () => {
                            console.log(`[MPNSynthesizer] Loaded ${inst}`);
                            resolve();
                        },
                        onerror: (e) => {
                            console.warn(`[MPNSynthesizer] Failed to load ${inst}, using fallback`, e);
                            resolve(); // Resolve anyway to continue
                        }
                    });

                    // Route to panner based on family (simple lookup)
                    if (['violin', 'viola', 'cello', 'bass', 'contrabass'].includes(inst)) sampler.connect(stringsPan);
                    else if (['trumpet', 'trombone', 'french_horn', 'tuba'].includes(inst)) sampler.connect(brassPan);
                    else if (['flute', 'clarinet', 'oboe', 'bassoon'].includes(inst)) sampler.connect(woodwindPan);
                    else if (inst === 'piano') sampler.connect(padPan); // Piano center-ish
                    else sampler.connect(percPan);

                    this.samplers.set(inst, sampler);
                });
            });

            // Initialize Fallback Synths
            this.fallbackSynths.set('default', new Tone.PolySynth(Tone.Synth).connect(padPan));

            // Wait for samples but don't block forever
            await Promise.race([
                Promise.all(loadPromises),
                new Promise(r => setTimeout(r, 5000)) // 5s timeout
            ]);

            this.isSamplesLoaded = true;

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
            if (trauma > 0.8) {
                notes.push(note);
                const freq = Tone.Frequency(note).transpose(6).toNote();
                notes.push(freq); // Tritone
            } else if (trauma > 0.5) {
                notes.push(note);
            } else {
                notes.push(note);
            }
        });

        // 3. Trigger Instruments
        const duration = 2.0;
        if (notes.length > 0) {
            // Bass
            (this.samplers.get('contrabass') || this.samplers.get('cello'))?.triggerAttackRelease(notes[0], duration, now);

            // Strings (Chord)
            const strings = this.samplers.get('violin') || this.samplers.get('viola');
            strings?.triggerAttackRelease(notes.slice(1), duration, now);

            // Woodwinds (Color)
            if (entropy > 0.6) {
                const winds = this.samplers.get('flute') || this.samplers.get('clarinet');
                winds?.triggerAttackRelease(notes.slice(2), duration, now + 0.1);
            }

            // Brass (Power)
            if (trauma > 0.5) {
                const brass = this.samplers.get('trumpet') || this.samplers.get('trombone');
                brass?.triggerAttackRelease(notes.slice(0, 3), duration, now + 0.05);
            }

            // Pad (Atmosphere) - using Piano with high reverb/delay as 'pad' surrogate or fallback synth
            const pad = this.fallbackSynths.get('default');
            pad?.triggerAttackRelease(notes.slice(1), duration * 1.5, now);
        }

        // Noise burst
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
            let instrumentName = stave.instrument || stave.instrumentFamily || 'piano';
            // Normalize
            instrumentName = instrumentName.toLowerCase().replace(" ", "_");

            // Resolve Sampler
            let sampler = this.samplers.get(instrumentName);

            // Fallback mapping if exact instrument not found
            if (!sampler) {
                if (instrumentName.includes('violin') || instrumentName.includes('string')) sampler = this.samplers.get('violin');
                else if (instrumentName.includes('cello') || instrumentName.includes('bass')) sampler = this.samplers.get('cello');
                else if (instrumentName.includes('trumpet') || instrumentName.includes('brass')) sampler = this.samplers.get('trumpet');
                else if (instrumentName.includes('flute') || instrumentName.includes('wood')) sampler = this.samplers.get('flute');
                else if (instrumentName.includes('drum') || instrumentName.includes('percussion')) sampler = this.samplers.get('timpani'); // if available
                else sampler = this.samplers.get('piano');
            }

            // Ultimate fallback
            const synth = sampler || this.fallbackSynths.get('default');

            if (stave.notes && stave.notes.length > 0) {
                stave.notes.forEach((note: any) => {
                    if (synth) {
                        const time = now + (note.startBeat * beatDuration);
                        const duration = note.duration * beatDuration;
                        const velocity = Math.min(1, Math.max(0.1, note.velocity / 127));

                        synth.triggerAttackRelease(
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

    setVolume(volume: number): void {
        const db = volume > 0 ? 20 * Math.log10(volume) : -Infinity;
        Tone.Destination.volume.rampTo(Math.max(-60, db), 0.1);
    }

    playCrisisAlert(): void {
        const brass = this.samplers.get('trumpet') || this.fallbackSynths.get('default');
        if (!brass) return;

        const now = Tone.now();
        brass.triggerAttackRelease(["C5", "F#5"], 0.5, now);
        brass.triggerAttackRelease(["C5", "F#5"], 0.5, now + 0.3);
        brass.triggerAttackRelease(["C5", "F#5"], 0.5, now + 0.6);
    }

    /**
     * Play an external audio buffer (e.g., from AI generation)
     */
    async playAudioBuffer(arrayBuffer: ArrayBuffer, volume: number = 0): Promise<void> {
        if (!this.isInitialized) return;

        try {
            const context = Tone.getContext();
            const audioBuffer = await context.decodeAudioData(arrayBuffer);

            const player = new Tone.Player(audioBuffer).toDestination();
            player.volume.value = volume;
            player.start();

            // Dispose after playback
            player.onstop = () => {
                player.dispose();
            };
        } catch (e) {
            console.error('Failed to play AI audio buffer:', e);
        }
    }

    stopAll(): void {
        this.samplers.forEach(s => s.releaseAll());
        this.fallbackSynths.forEach(s => s.releaseAll());
    }

    dispose(): void {
        this.stopAll();
        this.samplers.forEach(s => s.dispose());
        this.samplers.clear();
        this.fallbackSynths.forEach(s => s.dispose());
        this.fallbackSynths.clear();
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
