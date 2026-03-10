import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore, { MOODS } from '../store/useStore';

export default function HeroOverlay() {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const setMood = useStore((state) => state.setMood);

    useEffect(() => {
        // 1. Text fade out on scroll
        gsap.to(textRef.current, {
            opacity: 0,
            y: -100,
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            }
        });

        // 2. Mood state sync
        ScrollTrigger.create({
            trigger: heroRef.current,
            start: "top bottom",
            end: "bottom center",
            onEnter: () => setMood(MOODS.HERO),
            onEnterBack: () => setMood(MOODS.HERO),
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [setMood]);

    return (
        <section ref={heroRef} className="h-screen w-full flex flex-col items-center justify-center pointer-events-none relative z-10">
            <div ref={textRef} className="text-center pointer-events-auto flex flex-col items-center">
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_10px_#00f3ff]" />
                    <span className="text-xs font-space tracking-widest text-cyber-cyan uppercase">System Initialized</span>
                </div>

                <h1 className="text-6xl md:text-8xl lg:text-9xl font-orbitron font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-cyber-violet drop-shadow-[0_0_15px_rgba(181,55,242,0.5)]">
                    Siluna Nusal
                </h1>
                <h2 className="text-xl md:text-3xl font-space text-cyber-cyan font-light tracking-widest mb-8 drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]">
                    FULL STACK / SECURITY / SYSTEMS
                </h2>
                <p className="max-w-xl text-md md:text-lg text-gray-400 font-inter font-light tracking-wide mb-8 leading-relaxed">
                    Engineering low-level systems and architecting robust security protocols. Building the next generation of digital infrastructure.
                </p>
                <div className="flex items-center justify-center gap-6 text-sm font-space font-medium text-gray-300 uppercase tracking-widest">
                    <span className="hover:text-cyber-cyan transition-colors duration-300">Android</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00f3ff]" />
                    <span className="hover:text-cyber-violet transition-colors duration-300">Systems</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-pink shadow-[0_0_8px_#ff00ff]" />
                    <span className="hover:text-cyber-pink transition-colors duration-300">Security</span>
                </div>
            </div>

        </section>
    );
}
