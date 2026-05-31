import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore, { MOODS } from '../store/useStore';

gsap.registerPlugin(ScrollTrigger);

export default function HeroOverlay() {
    const heroRef = useRef(null);
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const nameRef = useRef(null);
    const subTextRef = useRef(null);
    const rightTextRef = useRef(null);
    const verticalTextRef = useRef(null);
    const aboutContentRef = useRef(null);
    const setMood = useStore((state) => state.setMood);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial Entry Animation
            const tl = gsap.timeline({ delay: 0.2 });

            // Fade in the background image without any scale movement
            tl.fromTo(imageRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 2, ease: "power3.out" }
            );

            // Stagger text reveals
            tl.fromTo([nameRef.current?.children, subTextRef.current, rightTextRef.current, verticalTextRef.current],
                { opacity: 0, y: 30, skewY: 2 },
                { opacity: 1, y: 0, skewY: 0, duration: 1.2, stagger: 0.1, ease: "power4.out" },
                "-=1.2"
            );

            // Photo parallax movement removed as requested

            // Cinematic Scrub Timeline (Based on sticky scroll)
            const scrubTl = gsap.timeline({
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.5,
                }
            });

            // 1. Fade out hero text elements first (name, subtitle, role)
            scrubTl.to([nameRef.current, subTextRef.current], {
                opacity: 0,
                y: -30,
                duration: 1,
            }, 0);

            // 2. Fade out right elements to make room
            scrubTl.to([rightTextRef.current, verticalTextRef.current], {
                opacity: 0,
                x: 20,
                duration: 1
            }, 0);

            // 3. Fade in About Content AFTER hero text is gone
            scrubTl.fromTo(aboutContentRef.current,
                { autoAlpha: 0, x: 40 },
                { autoAlpha: 1, x: 0, duration: 1.5, ease: "power2.out" },
                1.2
            );

            // 4. Hold About content for reading
            scrubTl.to({}, { duration: 2 });

            // Mood Management
            ScrollTrigger.create({
                trigger: heroRef.current,
                start: 'top bottom',
                end: 'bottom center',
                onEnter: () => setMood(MOODS.HERO),
                onEnterBack: () => setMood(MOODS.HERO),
            });
        }, heroRef);

        return () => ctx.revert();
    }, [setMood]);

    return (
        <section 
            id="home" 
            ref={heroRef} 
            className="w-full h-[250vh] bg-[var(--color-quantum-black)] relative z-10"
        >
            {/* The Sticky Container */}
            <div className="w-full h-[100dvh] sticky top-0 p-2 md:p-4 perspective-[1200px]">
                {/* The Rounded Cinematic Card */}
                <div 
                    ref={containerRef}
                    className="w-full h-full relative rounded-2xl md:rounded-[32px] overflow-hidden border border-[var(--color-geyser)]/10 bg-[#2b2b2b]"
                >
                
                {/* 1. Background Image with Vignette */}
                <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#2b2b2b]">
                    {/* Multi-layer vignette to seamlessly blend image into dark card */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#2b2b2b]/80 via-transparent to-[#111] pointer-events-none" />
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#2b2b2b] via-[#2b2b2b]/20 to-[#2b2b2b] pointer-events-none" />
                    <div className="absolute inset-0 z-10 bg-[#2b2b2b]/25 pointer-events-none" />
                    
                    <img 
                        ref={imageRef}
                        src="/assets/profile.png"
                        alt="Siluna N. Dangalla"
                        style={{ mixBlendMode: 'luminosity' }}
                        className="w-full max-w-[900px] h-[110%] absolute -top-[5%] left-1/2 -translate-x-1/2 object-cover object-[50%_15%] grayscale contrast-125 brightness-75 opacity-0 will-change-transform"
                    />
                </div>

                {/* 2. Top Left Logo/Name */}
                <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20 mix-blend-difference">
                    <span className="text-xs md:text-sm font-space tracking-[0.2em] uppercase text-white font-medium">
                        SIDAN ©
                    </span>
                </div>

                {/* 3. Bottom Left: Massive Typography */}
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 max-w-4xl">
                    <div ref={nameRef} className="flex flex-col mb-6 pointer-events-none">
                        <h1 className="text-[12vw] md:text-[8vw] lg:text-[7rem] leading-[0.85] font-sans font-bold tracking-tight text-white uppercase m-0 p-0 opacity-0 will-change-transform">
                            SILUNA N.
                        </h1>
                        <h1 className="text-[12vw] md:text-[8vw] lg:text-[7rem] leading-[0.85] font-sans font-bold tracking-tight text-white uppercase m-0 p-0 opacity-0 will-change-transform">
                            DANGALLA
                        </h1>
                    </div>
                    <p ref={subTextRef} className="text-xs md:text-sm font-inter text-white/70 max-w-md leading-relaxed font-light opacity-0 will-change-transform">
                        Engineering digital experiences and low-level systems that don't just function flawlessly, but are optimized to scale and outperform.
                    </p>
                </div>

                {/* 4. Bottom Right: Role Descriptions */}
                <div 
                    ref={rightTextRef}
                    className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 flex flex-col items-end text-right opacity-0 will-change-transform hidden sm:flex"
                >
                    <h2 className="text-lg md:text-2xl font-space font-medium text-white tracking-wide uppercase mb-1">
                        SOFTWARE ENGINEER
                    </h2>
                    <h3 className="text-xs md:text-sm font-space text-white/50 tracking-[0.2em] uppercase">
                        SYSTEMS & ANDROID
                    </h3>
                </div>

                {/* 5. Right Edge Vertical Text */}
                <div 
                    ref={verticalTextRef}
                    className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-20 flex flex-col items-center gap-12 opacity-0 will-change-transform hidden md:flex"
                >
                    <div 
                        className="text-[9px] md:text-[10px] font-space tracking-[0.4em] text-white/40 uppercase"
                        style={{ writingMode: 'vertical-rl' }}
                    >
                        A E G I S  S Y S
                    </div>
                    <div className="text-[9px] md:text-[10px] font-space tracking-[0.2em] text-white/40">
                        20<br/>26
                    </div>
                </div>

                {/* 6. Condensed About Section (Reveals on scroll) */}
                <div 
                    ref={aboutContentRef}
                    className="absolute top-1/2 right-6 md:right-16 -translate-y-1/2 z-30 flex flex-col gap-5 max-w-[280px] md:max-w-[400px] invisible opacity-0 will-change-[opacity,visibility,transform,filter]"
                >
                    <h3 className="text-[10px] md:text-xs font-space tracking-[0.4em] uppercase text-[var(--color-geyser)]/50">
                        About Me
                    </h3>
                    
                    <div className="flex flex-col gap-4 font-inter text-white font-semibold leading-[1.7] text-[11px] md:text-[13px]">
                        <p>
                            I’m a final-year Software Engineering undergraduate focused on building high-performance, system-level software.
                        </p>
                        <p>
                            My work spans native Android development, Linux-based tooling, and low-level system behavior — with an emphasis on efficiency, control, and reliability. I approach development from the inside out, understanding how systems operate at their core before shaping the user experience on top.
                        </p>
                        <p className="text-white/80">
                            I’ve built projects ranging from custom Android launchers with system-aware features to Linux-based utilities and experimental interaction systems. My goal is simple: engineer software that doesn’t just work, but performs predictably and scales under pressure.
                        </p>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-6 mt-2 pt-5 border-t border-white/10">
                        <a 
                            href="#projects"
                            onClick={(e) => {
                                e.preventDefault();
                                const el = document.getElementById('portfolio-filters');
                                if (el && window.lenis) {
                                    window.lenis.scrollTo(el, { offset: -50, duration: 1.2 });
                                } else {
                                    window.location.hash = '#projects';
                                }
                            }}
                            className="text-[9px] md:text-[10px] font-space tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer"
                        >
                            View Projects <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                        <a 
                            href="/Siluna_Nusal_CV.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] md:text-[10px] font-space tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
                        >
                            Download CV <span className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">↗</span>
                        </a>
                    </div>
                </div>

                </div>
            </div>
        </section>
    );
}
