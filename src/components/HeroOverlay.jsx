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
    const fullText = "System Software Engineer (Android + Linux)";

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
            y: -50,
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "center top",
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
        <React.Fragment>
            <section id="home" ref={heroRef} className="min-h-screen w-full flex flex-col justify-center pointer-events-none relative z-10 pt-32 pb-20">
                <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative">

                    {/* 2-Column Content Box */}
                    <div ref={textRef} className="w-full flex flex-col md:flex-row items-center justify-between text-center md:text-left pointer-events-auto gap-8 lg:gap-16">

                        {/* Left Side: Text */}
                        <div className="flex flex-col items-center md:items-start flex-1 order-2 md:order-1">
                            
                            <div className="glitch-wrapper mb-2 mt-4 md:mt-0">
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] glitch leading-[1]" data-text="Siluna Nusal">
                                    Siluna<br className="hidden md:block" /> Nusal
                                </h1>
                            </div>

                            <h2 className="text-lg md:text-xl lg:text-2xl font-space text-cyber-cyan font-light tracking-widest mb-6 drop-shadow-[0_0_12px_rgba(0,247,255,0.3)] min-h-[4rem] md:min-h-[2rem] w-full text-center md:text-left leading-relaxed">
                                {typedText}
                                <span className="inline-block w-2.5 h-[1.1em] bg-cyber-cyan ml-2 align-text-bottom animate-pulse shadow-[0_0_12px_rgba(0,243,255,0.8)]" />
                            </h2>

                            <p className="max-w-[500px] text-sm md:text-base lg:text-lg text-gray-400 font-inter font-light tracking-wide mb-8 leading-relaxed text-center md:text-left mx-auto md:mx-0">
                                Building low-level tools, mobile systems, and developer infrastructure.
                            </p>

                            <div className="flex flex-col items-center md:items-start mb-10 w-full">
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 md:gap-4 text-[10px] md:text-xs font-space font-medium text-gray-300 uppercase tracking-widest p-3 md:p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                    <span className="hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_var(--theme-primary)] transition-all cursor-crosshair">Android</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_var(--theme-primary)]" />
                                    <span className="hover:text-cyber-violet hover:drop-shadow-[0_0_8px_var(--theme-secondary)] transition-all cursor-crosshair">Systems</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-pink shadow-[0_0_8px_#ff00ff]" />
                                    <span className="hover:text-cyber-pink hover:drop-shadow-[0_0_8px_#ff00ff] transition-all cursor-crosshair">Security</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mx-auto md:mx-0 pointer-events-auto w-full font-mono text-sm md:text-base">
                                <a href="#projects" onClick={(e) => handleScrollClick(e, 'projects')} className="group flex items-center gap-2 bg-[#050505]/80 backdrop-blur-md border border-white/10 px-6 py-4 rounded-xl hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] transition-all w-full sm:w-auto">
                                    <span className="text-cyber-cyan font-bold">~</span>
                                    <span className="text-gray-500">$</span>
                                    <span className="text-gray-300 group-hover:text-cyber-cyan transition-colors">./execute_projects.sh</span>
                                    <span className="w-2 h-4 bg-cyber-cyan opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
                                </a>
                                <a href="/Siluna_Nusal_CV.pdf" download="Siluna_Nusal_CV.pdf" className="group flex items-center gap-2 bg-[#050505]/80 backdrop-blur-md border border-white/10 px-6 py-4 rounded-xl hover:border-cyber-violet/50 hover:bg-cyber-violet/10 hover:shadow-[0_0_20px_rgba(181,55,242,0.15)] transition-all w-full sm:w-auto">
                                    <span className="text-cyber-violet font-bold">~</span>
                                    <span className="text-gray-500">$</span>
                                    <span className="text-gray-300 group-hover:text-cyber-violet transition-colors">./download_resume.sh</span>
                                    <span className="w-2 h-4 bg-cyber-violet opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
                                </a>
                            </div>
                        </div>

                        {/* Right Side: Profile Photo */}
                        <div className="flex-1 order-1 md:order-2 flex justify-center items-center relative group w-full max-w-[280px] md:max-w-none mt-8 md:mt-0">
                            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full border border-cyber-cyan/20 p-2 shadow-[0_0_30px_rgba(0,247,255,0.1)] group-hover:shadow-[0_0_50px_rgba(0,247,255,0.3)] group-hover:border-cyber-cyan/50 transition-all duration-700">
                                {/* Animated Rings */}
                                <div className="absolute inset-0 rounded-full border-t border-r border-cyber-violet/40 animate-[spin_10s_linear_infinite]" />
                                <div className="absolute inset-2 rounded-full border-b border-l border-cyber-cyan/40 animate-[spin_15s_linear_infinite_reverse]" />
                                <div className="absolute inset-[-10px] rounded-full border border-white/5 bg-cyber-dark/40 backdrop-blur-sm -z-10" />

                                {/* Image Container with Hologram FX */}
                                <div className="w-full h-full rounded-full overflow-hidden relative group-hover:animate-pulse">
                                    <img
                                        src="/assets/profile.png"
                                        alt="Siluna Nusal"
                                        className="w-full h-full object-cover grayscale brightness-90 contrast-125 mix-blend-luminosity group-hover:mix-blend-normal group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-700"
                                    />
                                    {/* Scanlines Hologram Overlay */}
                                    <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,243,255,0.05)_50%)] bg-[length:100%_4px] opacity-30 group-hover:opacity-50 transition-opacity" />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-cyber-cyan/20 to-transparent mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />
                                </div>
                            </div>
                        </div>
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
        </React.Fragment>
    );
}
