import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowUpDown } from 'lucide-react';
import usePageReveal from '../utils/usePageReveal';

const milestones = [
    {
        id: 'log-08',
        year: '2026',
        quarter: 'NOW',
        title: 'Final Year Thesis & AeroLang LLVM Backend',
        type: 'ACTIVE R&D',
        domain: 'Distributed Systems & Compiler IR',
        projectId: 'aerolang',
        description: 'Completing final year research thesis on high-performance distributed systems while upgrading the AeroLang compiler backend to emit optimized LLVM IR for cross-platform native binaries.',
        tags: ['LLVM IR', 'C++20', 'Distributed Systems', 'SSA Passes'],
        highlight: true,
    },
    {
        id: 'log-07',
        year: '2026',
        quarter: 'Q2',
        title: 'AegisLayer — On-Device ML System Daemon',
        type: 'SYSTEM DAEMON',
        domain: 'Android Internals & Embedded ML',
        projectId: 'aegislayer',
        description: 'Shipped an autonomous Android Kotlin daemon with a zero-dependency embedded machine learning pipeline for passive habit learning and automated system tuning under a <8MB RAM ceiling.',
        tags: ['Kotlin', 'Android Internals', 'Zero-Dep ML', 'Coroutines'],
        highlight: true,
    },
    {
        id: 'log-06',
        year: '2026',
        quarter: 'Q1',
        title: 'Market Regime Intelligence Engine',
        type: 'QUANTITATIVE AI',
        domain: 'Multi-Factor Regime Classification',
        projectId: 'market-regime-intelligence',
        description: 'Designed an AI-driven quantitative market intelligence system classifying volatility regimes using multi-factor analysis, dynamic risk models, and distributed PySpark pipelines.',
        tags: ['Python', 'PySpark', 'Quantitative ML', 'Risk Engine'],
        highlight: true,
    },
    {
        id: 'log-05',
        year: '2025',
        quarter: 'Q3',
        title: 'TitanShare — Kernel uinput & mDNS Suite',
        type: 'LINUX / ANDROID',
        domain: 'Hardware Input Emulation',
        projectId: 'titanshare',
        description: 'Engineered a cross-platform integration suite bridging Android and Linux with a C++ daemon utilizing kernel /dev/uinput hardware emulation, zero-config mDNS discovery, and systemd integration.',
        tags: ['C++', 'uinput', 'mDNS', 'systemd', 'Binary Protocol'],
    },
    {
        id: 'log-04',
        year: '2025',
        quarter: 'Q1',
        title: 'AeroLang — Compiler Frontend & AST Architecture',
        type: 'COMPILER ENG',
        domain: 'Language Design & NDK Codegen',
        projectId: 'aerolang',
        description: 'Architected the deterministic lexer, recursive-descent parser, and AST verification pipeline for a custom compiled programming language targeting native Android binaries via the NDK.',
        tags: ['C++', 'LLVM', 'Compiler Design', 'Android NDK'],
        highlight: true,
    },
    {
        id: 'log-03',
        year: '2024',
        quarter: 'Q4',
        title: 'AutoGpuSwitcher for Arch Linux',
        type: 'KERNEL / OS',
        domain: 'ELF Binary Analysis & Pacman Hooks',
        projectId: 'autogpuswitcher',
        description: 'Automated hybrid NVIDIA/AMD GPU switching via ELF symbol inspection and pacman transaction hooks — eliminating manual prime-run prefixes system-wide with zero background daemon overhead.',
        tags: ['Bash', 'ELF Internals', 'Arch Linux', 'pacman Hooks'],
    },
    {
        id: 'log-02',
        year: '2024',
        quarter: 'Q3',
        title: 'NeonMonitor & Direct /proc CLI Tooling',
        type: 'LINUX TOOLING',
        domain: 'System Telemetry & Process Control',
        projectId: 'neonmonitor',
        description: 'Developed a real-time Linux process monitor in C++ reading directly from /proc/stat and VmRSS descriptors, featuring live CPU delta telemetry and signal dispatch.',
        tags: ['Linux', 'C++17', '/proc', 'ncurses TUI'],
    },
    {
        id: 'log-01',
        year: '2024',
        quarter: 'Q1',
        title: 'Bybridge — Cross-Device Ecosystem Daemon',
        type: 'NETWORKING IPC',
        domain: 'POSIX Sockets & H.264 RTP Streaming',
        projectId: 'bybridge',
        description: 'Built a C++ daemon enabling real-time control of Arch Linux from Android over WebSocket and TCP with custom H.264 RTP screen streaming and hardware biometric authentication.',
        tags: ['WebSocket', 'C++', 'Android', 'H.264 RTP'],
        highlight: true,
    },
    {
        id: 'log-00',
        year: '2023',
        quarter: 'Q3',
        title: 'BSc in Software Engineering — Systems Track',
        type: 'FOUNDATION',
        domain: 'Computer Science & Low-Level Systems',
        description: 'Commenced BSc in Software Engineering, immediately focusing on C/C++ memory models, Linux kernel internals, and native Android architecture.',
        tags: ['C/C++', 'Computer Architecture', 'Linux', 'Algorithms'],
    },
];

export default function TimelineSection() {
    const [newestFirst, setNewestFirst] = useState(true);
    const containerRef = usePageReveal({ selector: '.timeline-row', y: 36, stagger: 0.08 });

    const orderedMilestones = useMemo(() => {
        return newestFirst ? milestones : [...milestones].reverse();
    }, [newestFirst]);

    return (
        <section ref={containerRef} id="timeline" className="relative w-full overflow-hidden z-10">
            {/* Top Chronicle Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b border-ink/20">
                <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] uppercase text-graphite">
                    <span className="w-2 h-2 bg-accent inline-block rotate-45" />
                    <span>CHRONOLOGICAL BUILD LOG · {milestones.length} RECORDED MILESTONES (2023–2026)</span>
                </div>
                <button
                    type="button"
                    onClick={() => setNewestFirst((v) => !v)}
                    className="px-3 py-1.5 border border-ink/25 bg-panel hover:border-accent hover:text-accent font-mono text-[9.5px] tracking-[0.2em] uppercase text-ink flex items-center gap-2 transition-colors cursor-pointer"
                >
                    <ArrowUpDown size={11} className="text-accent" />
                    <span>ORDER: {newestFirst ? 'NEWEST FIRST (2026 → 2023)' : 'CHRONOLOGICAL (2023 → 2026)'}</span>
                </button>
            </div>

            <div className="relative flex flex-col items-center">
                {/* Vertical spine (Desktop) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-accent/60 via-ink/25 to-transparent origin-top hidden md:block" />

                {/* Mobile spine */}
                <div className="absolute top-0 left-4 w-[1px] h-full bg-gradient-to-b from-accent/60 via-ink/25 to-transparent md:hidden" />

                {orderedMilestones.map((m, i) => {
                    const isLeft = i % 2 === 0;
                    const idxLabel = String(newestFirst ? milestones.length - i : i + 1).padStart(2, '0');

                    return (
                        <div
                            key={m.id}
                            className="timeline-row relative w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 mb-8 md:mb-10 will-change-all"
                        >
                            {/* Left side */}
                            <div className={`hidden md:flex ${isLeft ? 'md:pr-10 flex-col items-end' : 'md:pr-10 flex-col items-end justify-start pt-4 text-right'}`}>
                                {isLeft ? (
                                    <TimelineCard milestone={m} idxLabel={idxLabel} />
                                ) : (
                                    <TimelineOppositeMeta milestone={m} idxLabel={idxLabel} align="right" />
                                )}
                            </div>

                            {/* Center node */}
                            <div className="hidden md:flex flex-col items-center justify-start pt-5 w-8">
                                <div
                                    className={`w-3 h-3 rotate-45 border transition-transform duration-300 ${
                                        m.highlight
                                            ? 'bg-accent border-accent shadow-[0_0_12px_var(--color-accent)]'
                                            : 'bg-panel border-ink/50'
                                    } shrink-0 relative z-10`}
                                />
                            </div>

                            {/* Right side */}
                            <div className={`hidden md:flex ${!isLeft ? 'md:pl-10 flex-col items-start' : 'md:pl-10 flex-col items-start justify-start pt-4 text-left'}`}>
                                {!isLeft ? (
                                    <TimelineCard milestone={m} idxLabel={idxLabel} />
                                ) : (
                                    <TimelineOppositeMeta milestone={m} idxLabel={idxLabel} align="left" />
                                )}
                            </div>

                            {/* Mobile layout */}
                            <div className="pl-10 flex flex-col items-start md:hidden relative">
                                <div
                                    className={`absolute left-[11px] top-5 w-2.5 h-2.5 rotate-45 border z-10 ${
                                        m.highlight ? 'bg-accent border-accent' : 'bg-panel border-ink/50'
                                    }`}
                                />
                                <TimelineCard milestone={m} idxLabel={idxLabel} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function TimelineOppositeMeta({ milestone, idxLabel, align }) {
    const isActive = milestone.type === 'ACTIVE R&D';
    return (
        <div className={`flex flex-col gap-1 select-none opacity-85 ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
            <span className="font-mono text-[9px] tracking-[0.26em] uppercase text-accent font-bold">
                CHRONICLE // {idxLabel}
            </span>
            <div className="font-display font-bold text-3xl lg:text-4xl text-ink leading-none tracking-tight tabular-nums">
                {milestone.year} <span className="text-accent text-xl">· {milestone.quarter}</span>
            </div>
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-graphite">
                {milestone.domain}
            </span>
            {isActive && (
                <span className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8.5px] tracking-[0.2em] uppercase text-emerald-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    CURRENT WORKBENCH
                </span>
            )}
        </div>
    );
}

function TimelineCard({ milestone, idxLabel }) {
    const isActive = milestone.type === 'ACTIVE R&D';

    return (
        <div
            className={`w-full group p-5 sm:p-6 border transition-all duration-300 bg-panel hover:bg-panel-deep/60 relative overflow-hidden shadow-[4px_4px_0_rgba(0,0,0,0.05)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.1)] ${
                isActive ? 'border-accent/60' : 'border-ink/20 hover:border-accent'
            }`}
        >
            {/* Left Accent Spine */}
            <div className="absolute top-0 left-0 w-[3px] h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

            {/* Header row */}
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-ink/15 gap-3">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-ink text-panel font-mono text-[8.5px] tracking-[0.22em] uppercase font-bold">
                        {milestone.type}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-graphite hidden sm:inline">
                        LOG #{idxLabel}
                    </span>
                </div>
                <span className={`text-[10px] font-mono tracking-[0.2em] font-bold ${isActive ? 'text-accent' : 'text-ink/80'}`}>
                    {milestone.year} · {milestone.quarter}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-lg md:text-xl font-display font-bold text-ink mb-2 leading-snug group-hover:text-accent transition-colors">
                {milestone.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-[13.5px] font-sans text-graphite leading-relaxed mb-4">
                {milestone.description}
            </p>

            {/* Footer: Tags + Link */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-ink/10">
                <div className="flex flex-wrap gap-1.5">
                    {milestone.tags.map((tag, ti) => (
                        <span
                            key={ti}
                            className="text-[8.5px] font-mono tracking-[0.15em] uppercase text-ink/80 border border-ink/20 bg-panel-deep/50 px-2 py-0.5"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {milestone.projectId && (
                    <Link
                        to={`/project/${milestone.projectId}`}
                        data-cursor="Open Dossier"
                        className="inline-flex items-center gap-1 font-mono text-[9.5px] tracking-[0.2em] uppercase text-accent font-bold hover:underline no-underline ml-auto"
                    >
                        <span>Dossier</span>
                        <ArrowUpRight size={12} />
                    </Link>
                )}
            </div>
        </div>
    );
}
