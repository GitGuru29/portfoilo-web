import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/*
 * KineticScene — full-bleed "printed" interlude.
 * Scroll-scrub choreography: an oversized Fraunces word assembles in,
 * holds, and tears away as the next section is reached.
 * variant: 'ink' | 'vrm' | 'sky' — plate color
 */
export default function KineticScene({ word, note, variant = 'ink', sceneClass = '' }) {
    const rootRef = useRef(null);
    const wrapRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const chars = wrapRef.current.querySelectorAll('.ks-char');
            const ws = wrapRef.current.querySelectorAll('.ks-space');
            const meta = wrapRef.current.querySelector('.ks-meta');
            const frame = wrapRef.current.querySelector('.ks-frame');

            gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top 80%',
                    end: 'top 30%',
                    scrub: 0.8,
                },
            })
                .fromTo(chars,
                    { opacity: 0, yPercent: 110, rotate: 4 },
                    { opacity: 1, yPercent: 0, rotate: 0, stagger: 0.02, duration: 1 }
                )
                .fromTo(meta,
                    { opacity: 0, y: 12 },
                    { opacity: 1, y: 0, duration: 0.5 },
                    '-=0.6'
                )
                .fromTo(frame,
                    { scaleX: 0.92, opacity: 0 },
                    { scaleX: 1, opacity: 1, duration: 0.7 },
                    '-=0.5'
                );

            // Tear-away exit
            gsap.to(chars, {
                opacity: 0, yPercent: -40, stagger: 0.012, duration: 0.9, ease: 'power2.in',
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top -20%',
                    end: 'top -80%',
                    scrub: 1,
                },
            });
        }, rootRef);
        return () => ctx.revert();
    }, []);

    const plate = {
        ink: 'kinetic-word',
        vrm: 'kinetic-word kinetic-word--vrm',
        sky: 'kinetic-word kinetic-word--sky',
    }[variant];

    const chars = word.split('').map((ch, i) => (
        ch === ' '
            ? <span key={i} className="ks-space inline-block w-[0.28em]" />
            : <span key={i} className="ks-char inline-block will-change-transform">{ch}</span>
    ));

    return (
        <section ref={rootRef} className={`kinetic-scene relative z-[5] ${sceneClass}`} style={{ background: 'var(--color-void)' }}>
            <div ref={wrapRef} className="w-full max-w-[90vw] mx-auto flex flex-col items-center gap-10 px-4">
                <div className="kinetic-word-meta ks-meta flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] uppercase text-graphite opacity-0 will-change-transform">
                    <span className="w-8 h-px bg-ink/30 inline-block" />
                    <span>{note}</span>
                </div>
                <h2
                    className={`ks-frame text-center select-none leading-none ${plate}`}
                    style={{ fontSize: 'clamp(3.2rem, 11vw, 11rem)' }}
                >
                    {chars}
                </h2>
                <div className="ks-meta flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] uppercase text-graphite opacity-0 will-change-transform">
                    <span>PRESS RUN · {String.fromCharCode(0x00A7)}</span>
                    <span className="w-8 h-px bg-ink/30 inline-block" />
                </div>
            </div>
        </section>
    );
}