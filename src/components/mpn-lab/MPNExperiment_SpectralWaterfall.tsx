'use client';

import React, { useRef, useEffect, useMemo } from 'react';

interface SpectralWaterfallProps {
    trauma: number;
    entropy: number;
    time: number;
}

// Cognitive bias channels (from RSCH-34)
const BIAS_CHANNELS = [
    { name: 'Authority', abbr: 'AUTH', color: [239, 68, 68] },    // red
    { name: 'Scarcity', abbr: 'SCAR', color: [250, 204, 21] },    // yellow
    { name: 'Social Proof', abbr: 'SOC', color: [34, 197, 94] },   // green
    { name: 'Anchoring', abbr: 'ANCH', color: [59, 130, 246] },    // blue
    { name: 'Confirmation', abbr: 'CONF', color: [168, 85, 247] }, // purple
    { name: 'Availability', abbr: 'AVAIL', color: [249, 115, 22] }, // orange
];

// Simple musical notes for visualization
const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const OCTAVES = [3, 4, 5];

export default function MPNExperiment_SpectralWaterfall({ trauma, entropy, time }: SpectralWaterfallProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const historyRef = useRef<Float32Array[]>([]);
    const timeRef = useRef<number>(0);

    // Convolution kernel width - modulated by entropy
    const kernelWidth = useMemo(() => 10 + Math.floor(entropy * 20), [entropy]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = 400;
        const height = 280;
        canvas.width = width;
        canvas.height = height;

        const numFreqBins = 32;
        const maxHistory = 100;

        // Initialize history
        if (historyRef.current.length === 0) {
            for (let i = 0; i < maxHistory; i++) {
                historyRef.current.push(new Float32Array(numFreqBins));
            }
        }

        function generateFrame(): Float32Array {
            const frame = new Float32Array(numFreqBins);

            // Each bias channel contributes to different frequency ranges
            BIAS_CHANNELS.forEach((bias, i) => {
                const baseFreq = Math.floor((i / BIAS_CHANNELS.length) * numFreqBins);
                const spread = 3 + Math.floor(entropy * 4);

                // Oscillating contribution based on time and trauma
                const amplitude = 0.3 + trauma * 0.5 + Math.sin(timeRef.current * (0.1 + i * 0.02)) * 0.2;

                for (let j = -spread; j <= spread; j++) {
                    const freqIdx = baseFreq + j;
                    if (freqIdx >= 0 && freqIdx < numFreqBins) {
                        const falloff = 1 - Math.abs(j) / (spread + 1);
                        frame[freqIdx] += amplitude * falloff + Math.random() * entropy * 0.2;
                    }
                }
            });

            // Normalize
            const max = Math.max(...frame);
            if (max > 0) {
                for (let i = 0; i < numFreqBins; i++) {
                    frame[i] = Math.min(1, frame[i] / max);
                }
            }

            return frame;
        }

        function render() {
            timeRef.current++;

            // Generate new frame and shift history
            const newFrame = generateFrame();
            historyRef.current.pop();
            historyRef.current.unshift(newFrame);

            // Clear canvas
            ctx!.fillStyle = '#000';
            ctx!.fillRect(0, 0, width, height);

            // Spectrogram area
            const spectrogramHeight = 180;
            const marginLeft = 50;
            const marginTop = 30;
            const spectrogramWidth = width - marginLeft - 20;

            // Draw title area
            ctx!.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx!.font = 'bold 10px monospace';
            ctx!.fillText('Frequency', 5, marginTop + spectrogramHeight / 2);

            ctx!.font = '10px monospace';
            ctx!.fillText('Time →', marginLeft + spectrogramWidth / 2 - 20, marginTop + spectrogramHeight + 15);

            // Draw spectrogram (waterfall)
            const cellWidth = spectrogramWidth / historyRef.current.length;
            const cellHeight = spectrogramHeight / numFreqBins;

            historyRef.current.forEach((frame, x) => {
                frame.forEach((value, y) => {
                    // Color based on channel contributions and value
                    const freqRange = y / numFreqBins;
                    const channelIdx = Math.min(BIAS_CHANNELS.length - 1, Math.floor(freqRange * BIAS_CHANNELS.length));
                    const color = BIAS_CHANNELS[channelIdx].color;

                    const intensity = Math.max(0, Math.min(1, value));

                    ctx!.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${intensity * 0.9})`;
                    ctx!.fillRect(
                        marginLeft + x * cellWidth,
                        marginTop + (numFreqBins - 1 - y) * cellHeight,
                        cellWidth + 1,
                        cellHeight + 1
                    );
                });
            });

            // Draw convolution kernel window
            const kernelX = marginLeft + Math.floor(historyRef.current.length * 0.2);
            const kernelWidthPx = kernelWidth * cellWidth;

            ctx!.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx!.lineWidth = 2;
            ctx!.setLineDash([4, 4]);
            ctx!.strokeRect(kernelX, marginTop, kernelWidthPx, spectrogramHeight);
            ctx!.setLineDash([]);

            ctx!.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx!.font = '8px monospace';
            ctx!.fillText('K(t-τ)', kernelX + 2, marginTop - 5);

            // Draw bias channel legend on left
            ctx!.font = '7px monospace';
            BIAS_CHANNELS.forEach((bias, i) => {
                const y = marginTop + (BIAS_CHANNELS.length - 1 - i + 0.5) * (spectrogramHeight / BIAS_CHANNELS.length);
                ctx!.fillStyle = `rgba(${bias.color[0]}, ${bias.color[1]}, ${bias.color[2]}, 0.8)`;
                ctx!.fillRect(2, y - 4, 4, 8);
                ctx!.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx!.fillText(bias.abbr, 8, y + 2);
            });

            // Draw output musical score at bottom
            const scoreY = marginTop + spectrogramHeight + 25;
            const scoreHeight = height - scoreY - 10;

            // Staff lines
            ctx!.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx!.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                const y = scoreY + i * (scoreHeight / 5);
                ctx!.beginPath();
                ctx!.moveTo(marginLeft, y);
                ctx!.lineTo(width - 20, y);
                ctx!.stroke();
            }

            // Treble clef symbol
            ctx!.fillStyle = 'rgba(196, 167, 103, 0.8)';
            ctx!.font = '20px serif';
            ctx!.fillText('𝄞', marginLeft - 20, scoreY + scoreHeight * 0.6);

            // Generate notes from current spectrum (simple mapping)
            const currentFrame = historyRef.current[0];
            let noteX = marginLeft + 10;
            const maxNotes = 8;
            let notesDrawn = 0;

            for (let i = 0; i < numFreqBins && notesDrawn < maxNotes; i += 4) {
                if (currentFrame[i] > 0.3) {
                    const noteIdx = i % NOTES.length;
                    const octave = OCTAVES[Math.floor(i / NOTES.length) % OCTAVES.length];
                    const noteY = scoreY + scoreHeight * (1 - (i / numFreqBins) * 0.8);

                    // Note head
                    ctx!.beginPath();
                    ctx!.ellipse(noteX, noteY, 5, 4, -0.3, 0, Math.PI * 2);
                    ctx!.fillStyle = `rgba(255, 255, 255, ${0.5 + currentFrame[i] * 0.5})`;
                    ctx!.fill();

                    // Note stem
                    ctx!.beginPath();
                    ctx!.moveTo(noteX + 4, noteY);
                    ctx!.lineTo(noteX + 4, noteY - 20);
                    ctx!.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx!.lineWidth = 1;
                    ctx!.stroke();

                    noteX += 30;
                    notesDrawn++;
                }
            }

            animationRef.current = requestAnimationFrame(render);
        }

        render();

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [trauma, entropy, kernelWidth]);

    return (
        <div className="relative w-full h-full bg-gray-950/90 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
            {/* Title */}
            <div className="absolute top-4 left-4 z-10">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 12</div>
                <div className="text-lg font-bold text-white">Spectral Waterfall</div>
                <div className="text-xs text-gray-500">Musical Score Emergence</div>
            </div>

            {/* Kernel info */}
            <div className="absolute top-4 right-4 z-10 text-right">
                <div className="text-[9px] font-mono text-gray-500 uppercase">Kernel Width</div>
                <div className="text-lg font-bold text-oxot-gold">
                    K({kernelWidth})
                </div>
                <div className="text-[8px] font-mono text-gray-600">
                    Convolution window
                </div>
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ imageRendering: 'auto' }}
            />

            {/* Formula */}
            <div className="absolute bottom-2 right-4 text-[7px] font-mono text-gray-600">
                M(t) = Σᵢ ∫ Bᵢ(t) · K(t-τ) dτ
            </div>
        </div>
    );
}
