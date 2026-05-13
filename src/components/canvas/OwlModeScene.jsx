import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

export default function OwlModeScene({ mood }) {
    const group = useRef();

    // Decide visuals based on the specific mood inside Owl Mode
    const isNetworking = mood === 'NETWORKING';
    const isAI = mood === 'AI'; // Used for NeonMonitor
    const isMobile = mood === 'MOBILE';
    const isOS = mood === 'OS';

    const lineCount = isNetworking ? 120 : (isMobile ? 30 : 60);

    const lines = useMemo(() => {
        // Generate sweeping digital streams
        return Array.from({ length: lineCount }, () => {
            const points = [];
            const zOffset = (Math.random() - 0.5) * 20;
            const xOffset = (Math.random() - 0.5) * 30;
            for (let i = 0; i < 20; i++) {
                points.push(new THREE.Vector3(xOffset, (i * 1.5) - 15, zOffset + Math.sin(i + xOffset) * 2));
            }

            let color = '#8b5cf6'; // Default Owl Mode (purple)
            if (isNetworking) color = '#10b981'; // Green for networking/daemons
            else if (isMobile) color = '#3b82f6'; // Blue for mobile
            else if (isOS) color = '#f59e0b'; // Amber for Low-level/OS/Compilers
            else if (isAI) color = '#ec4899'; // Pink/Neon for monitors

            return {
                points,
                color,
                speed: Math.random() * 0.5 + 0.1
            };
        });
    }, [mood]);

    useFrame((state, delta) => {
        if (group.current) {
            // Flow upwards
            group.current.position.y += delta * 2;
            if (group.current.position.y > 15) {
                group.current.position.y = -15;
            }
        }
    });

    return (
        <group ref={group}>
            {lines.map((line, i) => (
                <Line
                    key={i}
                    points={line.points}
                    color={line.color}
                    lineWidth={1}
                    transparent
                    opacity={0.3}
                />
            ))}
            {/* Subtle glow */}
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} color={lines[0].color} intensity={1} distance={20} />
        </group>
    );
}
