import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
    {
        year: '2023',
        quarter: 'Q3',
        title: 'Started Computer Engineering',
        type: 'EDUCATION',
        description: 'Began BSc in Computer Engineering, immediately diving into low-level systems, C/C++, and Android development as personal projects outside the curriculum.',
        tags: ['C/C++', 'University', 'Linux'],
    },
    {
        year: '2024',
        quarter: 'Q4',
        title: 'AutoGpuSwitcher for Arch Linux',
        type: 'PROJECT',
        description: 'Automated NVIDIA/AMD GPU switching via ELF binary analysis and pacman hooks — eliminating manual prime-run prefixes system-wide.',
        tags: ['Bash', 'ELF', 'Arch Linux', 'pacman'],
    },
    {
        year: '2024',
        quarter: 'Q3',
        title: 'NeonMonitor & Linux CLI Tooling',
        type: 'PROJECT',
        description: 'Developed a real-time Linux process monitor in C++ reading directly from /proc, with live CPU/memory telemetry and interactive process management.',
        tags: ['Linux', 'C++', '/proc', 'ncurses'],
    },
    {
        year: '2024',
        quarter: 'Q1',
        title: 'Bybridge — Cross-Device Daemon',
        type: 'PROJECT',
        description: 'Built a C++ daemon enabling real-time control of Arch Linux from Android over WebSocket and TCP with custom H.264 RTP streaming and biometric authentication.',
        tags: ['WebSocket', 'C++', 'Android', 'Kotlin'],
        highlight: true,
    },
    {
        year: '2025',
        quarter: 'Q1',
        title: 'AeroLang — Language Design Begins',
        type: 'PROJECT',
        description: 'Architected the lexer, parser, and AST pipeline for a custom programming language targeting native Android binaries via the NDK. Built from scratch in C++.',
        tags: ['C++', 'LLVM', 'Compiler Design'],
        highlight: true,
    },
    {
        year: '2026',
        quarter: 'Q2',
        title: 'AegisLayer — On-Device ML Daemon',
        type: 'PROJECT',
        description: 'Shipped an autonomous Android Kotlin daemon with a zero-dependency embedded ML pipeline for passive habit learning and automated device tuning.',
        tags: ['Kotlin', 'Android', 'ML', 'Coroutines'],
    },
    {
        year: '2026',
        quarter: 'Q1',
        title: 'Market Regime Intelligence System',
        type: 'PROJECT',
        description: 'Designed an AI-driven crypto trading system classifying market regimes using multi-factor analysis, dynamic risk models, and PySpark pipelines.',
        tags: ['Python', 'PySpark', 'AI/ML', 'Quant'],
        highlight: true,
    },
    {
        year: '2026',
        quarter: 'NOW',
        title: 'Final Year Project & LLVM Backend',
        type: 'ACTIVE',
        description: 'Completing final year thesis on high-performance distributed systems while upgrading AeroLang to target LLVM IR for native cross-platform binaries.',
        tags: ['LLVM IR', 'Distributed Systems', 'Research'],
    },
];

export default function TimelineSection() {
    const containerRef = useRef(null);
    const spineRef = useRef(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate spine line growing downward
            gsap.fromTo(spineRef.current,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    duration: 2.5,
                    ease: 'power3.inOut',
                    transformOrigin: 'top center',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 70%',
                    }
                }
            );

            // Animate each card
            cardRefs.current.forEach((el, i) => {
                if (!el) return;
                const isLeft = i % 2 === 0;
                gsap.fromTo(el,
                    { opacity: 0, x: isLeft ? -30 : 30, y: 50 },
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        duration: 1.2,
                        ease: "power3.out",
                        force3D: true,
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                        }
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="timeline" className="relative w-full py-32 px-6 overflow-hidden z-10">
            {/* Structural line */}
            <div className="structural-line structural-line-h top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl hidden lg:block" />

            <div className="max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-20 md:mb-32 flex flex-col items-center text-center">
                    <span className="text-xs md:text-sm tracking-[0.4em] font-space uppercase text-[var(--color-geyser)]/40 mb-4 md:mb-6">
                        Engineering History
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-space font-light text-[var(--color-geyser)] leading-tight">
                        The Build Log.
                    </h2>
                </div>

                {/* Timeline */}
                <div className="relative flex flex-col items-center">
                    {/* Vertical spine */}
                    <div
                        ref={spineRef}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--color-geyser)]/20 to-transparent origin-top hidden md:block"
                    />

                    {/* Mobile spine */}
                    <div className="absolute top-0 left-6 w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--color-geyser)]/20 to-transparent md:hidden" />

                    {milestones.map((m, i) => {
                        const isLeft = i % 2 === 0;
                        return (
                            <div
                                key={i}
                                ref={el => cardRefs.current[i] = el}
                                className={`relative w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 mb-12 md:mb-16 will-change-all`}
                            >
                                {/* Left side — even cards */}
                                <div className={`${isLeft ? 'md:pr-12 md:text-right flex flex-col md:items-end' : 'hidden md:block'}`}>
                                    {isLeft && (
                                        <TimelineCard milestone={m} />
                                    )}
                                </div>

                                {/* Center node */}
                                <div className="hidden md:flex flex-col items-center justify-start pt-2 w-6">
                                    <div className={`w-2 h-2 rounded-full border ${m.highlight ? 'bg-blue-400 border-blue-400' : 'bg-transparent border-blue-400/40'} mt-3 shrink-0 relative z-10`} />
                                </div>

                                {/* Right side — odd cards */}
                                <div className={`${!isLeft ? 'md:pl-12 flex flex-col md:items-start' : 'hidden md:block'}`}>
                                    {!isLeft && (
                                        <TimelineCard milestone={m} />
                                    )}
                                </div>

                                {/* Mobile layout — all left */}
                                <div className="pl-12 flex flex-col items-start md:hidden">
                                    <div className="absolute left-[21px] top-3 w-2 h-2 rounded-full border border-blue-400/40 bg-transparent z-10" />
                                    <TimelineCard milestone={m} mobile />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function TimelineCard({ milestone, mobile = false }) {
    const isActive = milestone.type === 'ACTIVE';

    return (
        <div className={`group p-6 md:p-8 border border-blue-400/20 hover:border-blue-400/50 transition-all duration-500 bg-transparent hover:bg-blue-400/[0.02] relative overflow-hidden ${isActive ? 'border-blue-400/50' : ''}`}>
            {/* Accent line */}
            <div className="absolute top-0 left-0 w-[2px] h-full bg-blue-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-[0.16,1,0.3,1] origin-top" />

            {/* Header row */}
            <div className="flex items-center justify-between mb-4 gap-4">
                <span className="text-[9px] md:text-[10px] tracking-[0.25em] font-space uppercase text-[var(--color-geyser)]/40">
                    {milestone.type}
                </span>
                <span className={`text-[9px] md:text-[10px] font-space tracking-[0.2em] font-bold ${isActive ? 'text-[var(--color-geyser)]' : 'text-[var(--color-geyser)]/50'}`}>
                    {milestone.year} · {milestone.quarter}
                </span>
            </div>

            <h3 className="text-base md:text-lg font-space font-light text-[var(--color-geyser)] mb-3 leading-snug">
                {milestone.title}
            </h3>
            <p className="text-sm font-inter font-light text-[var(--color-geyser)]/50 leading-relaxed mb-5">
                {milestone.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                {milestone.tags.map((tag, ti) => (
                    <span key={ti} className="text-[9px] font-space tracking-[0.15em] uppercase text-[var(--color-geyser)]/40 border border-[var(--color-geyser)]/10 px-2 py-1">
                        {tag}
                    </span>
                ))}
            </div>

            {isActive && (
                <div className="mt-5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-geyser)] animate-pulse" />
                    <span className="text-[9px] font-space tracking-[0.2em] uppercase text-[var(--color-geyser)]/60">Live</span>
                </div>
            )}
        </div>
    );
}
