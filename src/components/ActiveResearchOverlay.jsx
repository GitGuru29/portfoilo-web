import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Activity, Terminal } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ActiveResearchOverlay() {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);

    const ongoingProjects = [
        {
            title: "Final Year Project (FYP)",
            type: "RESEARCH & DEVELOPMENT",
            branch: "feat/core-architecture",
            description: "Architecting a high-performance system for the final year thesis. Focusing on low-latency memory management and distributed networking protocols.",
            progress: 45,
            tasks: ["System Design", "Kernel Module Implementation", "Benchmarking"],
            status: "IN PROGRESS"
        },
        {
            title: "AeroLang LLVM Backend",
            type: "COMPILER ENGINEERING",
            branch: "wip/llvm-ir-generation",
            description: "Rewriting the AeroLang compiler backend to target LLVM IR for aggressive optimizations and cross-platform native binaries.",
            progress: 75,
            tasks: ["AST to IR Lowering", "Register Allocation", "Optimization Passes"],
            status: "TESTING"
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.header-fade',
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0,
                    duration: 1,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    }
                }
            );

            // Animate cards
            gsap.set(cardsRef.current, { opacity: 0, x: -50 });
            ScrollTrigger.batch(cardsRef.current, {
                start: "top 85%",
                onEnter: (batch) => gsap.to(batch, { opacity: 1, x: 0, stagger: 0.15, duration: 0.8, ease: "power3.out", overwrite: true }),
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const renderProgressBar = (percentage) => {
        const totalBlocks = 20;
        const filledBlocks = Math.round((percentage / 100) * totalBlocks);
        const emptyBlocks = totalBlocks - filledBlocks;
        
        return (
            <div className="flex flex-col gap-2 font-mono text-xs w-full">
                <div className="flex justify-between items-center text-cyber-cyan">
                    <span>BUILD_PROGRESS</span>
                    <span>{percentage}%</span>
                </div>
                <div className="text-gray-500 tracking-[0.2em] w-full break-all">
                    [{'█'.repeat(filledBlocks)}{'░'.repeat(emptyBlocks)}]
                </div>
            </div>
        );
    };

    return (
        <section ref={sectionRef} className="relative w-full max-w-6xl mx-auto px-6 py-24 md:py-32 z-10 flex flex-col">
            
            {/* Header */}
            <div className="mb-16 md:mb-24">
                <span className="header-fade text-sm font-space tracking-widest text-cyber-violet mb-4 uppercase flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyber-violet animate-pulse shadow-[0_0_10px_var(--theme-secondary)]" />
                    Current Directives
                </span>
                <h2 className="header-fade text-4xl md:text-6xl lg:text-7xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
                    ACTIVE <span className="text-cyber-cyan drop-shadow-[0_0_20px_rgba(0,243,255,0.4)]">R&D</span>
                </h2>
                <div className="header-fade w-24 h-1 bg-gradient-to-r from-cyber-cyan to-transparent mt-8 rounded-full" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {ongoingProjects.map((project, idx) => (
                    <div 
                        key={idx}
                        ref={el => el && !cardsRef.current.includes(el) && cardsRef.current.push(el)}
                        className="glass p-8 md:p-10 rounded-3xl border border-white/5 bg-[#050505]/80 backdrop-blur-xl hover:border-cyber-cyan/30 transition-all duration-500 flex flex-col relative group overflow-hidden"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-br from-cyber-cyan/10 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />
                        
                        {/* Top Bar */}
                        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4 relative z-10">
                            <div className="flex items-center gap-2 text-xs font-space tracking-widest text-gray-400">
                                <Terminal className="w-3.5 h-3.5" />
                                <span>{project.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_8px_#00f3ff]" />
                                <span className="text-xs font-space tracking-widest text-cyber-cyan uppercase">{project.status}</span>
                            </div>
                        </div>

                        {/* Title & Desc */}
                        <div className="relative z-10 mb-8">
                            <h3 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-4 group-hover:text-cyber-cyan transition-colors">
                                {project.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs font-mono text-[#7dcfff] bg-[#7dcfff]/10 w-max px-3 py-1 rounded mb-6">
                                <GitBranch className="w-3.5 h-3.5" />
                                {project.branch}
                            </div>
                            <p className="text-gray-400 font-inter font-light leading-relaxed text-sm">
                                {project.description}
                            </p>
                        </div>

                        {/* Tasks Checklist */}
                        <div className="relative z-10 mb-8 flex flex-col gap-2">
                            {project.tasks.map((task, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-inter text-gray-300">
                                    <div className="w-3 h-3 border border-cyber-violet rounded-sm flex items-center justify-center">
                                        {i === 0 && <div className="w-1.5 h-1.5 bg-cyber-violet rounded-sm" />}
                                    </div>
                                    <span className={i === 0 ? "text-white" : "opacity-60"}>{task}</span>
                                </div>
                            ))}
                        </div>

                        {/* Terminal Progress Bar */}
                        <div className="mt-auto pt-6 border-t border-white/5 relative z-10">
                            {renderProgressBar(project.progress)}
                        </div>

                    </div>
                ))}
            </div>

        </section>
    );
}
