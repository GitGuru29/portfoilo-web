import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';

export default function HeroScene() {
    const ref = useRef();

    // Create random particles for the hero abstract grid/particles
    // Use useMemo to avoid recreating on every render
    const sphere = React.useMemo(() => {
        // Mobile optimization: reduce particle count drastically to save GPU
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const particleCount = isMobile ? 600 : 2000;

        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            // Simple random distribution in a sphere
            const r = 10 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return positions;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#3b82f6"
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}
