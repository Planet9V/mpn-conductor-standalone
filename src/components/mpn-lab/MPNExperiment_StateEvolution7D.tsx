'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface StateEvolution7DProps {
    trauma: number;
    entropy: number;
    focusLayer: number;
}

const LAYER_COLORS = ['#6b7280', '#3b82f6', '#22c55e', '#ef4444', '#ec4899', '#f97316', '#a855f7'];

// Generate random points on a spherical shell
function randomOnShell(numParticles: number, radius: number): Float32Array {
    const points = new Float32Array(numParticles * 3);
    for (let i = 0; i < numParticles; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        points[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        points[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        points[i * 3 + 2] = radius * Math.cos(phi);
    }
    return points;
}

// Layer Shell Component
function LayerShell({ layerIndex, radius, color, trauma, entropy, isActive }: {
    layerIndex: number;
    radius: number;
    color: string;
    trauma: number;
    entropy: number;
    isActive: boolean;
}) {
    const pointsRef = useRef<THREE.Points>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    // Particle count based on entropy and layer importance (L3 Threats has most particles under high trauma)
    const particleCount = useMemo(() => {
        const base = 100 + Math.floor(entropy * 200);
        return layerIndex === 3 ? Math.floor(base * (1 + trauma)) : base;
    }, [entropy, trauma, layerIndex]);

    const positions = useMemo(() => randomOnShell(particleCount, radius), [particleCount, radius]);

    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.1 * (1 + layerIndex * 0.1);
            pointsRef.current.rotation.x += delta * 0.05;
        }
        if (ringRef.current) {
            ringRef.current.rotation.z += delta * 0.2;
        }
    });

    const opacity = isActive ? 0.8 : 0.15;
    const particleSize = isActive ? 0.04 : 0.02;

    return (
        <group>
            {/* Orbital Ring */}
            <mesh ref={ringRef} rotation={[Math.PI / 2 + layerIndex * 0.2, 0, 0]}>
                <torusGeometry args={[radius, 0.01, 8, 64]} />
                <meshBasicMaterial color={color} transparent opacity={opacity * 0.5} />
            </mesh>

            {/* Particle Cloud */}
            <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={color}
                    size={particleSize}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={opacity}
                />
            </Points>
        </group>
    );
}

// Central Core (Trauma Indicator)
function CoreManifold({ trauma }: { trauma: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
        }
    });

    const coreColor = trauma < 0.3 ? '#22c55e' : trauma < 0.6 ? '#f97316' : '#ef4444';

    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
            <mesh ref={meshRef} scale={0.8 + trauma * 0.4}>
                <icosahedronGeometry args={[1, 4]} />
                <MeshDistortMaterial
                    color={coreColor}
                    emissive={coreColor}
                    emissiveIntensity={0.5}
                    wireframe
                    speed={3 + trauma * 5}
                    distort={0.3 + trauma * 0.5}
                    roughness={0}
                    metalness={1}
                />
            </mesh>
        </Float>
    );
}

export default function MPNExperiment_StateEvolution7D({ trauma, entropy, focusLayer }: StateEvolution7DProps) {
    return (
        <div className="relative w-full h-full bg-gray-950/90 rounded-xl border border-white/10 overflow-hidden">
            {/* Title */}
            <div className="absolute top-4 left-4 z-10">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 4</div>
                <div className="text-lg font-bold text-white">7D State Evolution</div>
                <div className="text-xs text-gray-500">7 Concentric Shells // L0 (Core) → L6 (Outer)</div>
            </div>

            {/* Metrics */}
            <div className="absolute top-4 right-4 z-10 text-right">
                <div className="text-[10px] font-mono text-gray-500 uppercase">System Health</div>
                <div className={`text-2xl font-black ${trauma > 0.6 ? 'text-red-400' : trauma > 0.3 ? 'text-orange-400' : 'text-green-400'}`}>
                    {Math.round((1 - trauma) * 100)}%
                </div>
            </div>

            <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={0.5} color="#00aaff" />
                <pointLight position={[-10, -10, -10]} intensity={0.3} color="#F5C518" />

                {/* Core */}
                <CoreManifold trauma={trauma} />

                {/* 7 Layer Shells */}
                {LAYER_COLORS.map((color, i) => (
                    <LayerShell
                        key={i}
                        layerIndex={i}
                        radius={1.5 + i * 0.7}
                        color={color}
                        trauma={trauma}
                        entropy={entropy}
                        isActive={focusLayer === -1 || focusLayer === i}
                    />
                ))}

                <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.3} />
            </Canvas>

            {/* Layer Legend */}
            <div className="absolute bottom-4 left-4 flex gap-2">
                {['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6'].map((name, i) => (
                    <div
                        key={i}
                        className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${focusLayer === i || focusLayer === -1 ? 'opacity-100' : 'opacity-30'}`}
                        style={{ backgroundColor: `${LAYER_COLORS[i]}30`, color: LAYER_COLORS[i] }}
                    >
                        {name}
                    </div>
                ))}
            </div>
        </div>
    );
}
