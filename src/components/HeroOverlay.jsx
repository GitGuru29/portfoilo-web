import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore, { MOODS } from '../store/useStore';

export default function HeroOverlay() {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const setMood = useStore((state) => state.setMood);

    const [typedText, setTypedText] = useState('');
    const fullText = "FULL STACK / SECURITY / SYSTEMS";

    useEffect(() => {
        // Typing Effect
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < fullText.length) {
                setTypedText(fullText.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);

        // 1. Text fade out on scroll
        gsap.to(textRef.current, {
            opacity: 0,
            x: -100, // Slide left out instead of just up
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
            clearInterval(typingInterval);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [setMood]);

    return (
        <section ref={heroRef} className="h-screen w-full flex items-center pointer-events-none relative z-10">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between h-full">

                {/* Left Side: Text Box */}
                <div ref={textRef} className="w-full md:w-1/2 flex flex-col items-start justify-center text-left pointer-events-auto h-full pt-24 md:pt-0">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 backdrop-blur-md shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_10px_#00f3ff]" />
                        <span className="text-xs font-space tracking-widest text-cyber-cyan uppercase">System Initialized</span>
                    </div>

                    <div className="glitch-wrapper mb-2">
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-orbitron font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-cyber-violet drop-shadow-[0_0_15px_rgba(181,55,242,0.5)] glitch" data-text="Siluna Nusal">
                            Siluna Nusal
                        </h1>
                    </div>

                    <h2 className="text-xl md:text-2xl lg:text-3xl font-space text-cyber-cyan font-light tracking-widest mb-8 drop-shadow-[0_0_8px_rgba(0,243,255,0.4)] h-10 flex items-center">
                        {typedText}<span className="typing-cursor"></span>
                    </h2>

                    <p className="max-w-xl text-md md:text-lg text-gray-400 font-inter font-light tracking-wide mb-10 leading-relaxed border-l-2 border-white/10 pl-6">
                        Engineering low-level systems and architecting robust security protocols. Building the next generation of digital infrastructure.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm font-space font-medium text-gray-300 uppercase tracking-widest p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
                        <span className="hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_#00f3ff] transition-all cursor-crosshair">Android</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00f3ff]" />
                        <span className="hover:text-cyber-violet hover:drop-shadow-[0_0_8px_#b537f2] transition-all cursor-crosshair">Systems</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-pink shadow-[0_0_8px_#ff00ff]" />
                        <span className="hover:text-cyber-pink hover:drop-shadow-[0_0_8px_#ff00ff] transition-all cursor-crosshair">Security</span>
                    </div>
                </div>

                {/* Right Side: Empty Zone for Canvas interraction */}
                <div className="w-full md:w-1/2 h-full pointer-events-auto" />

            </div>
        </section>
    );
}
