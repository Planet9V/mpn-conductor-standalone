'use client';

import React, { useRef, useEffect, useMemo } from 'react';

interface NeuralPlasmaProps {
    trauma: number;
    entropy: number;
    focusLayer: number;
}

export default function MPNExperiment_NeuralPlasma({ trauma, entropy, focusLayer }: NeuralPlasmaProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    // Simplified fluid parameters from data
    const fluidParams = useMemo(() => ({
        viscosity: 0.001 + (1 - trauma) * 0.01, // Less viscous with trauma (more turbulent)
        diffusion: 0.0001 + entropy * 0.001,
        heat: trauma * 2, // Trauma = heat source
    }), [trauma, entropy]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = 160;
        const height = 120;
        canvas.width = width;
        canvas.height = height;

        // Fluid state: velocity (vx, vy) and density fields
        const N = width;
        const M = height;
        const size = N * M;

        let density = new Float32Array(size);
        let densityPrev = new Float32Array(size);
        let vx = new Float32Array(size);
        let vy = new Float32Array(size);
        let vxPrev = new Float32Array(size);
        let vyPrev = new Float32Array(size);

        // Layer colors for density visualization
        const layerColors = [
            [107, 114, 128], // gray L0
            [59, 130, 246],  // blue L1
            [34, 197, 94],   // green L2
            [239, 68, 68],   // red L3
            [236, 72, 153],  // pink L4
            [249, 115, 22],  // orange L5
            [168, 85, 247],  // purple L6
        ];

        function IX(x: number, y: number): number {
            return Math.max(0, Math.min(x, N - 1)) + Math.max(0, Math.min(y, M - 1)) * N;
        }

        function addSource(x: Float32Array, s: Float32Array, dt: number) {
            for (let i = 0; i < size; i++) {
                x[i] += dt * s[i];
            }
        }

        function diffuse(x: Float32Array, x0: Float32Array, diff: number, dt: number) {
            const a = dt * diff * N * M;
            for (let k = 0; k < 4; k++) {
                for (let j = 1; j < M - 1; j++) {
                    for (let i = 1; i < N - 1; i++) {
                        x[IX(i, j)] = (x0[IX(i, j)] + a * (
                            x[IX(i - 1, j)] + x[IX(i + 1, j)] +
                            x[IX(i, j - 1)] + x[IX(i, j + 1)]
                        )) / (1 + 4 * a);
                    }
                }
            }
        }

        function advect(d: Float32Array, d0: Float32Array, u: Float32Array, v: Float32Array, dt: number) {
            const dt0 = dt * N;
            for (let j = 1; j < M - 1; j++) {
                for (let i = 1; i < N - 1; i++) {
                    let x = i - dt0 * u[IX(i, j)];
                    let y = j - dt0 * v[IX(i, j)];

                    x = Math.max(0.5, Math.min(N - 1.5, x));
                    y = Math.max(0.5, Math.min(M - 1.5, y));

                    const i0 = Math.floor(x);
                    const j0 = Math.floor(y);
                    const s1 = x - i0;
                    const s0 = 1 - s1;
                    const t1 = y - j0;
                    const t0 = 1 - t1;

                    d[IX(i, j)] = s0 * (t0 * d0[IX(i0, j0)] + t1 * d0[IX(i0, j0 + 1)]) +
                        s1 * (t0 * d0[IX(i0 + 1, j0)] + t1 * d0[IX(i0 + 1, j0 + 1)]);
                }
            }
        }

        function project(u: Float32Array, v: Float32Array, p: Float32Array, div: Float32Array) {
            const h = 1.0 / N;
            for (let j = 1; j < M - 1; j++) {
                for (let i = 1; i < N - 1; i++) {
                    div[IX(i, j)] = -0.5 * h * (
                        u[IX(i + 1, j)] - u[IX(i - 1, j)] +
                        v[IX(i, j + 1)] - v[IX(i, j - 1)]
                    );
                    p[IX(i, j)] = 0;
                }
            }

            for (let k = 0; k < 4; k++) {
                for (let j = 1; j < M - 1; j++) {
                    for (let i = 1; i < N - 1; i++) {
                        p[IX(i, j)] = (div[IX(i, j)] +
                            p[IX(i - 1, j)] + p[IX(i + 1, j)] +
                            p[IX(i, j - 1)] + p[IX(i, j + 1)]) / 4;
                    }
                }
            }

            for (let j = 1; j < M - 1; j++) {
                for (let i = 1; i < N - 1; i++) {
                    u[IX(i, j)] -= 0.5 * (p[IX(i + 1, j)] - p[IX(i - 1, j)]) / h;
                    v[IX(i, j)] -= 0.5 * (p[IX(i, j + 1)] - p[IX(i, j - 1)]) / h;
                }
            }
        }

        let time = 0;
        const dt = 0.1;

        function step() {
            time += dt;
            const { viscosity, diffusion, heat } = fluidParams;

            // Add heat sources based on trauma (creates convection)
            for (let j = 1; j < M - 1; j++) {
                const layerIdx = Math.floor((j / M) * 7);
                if (focusLayer !== -1 && focusLayer !== layerIdx) continue;

                for (let i = 1; i < N - 1; i++) {
                    // Heat sources at random positions, modulated by trauma
                    if (Math.random() < 0.001 * heat) {
                        densityPrev[IX(i, j)] = 5 + heat * 10;
                        vyPrev[IX(i, j)] = -heat * 2; // Upward plume
                    }

                    // Layer boundary turbulence
                    if (j % Math.floor(M / 7) < 2) {
                        vxPrev[IX(i, j)] += (Math.random() - 0.5) * heat * 0.5;
                    }
                }
            }

            // Velocity step
            addSource(vx, vxPrev, dt);
            addSource(vy, vyPrev, dt);
            [vx, vxPrev] = [vxPrev, vx];
            diffuse(vx, vxPrev, viscosity, dt);
            [vy, vyPrev] = [vyPrev, vy];
            diffuse(vy, vyPrev, viscosity, dt);
            project(vx, vy, vxPrev, vyPrev);
            [vx, vxPrev] = [vxPrev, vx];
            [vy, vyPrev] = [vyPrev, vy];
            advect(vx, vxPrev, vxPrev, vyPrev, dt);
            advect(vy, vyPrev, vxPrev, vyPrev, dt);
            project(vx, vy, vxPrev, vyPrev);

            // Density step
            addSource(density, densityPrev, dt);
            [density, densityPrev] = [densityPrev, density];
            diffuse(density, densityPrev, diffusion, dt);
            [density, densityPrev] = [densityPrev, density];
            advect(density, densityPrev, vx, vy, dt);

            // Clear previous sources
            densityPrev.fill(0);
            vxPrev.fill(0);
            vyPrev.fill(0);

            // Decay
            for (let i = 0; i < size; i++) {
                density[i] *= 0.99;
            }
        }

        function render() {
            const imageData = ctx!.createImageData(width, height);

            for (let j = 0; j < M; j++) {
                const layerIdx = Math.floor((j / M) * 7);
                const isActive = focusLayer === -1 || focusLayer === layerIdx;
                const color = layerColors[layerIdx];

                for (let i = 0; i < N; i++) {
                    const idx = IX(i, j);
                    const pi = idx * 4;

                    const d = Math.min(1, density[idx] * 0.5);
                    const intensity = isActive ? 1 : 0.3;

                    // Velocity magnitude for additional coloring
                    const vel = Math.sqrt(vx[idx] * vx[idx] + vy[idx] * vy[idx]);
                    const velColor = Math.min(1, vel * 2);

                    imageData.data[pi] = Math.floor((color[0] * d + 255 * velColor * 0.3) * intensity);
                    imageData.data[pi + 1] = Math.floor((color[1] * d + 100 * velColor * 0.2) * intensity);
                    imageData.data[pi + 2] = Math.floor((color[2] * d + 200 * velColor * 0.4) * intensity);
                    imageData.data[pi + 3] = 255;
                }
            }

            ctx!.putImageData(imageData, 0, 0);
        }

        function animate() {
            step();
            render();
            animationRef.current = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [fluidParams, focusLayer]);

    // Turbulence indicator
    const turbulence = useMemo(() => {
        if (trauma < 0.3) return { level: 'Laminar', color: 'text-green-400' };
        if (trauma < 0.6) return { level: 'Transitional', color: 'text-yellow-400' };
        return { level: 'Turbulent', color: 'text-red-400' };
    }, [trauma]);

    return (
        <div className="relative w-full h-full bg-gray-950/90 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
            {/* Title */}
            <div className="absolute top-4 left-4 z-10">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 8</div>
                <div className="text-lg font-bold text-white">Neural Plasma</div>
                <div className="text-xs text-gray-500">Navier-Stokes Flow Dynamics</div>
            </div>

            {/* Flow State */}
            <div className="absolute top-4 right-4 z-10 text-right">
                <div className="text-[9px] font-mono text-gray-500 uppercase">Reynolds</div>
                <div className={`text-lg font-bold ${turbulence.color}`}>
                    {turbulence.level}
                </div>
                <div className="text-[8px] font-mono text-gray-600">
                    {trauma < 0.3 ? 'Smooth propagation' : trauma < 0.6 ? 'Vortex formation' : 'Chaotic mixing'}
                </div>
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="w-full h-full object-cover rounded-lg"
                style={{ imageRendering: 'auto' }}
            />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 text-[8px] font-mono text-gray-500">
                <span className="text-cyan-400">■</span> Thought Waves &nbsp;
                <span className="text-orange-400">■</span> Vortex Cores
            </div>
        </div>
    );
}
