import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';

export default function HeroScene() {
    const pointsRef = useRef();

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isMobile ? 800 : 3000;

    const { positions, colors } = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorPalette = [
            new THREE.Color('#111827'), // geyser black
            new THREE.Color('#374151'), // dark grey
            new THREE.Color('#6b7280'), // grey
            new THREE.Color('#000000')  // pure black
        ];

        for (let i = 0; i < particleCount; i++) {
            const r = 25 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Assign random color from palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            
            // Apply slight randomness to opacity/brightness
            const brightness = 0.5 + Math.random() * 0.5;
            colors[i * 3] = color.r * brightness;
            colors[i * 3 + 1] = color.g * brightness;
            colors[i * 3 + 2] = color.b * brightness;
        }
        return { positions, colors };
    }, [particleCount]);

    const targetRotation = useRef(new THREE.Vector2(0, 0));

    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.x -= delta * 0.015;
            pointsRef.current.rotation.y -= delta * 0.02;

            targetRotation.current.x += (state.pointer.y * 0.5 - targetRotation.current.x) * 2 * delta;
            targetRotation.current.y += (state.pointer.x * 0.5 - targetRotation.current.y) * 2 * delta;

            pointsRef.current.rotation.x += targetRotation.current.x * (delta * 0.3);
            pointsRef.current.rotation.y += targetRotation.current.y * (delta * 0.3);
        }

        state.camera.position.x += (state.pointer.x * 1.5 - state.camera.position.x) * 0.01;
        state.camera.position.y += (state.pointer.y * 1.5 - state.camera.position.y) * 0.01;
        state.camera.lookAt(0, 0, 0);
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={0.025}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.NormalBlending}
                    opacity={0.4}
                />
            </Points>
        </group>
    );
}
