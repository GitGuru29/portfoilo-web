import React from 'react';
import { Canvas } from '@react-three/fiber';
import useStore from '../../store/useStore';
import HeroScene from './HeroScene';

export default function CanvasScene() {
    const currentMood = useStore((state) => state.currentMood);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[var(--color-quantum-black)]">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                dpr={[1, 1.5]}
                gl={{ antialias: false }}
            >
                <color attach="background" args={['#ffffff']} />
                {/* HeroScene removed to fix lag and "snowy" effect */}
                <ambientLight intensity={0.5} />
            </Canvas>
        </div>
    );
}
