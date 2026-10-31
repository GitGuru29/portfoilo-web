import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Instance, Instances, PointerLockControls, Html, Clouds, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const generateWindowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Background: dark concrete
    ctx.fillStyle = '#101217';
    ctx.fillRect(0, 0, 512, 512);
    
    // Grid of windows
    const cols = 12;
    const rows = 24;
    const paddingX = 8;
    const paddingY = 12;
    
    const w = (512 / cols) - paddingX;
    const h = (512 / rows) - paddingY;
    
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const x = c * (w + paddingX) + (paddingX / 2);
            const y = r * (h + paddingY) + (paddingY / 2);
            
            // 50% chance window is on
            if (Math.random() > 0.5) {
                const rand = Math.random();
                if (rand > 0.8) ctx.fillStyle = '#00F0FF'; // accent tint
                else if (rand > 0.6) ctx.fillStyle = '#7fb4ff'; // blue tint
                else ctx.fillStyle = '#f2f1ec'; // warm white
                
                ctx.fillRect(x, y, w, h);
            } else {
                ctx.fillStyle = '#060a10'; // unlit
                ctx.fillRect(x, y, w, h);
            }
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
};
const windowTexture = generateWindowTexture();

const LEVELS = {
    'NONE': { color: '#1a1c22', emissive: '#23262e', intensity: 0.1 },
    'FIRST_QUARTILE': { color: '#6f5a12', emissive: '#8a6d1a', intensity: 0.3 },
    'SECOND_QUARTILE': { color: '#a9851f', emissive: '#c39b29', intensity: 0.45 },
    'THIRD_QUARTILE': { color: '#c9a034', emissive: '#CCFF00', intensity: 0.6 },
    'FOURTH_QUARTILE': { color: '#e6bf4a', emissive: '#00F0FF', intensity: 0.85 },
};

const getVibe = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'MORNING';
    if (hour >= 10 && hour < 16) return 'NOON';
    if (hour >= 16 && hour < 19) return 'EVENING';
    return 'NIGHT';
};

const VIBES = {
    'MORNING': {
        bg: '#08090c',
        fog: '#08090c',
        ambient: { color: '#c9a24a', intensity: 0.25 },
        hemi: { color: '#CCFF00', groundColor: '#0d0f14', intensity: 0.3 },
        directional: { color: '#00F0FF', intensity: 0.7, position: [50, 20, 50] },
        grid: { color: '#1a1c22' },
        planeColor: '#12141a'
    },
    'NOON': {
        bg: '#0d0f14',
        fog: '#0d0f14',
        ambient: { color: '#dfc066', intensity: 0.3 },
        hemi: { color: '#00F0FF', groundColor: '#0d0f14', intensity: 0.35 },
        directional: { color: '#fff3c4', intensity: 0.9, position: [10, 80, 10] },
        grid: { color: '#1d1f26' },
        planeColor: '#14161c'
    },
    'EVENING': {
        bg: '#0a090b',
        fog: '#0a090b',
        ambient: { color: '#a9793a', intensity: 0.25 },
        hemi: { color: '#9aa7c0', groundColor: '#0d0f14', intensity: 0.3 },
        directional: { color: '#e0a44f', intensity: 0.6, position: [-50, 10, -50] },
        grid: { color: '#1c1a18' },
        planeColor: '#14130f'
    },
    'NIGHT': {
        bg: '#07080b',
        fog: '#07080b',
        ambient: { color: '#8a7328', intensity: 0.25 },
        hemi: { color: '#CCFF00', groundColor: '#000000', intensity: 0.25 },
        directional: { color: '#c9a24a', intensity: 0.45, position: [0, 50, 0] },
        grid: { color: '#171920' },
        planeColor: '#101217'
    }
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
    
    return <meshStandardMaterial ref={ref} map={windowTexture} emissiveMap={windowTexture} {...props} />
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
                
                const numFloors = Math.min(Math.max(1, count), 15); // cap at 15 floors for performance
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
                    targetRoughness={0.1}
                    targetMetalness={0.8}
                    targetIntensity={0.8 * activityMultiplier}
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
            <gridHelper args={[200, 200, VIBES[getVibe()].grid.color, VIBES[getVibe()].grid.color]} position={[0, 0.02, 0]} material-opacity={0.3} material-transparent />
        </group>
    );
}

function NatureEnvironment({ vibeKey }) {
    const isNight = vibeKey === 'NIGHT' || vibeKey === 'EVENING';

    const poleZPositions = useMemo(() =>
        Array.from({ length: 14 }, (_, i) => -26 + i * 4), []);

    const waterColor = isNight ? '#0c4a6e' : '#0369a1';

    return (
        <group>
            {/* Flat river */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[23, 0.01, 0]}>
                <planeGeometry args={[12, 120]} />
                <meshStandardMaterial
                    color={waterColor}
                    emissive={isNight ? '#0369a1' : '#38bdf8'}
                    emissiveIntensity={isNight ? 0.25 : 0.05}
                    roughness={0.05} metalness={0.9}
                    transparent opacity={0.92}
                />
            </mesh>

            {/* Street light poles */}
            {poleZPositions.map((z, i) => (
                <group key={i}>
                    <mesh position={[-2.2, 0.75, z]}>
                        <cylinderGeometry args={[0.04, 0.05, 1.5, 6]} />
                        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
                    </mesh>
                    <mesh position={[-2.2, 1.52, z]}>
                        <sphereGeometry args={[0.1, 6, 4]} />
                        <meshStandardMaterial color="#fef9c3" emissive="#fef08a" emissiveIntensity={isNight ? 4 : 0.2} />
                    </mesh>
                    <mesh position={[2.2, 0.75, z]}>
                        <cylinderGeometry args={[0.04, 0.05, 1.5, 6]} />
                        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
                    </mesh>
                    <mesh position={[2.2, 1.52, z]}>
                        <sphereGeometry args={[0.1, 6, 4]} />
                        <meshStandardMaterial color="#fef9c3" emissive="#fef08a" emissiveIntensity={isNight ? 4 : 0.2} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}


export default function GitHub3DGraph({ username }) {
    const [data, setData] = useState(null);
    const [totalContributions, setTotalContributions] = useState(0);
    const [mode, setMode] = useState('CINEMATIC');
    const [isLocked, setIsLocked] = useState(false);
    const [hoveredBox, setHoveredBox] = useState(null);
    const [started, setStarted] = useState(false);
    const vibeKey = useMemo(() => getVibe(), []);
    const vibe = VIBES[vibeKey];

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
        <div className="w-full h-full relative overflow-hidden rounded-none" style={{ background: vibe.bg }}>

            {/* ARCHITECTURAL BLUEPRINT SPLASH — shown until user launches 3D engine */}
            {!started && (
                <div
                    className="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 md:p-10"
                    style={{
                        background: `radial-gradient(circle at 50% 35%, #131c2e 0%, #090b10 100%)`,
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                        `,
                        backgroundSize: '28px 28px',
                    }}
                >
                    {/* Top Blueprint Header */}
                    <div className="w-full flex items-center justify-between border-b border-white/15 pb-3 font-mono text-[9.5px] tracking-[0.24em] uppercase text-white/60">
                        <span>PLATE 04.1 · 3D CONTRIBUTION SKYLINE</span>
                        <span className="text-amber-400">● WEBGL2 INSTANCE ENGINE READY</span>
                    </div>

                    {/* Center Counter & Trigger */}
                    <div className="flex flex-col items-center text-center my-auto py-4">
                        <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-white/50 mb-2">
                            GITHUB TELEMETRY · @{username}
                        </div>
                        <div className="font-display font-bold text-5xl md:text-6xl text-[#f5f2eb] tracking-tight tabular-nums mb-1">
                            {data ? totalContributions : '495'}
                        </div>
                        <div className="font-mono text-[10px] tracking-[0.26em] uppercase text-amber-400/90 mb-6">
                            VERIFIED CONTRIBUTIONS · TRAILING 365 DAYS
                        </div>

                        <button
                            onClick={() => setStarted(true)}
                            disabled={!data}
                            className="group relative px-7 py-3.5 rounded-none border-2 border-[#f5f2eb] bg-[#f5f2eb] text-[#0d0d0d] hover:bg-amber-400 hover:border-amber-400 hover:text-[#0d0d0d] font-mono text-xs tracking-[0.24em] uppercase font-bold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[6px_6px_0_rgba(255,255,255,0.15)]"
                        >
                            {data ? '[ INITIALIZE 3D SKYLINE ENGINE → ]' : '[ SYNCHRONIZING TELEMETRY... ]'}
                        </button>
                    </div>

                    {/* Bottom Blueprint Legend */}
                    <div className="w-full flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-3 font-mono text-[9px] tracking-[0.22em] uppercase text-white/50">
                        <div className="flex items-center gap-5">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-amber-400 inline-block" />
                                TOWER HEIGHT = COMMITS
                            </span>
                            <span className="hidden sm:flex items-center gap-2">
                                <span className="w-2 h-2 bg-sky-400 inline-block" />
                                MODES: STREET · DRONE · FIRST-PERSON WALK
                            </span>
                        </div>
                        <span>{vibeKey} LIGHTING PROFILE</span>
                    </div>
                </div>
            )}

            {/* 3D CANVAS — mounted after user clicks Initialize */}
            {started && (
                <>

                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-4 md:p-6">
                        <div className="flex justify-between items-start gap-3">
                            <div className="text-white/90 font-mono text-[10px] tracking-[0.22em] uppercase bg-black/75 px-3.5 py-2 backdrop-blur-md border border-white/20 rounded-none">
                                <span className="text-amber-400 font-bold">@{username}</span> · CONTRIBUTION SKYLINE
                            </div>
                            <div className="text-white font-mono text-sm bg-black/75 px-3.5 py-1.5 backdrop-blur-md border border-white/20 rounded-none flex items-center gap-2 tabular-nums">
                                <span className="font-bold text-amber-400">{totalContributions}</span>
                                <span className="text-[9px] text-white/60 uppercase tracking-[0.2em]">COMMITS</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
                            <div className="flex gap-2 items-center bg-black/75 px-3 py-2 backdrop-blur-md border border-white/20 rounded-none pointer-events-auto">
                                <span className="text-[9px] text-white/60 font-mono tracking-[0.2em]">LESS</span>
                                {Object.values(LEVELS).map((lvl, idx) => (
                                    <div key={idx} className="w-3.5 h-3.5 rounded-none border border-white/20" style={{ backgroundColor: lvl.color }} />
                                ))}
                                <span className="text-[9px] text-white/60 font-mono tracking-[0.2em]">MORE</span>
                            </div>

                            <div className="flex bg-black/75 p-1 backdrop-blur-md border border-white/20 rounded-none pointer-events-auto gap-1">
                                <button 
                                    onClick={() => setMode('CINEMATIC')}
                                    className={`px-3.5 py-1.5 font-mono text-[9.5px] tracking-[0.2em] uppercase transition-colors rounded-none cursor-pointer ${mode === 'CINEMATIC' ? 'bg-amber-400 text-black font-bold' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                >
                                    ◉ STREET
                                </button>
                                <button 
                                    onClick={() => setMode('DRONE')}
                                    className={`px-3.5 py-1.5 font-mono text-[9.5px] tracking-[0.2em] uppercase transition-colors rounded-none cursor-pointer ${mode === 'DRONE' ? 'bg-amber-400 text-black font-bold' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                >
                                    ✈ DRONE
                                </button>
                                <button 
                                    onClick={handleWalkClick}
                                    className={`px-3.5 py-1.5 font-mono text-[9.5px] tracking-[0.2em] uppercase transition-colors rounded-none cursor-pointer ${mode === 'WALK' ? 'bg-amber-400 text-black font-bold' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                >
                                    🚶 WALK
                                </button>
                            </div>
                        </div>
                    </div>

                    {mode === 'WALK' && !isLocked && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-md pointer-events-none">
                            <div className="text-center font-mono text-amber-400 border border-white/25 p-8 bg-[#0c0d11]/95 rounded-none shadow-2xl">
                                <div className="text-xs mb-3 tracking-[0.25em] uppercase font-bold">CLICK CANVAS TO ENTER WALK MODE</div>
                                <div className="text-[10px] text-white/70 uppercase tracking-[0.16em]">[WASD] MOVE · [MOUSE] LOOK · [ESC] EXIT</div>
                            </div>
                        </div>
                    )}
                    
                    {mode === 'WALK' && isLocked && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent text-xl font-light pointer-events-none z-20">+</div>
                    )}

                    <Canvas
                        camera={{ fov: 55 }}
                        gl={{ antialias: true, powerPreference: 'high-performance' }}
                        dpr={Math.min(window.devicePixelRatio, 1.5)}
                    >
                        <color attach="background" args={[vibe.bg]} />
                        <fog attach="fog" args={[vibe.fog, 30, 100]} />

                        <ambientLight intensity={vibe.ambient.intensity} color={vibe.ambient.color} />
                        <hemisphereLight intensity={vibe.hemi.intensity} color={vibe.hemi.color} groundColor={vibe.hemi.groundColor} />
                        <directionalLight
                            position={vibe.directional.position}
                            intensity={vibe.directional.intensity}
                            color={vibe.directional.color}
                        />
                        
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                            <planeGeometry args={[500, 500]} />
                            <meshStandardMaterial color={vibe.planeColor} roughness={1} metalness={0} />
                        </mesh>

                        {/* Wide grass area beside city */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-25, 0.005, 0]}>
                            <planeGeometry args={[40, 200]} />
                            <meshStandardMaterial color={vibeKey === 'NIGHT' ? '#14532d' : '#15803d'} roughness={1} />
                        </mesh>
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12, 0.005, 0]}>
                            <planeGeometry args={[6, 200]} />
                            <meshStandardMaterial color={vibeKey === 'NIGHT' ? '#14532d' : '#15803d'} roughness={1} />
                        </mesh>

                        <CityScene data={data} setHoveredBox={setHoveredBox} activityMultiplier={activityMultiplier} />
                        <NatureEnvironment vibeKey={vibeKey} />
                        <CameraRig mode={mode} isLocked={isLocked} />
                        
                        {mode === 'WALK' && (
                            <PointerLockControls 
                                onLock={() => setIsLocked(true)} 
                                onUnlock={() => setIsLocked(false)} 
                            />
                        )}

                        {hoveredBox && (
                            <Html position={[hoveredBox.position[0], hoveredBox.position[1] + 0.5, hoveredBox.position[2]]} center className="pointer-events-none z-50">
                                <div className="bg-[#0c0d11]/95 border border-accent/25 text-geyser font-mono text-[10px] tracking-widest p-3 rounded-lg shadow-[0_8px_30px_rgba(204,255,0,0.15)] whitespace-nowrap uppercase">
                                    <span className="text-accent mb-1 block font-bold">{hoveredBox.date}</span>
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
