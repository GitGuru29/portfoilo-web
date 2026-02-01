import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';

export default function Hypercube(props) {
  const group = useRef();
  const innerRef = useRef();

  useFrame((state, delta) => {
    // Basic 3D rotation
    if (group.current) {
      group.current.rotation.x += delta * 0.2;
      group.current.rotation.y += delta * 0.3;
    }
    // "4D" effect: rotate inner cube at different speed/axis
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.4;
      innerRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group ref={group} {...props}>
      {/* Outer Cube */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#22d3ee" transparent opacity={0.1} wireframe={false} />
        <Edges scale={1} threshold={15} color="#22d3ee" />
      </mesh>

      {/* Inner "Tesseract" Core */}
      <mesh ref={innerRef} scale={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
        <Edges scale={1} threshold={15} color="#d8b4fe" />
      </mesh>

      {/* Connecting lines could be added here for true tesseract geometry, 
          but for now we use nested cubes for the visual effect */}
    </group>
  );
}
