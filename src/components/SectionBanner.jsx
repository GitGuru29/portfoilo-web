import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Full-Screen Deep Blue Glass SectionBanner
 * 
 * - Full screen viewport width & height (w-full h-screen).
 * - Deep dark blue gradient background matching BadgesOverlay.
 * - Crisp, high-contrast bold white typewriter text heading (text-white).
 * - GSAP ScrollTrigger letter-by-letter scroll typewriter animation.
 */
export default function SectionBanner({
    id,
    title = 'SECTION TITLE',
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
                    scrub: 0.5,
                }
            });

            // Phase 1: Type out characters letter-by-letter on scroll (0% -> 65% scroll)
            tl.to(obj, {
                count: totalChars,
                duration: 3,
                ease: 'none',
                onUpdate: () => {
                    setTypedCount(Math.round(obj.count));
                }
            }, 0);

            // Phase 2: Fade title out and slide up as user completes banner scroll (75% -> 100% scroll)
            if (textRef.current) {
                tl.to(textRef.current, {
                    opacity: 0,
                    y: -50,
                    scale: 0.96,
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
            className="relative w-full h-[200vh] bg-transparent"
        >
            {/* Sticky Full-Screen Viewport Banner (100vw x 100vh) */}
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#0c1322] via-[#0A0F1C] to-[#070b14] border-y border-blue-500/20 shadow-[0_20px_50px_-10px_rgba(59,130,246,0.35)] z-20">

                {/* Ambient Blue Background Glow Blobs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-blue-500/20 blur-[130px] pointer-events-none" />
                <div className="absolute inset-0 bg-repeat opacity-[0.03] pointer-events-none noise-bg" />

                {/* Main Scroll-Driven Typewriter Title - Crisp High-Contrast Bold White Text */}
                <div
                    ref={textRef}
                    className="relative z-10 max-w-7xl mx-auto text-center px-6"
                >
                    <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-space font-bold text-white tracking-tight uppercase min-h-[1.2em] flex items-center justify-center flex-wrap leading-none drop-shadow-2xl">
                        <span>{visibleTitle}</span>
                        <span
                            className="inline-block w-[0.35em] h-[0.85em] ml-2 bg-blue-400 animate-pulse shadow-[0_0_20px_rgba(96,165,250,0.9)] align-middle"
                        />
                    </h2>
                </div>
            </div>
        </div>
    );
}
