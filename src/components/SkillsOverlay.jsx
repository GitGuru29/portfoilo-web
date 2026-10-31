import React from 'react';
import { Terminal, Smartphone, Cpu, Activity } from 'lucide-react';
import usePageReveal from '../utils/usePageReveal';

const ARCHITECTURAL_PILLARS = [
    {
        num: '01',
        title: 'Linux & Kernel Systems',
        subtitle: 'C/C++20 · POSIX · Daemons',
        icon: Terminal,
        summary: 'Low-overhead background daemons, hardware input emulation (/dev/uinput), direct /proc telemetry, and ELF binary inspection.',
        specs: ['POSIX Sockets & Threads', 'Linux uinput / evdev', 'systemd & IPC', 'ELF Symbol Analysis'],
    },
    {
        num: '02',
        title: 'Android & NDK Internals',
        subtitle: 'Kotlin · JNI/NDK · AOSP',
        icon: Smartphone,
        summary: 'System-level Android services, native C++ bridges via JNI, zero-config LAN discovery (NSD/mDNS), and hardware overlays.',
        specs: ['Kotlin Coroutines', 'Android NDK / C++', 'System Overlays', 'Hardware Biometrics'],
    },
    {
        num: '03',
        title: 'Compilers & Toolchains',
        subtitle: 'LLVM IR · AST · Codegen',
        icon: Cpu,
        summary: 'End-to-end language implementation from hand-written lexers and recursive-descent parsers to SSA form and LLVM IR emission.',
        specs: ['LLVM IR Backend', 'AST Verification', 'CMake / Clang / GCC', 'Cross-Compilation'],
    },
    {
        num: '04',
        title: 'Embedded ML & Quant',
        subtitle: '0-Dep ML · Python · PySpark',
        icon: Activity,
        summary: 'Deterministic on-device habit inference pipelines in pure Kotlin alongside multi-factor quantitative market regime classifiers.',
        specs: ['Zero-Dep On-Device ML', 'PySpark Pipelines', 'Regime Classification', 'Risk-Adaptive Models'],
    },
];

const MARKET_ROWS = [
    { item: 'C / C++ (17/20)', domain: 'Daemons · Compilers · NDK', index: 95, delta: '▲ PRIMARY' },
    { item: 'Kotlin / Java', domain: 'Android System Services · UI', index: 92, delta: '▲ PRIMARY' },
    { item: 'Linux Internals', domain: '/proc · uinput · ELF · systemd', index: 92, delta: '▲ FIRMING' },
    { item: 'LLVM & Compiler IR', domain: 'Lexer · Parser · AST · SSA', index: 86, delta: '▲ EXPANDING' },
    { item: 'Android NDK / JNI', domain: 'Native Bridges · Binary IPC', index: 88, delta: '▲ STEADY' },
    { item: 'Bash / Shell / POSIX', domain: 'Pacman Hooks · Build Automation', index: 87, delta: '— STEADY' },
    { item: 'Python & PySpark', domain: 'Quantitative ML · Data Pipelines', index: 84, delta: '▲ STEADY' },
    { item: 'React & Modern Web', domain: 'Interactive Systems · Three.js', index: 82, delta: '— STEADY' },
];

const COMMODITY_ROWS = [
    { item: 'IPC Dispatch Latency', rate: '< 1.0 ms' },
    { item: 'Daemon Memory Ceiling', rate: '< 8.0 MB' },
    { item: 'Production Systems Shipped', rate: '12+ Builds' },
    { item: 'Engineering Practice', rate: '3+ Years' },
];

const CLASSIFIEDS = [
    'LLVM IR · SSA pass design & native codegen',
    'Kernel uinput · hardware input device emulation',
    'H.264 RTP · real-time low-latency video streaming',
    'ELF64 · binary header & symbol table inspection',
    'mDNS / NSD · zero-configuration LAN discovery',
    'Custom Binary Protocols · zero-copy socket framing',
    'CMake / Make / Ninja · deterministic build graphs',
    'Docker & Linux Namespaces · process isolation',
];

export default function SkillsOverlay() {
    const containerRef = usePageReveal({ selector: '.pillar-card, .story-card', y: 30, stagger: 0.08 });

    return (
        <section id="skills" ref={containerRef} className="w-full flex flex-col gap-6 bg-transparent relative z-10">

            {/* ── TOP: 4 ARCHITECTURAL DOMAIN PLATES ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ARCHITECTURAL_PILLARS.map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                        <div
                            key={pillar.num}
                            className="pillar-card group p-5 border border-ink/25 bg-panel hover:border-accent transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-[4px_4px_0_rgba(0,0,0,0.05)]"
                        >
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                            <div>
                                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-ink/15">
                                    <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-accent font-bold">
                                        DOMAIN // {pillar.num}
                                    </span>
                                    <Icon size={14} className="text-ink/70 group-hover:text-accent transition-colors" />
                                </div>

                                <h3 className="font-display font-bold text-lg text-ink group-hover:text-accent transition-colors leading-snug">
                                    {pillar.title}
                                </h3>
                                <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-graphite mt-0.5 mb-2.5">
                                    {pillar.subtitle}
                                </div>

                                <p className="font-sans text-xs text-graphite leading-relaxed mb-4">
                                    {pillar.summary}
                                </p>
                            </div>

                            <div className="pt-2.5 border-t border-ink/10 flex flex-wrap gap-1.5">
                                {pillar.specs.map((s) => (
                                    <span
                                        key={s}
                                        className="font-mono text-[8px] tracking-[0.14em] uppercase px-2 py-0.5 bg-panel-deep/60 border border-ink/15 text-ink/85"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── BOTTOM: MARKET INDICES + COMMODITIES & CLASSIFIEDS ── */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-start">

                {/* Left (7 cols): MARKET INDICES table with visual proficiency meters */}
                <div className="lg:col-span-7 story-card p-5 sm:p-7">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-ink/20">
                        <div>
                            <h3 className="text-ink text-lg md:text-xl font-display font-bold uppercase tracking-tight">
                                Systems &amp; Language Quotations
                            </h3>
                            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-graphite mt-0.5">
                                AUDITED PROFICIENCY INDEX · PRODUCTION BENCHMARKS
                            </p>
                        </div>
                        <span className="meta-tag text-accent font-bold">[ LEDGER 01 ]</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="classified-table">
                            <thead>
                                <tr>
                                    <th>Discipline / Language</th>
                                    <th className="hidden sm:table-cell">Primary Application</th>
                                    <th>Index</th>
                                    <th>Standing</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MARKET_ROWS.map((r) => (
                                    <tr key={r.item}>
                                        <td className="font-mono font-bold text-ink">{r.item}</td>
                                        <td className="hidden sm:table-cell font-mono text-[10px] text-graphite">{r.domain}</td>
                                        <td className="tabular-nums min-w-[95px]">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-ink w-6">{r.index}</span>
                                                <div className="flex-1 h-1.5 bg-ink/10 overflow-hidden min-w-[44px]">
                                                    <div
                                                        className="h-full bg-accent"
                                                        style={{ width: `${r.index}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-accent font-semibold whitespace-nowrap text-[10px]">{r.delta}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right (5 cols): RATES / COMMODITIES + CLASSIFIEDS */}
                <div className="lg:col-span-5 flex flex-col gap-5">
                    <div className="story-card p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-ink/20">
                            <h3 className="text-ink text-base md:text-lg font-display font-bold uppercase tracking-tight">
                                Engineering SLAs &amp; Rates
                            </h3>
                            <span className="meta-tag text-accent font-bold">[ LEDGER 02 ]</span>
                        </div>
                        <table className="classified-table">
                            <thead>
                                <tr>
                                    <th>Metric / Benchmark</th>
                                    <th>Target Specification</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMMODITY_ROWS.map((r) => (
                                    <tr key={r.item}>
                                        <td className="font-mono text-ink/90">{r.item}</td>
                                        <td className="tabular-nums text-accent font-bold">{r.rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="story-card p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-4 border-b border-ink/20 pb-2.5">
                            <h3 className="text-ink text-base md:text-lg font-display font-bold uppercase tracking-tight">
                                Specialized Capabilities Index
                            </h3>
                            <span className="meta-tag text-accent font-bold">[ LEDGER 03 ]</span>
                        </div>
                        <ul className="classified-list">
                            {CLASSIFIEDS.map((c, i) => (
                                <li key={i} className="flex gap-3 items-baseline py-0.5 border-b last:border-b-0 border-ink/10">
                                    <span className="text-accent font-mono font-bold text-[10px]">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-[10.5px]">{c}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </section>
    );
}
