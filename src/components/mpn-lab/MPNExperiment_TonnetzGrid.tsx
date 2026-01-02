'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface TonnetzGridProps {
    trauma: number;
    entropy: number;
}

// Neo-Riemannian Tonnetz Grid Positions (simplified 2D projection on torus)
const TONNETZ_NOTES = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];

// Generate torus points for the Tonnetz
function TonnetzTorus({ trauma, entropy }: TonnetzGridProps) {
    const groupRef = useRef<THREE.Group>(null);
    const activeNodeRef = useRef<THREE.Mesh>(null);

    // Calculate current chord position based on trauma
    const chordPosition = useMemo(() => {
        // Trauma determines "distance" from origin
        let noteIndex = 0;
        if (trauma < 0.3) noteIndex = 0; // C (R - stable)
        else if (trauma < 0.6) noteIndex = 4; // E (L - tension)
        else if (trauma < 0.8) noteIndex = 3; // A minor root (P - darkening)
        else noteIndex = 7; // C# (PLP - catastrophic)

        const angle = (noteIndex / 12) * Math.PI * 2;
        const majorRadius = 2;
        const minorRadius = 0.8;

        return {
            x: (majorRadius + minorRadius * Math.cos(trauma * Math.PI)) * Math.cos(angle),
            y: minorRadius * Math.sin(trauma * Math.PI),
            z: (majorRadius + minorRadius * Math.cos(trauma * Math.PI)) * Math.sin(angle),
            note: TONNETZ_NOTES[noteIndex]
        };
    }, [trauma]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
        if (activeNodeRef.current) {
            activeNodeRef.current.position.x = chordPosition.x;
            activeNodeRef.current.position.y = chordPosition.y;
            activeNodeRef.current.position.z = chordPosition.z;
        }
    });

    // Generate grid points on torus
    const gridPoints = useMemo(() => {
        const points: THREE.Vector3[] = [];
        const majorRadius = 2;
        const minorRadius = 0.8;

        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 6; j++) {
                const theta = (i / 12) * Math.PI * 2;
                const phi = (j / 6) * Math.PI * 2;
                const x = (majorRadius + minorRadius * Math.cos(phi)) * Math.cos(theta);
                const y = minorRadius * Math.sin(phi);
                const z = (majorRadius + minorRadius * Math.cos(phi)) * Math.sin(theta);
                points.push(new THREE.Vector3(x, y, z));
            }
        }
        return points;
    }, []);

    return (
        <group ref={groupRef}>
            {/* Torus Wireframe */}
            <mesh>
                <torusGeometry args={[2, 0.8, 16, 48]} />
                <meshBasicMaterial color="#1a1a2e" wireframe opacity={0.3} transparent />
            </mesh>

            {/* Grid Nodes */}
            {gridPoints.map((point, i) => (
                <mesh key={i} position={point}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial color="#4a4a6a" />
                </mesh>
            ))}

            {/* Active Node (Current Chord) */}
            <Float speed={3} floatIntensity={0.3}>
                <mesh ref={activeNodeRef} position={[chordPosition.x, chordPosition.y, chordPosition.z]}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshBasicMaterial color={trauma > 0.6 ? '#ef4444' : trauma > 0.3 ? '#f97316' : '#22c55e'} />
                </mesh>
                {/* Glow */}
                <mesh position={[chordPosition.x, chordPosition.y, chordPosition.z]}>
                    <sphereGeometry args={[0.25, 16, 16]} />
                    <meshBasicMaterial color={trauma > 0.6 ? '#ef4444' : '#00aaff'} transparent opacity={0.3} />
                </mesh>
            </Float>
        </group>
    );
}

export default function MPNExperiment_TonnetzGrid({ trauma, entropy }: TonnetzGridProps) {
    return (
        <div className="relative w-full h-full bg-gray-950/90 rounded-xl border border-white/10 overflow-hidden">
            {/* Title */}
            <div className="absolute top-4 left-4 z-10">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 2</div>
                <div className="text-lg font-bold text-white">Tonnetz Grid</div>
                <div className="text-xs text-gray-500">Neo-Riemannian Torus // R/L/P/PLP</div>
            </div>

            {/* Chord Indicator */}
            <div className="absolute top-4 right-4 z-10 text-right">
                <div className="text-[10px] font-mono text-gray-500 uppercase">Current Chord</div>
                <div className={`text-2xl font-black ${trauma > 0.6 ? 'text-red-400' : trauma > 0.3 ? 'text-orange-400' : 'text-green-400'}`}>
                    {trauma < 0.3 ? 'C Major' : trauma < 0.6 ? 'E Minor' : trauma < 0.8 ? 'A Minor' : 'C# Major'}
                </div>
                <div className="text-xs font-mono text-gray-600">
                    {trauma < 0.3 ? 'R (Relative)' : trauma < 0.6 ? 'L (Leading)' : trauma < 0.8 ? 'P (Parallel)' : 'PLP (Crisis)'}
                </div>
            </div>

            <Canvas camera={{ position: [0, 3, 5], fov: 50 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={0.5} color="#00aaff" />
                <TonnetzTorus trauma={trauma} entropy={entropy} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}
