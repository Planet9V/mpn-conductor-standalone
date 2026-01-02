'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { calculatePsychometricForce } from './psychometric_calculus';
import { precomputeGraphTopology } from './graph_topology_engine';
import { LITERARY_SCENARIOS } from './literary_data';

// --- Types ---

interface NeuralPropagationProps {
    trauma: number;
    entropy: number;
    focusLayer: number;
    script?: {
        speaker: string;
        text: string;
        chord: string;
        analysis: string;
    };
    scenarioName?: string;
}

interface NodeData {
    id: number;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    type: 'actor' | 'concept';
    label: string;
    activation: number;
    mass: number;
    layer: number;
}

interface EdgeData {
    source: number;
    target: number;
    strength: number;
}

// --- Data: Cast Lists ---

const CAST_LISTS: Record<string, string[]> = {
    'hamlet': ['Hamlet', 'Horatio', 'Ghost', 'Claudius', 'Gertrude', 'Ophelia', 'Polonius', 'Laertes'],
    'oedipus': ['Oedipus', 'Jocasta', 'Creon', 'Tiresias', 'Priest', 'Messenger', 'Shepherd', 'Chorus'],
    'macbeth': ['Macbeth', 'Lady Macbeth', 'Banquo', 'Macduff', 'Duncan', 'Witches', 'Malcolm'],
    'default': ['Subject', 'Other', 'Object a', 'Ego', 'Super-Ego', 'Id']
};

const CONCEPTS = ['Real', 'Symbolic', 'Imaginary'];

// --- Scene ---

function GraphScene({ trauma, entropy, focusLayer, script, scenarioName }: NeuralPropagationProps) {
    const groupRefs = useRef<(THREE.Group | null)[]>([]);
    const lineGeoRef = useRef<THREE.BufferGeometry>(null);

    // Get current cast based on scenario
    const currentCast = useMemo(() => {
        const safeName = scenarioName || '';
        const key = Object.keys(CAST_LISTS).find(k => safeName.toLowerCase().includes(k)) || 'default';
        return CAST_LISTS[key];
    }, [scenarioName]);

    // Initialize Graph Data
    const { nodes, edges } = useMemo(() => {
        const _nodes: NodeData[] = [];
        const _edges: EdgeData[] = [];

        // Create Actor Nodes in a CIRCLE
        const radius = 8;
        currentCast.forEach((actor, i) => {
            const angle = (i / currentCast.length) * Math.PI * 2;
            _nodes.push({
                id: i,
                position: new THREE.Vector3(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    (Math.random() - 0.5) * 2
                ),
                velocity: new THREE.Vector3(),
                type: 'actor',
                label: actor,
                activation: 0,
                mass: 1.0,
                layer: i % 7
            });
        });

        // Create Concept Attractors in a Triangle
        const offset = currentCast.length;
        CONCEPTS.forEach((concept, i) => {
            _nodes.push({
                id: offset + i,
                position: new THREE.Vector3(
                    i === 0 ? 0 : (i === 1 ? -5 : 5),
                    i === 0 ? 6 : -4,
                    0
                ),
                velocity: new THREE.Vector3(),
                type: 'concept',
                label: concept,
                activation: 0,
                mass: 5.0,
                layer: 7
            });
        });

        // Create edges between adjacent actors
        for (let i = 0; i < currentCast.length; i++) {
            _edges.push({ source: i, target: (i + 1) % currentCast.length, strength: 0.5 });
        }

        return { nodes: _nodes, edges: _edges };
    }, [currentCast]);

    // Update Refs
    useEffect(() => {
        groupRefs.current = groupRefs.current.slice(0, nodes.length);
    }, [nodes]);

    // --- Animation Loop ---
    useFrame((state) => {
        if (!lineGeoRef.current) return;

        const dt = 0.016;
        const time = state.clock.getElapsedTime();

        // Calculate Psychometric Physics
        const psychoPhysics = calculatePsychometricForce(script);

        // Identify Speaker Node
        let speakerNodeIndex = -1;
        if (script?.speaker) {
            speakerNodeIndex = nodes.findIndex(n =>
                n.label.toLowerCase().includes(script.speaker.toLowerCase())
            );
        }

        // --- Physics Engine ---
        for (let i = 0; i < nodes.length; i++) {
            const n1 = nodes[i];

            // Speaker Pulse
            if (i === speakerNodeIndex) {
                const targetActivation = 1.0 + psychoPhysics.libido * 2.0;
                n1.activation = THREE.MathUtils.lerp(n1.activation, targetActivation, dt * 5);
                n1.velocity.add(psychoPhysics.forceVector.clone().multiplyScalar(dt * 2));
            } else {
                n1.activation = THREE.MathUtils.lerp(n1.activation, 0, dt * 2);
            }

            // Concept Attractors
            if (i === speakerNodeIndex) {
                ['Real', 'Symbolic', 'Imaginary'].forEach((conceptName, idx) => {
                    const weight = idx === 0 ? psychoPhysics.attractors.real :
                        idx === 1 ? psychoPhysics.attractors.symbolic :
                            psychoPhysics.attractors.imaginary;
                    if (weight > 0) {
                        const conceptNode = nodes.find(n => n.label === conceptName);
                        if (conceptNode) {
                            const dx = conceptNode.position.x - n1.position.x;
                            const dy = conceptNode.position.y - n1.position.y;
                            n1.velocity.x += dx * weight * dt;
                            n1.velocity.y += dy * weight * dt;
                        }
                    }
                });
            }

            // Entropy Random Walk
            if (n1.type === 'actor') {
                const noise = entropy * 0.3;
                n1.velocity.x += (Math.random() - 0.5) * noise;
                n1.velocity.y += (Math.random() - 0.5) * noise;
            }

            // Repulsion between actors
            for (let j = i + 1; j < nodes.length; j++) {
                const n2 = nodes[j];
                const dx = n1.position.x - n2.position.x;
                const dy = n1.position.y - n2.position.y;
                const distSq = dx * dx + dy * dy + 0.5;
                if (distSq < 50) {
                    const f = (3.0 / distSq) * dt;
                    n1.velocity.x += dx * f;
                    n1.velocity.y += dy * f;
                    n2.velocity.x -= dx * f;
                    n2.velocity.y -= dy * f;
                }
            }

            // Light center gravity
            const centerStr = n1.type === 'concept' ? 0.5 : 0.02;
            n1.velocity.sub(n1.position.clone().multiplyScalar(centerStr * dt));

            // Damping
            n1.velocity.multiplyScalar(0.95);

            // Integrate
            if (n1.type !== 'concept') {
                n1.position.add(n1.velocity.clone().multiplyScalar(dt));
            }

            // Update Mesh Transforms
            const grp = groupRefs.current[i];
            if (grp) {
                grp.position.copy(n1.position);
                const baseScale = n1.type === 'concept' ? 1.5 : 1.0;
                const scale = baseScale + (n1.activation * 0.8);
                grp.scale.setScalar(scale);
            }
        }

        // Update edge positions
        const positions = lineGeoRef.current.attributes.position.array as Float32Array;
        let idx = 0;
        edges.forEach(e => {
            const n1 = nodes[e.source];
            const n2 = nodes[e.target];
            positions[idx++] = n1.position.x; positions[idx++] = n1.position.y; positions[idx++] = n1.position.z;
            positions[idx++] = n2.position.x; positions[idx++] = n2.position.y; positions[idx++] = n2.position.z;
        });
        lineGeoRef.current.attributes.position.needsUpdate = true;
    });

    return (
        <group>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            {/* Edges */}
            <lineSegments>
                <bufferGeometry ref={lineGeoRef}>
                    <bufferAttribute
                        attach="attributes-position"
                        count={edges.length * 2}
                        args={[new Float32Array(edges.length * 2 * 3), 3]}
                    />
                </bufferGeometry>
                <lineBasicMaterial color="#facc15" transparent opacity={0.6} />
            </lineSegments>

            {/* Nodes */}
            {nodes.map((n, i) => (
                <group key={i} ref={el => (groupRefs.current[i] = el)} position={[n.position.x, n.position.y, n.position.z]}>
                    <Sphere args={[1, 32, 32]}>
                        <meshStandardMaterial
                            color={n.type === 'concept'
                                ? (n.label === 'Real' ? '#ef4444' : n.label === 'Symbolic' ? '#facc15' : '#8b5cf6')
                                : '#22c55e'}
                            emissive={n.type === 'actor' ? '#22c55e' : '#000000'}
                            emissiveIntensity={n.activation * 2}
                            roughness={0.3}
                            metalness={0.7}
                        />
                    </Sphere>
                    <Html position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }}>
                        <div className={`text-xs font-mono px-1 rounded whitespace-nowrap ${n.activation > 0.1 ? 'bg-black/80 text-yellow-400' : 'text-gray-400'}`}>
                            {n.label}
                        </div>
                    </Html>
                </group>
            ))}

            <OrbitControls enablePan={true} enableZoom={true} autoRotate autoRotateSpeed={0.3} />
        </group>
    );
}

export default function MPNExperiment_NeuralPropagation({ trauma, entropy, focusLayer, script, scenarioName }: NeuralPropagationProps) {
    return (
        <div className="w-full h-full bg-gray-950 rounded-xl relative overflow-hidden border border-white/10">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 9</div>
                <div className="text-lg font-bold text-white">Psychometric Calculus</div>
                <div className="text-xs text-gray-500">
                    Scenario: {scenarioName || 'Idle'} // Speaker: {script?.speaker || 'None'}
                </div>
            </div>

            <Canvas camera={{ position: [0, 0, 20], fov: 50 }} style={{ background: '#030712' }}>
                <color attach="background" args={['#030712']} />
                <GraphScene
                    trauma={trauma}
                    entropy={entropy}
                    focusLayer={focusLayer}
                    script={script}
                    scenarioName={scenarioName}
                />
            </Canvas>
        </div>
    );
}
