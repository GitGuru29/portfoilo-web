import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Trail } from '@react-three/drei';

export default function Avatar({ scrollContainer }) {
    const meshRef = useRef();

    useFrame((state, delta) => {
        // Make the avatar float in front of the camera
        // state.camera.position is already updated by CameraController
        const zOffset = -3;
        const lerpFactor = 0.1;

        if (meshRef.current) {
            // Smoothly follow camera X/Y (which are currently 0, but good for future)
            meshRef.current.position.x = state.camera.position.x;
            meshRef.current.position.y = state.camera.position.y;
            meshRef.current.position.z = state.camera.position.z + zOffset;

            // Rotation animation
            meshRef.current.rotation.x += delta;
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <group ref={meshRef}>
            <Float speed={5} rotationIntensity={2} floatIntensity={1}>
                <mesh>
                    <octahedronGeometry args={[0.3, 0]} />
                    <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} wireframe />
                </mesh>
                <mesh scale={0.5}>
                    <octahedronGeometry args={[0.3, 0]} />
                    <meshStandardMaterial color="white" emissive="white" emissiveIntensity={5} />
                </mesh>
            </Float>

            {/* Light that follows the avatar */}
            <pointLight intensity={2} distance={5} color="#22d3ee" />
        </group>
    );
}
