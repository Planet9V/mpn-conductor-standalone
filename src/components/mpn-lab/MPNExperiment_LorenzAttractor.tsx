'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

interface LorenzAttractorProps {
    trauma: number;
    entropy: number;
    time: number;
}

// Lorenz system parameters adapted to our domain
function lorenzStep(
    x: number, y: number, z: number,
    sigma: number, rho: number, beta: number,
    dt: number
): [number, number, number] {
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;
    return [
        x + dx * dt,
        y + dy * dt,
        z + dz * dt
    ];
}

function AttractorTrail({ trauma, entropy, time }: LorenzAttractorProps) {
    const pointsRef = useRef<THREE.Vector3[]>([]);
    const lineRef = useRef<any>(null);

    // Lorenz parameters modulated by our data
    // sigma (Prandtl number) ~ Trauma responsiveness
    // rho (Rayleigh number) ~ System energy/entropy
    // beta (geometric factor) ~ Layer coupling
    const sigma = 10 + trauma * 5;
    const rho = 28 + entropy * 20; // Above 24.74 = chaos
    const beta = 8 / 3;

    const maxPoints = 2000;

    // Generate trajectory
    const trajectory = useMemo(() => {
        const points: THREE.Vector3[] = [];
        let x = 1, y = 1, z = 1;
        const dt = 0.005;

        for (let i = 0; i < maxPoints; i++) {
            [x, y, z] = lorenzStep(x, y, z, sigma, rho, beta, dt);
            points.push(new THREE.Vector3(x * 0.05, y * 0.05, z * 0.05 - 1.5));
        }
        return points;
    }, [sigma, rho, beta]);

    // Color gradient based on position in trajectory
    const colors = useMemo(() => {
        return trajectory.map((_, i) => {
            const t = i / trajectory.length;
            // Gradient from blue (past) to red (crisis)
            const r = t * (0.5 + trauma * 0.5);
            const g = 0.2 * (1 - trauma);
            const b = (1 - t) * 0.8;
            return new THREE.Color(r, g, b);
        });
    }, [trajectory, trauma]);

    useFrame(() => {
        if (lineRef.current) {
            lineRef.current.rotation.y += 0.002;
        }
    });

    return (
        <group ref={lineRef}>
            <Line
                points={trajectory}
                color="white"
                lineWidth={1.5}
                vertexColors={colors}
            />
            {/* Current position indicator */}
            <mesh position={trajectory[trajectory.length - 1]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color={trauma > 0.5 ? "#ef4444" : "#22c55e"} />
            </mesh>
        </group>
    );
}

// Attractor basin visualization
function AttractorBasins({ trauma }: { trauma: number }) {
    return (
        <group>
            {/* Left basin (stable state 1) */}
            <mesh position={[-0.6, -0.6, -0.5]} scale={0.5 - trauma * 0.3}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial color="#22c55e" transparent opacity={0.1} wireframe />
            </mesh>
            {/* Right basin (stable state 2) */}
            <mesh position={[0.6, -0.6, -0.5]} scale={0.5 - trauma * 0.3}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} wireframe />
            </mesh>
        </group>
    );
}

export default function MPNExperiment_LorenzAttractor({ trauma, entropy, time }: LorenzAttractorProps) {
    // Calculate Lyapunov exponent approximation (chaos indicator)
    const lyapunov = useMemo(() => {
        // Simplified: positive = chaos, negative = stable
        return (entropy - 0.3) * 2 + trauma;
    }, [entropy, trauma]);

    return (
        <div className="relative w-full h-full bg-gray-950/90 rounded-xl border border-white/10 overflow-hidden">
            {/* Title */}
            <div className="absolute top-4 left-4 z-10">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 6</div>
                <div className="text-lg font-bold text-white">Lorenz Attractor</div>
                <div className="text-xs text-gray-500">Phase Space Trajectory</div>
            </div>

            {/* Chaos Indicator */}
            <div className="absolute top-4 right-4 z-10 text-right">
                <div className="text-[9px] font-mono text-gray-500 uppercase">Lyapunov λ</div>
                <div className={`text-xl font-black font-mono ${lyapunov > 0.5 ? 'text-red-400' : lyapunov > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                    {lyapunov.toFixed(2)}
                </div>
                <div className="text-[8px] font-mono text-gray-600">
                    {lyapunov > 0.5 ? 'CHAOTIC' : lyapunov > 0 ? 'EDGE OF CHAOS' : 'STABLE'}
                </div>
            </div>

            {/* Axis Labels */}
            <div className="absolute bottom-4 left-4 z-10 text-[8px] font-mono text-gray-500 space-y-1">
                <div>X: Trauma (R)</div>
                <div>Y: Entropy (H)</div>
                <div>Z: Arrhythmia (α)</div>
            </div>

            <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={0.5} />

                <AttractorBasins trauma={trauma} />
                <AttractorTrail trauma={trauma} entropy={entropy} time={time} />

                <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}
