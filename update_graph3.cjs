const fs = require('fs');

const content = fs.readFileSync('src/components/GitHub3DGraph.jsx', 'utf8');

let newContent = content.replace(
    "riverColor: '#00f3ff'",
    "riverColor: '#00f3ff',\n        cloudColor: '#FFDAB9'"
).replace(
    "riverColor: '#0066cc'",
    "riverColor: '#0066cc',\n        cloudColor: '#FFFFFF'"
).replace(
    "riverColor: '#002244'",
    "riverColor: '#002244',\n        cloudColor: '#FF69B4'"
).replace(
    "riverColor: '#001122'",
    "riverColor: '#001122',\n        cloudColor: '#0D1B2A'"
);

// Add VoxelClouds component before CameraRig
const cloudsComponent = `
const VoxelClouds = ({ timeState }) => {
    const target = TIMELINE_STATES[timeState];
    const groupRef = useRef();

    const clouds = useMemo(() => {
        const items = [];
        for (let i = 0; i < 40; i++) {
            const clusterX = (Math.random() * 160) - 80;
            const clusterZ = (Math.random() * 200) - 100;
            const clusterY = 20 + Math.random() * 10;
            
            const numBlocks = 3 + Math.floor(Math.random() * 5);
            for(let b=0; b<numBlocks; b++) {
                items.push({
                    position: [
                        clusterX + (Math.random() * 4 - 2),
                        clusterY + (Math.random() * 2 - 1),
                        clusterZ + (Math.random() * 4 - 2)
                    ],
                    scale: [
                        2 + Math.random() * 4,
                        1 + Math.random() * 2,
                        2 + Math.random() * 4
                    ]
                });
            }
        }
        return items;
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.position.z += delta * 1.5;
            if (groupRef.current.position.z > 100) {
                groupRef.current.position.z = -100;
            }
        }
    });

    return (
        <group ref={groupRef}>
            <Instances limit={500} range={clouds.length} castShadow receiveShadow>
                <boxGeometry args={[1, 1, 1]} />
                <AnimatedMaterial targetColor={target.cloudColor} targetRoughness={1.0} targetMetalness={0.0} transparent opacity={0.9} />
                {clouds.map((c, i) => (
                    <Instance key={\`cloud-\${i}\`} position={c.position} scale={c.scale} />
                ))}
            </Instances>
        </group>
    );
};
`;

newContent = newContent.replace("const CameraRig = ({ mode, isLocked }) => {", cloudsComponent + "\nconst CameraRig = ({ mode, isLocked }) => {");

// Update CameraRig
const oldCameraRig = `    useFrame((state, delta) => {
        if (mode === "CINEMATIC") {
            const loopDuration = 40;
            const t = (state.clock.elapsedTime % loopDuration) / loopDuration;
            const z = 35 - (t * 70);
            
            // Street-level drone bobbing
            const y = 1.0 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1; 
            
            camera.position.lerp(targetPos.current.set(0, y, z), 0.05);
            // Look forward, offset by mouse position
            // state.pointer is normalized from -1 to +1
            const lookX = state.pointer.x * 15;
            const lookY = 1.5 + (state.pointer.y * 5); // Base look target lowered to 1.5
            camera.lookAt(lookX, lookY, z - 15);
            
        } else if (mode === "WALK" && isLocked) {`;

const newCameraRig = `    useFrame((state, delta) => {
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
            
        } else if (mode === "WALK" && isLocked) {`;

newContent = newContent.replace(oldCameraRig, newCameraRig);

// Insert <VoxelClouds />
newContent = newContent.replace(
    "<CityScene data={data} setHoveredBox={setHoveredBox} timeState={timeState} activityMultiplier={activityMultiplier} />",
    "<VoxelClouds timeState={timeState} />\n                        <CityScene data={data} setHoveredBox={setHoveredBox} timeState={timeState} activityMultiplier={activityMultiplier} />"
);

// Update UI buttons
const oldButtons = `<button 
                                    onClick={() => setMode('CINEMATIC')}
                                    className={\`px-4 py-2 font-mono text-xs tracking-widest rounded transition-colors \${mode === 'CINEMATIC' ? 'bg-cyber-cyan text-black font-bold shadow-[0_0_15px_rgba(0,243,255,0.5)]' : 'text-gray-400 hover:text-white'}\`}
                                >
                                    ◉ CINEMATIC
                                </button>
                                <button 
                                    onClick={handleWalkClick}
                                    className={\`px-4 py-2 font-mono text-xs tracking-widest rounded transition-colors \${mode === 'WALK' ? 'bg-cyber-cyan text-black font-bold shadow-[0_0_15px_rgba(0,243,255,0.5)]' : 'text-gray-400 hover:text-white'}\`}
                                >
                                    WASD WALK
                                </button>`;

const newButtons = `<button 
                                    onClick={() => setMode('CINEMATIC')}
                                    className={\`px-3 py-2 font-mono text-xs tracking-widest rounded transition-colors \${mode === 'CINEMATIC' ? 'bg-cyber-cyan text-black font-bold shadow-[0_0_15px_rgba(0,243,255,0.5)]' : 'text-gray-400 hover:text-white'}\`}
                                >
                                    ◉ STREET
                                </button>
                                <button 
                                    onClick={() => setMode('DRONE')}
                                    className={\`px-3 py-2 font-mono text-xs tracking-widest rounded transition-colors \${mode === 'DRONE' ? 'bg-cyber-cyan text-black font-bold shadow-[0_0_15px_rgba(0,243,255,0.5)]' : 'text-gray-400 hover:text-white'}\`}
                                >
                                    ✈ DRONE
                                </button>
                                <button 
                                    onClick={handleWalkClick}
                                    className={\`px-3 py-2 font-mono text-xs tracking-widest rounded transition-colors \${mode === 'WALK' ? 'bg-cyber-cyan text-black font-bold shadow-[0_0_15px_rgba(0,243,255,0.5)]' : 'text-gray-400 hover:text-white'}\`}
                                >
                                    🚶 WALK
                                </button>`;

newContent = newContent.replace(oldButtons, newButtons);

fs.writeFileSync('src/components/GitHub3DGraph.jsx', newContent);
console.log('Update script finished.');
