import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Terminal, ArrowUpRight, Copy, Check, Calendar, Cpu, Shield, Layers } from 'lucide-react';
import useStore, { MOODS } from '../store/useStore';
import { anchorToSection } from '../utils/scrollToSection';
import { playClickSound } from '../utils/soundFX';

const S = {
    paper: 'var(--color-void)',
    panel: 'var(--color-panel)',
    ink: 'var(--color-ink)',
    graphite: 'var(--color-graphite)',
    line: 'var(--ch-rule)',
    crimson: 'var(--ch-ink)',
    mono: 'var(--font-mono)',
    serif: 'var(--font-display)',
    blackletter: 'var(--font-blackletter)',
    body: 'var(--font-inter)',
};

/* ─── Folio-style countup (circulation indices) ─── */
function FolioStat({ target, suffix, prefix = '', label, sublabel, started }) {
    const numRef = useRef(null);
    useEffect(() => {
        if (!started || !numRef.current) return;
        const obj = { val: 0 };
        const tw = gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate() {
                if (numRef.current) {
                    numRef.current.textContent = prefix + Math.round(obj.val) + suffix;
                }
            },
            onComplete() {
                if (numRef.current) {
                    numRef.current.textContent = prefix + target + suffix;
                }
            },
        });
        return () => tw.kill();
    }, [started, target, suffix, prefix]);

    return (
        <div className="flex flex-col gap-1 pr-3 border-r last:border-r-0 border-ink/15">
            <div
                ref={numRef}
                style={{
                    fontFamily: S.serif,
                    fontSize: 'clamp(1.45rem, 2.2vw, 2.25rem)',
                    fontWeight: 700,
                    lineHeight: 1,
                    color: S.ink,
                    fontVariantNumeric: 'tabular-nums',
                }}
            >
                {prefix}0{suffix}
            </div>
            <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink/80 font-semibold">
                {label}
            </div>
            {sublabel && (
                <div className="font-mono text-[8px] tracking-[0.14em] uppercase text-graphite">
                    {sublabel}
                </div>
            )}
        </div>
    );
}

const FRONT_PAGE_HIGHLIGHTS = [
    {
        idx: '01',
        id: 'aerolang',
        title: 'AeroLang Compiler',
        tag: 'C++ · LLVM IR',
        summary: 'Custom compiled language targeting native Android & Linux binaries.',
        icon: Cpu,
    },
    {
        idx: '02',
        id: 'aegislayer',
        title: 'AegisLayer Daemon',
        tag: 'Kotlin · On-Device ML',
        summary: 'Zero-dependency autonomous Android system daemon & habit engine.',
        icon: Shield,
    },
    {
        idx: '03',
        id: 'bybridge',
        title: 'Bybridge IPC Suite',
        tag: 'C++ · WebSockets · RTP',
        summary: 'Low-latency cross-device ecosystem bridging Arch Linux & Android.',
        icon: Layers,
    },
];

const PLATES = [
    {
        id: 'plate-1',
        label: 'PLATE I · PORTRAIT',
        src: '/assets/profile.png',
        caption: 'Fig. 1.1 — Siluna Nusal Dangalla, Systems & Android Architect (Colombo Bureau)',
        pos: '50% 32%',
    },
    {
        id: 'plate-2',
        label: 'PLATE II · FIELD',
        src: '/assets/headset-profile-2.jpg',
        caption: 'Fig. 1.2 — Engineering Workbench: Audio & Low-Latency Kernel Debugging',
        pos: '50% 35%',
    },
];

export default function HeroOverlay() {
    const heroRef        = useRef(null);
    const stageRef       = useRef(null);
    const topRef         = useRef(null);
    const folioTopRef    = useRef(null);
    const folioBottomRef = useRef(null);
    const leadGridRef    = useRef(null);
    const chopA          = useRef(null);
    const chopB          = useRef(null);
    const bodyRef        = useRef(null);
    const photoRef       = useRef(null);

    const setMood             = useStore((s) => s.setMood);
    const toggleTerminal      = useStore((s) => s.toggleTerminal);
    const setMeetingModalOpen = useStore((s) => s.setMeetingModalOpen);
    const soundEnabled        = useStore((s) => s.soundEnabled);

    const [statsStarted, setStatsStarted] = useState(false);
    const [activePlate, setActivePlate]   = useState(0);
    const [copiedWire, setCopiedWire]     = useState(false);

    const today = useMemo(() => {
        try {
            return new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(new Date())
                .toUpperCase() + ', ' + new Date().toDateString().toUpperCase().replace(/^\S+\s+/, '');
        } catch {
            return 'SATURDAY, OCTOBER 31, 2026';
        }
    }, []);

    const handleCopyWire = () => {
        navigator.clipboard.writeText('sdangalla44@gmail.com');
        setCopiedWire(true);
        playClickSound(soundEnabled);
        setTimeout(() => setCopiedWire(false), 2200);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.15 });

            tl.fromTo(
                topRef.current,
                { opacity: 0, y: -24, rotateX: -12 },
                { opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: 'power4.out', transformPerspective: 1200 }
            );

            tl.fromTo(
                folioTopRef.current,
                { scaleX: 0, opacity: 0, transformOrigin: 'left center' },
                { scaleX: 1, opacity: 1, duration: 0.75, ease: 'power3.out' },
                '-=0.65'
            );

            tl.fromTo(
                chopA.current,
                { yPercent: 115, skewY: 4 },
                { yPercent: 0, skewY: 0, duration: 0.85, ease: 'power4.out' },
                '-=0.55'
            );

            tl.fromTo(
                chopB.current,
                { yPercent: 115, skewY: 3 },
                { yPercent: 0, skewY: 0, duration: 0.8, ease: 'power4.out' },
                '-=0.7'
            );

            tl.fromTo(
                photoRef.current,
                { clipPath: 'inset(0% 0% 100% 0%)', opacity: 1 },
                { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.0, ease: 'power3.out' },
                '-=0.75'
            );

            tl.fromTo(
                [bodyRef.current, folioBottomRef.current],
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', stagger: 0.08 },
                '-=0.8'
            );

            tl.fromTo(
                leadGridRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.65, ease: 'power2.out' },
                '-=0.65'
            );

            setTimeout(() => setStatsStarted(true), 250);
            setMood(MOODS.HERO);
        }, heroRef);
        return () => ctx.revert();
    }, [setMood]);

    const revealLine = () => ({
        display: 'block',
        overflow: 'hidden',
        lineHeight: 1.04,
        padding: '0.03em 0',
    });

    const currentPlate = PLATES[activePlate];

    return (
        <section
            ref={heroRef}
            id="home"
            className="w-full relative z-10"
            style={{ background: S.paper }}
        >
            <div ref={stageRef} className="relative flex flex-col w-full max-w-[84rem] mx-auto">

                {/* Subtle archival grain */}
                <div aria-hidden className="absolute inset-0 noise-bg opacity-35 pointer-events-none" />

                {/* ── FOLIO / TOP RUNNING HEADER — double hairline ── */}
                <div
                    ref={folioTopRef}
                    className="flex-none px-4 sm:px-6 md:px-10 pt-[56px] md:pt-[62px] z-20"
                    style={{
                        borderTop: '1px solid ' + S.ink,
                        borderBottom: '1px solid color-mix(in srgb, var(--color-ink) 22%, transparent)',
                    }}
                >
                    <div className="flex items-center justify-between gap-3 py-2 font-mono text-[8px] md:text-[9.5px] tracking-[0.24em] uppercase text-ink/75">
                        <span className="hidden sm:inline font-semibold">VOL. XXIV · ISSUE NO. 024</span>
                        <span className="truncate font-bold text-ink">THE DAILY DEVELOPER · SYSTEMS ENGINEERING BROADSHEET</span>
                        <span className="hidden lg:inline text-graphite">KERNEL: 6.12-ARCH · C++20 / KOTLIN</span>
                        <span className="text-accent font-semibold flex items-center gap-1.5 shrink-0">
                            <span className="w-1.5 h-1.5 bg-accent inline-block rotate-45 animate-pulse" />
                            SYSTEM: NOMINAL
                        </span>
                    </div>
                </div>

                {/* ── MONUMENTAL MASTHEAD + FLANKING EARS ── */}
                <div ref={topRef} className="flex-none px-4 sm:px-6 md:px-10 pt-4 pb-3 z-10">
                    <div className="grid grid-cols-12 items-center gap-4">
                        {/* Left Masthead Ear */}
                        <div className="hidden lg:flex col-span-3 flex-col justify-between p-3 border border-ink/30 bg-panel/80 min-h-[82px]">
                            <div className="flex items-center justify-between text-[8px] font-mono tracking-[0.24em] uppercase text-accent font-bold border-b border-ink/15 pb-1">
                                <span>SPECIAL REPORT</span>
                                <span>FOLIO 01–09</span>
                            </div>
                            <p className="text-[10px] font-serif leading-snug text-ink/85 mt-1.5">
                                Native Android Daemons, Linux Kernel Utilities &amp; LLVM Compiler Infrastructure.
                            </p>
                        </div>

                        {/* Center Nameplate */}
                        <div className="col-span-12 lg:col-span-6 text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[9px] tracking-[0.22em] uppercase font-bold mb-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                                <span>Core Systems &amp; Android Architect</span>
                            </div>
                            <h1 className="masthead-title select-none tracking-tight" aria-label="Siluna Nusal Dangalla">
                                Siluna Nusal Dangalla
                            </h1>
                            <div className="mx-auto mt-2 mb-1 flex items-center justify-center gap-3">
                                <span className="inline-block w-12 sm:w-20 border-t border-ink/20" />
                                <span className="inline-block text-[9px] font-mono tracking-[0.25em] text-accent font-bold">COLOMBO // GLOBAL</span>
                                <span className="inline-block w-12 sm:w-20 border-t border-ink/20" />
                            </div>
                            <div className="deck-title">
                                C++20 · LINUX KERNEL · ANDROID INTERNALS · LLVM COMPILERS
                            </div>
                        </div>

                        {/* Right Masthead Ear */}
                        <div className="hidden lg:flex col-span-3 flex-col justify-between p-3 border border-ink/30 bg-panel/80 min-h-[82px]">
                            <div className="flex items-center justify-between text-[8px] font-mono tracking-[0.24em] uppercase text-ink/70 border-b border-ink/15 pb-1">
                                <span>BUREAU DESK</span>
                                <span className="text-accent font-bold">● LIVE</span>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-1.5">
                                <div className="text-[10px] font-mono text-graphite leading-tight">
                                    <div>COLOMBO, LK</div>
                                    <div className="text-ink font-semibold">UTC+05:30 · REMOTE</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMeetingModalOpen(true);
                                        playClickSound(soundEnabled);
                                    }}
                                    className="px-2.5 py-1.5 border border-accent bg-accent/10 hover:bg-accent hover:text-white text-accent font-mono text-[8.5px] tracking-[0.2em] uppercase font-bold transition-colors cursor-pointer shrink-0"
                                >
                                    Book Call ↗
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── LEAD STORY + PORTRAIT PLATE ── */}
                <div className="flex-1 z-10 px-4 sm:px-6 md:px-10 pb-5">
                    <div
                        ref={leadGridRef}
                        className="grid grid-cols-12 gap-6 lg:gap-8 pt-4"
                        style={{ borderTop: '3px double ' + S.ink }}
                    >

                        {/* LEFT / CENTER — Lead Editorial Package */}
                        <div className="col-span-12 lg:col-span-8 flex flex-col justify-between lg:pr-6 lg:border-r border-ink/20">

                            <div ref={bodyRef} className="flex flex-col gap-3.5">
                                {/* Byline & Dateline Strip */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-ink/15">
                                    <div className="flex items-center gap-2.5 font-serif italic text-xs sm:text-sm text-ink/85">
                                        <span className="font-semibold not-italic font-mono text-[9px] tracking-[0.22em] uppercase px-2 py-0.5 bg-ink text-panel">
                                            LEAD DISPATCH
                                        </span>
                                        <span>By Siluna Dangalla · Chief Systems Correspondent</span>
                                    </div>
                                    <div className="dateline flex items-center gap-3">
                                        <span>[ {today} ]</span>
                                        <span className="text-accent font-semibold hidden sm:inline">● OPEN FOR ENGAGEMENT</span>
                                    </div>
                                </div>

                                {/* Monumental Headline */}
                                <div className="pt-0.5">
                                    <h2 className="headline-chop text-balance">
                                        <span style={revealLine()}>
                                            <span ref={chopA} className="will-change-transform block">
                                                ARCHITECTING DETERMINISTIC
                                            </span>
                                        </span>
                                        <span style={revealLine()}>
                                            <span ref={chopB} className="will-change-transform block" style={{ color: 'var(--color-accent)' }}>
                                                LOW-LEVEL SYSTEMS &amp; COMPILERS
                                            </span>
                                        </span>
                                    </h2>
                                </div>

                                {/* Two-Column Editorial Copy + Pull Quote */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1 text-[13px] leading-[1.65] text-graphite font-sans">
                                    <div className="sm:pr-5 sm:border-r border-ink/15">
                                        <p className="drop-cap text-justify m-0">
                                            The Colombo engineering desk reports a systems architect who treats the machine
                                            at the bare metal — building native Android system daemons, Linux kernel utilities,
                                            and custom LLVM compiler pipelines engineered for determinism and sub-millisecond
                                            execution. Every binary is compiled against reality: zero-bloat, measurable, and
                                            predictable under peak load.
                                        </p>
                                    </div>
                                    <div className="flex flex-col justify-between gap-3">
                                        <p className="text-justify m-0">
                                            From hardware-emulated <code className="font-mono text-[11px] px-1 py-0.5 bg-panel-deep border border-ink/15">uinput</code> daemons
                                            and ELF binary analyzers to SSA compiler passes in C++, the work favors the lowest
                                            layer that solves the problem cleanly.
                                        </p>
                                        <blockquote className="p-3 bg-panel-deep/65 border-l-2 border-accent font-serif italic text-xs text-ink/90 leading-relaxed m-0">
                                            “Correctness before speed; speed before scale — every daemon, socket, and compiler pass measured against hardware reality.”
                                        </blockquote>
                                    </div>
                                </div>

                                {/* Front-Page Index: 3 Flagship Dispatches */}
                                <div className="pt-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-mono text-[9px] tracking-[0.26em] uppercase text-graphite font-semibold">
                                            INSIDE THIS EDITION — FLAGSHIP MONOGRAPHS
                                        </span>
                                        <a
                                            href="#projects"
                                            onClick={anchorToSection('projects')}
                                            className="font-mono text-[9px] tracking-[0.2em] uppercase text-accent hover:underline"
                                        >
                                            Full Index (12) →
                                        </a>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                        {FRONT_PAGE_HIGHLIGHTS.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.id}
                                                    to={`/project/${item.id}`}
                                                    data-cursor="Read Dossier"
                                                    className="group p-3 border border-ink/20 bg-panel hover:border-accent hover:bg-panel-deep/50 transition-all flex flex-col justify-between gap-1.5 no-underline"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-mono text-[9px] tracking-[0.2em] text-accent font-bold flex items-center gap-1.5">
                                                            <Icon size={11} />
                                                            <span>FOLIO {item.idx}</span>
                                                        </span>
                                                        <ArrowUpRight
                                                            size={12}
                                                            className="text-graphite group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                                                        />
                                                    </div>
                                                    <div className="font-display font-bold text-sm text-ink group-hover:text-accent transition-colors">
                                                        {item.title}
                                                    </div>
                                                    <div className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-graphite">
                                                        {item.tag}
                                                    </div>
                                                    <p className="font-sans text-[11px] text-graphite leading-snug line-clamp-2 m-0">
                                                        {item.summary}
                                                    </p>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Circulation & Telemetry Indices + Primary CTAs */}
                                <div className="pt-3 mt-1 border-t border-ink/20 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                                        <FolioStat target={12} suffix="+" label="Systems Shipped" sublabel="Production & OSS" started={statsStarted} />
                                        <FolioStat target={3} suffix="+" label="Years Practice" sublabel="Systems & Android" started={statsStarted} />
                                        <FolioStat target={495} suffix="+" label="Annual Commits" sublabel="Trailing 12 Months" started={statsStarted} />
                                        <FolioStat target={1} prefix="<" suffix="ms" label="IPC Latency" sublabel="Zero-Copy Daemons" started={statsStarted} />
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                                        <a
                                            href="#projects"
                                            onClick={anchorToSection('projects')}
                                            className="lux-btn-primary"
                                        >
                                            <span>Selected Work</span>
                                            <span className="lux-btn-chevron">→</span>
                                        </a>
                                        <a
                                            href="/Siluna_Nusal_CV.pdf"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="lux-btn-ghost"
                                        >
                                            <span>Dossier CV</span>
                                            <span className="lux-btn-chevron">↗</span>
                                        </a>
                                        <button
                                            type="button"
                                            onClick={toggleTerminal}
                                            className="lux-btn-ghost cursor-pointer"
                                            title="Open Interactive Linux Shell"
                                        >
                                            <Terminal size={13} className="text-accent" />
                                            <span>Shell</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT — Archival Portrait Plate + Western Union Telegraph Desk */}
                        <div className="col-span-12 lg:col-span-4 flex flex-col justify-between gap-4">
                            <div ref={photoRef} className="flex flex-col gap-3.5 h-full justify-between">

                                {/* Modern Studio Portrait Showcase with Plate Switcher */}
                                <figure className="relative rounded-2xl border border-white/10 bg-panel/90 backdrop-blur-xl p-3.5 m-0 shadow-2xl">
                                    {/* Top Plate Selector Bar */}
                                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                                        <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider uppercase text-accent font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                                            <span>ENGINEERING SPECIMEN</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-md border border-white/10">
                                            {PLATES.map((p, idx) => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setActivePlate(idx);
                                                        playClickSound(soundEnabled);
                                                    }}
                                                    className={`px-2.5 py-0.5 font-mono text-[9px] tracking-wider uppercase rounded transition-colors cursor-pointer ${
                                                        activePlate === idx
                                                            ? 'bg-accent text-slate-950 font-bold'
                                                            : 'text-slate-400 hover:text-white'
                                                    }`}
                                                >
                                                    {p.id === 'studio' ? 'PLATE I' : 'PLATE II'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Image Frame */}
                                    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950 group">
                                        <img
                                            key={currentPlate.src}
                                            src={currentPlate.src}
                                            alt="Siluna Nusal Dangalla — Independent Systems Engineer"
                                            className="w-full h-[260px] sm:h-[290px] lg:h-[270px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                            style={{ objectPosition: currentPlate.pos }}
                                        />

                                        {/* Top-left live badge */}
                                        <div
                                            className="absolute top-3 left-3 px-2.5 py-1 rounded-full font-mono text-[9px] tracking-wider uppercase font-bold bg-slate-950/80 backdrop-blur-md border border-accent/40 text-accent flex items-center gap-1.5"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                            <span>{currentPlate.label}</span>
                                        </div>

                                        {/* Bottom-right stack tags */}
                                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                                            {['C++20', 'KOTLIN', 'LLVM'].map((t) => (
                                                <span
                                                    key={t}
                                                    className="px-2 py-0.5 rounded-md font-mono text-[9px] tracking-wider uppercase bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/10"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <figcaption className="mt-2.5 px-1 flex items-center justify-between gap-2 text-xs font-sans text-graphite">
                                        <span className="truncate">{currentPlate.caption}</span>
                                        <span className="font-mono text-[9px] uppercase tracking-wider text-accent font-semibold shrink-0">
                                            [STUDIO PLATE]
                                        </span>
                                    </figcaption>
                                </figure>

                                {/* Direct Systems Wire & Dispatch Hub */}
                                <div className="p-4 rounded-2xl border border-white/10 bg-panel/90 backdrop-blur-xl shadow-xl">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                        <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-ink flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            DIRECT SYSTEMS WIRE
                                        </span>
                                        <span className="font-mono text-[9px] tracking-wider text-emerald-400 font-bold uppercase">
                                            ONLINE · UTC+5:30
                                        </span>
                                    </div>

                                    <div className="mt-3 space-y-2 font-mono text-[10px] tracking-wider uppercase text-graphite">
                                        <div className="flex justify-between gap-2">
                                            <span>AVAILABILITY:</span>
                                            <span className="text-accent font-bold">ROLES &amp; CORE CONTRACTS ▮</span>
                                        </div>
                                        <div className="flex justify-between gap-2">
                                            <span>CORE STACK:</span>
                                            <span className="font-semibold text-ink text-right">C++ · KOTLIN · LINUX · LLVM</span>
                                        </div>
                                        <div className="flex justify-between gap-2">
                                            <span>DIRECT WIRE:</span>
                                            <span className="lowercase font-semibold text-ink">sdangalla44@gmail.com</span>
                                        </div>
                                    </div>

                                    <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleCopyWire}
                                            className="flex-1 py-2 px-3 rounded-lg border border-white/15 bg-white/5 hover:border-accent hover:text-accent font-mono text-[10px] tracking-wider uppercase font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-ink"
                                        >
                                            {copiedWire ? (
                                                <>
                                                    <Check size={12} className="text-emerald-400" />
                                                    <span className="text-emerald-400">COPIED</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={12} />
                                                    <span>COPY EMAIL</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMeetingModalOpen(true);
                                                playClickSound(soundEnabled);
                                            }}
                                            className="py-2 px-4 rounded-lg bg-accent text-slate-950 hover:bg-accent-hot font-mono text-[10px] tracking-wider uppercase font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                            <Calendar size={12} />
                                            <span>SCHEDULE</span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {/* ── BOTTOM FOLIO RUNNING FOOT ── */}
                <div
                    ref={folioBottomRef}
                    className="flex-none mx-4 sm:mx-6 md:mx-10 mb-4 flex items-center justify-between font-mono text-[8.5px] tracking-[0.26em] uppercase text-graphite"
                    style={{
                        borderTop: '1px solid color-mix(in srgb, var(--color-ink) 45%, transparent)',
                        paddingTop: 8,
                    }}
                >
                    <span>CONTINUED ON FOLIO 01 — SELECTED WORK &amp; MONOGRAPHS ↓</span>
                    <span className="hidden md:inline text-accent font-semibold">
                        ● PRESS EDITION: INTERACTIVE · USE [⌘K] FOR COMMAND INDEX
                    </span>
                    <span>6°55′N — 79°51′E</span>
                </div>

            </div>
        </section>
    );
}
