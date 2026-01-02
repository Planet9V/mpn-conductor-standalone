'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useMPNSynthesizer } from './MPNSynthesizer';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';

interface MPNExperimentProps {
    trauma: number;     // Controls Activity (alpha) -> Turbulence
    entropy: number;    // Controls Viscosity/Decay -> Persistence
    focusLayer: number; // Layer index
}

// ----------------------------------------------------------------------------
// 1. SIMULATION SHADER (Q-Tensor Evolution)
// ----------------------------------------------------------------------------
const simulationFragmentShader = `
    uniform vec2 uGridSize;
    uniform float uTrauma; // Activity coeff
    uniform float uEntropy; // Inverse viscosity
    uniform float uTime;

    const float PI = 3.14159265;

    // GPUComputationRenderer convention: uniform sampler2D texture_{variableName}
    // We named our variable 'uTextureQ', so the uniform is 'texture_uTextureQ'
    uniform sampler2D texture_uTextureQ; 
    
    // Pseudo-random
    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
        vec2 uv = gl_FragCoord.xy / uGridSize.xy;
        vec2 texel = 1.0 / uGridSize;

        vec4 data = texture2D(texture_uTextureQ, uv);
        vec2 Q = data.xy;
        vec2 vel = data.zw; // Store velocity in ZW

        // 1. Laplacian of Q (Elastic force)
        vec2 Q_up    = texture2D(texture_uTextureQ, uv + vec2(0.0, texel.y)).xy;
        vec2 Q_down  = texture2D(texture_uTextureQ, uv - vec2(0.0, texel.y)).xy;
        vec2 Q_left  = texture2D(texture_uTextureQ, uv - vec2(texel.x, 0.0)).xy;
        vec2 Q_right = texture2D(texture_uTextureQ, uv + vec2(texel.x, 0.0)).xy;
        
        vec2 laplacianQ = Q_up + Q_down + Q_left + Q_right - 4.0 * Q;
        
        // 2. Active Stress (Simplified)
        // Activity alpha ~ uTrauma. 
        // Force f ~ alpha * div(Q)
        float alpha = 0.5 + uTrauma * 4.0; // range 0.5 to 4.5
        
        // Divergence of Q
        // del.Q = [dQxx/dx + dQxy/dy, dQxy/dx - dQxx/dy] (since Qyy = -Qxx)
        float dQxx_dx = (Q_right.x - Q_left.x) * 0.5;
        float dQxy_dy = (Q_up.y - Q_down.y) * 0.5;
        float dQxy_dx = (Q_right.y - Q_left.y) * 0.5;
        float dQxx_dy = (Q_up.x - Q_down.x) * 0.5;

        vec2 activeForce = alpha * vec2(
            dQxx_dx + dQxy_dy,
            dQxy_dx - dQxx_dy
        );

        // 3. Update Velocity (Damped Navier-Stokes approximation)
        // vel += force - decay
        vel += activeForce * 0.01;
        vel *= (0.99 - uEntropy * 0.05); // Friction/Decay

        // 4. Advect Q
        // Simple semi-Lagrangian-ish or just diffusion
        // Let's rotate Q by local vorticity
        float vorticity = (vel.x * dQxy_dy - vel.y * dQxx_dx) * 2.0;
        
        // Rotate Q tensor: Q' = R Q R^T
        float c = cos(vorticity * 0.1);
        float s = sin(vorticity * 0.1);
        // Rotation matrix R = [c -s; s c]
        // Q = [Qxx Qxy; Qxy -Qxx]
        // Result Qxx element change roughly:
        float nextQxx = c*c*Q.x - 2.0*c*s*Q.y - s*s*Q.x;
        float nextQxy = c*s*Q.x + c*c*Q.y - s*c*Q.x - s*s*Q.y; // approximate

        Q.x += (nextQxx - Q.x) * 0.1 + laplacianQ.x * 0.05;
        Q.y += (nextQxy - Q.y) * 0.1 + laplacianQ.y * 0.05;
        
        // Renormalize to maintain order magnitude
        float mag = length(Q);
        if (mag > 1.0) Q /= mag;
        if (mag < 0.1) Q += (vec2(hash(uv+uTime), hash(uv*2.0)) - 0.5) * 0.01;

        gl_FragColor = vec4(Q, vel);
    }
`;

// ----------------------------------------------------------------------------
// 2. RENDER SHADER (Visualize Director & Defects)
// ----------------------------------------------------------------------------
const renderVertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const renderFragmentShader = `
    uniform sampler2D uTexture;
    uniform vec2 uGridSize;
    uniform float uTrauma;
    varying vec2 vUv;

    // Viridis-ish colormap
    vec3 colormap(float t) {
        return vec3(t * 0.2, t * 0.8, t + 0.2); // Cyan-ish
    }

    void main() {
        vec4 data = texture2D(uTexture, vUv);
        vec2 Q = data.xy;
        float order = length(Q);
        float angle = 0.5 * atan(Q.y, Q.x);

        // Director field lines
        // Create striations based on angle
        vec2 dir = vec2(cos(angle), sin(angle));
        
        // High freq pattern rotated by director
        // p = dot(uv, dir) ?
        // We want to draw lines parallel to dir.
        // Coordinate perpendicular to dir:
        vec2 perp = vec2(-dir.y, dir.x);
        float pattern = sin(dot(vUv * uGridSize, perp) * 0.5);
        
        float intensity = smoothstep(0.0, 0.2, abs(pattern));
        
        vec3 color = mix(vec3(0.05, 0.05, 0.1), vec3(0.1, 0.6, 0.8), intensity * order);

        // Highlight Defects (High gradient of order or angle jumps)
        // Simple proxy: low order parameter often means defect core
        float defect = 1.0 - smoothstep(0.0, 0.3, order);
        if (defect > 0.5) {
            color += vec3(1.0, 0.2, 0.4) * defect; // Red/Pink defects (The Real)
        }

        // Trauma overlay
        if (uTrauma > 0.8) {
             color += vec3(0.2, 0.0, 0.0) * (sin(vUv.y * 100.0) * 0.1);
        }

        gl_FragColor = vec4(color, 1.0);
    }
`;


// ----------------------------------------------------------------------------
// 3. SCENE COMPONENT (R3F Context)
// ----------------------------------------------------------------------------
function NematicDirectorScene({ trauma, entropy, focusLayer }: MPNExperimentProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const { gl } = useThree();
    const synth = useMPNSynthesizer();

    // Simulation State
    const gpuCompute = useMemo(() => new GPUComputationRenderer(128, 128, gl), [gl]);
    const simVariable = useMemo(() => {
        const dtPosition = gpuCompute.createTexture();
        const data = dtPosition.image.data;
        if (data) {
            // Init random Q-tensor
            for (let i = 0; i < data.length; i += 4) {
                const angle = (Math.random() - 0.5) * Math.PI;
                data[i] = Math.cos(2 * angle) * 0.5; // Qxx
                data[i + 1] = Math.sin(2 * angle) * 0.5; // Qxy
                data[i + 2] = 0; // vx
                data[i + 3] = 0; // vy
            }
        }

        // Naming the variable 'uTextureQ' means GPGPU will create uniform 'texture_uTextureQ'
        const v = gpuCompute.addVariable('uTextureQ', simulationFragmentShader, dtPosition);

        // CRITICAL FIX: Set dependencies so the shader can access the variable itself in the next frame
        gpuCompute.setVariableDependencies(v, [v]);

        v.material.uniforms = {
            uTrauma: { value: 0 },
            uEntropy: { value: 0 },
            uTime: { value: 0 },
            uGridSize: { value: new THREE.Vector2(128, 128) }
        };
        v.wrapS = THREE.RepeatWrapping;
        v.wrapT = THREE.RepeatWrapping;
        return v;
    }, [gpuCompute, gl]);

    const uniforms = useMemo(() => ({
        uTexture: { value: null },
        uGridSize: { value: new THREE.Vector2(128, 128) },
        uTrauma: { value: 0 }
    }), []);

    // Defect Analysis Loop
    const lastSonificationTime = useRef(0);
    const initialized = useRef(false);

    useEffect(() => {
        const error = gpuCompute.init();
        if (error !== null) {
            console.error(error);
            initialized.current = false;
        } else {
            initialized.current = true;
        }
        return () => {
            initialized.current = false;
        };
    }, [gpuCompute]);

    useFrame((state) => {
        if (!initialized.current) return;

        const time = state.clock.elapsedTime;

        // 1. Update Simulation
        simVariable.material.uniforms.uTrauma.value = trauma;
        simVariable.material.uniforms.uEntropy.value = entropy;
        simVariable.material.uniforms.uTime.value = time;

        gpuCompute.compute();

        // 2. Read output to Render Material
        const target = gpuCompute.getCurrentRenderTarget(simVariable);
        if (meshRef.current) {
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTexture.value = target.texture;
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTrauma.value = trauma;
        }

        // 3. Simple CPU Readback (Optimization: Very sparse)
        if (time - lastSonificationTime.current > 0.5) { // 2Hz Check
            const eventProb = trauma * 0.8;

            if (Math.random() < eventProb) {
                if (Math.random() > 0.5) {
                    // Creation (Breach/Trauma)
                    synth.playFullOrchestra(
                        trauma + 0.2,
                        entropy,
                        focusLayer
                    );
                } else {
                    // Annihilation (Resolution)
                    synth.playFullOrchestra(
                        trauma * 0.5,
                        entropy,
                        focusLayer
                    );
                }
                lastSonificationTime.current = time;
            }
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[6, 4]} />
            <shaderMaterial
                vertexShader={renderVertexShader}
                fragmentShader={renderFragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

// ----------------------------------------------------------------------------
// 4. MAIN EXPORT (Canvas Wrapper)
// ----------------------------------------------------------------------------
export default function MPNExperiment_NematicDirector(props: MPNExperimentProps) {
    return (
        <React.Fragment>
            <div className="absolute inset-0 bg-gray-950/90" />
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 3], fov: 60 }} style={{ background: '#000000' }}>
                    <color attach="background" args={['#030712']} />
                    <NematicDirectorScene {...props} />
                </Canvas>
            </div>
            {/* Overlay UI */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none select-none">
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Breakthrough Experiment</div>
                <div className="text-lg font-bold text-white">The Nematic Director</div>
                <div className="text-xs text-gray-400">Active Matter Swarm // Topological Defects</div>
            </div>
        </React.Fragment>
    );
}
