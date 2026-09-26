import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import useStore, { MOODS } from '../store/useStore';

/* Resolved from CSS custom properties so the front page inherits the
   current newsprint palette and its own chapter-00 press grading
   (.paper-page re-points --color-accent to --ch-ink per sheet).
   Hard-coded hexes here silently drifted out of the token system. */
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
            <div ref={stageRef} className="relative flex flex-col overflow-hidden" style={{ width: '100%', height: '100%' }}>

                {/* Newsprint grain */}
                <div aria-hidden className="absolute inset-0 noise-bg opacity-35 pointer-events-none" />

                {/* ── FOLIO / TOP STRIP — double hairline ── */}
                <div ref={folioTopRef} className="flex-none px-6 pt-[58px] md:pt-[62px] z-20" style={{ borderTop: '1px solid ' + S.ink, borderBottom: '1px solid color-mix(in srgb, var(--color-ink) 25%, transparent)' }}>
                    <div className="flex items-center justify-between gap-4 px-2 pt-1.5 pb-1 font-mono text-[8px] md:text-[9px] tracking-[0.26em] uppercase text-ink/70">
                        <span className="hidden sm:inline">EST. 2021 — VOL. XXIV</span>
                        <span className="truncate font-semibold text-ink/90">THE DAILY DEVELOPER · BROADSHEET EDITION</span>
                        <span className="hidden md:inline">NO. 24</span>
                        <span className="text-accent">☀ SYSTEM: NOMINAL</span>
                        <span>PRICE: FREEWARE</span>
                    </div>
                </div>

                {/* ── MASTHEAD ── */}
                <div ref={topRef} className="flex-none px-6 mt-4 md:mt-5 z-10 text-center">
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
                <div className="flex-1 min-h-0 z-10 px-6 md:px-[5vw] pb-2">
                    <div ref={leadGridRef} className="h-full grid grid-cols-12 gap-0 pt-3" style={{ borderTop: '2px solid ' + S.ink }}>

                        {/* LEFT — the lead story */}
                        <div className="col-span-12 md:col-span-7 lg:col-span-8 flex flex-col md:pr-8 pt-4 min-h-0 overflow-y-auto overscroll-contain" style={{ borderRight: '0 none' }}>

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

                                {/* Justified two-column story w/ drop cap.
                                    Grid, not CSS multicol — multicol fragments its
                                    children and overflowed its measure. The column
                                    rule is drawn on the gutter so it stays exact. */}
                                <div className="mt-3 hidden sm:grid sm:grid-cols-2" style={{ fontFamily: S.body, fontSize: '12.5px', lineHeight: 1.55, color: 'color-mix(in srgb, var(--color-ink) 88%, transparent)' }}>
                                    <p className="drop-cap text-justify sm:pr-6 sm:border-r" style={{ marginTop: 3, borderColor: 'var(--ch-rule)' }}>
                                        The desk reports a developer who treats the machine as read-only until
                                        proven otherwise — building low-level systems software, native Android,
                                        and Linux tooling engineered for determinism and quiet correctness.
                                        Every project is compiled against reality: small, measurable, and
                                        predictable under load.
                                    </p>
                                    <p className="text-justify sm:pl-6" style={{ marginTop: 3 }}>
                                        From kernel utilities to compiler passes, the work favours the lowest
                                        layer that will still run. The editorial board notes a particular
                                        immunity to fashionable abstractions: correctness before speed, speed
                                        before scale.
                                    </p>
                                </div>

                                {/* Mobile story excerpt */}
                                <p className="sm:hidden text-justify" style={{ fontFamily: S.body, fontSize: '12.5px', lineHeight: 1.55, color: 'color-mix(in srgb, var(--color-ink) 88%, transparent)' }}>
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
                                    <div className="relative overflow-hidden" style={{ border: '1px solid color-mix(in srgb, var(--color-ink) 40%, transparent)' }}>
                                        <img
                                            src="/assets/profile.png"
                                            alt="Siluna Dangalla — Independent Systems Developer"
                                            className="halftone-portrait w-full h-[32vh] max-h-[330px] object-cover"
                                            style={{ objectPosition: '50% 35%' }}
                                        />
                                        <div aria-hidden
                                            className="absolute top-3 left-3 px-2 py-1 font-mono text-[8px] tracking-[0.3em] uppercase"
                                            style={{ color: 'var(--color-accent)', border: '1px solid var(--color-accent)', background: 'color-mix(in srgb, var(--color-void) 92%, transparent)' }}
                                        >
                                            ● Breaking
                                        </div>
                                    </div>
                                    <figcaption className="mt-1 px-1 text-[11px] italic font-serif" style={{ color: 'color-mix(in srgb, var(--color-ink) 80%, transparent)', fontFamily: S.body }}>
                                        Fig. 1 — Independent Systems Developer, Colombo
                                    </figcaption>
                                </figure>

                                {/* Telegraph desk */}
                                <div className="telegram px-3 py-2 mt-1" data-stamp="TELEGRAPH">
                                    <div className="dateline text-[8px] tracking-[0.3em] uppercase text-ink/60">Western Union — Desk 024</div>
                                    <div className="mt-1.5 flex flex-col gap-0.5 font-mono text-[9.5px] tracking-[0.12em] uppercase" style={{ color: 'color-mix(in srgb, var(--color-ink) 75%, transparent)' }}>
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
                <div ref={folioBottomRef} className="flex-none mx-6 mb-6 flex items-center justify-between font-mono text-[8px] tracking-[0.3em] uppercase text-ink/60"
                    style={{ borderTop: '1px solid color-mix(in srgb, var(--color-ink) 70%, transparent)', paddingTop: 6 }}>
                    <span>CONTINUED ON PAGE TWO — THE DEVELOPER'S DESK ↑</span>
                    <span className="hidden md:inline text-accent">● PRESIDENTIAL RACE = N/A ▮ FLOODS = N/A</span>
                    <span>6°55′N — 79°51′E</span>
                </div>

            </div>
        </section>
    );
}