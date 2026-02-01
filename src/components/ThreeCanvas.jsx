import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import Hypercube from './4D/Hypercube';
import TimeTunnel from './4D/TimeTunnel';
import Avatar from './4D/Avatar';

function CameraController({ scrollContainer }) {
    const { camera } = useThree();
    const targetZ = useRef(5);

    useFrame((state, delta) => {
        if (!scrollContainer.current) return;

        const container = scrollContainer.current;
        const maxScroll = container.scrollHeight - container.clientHeight;
        const scrollProgress = Math.min(Math.max(container.scrollTop / maxScroll, 0), 1);

        // Move camera from Z=5 to Z=-20 based on scroll
        // This creates the feeling of traveling "into" the tunnel
        const target = 5 - (scrollProgress * 25);

        // Smooth camera movement (Lerp)
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, target, delta * 2);

        // Slight rotation based on scroll for dynamic feel
        camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, scrollProgress * 0.2, delta * 2);
    });

    return null;
}

export default function ThreeCanvas({ scrollContainer }) {
    return (
        <div className="absolute inset-0 w-full h-full bg-black">
            <Canvas gl={{ antialias: true }} camera={{ position: [0, 0, 5], fov: 75 }}>
                <fog attach="fog" args={['#02040a', 2, 15]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />

                {scrollContainer && <CameraController scrollContainer={scrollContainer} />}

                <Suspense fallback={null}>
                    <group position={[0, 0, 0]}>
                        <TimeTunnel />

                        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                            {/* The "Hero" object which stays near the start but creates depth reference */}
                            <Hypercube position={[0, 0, -2]} scale={0.8} />
                        </Float>

                        {/* Distant stars for depth */}
                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                        {/* Floating particles throughout the travel path */}
                        <Sparkles count={200} scale={[10, 10, 30]} position={[0, 0, -10]} size={4} speed={0.4} opacity={0.5} color="#a855f7" />

                        {/* The Traveler */}
                        <Avatar scrollContainer={scrollContainer} />
                    </group>

                    <Environment preset="city" />

                    <EffectComposer>
                        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                        <ChromaticAberration offset={[0.002, 0.002]} />
                        <Noise opacity={0.05} />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    );
}
