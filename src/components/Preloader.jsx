import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

export default function Preloader() {
    const unlockSystem = useStore((state) => state.unlockSystem);
    const [lines, setLines] = useState([]);

    const bootSequence = [
        "BIOS Date 10/24/25 15:42:01 Ver 1.0.0",
        "CPU: Siluna Core(TM) i9-12900K @ 3.20GHz",
        "Memory Test: 65536K OK",
        "Initializing USB Controllers .. Done.",
        "Detecting Primary Master ... VFS_ROOT",
        "Detecting Primary Slave  ... None",
        "[ OK ] Booting SilunaOS Kernel v6.1.0-custom",
        "[ OK ] Mounting Root Filesystem...",
        "[ OK ] Starting udev Kernel Device Manager...",
        "[ OK ] Loading Cryptographic Modules...",
        "[ OK ] Starting Network Manager...",
        "[ INFO] IPv4 Address: 192.168.1.100",
        "[ OK ] Initializing WebGL Renderer...",
        "[ OK ] Compiling Shaders...",
        "[ OK ] Starting GUI Display Manager...",
        "Login: siluna",
        "Access Granted. Entering Portfolio..."
    ];

    useEffect(() => {
        let currentIndex = 0;
        
        // Print lines rapidly
        const interval = setInterval(() => {
            if (currentIndex < bootSequence.length) {
                setLines(prev => [...prev, bootSequence[currentIndex]]);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 60); // Very fast interval

        // Unlock system slightly after the sequence finishes
        const unlockTimeout = setTimeout(() => {
            unlockSystem();
        }, (bootSequence.length * 60) + 400);

        return () => {
            clearInterval(interval);
            clearTimeout(unlockTimeout);
        };
    }, [unlockSystem]);

    return (
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] bg-[#020202] text-[#a9b1d6] font-mono text-[13px] md:text-[14px] p-6 flex flex-col justify-end overflow-hidden pointer-events-none"
        >
            <div className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: "url('/assets/kitty_bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />
            
            <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col justify-end h-full">
                <div className="flex flex-col gap-1.5 opacity-90">
                    {lines.map((line, idx) => (
                        <div key={idx} className="whitespace-pre-wrap">
                            {line?.startsWith('[ OK ]') ? (
                                <span><span className="text-[#74E1A6]">[ OK ]</span>{line.replace('[ OK ]', '')}</span>
                            ) : line?.startsWith('[ INFO]') ? (
                                <span><span className="text-[#7dcfff]">[ INFO]</span>{line.replace('[ INFO]', '')}</span>
                            ) : (
                                line || ''
                            )}
                        </div>
                    ))}
                    {/* Blinking Cursor */}
                    <div className="w-2.5 h-4 bg-white/70 animate-pulse mt-2" />
                </div>
            </div>
            
            {/* Scanlines Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />
        </motion.div>
    );
}
