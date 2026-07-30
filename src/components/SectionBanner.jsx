import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SectionBanner Component using GSAP ScrollTrigger (Lenis synced)
 * 
 * Guarantees silky-smooth 60fps/120fps scroll-scrubbing with Lenis smooth scroll.
 * Sequence:
 *  1. Pins full-screen dark container (sticky top-0 h-screen) as user enters section.
 *  2. As user scrolls down, section title types out letter-by-letter.
 *  3. Once typed, continuing to scroll fades out the heading and moves directly into section details.
 */
export default function SectionBanner({
    id,
    title = 'SECTION TITLE',
    accentColor = '#D4AF37', // Gold accent glow
}) {
    const bannerRef = useRef(null);
    const textRef = useRef(null);
    const [typedCount, setTypedCount] = useState(0);

    useEffect(() => {
        const totalChars = title.length;
        if (!totalChars) return;

        const ctx = gsap.context(() => {
            const obj = { count: 0 };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: bannerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.5, // Synced with Lenis scroll animation
                }
            });

            // Phase 1: Type out characters letter-by-letter as user scrolls (0% -> 65% scroll)
            tl.to(obj, {
                count: totalChars,
                duration: 3,
                ease: 'none',
                onUpdate: () => {
                    setTypedCount(Math.round(obj.count));
                }
            }, 0);

            // Phase 2: Fade title out and slide up as user reaches end of banner scroll (75% -> 100% scroll)
            if (textRef.current) {
                tl.to(textRef.current, {
                    opacity: 0,
                    y: -60,
                    duration: 1.5,
                    ease: 'power1.out'
                }, 3.5);
            }
        }, bannerRef);

        return () => ctx.revert();
    }, [title]);

    const visibleTitle = title.slice(0, typedCount);

    return (
        <div
            id={id ? `${id}-banner` : undefined}
            ref={bannerRef}
            className="relative w-full h-[220vh] bg-[#070709]"
        >
            {/* Sticky Full-Screen Viewport */}
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#070709] z-20 shadow-2xl">
                {/* Ambient Background Radial Glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full pointer-events-none blur-[150px] opacity-15"
                    style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
                />

                {/* Main Scroll-Driven Typewriter Title */}
                <div
                    ref={textRef}
                    className="relative z-10 max-w-6xl mx-auto text-center px-6"
                >
                    <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-space font-bold text-white tracking-tight uppercase min-h-[1.2em] flex items-center justify-center flex-wrap leading-none">
                        <span>{visibleTitle}</span>
                        <span
                            className="inline-block w-[0.35em] h-[0.85em] ml-2 bg-[#D4AF37] animate-pulse shadow-[0_0_20px_rgba(212,175,55,0.9)] align-middle"
                        />
                    </h2>
                </div>
            </div>
        </div>
    );
}
