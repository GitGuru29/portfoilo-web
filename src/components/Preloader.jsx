import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { playChimeSound, playTypewriterSound } from '../utils/soundFX';

const LABELS = [
    'SETTING TYPE',
    'INKING PLATE',
    'FEEDING PAPER',
    'LOCKING FORME',
    'RUNNING PRESS',
];

export default function Preloader() {
    const unlockSystem = useStore((state) => state.unlockSystem);
    const soundEnabled = useStore((state) => state.soundEnabled);

    const [isExiting, setIsExiting] = useState(false);
    const [pct, setPct] = useState(0);
    const [fill, setFill] = useState(0);
    const [labelIdx, setLabelIdx] = useState(0);
    const raf = useRef(null);
    const start = useRef(null);
    const DURATION = 3600; // ms to fill the bar

    // Animate the percentage counter
    useEffect(() => {
        start.current = performance.now();
        const tick = (now) => {
            const elapsed = now - start.current;
            const raw = Math.min(elapsed / DURATION, 1);
            // Ease out with slight overshoot at 100%
            const eased = raw < 1 ? 1 - Math.pow(1 - raw, 3) : 1;
            const p = Math.round(eased * 100);
            setPct(p);
            setLabelIdx(Math.min(Math.floor(raw * LABELS.length), LABELS.length - 1));

            // Bar fill runs to 103.5% then settles back to 100 —
            // the press slamming the last impression home.
            let f;
            if (raw < 0.94) {
                f = eased * 100;
            } else if (raw < 0.995) {
                f = 94 + ((raw - 0.94) / 0.055) * 9.5;
            } else {
                f = 103.5 - Math.min((raw - 0.995) / 0.005, 1) * 3.5;
            }
            setFill(f);

            if (raw < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf.current);
    }, []);

    // Sounds
    useEffect(() => {
        playChimeSound(soundEnabled);
        ['S', 'I', 'D', 'A', 'N'].forEach((_, i) => {
            setTimeout(() => playTypewriterSound(soundEnabled), (0.5 + i * 0.15) * 1000);
        });
    }, [soundEnabled]);

    // Exit logic
    useEffect(() => {
        let exited = false;
        const triggerExit = (delay = 400) => {
            if (exited) return;
            exited = true;
            cancelAnimationFrame(raf.current);
            setPct(100);
            setIsExiting(true);
            setTimeout(unlockSystem, delay);
        };

        const exitTimer = setTimeout(() => triggerExit(800), 4500);
        const onInteract = () => triggerExit(300);
        window.addEventListener('click', onInteract, { once: true });
        window.addEventListener('keydown', onInteract, { once: true });
        window.addEventListener('wheel', onInteract, { once: true });
        window.addEventListener('touchstart', onInteract, { once: true });

        return () => {
            clearTimeout(exitTimer);
            window.removeEventListener('click', onInteract);
            window.removeEventListener('keydown', onInteract);
            window.removeEventListener('wheel', onInteract);
            window.removeEventListener('touchstart', onInteract);
        };
    }, [unlockSystem]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ scaleY: 1, opacity: 1 }}
                    exit={{ scaleY: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[999999] flex flex-col items-center justify-center select-none overflow-hidden"
                    style={{ background: '#0d0d0d', transformOrigin: 'top center' }}
                >

                    {/* Top hairline — masthead rule */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        style={{ transformOrigin: 'left center' }}
                        className="absolute top-0 left-0 right-0 h-[2px] bg-white/10"
                    />
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                        style={{ transformOrigin: 'left center' }}
                        className="absolute top-[3px] left-0 right-0 h-[1px] bg-white/6"
                    />

                    {/* Masthead kicker */}
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="absolute top-6 left-0 right-0 flex items-center justify-center"
                    >
                        <span
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '9px',
                                letterSpacing: '0.38em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.25)',
                            }}
                        >
                            The Daily Developer — Press Room
                        </span>
                    </motion.div>

                    {/* Main Logotype — SIDAN */}
                    <div className="relative flex flex-col items-center gap-8">
                        <div className="relative flex items-center justify-center">
                            <div
                                className="flex overflow-hidden py-4"
                                style={{
                                    fontFamily: "'UnifrakturMaguntia', 'Playfair Display', serif",
                                    fontSize: 'clamp(3rem, 10vw, 6.5rem)',
                                    fontWeight: 400,
                                    letterSpacing: '0.06em',
                                    color: '#f0ede4',
                                }}
                            >
                                {'SIDAN'.split('').map((char, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ y: 90, opacity: 0, skewY: 8 }}
                                        animate={{ y: 0, opacity: 1, skewY: 0 }}
                                        transition={{
                                            y: { duration: 0.7, delay: 0.5 + index * 0.12, ease: [0.16, 1, 0.3, 1] },
                                            opacity: { duration: 0.4, delay: 0.5 + index * 0.12 },
                                            skewY: { duration: 0.8, delay: 0.5 + index * 0.12, ease: [0.16, 1, 0.3, 1] },
                                        }}
                                        className="inline-block relative"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Chapter color rule under name */}
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.9, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute -bottom-3 left-0 right-0 h-[2px]"
                            style={{
                                transformOrigin: 'left center',
                                background: 'linear-gradient(90deg, #b91c1c 0%, #e03030 40%, #0d0d0d 100%)',
                            }}
                        />
                    </div>

                    {/* Progress Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                        className="absolute bottom-20 left-1/2"
                        style={{ transform: 'translateX(-50%)', width: 'clamp(280px, 40vw, 440px)' }}
                    >
                        {/* Label + pct */}
                        <div className="flex items-center justify-between mb-3">
                            <span
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '9px',
                                    letterSpacing: '0.26em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.35)',
                                }}
                            >
                                {LABELS[labelIdx]}…
                            </span>
                            <span
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '11px',
                                    letterSpacing: '0.06em',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontVariantNumeric: 'tabular-nums',
                                }}
                            >
                                {String(pct).padStart(3, '\u00a0')}%
                            </span>
                        </div>

                        {/* Track */}
                        <div className="relative h-[2px] w-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            {/* Ghost track — trails the fill */}
                            <div
                                className="absolute top-0 left-0 h-full transition-none"
                                style={{
                                    width: `${Math.max(fill - 4, 0)}%`,
                                    background: 'rgba(185,28,28,0.2)',
                                    transition: 'width 0.18s ease-out',
                                }}
                            />
                            {/* Main fill — overshoots to 103.5% then settles */}
                            <div
                                className="absolute top-0 left-0 h-full"
                                style={{
                                    width: `${fill}%`,
                                    background: 'linear-gradient(90deg, #b91c1c 0%, #e03030 60%, #f87171 100%)',
                                    boxShadow: '0 0 8px rgba(185,28,28,0.5)',
                                    transition: 'width 0.12s ease-out',
                                }}
                            />
                        </div>

                        {/* Double rule below */}
                        <div className="mt-[3px] h-[1px] w-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
                    </motion.div>

                    {/* Bottom rule */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        style={{ transformOrigin: 'right center' }}
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
