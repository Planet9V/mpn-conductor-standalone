'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Html, OrbitControls, Line, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { calculatePsychometricForce } from './psychometric_calculus';
import {
    ActorNode,
    DialecticNode,
    DialecticEdge,
    DIALECTIC_NODES,
    DIALECTIC_MESH_EDGES,
    getActorProfile,
    calculateActorDialecticAffinity,
    calculateActorClusteringForce,
    findDialecticPath,
} from './dialectic_graph_data';

// --- Types ---

interface DialecticGraphProps {
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

interface NodePhysics {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    activation: number;
}

// --- Data: Cast Lists ---

const CAST_LISTS: Record<string, string[]> = {
    'hamlet': ['Hamlet', 'Horatio', 'Ghost', 'Claudius', 'Gertrude', 'Ophelia', 'Polonius', 'Laertes'],
    'oedipus': ['Oedipus', 'Jocasta', 'Creon', 'Tiresias', 'Priest', 'Messenger', 'Shepherd', 'Chorus'],
    'macbeth': ['Macbeth', 'Lady Macbeth', 'Banquo', 'Macduff', 'Duncan', 'Witches', 'Malcolm'],
    'default': ['Subject', 'Other', 'Object a', 'Ego', 'Super-Ego', 'Id']
};

// --- Trait Indicator Component ---

function TraitIndicator({ trait, value, angle, distance }: { trait: string; value: number; angle: number; distance: number }) {
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const opacity = 0.3 + value * 0.7;
    const scale = 0.1 + value * 0.15;

    return (
        <mesh position={[x, y, 0]}>
            <sphereGeometry args={[scale, 8, 8]} />
            <meshStandardMaterial
                color={trait === 'D' ? '#ef4444' : trait === 'I' ? '#facc15' : trait === 'S' ? '#22c55e' : '#3b82f6'}
                transparent
                opacity={opacity}
                emissive={trait === 'D' ? '#ef4444' : trait === 'I' ? '#facc15' : trait === 'S' ? '#22c55e' : '#3b82f6'}
                emissiveIntensity={0.5}
            />
        </mesh>
    );
}

// --- Main Graph Scene ---

function DialecticGraphScene({ trauma, entropy, focusLayer, script, scenarioName }: DialecticGraphProps) {
    const actorRefs = useRef<(THREE.Group | null)[]>([]);
    const dialecticRefs = useRef<(THREE.Group | null)[]>([]);
    const [activeTraversal, setActiveTraversal] = useState<string[]>([]);
    const [currentHop, setCurrentHop] = useState(0);

    // Get current cast based on scenario
    const currentCast = useMemo(() => {
        const safeName = scenarioName || '';
        const key = Object.keys(CAST_LISTS).find(k => safeName.toLowerCase().includes(k)) || 'default';
        return CAST_LISTS[key];
    }, [scenarioName]);

    // Build actor nodes with psychometric profiles
    const actorNodes: ActorNode[] = useMemo(() => {
        const radius = 12;
        return currentCast.map((name, i) => {
            const angle = (i / currentCast.length) * Math.PI * 2;
            const profile = getActorProfile(name);
            return {
                id: `actor-${name.toLowerCase().replace(/\s/g, '-')}`,
                label: name,
                type: 'actor' as const,
                ...profile,
            };
        });
    }, [currentCast]);

    // Get dialectic nodes
    const dialecticNodes = useMemo(() => DIALECTIC_NODES, []);

    // Physics state for all nodes
    const actorPhysics = useRef<NodePhysics[]>([]);
    const dialecticPhysics = useRef<NodePhysics[]>([]);

    // Initialize physics
    useEffect(() => {
        // Actor positions in outer ring
        const actorRadius = 10;
        actorPhysics.current = actorNodes.map((_, i) => {
            const angle = (i / actorNodes.length) * Math.PI * 2;
            return {
                position: new THREE.Vector3(
                    Math.cos(angle) * actorRadius,
                    Math.sin(angle) * actorRadius,
                    (Math.random() - 0.5) * 2
                ),
                velocity: new THREE.Vector3(),
                activation: 0,
            };
        });

        // Dialectic nodes in inner mesh (layered by category)
        const categories = ['disc', 'ocean', 'dark_triad', 'bias', 'lacanian'];
        dialecticPhysics.current = dialecticNodes.map((node, i) => {
            const catIndex = categories.indexOf(node.category);
            const catNodes = dialecticNodes.filter(n => n.category === node.category);
            const inCatIndex = catNodes.findIndex(n => n.id === node.id);
            const catRadius = 3 + catIndex * 1.5;
            const angle = (inCatIndex / catNodes.length) * Math.PI * 2 + catIndex * 0.5;

            return {
                position: new THREE.Vector3(
                    Math.cos(angle) * catRadius,
                    Math.sin(angle) * catRadius,
                    (catIndex - 2) * 0.5
                ),
                velocity: new THREE.Vector3(),
                activation: 0,
            };
        });

        actorRefs.current = actorRefs.current.slice(0, actorNodes.length);
        dialecticRefs.current = dialecticRefs.current.slice(0, dialecticNodes.length);
    }, [actorNodes, dialecticNodes]);

    // Compute traversal path when speaker changes
    useEffect(() => {
        if (!script?.speaker) {
            setActiveTraversal([]);
            setCurrentHop(0);
            return;
        }

        const speakerNode = actorNodes.find(a =>
            a.label.toLowerCase().includes(script.speaker.toLowerCase())
        );

        if (!speakerNode) return;

        // Analyze text to find target actor
        let targetNode: ActorNode | undefined;
        const textLower = script.text.toLowerCase() + ' ' + script.analysis.toLowerCase();

        for (const actor of actorNodes) {
            if (actor.id === speakerNode.id) continue;
            const nameLower = actor.label.toLowerCase();
            // Check for name or common aliases
            if (textLower.includes(nameLower) ||
                (nameLower === 'gertrude' && textLower.includes('mother')) ||
                (nameLower === 'claudius' && (textLower.includes('king') || textLower.includes('uncle'))) ||
                (nameLower === 'ghost' && (textLower.includes('father') || textLower.includes('spirit'))) ||
                (nameLower === 'ophelia' && textLower.includes('nymph'))) {
                targetNode = actor;
                break;
            }
        }

        if (targetNode) {
            const path = findDialecticPath(speakerNode, targetNode, dialecticNodes);
            setActiveTraversal(path);
            setCurrentHop(0);
        } else {
            // If no target, just activate the speaker's traits
            const speakerTraits = dialecticNodes
                .filter(d => calculateActorDialecticAffinity(speakerNode, d) > 0.5)
                .map(d => d.id);
            setActiveTraversal([speakerNode.id, ...speakerTraits.slice(0, 3)]);
            setCurrentHop(0);
        }
    }, [script, actorNodes, dialecticNodes]);

    // --- Animation Loop ---
    useFrame((state) => {
        const dt = 0.016;
        const time = state.clock.getElapsedTime();

        // Animate traversal hops
        const hopInterval = 0.4; // seconds per hop
        const newHop = Math.floor((time % (activeTraversal.length * hopInterval)) / hopInterval);
        if (newHop !== currentHop && activeTraversal.length > 0) {
            setCurrentHop(newHop % activeTraversal.length);
        }

        // Calculate psychometric physics from current script
        const psychoPhysics = calculatePsychometricForce(script);

        // Find speaker index
        let speakerIndex = -1;
        if (script?.speaker) {
            speakerIndex = actorNodes.findIndex(n =>
                n.label.toLowerCase().includes(script.speaker.toLowerCase())
            );
        }

        // --- Actor Physics ---
        for (let i = 0; i < actorPhysics.current.length; i++) {
            const physics = actorPhysics.current[i];
            const actor = actorNodes[i];
            if (!physics || !actor) continue;

            // Speaker activation
            if (i === speakerIndex) {
                const targetActivation = 1.0 + psychoPhysics.libido * 2.0;
                physics.activation = THREE.MathUtils.lerp(physics.activation, targetActivation, dt * 5);
                physics.velocity.add(psychoPhysics.forceVector.clone().multiplyScalar(dt * 1.5));
            } else {
                // Check if this actor is in the traversal path
                const inPath = activeTraversal.includes(actor.id);
                const targetAct = inPath ? 0.6 : 0;
                physics.activation = THREE.MathUtils.lerp(physics.activation, targetAct, dt * 3);
            }

            // Clustering forces between actors
            for (let j = i + 1; j < actorPhysics.current.length; j++) {
                const other = actorPhysics.current[j];
                const otherActor = actorNodes[j];
                if (!other || !otherActor) continue;

                const dx = physics.position.x - other.position.x;
                const dy = physics.position.y - other.position.y;
                const distSq = dx * dx + dy * dy + 0.5;

                // Trait-based attraction/repulsion
                const clusterForce = calculateActorClusteringForce(actor, otherActor);

                if (distSq < 100) {
                    // Base repulsion to prevent overlap
                    const baseRepulsion = 2.0 / distSq;
                    // Trait-based modifier
                    const traitMod = clusterForce * 0.5;
                    const totalForce = (baseRepulsion - traitMod) * dt;

                    physics.velocity.x += dx * totalForce;
                    physics.velocity.y += dy * totalForce;
                    other.velocity.x -= dx * totalForce;
                    other.velocity.y -= dy * totalForce;
                }
            }

            // Entropy-based random walk
            const noise = entropy * 0.2;
            physics.velocity.x += (Math.random() - 0.5) * noise;
            physics.velocity.y += (Math.random() - 0.5) * noise;

            // Orbital containment (keep actors in outer ring)
            const currentDist = Math.sqrt(physics.position.x ** 2 + physics.position.y ** 2);
            const targetDist = 10;
            const orbitalForce = (targetDist - currentDist) * 0.02;
            const angle = Math.atan2(physics.position.y, physics.position.x);
            physics.velocity.x += Math.cos(angle) * orbitalForce;
            physics.velocity.y += Math.sin(angle) * orbitalForce;

            // Damping
            physics.velocity.multiplyScalar(0.92);

            // Integrate
            physics.position.add(physics.velocity.clone().multiplyScalar(dt));

            // Update mesh
            const ref = actorRefs.current[i];
            if (ref) {
                ref.position.copy(physics.position);
                const baseScale = 1.2 + actor.mass * 0.2;
                const scale = baseScale + physics.activation * 0.5;
                ref.scale.setScalar(scale);
            }
        }

        // --- Dialectic Node Physics ---
        for (let i = 0; i < dialecticPhysics.current.length; i++) {
            const physics = dialecticPhysics.current[i];
            const node = dialecticNodes[i];
            if (!physics || !node) continue;

            // Activate if in traversal path
            const pathIndex = activeTraversal.indexOf(node.id);
            const isActive = pathIndex >= 0 && pathIndex <= currentHop;
            const isPulsing = pathIndex === currentHop;

            physics.activation = THREE.MathUtils.lerp(
                physics.activation,
                isPulsing ? 1.0 : isActive ? 0.5 : 0.1,
                dt * 8
            );

            // Subtle breathing motion for dialectic nodes
            const breathe = Math.sin(time * 2 + i * 0.5) * 0.1;
            physics.position.z = (physics.position.z || 0) + breathe * dt;

            // Light attraction to center
            physics.velocity.sub(physics.position.clone().multiplyScalar(0.01 * dt));
            physics.velocity.multiplyScalar(0.98);
            physics.position.add(physics.velocity.clone().multiplyScalar(dt));

            // Update mesh
            const ref = dialecticRefs.current[i];
            if (ref) {
                ref.position.copy(physics.position);
                const scale = 0.4 + physics.activation * 0.3;
                ref.scale.setScalar(scale);
            }
        }
    });

    // --- Build edge lines for traversal ---
    const traversalEdges = useMemo(() => {
        if (activeTraversal.length < 2) return [];

        const edges: Array<{ from: THREE.Vector3; to: THREE.Vector3; active: boolean; hopIndex: number }> = [];

        for (let i = 0; i < activeTraversal.length - 1; i++) {
            const fromId = activeTraversal[i];
            const toId = activeTraversal[i + 1];

            // Find positions
            let fromPos: THREE.Vector3 | null = null;
            let toPos: THREE.Vector3 | null = null;

            // Check actors
            const fromActorIdx = actorNodes.findIndex(a => a.id === fromId);
            const toActorIdx = actorNodes.findIndex(a => a.id === toId);

            if (fromActorIdx >= 0 && actorPhysics.current[fromActorIdx]) {
                fromPos = actorPhysics.current[fromActorIdx].position.clone();
            }
            if (toActorIdx >= 0 && actorPhysics.current[toActorIdx]) {
                toPos = actorPhysics.current[toActorIdx].position.clone();
            }

            // Check dialectic nodes
            const fromDialIdx = dialecticNodes.findIndex(d => d.id === fromId);
            const toDialIdx = dialecticNodes.findIndex(d => d.id === toId);

            if (fromDialIdx >= 0 && dialecticPhysics.current[fromDialIdx]) {
                fromPos = dialecticPhysics.current[fromDialIdx].position.clone();
            }
            if (toDialIdx >= 0 && dialecticPhysics.current[toDialIdx]) {
                toPos = dialecticPhysics.current[toDialIdx].position.clone();
            }

            if (fromPos && toPos) {
                edges.push({
                    from: fromPos,
                    to: toPos,
                    active: i <= currentHop,
                    hopIndex: i,
                });
            }
        }

        return edges;
    }, [activeTraversal, currentHop, actorNodes, dialecticNodes]);

    return (
        <group>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.8} color="#fbbf24" />
            <pointLight position={[-10, -10, 5]} intensity={0.5} color="#3b82f6" />

            {/* Dialectic Mesh Edges (static background) */}
            {DIALECTIC_MESH_EDGES.map((edge, i) => {
                const sourceIdx = dialecticNodes.findIndex(d => d.id === edge.source);
                const targetIdx = dialecticNodes.findIndex(d => d.id === edge.target);
                if (sourceIdx < 0 || targetIdx < 0) return null;
                const sourcePos = dialecticPhysics.current[sourceIdx]?.position;
                const targetPos = dialecticPhysics.current[targetIdx]?.position;
                if (!sourcePos || !targetPos) return null;

                return (
                    <line key={`mesh-${i}`}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={2}
                                args={[new Float32Array([
                                    sourcePos.x, sourcePos.y, sourcePos.z,
                                    targetPos.x, targetPos.y, targetPos.z
                                ]), 3]}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color="#334155" transparent opacity={0.2} />
                    </line>
                );
            })}

            {/* Active Traversal Edges */}
            {traversalEdges.map((edge, i) => (
                <line key={`trav-${i}`}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={2}
                            args={[new Float32Array([
                                edge.from.x, edge.from.y, edge.from.z,
                                edge.to.x, edge.to.y, edge.to.z
                            ]), 3]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial
                        color={edge.active ? '#fbbf24' : '#64748b'}
                        transparent
                        opacity={edge.active ? 0.9 : 0.3}
                        linewidth={edge.active ? 3 : 1}
                    />
                </line>
            ))}

            {/* Dialectic Nodes (inner mesh) */}
            {dialecticNodes.map((node, i) => (
                <group
                    key={node.id}
                    ref={el => (dialecticRefs.current[i] = el)}
                    position={[0, 0, 0]}
                >
                    <Sphere args={[1, 16, 16]}>
                        <meshStandardMaterial
                            color={node.color}
                            transparent
                            opacity={0.4 + (dialecticPhysics.current[i]?.activation || 0) * 0.5}
                            emissive={node.color}
                            emissiveIntensity={(dialecticPhysics.current[i]?.activation || 0) * 0.8}
                            roughness={0.5}
                            metalness={0.3}
                        />
                    </Sphere>
                    {(dialecticPhysics.current[i]?.activation || 0) > 0.3 && (
                        <Html position={[0, 0.8, 0]} center style={{ pointerEvents: 'none' }}>
                            <div className="text-[8px] font-mono px-1 bg-black/70 text-gray-300 rounded whitespace-nowrap">
                                {node.label}
                            </div>
                        </Html>
                    )}
                </group>
            ))}

            {/* Actor Nodes (outer ring) */}
            {actorNodes.map((actor, i) => {
                const physics = actorPhysics.current[i];
                const isSpeaker = script?.speaker?.toLowerCase().includes(actor.label.toLowerCase());

                return (
                    <group
                        key={actor.id}
                        ref={el => (actorRefs.current[i] = el)}
                        position={physics?.position ? [physics.position.x, physics.position.y, physics.position.z] : [0, 0, 0]}
                    >
                        {/* Main actor sphere */}
                        <Sphere args={[1, 32, 32]}>
                            <meshStandardMaterial
                                color={isSpeaker ? '#fbbf24' : '#22c55e'}
                                emissive={isSpeaker ? '#fbbf24' : '#22c55e'}
                                emissiveIntensity={(physics?.activation || 0) * 1.5}
                                roughness={0.3}
                                metalness={0.7}
                            />
                        </Sphere>

                        {/* DISC trait indicators orbiting the actor */}
                        <group rotation={[0, 0, Date.now() * 0.0003]}>
                            <TraitIndicator trait="D" value={actor.disc.D} angle={0} distance={1.5} />
                            <TraitIndicator trait="I" value={actor.disc.I} angle={Math.PI / 2} distance={1.5} />
                            <TraitIndicator trait="S" value={actor.disc.S} angle={Math.PI} distance={1.5} />
                            <TraitIndicator trait="C" value={actor.disc.C} angle={Math.PI * 1.5} distance={1.5} />
                        </group>

                        {/* Dark Triad ring (if significant) */}
                        {(actor.darkTriad.narcissism > 0.5 || actor.darkTriad.machiavellianism > 0.5 || actor.darkTriad.psychopathy > 0.5) && (
                            <Ring args={[1.2, 1.35, 32]} rotation={[Math.PI / 2, 0, 0]}>
                                <meshBasicMaterial
                                    color="#7f1d1d"
                                    transparent
                                    opacity={0.4 + (actor.darkTriad.machiavellianism + actor.darkTriad.narcissism) * 0.3}
                                    side={THREE.DoubleSide}
                                />
                            </Ring>
                        )}

                        {/* Label */}
                        <Html position={[0, 1.8, 0]} center style={{ pointerEvents: 'none' }}>
                            <div className={`text-xs font-mono px-2 py-0.5 rounded whitespace-nowrap ${isSpeaker ? 'bg-yellow-500/90 text-black font-bold' : 'bg-black/80 text-gray-300'}`}>
                                {actor.label}
                            </div>
                        </Html>
                    </group>
                );
            })}

            <OrbitControls enablePan={true} enableZoom={true} autoRotate autoRotateSpeed={0.2} />
        </group>
    );
}

// --- Export Component ---

export default function MPNExperiment_DialecticGraph({ trauma, entropy, focusLayer, script, scenarioName }: DialecticGraphProps) {
    return (
        <div className="w-full h-full bg-gray-950 rounded-xl relative overflow-hidden border border-white/10">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className="text-[10px] font-mono text-oxot-gold uppercase tracking-widest mb-1">Experiment 9+</div>
                <div className="text-lg font-bold text-white">Dialectic Calculus</div>
                <div className="text-xs text-gray-500">
                    Scenario: {scenarioName || 'Idle'} // Speaker: {script?.speaker || 'None'}
                </div>
                <div className="text-[10px] text-gray-600 mt-1">
                    Actors traverse through psychometric space • DISC/OCEAN/Biases attached
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-[9px] font-mono space-y-1">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-400">Actor Node</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-gray-400">Active Speaker</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500/60" />
                    <span className="text-gray-400">Dialectic Node</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-yellow-500" />
                    <span className="text-gray-400">Active Traversal</span>
                </div>
            </div>

            <Canvas camera={{ position: [0, 0, 25], fov: 50 }} style={{ background: '#030712' }}>
                <color attach="background" args={['#030712']} />
                <DialecticGraphScene
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
