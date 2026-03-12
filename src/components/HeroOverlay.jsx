import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import useStore, { MOODS } from '../store/useStore';
import { SiKotlin, SiFlutter, SiDjango, SiDocker, SiLinux } from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { label: 'Projects', value: '12+' },
    { label: 'Experience', value: '3 YRS' },
    { label: 'Focus', value: 'ANDROID' },
];

const terminalLines = [
    { text: '$ whoami', delay: 0.2, color: 'text-cyber-cyan' },
    { text: 'siluna_nusal', delay: 0.6, color: 'text-white' },
    { text: '$ cat expertise.txt', delay: 1.0, color: 'text-cyber-cyan' },
    { text: 'Android Internals, Reverse', delay: 1.4, color: 'text-green-400' },
    { text: 'Engineering, Security', delay: 1.6, color: 'text-green-400' },
    { text: '$ status', delay: 2.0, color: 'text-cyber-cyan' },
    { text: '[ONLINE] Open to work', delay: 2.4, color: 'text-cyber-violet' },
];

export default function HeroOverlay() {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const setMood = useStore((state) => state.setMood);

    const [typedText, setTypedText] = useState('');
    const fullText = "ANDROID // SYSTEMS // SECURITY";

    useEffect(() => {
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < fullText.length) {
                setTypedText(fullText.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 80);

        gsap.to(textRef.current, {
            opacity: 0,
            y: -80,
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            }
        });

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
            if (window.lenis) {
                window.lenis.scrollTo(element, { offset: 0, duration: 1.2 });
            } else {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <section id="home" ref={heroRef} className="h-screen w-full flex items-center pointer-events-none relative z-10 overflow-hidden">

            {/* Scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none z-0"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)' }}
            />

            <div ref={textRef} className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 h-full pt-24">

                {/* ===== LEFT COLUMN ===== */}
                <div className="flex-1 flex flex-col justify-center pointer-events-auto text-left">

                    {/* Status Badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 backdrop-blur-md shadow-[0_0_15px_rgba(0,247,255,0.1)] w-fit"
                    >
                        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_8px_var(--theme-primary)]" />
                        <span className="text-xs font-space tracking-widest text-cyber-cyan uppercase">System Status: Online</span>
                    </motion.div>

                    {/* Name with violet glow */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="glitch-wrapper mb-3"
                    >
                        <h1
                            className="text-6xl md:text-7xl lg:text-8xl font-orbitron font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-cyber-violet drop-shadow-[0_0_12px_rgba(181,55,242,0.4)] glitch leading-[0.9]"
                            data-text="SILUNA NUSAL"
                        >
                            SILUNA<br />NUSAL
                        </h1>
                    </motion.div>

                    {/* Typed Subtitle with cyan glow */}
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="text-base md:text-xl font-space text-cyber-cyan font-light tracking-widest mb-6 h-8 flex items-center drop-shadow-[0_0_8px_rgba(0,247,255,0.5)]"
                    >
                        {typedText}<span className="typing-cursor" />
                    </motion.h2>

                    {/* Bio */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        className="max-w-[480px] text-base text-white/80 font-inter font-light tracking-wide mb-8 leading-relaxed"
                    >
                        Engineering low-level systems and architecting robust security protocols. Building the next generation of digital infrastructure.
                    </motion.p>

                    {/* Colored Tech Tags — original style */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                        className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-space font-medium text-gray-300 uppercase tracking-widest px-5 py-3 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md w-fit mb-6"
                    >
                        <span className="hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_var(--theme-primary)] transition-all cursor-crosshair">Android</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_var(--theme-primary)]" />
                        <span className="hover:text-cyber-violet hover:drop-shadow-[0_0_8px_var(--theme-secondary)] transition-all cursor-crosshair">Systems</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-pink shadow-[0_0_8px_#ff00ff]" />
                        <span className="hover:text-cyber-pink hover:drop-shadow-[0_0_8px_#ff00ff] transition-all cursor-crosshair">Security</span>
                    </motion.div>

                    {/* Tech Stack Icons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.8 }}
                        className="flex items-center gap-5 text-gray-500 mb-10"
                    >
                        {[SiKotlin, SiFlutter, SiDjango, SiDocker, SiLinux].map((Icon, i) => (
                            <Icon key={i} className="w-5 h-5 hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_var(--theme-primary)] hover:scale-125 transition-all duration-200 cursor-default" />
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.95 }}
                        className="flex flex-wrap items-center gap-4"
                    >
                        <a
                            href="#projects"
                            onClick={(e) => handleScrollClick(e, 'projects')}
                            className="inline-block border border-cyber-cyan px-7 py-3 rounded-[25px] text-cyber-cyan font-space uppercase tracking-widest text-sm hover:bg-cyber-cyan/10 hover:shadow-[0_0_20px_rgba(0,247,255,0.4)] transition-all"
                        >
                            View My Work
                        </a>
                        <a
                            href="/Siluna_Nusal_CV.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 border border-cyber-violet bg-cyber-violet/10 px-7 py-3 rounded-[25px] text-cyber-violet font-space uppercase tracking-widest text-sm hover:bg-cyber-violet/20 hover:shadow-[0_0_20px_rgba(181,55,242,0.4)] transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download CV
                        </a>
                    </motion.div>
                </div>

                {/* ===== RIGHT COLUMN: Holographic Panel ===== */}
                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: 0.4 }}
                    className="hidden lg:flex flex-col gap-4 pointer-events-auto w-[340px] shrink-0"
                >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {stats.map((s, i) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + i * 0.1 }}
                                className="flex flex-col items-center justify-center p-4 rounded-xl border border-cyber-cyan/20 bg-cyber-cyan/5 backdrop-blur-md text-center shadow-[0_0_10px_rgba(0,247,255,0.05)]"
                            >
                                <span className="text-lg font-orbitron font-black text-cyber-cyan drop-shadow-[0_0_6px_rgba(0,247,255,0.5)]">{s.value}</span>
                                <span className="text-[10px] font-space text-gray-500 tracking-widest uppercase mt-1">{s.label}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Terminal Window */}
                    <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,247,255,0.08),inset_0_0_40px_rgba(0,0,0,0.4)]">
                        {/* Traffic lights header */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(255,0,0,0.5)]" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400/80 shadow-[0_0_6px_rgba(255,200,0,0.5)]" />
                            <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-[0_0_6px_rgba(0,255,0,0.5)]" />
                            <span className="ml-2 text-[10px] font-space text-gray-600 tracking-widest">siluna@portfolio:~</span>
                        </div>
                        {/* Terminal body */}
                        <div className="p-4 font-mono text-xs space-y-1.5 min-h-[170px]">
                            {terminalLines.map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: line.delay + 0.5 }}
                                    className={line.color}
                                >
                                    {line.text}
                                </motion.div>
                            ))}
                            <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="inline-block w-2 h-4 bg-cyber-cyan align-middle shadow-[0_0_6px_var(--theme-primary)]"
                            />
                        </div>
                    </div>

                    {/* Tag Pills — original glassmorphism button style */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            { text: 'Android', color: 'hover:border-cyber-cyan/50 hover:text-cyber-cyan hover:shadow-[0_0_8px_rgba(0,247,255,0.2)]' },
                            { text: 'Kotlin', color: 'hover:border-cyber-violet/50 hover:text-cyber-violet hover:shadow-[0_0_8px_rgba(181,55,242,0.2)]' },
                            { text: 'Security', color: 'hover:border-cyber-pink/50 hover:text-cyber-pink hover:shadow-[0_0_8px_rgba(255,0,255,0.2)]' },
                            { text: 'Linux', color: 'hover:border-cyber-cyan/50 hover:text-cyber-cyan hover:shadow-[0_0_8px_rgba(0,247,255,0.2)]' },
                            { text: 'Docker', color: 'hover:border-cyber-violet/50 hover:text-cyber-violet hover:shadow-[0_0_8px_rgba(181,55,242,0.2)]' },
                            { text: 'Reverse Eng.', color: 'hover:border-cyber-pink/50 hover:text-cyber-pink hover:shadow-[0_0_8px_rgba(255,0,255,0.2)]' },
                        ].map((tag) => (
                            <span
                                key={tag.text}
                                className={`text-[10px] font-space tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-gray-400 transition-all cursor-default ${tag.color}`}
                            >
                                {tag.text}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-60 pointer-events-none">
                <span className="text-cyber-cyan text-[9px] font-space tracking-[0.3em] mb-2 uppercase">Scroll</span>
                <svg className="w-4 h-4 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
