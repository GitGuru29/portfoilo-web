import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Instance, Instances, PointerLockControls, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';

const LEVELS = {
    'NONE': { color: '#00111a', emissive: '#004466', intensity: 0.4 },
    'FIRST_QUARTILE': { color: '#002a3a', emissive: '#0088cc', intensity: 1.5 },
    'SECOND_QUARTILE': { color: '#005577', emissive: '#00d4ff', intensity: 2.5 },
    'THIRD_QUARTILE': { color: '#0088cc', emissive: '#00f3ff', intensity: 3.5 },
    'FOURTH_QUARTILE': { color: '#00f3ff', emissive: '#ffffff', intensity: 5.0 },
};

const TIMELINE_STATES = {
    SUNRISE: {
        sky: '#FFB6A3',       
        ground: '#D18D77',
        ambient: '#ffdfd6',
        ambientIntensity: 1.0,
        hemiSky: '#FFA07A',
        hemiGround: '#E9967A',
        hemiIntensity: 1.5,
        dirColor: '#FF7F50',
        dirIntensity: 2.5,
        dirPosition: [40, 10, -20],
        neonMultiplier: 0.5,
        treeColor: '#FF8C00',
        riverColor: '#003366'
    },
    DAY: {
        sky: '#EAF4FF',       
        ground: '#DDE7F0',
        ambient: '#ffffff',
        ambientIntensity: 1.8,
        hemiSky: '#ffffff',
        hemiGround: '#B0C4DE',
        hemiIntensity: 2.0,
        dirColor: '#ffffff',
        dirIntensity: 4.0,
        dirPosition: [10, 50, -20],
        neonMultiplier: 0.1, 
        treeColor: '#32CD32',
        riverColor: '#0055aa'
    },
    SUNSET: {
        sky: '#6A2A5A',       
        ground: '#2A1625',
        ambient: '#FFA07A',
        ambientIntensity: 0.8,
        hemiSky: '#9932CC',
        hemiGround: '#8B0000',
        hemiIntensity: 1.5,
        dirColor: '#FF4500',
        dirIntensity: 4.5,
        dirPosition: [-40, 5, 20],
        neonMultiplier: 0.8,
        treeColor: '#FF1493',
        riverColor: '#002244'
    },
    NIGHT: {
        sky: '#030508',       
        ground: '#020305',
        ambient: '#aaccff',
        ambientIntensity: 0.5,
        hemiSky: '#ffffff',
        hemiGround: '#004466',
        hemiIntensity: 0.8,
        dirColor: '#e0f0ff',
        dirIntensity: 1.5,
        dirPosition: [20, 40, -20],
        neonMultiplier: 1.5,
        treeColor: '#00ff66',
        riverColor: '#001122'
    }
};

const getCurrentTimeState = () => {
    if (window.__TEST_TIME_STATE) return window.__TEST_TIME_STATE;
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) return 'SUNRISE';
    if (hour >= 8 && hour < 17) return 'DAY';
    if (hour >= 17 && hour < 20) return 'SUNSET';
    return 'NIGHT';
};

// --- ANIMATION COMPONENTS ---

const EnvironmentAnimator = ({ timeState }) => {
    const { scene } = useThree();
    const target = TIMELINE_STATES[timeState];
    
    const ambientRef = useRef();
    const hemiRef = useRef();
    const dirMainRef = useRef();
    const dirSecondaryRef = useRef();

    const targetSky = useMemo(() => new THREE.Color(), []);
    const targetAmbient = useMemo(() => new THREE.Color(), []);
    const targetHemiSky = useMemo(() => new THREE.Color(), []);
    const targetHemiGround = useMemo(() => new THREE.Color(), []);
    const targetDirColor = useMemo(() => new THREE.Color(), []);

    useFrame((state, delta) => {
        const dt = Math.min(delta, 0.1); 
        
        targetSky.set(target.sky);
        targetAmbient.set(target.ambient);
        targetHemiSky.set(target.hemiSky);
        targetHemiGround.set(target.hemiGround);
        targetDirColor.set(target.dirColor);

        if (scene.background) scene.background.lerp(targetSky, dt * 1.5);
        if (scene.fog) scene.fog.color.lerp(targetSky, dt * 1.5);

        if (ambientRef.current) {
            ambientRef.current.color.lerp(targetAmbient, dt * 1.5);
            ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, target.ambientIntensity, dt * 1.5);
        }
        if (hemiRef.current) {
            hemiRef.current.color.lerp(targetHemiSky, dt * 1.5);
            hemiRef.current.groundColor.lerp(targetHemiGround, dt * 1.5);
            hemiRef.current.intensity = THREE.MathUtils.lerp(hemiRef.current.intensity, target.hemiIntensity, dt * 1.5);
        }
        if (dirMainRef.current) {
            dirMainRef.current.color.lerp(targetDirColor, dt * 1.5);
            dirMainRef.current.intensity = THREE.MathUtils.lerp(dirMainRef.current.intensity, target.dirIntensity, dt * 1.5);
            dirMainRef.current.position.lerp(new THREE.Vector3(...target.dirPosition), dt * 0.5);
        }
        if (dirSecondaryRef.current) {
            const secIntensity = timeState === "NIGHT" ? 1.0 : 0.2;
            dirSecondaryRef.current.intensity = THREE.MathUtils.lerp(dirSecondaryRef.current.intensity, secIntensity, dt * 1.5);
        }
    });

    return (
        <>
            <ambientLight ref={ambientRef} intensity={0} color="#000" />
            <hemisphereLight ref={hemiRef} intensity={0} color="#000" groundColor="#000" />
            <directionalLight 
                ref={dirMainRef} 
                position={[0, 50, 0]} 
                intensity={0} 
                color="#000"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={0.5}
                shadow-camera-far={150}
                shadow-camera-left={-50}
                shadow-camera-right={50}
                shadow-camera-top={50}
                shadow-camera-bottom={-50}
                shadow-bias={-0.0005}
            />
            <directionalLight ref={dirSecondaryRef} position={[-20, 30, 20]} intensity={0} color="#00f3ff" />
        </>
    );
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

// --- LOGIC ---

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
        if (mode === "CINEMATIC") {
            const loopDuration = 40;
            const t = (state.clock.elapsedTime % loopDuration) / loopDuration;
            const z = 35 - (t * 70);
            const y = 2.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.4; 
            
            camera.position.lerp(targetPos.current.set(0, y, z), 0.05);
            camera.lookAt(0, 1, z - 15);
            
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
            camera.position.y = 1.8; 
        }
    });
    return null;
};

function CityScene({ data, setHoveredBox, timeState, activityMultiplier }) {
    const target = TIMELINE_STATES[timeState];

    const windowTexture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 32;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 64, 32);
        ctx.fillStyle = "#ffffff";
        for(let i=0; i<4; i++) {
            ctx.fillRect(4 + (i * 15), 6, 10, 20);
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.magFilter = THREE.NearestFilter;
        return tex;
    }, []);

    const { floors, pathZLength, offsetX, offsetZ, streetLights, poles, heads } = useMemo(() => {
        const result = [];
        if (!data || data.length === 0) return { floors: [], pathZLength: 0, offsetX: 0, offsetZ: 0, streetLights: [], poles: [], heads: [] };

        const SPACING = 1.0;
        const PATH_WIDTH = 2.0;
        
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
                const floorHeight = 0.3;
                
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
        
        const lights = [];
        const poles = [];
        const heads = [];
        for (let z = -offZ; z <= offZ; z += 8) {
            lights.push(-z);
            poles.push({ position: [-1.2, 0.5, -z], scale: [0.05, 1, 0.05], color: "#222222" });
            heads.push({ position: [-1.2, 1.05, -z], scale: [0.3, 0.1, 0.3] });
            poles.push({ position: [1.2, 0.5, -z], scale: [0.05, 1, 0.05], color: "#222222" });
            heads.push({ position: [1.2, 1.05, -z], scale: [0.3, 0.1, 0.3] });
        }
        
        return { floors: result, pathZLength: totalLengthZ, offsetX: offX, offsetZ: offZ, streetLights: lights, poles, heads };
    }, [data]);

    const bushes = useMemo(() => {
        if (!offsetZ) return [];
        const items = [];
        for (let i = 0; i < 80; i++) {
            const z = (Math.random() * (offsetZ * 2)) - offsetZ;
            const x = Math.random() > 0.5 ? -1.6 : 1.6; 
            const scale = 0.4 + Math.random() * 0.4;
            items.push({
                position: [x + (Math.random() * 0.4 - 0.2), 0.2 * scale, z],
                scale: [scale, scale, scale]
            });
        }
        for (let i = 0; i < 300; i++) {
            let x = (Math.random() * 80) - 40;
            if (x > -6 && x < 6) x = x > 0 ? x + 6 : x - 6;
            if ((x > 8 && x < 18) || (x < -8 && x > -18)) x = x > 0 ? x + 10 : x - 10;
            
            const z = (Math.random() * 100) - 50;
            const scale = 0.5 + Math.random() * 1.2;
            items.push({
                position: [x, 0.2 * scale, z],
                scale: [scale, scale, scale]
            });
        }
        return items;
    }, [offsetZ]);

    const { leftRiverCurve, rightRiverCurve } = useMemo(() => {
        if (!offsetZ) return { leftRiverCurve: null, rightRiverCurve: null };
        const leftPoints = [];
        const rightPoints = [];
        for (let z = offsetZ + 40; z >= -offsetZ - 40; z -= 5) {
            const xLeft = -15 + Math.sin(z * 0.15) * 4 + (Math.random() * 1);
            const xRight = 15 + Math.sin(z * 0.12 + Math.PI) * 5 + (Math.random() * 1);
            leftPoints.push(new THREE.Vector3(xLeft, 0, z));
            rightPoints.push(new THREE.Vector3(xRight, 0, z));
        }
        return {
            leftRiverCurve: new THREE.CatmullRomCurve3(leftPoints),
            rightRiverCurve: new THREE.CatmullRomCurve3(rightPoints)
        };
    }, [offsetZ]);

    if (floors.length === 0) return null;

    return (
        <group>
            {/* Skyscraper Blocks */}
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
                    emissiveMap={windowTexture} 
                    targetRoughness={0.2}
                    targetMetalness={0.8}
                    targetIntensity={target.neonMultiplier * activityMultiplier}
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
            
            {/* The Glowing Central Path Strip */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[1.5, pathZLength + 10]} />
                <AnimatedMaterial 
                    targetColor="#00f3ff" 
                    targetEmissive="#00f3ff" 
                    targetIntensity={(target.neonMultiplier * activityMultiplier) * 0.2} 
                    transparent 
                    opacity={0.15} 
                    toneMapped={false} 
                />
            </mesh>
            
            {/* Winding Cyber-Rivers */}
            {leftRiverCurve && (
                <mesh position={[0, 0.005, 0]} scale={[1, 0.01, 1]} receiveShadow>
                    <tubeGeometry args={[leftRiverCurve, 100, 3, 12, false]} />
                    <AnimatedMaterial 
                        targetColor={target.riverColor}
                        targetRoughness={0.1} 
                        targetMetalness={0.5} 
                        targetEmissive="#00f3ff" 
                        targetIntensity={(target.neonMultiplier * activityMultiplier) * 0.5 + 0.2} 
                    />
                </mesh>
            )}
            {rightRiverCurve && (
                <mesh position={[0, 0.005, 0]} scale={[1, 0.01, 1]} receiveShadow>
                    <tubeGeometry args={[rightRiverCurve, 100, 3.5, 12, false]} />
                    <AnimatedMaterial 
                        targetColor={target.riverColor}
                        targetRoughness={0.1} 
                        targetMetalness={0.5} 
                        targetEmissive="#00f3ff" 
                        targetIntensity={(target.neonMultiplier * activityMultiplier) * 0.5 + 0.2} 
                    />
                </mesh>
            )}
            
            {/* Lamppost Poles */}
            <Instances range={poles.length} limit={100} castShadow>
                <cylinderGeometry args={[1, 1, 1, 8]} />
                <AnimatedMaterial targetColor="#111111" targetMetalness={0.8} targetRoughness={0.2} />
                {poles.map((p, i) => <Instance key={`pole-${i}`} position={p.position} scale={p.scale} />)}
            </Instances>

            {/* Lamppost Heads (Glowing Orange) */}
            <Instances range={heads.length} limit={100}>
                <boxGeometry args={[1, 1, 1]} />
                <AnimatedMaterial 
                    targetColor="#ffffff" 
                    targetEmissive="#ff8800" 
                    targetIntensity={target.neonMultiplier * 3.0} 
                    toneMapped={false} 
                />
                {heads.map((h, i) => <Instance key={`head-${i}`} position={h.position} scale={h.scale} />)}
            </Instances>

            {/* Orange Urban Streetlights mapping the path */}
            {streetLights.map((z, i) => (
                <pointLight key={i} position={[0, 1.0, z]} intensity={target.neonMultiplier * 1.5} color="#ff8800" distance={8} decay={2} />
            ))}
            
            {/* Scattered Urban Bushes / Trees */}
            <Instances range={bushes.length} limit={500} castShadow receiveShadow>
                <icosahedronGeometry args={[0.4, 1]} />
                <AnimatedMaterial targetColor={target.treeColor} targetRoughness={0.9} />
                {bushes.map((bush, i) => (
                    <Instance
                        key={`bush-${i}`}
                        position={bush.position}
                        scale={bush.scale}
                    />
                ))}
            </Instances>

            {/* Ground Grid Lines */}
            <gridHelper args={[200, 200, '#00f3ff', '#00f3ff']} position={[0, 0.02, 0]} material-opacity={0.05} material-transparent />
        </group>
    );
}

export default function GitHub3DGraph({ username }) {
    const [data, setData] = useState(null);
    const [totalContributions, setTotalContributions] = useState(0);
    const [mode, setMode] = useState('CINEMATIC'); 
    const [isLocked, setIsLocked] = useState(false);
    const [hoveredBox, setHoveredBox] = useState(null);
    const [timeState, setTimeState] = useState(getCurrentTimeState());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeState(getCurrentTimeState());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

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

    useEffect(() => {
        const handleT = (e) => {
            if (e.key === 't' || e.key === 'T') {
                const states = ['SUNRISE', 'DAY', 'SUNSET', 'NIGHT'];
                setTimeState(prev => {
                    const next = states[(states.indexOf(prev) + 1) % states.length];
                    window.__TEST_TIME_STATE = next; 
                    return next;
                });
            }
        };
        window.addEventListener('keydown', handleT);
        return () => window.removeEventListener('keydown', handleT);
    }, []);

    const currentTarget = TIMELINE_STATES[timeState];

    return (
        <div className="w-full h-full min-h-[500px] md:min-h-[600px] relative rounded-lg overflow-hidden bg-[#030508] border border-white/5">
            {!data && (
                <div className="absolute inset-0 flex items-center justify-center text-cyber-cyan text-xs font-space animate-pulse">
                    INITIALIZING URBAN GRID...
                </div>
            )}

            {data && (
                <>
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-6">
                        <div className="flex justify-between items-start">
                            <div className="text-white font-mono text-sm tracking-widest bg-black/50 p-2 rounded backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                <span className="text-cyber-cyan">{username}</span>'s Contributions — {new Date().getFullYear()}
                                <span className="ml-4 text-xs opacity-50">[{timeState}] (Press T)</span>
                            </div>
                            <div className="text-white font-mono text-xl font-bold bg-black/50 px-4 py-2 rounded backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                {totalContributions} <span className="text-xs text-gray-400 font-normal">TOTAL</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="flex gap-2 items-center bg-black/50 p-3 rounded backdrop-blur-md border border-white/10 pointer-events-auto shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                <span className="text-xs text-gray-400 font-mono mr-2">LESS</span>
                                {Object.values(LEVELS).map((lvl, idx) => (
                                    <div key={idx} className="w-4 h-4 rounded-sm border border-white/10" style={{ backgroundColor: lvl.intensity > 0 ? lvl.emissive : lvl.color, boxShadow: lvl.intensity > 0 ? `0 0 10px ${lvl.emissive}` : 'none' }} />
                                ))}
                                <span className="text-xs text-gray-400 font-mono ml-2">MORE</span>
                            </div>

                            <div className="flex bg-black/50 p-1 rounded backdrop-blur-md border border-white/10 pointer-events-auto shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                <button 
                                    onClick={() => setMode('CINEMATIC')}
                                    className={`px-4 py-2 font-mono text-xs tracking-widest rounded transition-colors ${mode === 'CINEMATIC' ? 'bg-cyber-cyan text-black font-bold shadow-[0_0_15px_rgba(0,243,255,0.5)]' : 'text-gray-400 hover:text-white'}`}
                                >
                                    ◉ CINEMATIC
                                </button>
                                <button 
                                    onClick={handleWalkClick}
                                    className={`px-4 py-2 font-mono text-xs tracking-widest rounded transition-colors ${mode === 'WALK' ? 'bg-cyber-cyan text-black font-bold shadow-[0_0_15px_rgba(0,243,255,0.5)]' : 'text-gray-400 hover:text-white'}`}
                                >
                                    WASD WALK
                                </button>
                            </div>
                        </div>
                    </div>

                    {mode === 'WALK' && !isLocked && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
                            <div className="text-center font-mono text-cyber-cyan border border-cyber-cyan/30 p-6 rounded bg-black/80 shadow-[0_0_30px_rgba(0,243,255,0.2)]">
                                <div className="text-lg mb-2 tracking-widest font-bold">CLICK TO ENTER</div>
                                <div className="text-xs text-gray-400">[WASD] to move, [MOUSE] to look, [ESC] to exit</div>
                            </div>
                        </div>
                    )}
                    
                    {mode === 'WALK' && isLocked && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 text-xl font-light pointer-events-none z-20">+</div>
                    )}

                    <Canvas camera={{ fov: 60 }} shadows>
                        <color attach="background" args={['#000']} />
                        <fog attach="fog" args={['#000', 10, 60]} />
                        
                        <EnvironmentAnimator timeState={timeState} />
                        
                        {(timeState === 'NIGHT' || timeState === 'SUNSET' || timeState === 'SUNRISE') && (
                            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                        )}
                        
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                            <planeGeometry args={[1000, 1000]} />
                            <AnimatedMaterial 
                                targetColor={currentTarget.ground} 
                                targetRoughness={0.2} 
                                targetMetalness={0.1} 
                            />
                        </mesh>

                        <CityScene data={data} setHoveredBox={setHoveredBox} timeState={timeState} activityMultiplier={activityMultiplier} />
                        <CameraRig mode={mode} isLocked={isLocked} />
                        
                        {mode === 'WALK' && (
                            <PointerLockControls 
                                onLock={() => setIsLocked(true)} 
                                onUnlock={() => setIsLocked(false)} 
                            />
                        )}

                        {hoveredBox && (
                            <Html position={[hoveredBox.position[0], hoveredBox.position[1] + 0.5, hoveredBox.position[2]]} center className="pointer-events-none z-50">
                                <div className="bg-black/90 border border-cyber-cyan text-white font-mono text-xs p-2 rounded shadow-[0_0_15px_rgba(0,243,255,0.4)] whitespace-nowrap backdrop-blur-md">
                                    <span className="text-cyber-cyan font-bold">{hoveredBox.date}</span><br />
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
