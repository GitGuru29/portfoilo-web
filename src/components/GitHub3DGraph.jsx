import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Instance, Instances, PointerLockControls, Html } from '@react-three/drei';
import * as THREE from 'three';

const LEVELS = {
    'NONE': { color: '#f1f5f9', emissive: '#f8fafc', intensity: 0.1 },
    'FIRST_QUARTILE': { color: '#bfdbfe', emissive: '#93c5fd', intensity: 0.3 },
    'SECOND_QUARTILE': { color: '#60a5fa', emissive: '#3b82f6', intensity: 0.5 },
    'THIRD_QUARTILE': { color: '#2563eb', emissive: '#1d4ed8', intensity: 0.7 },
    'FOURTH_QUARTILE': { color: '#1e3a8a', emissive: '#1e40af', intensity: 0.9 },
};

const AnimatedMaterial = ({ targetColor, targetEmissive, targetIntensity, targetRoughness, targetMetalness, ...props }) => {
    const ref = useRef();
    const tColor = useMemo(() => new THREE.Color(), []);
    const tEmi = useMemo(() => new THREE.Color(), []);
    
    useFrame((_, delta) => {
        if (!ref.current) return;
        const dt = Math.min(delta, 0.1);
        
        if (targetColor) {
            tColor.set(targetColor);
            ref.current.color.lerp(tColor, dt * 1.5);
        }
        if (targetEmissive) {
            tEmi.set(targetEmissive);
            ref.current.emissive.lerp(tEmi, dt * 1.5);
        }
        if (targetIntensity !== undefined) {
            ref.current.emissiveIntensity = THREE.MathUtils.lerp(ref.current.emissiveIntensity, targetIntensity, dt * 1.5);
        }
        if (targetRoughness !== undefined) {
            ref.current.roughness = THREE.MathUtils.lerp(ref.current.roughness, targetRoughness, dt * 1.5);
        }
        if (targetMetalness !== undefined) {
            ref.current.metalness = THREE.MathUtils.lerp(ref.current.metalness, targetMetalness, dt * 1.5);
        }
    });
    
    return <meshStandardMaterial ref={ref} {...props} />
};

const usePlayerControls = () => {
    const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.code) {
                case "KeyW":
                case "ArrowUp": setMovement(m => ({ ...m, forward: true })); break;
                case "KeyS":
                case "ArrowDown": setMovement(m => ({ ...m, backward: true })); break;
                case "KeyA":
                case "ArrowLeft": setMovement(m => ({ ...m, left: true })); break;
                case "KeyD":
                case "ArrowRight": setMovement(m => ({ ...m, right: true })); break;
            }
        };
        const handleKeyUp = (e) => {
            switch (e.code) {
                case "KeyW":
                case "ArrowUp": setMovement(m => ({ ...m, forward: false })); break;
                case "KeyS":
                case "ArrowDown": setMovement(m => ({ ...m, backward: false })); break;
                case "KeyA":
                case "ArrowLeft": setMovement(m => ({ ...m, left: false })); break;
                case "KeyD":
                case "ArrowRight": setMovement(m => ({ ...m, right: false })); break;
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, []);
    return movement;
};

const CameraRig = ({ mode, isLocked }) => {
    const { camera } = useThree();
    const walkControls = usePlayerControls();
    const targetPos = useRef(new THREE.Vector3());

    useEffect(() => {
        if (mode === "CINEMATIC") {
            camera.rotation.set(0, 0, 0);
        }
    }, [mode, camera]);

    useFrame((state, delta) => {
        if (mode === "CINEMATIC" || mode === "DRONE") {
            const loopDuration = 40;
            const t = (state.clock.elapsedTime % loopDuration) / loopDuration;
            const z = 35 - (t * 70);
            
            let y, lookY;
            if (mode === "DRONE") {
                y = 12.0 + Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
                lookY = 0 + (state.pointer.y * 5);
            } else {
                y = 1.0 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1; 
                lookY = 1.5 + (state.pointer.y * 5);
            }
            
            camera.position.lerp(targetPos.current.set(0, y, z), 0.05);
            const lookX = state.pointer.x * 15;
            camera.lookAt(lookX, lookY, z - 15);
            
        } else if (mode === "WALK" && isLocked) {
            const speed = 15 * delta;
            const frontVector = new THREE.Vector3(0, 0, (walkControls.backward ? 1 : 0) - (walkControls.forward ? 1 : 0));
            const sideVector = new THREE.Vector3((walkControls.left ? 1 : 0) - (walkControls.right ? 1 : 0), 0, 0);
            
            const direction = new THREE.Vector3()
                .subVectors(frontVector, sideVector)
                .normalize()
                .multiplyScalar(speed);
                
            const euler = new THREE.Euler(0, camera.rotation.y, 0);
            direction.applyEuler(euler);
            
            camera.position.add(direction);
            camera.position.y = 1.0; 
        }
    });
    return null;
};

function CityScene({ data, setHoveredBox, activityMultiplier }) {
    const { floors } = useMemo(() => {
        const result = [];
        if (!data || data.length === 0) return { floors: [] };

        const SPACING = 1.0;
        const PATH_WIDTH = 4.0; 
        
        const numWeeks = data.length;
        const numDays = 7;
        
        const totalWidthX = ((numDays - 1) * SPACING) + PATH_WIDTH;
        const totalLengthZ = (numWeeks - 1) * SPACING;
        
        const offX = totalWidthX / 2;
        const offZ = totalLengthZ / 2;
        
        data.forEach((week, wIndex) => {
            const z = (wIndex * SPACING) - offZ;
            week.forEach((day, dIndex) => {
                let x = (dIndex * SPACING);
                if (dIndex > 3) x += PATH_WIDTH;
                x -= offX;
                
                const count = day.contributionCount;
                const level = day.contributionLevel;
                const style = LEVELS[level] || LEVELS["NONE"];
                
                const numFloors = Math.max(1, count);
                const floorHeight = 0.2; 
                
                for (let f = 0; f < numFloors; f++) {
                    const actualHeight = count === 0 ? 0.05 : floorHeight - 0.02;
                    const yPos = count === 0 ? actualHeight / 2 : (f * floorHeight) + (actualHeight / 2);

                    result.push({
                        id: `${wIndex}-${dIndex}`,
                        date: day.date,
                        count: count,
                        position: [x, yPos, -z],
                        scale: [0.8, actualHeight, 0.8],
                        color: style.color,
                        emissive: style.emissive,
                        baseIntensity: style.intensity 
                    });
                }
            });
        });
        
        return { floors: result };
    }, [data]);

    if (floors.length === 0) return null;

    return (
        <group>
            <Instances 
                limit={15000} 
                range={floors.length}
                castShadow
                receiveShadow
                onPointerMove={(e) => {
                    e.stopPropagation();
                    if (e.instanceId !== undefined) {
                        setHoveredBox(floors[e.instanceId]);
                    }
                }}
                onPointerOut={() => setHoveredBox(null)}
            >
                <boxGeometry args={[1, 1, 1]} />
                <AnimatedMaterial 
                    toneMapped={false} 
                    targetRoughness={0.6}
                    targetMetalness={0.2}
                    targetIntensity={0.6 * activityMultiplier}
                />
                {floors.map((floor, i) => (
                    <Instance 
                        key={`${floor.id}-${i}`}
                        position={floor.position}
                        scale={floor.scale}
                        color={floor.color}
                        emissive={floor.emissive} 
                    />
                ))}
            </Instances>
            
            {/* Ground Grid Lines */}
            <gridHelper args={[200, 200, '#94a3b8', '#cbd5e1']} position={[0, 0.02, 0]} material-opacity={0.3} material-transparent />
        </group>
    );
}

export default function GitHub3DGraph({ username }) {
    const [data, setData] = useState(null);
    const [totalContributions, setTotalContributions] = useState(0);
    const [mode, setMode] = useState('CINEMATIC'); 
    const [isLocked, setIsLocked] = useState(false);
    const [hoveredBox, setHoveredBox] = useState(null);

    useEffect(() => {
        fetch(`https://github-contributions-api.deno.dev/${username}.json`)
            .then(res => res.json())
            .then(json => {
                if (json.contributions) {
                    setData(json.contributions);
                    setTotalContributions(json.totalContributions || 0);
                }
            })
            .catch(err => console.error("Failed to fetch GitHub contributions:", err));
    }, [username]);

    const handleWalkClick = () => setMode('WALK');

    const activityMultiplier = useMemo(() => {
        return Math.min(Math.max(totalContributions / 500, 0.3), 2.5);
    }, [totalContributions]);

    return (
        <div className="w-full h-full min-h-[500px] md:min-h-[600px] relative bg-white overflow-hidden rounded-[24px]">
            {!data && (
                <div className="absolute inset-0 flex items-center justify-center text-blue-400 text-xs font-space tracking-widest animate-pulse">
                    INITIALIZING URBAN GRID...
                </div>
            )}

            {data && (
                <>
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-6">
                        <div className="flex justify-between items-start">
                            <div className="text-slate-700 font-mono text-xs tracking-widest bg-white/70 p-3 backdrop-blur-md border border-blue-200/50 rounded-lg shadow-sm">
                                <span className="text-blue-600 font-bold">{username}</span>'s Contributions — {new Date().getFullYear()}
                            </div>
                            <div className="text-slate-800 font-mono text-lg bg-white/70 px-4 py-2 backdrop-blur-md border border-blue-200/50 rounded-lg shadow-sm flex items-center gap-2">
                                {totalContributions} <span className="text-[10px] text-slate-500 uppercase tracking-widest">TOTAL</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div className="flex gap-3 items-center bg-white/70 p-3 backdrop-blur-md border border-blue-200/50 rounded-lg shadow-sm pointer-events-auto">
                                <span className="text-[10px] text-slate-400 font-mono tracking-widest">LESS</span>
                                {Object.values(LEVELS).map((lvl, idx) => (
                                    <div key={idx} className="w-4 h-4 rounded-sm border border-blue-200/50" style={{ backgroundColor: lvl.color }} />
                                ))}
                                <span className="text-[10px] text-slate-400 font-mono tracking-widest">MORE</span>
                            </div>

                            <div className="flex bg-white/70 p-1.5 backdrop-blur-md border border-blue-200/50 rounded-lg shadow-sm pointer-events-auto gap-1">
                                <button 
                                    onClick={() => setMode('CINEMATIC')}
                                    className={`px-4 py-2 font-mono text-[10px] tracking-widest transition-colors rounded-md ${mode === 'CINEMATIC' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
                                >
                                    ◉ STREET
                                </button>
                                <button 
                                    onClick={() => setMode('DRONE')}
                                    className={`px-4 py-2 font-mono text-[10px] tracking-widest transition-colors rounded-md ${mode === 'DRONE' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
                                >
                                    ✈ DRONE
                                </button>
                                <button 
                                    onClick={handleWalkClick}
                                    className={`px-4 py-2 font-mono text-[10px] tracking-widest transition-colors rounded-md ${mode === 'WALK' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
                                >
                                    🚶 WALK
                                </button>
                            </div>
                        </div>
                    </div>

                    {mode === 'WALK' && !isLocked && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-md pointer-events-none">
                            <div className="text-center font-mono text-blue-600 border border-blue-200 p-8 bg-white/90 rounded-2xl shadow-xl">
                                <div className="text-sm mb-4 tracking-[0.2em] uppercase font-bold">CLICK TO ENTER</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-[0.1em]">[WASD] to move, [MOUSE] to look, [ESC] to exit</div>
                            </div>
                        </div>
                    )}
                    
                    {mode === 'WALK' && isLocked && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 text-xl font-light pointer-events-none z-20">+</div>
                    )}

                    <Canvas camera={{ fov: 60 }} shadows>
                        <color attach="background" args={['#f8fafc']} />
                        <fog attach="fog" args={['#f8fafc', 10, 60]} />
                        
                        <ambientLight intensity={0.7} color="#ffffff" />
                        <hemisphereLight intensity={0.5} color="#ffffff" groundColor="#e2e8f0" />
                        <directionalLight 
                            position={[20, 50, -20]} 
                            intensity={1.0} 
                            color="#ffffff"
                            castShadow
                            shadow-mapSize-width={2048}
                            shadow-mapSize-height={2048}
                        />
                        
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                            <planeGeometry args={[1000, 1000]} />
                            <AnimatedMaterial 
                                targetColor="#f1f5f9" 
                                targetRoughness={1.0} 
                                targetMetalness={0.0} 
                            />
                        </mesh>

                        <CityScene data={data} setHoveredBox={setHoveredBox} activityMultiplier={activityMultiplier} />
                        <CameraRig mode={mode} isLocked={isLocked} />
                        
                        {mode === 'WALK' && (
                            <PointerLockControls 
                                onLock={() => setIsLocked(true)} 
                                onUnlock={() => setIsLocked(false)} 
                            />
                        )}

                        {hoveredBox && (
                            <Html position={[hoveredBox.position[0], hoveredBox.position[1] + 0.5, hoveredBox.position[2]]} center className="pointer-events-none z-50">
                                <div className="bg-white border border-blue-200 text-slate-800 font-mono text-[10px] tracking-widest p-3 rounded-lg shadow-[0_8px_30px_rgba(37,99,235,0.12)] whitespace-nowrap uppercase">
                                    <span className="text-blue-600 mb-1 block font-bold">{hoveredBox.date}</span>
                                    {hoveredBox.count} contributions
                                </div>
                            </Html>
                        )}
                    </Canvas>
                </>
            )}
        </div>
    );
}
