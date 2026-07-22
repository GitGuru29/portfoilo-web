import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import useStore from '../store/useStore';

export default function Preloader() {
    const unlockSystem = useStore((state) => state.unlockSystem);

    const containerRef  = useRef(null);
    const topBarRef     = useRef(null);
    const bottomBarRef  = useRef(null);
    const nameRef       = useRef(null);
    const scanRef       = useRef(null);
    const barTrackRef   = useRef(null);
    const barFillRef    = useRef(null);
    const pctRef        = useRef(null);
    const taglineRef    = useRef(null);
    const letterRefs    = useRef([]);

    const NAME = 'SILUNA';

    useEffect(() => {
        const tl = gsap.timeline();

        // ── Phase 1: Letterbox bars slide in from top & bottom ──────────
        tl.fromTo(topBarRef.current,
            { scaleY: 0, transformOrigin: 'top center' },
            { scaleY: 1, duration: 0.6, ease: 'power4.out' },
            0
        );
        tl.fromTo(bottomBarRef.current,
            { scaleY: 0, transformOrigin: 'bottom center' },
            { scaleY: 1, duration: 0.6, ease: 'power4.out' },
            0
        );

        // ── Phase 2: Name letters stagger in ─────────────────────────────
        tl.fromTo(letterRefs.current,
            { opacity: 0, y: 40, rotateX: -90 },
            {
                opacity: 1, y: 0, rotateX: 0,
                duration: 0.7, ease: 'power4.out',
                stagger: 0.08,
            },
            0.5
        );

        // ── Phase 3: Gold scan line sweeps across ────────────────────────
        tl.fromTo(scanRef.current,
            { left: '-5%', opacity: 1 },
            { left: '110%', opacity: 1, duration: 0.9, ease: 'power2.inOut' },
            1.0
        );

        // ── Phase 4: Tagline fades in ────────────────────────────────────
        tl.fromTo(taglineRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
            1.4
        );

        // ── Phase 5: Progress bar fills up ────────────────────────────────
        tl.fromTo(barTrackRef.current,
            { opacity: 0, scaleX: 0, transformOrigin: 'left center' },
            { opacity: 1, scaleX: 1, duration: 0.4, ease: 'power2.out' },
            1.6
        );

        const pctObj = { v: 0 };
        tl.to(pctObj, {
            v: 100,
            duration: 1.4,
            ease: 'power1.inOut',
            onUpdate() {
                if (barFillRef.current)
                    barFillRef.current.style.width = pctObj.v + '%';
                if (pctRef.current)
                    pctRef.current.textContent = Math.round(pctObj.v) + '%';
            },
        }, 1.8);

        // ── Phase 6: Exit — bars collapse, content fades ─────────────────
        tl.to([nameRef.current, taglineRef.current, barTrackRef.current, pctRef.current], {
            opacity: 0, y: -20, duration: 0.4, ease: 'power2.in', stagger: 0.04,
        }, 3.4);

        tl.to(topBarRef.current,
            { scaleY: 0, transformOrigin: 'top center', duration: 0.5, ease: 'power4.in' },
            3.7
        );
        tl.to(bottomBarRef.current,
            { scaleY: 0, transformOrigin: 'bottom center', duration: 0.5, ease: 'power4.in' },
            3.7
        );

        // Final fade out and unlock
        tl.to(containerRef.current, {
            opacity: 0, duration: 0.4, ease: 'power2.inOut',
            onComplete: unlockSystem,
        }, 4.1);

        return () => tl.kill();
    }, [unlockSystem]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: '#0C0C0F',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            {/* ── Subtle grain texture ── */}
            <div aria-hidden style={{
                position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
            }} />

            {/* ── Radial gold glow ── */}
            <div aria-hidden style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0,
            }} />

            {/* ── Letterbox bars ── */}
            <div ref={topBarRef} style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '18%', background: '#0C0C0F', zIndex: 2,
                borderBottom: '1px solid rgba(212,175,55,0.15)',
            }} />
            <div ref={bottomBarRef} style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '18%', background: '#0C0C0F', zIndex: 2,
                borderTop: '1px solid rgba(212,175,55,0.15)',
            }} />

            {/* ── Corner accents ── */}
            {[
                { top: '18%', left: 0 },
                { top: '18%', right: 0 },
                { bottom: '18%', left: 0 },
                { bottom: '18%', right: 0 },
            ].map((pos, i) => (
                <div key={i} aria-hidden style={{
                    position: 'absolute', ...pos,
                    width: 40, height: 40, zIndex: 3,
                    borderTop: i < 2 ? '1px solid rgba(212,175,55,0.2)' : 'none',
                    borderBottom: i >= 2 ? '1px solid rgba(212,175,55,0.2)' : 'none',
                    borderLeft: i % 2 === 0 ? '1px solid rgba(212,175,55,0.2)' : 'none',
                    borderRight: i % 2 === 1 ? '1px solid rgba(212,175,55,0.2)' : 'none',
                }} />
            ))}

            {/* ── Main center content ── */}
            <div style={{
                position: 'relative', zIndex: 5,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 24,
            }}>

                {/* Name letters */}
                <div
                    ref={nameRef}
                    style={{
                        position: 'relative', overflow: 'hidden',
                        display: 'flex', gap: 'clamp(4px, 1.5vw, 12px)',
                        perspective: 800,
                    }}
                >
                    {/* Gold scan line over the name */}
                    <div ref={scanRef} style={{
                        position: 'absolute', top: 0, bottom: 0,
                        width: '6%',
                        background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.6), transparent)',
                        zIndex: 10, pointerEvents: 'none',
                        left: '-5%', opacity: 0,
                    }} />

                    {NAME.split('').map((letter, i) => (
                        <span
                            key={i}
                            ref={el => letterRefs.current[i] = el}
                            style={{
                                fontFamily: 'Space Grotesk, sans-serif',
                                fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                                fontWeight: 800,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                color: '#FAFAFA',
                                lineHeight: 1,
                                opacity: 0,
                                display: 'inline-block',
                            }}
                        >
                            {letter}
                        </span>
                    ))}
                </div>

                {/* Tagline */}
                <div ref={taglineRef} style={{
                    opacity: 0,
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 'clamp(9px, 1.2vw, 11px)',
                    letterSpacing: '0.5em',
                    textTransform: 'uppercase',
                    color: 'rgba(212,175,55,0.7)',
                }}>
                    Systems · Android · Software
                </div>

                {/* Progress bar + percentage */}
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 10, width: 'clamp(200px, 30vw, 340px)',
                }}>
                    <div
                        ref={barTrackRef}
                        style={{
                            width: '100%', height: 1,
                            background: 'rgba(255,255,255,0.08)',
                            position: 'relative', overflow: 'hidden',
                            opacity: 0,
                        }}
                    >
                        <div
                            ref={barFillRef}
                            style={{
                                position: 'absolute', top: 0, left: 0,
                                height: '100%', width: '0%',
                                background: 'linear-gradient(to right, rgba(212,175,55,0.4), rgba(212,175,55,1))',
                                boxShadow: '0 0 8px rgba(212,175,55,0.6)',
                            }}
                        />
                    </div>
                    <span
                        ref={pctRef}
                        style={{
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontSize: 10, letterSpacing: '0.3em',
                            color: 'rgba(255,255,255,0.25)',
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        0%
                    </span>
                </div>
            </div>

            {/* ── Bottom label ── */}
            <div style={{
                position: 'absolute', bottom: '22%',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 9, letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.15)',
                zIndex: 5,
            }}>
                Portfolio v2026
            </div>
        </div>
    );
}
