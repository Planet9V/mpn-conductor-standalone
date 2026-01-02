'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface BorromeanKnotProps {
    trauma: number;
    entropy: number;
}

// Individual Ring Component
function LacanianRing({
    register,
    baseRadius,
    tubeRadius,
    color,
    rotationAxis,
    trauma,
    entropy
}: {
    register: 'Real' | 'Symbolic' | 'Imaginary';
    baseRadius: number;
    tubeRadius: number;
    color: string;
    rotationAxis: [number, number, number];
    trauma: number;
    entropy: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    // Each register responds differently to trauma
    const registerMultiplier = useMemo(() => {
        switch (register) {
            case 'Real': return 1.5; // Most affected by trauma
            case 'Symbolic': return 0.8;
            case 'Imaginary': return 1.2;
        }
    }, [register]);

    // Thickness decreases with trauma (approaching Seldon Crisis)
    const thickness = Math.max(0.05, tubeRadius * (1 - trauma * registerMultiplier * 0.7));

    // Strain: rings pull apart as trauma increases
    const strain = trauma * 0.5 * registerMultiplier;

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle rotation
            meshRef.current.rotation.x += 0.002 * rotationAxis[0];
            meshRef.current.rotation.y += 0.002 * rotationAxis[1];
            meshRef.current.rotation.z += 0.002 * rotationAxis[2];

            // Entropy causes jitter
            if (entropy > 0.5) {
                meshRef.current.position.x += Math.sin(state.clock.elapsedTime * 10) * entropy * 0.01;
                meshRef.current.position.y += Math.cos(state.clock.elapsedTime * 12) * entropy * 0.01;
            }
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={[strain * rotationAxis[0], strain * rotationAxis[1], strain * rotationAxis[2]]}
            rotation={[rotationAxis[0] * Math.PI / 3, rotationAxis[1] * Math.PI / 3, rotationAxis[2] * Math.PI / 3]}
        >
            <torusGeometry args={[baseRadius, thickness, 32, 100]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={trauma > 0.7 ? 0.5 + Math.sin(Date.now() * 0.01) * 0.3 : 0.2}
                metalness={0.5}
                roughness={0.3}
                transparent
                opacity={0.9}
            />
        </mesh>
    );
}

// Warning indicator when approaching Seldon Crisis
function CrisisIndicator({ trauma }: { trauma: number }) {
    if (trauma < 0.7) return null;

    return (
        <mesh scale={[0.3, 0.3, 0.3]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial
                color="#ff0000"
                transparent
                opacity={0.3 + Math.sin(Date.now() * 0.01) * 0.2}
            />
        </mesh>
    );
}

export default function MPNExperiment_BorromeanKnot({ trauma, entropy }: BorromeanKnotProps) {
    return (
        <div className="relative w-full h-full bg-gray-950/90 rounded-xl border border-white/10 overflow-hidden">
            {/* Title */}
            <div className="absolute top-4 left-4 z-10">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 5</div>
                <div className="text-lg font-bold text-white">Borromean Knot</div>
                <div className="text-xs text-gray-500">Lacanian R/S/I Topology</div>
            </div>

            {/* Register Legend */}
            <div className="absolute top-4 right-4 z-10 text-right space-y-1">
                <div className="flex items-center justify-end gap-2">
                    <span className="text-[9px] font-mono text-gray-400">REAL</span>
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </div>
                <div className="flex items-center justify-end gap-2">
                    <span className="text-[9px] font-mono text-gray-400">SYMBOLIC</span>
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                </div>
                <div className="flex items-center justify-end gap-2">
                    <span className="text-[9px] font-mono text-gray-400">IMAGINARY</span>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                </div>
            </div>

            {/* Crisis Warning */}
            {trauma > 0.7 && (
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 text-red-400 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-xs font-mono uppercase">Seldon Crisis Imminent</span>
                </div>
            )}

            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={0.7} color="#ffffff" />
                <pointLight position={[-5, -5, -5]} intensity={0.4} color="#00aaff" />

                <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
                    <group>
                        {/* Real Register - Red */}
                        <LacanianRing
                            register="Real"
                            baseRadius={1.5}
                            tubeRadius={0.15}
                            color="#ef4444"
                            rotationAxis={[1, 0, 0]}
                            trauma={trauma}
                            entropy={entropy}
                        />

                        {/* Symbolic Register - Blue */}
                        <LacanianRing
                            register="Symbolic"
                            baseRadius={1.5}
                            tubeRadius={0.15}
                            color="#3b82f6"
                            rotationAxis={[0, 1, 0]}
                            trauma={trauma}
                            entropy={entropy}
                        />

                        {/* Imaginary Register - Gold */}
                        <LacanianRing
                            register="Imaginary"
                            baseRadius={1.5}
                            tubeRadius={0.15}
                            color="#f59e0b"
                            rotationAxis={[0, 0, 1]}
                            trauma={trauma}
                            entropy={entropy}
                        />

                        <CrisisIndicator trauma={trauma} />
                    </group>
                </Float>

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
            </Canvas>
        </div>
    );
}
