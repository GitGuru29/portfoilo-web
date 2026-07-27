import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore, { MOODS } from '../store/useStore';
import Typewriter from './Typewriter';

gsap.registerPlugin(ScrollTrigger);


/* ─── StatCounter Component — GSAP direct DOM animation (no re-renders) ─── */
function StatCounter({ target, suffix, label, started }) {
    const numRef = useRef(null);

    useEffect(() => {
        if (!started || !numRef.current) return;
        const obj = { val: 0 };
        const tween = gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power3.out',
            onUpdate() {
                if (numRef.current) {
                    numRef.current.textContent = Math.round(obj.val) + suffix;
                }
            },
            onComplete() {
                if (numRef.current) numRef.current.textContent = target + suffix;
            },
        });
        return () => tween.kill();
    }, [started, target, suffix]);

    return (
        <div>
            <div
                ref={numRef}
                style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)',
                    fontWeight: 700, color: '#FAFAFA',
                    lineHeight: 1, marginBottom: 8,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.02em',
                }}
            >
                0{suffix}
            </div>
            <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 12, letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(212,175,55,0.65)',
            }}>{label}</div>
        </div>
    );
}

/* ─── Main Component ──────────────────────────────────────────────── */
export default function HeroOverlay() {
    const heroRef    = useRef(null);
    const imageRef   = useRef(null);
    const asciiRef   = useRef(null);
    const nameRef    = useRef(null);  // Eyebrow and Name (stays sticky)
    const detailsRef = useRef(null);  // Tagline, Stats, CTAs (fades out on scroll)
    const photoRef      = useRef(null);  // just the photo (fades on scroll)
    const aboutRef      = useRef(null);  // about panel (fades IN on scroll)
    const aboutPhotoRef = useRef(null);  // headset photo (fades IN on left)
    const setMood       = useStore(s => s.setMood);
    const [statsStarted, setStatsStarted] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── Entry animation ── */
            const tl = gsap.timeline({ delay: 0.25 });
            tl.fromTo(imageRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 2.2, ease: 'power2.out' }
            );
            tl.fromTo([nameRef.current, detailsRef.current],
                { opacity: 0, y: 44 },
                { opacity: 1, y: 0, duration: 1.3, ease: 'power4.out', stagger: 0.2 },
                '-=1.6'
            );
            
            setTimeout(() => setStatsStarted(true), 600);

            /* ── Scroll-scrub: hero content → about panel ── */
            const scrub = gsap.timeline({
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1.5,
                }
            });

            // Fade out the details, photo, AND the name when scrolling down.
            scrub.to(detailsRef.current, { opacity: 0, y: -50, duration: 1 }, 0);
            scrub.to(nameRef.current, { opacity: 0, y: -50, duration: 1 }, 0); // Fade out completely
            scrub.to(photoRef.current,   { opacity: 0, x: 30, duration: 1 }, 0);

            // Fade in about panel on the left side
            scrub.fromTo(aboutRef.current,
                { autoAlpha: 0, y: 30 },
                { autoAlpha: 1, y: 0, duration: 1.6, ease: 'power2.out' },
                0.9
            );


            
            scrub.to({}, { duration: 2 });

            /* ── Mood ── */
            ScrollTrigger.create({
                trigger: heroRef.current,
                start: 'top bottom', end: 'bottom center',
                onEnter: () => setMood(MOODS.HERO),
                onEnterBack: () => setMood(MOODS.HERO),
            });
        }, heroRef);
        return () => ctx.revert();
    }, [setMood]);

    /* ─── Styles (inline to keep everything dark + self-contained) ─── */
    const S = {
        section: {
            width: '100%', height: '250vh',
            position: 'relative', zIndex: 10,
            background: '#0C0C0F',
        },
        sticky: {
            width: '100%', height: '100dvh',
            position: 'sticky', top: 0,
            overflow: 'hidden',
            display: 'flex',
        },
        /* ── Left panel ── */
        leftPanel: {
            position: 'relative', zIndex: 10,
            width: '50%', height: '100%',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(28px, 4vw, 52px)',
        },
        /* ── Right panel — only the photo wrapper ── */
        rightPanel: {
            position: 'relative', zIndex: 5,
            width: '50%', height: '100%',
            overflow: 'hidden',
        },
    };

    return (
        <section id="home" ref={heroRef} style={S.section}>
            <div style={S.sticky}>

                {/* ── Subtle grain texture ── */}
                <div aria-hidden style={{
                    position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                }} />

                {/* ── Gold glow blobs ── */}
                <div aria-hidden style={{
                    position: 'absolute', top: -220, left: -180,
                    width: 700, height: 700, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%)',
                    filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
                }} />
                <div aria-hidden style={{
                    position: 'absolute', bottom: -200, right: 0,
                    width: 600, height: 600, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(160,120,20,0.06) 0%, transparent 70%)',
                    filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0,
                }} />

                {/* ══════════════════════════════════════
                    LEFT PANEL
                ══════════════════════════════════════ */}
                <div style={S.leftPanel}>

                    {/* Top bar (Empty now since SIDAN moved to right) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 24 }}>
                    </div>

                    {/* ── Main copy ── */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                        {/* Stays sticky (dimmed) on scroll */}
                        <div ref={nameRef} style={{ opacity: 0, position: 'relative', zIndex: 10 }}>
                            {/* Eyebrow — typewriter role */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                marginBottom: 'clamp(14px, 2.5vw, 24px)',
                            }}>
                                <span style={{
                                    display: 'block', width: 36, height: 1,
                                    background: 'linear-gradient(to right, rgba(212,175,55,0.8), transparent)',
                                    flexShrink: 0,
                                }} />
                                <div style={{
                                    fontFamily: 'Space Grotesk, sans-serif',
                                    fontSize: 'clamp(11px, 1.4vw, 14px)',
                                    letterSpacing: '0.3em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(212,175,55,0.85)',
                                    minHeight: '1.3em',
                                }}>
                                    <Typewriter
                                        text={[
                                            'Software Engineer',
                                            'Systems Developer',
                                            'Android Developer',
                                            'Linux Engineer',
                                            'Full-Stack Developer'
                                        ]}
                                        typingSpeed={70}
                                        deletingSpeed={35}
                                        pauseDuration={2200}
                                        cursorChar="_"
                                    />
                                </div>
                            </div>

                            {/* Name */}
                            <h1 style={{
                                fontFamily: 'Space Grotesk, sans-serif',
                                fontSize: 'clamp(3.5rem, 8vw, 8rem)',
                                fontWeight: 800, lineHeight: 0.9,
                                letterSpacing: '-0.03em',
                                textTransform: 'uppercase',
                                margin: '0 0 clamp(14px, 2vw, 22px)',
                            }}>
                                <span style={{ display: 'block', color: '#FAFAFA' }}>Siluna</span>
                                <span style={{
                                    display: 'block',
                                    WebkitTextStroke: '1.5px rgba(212,175,55,0.6)',
                                    color: 'transparent',
                                }}>Dangalla</span>
                            </h1>
                        </div>

                        {/* Fades out on scroll */}
                        <div ref={detailsRef} style={{ opacity: 0 }}>
                            {/* Gold divider */}
                            <div style={{
                                width: '100%', height: 1,
                                background: 'linear-gradient(to right, rgba(212,175,55,0.35), transparent)',
                                marginBottom: 'clamp(14px, 2vw, 22px)',
                            }} />

                        {/* Tagline */}
                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'clamp(1rem, 1.35vw, 1.2rem)',
                            color: 'rgba(255,255,255,0.75)',
                            lineHeight: 1.7, maxWidth: 440,
                            margin: '0 0 clamp(20px, 3vw, 36px)',
                        }}>
                            Engineering high-performance systems and native Android experiences —
                            built from the ground up and optimized to scale.
                        </p>

                        {/* Stats — animated count-up */}
                        <div style={{
                            display: 'flex', gap: 'clamp(20px, 3.5vw, 48px)',
                            marginBottom: 'clamp(22px, 3vw, 36px)',
                        }}>
                            {[
                                { target: 12, suffix: '+', label: 'Projects' },
                                { target: 3,  suffix: '+', label: 'Years' },
                                { target: 15, suffix: '+', label: 'Technologies' },
                            ].map(({ target, suffix, label }) => (
                                <StatCounter key={label} target={target} suffix={suffix} label={label} started={statsStarted} />
                            ))}
                        </div>

                        {/* CTAs */}
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <a
                                href="#projects"
                                id="hero-view-work-btn"
                                className="lux-btn-primary"
                                onClick={e => {
                                    e.preventDefault();
                                    const el = document.getElementById('portfolio-filters');
                                    if (el && window.lenis) window.lenis.scrollTo(el, { offset: -50, duration: 1.2 });
                                    else window.location.hash = '#projects';
                                }}
                            >
                                View Work <span className="lux-btn-chevron">→</span>
                            </a>
                            <a
                                href="/Siluna_Nusal_CV.pdf"
                                target="_blank" rel="noopener noreferrer"
                                id="hero-download-cv-btn"
                                className="lux-btn-ghost"
                            >
                                Download CV <span className="lux-btn-chevron">↗</span>
                            </a>
                        </div>
                    </div>
                </div>
                    


                </div>

                {/* ── About panel — Centered in the screen ── */}
                <div
                    ref={aboutRef}
                    id="about"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        visibility: 'hidden', opacity: 0,
                        zIndex: 100,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        textAlign: 'center',
                        padding: 'clamp(20px, 4vw, 40px)',
                        pointerEvents: 'none', // to let clicks pass when hidden
                    }}
                >
                    <div style={{ maxWidth: 800, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'auto' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 32 }}>
                            <h2 style={{
                                fontFamily: 'Space Grotesk, sans-serif',
                                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                fontWeight: 700, color: '#FAFAFA', margin: 0,
                                textTransform: 'uppercase', letterSpacing: '-0.02em',
                                textAlign: 'center',
                            }}>
                                <Typewriter text={["About Me", "Systems Engineer", "Android & Linux Dev"]} triggerOnScroll={true} pauseDuration={3000} cursorChar="_" />
                            </h2>
                        </div>

                        {/* Clean typography content (no background box) */}
                        <div style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)',
                            lineHeight: 1.8, color: 'rgba(255,255,255,0.65)',
                            display: 'flex', flexDirection: 'column', gap: 20,
                            textAlign: 'center',
                        }}>
                            <p style={{ margin: 0, textAlign: 'center' }}>
                                I am a final-year Software Engineering undergraduate with a deep focus on building 
                                high-performance, system-level software.
                            </p>
                            <p style={{ margin: 0, textAlign: 'center' }}>
                                My work spans native Android development, Linux-based tooling, and low-level system 
                                behaviour. I prioritize efficiency, fine-grained control, and absolute reliability.
                            </p>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                                From writing custom Android launchers to engineering Linux utilities — I build software 
                                that performs predictably and scales effortlessly under pressure.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════
                    RIGHT PANEL — photo only (no about panel inside)
                ══════════════════════════════════════ */}
                <div style={S.rightPanel}>

                    {/* Photo — fades out on scroll */}
                    <div ref={photoRef} style={{ position: 'absolute', inset: 0 }}>
                        <img
                            ref={imageRef}
                            src="/assets/profile.png"
                            alt="Siluna Dangalla"
                            style={{
                                position: 'absolute', inset: 0,
                                width: '100%', height: '100%',
                                objectFit: 'cover', objectPosition: '50% 12%',
                                filter: 'grayscale(85%) contrast(1.1) brightness(0.55)',
                                opacity: 0,
                            }}
                        />
                        {/* Gradient masks */}
                        <div aria-hidden style={{
                            position: 'absolute', inset: 0, pointerEvents: 'none',
                            background: `
                                linear-gradient(to right, #0C0C0F 0%, transparent 25%),
                                linear-gradient(to top, #0C0C0F 0%, transparent 28%),
                                linear-gradient(to bottom, #0C0C0F 0%, transparent 14%)
                            `,
                        }} />
                        {/* Gold tint veil */}
                        <div aria-hidden style={{
                            position: 'absolute', inset: 0, pointerEvents: 'none',
                            background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, transparent 55%)',
                        }} />



                        {/* Bottom-right tech tag */}
                        <div style={{
                            position: 'absolute', bottom: 'clamp(24px, 4vw, 48px)',
                            right: 'clamp(24px, 4vw, 56px)', zIndex: 5,
                            textAlign: 'right',
                        }}>
                            <p style={{
                                fontFamily: 'Space Grotesk, sans-serif', fontSize: 10,
                                letterSpacing: '0.22em', textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.25)', margin: 0,
                            }}>Systems · Android</p>
                            <p style={{
                                fontFamily: 'Space Grotesk, sans-serif', fontSize: 10,
                                letterSpacing: '0.22em', textTransform: 'uppercase',
                                color: 'rgba(212,175,55,0.45)', margin: '3px 0 0',
                            }}>Software Engineering</p>
                        </div>

                        {/* Vertical SIDAN text on right side of photo */}
                        <div style={{
                            position: 'absolute', top: '50%', right: 'clamp(16px, 2.5vw, 32px)',
                            transform: 'translateY(-50%)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                            zIndex: 10,
                            pointerEvents: 'none',
                        }}>
                            <div style={{
                                width: 1, height: 40,
                                background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.4))',
                            }} />
                            <span style={{
                                fontFamily: 'Space Grotesk, sans-serif',
                                fontSize: 9, letterSpacing: '0.38em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.45)',
                                writingMode: 'vertical-rl',
                                fontWeight: 500,
                            }}>SIDAN © 2026</span>
                            <div style={{
                                width: 1, height: 40,
                                background: 'linear-gradient(to top, transparent, rgba(212,175,55,0.4))',
                            }} />
                        </div>
                    </div>                </div>
            </div>
        </section>
    );
}
