import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import useStore from '../../store/useStore';
import HeroScene from './HeroScene';

export default function CanvasScene() {
    const currentMood = useStore((state) => state.currentMood);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-black">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <color attach="background" args={['#020202']} />

                {/* We will conditionally render or blend environments based on mood */}
                {currentMood === 'HERO' && <HeroScene />}

                <ambientLight intensity={0.5} />
            </Canvas>
        </div>
    );
}
