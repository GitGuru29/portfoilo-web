import React from 'react';
import { GitBranch, Cpu, Activity, CheckCircle2, CircleDot, Circle } from 'lucide-react';
import usePageReveal from '../utils/usePageReveal';

export default function ActiveResearchOverlay() {
    const sectionRef = usePageReveal({ selector: '.research-card', y: 36, stagger: 0.12 });

    const ongoingProjects = [
        {
            id: 'LAB-01',
            title: 'AeroLang LLVM IR Backend & SSA Optimizer',
            type: 'COMPILER ENGINEERING',
            branch: 'wip/llvm-ir-generation',
            commit: 'a8f3d19',
            target: 'x86_64 · AArch64',
            description:
                'Rewriting the AeroLang compiler backend to lower typed AST nodes into Static Single Assignment (SSA) LLVM IR for aggressive dead-code elimination, loop unrolling, and cross-platform native machine code.',
            progress: 78,
            status: 'TESTING & BENCHMARKING',
            tasks: [
                { label: 'Lexical & Recursive-Descent AST Lowering', state: 'done' },
                { label: 'SSA Form & Dominance Frontier Construction', state: 'done' },
                { label: 'Linear-Scan Register Allocation & LLVM IR Pass', state: 'active' },
                { label: 'AArch64 / x86_64 Native Binary Emission', state: 'queued' },
            ],
            metricLabel: 'IR Lowering Overhead',
            metricValue: '< 1.4ms / 1K LOC',
        },
        {
            id: 'LAB-02',
            title: 'Final Year Thesis (FYP) — Deterministic IPC Core',
            type: 'SYSTEMS ARCHITECTURE',
            branch: 'feat/core-architecture',
            commit: 'c42e90b',
            target: 'Linux 6.x · C++20',
            description:
                'Architecting a high-throughput, low-latency distributed runtime for the final year undergraduate thesis. Focuses on arena-allocated memory pools, lock-free ring buffers, and deterministic wire protocols.',
            progress: 52,
            status: 'ACTIVE R&D',
            tasks: [
                { label: 'System Specification & Threat Model', state: 'done' },
                { label: 'Lock-Free Ring Buffer & Arena Allocator', state: 'done' },
                { label: 'Kernel Module & Zero-Copy Socket Transport', state: 'active' },
                { label: 'Multi-Node Latency & Fault-Injection Benchmarks', state: 'queued' },
            ],
            metricLabel: 'Target Tail Latency',
            metricValue: 'p99 < 250μs',
        },
        {
            id: 'LAB-03',
            title: 'Zero-Copy Cross-Device Bridge & Kernel Telemetry',
            type: 'ANDROID NDK & SECURITY',
            branch: 'exp/ebpf-ashmem-bridge',
            commit: '719b04c',
            target: 'Android 14+ · Linux',
            description:
                'Unifying AegisLayer behavioral inspection with ByBridge LAN framing via shared memory descriptors and low-overhead syscall telemetry hooks without frame drops or GC pressure.',
            progress: 64,
            status: 'PROTOTYPE VERIFICATION',
            tasks: [
                { label: 'Mutual TLS 1.3 & Ed25519 Device Pairing', state: 'done' },
                { label: 'JNI DirectByteBuffer Zero-Copy Pipeline', state: 'done' },
                { label: 'eBPF / Procfs Anomaly Scoring Heuristics', state: 'active' },
                { label: 'SELinux Policy & Background Battery Audit', state: 'queued' },
            ],
            metricLabel: 'Memory Footprint',
            metricValue: '< 9.2 MB RSS',
        },
    ];

    return (
        <section ref={sectionRef} className="relative z-10 flex flex-col gap-6">
            {/* Lab Summary Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border border-ink/20 bg-panel-deep/60 font-mono text-[10px] uppercase tracking-[0.2em] text-graphite">
                <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 bg-accent animate-pulse" />
                    <span className="font-bold text-ink">COLOMBO SYSTEMS LAB // WORKBENCH TELEMETRY</span>
                    <span className="hidden sm:inline text-ink/30">|</span>
                    <span className="hidden sm:inline">3 ACTIVE TRACKS</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>TOOLCHAIN: CLANG 18 / LLVM / NDK r26</span>
                    <span className="text-accent font-bold">STATUS: NOMINAL</span>
                </div>
            </div>

            {/* 3-Column Research Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                {ongoingProjects.map((project) => (
                    <article
                        key={project.id}
                        data-cursor="Research Node"
                        className="research-card group p-6 md:p-7 border border-ink/20 flex flex-col hover:border-accent transition-all duration-300 bg-panel hover:bg-panel-deep/40 relative overflow-hidden shadow-[0_6px_22px_rgba(15,18,24,0.05)]"
                    >
                        {/* Top Accent Spine */}
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-ink/15 group-hover:bg-accent transition-colors duration-300" />

                        {/* Header Meta Row */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-ink/15 gap-2">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-ink text-void font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
                                    {project.id}
                                </span>
                                <span className="text-[10px] tracking-[0.18em] font-mono uppercase text-graphite font-semibold">
                                    {project.type}
                                </span>
                            </div>
                            <span className="text-[9px] tracking-[0.18em] font-mono font-bold uppercase px-2 py-0.5 border border-accent/40 bg-accent/10 text-accent">
                                {project.status}
                            </span>
                        </div>

                        {/* Title & Git Metadata */}
                        <div className="mb-5">
                            <h3 className="text-xl md:text-2xl font-display font-bold text-ink leading-snug mb-3 group-hover:text-accent transition-colors">
                                {project.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-graphite mb-4">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-panel-deep border border-ink/15 text-ink">
                                    <GitBranch className="w-3 h-3 text-accent" />
                                    {project.branch}
                                </span>
                                <span className="px-2 py-0.5 bg-panel-deep border border-ink/15">
                                    @{project.commit}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-panel-deep border border-ink/15">
                                    <Cpu className="w-3 h-3 text-accent" />
                                    {project.target}
                                </span>
                            </div>

                            <p className="text-xs md:text-sm text-ink/80 font-serif leading-relaxed">
                                {project.description}
                            </p>
                        </div>

                        {/* Milestone Checklist */}
                        <div className="mb-6 pt-4 border-t border-dashed border-ink/15 flex flex-col gap-2.5">
                            <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-graphite mb-0.5">
                                Pipeline Milestones
                            </div>
                            {project.tasks.map((task, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-2.5 text-xs font-mono leading-snug"
                                >
                                    {task.state === 'done' && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                                    )}
                                    {task.state === 'active' && (
                                        <CircleDot className="w-3.5 h-3.5 text-ink animate-pulse shrink-0 mt-0.5" />
                                    )}
                                    {task.state === 'queued' && (
                                        <Circle className="w-3.5 h-3.5 text-graphite/50 shrink-0 mt-0.5" />
                                    )}
                                    <span
                                        className={
                                            task.state === 'done'
                                                ? 'text-ink/75 line-through decoration-ink/30'
                                                : task.state === 'active'
                                                ? 'text-ink font-bold'
                                                : 'text-graphite'
                                        }
                                    >
                                        {task.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Telemetry & Progress Bar */}
                        <div className="mt-auto pt-4 border-t border-ink/20 flex flex-col gap-2.5">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="text-graphite uppercase tracking-wider flex items-center gap-1.5">
                                    <Activity className="w-3 h-3 text-accent" />
                                    {project.metricLabel}:
                                </span>
                                <span className="font-bold text-ink">{project.metricValue}</span>
                            </div>

                            <div className="flex justify-between text-[10px] font-mono tracking-[0.2em] uppercase text-graphite">
                                <span>Track Completion</span>
                                <span className="font-bold text-accent">{project.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-ink/10 border border-ink/15 relative overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-accent transition-all duration-1000 ease-[0.16,1,0.3,1]"
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

