import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';

export default function HeroScene() {
    const pointsRef = useRef();

    // Mobile optimization: reduce particle count drastically to save GPU
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    // Reduced by ~30% for cleaner look
    const particleCount = isMobile ? 600 : 2500;

    const { positions, colors } = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        // Neon Cyber Palette
        const colorPalette = [
            new THREE.Color('#00f7ff'), // cyan (brighter)
            new THREE.Color('#b537f2'), // violet
            new THREE.Color('#ff00ff'), // pink
            new THREE.Color('#4287f5'), // blue
            new THREE.Color('#ffffff')  // white
        ];

        for (let i = 0; i < particleCount; i++) {
            // Galaxy-like wide distribution
            const r = 20 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Assign random color from palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        return { positions, colors };
    }, [particleCount]);

    // Mouse interaction targets
    const targetRotation = useRef(new THREE.Vector2(0, 0));

    useFrame((state, delta) => {
        if (pointsRef.current) {
            // Base slow rotation - reduced by 50%
            pointsRef.current.rotation.x -= delta * 0.025;
            pointsRef.current.rotation.y -= delta * 0.04;

            // Interactive rotation based on mouse pointer - slowed down responsiveness
            targetRotation.current.x += (state.pointer.y * 0.8 - targetRotation.current.x) * 2 * delta;
            targetRotation.current.y += (state.pointer.x * 0.8 - targetRotation.current.y) * 2 * delta;

            pointsRef.current.rotation.x += targetRotation.current.x * (delta * 0.5);
            pointsRef.current.rotation.y += targetRotation.current.y * (delta * 0.5);
        }

        // Add true depth parallax by shifting the camera slightly based on mouse - softened transition
        state.camera.position.x += (state.pointer.x * 2 - state.camera.position.x) * 0.02;
        state.camera.position.y += (state.pointer.y * 2 - state.camera.position.y) * 0.02;
        state.camera.lookAt(0, 0, 0);
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={0.035}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}
