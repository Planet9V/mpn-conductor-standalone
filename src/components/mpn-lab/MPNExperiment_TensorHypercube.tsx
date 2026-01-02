'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface TensorHypercubeProps {
    trauma: number;
    entropy: number;
}

// 4D hypercube (tesseract) vertices
const TESSERACT_VERTICES_4D = [
    [-1, -1, -1, -1], [1, -1, -1, -1], [-1, 1, -1, -1], [1, 1, -1, -1],
    [-1, -1, 1, -1], [1, -1, 1, -1], [-1, 1, 1, -1], [1, 1, 1, -1],
    [-1, -1, -1, 1], [1, -1, -1, 1], [-1, 1, -1, 1], [1, 1, -1, 1],
    [-1, -1, 1, 1], [1, -1, 1, 1], [-1, 1, 1, 1], [1, 1, 1, 1],
];

// Edges of the tesseract
const TESSERACT_EDGES = [
    // Inner cube
    [0, 1], [1, 3], [3, 2], [2, 0],
    [4, 5], [5, 7], [7, 6], [6, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
    // Outer cube
    [8, 9], [9, 11], [11, 10], [10, 8],
    [12, 13], [13, 15], [15, 14], [14, 12],
    [8, 12], [9, 13], [10, 14], [11, 15],
    // Connecting edges
    [0, 8], [1, 9], [2, 10], [3, 11],
    [4, 12], [5, 13], [6, 14], [7, 15],
];

function project4Dto3D(
    point4D: number[],
    rotXW: number,
    rotYW: number,
    rotZW: number,
    warp: number
): THREE.Vector3 {
    let [x, y, z, w] = point4D;

    // Rotation in XW plane
    const cosXW = Math.cos(rotXW), sinXW = Math.sin(rotXW);
    const x1 = x * cosXW - w * sinXW;
    const w1 = x * sinXW + w * cosXW;

    // Rotation in YW plane
    const cosYW = Math.cos(rotYW), sinYW = Math.sin(rotYW);
    const y1 = y * cosYW - w1 * sinYW;
    const w2 = y * sinYW + w1 * cosYW;

    // Rotation in ZW plane
    const cosZW = Math.cos(rotZW), sinZW = Math.sin(rotZW);
    const z1 = z * cosZW - w2 * sinZW;
    const w3 = z * sinZW + w2 * cosZW;

    // Stereographic projection from 4D to 3D
    const distance = 3;
    const scale = distance / (distance - w3 * (1 + warp * 0.5));

    return new THREE.Vector3(x1 * scale, y1 * scale, z1 * scale);
}

function Tesseract({ trauma, entropy, time }: { trauma: number; entropy: number; time: number }) {
    const lineRef = useRef<THREE.LineSegments>(null);
    const pointsRef = useRef<THREE.Points>(null);
    const statePointRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!lineRef.current || !pointsRef.current || !statePointRef.current) return;

        // Rotation speeds modulated by entropy
        const rotXW = time * 0.3 + entropy * Math.sin(time * 0.5);
        const rotYW = time * 0.2;
        const rotZW = time * 0.1 + entropy * Math.cos(time * 0.3);

        // Warp factor from trauma
        const warp = trauma * 0.5;

        // Project vertices
        const projected = TESSERACT_VERTICES_4D.map(v =>
            project4Dto3D(v, rotXW, rotYW, rotZW, warp)
        );

        // Update line geometry
        const linePositions = new Float32Array(TESSERACT_EDGES.length * 6);
        TESSERACT_EDGES.forEach((edge, i) => {
            const p1 = projected[edge[0]];
            const p2 = projected[edge[1]];
            linePositions[i * 6] = p1.x;
            linePositions[i * 6 + 1] = p1.y;
            linePositions[i * 6 + 2] = p1.z;
            linePositions[i * 6 + 3] = p2.x;
            linePositions[i * 6 + 4] = p2.y;
            linePositions[i * 6 + 5] = p2.z;
        });
        (lineRef.current.geometry as THREE.BufferGeometry).setAttribute(
            'position',
            new THREE.BufferAttribute(linePositions, 3)
        );

        // Update vertex points
        const pointPositions = new Float32Array(projected.length * 3);
        projected.forEach((p, i) => {
            pointPositions[i * 3] = p.x;
            pointPositions[i * 3 + 1] = p.y;
            pointPositions[i * 3 + 2] = p.z;
        });
        (pointsRef.current.geometry as THREE.BufferGeometry).setAttribute(
            'position',
            new THREE.BufferAttribute(pointPositions, 3)
        );

        // State point (current psychometric position)
        const stateW = trauma - 0.5;
        const statePos = project4Dto3D(
            [Math.sin(time * 0.5) * 0.5, Math.cos(time * 0.7) * 0.5, entropy - 0.5, stateW],
            rotXW, rotYW, rotZW, warp
        );
        statePointRef.current.position.copy(statePos);
    });

    // Pre-compute initial geometry
    const initialLinePositions = useMemo(() => new Float32Array(TESSERACT_EDGES.length * 6), []);
    const initialPointPositions = useMemo(() => new Float32Array(TESSERACT_VERTICES_4D.length * 3), []);

    return (
        <group>
            {/* Tesseract edges */}
            <lineSegments ref={lineRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[initialLinePositions, 3]}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color={trauma > 0.5 ? '#ef4444' : '#3b82f6'}
                    transparent
                    opacity={0.6}
                />
            </lineSegments>

            {/* Tesseract vertices */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[initialPointPositions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color="#f59e0b"
                    size={0.1}
                    transparent
                    opacity={0.8}
                />
            </points>

            {/* Current state point */}
            <mesh ref={statePointRef}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshBasicMaterial color="#22c55e" />
            </mesh>
        </group>
    );
}

function AnimatedTesseract({ trauma, entropy }: TensorHypercubeProps) {
    const timeRef = useRef(0);

    useFrame((_, delta) => {
        timeRef.current += delta;
    });

    return <Tesseract trauma={trauma} entropy={entropy} time={timeRef.current} />;
}

export default function MPNExperiment_TensorHypercube({ trauma, entropy }: TensorHypercubeProps) {
    return (
        <div className="relative w-full h-full bg-gray-950/90 rounded-xl border border-white/10 overflow-hidden">
            {/* Title */}
            <div className="absolute top-4 left-4 z-10">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 11</div>
                <div className="text-lg font-bold text-white">Tensor Hypercube</div>
                <div className="text-xs text-gray-500">4D Psychometric Space</div>
            </div>

            {/* Dimension Labels */}
            <div className="absolute top-4 right-4 z-10 text-right text-[8px] font-mono space-y-1">
                <div className="text-blue-400">X: DISC</div>
                <div className="text-cyan-400">Y: OCEAN</div>
                <div className="text-purple-400">Z: DarkTriad</div>
                <div className="text-orange-400">W: Biases</div>
            </div>

            <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} intensity={0.6} />

                <AnimatedTesseract trauma={trauma} entropy={entropy} />

                <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.3} />
            </Canvas>

            {/* Formula */}
            <div className="absolute bottom-4 left-4 text-[8px] font-mono text-gray-500">
                P = (DISC ⊗ OCEAN) ⊕ DarkTriad ⊕ Biases
            </div>

            {/* Warp indicator */}
            <div className="absolute bottom-4 right-4 text-[8px] font-mono text-gray-500">
                Warp: {(trauma * 50).toFixed(0)}%
            </div>
        </div>
    );
}
