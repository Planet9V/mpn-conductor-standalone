'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function RibbonModel(props: any) {
    const { scene } = useGLTF('/OXOT_Ribbon.glb');
    const group = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (group.current) {
            group.current.rotation.y += delta * 0.2; // Slow rotation
        }
    });

    return (
        <group ref={group} {...props} dispose={null}>
            {/* Centering and Scaling adjustments - modify these based on actual model size */}
            <primitive object={scene} scale={2.5} position={[0, -1.8, 0]} rotation={[0, 0, 0]} />
        </group>
    );
}

// Preload the model to avoid pop-in
useGLTF.preload('/OXOT_Ribbon.glb');

export function OXOT3DLogo({ className = "w-48 h-48" }: { className?: string }) {
    return (
        <div className={className}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ alpha: true, antialias: true }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />

                    <Float
                        speed={2}
                        rotationIntensity={0.2}
                        floatIntensity={0.2}
                    >
                        <RibbonModel />
                    </Float>

                    {/* Environment map for nice metallic reflections if material is metallic */}
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}
