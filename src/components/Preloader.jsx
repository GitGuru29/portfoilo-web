import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { playChimeSound, playTypewriterSound } from '../utils/soundFX';

export default function Preloader() {
    const unlockSystem = useStore((state) => state.unlockSystem);
    const soundEnabled = useStore((state) => state.soundEnabled);

    const [isExiting, setIsExiting] = useState(false);
    
    const LETTERS = ['S', 'I', 'D', 'A', 'N'];

    useEffect(() => {
        // Play soft boot chime
        playChimeSound(soundEnabled);
        
        // Synchronized typewriter sounds for exactly when each letter drops
        LETTERS.forEach((_, index) => {
            setTimeout(() => playTypewriterSound(soundEnabled), (0.5 + index * 0.15) * 1000);
        });
        
        // Classic boot time slightly extended to let animation finish (8 seconds total)
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(unlockSystem, 800);
        }, 8000);

        return () => clearTimeout(exitTimer);
    }, [unlockSystem, soundEnabled]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center select-none overflow-hidden"
                >
                    {/* Samsung Style Logo */}
                    <div className="relative flex items-center justify-center">
                        <div className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-[0.4em] relative z-10 flex overflow-hidden py-4">
                            {LETTERS.map((char, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ 
                                        y: -80, 
                                        opacity: 0, 
                                        scale: 0.2,
                                        color: "#ffffff",
                                        textShadow: "0px 0px 0px rgba(96,165,250,0)"
                                    }}
                                    animate={{ 
                                        y: 0, 
                                        opacity: 1, 
                                        scale: 1,
                                        color: ["#ffffff", "#60a5fa", "#ffffff", "#60a5fa", "#ffffff"],
                                        textShadow: [
                                            "0px 0px 0px rgba(96,165,250,0)",
                                            "0px 0px 15px rgba(96,165,250,0.8)",
                                            "0px 0px 0px rgba(96,165,250,0)",
                                            "0px 0px 15px rgba(96,165,250,0.8)",
                                            "0px 0px 0px rgba(96,165,250,0)"
                                        ]
                                    }}
                                    transition={{
                                        y: { duration: 0.6, delay: 0.5 + index * 0.15, type: "spring", stiffness: 150, damping: 12 },
                                        opacity: { duration: 0.6, delay: 0.5 + index * 0.15 },
                                        scale: { duration: 0.6, delay: 0.5 + index * 0.15, type: "spring", stiffness: 150, damping: 12 },
                                        color: { duration: 3.5, delay: 1.8 + index * 0.15, ease: "easeInOut" },
                                        textShadow: { duration: 3.5, delay: 1.8 + index * 0.15, ease: "easeInOut" }
                                    }}
                                    className="inline-block relative"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>
                        
                        {/* Soft blue glow behind the logo */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.4, 0.1, 0.4] }}
                            transition={{ duration: 4, ease: "easeInOut", delay: 1.8 }}
                            className="absolute w-[200%] h-[200%] bg-blue-600/30 blur-[80px] rounded-[100%] pointer-events-none -z-10"
                        />
                    </div>

                    {/* Classic OneUI / Android Spinner at the bottom */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                        className="absolute bottom-16 flex flex-col items-center gap-3"
                    >
                        <div className="w-8 h-8 rounded-full border-2 border-gray-800 border-t-blue-500 animate-spin" />
                        <span className="text-gray-500 text-[10px] tracking-widest font-sans uppercase">Powered by SIDAN OS</span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
