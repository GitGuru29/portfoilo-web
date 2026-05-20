import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Custom Segmented LED Bar — light blue variant
function SegmentedBar({ label, value, max = 12 }) {
    const segments = Math.floor((value / 100) * max);

    return (
        <div className="flex flex-col gap-2 group cursor-default">
            <div className="flex justify-between items-center text-[10px] font-space uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-700 transition-colors">
                <span>{label}</span>
                <span className="text-[9px] tabular-nums">{value}%</span>
            </div>
            <div className="flex gap-1">
                {Array.from({ length: max }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-sm transition-colors duration-500 ${
                            i < segments
                                ? 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.35)]'
                                : 'bg-blue-200/60'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

// Circular Telemetry Ring — light blue variant
function TelemetryRing({ label, percentage }) {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 flex items-center justify-center cursor-default">
                <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                    <circle cx="40" cy="40" r={radius} stroke="rgba(147,197,253,0.4)" strokeWidth="3" fill="none" />
                    <circle
                        cx="40" cy="40" r={radius}
                        stroke="rgba(59,130,246,0.85)"
                        strokeWidth="3" fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_6px_rgba(59,130,246,0.4)] transition-all duration-1000 ease-out"
                    />
                </svg>
                <span className="text-xs font-space font-semibold text-blue-700 tracking-widest">{percentage}</span>
            </div>
            <span className="text-[9px] font-space uppercase tracking-[0.2em] text-slate-500 text-center max-w-[80px]">
                {label}
            </span>
        </div>
    );
}

export default function SkillsOverlay() {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(titleRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
                    scrollTrigger: { trigger: containerRef.current, start: "top 80%" }
                }
            );
            gsap.fromTo(cardsRef.current,
                { opacity: 0, y: 50, scale: 0.98 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.1, ease: "power3.out",
                    force3D: true,
                    scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // Shared card class
    const card = "rounded-3xl p-8 md:p-12 border border-blue-200/60 relative overflow-hidden flex flex-col justify-between group hover:border-blue-300/80 hover:shadow-[0_8px_40px_rgba(59,130,246,0.08)] transition-all duration-500 bg-[#EFF6FF]";

    return (
        <section id="skills" ref={containerRef} className="w-full py-32 px-6 flex flex-col items-center bg-transparent relative z-10">

            {/* Header */}
            <div ref={titleRef} className="w-full max-w-7xl mx-auto flex flex-col mb-16 md:mb-20 px-4">
                <span className="text-[10px] md:text-xs tracking-[0.4em] font-space uppercase text-[var(--color-geyser)]/40 mb-4">
                    Technical Specifications
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-space font-light text-[var(--color-geyser)] leading-tight">
                    Systems & Capabilities.
                </h2>
            </div>

            {/* Bento Grid */}
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">

                {/* 1. Core Languages (Span 2) */}
                <div ref={el => cardsRef.current[0] = el} className={`md:col-span-2 ${card}`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="mb-12 relative z-10">
                        <h3 className="text-slate-800 text-xl md:text-2xl font-space font-light mb-2">Core Languages</h3>
                        <p className="text-slate-500 text-xs font-inter max-w-sm">
                            High-performance compilation targets and deterministic execution.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 relative z-10">
                        <SegmentedBar label="C / C++" value={95} max={12} />
                        <SegmentedBar label="Kotlin / Java" value={90} max={12} />
                        <SegmentedBar label="Python" value={80} max={12} />
                        <SegmentedBar label="Bash / Shell" value={85} max={12} />
                    </div>
                </div>

                {/* 2. OS & Kernel (Span 1) */}
                <div ref={el => cardsRef.current[1] = el} className={`md:col-span-1 ${card}`}>
                    <div className="mb-10 relative z-10">
                        <h3 className="text-slate-800 text-xl md:text-2xl font-space font-light mb-2">OS & Kernel</h3>
                        <p className="text-slate-500 text-xs font-inter">
                            Low-level systems and embedded architectures.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6 justify-center relative z-10">
                        <TelemetryRing label="Linux Internals" percentage={92} />
                        <TelemetryRing label="Android NDK" percentage={88} />
                    </div>
                </div>

                {/* 3. Methodology (Span 1) */}
                <div ref={el => cardsRef.current[2] = el} className={`md:col-span-1 ${card}`}>
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-space text-slate-400 mb-10">
                        Methodology
                    </h3>

                    <div className="flex flex-col gap-8 mt-auto relative z-10">
                        <div>
                            <div className="text-4xl md:text-5xl font-space text-blue-600 font-light mb-1">O(1)</div>
                            <div className="text-[10px] uppercase tracking-widest text-slate-400">Algorithmic Efficiency</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-space text-blue-600 font-light mb-1">&lt;1ms</div>
                            <div className="text-[10px] uppercase tracking-widest text-slate-400">Latency Targets</div>
                        </div>
                    </div>
                </div>

                {/* 4. Architecture & Tooling (Span 2) */}
                <div ref={el => cardsRef.current[3] = el} className={`md:col-span-2 ${card}`}>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/4 pointer-events-none" />

                    <div className="mb-10 relative z-10">
                        <h3 className="text-slate-800 text-xl md:text-2xl font-space font-light mb-2">Architecture & Tooling</h3>
                        <p className="text-slate-500 text-xs font-inter max-w-sm">
                            Compilers, native deployment, and distributed systems.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:gap-3 relative z-10 mt-auto">
                        {['LLVM IR', 'Compiler Design', 'System Design', 'Reverse Engineering', 'POSIX', 'CMake / GCC', 'Docker', 'AWS'].map((tool, i) => (
                            <span
                                key={i}
                                className="px-4 py-2 rounded-full border border-blue-200 text-blue-700 text-[10px] md:text-xs font-space tracking-[0.1em] uppercase hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-default"
                            >
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
