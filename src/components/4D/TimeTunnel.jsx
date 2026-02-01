import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

export default function TimeTunnel(props) {
    const ref = useRef();
    // Use inSphere and stretch it in Z to make a tunnel
    const sphere = random.inSphere(new Float32Array(8000), { radius: 10 });

    useFrame((state, delta) => {
        if (ref.current) {
            // Rotate entire tunnel
            ref.current.rotation.z -= delta / 10;
        }
    });

    return (
        <group rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 10]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}
