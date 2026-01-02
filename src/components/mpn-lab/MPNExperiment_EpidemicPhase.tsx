'use client';

import React, { useRef, useEffect, useMemo } from 'react';

interface EpidemicPhaseProps {
    trauma: number;
    entropy: number;
}

export default function MPNExperiment_EpidemicPhase({ trauma, entropy }: EpidemicPhaseProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const stateRef = useRef<{ rho: number; gamma: number; trail: Array<{ x: number, y: number }> }>({
        rho: 0.3, // infection rate
        gamma: 0.5, // recovery rate
        trail: []
    });
    const timeRef = useRef<number>(0);

    // R₀ calculation
    const R0 = useMemo(() => {
        return stateRef.current.rho / stateRef.current.gamma;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = 400;
        const height = 300;
        canvas.width = width;
        canvas.height = height;

        // Phase space bounds
        const rhoMax = 1.0;
        const gammaMax = 1.0;
        const margin = 40;
        const plotWidth = width - 2 * margin;
        const plotHeight = height - 2 * margin;

        function toCanvasX(rho: number): number {
            return margin + (rho / rhoMax) * plotWidth;
        }

        function toCanvasY(gamma: number): number {
            return height - margin - (gamma / gammaMax) * plotHeight;
        }

        function render() {
            timeRef.current++;
            const state = stateRef.current;

            // Clear with fade for trail effect
            ctx!.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx!.fillRect(0, 0, width, height);

            // Draw axes
            ctx!.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx!.lineWidth = 1;

            // X-axis (rho)
            ctx!.beginPath();
            ctx!.moveTo(margin, height - margin);
            ctx!.lineTo(width - margin, height - margin);
            ctx!.stroke();

            // Y-axis (gamma)
            ctx!.beginPath();
            ctx!.moveTo(margin, margin);
            ctx!.lineTo(margin, height - margin);
            ctx!.stroke();

            // Axis labels
            ctx!.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx!.font = '10px monospace';
            ctx!.fillText('ρ (Infection)', width - margin - 60, height - 15);
            ctx!.save();
            ctx!.translate(12, margin + 60);
            ctx!.rotate(-Math.PI / 2);
            ctx!.fillText('γ (Recovery)', 0, 0);
            ctx!.restore();

            // Draw R₀ = 1 separatrix (critical threshold line: rho = gamma)
            ctx!.beginPath();
            ctx!.moveTo(margin, height - margin);
            ctx!.lineTo(margin + plotWidth, margin);
            ctx!.strokeStyle = 'rgba(239, 68, 68, 0.8)';
            ctx!.lineWidth = 2;
            ctx!.setLineDash([5, 5]);
            ctx!.stroke();
            ctx!.setLineDash([]);

            // Label the threshold
            ctx!.fillStyle = 'rgba(239, 68, 68, 0.8)';
            ctx!.font = '9px monospace';
            ctx!.fillText('R₀ = 1 (THRESHOLD)', width - margin - 80, margin + 15);

            // Draw region labels
            ctx!.fillStyle = 'rgba(34, 197, 94, 0.4)';
            ctx!.font = '11px monospace';
            ctx!.fillText('CONTROLLED', margin + 20, margin + 30);
            ctx!.fillText('R₀ < 1', margin + 20, margin + 45);

            ctx!.fillStyle = 'rgba(239, 68, 68, 0.4)';
            ctx!.fillText('EPIDEMIC', width - margin - 70, height - margin - 30);
            ctx!.fillText('R₀ > 1', width - margin - 70, height - margin - 15);

            // Draw vector field (arrows showing flow)
            ctx!.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx!.lineWidth = 1;
            const gridSize = 8;
            for (let i = 1; i < gridSize; i++) {
                for (let j = 1; j < gridSize; j++) {
                    const rho = (i / gridSize) * rhoMax;
                    const gamma = (j / gridSize) * gammaMax;

                    // SIS dynamics: dρ/dt ~ (R₀ - 1) * ρ, dγ/dt ~ -entropy
                    const r0_local = rho / (gamma + 0.01);
                    const drho = (r0_local > 1 ? 0.02 : -0.02) * rho;
                    const dgamma = -0.005 * (entropy - 0.5);

                    const x1 = toCanvasX(rho);
                    const y1 = toCanvasY(gamma);
                    const len = 15;
                    const angle = Math.atan2(-dgamma, drho);
                    const x2 = x1 + Math.cos(angle) * len;
                    const y2 = y1 + Math.sin(angle) * len;

                    ctx!.beginPath();
                    ctx!.moveTo(x1, y1);
                    ctx!.lineTo(x2, y2);
                    ctx!.stroke();

                    // Arrow head
                    ctx!.beginPath();
                    ctx!.moveTo(x2, y2);
                    ctx!.lineTo(x2 - 4 * Math.cos(angle - 0.4), y2 - 4 * Math.sin(angle - 0.4));
                    ctx!.moveTo(x2, y2);
                    ctx!.lineTo(x2 - 4 * Math.cos(angle + 0.4), y2 - 4 * Math.sin(angle + 0.4));
                    ctx!.stroke();
                }
            }

            // Update state based on trauma/entropy
            // Trauma increases infection rate, entropy affects recovery jitter
            const targetRho = 0.2 + trauma * 0.6;
            const targetGamma = 0.5 - trauma * 0.2;

            state.rho += (targetRho - state.rho) * 0.02 + (Math.random() - 0.5) * entropy * 0.02;
            state.gamma += (targetGamma - state.gamma) * 0.02 + (Math.random() - 0.5) * entropy * 0.03;

            // Clamp values
            state.rho = Math.max(0.05, Math.min(0.95, state.rho));
            state.gamma = Math.max(0.05, Math.min(0.95, state.gamma));

            // Add to trail
            state.trail.push({ x: state.rho, y: state.gamma });
            if (state.trail.length > 100) state.trail.shift();

            // Draw trail
            if (state.trail.length > 1) {
                ctx!.beginPath();
                ctx!.moveTo(toCanvasX(state.trail[0].x), toCanvasY(state.trail[0].y));
                state.trail.forEach((pt, i) => {
                    ctx!.lineTo(toCanvasX(pt.x), toCanvasY(pt.y));
                });
                ctx!.strokeStyle = `rgba(59, 130, 246, 0.5)`;
                ctx!.lineWidth = 2;
                ctx!.stroke();
            }

            // Draw current state particle
            const currentR0 = state.rho / state.gamma;
            const stateColor = currentR0 > 1 ? '#ef4444' : '#22c55e';
            const x = toCanvasX(state.rho);
            const y = toCanvasY(state.gamma);

            // Glow
            const gradient = ctx!.createRadialGradient(x, y, 0, x, y, 20);
            gradient.addColorStop(0, stateColor + '80');
            gradient.addColorStop(1, 'transparent');
            ctx!.beginPath();
            ctx!.arc(x, y, 20, 0, Math.PI * 2);
            ctx!.fillStyle = gradient;
            ctx!.fill();

            // Particle
            ctx!.beginPath();
            ctx!.arc(x, y, 6, 0, Math.PI * 2);
            ctx!.fillStyle = stateColor;
            ctx!.fill();
            ctx!.strokeStyle = 'white';
            ctx!.lineWidth = 2;
            ctx!.stroke();

            animationRef.current = requestAnimationFrame(render);
        }

        render();

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [trauma, entropy]);

    // Current R₀ calculation
    const currentR0 = stateRef.current.rho / stateRef.current.gamma;
    const isEpidemic = currentR0 > 1;

    return (
        <div className="relative w-full h-full bg-gray-950/90 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
            {/* Title */}
            <div className="absolute top-4 left-4 z-10">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 10</div>
                <div className="text-lg font-bold text-white">Epidemic Phase</div>
                <div className="text-xs text-gray-500">SIS Dynamics Phase Portrait</div>
            </div>

            {/* R₀ Indicator */}
            <div className="absolute top-4 right-4 z-10 text-right">
                <div className="text-[9px] font-mono text-gray-500 uppercase">R₀ (Basic Reproduction)</div>
                <div className={`text-2xl font-black ${isEpidemic ? 'text-red-400' : 'text-green-400'}`}>
                    {currentR0.toFixed(2)}
                </div>
                <div className={`text-[8px] font-mono ${isEpidemic ? 'text-red-400' : 'text-green-400'}`}>
                    {isEpidemic ? '⚠ SUPERCRITICAL' : '✓ SUBCRITICAL'}
                </div>
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ imageRendering: 'auto' }}
            />

            {/* Formula */}
            <div className="absolute bottom-4 left-4 text-[8px] font-mono text-gray-500">
                R₀ = λ₁(A) · β/γ | Threshold at R₀ = 1
            </div>
        </div>
    );
}
