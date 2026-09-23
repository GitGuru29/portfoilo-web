import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore, { MOODS } from '../store/useStore';

gsap.registerPlugin(ScrollTrigger);

const S = {
    paper: '#f5f2eb',
    panel: '#fdfbf6',
    ink: '#121212',
    graphite: '#57544d',
    line: 'rgba(18,18,18,0.4)',
    crimson: '#0ea5e9',
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
    const topRef     = useRef(null);
    const folioTopRef    = useRef(null);
    const folioBottomRef = useRef(null);
    const chopA      = useRef(null);
    const chopB      = useRef(null);
    const bodyRef    = useRef(null);
    const photoRef   = useRef(null);
    const aboutRef   = useRef(null);
    const setMood    = useStore((s) => s.setMood);
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
            const tl = gsap.timeline({ delay: 0.35 });

            tl.fromTo([chopA.current, chopB.current],
                { yPercent: 118 },
                { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.09 }
            );
            tl.fromTo(photoRef.current,
                { opacity: 0, x: 24, scale: 0.99 },
                { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: 'power3.out' },
                '-=0.9'
            );
            tl.fromTo([topRef.current, bodyRef.current, folioTopRef.current, folioBottomRef.current],
                { opacity: 0 },
                { opacity: 1, duration: 0.9, ease: 'power2.out' },
                '-=1.05'
            );
            setTimeout(() => setStatsStarted(true), 700);

            /* Scroll-scrub: front page → Inside Edition */
            const scrub = gsap.timeline({
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1.4,
                },
            });

            scrub.to([topRef.current, folioTopRef.current, folioBottomRef.current], { opacity: 0, y: -40, duration: 1 }, 0);
            scrub.to([bodyRef.current, chopA.current, chopB.current], { opacity: 0, y: -40, duration: 1 }, 0);
            scrub.to(photoRef.current, { opacity: 0, y: -50, scale: 1.02, duration: 1 }, 0);

            scrub.fromTo(aboutRef.current,
                { autoAlpha: 0, y: 26 },
                { autoAlpha: 1, y: 0, duration: 1.4, ease: 'power2.out' },
                0.8
            );
            scrub.to({}, { duration: 1.6 });

            ScrollTrigger.create({
                trigger: heroRef.current,
                start: 'top bottom', end: 'bottom center',
                onEnter: () => setMood(MOODS.HERO),
                onEnterBack: () => setMood(MOODS.HERO),
            });
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
        <section ref={heroRef} id="home" style={{ width: '100%', height: '190vh', position: 'relative', zIndex: 10, background: S.paper }}>
            <div ref={stageRef} style={{ width: '100%', height: '100dvh', position: 'sticky', top: 0, overflow: 'hidden' }}>

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
                <div ref={topRef} className="absolute left-0 right-0 top-[96px] md:top-[104px] px-6 z-10 text-center" style={{ opacity: 0 }}>
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
                    <div className="h-full grid grid-cols-12 gap-0 pt-3" style={{ borderTop: '2px solid ' + S.ink }}>

                        {/* LEFT — the lead story */}
                        <div className="col-span-12 md:col-span-7 flex flex-col md:pr-8 pt-4 overflow-hidden" style={{ borderRight: '0 none' }}>

                            {/* Byline */}
                            <div ref={bodyRef} className="flex flex-col gap-2" style={{ opacity: 0 }}>
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
                                    </p>
                                    <p className="mb-2 text-justify" style={{ marginTop: 3 }}>
                                        From kernel utilities to compiler passes, the work favours the lowest
                                        layer that will still run: correctness before speed, speed before scale.
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
                        <div className="hidden md:flex col-span-5 flex-col pl-8 pt-5">
                            <div ref={photoRef} className="flex flex-col gap-3" style={{ opacity: 0 }}>
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
                    <span>12°59′N — 80°14′E</span>
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
                        padding: 'clamp(24px, 5vw, 64px)',
                    }}
                >
                    <div style={{ width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 26 }}>
                        <div className="flex items-center gap-4" style={{ borderBottom: '1px solid rgba(18,18,18,0.3)', paddingBottom: 10 }}>
                            <span className="stamp--edition">● Inside Edition</span>
                            <span className="dateline">THE DEVELOPER'S DESK — CONTINUED FROM PAGE ONE</span>
                        </div>
                        <div className="mt-3">
                            <h2 className="headline-chop text-balance" style={{ fontSize: 'clamp(2rem, 4.2vw, 3.6rem)' }}>
                                SYSTEMS BEFORE SOFTWARE, CORRECTNESS BEFORE SPEED.
                            </h2>
                        </div>
                        <div className="news-columns" style={{ fontFamily: S.body, fontSize: '15px', lineHeight: 1.75, color: 'rgba(18,18,18,0.82)' }}>
                            <p className="drop-cap text-justify" style={{ marginTop: 2 }}>
                                A final-year Software Engineering undergraduate who works at the edge of the stack —
                                native Android launchers, Linux utilities, and low-level system behaviour where
                                performance is a feature, not an afterthought. The desk moves on foot from kernel
                                modules to Jetpack Compose without changing its stride.
                            </p>
                            <p className="text-justify" style={{ marginTop: 2 }}>
                                Every dispatch is built for determinism: small, measurable, and predictable under
                                pressure. Opinion is reserved for the compiler. The office dog catches the binders.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2" style={{ borderTop: '1px solid ' + S.line, paddingTop: 18 }}>
                            {['C++', 'Kotlin', 'Linux', 'Android', 'LLVM', 'AOSP', 'Rust', 'PostgreSQL'].map(t => (
                                <span key={t} className="chip-tech">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}