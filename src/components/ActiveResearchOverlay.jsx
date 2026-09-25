import React from 'react';
import usePageReveal from '../utils/usePageReveal';

export default function ActiveResearchOverlay() {
    const sectionRef = usePageReveal({ selector: '.research-card', y: 36, stagger: 0.14 });

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

    return (
        <section ref={sectionRef} className="relative z-10 flex flex-col">

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 w-full">
                {ongoingProjects.map((project, idx) => (
                    <div
                        key={idx}
                        data-cursor="Research Node"
                        className="research-card group p-6 md:p-8 border border-ink/12 flex flex-col hover:border-accent/50 transition-colors duration-500 bg-panel hover:bg-panel-deep/70 relative overflow-hidden will-change-all"
                    >
                        <div className="absolute top-0 left-0 w-[2px] h-full bg-[var(--color-geyser)] scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-[0.16,1,0.3,1] origin-top" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-[var(--color-geyser)]/10 pb-3 gap-3">
                            <span className="text-[10px] tracking-[0.2em] font-space uppercase text-[var(--color-geyser)]/50">{project.type}</span>
                            <span className="text-[10px] tracking-[0.2em] font-space uppercase text-[var(--color-geyser)]">{project.status}</span>
                        </div>

                        <div className="mb-6 z-10">
                            <h3 className="text-xl md:text-2xl font-space font-light text-[var(--color-geyser)] mb-3">
                                {project.title}
                            </h3>
                            <div className="text-[10px] font-mono tracking-widest text-[var(--color-geyser)]/40 uppercase mb-4">
                                Branch: {project.branch}
                            </div>
                            <p className="text-sm md:text-base text-[var(--color-geyser)]/60 font-inter font-light leading-relaxed">
                                {project.description}
                            </p>
                        </div>

                        <div className="mb-6 flex flex-col gap-2.5 z-10">
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
