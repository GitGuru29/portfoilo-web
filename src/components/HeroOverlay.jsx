import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore, { MOODS } from '../store/useStore';
import { SiKotlin, SiFlutter, SiDjango, SiDocker, SiLinux } from 'react-icons/si';

export default function HeroOverlay() {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const setMood = useStore((state) => state.setMood);

    const [typedText, setTypedText] = useState('');
    const fullText = "ANDROID / SYSTEMS / SECURITY";

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
            y: -100, // Slide up out since it's centered now
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

    const handleScrollClick = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="home" ref={heroRef} className="h-screen w-full flex items-center pointer-events-none relative z-10">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center h-full relative">

                {/* Center Content Box */}
                <div ref={textRef} className="w-full flex flex-col items-center justify-center text-center pointer-events-auto h-full pt-20 md:pt-0">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 backdrop-blur-md shadow-[0_0_15px_rgba(0,247,255,0.1)]">
                        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_10px_#00f7ff]" />
                        <span className="text-xs font-space tracking-widest text-cyber-cyan uppercase">System Status: Online</span>
                    </div>

                    <div className="glitch-wrapper mb-2">
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-orbitron font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-cyber-violet drop-shadow-[0_0_8px_rgba(181,55,242,0.3)] glitch leading-[0.9]" data-text="Siluna Nusal">
                            Siluna<br /> Nusal
                        </h1>
                    </div>

                    <h2 className="text-xl md:text-2xl lg:text-3xl font-space text-cyber-cyan font-light tracking-widest mb-6 drop-shadow-[0_0_8px_rgba(0,247,255,0.4)] h-10 flex items-center justify-center w-full">
                        {typedText}<span className="typing-cursor"></span>
                    </h2>

                    <p className="max-w-[600px] text-md md:text-lg text-white/85 font-inter font-light tracking-wide mb-8 leading-relaxed text-center mx-auto">
                        Engineering low-level systems and architecting robust security protocols. Building the next generation of digital infrastructure.
                    </p>

                    <div className="flex flex-col items-center gap-6 mb-10 w-full">
                        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs md:text-sm font-space font-medium text-gray-300 uppercase tracking-widest p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
                            <span className="hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_#00f7ff] transition-all cursor-crosshair">Android</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00f7ff]" />
                            <span className="hover:text-cyber-violet hover:drop-shadow-[0_0_8px_#b537f2] transition-all cursor-crosshair">Systems</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-cyber-pink shadow-[0_0_8px_#ff00ff]" />
                            <span className="hover:text-cyber-pink hover:drop-shadow-[0_0_8px_#ff00ff] transition-all cursor-crosshair">Security</span>
                        </div>

                        <div className="flex items-center gap-4 text-gray-400 opacity-80 justify-center">
                            <SiKotlin className="w-5 h-5 hover:text-cyber-cyan transition-colors" title="Kotlin" />
                            <SiFlutter className="w-5 h-5 hover:text-cyber-cyan transition-colors" title="Flutter" />
                            <SiDjango className="w-5 h-5 hover:text-cyber-cyan transition-colors" title="Django" />
                            <SiDocker className="w-5 h-5 hover:text-cyber-cyan transition-colors" title="Docker" />
                            <SiLinux className="w-5 h-5 hover:text-cyber-cyan transition-colors" title="Linux" />
                        </div>
                    </div>

                    <a href="#projects" onClick={(e) => handleScrollClick(e, 'projects')} className="inline-block border border-cyber-cyan px-6 py-2.5 rounded-[25px] text-cyber-cyan font-space uppercase tracking-widest text-sm hover:bg-cyber-cyan/10 hover:shadow-[0_0_15px_rgba(0,247,255,0.4)] transition-all pointer-events-auto mx-auto mt-4">
                        View My Work
                    </a>
                </div>

            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-70 pointer-events-none">
                <span className="text-cyber-cyan text-[10px] font-space tracking-[0.3em] mb-2 uppercase">Scroll</span>
                <svg className="w-4 h-4 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
