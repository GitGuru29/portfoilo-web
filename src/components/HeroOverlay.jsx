import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import useStore, { MOODS } from '../store/useStore';

const S = {
    paper: '#f5f2eb',
    panel: '#fdfbf6',
    ink: '#121212',
    graphite: '#57544d',
    line: 'rgba(18,18,18,0.4)',
    crimson: '#b91c1c',
    mono: "'JetBrains Mono', monospace",
    serif: "'Playfair Display', 'Fraunces', Georgia, serif",
    blackletter: "'UnifrakturMaguntia', Georgia, serif",
    body: "Georgia, 'Times New Roman', serif",
};

/* ─── Folio-style countup (circulation indices) ─── */
function FolioStat({ target, suffix, label, started }) {
    const numRef = useRef(null);
    useEffect(() => {
        if (!started || !numRef.current) return;
        const obj = { val: 0 };
        const tw = gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate() { numRef.current.textContent = Math.round(obj.val) + suffix; },
            onComplete() { numRef.current.textContent = target + suffix; },
        });
        return () => tw.kill();
    }, [started, target, suffix]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div
                ref={numRef}
                style={{ fontFamily: S.serif, fontSize: 'clamp(1.4rem, 2.1vw, 2.2rem)', fontWeight: 700, lineHeight: 1, color: S.ink, fontVariantNumeric: 'tabular-nums' }}
            >
                0{suffix}
            </div>
            <div style={{ fontFamily: S.mono, fontSize: 'clamp(8px, 0.9vw, 10px)', letterSpacing: '0.2em', textTransform: 'uppercase', color: S.graphite }}>
                {label}
            </div>
        </div>
    );
}

export default function HeroOverlay() {
    const heroRef    = useRef(null);
    const stageRef   = useRef(null);
    const topRef         = useRef(null);
    const folioTopRef    = useRef(null);
    const folioBottomRef = useRef(null);
    const leadGridRef    = useRef(null);
    const chopA          = useRef(null);
    const chopB          = useRef(null);
    const bodyRef        = useRef(null);
    const photoRef       = useRef(null);
    const aboutRef       = useRef(null);
    const setMood        = useStore((s) => s.setMood);
    const [statsStarted, setStatsStarted] = useState(false);

    const today = useMemo(() => {
        try {
            return new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(new Date())
                .toUpperCase() + ', ' + new Date().toDateString().toUpperCase().replace(/^\S+\s+/, '');
        } catch {
            return 'MONDAY, SEPTEMBER 23, 2026';
        }
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.2 });

            // Masthead drops in with rotateX tilt — like paper landing flat on desk
            tl.fromTo(
                topRef.current,
                { opacity: 0, y: -28, rotateX: -14 },
                { opacity: 1, y: 0, rotateX: 0, duration: 0.95, ease: 'power4.out', transformPerspective: 1200 }
            );

            // Folio strips draw in from edges (left strip: scaleX from left, bottom: from right)
            tl.fromTo(
                folioTopRef.current,
                { scaleX: 0, opacity: 0, transformOrigin: 'left center' },
                { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power3.out' },
                '-=0.7'
            );

            // Headline chop A — stamp-press: slides up + skewY slam
            tl.fromTo(
                chopA.current,
                { yPercent: 120, skewY: 5 },
                { yPercent: 0, skewY: 0, duration: 0.9, ease: 'power4.out' },
                '-=0.55'
            );

            // Headline chop B — follows with slight stagger
            tl.fromTo(
                chopB.current,
                { yPercent: 120, skewY: 4 },
                { yPercent: 0, skewY: 0, duration: 0.85, ease: 'power4.out' },
                '-=0.75'
            );

            // Photo: clip-path wipe from top (like photo pulled from enlarger tray)
            tl.fromTo(
                photoRef.current,
                { clipPath: 'inset(0% 0% 100% 0%)', opacity: 1 },
                { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.05, ease: 'power3.out' },
                '-=0.8'
            );

            // Body content, folio bottom, lead grid — cascade fade up
            tl.fromTo(
                [bodyRef.current, folioBottomRef.current],
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.08 },
                '-=0.85'
            );

            tl.fromTo(
                leadGridRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.7, ease: 'power2.out' },
                '-=0.7'
            );

            // Stats counters start early — 300ms in, well before the headline
            // chop finishes, so the numbers are already turning under the fold.
            setTimeout(() => setStatsStarted(true), 300);

            setMood(MOODS.HERO);
        }, heroRef);
        return () => ctx.revert();
    }, [setMood]);

    const revealLine = () => ({
        display: 'block',
        overflow: 'hidden',
        lineHeight: 1.06,
        padding: '0.04em 0',
    });

    return (
        <section ref={heroRef} id="home" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 10, background: S.paper }}>
            <div ref={stageRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

                {/* Newsprint grain */}
                <div aria-hidden className="absolute inset-0 noise-bg opacity-35 pointer-events-none" />

                {/* ── FOLIO / TOP STRIP — double hairline ── */}
                <div ref={folioTopRef} className="absolute top-[58px] md:top-[62px] left-6 right-6 z-20" style={{ borderTop: '1px solid ' + S.ink, borderBottom: '1px solid rgba(18,18,18,0.25)' }}>
                    <div className="flex items-center justify-between gap-4 px-2 pt-1.5 pb-1 font-mono text-[8px] md:text-[9px] tracking-[0.26em] uppercase text-ink/70">
                        <span className="hidden sm:inline">EST. 2021 — VOL. XXIV</span>
                        <span className="truncate font-semibold text-ink/90">THE DAILY DEVELOPER · BROADSHEET EDITION</span>
                        <span className="hidden md:inline">NO. 24</span>
                        <span className="text-accent">☀ SYSTEM: NOMINAL</span>
                        <span>PRICE: FREEWARE</span>
                    </div>
                </div>

                {/* ── MASTHEAD ── */}
                <div ref={topRef} className="absolute left-0 right-0 top-[96px] md:top-[104px] px-6 z-10 text-center">
                    <h1 className="masthead-title" aria-label="The Daily Developer">The Daily Developer</h1>
                    {/* ornamental double divider */}
                    <div className="mx-auto mt-2 mb-1.5 flex items-center justify-center gap-3" style={{ color: S.ink }}>
                        <span className="inline-block w-20 md:w-36 border-t border-ink/50" />
                        <span className="inline-block text-[10px] font-mono tracking-[0.4em] text-accent">◆</span>
                        <span className="inline-block w-20 md:w-36 border-t border-ink/50" />
                    </div>
                    <div className="deck-title">Siluna Dangalla — Independent Systems Engineer</div>
                </div>

                {/* ── LEAD STORY + PORTRAIT ── */}
                <div className="absolute left-0 right-0 bottom-[48px] top-[232px] md:top-[244px] z-10 px-6 md:px-[5vw]">
                    <div ref={leadGridRef} className="h-full grid grid-cols-12 gap-0 pt-3" style={{ borderTop: '2px solid ' + S.ink }}>

                        {/* LEFT — the lead story */}
                        <div className="col-span-12 md:col-span-7 lg:col-span-8 flex flex-col md:pr-8 pt-4 overflow-hidden" style={{ borderRight: '0 none' }}>

                            {/* Byline */}
                            <div ref={bodyRef} className="flex flex-col gap-2">
                                <div className="byline">
                                    <span>By Siluna Dangalla</span>
                                    <span className="dateline">Systems Correspondent · Colombo</span>
                                </div>

                                {/* Headline */}
                                <div className="mt-0.5">
                                    <h2 className="headline-chop text-balance">
                                        <span style={revealLine()}><span ref={chopA} className="will-change-transform" style={{ display: 'block' }}>SYSTEMS ARCHITECT</span></span>
                                        <span style={revealLine()}><span ref={chopB} className="will-change-transform" style={{ display: 'block', color: S.crimson }}>SHIPS LOW-LEVEL PLATFORMS</span></span>
                                    </h2>
                                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 dateline">
                                        <span>[ {today} ]</span>
                                        <span className="text-accent">● BREAKING — OPEN TO ENGAGEMENT</span>
                                        <span className="hidden md:inline">DISPATCH NO. 024</span>
                                    </div>
                                </div>

                                {/* Justified two-column story w/ drop cap */}
                                <div className="news-columns front-news-brief mt-3 hidden sm:block" style={{ fontFamily: S.body, fontSize: '12.5px', lineHeight: 1.55, color: 'rgba(18,18,18,0.88)' }}>
                                    <p className="drop-cap mb-2 text-justify" style={{ marginTop: 3 }}>
                                        The desk reports a developer who treats the machine as read-only until
                                        proven otherwise — building low-level systems software, native Android,
                                        and Linux tooling engineered for determinism and quiet correctness.
                                        Every project is compiled against reality: small, measurable, and
                                        predictable under load.
                                    </p>
                                    <p className="mb-2 text-justify" style={{ marginTop: 3 }}>
                                        From kernel utilities to compiler passes, the work favours the lowest
                                        layer that will still run. The editorial board notes a particular
                                        immunity to fashionable abstractions: correctness before speed, speed
                                        before scale.
                                    </p>
                                </div>

                                {/* Mobile story excerpt */}
                                <p className="sm:hidden text-justify" style={{ fontFamily: S.body, fontSize: '12.5px', lineHeight: 1.55, color: 'rgba(18,18,18,0.88)' }}>
                                    The desk reports a developer who treats the machine as read-only until
                                    proven otherwise — building systems software, native Android, and Linux
                                    tooling for determinism, latency, and quiet correctness.
                                </p>

                                {/* Circulation indices */}
                                <div className="grid grid-cols-3 gap-6 pt-2.5" style={{ borderTop: '1px solid ' + S.line }}>
                                    {[
                                        { target: 12, suffix: '+', label: 'Systems shipped' },
                                        { target: 3,  suffix: '+', label: 'Years of practice' },
                                        { target: 15, suffix: '+', label: 'Technologies' },
                                    ].map((s) => (
                                        <FolioStat key={s.label} {...s} started={statsStarted} />
                                    ))}
                                </div>

                                {/* CTA — read the full report */}
                                <div className="flex flex-wrap items-center gap-4 pt-3">
                                    <a href="#projects" className="lux-btn-primary">Read Full Report <span className="lux-btn-chevron">→</span></a>
                                    <a href="/Siluna_Nusal_CV.pdf" target="_blank" rel="noopener noreferrer" className="lux-btn-ghost">Fax CV <span className="lux-btn-chevron">↗</span></a>
                                    <span className="hidden md:inline-flex items-center gap-2">
                                        <span className="lux-scroll-line" style={{ height: 22 }} />
                                        <span className="dateline">Turn to page two ↓</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT — portrait plate + telegraph */}
                        <div className="hidden md:flex col-span-5 lg:col-span-4 flex-col pl-8 pt-5">
                            <div ref={photoRef} className="flex flex-col gap-3">
                                {/* 1-bit halftone portrait */}
                                <figure className="relative border border-ink p-1.5" style={{ background: S.panel }}>
                                    <div className="relative overflow-hidden" style={{ border: '1px solid rgba(18,18,18,0.4)' }}>
                                        <img
                                            src="/assets/profile.png"
                                            alt="Siluna Dangalla — Independent Systems Developer"
                                            className="halftone-portrait w-full h-[32vh] max-h-[330px] object-cover"
                                            style={{ objectPosition: '50% 12%' }}
                                        />
                                        <div aria-hidden className="absolute inset-0 halftone opacity-30 pointer-events-none mix-blend-multiply" />
                                        <div aria-hidden
                                            className="absolute top-3 left-3 px-2 py-1 font-mono text-[8px] tracking-[0.3em] uppercase"
                                            style={{ color: 'var(--color-accent)', border: '1px solid var(--color-accent)', background: 'rgba(245,242,235,0.92)' }}
                                        >
                                            ● Breaking
                                        </div>
                                    </div>
                                    <figcaption className="mt-1 px-1 text-[11px] italic font-serif" style={{ color: 'rgba(18,18,18,0.8)', fontFamily: S.body }}>
                                        Fig. 1 — Independent Systems Developer, Colombo
                                    </figcaption>
                                </figure>

                                {/* Telegraph desk */}
                                <div className="telegram px-3 py-2 mt-1" data-stamp="TELEGRAPH">
                                    <div className="dateline text-[8px] tracking-[0.3em] uppercase text-ink/60">Western Union — Desk 024</div>
                                    <div className="mt-1.5 flex flex-col gap-0.5 font-mono text-[9.5px] tracking-[0.12em] uppercase" style={{ color: 'rgba(18,18,18,0.75)' }}>
                                        <span>Q. ENGAGEMENT WINDOW : <span className="text-accent">OPEN ▮</span></span>
                                        <span>Q. STACK            : C++ · KOTLIN · LINUX · LLVM</span>
                                        <span>Q. LOCATION         : COLOMBO · REMOTE · WORLDWIDE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM FOLIO STRIP — double hairline (stage level) */}
                <div ref={folioBottomRef} className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-[8px] tracking-[0.3em] uppercase text-ink/60"
                    style={{ borderTop: '1px solid rgba(18,18,18,0.7)', paddingTop: 6 }}>
                    <span>CONTINUED ON PAGE TWO — THE DEVELOPER'S DESK ↑</span>
                    <span className="hidden md:inline text-accent">● PRESIDENTIAL RACE = N/A ▮ FLOODS = N/A</span>
                    <span>6°55′N — 79°51′E</span>
                </div>

                {/* ══════════════════════════════════════
                    PAGE 02 — INSIDE EDITION (About)
                ══════════════════════════════════════ */}
                <div
                    ref={aboutRef}
                    id="about"
                    style={{
                        position: 'absolute', inset: 0, visibility: 'hidden', opacity: 0, zIndex: 100,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 'clamp(16px, 3.5vw, 40px)',
                    }}
                >
                    <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 md:gap-5 px-4 md:px-8">
                        
                        {/* Editorial Top Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-2.5" style={{ borderBottom: '1px solid rgba(18,18,18,0.25)' }}>
                            <div className="flex items-center gap-3">
                                <span className="stamp--edition">● Inside Edition</span>
                                <span className="dateline hidden sm:inline">THE DEVELOPER'S DESK — CONTINUED FROM PAGE ONE</span>
                            </div>
                            <div className="dateline text-accent">SPECIAL REPORT · DISPATCH NO. 024-B</div>
                        </div>

                        {/* Section Headline */}
                        <div>
                            <h2 className="headline-chop text-balance" style={{ fontSize: 'clamp(1.6rem, 3.4vw, 3rem)', lineHeight: 1.05 }}>
                                SYSTEMS BEFORE SOFTWARE, CORRECTNESS BEFORE SPEED.
                            </h2>
                        </div>

                        {/* Main 12-Column Editorial Grid */}
                        <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
                            
                            {/* Left Column — Deep Editorial Story & Philosophy (7 Cols) */}
                            <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
                                
                                {/* Pull Quote */}
                                <blockquote className="italic font-serif text-ink/85 text-sm md:text-base pl-4 border-l-2 border-accent py-1 bg-panel/60">
                                    “The machine is read-only until proven otherwise — building low-level systems software, native Android tooling, and compilers engineered for determinism and quiet correctness.”
                                </blockquote>

                                {/* 2-Column Article Text */}
                                <div className="news-columns" style={{ fontFamily: S.body, fontSize: '13px', lineHeight: 1.6, color: 'rgba(18,18,18,0.85)' }}>
                                    <p className="drop-cap text-justify mb-2">
                                        As a final-year Software Engineering undergraduate working at the edge of the stack, the desk bridges high-level user interfaces with low-level execution environments. From custom Linux daemons to AOSP launcher internals, every project is driven by the conviction that performance is not an afterthought, but a core architectural requirement.
                                    </p>
                                    <p className="text-justify mb-2">
                                        Whether engineering compiler passes for AeroLang, optimizing inter-process communication in ByBridge, or securing network telemetry in AegisLayer, the focus remains on zero-allocation inner loops, predictable memory layouts, and strict contract enforcement. Opinion is reserved for the compiler.
                                    </p>
                                    <p className="text-justify mb-2">
                                        Working from a corner desk in Colombo, the press favours the smallest moving part that solves the whole problem — a habit learned the hard way, on machines where every microsecond clears a market or a deadline.
                                    </p>
                                </div>

                                {/* Education & Postings */}
                                <div className="pt-2.5" style={{ borderTop: '1px solid rgba(18,18,18,0.2)' }}>
                                    <div className="font-mono text-[9px] tracking-widest text-accent uppercase font-bold mb-2">Education &amp; Postings</div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { year: '2021 →', entry: 'Systems foundations — first C under the desk', tag: 'BSc' },
                                            { year: '2023 →', entry: 'Independent engineering & open-source work', tag: 'FREELANCE' },
                                            { year: 'NOW', entry: 'AeroLang · ByBridge · AegisLayer on the bench', tag: 'ACTIVE' },
                                        ].map(e => (
                                            <div key={e.tag} className="flex flex-col gap-0.5">
                                                <span className="font-mono text-[9px] text-ink/70">{e.year} <span className="text-accent">[{e.tag}]</span></span>
                                                <span className="text-[11px] font-serif text-graphite leading-tight">{e.entry}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Core Disciplines List */}
                                <div className="grid grid-cols-3 gap-3 pt-2.5" style={{ borderTop: '1px solid rgba(18,18,18,0.2)' }}>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-mono text-[9px] tracking-widest text-accent uppercase font-bold">01. Determinism</span>
                                        <span className="text-[11px] font-serif text-graphite leading-tight">Zero hidden allocations & predictable latency.</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-mono text-[9px] tracking-widest text-accent uppercase font-bold">02. Correctness</span>
                                        <span className="text-[11px] font-serif text-graphite leading-tight">Type-safe boundaries & verified contracts.</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-mono text-[9px] tracking-widest text-accent uppercase font-bold">03. Efficiency</span>
                                        <span className="text-[11px] font-serif text-graphite leading-tight">Lowest layer that will run cleanly under load.</span>
                                    </div>
                                </div>

                                {/* Tech Chips */}
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {['C++20', 'Kotlin', 'Linux Kernel', 'Android AOSP', 'LLVM', 'Rust', 'eBPF', 'PostgreSQL', 'CMake', 'C#', 'Bash', 'Git'].map(t => (
                                        <span key={t} className="chip-tech">{t}</span>
                                    ))}
                                </div>

                                {/* Editor's signoff */}
                                <div className="flex items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(18,18,18,0.2)', paddingTop: 8, marginTop: 2 }}>
                                    <p className="italic font-serif text-[11px] text-graphite leading-snug">
                                        — The machine stays read-only until the contracts are proven. The desk is now open.
                                    </p>
                                    <span className="font-blackletter text-2xl leading-none shrink-0" style={{ color: S.ink }}>Siluna Dangalla</span>
                                </div>
                            </div>

                            {/* Right Column — Technical Specifications & Telemetry Card (5 Cols) */}
                            <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                                
                                {/* Classified Specs Box */}
                                <div className="story-card p-5 flex flex-col gap-3">
                                    <div className="flex items-center justify-between border-b border-ink/20 pb-2">
                                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-ink">SYSTEM SPECIFICATIONS</span>
                                        <span className="font-mono text-[9px] text-accent">CLASSIFIED 024</span>
                                    </div>

                                    <div className="space-y-2 font-mono text-[11px]">
                                        <div className="flex justify-between border-b border-ink/10 pb-1.5">
                                            <span className="text-graphite uppercase">Degree</span>
                                            <span className="font-semibold text-ink">BSc (Hons) Software Eng.</span>
                                        </div>
                                        <div className="flex justify-between border-b border-ink/10 pb-1.5">
                                            <span className="text-graphite uppercase">Specialization</span>
                                            <span className="font-semibold text-ink">Systems & Mobile Eng.</span>
                                        </div>
                                        <div className="flex justify-between border-b border-ink/10 pb-1.5">
                                            <span className="text-graphite uppercase">Location</span>
                                            <span className="font-semibold text-ink">Colombo, Sri Lanka</span>
                                        </div>
                                        <div className="flex justify-between border-b border-ink/10 pb-1.5">
                                            <span className="text-graphite uppercase">Engagement</span>
                                            <span className="font-semibold text-accent">Available / Remote</span>
                                        </div>
                                    </div>

                                    {/* CTAs */}
                                    <div className="flex flex-col gap-2 pt-2">
                                        <a href="#projects" className="lux-btn-primary text-center justify-center py-2.5">
                                            Explore Projects <span className="lux-btn-chevron">→</span>
                                        </a>
                                        <div className="grid grid-cols-2 gap-2">
                                            <a href="/Siluna_Nusal_CV.pdf" target="_blank" rel="noopener noreferrer" className="lux-btn-ghost text-center justify-center py-2">
                                                Fax CV ↗
                                            </a>
                                            <button
                                                onClick={() => useStore.getState().setMeetingModalOpen(true)}
                                                className="hud-btn hud-btn--volt text-center justify-center py-2 cursor-pointer"
                                            >
                                                Book Call 📅
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Dispatch Note */}
                                <div className="telegram px-4 py-3" data-stamp="STATUS">
                                    <div className="dateline text-[9px] tracking-[0.2em] uppercase text-ink/70">DESK DISPATCH NOTE</div>
                                    <p className="font-mono text-[10px] text-graphite mt-1 leading-relaxed">
                                        Currently engineering high-throughput platform tools. Reach out for systems contracts or full-time engagements.
                                    </p>
                                </div>

                                {/* In Print — Current Works */}
                                <div className="story-card p-4">
                                    <div className="flex items-center justify-between border-b border-ink/20 pb-2 mb-2">
                                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-ink">On the Bench</span>
                                        <span className="font-mono text-[9px] text-accent">IN PRINT</span>
                                    </div>
                                    <div className="space-y-2 font-mono text-[11px]">
                                        {[
                                            { name: 'AeroLang', status: 'Compiler passes', state: 'RC' },
                                            { name: 'ByBridge', status: 'IPC design', state: 'ACTIVE' },
                                            { name: 'AegisLayer', status: 'Telemetry security', state: 'SHIPPING' },
                                        ].map(w => (
                                            <div key={w.name} className="flex items-center justify-between border-b border-ink/10 pb-1.5 last:border-0 last:pb-0">
                                                <span className="text-ink">{w.name}</span>
                                                <span className="flex items-center gap-2">
                                                    <span className="text-graphite">{w.status}</span>
                                                    <span className="text-accent">{w.state}</span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}