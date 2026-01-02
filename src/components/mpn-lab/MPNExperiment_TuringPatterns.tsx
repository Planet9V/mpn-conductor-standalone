'use client';

import React, { useRef, useEffect, useMemo } from 'react';

interface TuringPatternsProps {
    trauma: number;
    entropy: number;
    focusLayer: number;
}

// Gray-Scott Reaction-Diffusion parameters
// F (feed rate) and k (kill rate) determine pattern type:
// F=0.055, k=0.062 = spots
// F=0.03, k=0.063 = stripes  
// F=0.025, k=0.06 = spirals/chaos

export default function MPNExperiment_TuringPatterns({ trauma, entropy, focusLayer }: TuringPatternsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    // Grid size (reduced for performance)
    const width = 200;
    const height = 150;

    // Gray-Scott parameters modulated by data
    const params = useMemo(() => {
        // Trauma shifts from spots (stable) to stripes (warning) to spirals (chaos)
        const F = 0.055 - trauma * 0.03; // Feed rate
        const k = 0.062 + trauma * 0.003; // Kill rate
        const Du = 0.16; // Diffusion rate of U
        const Dv = 0.08 + entropy * 0.04; // V diffuses faster with entropy

        return { F, k, Du, Dv };
    }, [trauma, entropy]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initialize concentration grids
        let U = new Float32Array(width * height);
        let V = new Float32Array(width * height);
        let nextU = new Float32Array(width * height);
        let nextV = new Float32Array(width * height);

        // Initialize: U=1 everywhere, V=0 with some random seeds
        for (let i = 0; i < width * height; i++) {
            U[i] = 1;
            V[i] = 0;
        }

        // Seed V in center and random spots
        for (let i = 0; i < 10; i++) {
            const x = Math.floor(width * 0.3 + Math.random() * width * 0.4);
            const y = Math.floor(height * 0.3 + Math.random() * height * 0.4);
            for (let dx = -3; dx <= 3; dx++) {
                for (let dy = -3; dy <= 3; dy++) {
                    const idx = ((y + dy + height) % height) * width + ((x + dx + width) % width);
                    V[idx] = 1;
                    U[idx] = 0.5;
                }
            }
        }

        const { F, k, Du, Dv } = params;

        // Layer colors (for the 7-band effect)
        const layerColors = [
            [107, 114, 128], // gray
            [59, 130, 246],  // blue
            [34, 197, 94],   // green
            [239, 68, 68],   // red
            [236, 72, 153],  // pink
            [249, 115, 22],  // orange
            [168, 85, 247],  // purple
        ];

        function step() {
            // Reaction-diffusion iteration
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const i = y * width + x;

                    // Laplacian (9-point stencil)
                    let lapU = 0, lapV = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const ni = ((y + dy + height) % height) * width + ((x + dx + width) % width);
                            const weight = (dx === 0 && dy === 0) ? -1 : (dx === 0 || dy === 0) ? 0.2 : 0.05;
                            lapU += U[ni] * weight;
                            lapV += V[ni] * weight;
                        }
                    }

                    const u = U[i];
                    const v = V[i];
                    const uvv = u * v * v;

                    nextU[i] = u + Du * lapU - uvv + F * (1 - u);
                    nextV[i] = v + Dv * lapV + uvv - (k + F) * v;

                    // Clamp
                    nextU[i] = Math.max(0, Math.min(1, nextU[i]));
                    nextV[i] = Math.max(0, Math.min(1, nextV[i]));
                }
            }

            // Swap buffers
            [U, nextU] = [nextU, U];
            [V, nextV] = [nextV, V];
        }

        function render() {
            const imageData = ctx!.createImageData(width, height);

            for (let y = 0; y < height; y++) {
                // Determine which layer this y-band belongs to
                const layerIdx = Math.floor((y / height) * 7);
                const isActiveLayer = focusLayer === -1 || focusLayer === layerIdx;
                const baseColor = layerColors[layerIdx];

                for (let x = 0; x < width; x++) {
                    const i = y * width + x;
                    const pi = i * 4;

                    const v = V[i];
                    const intensity = isActiveLayer ? 1 : 0.3;

                    // Color based on V concentration
                    imageData.data[pi] = Math.floor(baseColor[0] * v * intensity);
                    imageData.data[pi + 1] = Math.floor(baseColor[1] * v * intensity);
                    imageData.data[pi + 2] = Math.floor(baseColor[2] * v * intensity);
                    imageData.data[pi + 3] = 255;
                }
            }

            ctx!.putImageData(imageData, 0, 0);
        }

        function animate() {
            // Run multiple steps per frame for faster evolution
            for (let s = 0; s < 5; s++) {
                step();
            }
            render();
            animationRef.current = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [params, focusLayer]);

    // Pattern type indicator
    const patternType = useMemo(() => {
        if (trauma < 0.3) return { name: 'Spots', desc: 'Stable isolated features' };
        if (trauma < 0.6) return { name: 'Stripes', desc: 'Linear wave propagation' };
        if (trauma < 0.8) return { name: 'Labyrinth', desc: 'Complex interdependencies' };
        return { name: 'Spirals', desc: 'Self-organizing chaos' };
    }, [trauma]);

    return (
        <div className="relative w-full h-full bg-gray-950/90 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
            {/* Title */}
            <div className="absolute top-4 left-4 z-10">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 7</div>
                <div className="text-lg font-bold text-white">Turing Patterns</div>
                <div className="text-xs text-gray-500">Morphogenic Field (Gray-Scott)</div>
            </div>

            {/* Pattern Type Indicator */}
            <div className="absolute top-4 right-4 z-10 text-right">
                <div className="text-[9px] font-mono text-gray-500 uppercase">Pattern</div>
                <div className={`text-lg font-bold ${trauma > 0.6 ? 'text-red-400' : 'text-cyan-400'}`}>
                    {patternType.name}
                </div>
                <div className="text-[8px] font-mono text-gray-600">{patternType.desc}</div>
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                width={200}
                height={150}
                className="w-full h-full object-cover rounded-lg"
                style={{ imageRendering: 'pixelated' }}
            />

            {/* Layer bands indicator */}
            <div className="absolute bottom-4 left-4 flex gap-1">
                {['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6'].map((name, i) => (
                    <div
                        key={i}
                        className={`text-[7px] font-mono px-1 py-0.5 rounded ${focusLayer === i || focusLayer === -1 ? 'opacity-100' : 'opacity-30'}`}
                        style={{ backgroundColor: `rgba(${[107, 59, 34, 239, 236, 249, 168][i]}, ${[114, 130, 197, 68, 72, 115, 85][i]}, ${[128, 246, 94, 68, 153, 22, 247][i]}, 0.3)` }}
                    >
                        {name}
                    </div>
                ))}
            </div>
        </div>
    );
}
