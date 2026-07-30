import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { playChimeSound, playTypewriterSound } from '../utils/soundFX';

/**
 * Premium Early-2010s Flagship Smartphone Orb & Vector Stroke Boot Animation for SIDAN
 * 
 * - Starts on pitch-black canvas (#000000).
 * - Blue-white glowing energy orb orbits clockwise leaving a Milky Way stardust trail.
 * - Draws SIDAN letter by letter synchronized with the orb's movement.
 * - Each letter emits a soft electric-blue glow before settling into metallic white.
 * - Orb completes one final circular stardust loop around completed SIDAN before dissolving.
 * - 1-second crisp hold & smooth fade to black (~3.8s total duration).
 */
export default function Preloader() {
    const unlockSystem = useStore((state) => state.unlockSystem);
    const soundEnabled = useStore((state) => state.soundEnabled);

    const [isExiting, setIsExiting] = useState(false);
    const [letterProgress, setLetterProgress] = useState(0); // 0 to 5 for S-I-D-A-N
    const [trailActive, setTrailActive] = useState(true);

    const LETTERS = ['S', 'I', 'D', 'A', 'N'];

    useEffect(() => {
        // Play soft boot chime
        playChimeSound(soundEnabled);

        // Synchronized letter drawing sequence as orb orbits
        let step = 0;
        const letterInterval = setInterval(() => {
            step += 1;
            setLetterProgress(step);
            playTypewriterSound(soundEnabled);

            if (step >= LETTERS.length) {
                clearInterval(letterInterval);
            }
        }, 320); // Draws letters in ~1.6s

        // Dissolve stardust trail after final orbit loop at ~2.8s
        const trailTimer = setTimeout(() => {
            setTrailActive(false);
        }, 2800);

        // Smooth exit fade to black and unlock after ~3.8s
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(unlockSystem, 600);
        }, 3800);

        return () => {
            clearInterval(letterInterval);
            clearTimeout(trailTimer);
            clearTimeout(exitTimer);
        };
    }, [unlockSystem, soundEnabled]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[999999] bg-black flex items-center justify-center select-none overflow-hidden"
                >
                    {/* Centered Composition */}
                    <div className="relative flex items-center justify-center w-full max-w-4xl h-80">
                        
                        {/* Orbiting Stardust & Energy Orb Ring */}
                        <AnimatePresence>
                            {trailActive && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 360 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    transition={{
                                        rotate: { duration: 2.2, repeat: Infinity, ease: 'linear' },
                                        opacity: { duration: 0.6 },
                                        scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                                    }}
                                    className="absolute w-72 sm:w-96 md:w-[28rem] h-72 sm:h-96 md:h-[28rem] rounded-full pointer-events-none flex items-center justify-center"
                                >
                                    {/* Milky Way Stardust Light Dust Arc Trail */}
                                    <div className="absolute inset-0 rounded-full border border-sky-400/20 border-t-sky-300 shadow-[0_0_40px_rgba(56,189,248,0.3)] filter blur-[1px]" />
                                    
                                    {/* Rotating Glowing Blue-White Energy Orb at orbit top */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,1),0_0_50px_rgba(56,189,248,0.9)]" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* SIDAN Vector Stroke Typography */}
                        <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-5 md:gap-8 px-8">
                            {LETTERS.map((char, index) => {
                                const isDrawn = letterProgress > index;
                                const isCurrentlyDrawing = letterProgress === index + 1;

                                return (
                                    <motion.div
                                        key={char}
                                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                        animate={{
                                            opacity: isDrawn ? 1 : 0,
                                            scale: isDrawn ? 1 : 0.9,
                                            y: isDrawn ? 0 : 5
                                        }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="relative"
                                    >
                                        <span
                                            className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-space font-extrabold uppercase tracking-tight transition-all duration-500 ${
                                                isCurrentlyDrawing
                                                    ? 'text-sky-300 drop-shadow-[0_0_35px_rgba(56,189,248,0.95)]'
                                                    : 'text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#cbd5e1] drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)]'
                                            }`}
                                        >
                                            {char}
                                        </span>

                                        {/* Brief Electric-Blue Edge Glow overlay as each letter is completed */}
                                        {isCurrentlyDrawing && (
                                            <motion.span
                                                initial={{ opacity: 1, scale: 1.05 }}
                                                animate={{ opacity: 0, scale: 1 }}
                                                transition={{ duration: 0.6 }}
                                                className="absolute inset-0 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-space font-extrabold uppercase tracking-tight text-sky-400 blur-md pointer-events-none"
                                            >
                                                {char}
                                            </motion.span>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Soft Ambient Illumination aura around completed SIDAN */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: letterProgress >= 5 ? 0.35 : 0 }}
                            transition={{ duration: 1.0 }}
                            className="absolute w-96 h-48 rounded-full bg-sky-400/20 blur-3xl pointer-events-none"
                        />

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
