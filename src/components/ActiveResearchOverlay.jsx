import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Typewriter from './Typewriter';

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
                { opacity: 0, y: 50, skewY: 2 },
                {
                    opacity: 1, y: 0, skewY: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power4.out",
                    force3D: true,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    }
                }
            );

            gsap.set(cardsRef.current, { opacity: 0, y: 50, scale: 0.98 });
            ScrollTrigger.batch(cardsRef.current, {
                start: "top 85%",
                onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 1.2, ease: "power3.out", overwrite: true, force3D: true }),
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full max-w-7xl mx-auto px-6 py-24 md:py-32 z-10 flex flex-col">
            
            {/* Structural line */}
            <div className="structural-line structural-line-h top-0 left-0 w-full hidden lg:block" />

            {/* Header */}
            <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
                <span className="header-fade text-xs md:text-sm tracking-[0.4em] font-space uppercase text-[var(--color-geyser)]/40 mb-4 md:mb-6">
                    <Typewriter text="Current Directives" triggerOnScroll={true} loop={false} cursorChar="_" />
                </span>
                <h2 className="header-fade text-3xl md:text-5xl lg:text-6xl font-space font-light text-[var(--color-geyser)] leading-tight">
                    <Typewriter text={["Active Research.", "Ongoing Engineering.", "Final Year & Compiler R&D."]} triggerOnScroll={true} pauseDuration={3000} cursorChar="_" />
                </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
                {ongoingProjects.map((project, idx) => (
                    <div 
                        key={idx}
                        ref={el => el && !cardsRef.current.includes(el) && cardsRef.current.push(el)}
                        data-cursor="Research Node"
                        className="group p-8 md:p-12 border border-[var(--color-geyser)]/10 flex flex-col hover:border-[var(--color-geyser)]/30 transition-colors duration-500 bg-[var(--color-quantum-black)] hover:bg-[var(--color-geyser)]/[0.02] relative overflow-hidden will-change-all"
                    >
                        <div className="absolute top-0 left-0 w-[2px] h-full bg-[var(--color-geyser)] scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-[0.16,1,0.3,1] origin-top" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-[var(--color-geyser)]/10 pb-4 gap-4">
                            <span className="text-[10px] tracking-[0.2em] font-space uppercase text-[var(--color-geyser)]/50">{project.type}</span>
                            <span className="text-[10px] tracking-[0.2em] font-space uppercase text-[var(--color-geyser)]">{project.status}</span>
                        </div>

                        <div className="mb-8 z-10">
                            <h3 className="text-2xl md:text-3xl font-space font-light text-[var(--color-geyser)] mb-4">
                                {project.title}
                            </h3>
                            <div className="text-[10px] font-mono tracking-widest text-[var(--color-geyser)]/40 uppercase mb-6">
                                Branch: {project.branch}
                            </div>
                            <p className="text-sm md:text-base text-[var(--color-geyser)]/60 font-inter font-light leading-relaxed">
                                {project.description}
                            </p>
                        </div>

                        <div className="mb-8 flex flex-col gap-3 z-10">
                            {project.tasks.map((task, i) => (
                                <div key={i} className="flex items-center gap-4 text-sm font-inter text-[var(--color-geyser)]/60 font-light">
                                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[var(--color-geyser)]' : 'border border-[var(--color-geyser)]/30'}`} />
                                    <span className={i === 0 ? "text-[var(--color-geyser)]" : ""}>{task}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-6 border-t border-[var(--color-geyser)]/10 flex flex-col gap-2 z-10">
                            <div className="flex justify-between text-[10px] font-space tracking-[0.2em] uppercase text-[var(--color-geyser)]/50">
                                <span>Completion</span>
                                <span>{project.progress}%</span>
                            </div>
                            <div className="w-full h-[1px] bg-[var(--color-geyser)]/10 relative mt-2">
                                <div 
                                    className="absolute top-0 left-0 h-full bg-[var(--color-geyser)] transition-all duration-1000 ease-[0.16,1,0.3,1]"
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </section>
    );
}
