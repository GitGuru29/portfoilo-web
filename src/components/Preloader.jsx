import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import useStore from '../store/useStore';

const BOOT_LINES = [
    { text: 'INIT SilunaOS v3.0 — kernel 6.8.0-arch', delay: 0 },
    { text: '> Mounting AeroLang runtime...', delay: 0.35 },
    { text: '> Loading Android NDK bridge...', delay: 0.65 },
    { text: '> Binding Linux syscall table...', delay: 0.9 },
    { text: '> Initializing portfolio subsystems...', delay: 1.15 },
    { text: 'All modules OK.', delay: 1.5 },
];

export default function Preloader() {
    const unlockSystem = useStore((state) => state.unlockSystem);
    const containerRef = useRef(null);
    const barRef = useRef(null);
    const lineRefs = useRef([]);
    const nameRef = useRef(null);
    const promptRef = useRef(null);
    const [visibleLines, setVisibleLines] = useState([]);
    const [isBooted, setIsBooted] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);

    useEffect(() => {
        // Sequence boot lines
        const timeouts = BOOT_LINES.map((line, i) =>
            setTimeout(() => {
                setVisibleLines(prev => [...prev, i]);
            }, line.delay * 1000)
        );

        // Main timeline for boot sequence
        const tl = gsap.timeline({
            delay: 1.8,
            onComplete: () => setIsBooted(true) // Hand over control to user here
        });

        // Progress bar grows to 100%
        tl.fromTo(barRef.current,
            { width: '0%' },
            { width: '100%', duration: 1.1, ease: 'power2.inOut' }
        );

        // Name fades in
        tl.fromTo(nameRef.current,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.4'
        );

        return () => {
            timeouts.forEach(clearTimeout);
            tl.kill();
        };
    }, []);

    // Handle user input to unlock
    useEffect(() => {
        if (!isBooted || isUnlocking) return;

        const handleUnlock = (e) => {
            if (e.type === 'keydown' && e.key !== 'Enter') return;
            
            setIsUnlocking(true);
            
            // The handover transition
            gsap.to(containerRef.current, {
                opacity: 0,
                scale: 1.1,
                duration: 0.8,
                ease: 'power3.inOut',
                onComplete: unlockSystem,
            });
        };

        window.addEventListener('keydown', handleUnlock);
        window.addEventListener('click', handleUnlock);

        return () => {
            window.removeEventListener('keydown', handleUnlock);
            window.removeEventListener('click', handleUnlock);
        };
    }, [isBooted, isUnlocking, unlockSystem]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[200] bg-[var(--color-quantum-black)] flex flex-col items-center justify-center pointer-events-auto will-change-transform cursor-pointer select-none"
        >
            {/* Corner accents */}
            <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-[var(--color-geyser)]/20" />
            <div className="absolute top-8 right-8 w-8 h-8 border-t border-r border-[var(--color-geyser)]/20" />
            <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-[var(--color-geyser)]/20" />
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-[var(--color-geyser)]/20" />

            {/* Boot terminal */}
            <div className="w-full max-w-lg px-8 flex flex-col items-start gap-1 font-mono mb-16">
                {BOOT_LINES.map((line, i) => (
                    <div
                        key={i}
                        ref={el => lineRefs.current[i] = el}
                        className={`text-[10px] md:text-[11px] tracking-wider transition-all duration-300 ${
                            visibleLines.includes(i) ? 'opacity-100' : 'opacity-0'
                        } ${
                            i === BOOT_LINES.length - 1
                                ? 'text-[var(--color-geyser)]/80 mt-2'
                                : 'text-[var(--color-geyser)]/30'
                        }`}
                    >
                        {line.text}
                    </div>
                ))}
            </div>

            {/* Name + progress */}
            <div className="flex flex-col items-center gap-6 w-full max-w-xs relative">
                <div ref={nameRef} className="opacity-0 text-[var(--color-geyser)] font-space text-xs tracking-[0.6em] uppercase font-light">
                    Siluna Nusal
                </div>
                <div className="w-full h-[1px] bg-[var(--color-geyser)]/10 relative overflow-hidden">
                    <div
                        ref={barRef}
                        className="absolute top-0 left-0 h-full bg-[var(--color-geyser)]/50 will-change-transform"
                        style={{ width: '0%' }}
                    />
                </div>
                
                {/* The Handover Prompt */}
                <div 
                    ref={promptRef}
                    className={`absolute top-full mt-8 text-[10px] font-mono tracking-widest text-[#4ade80] transition-opacity duration-700 ${isBooted && !isUnlocking ? 'opacity-100 animate-pulse' : 'opacity-0'}`}
                >
                    [ PRESS ENTER TO INITIALIZE ]
                </div>
            </div>
        </div>
    );
}

