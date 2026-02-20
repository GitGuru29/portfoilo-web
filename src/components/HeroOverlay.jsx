import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore, { MOODS } from '../store/useStore';

export default function HeroOverlay() {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const setMood = useStore((state) => state.setMood);

    useEffect(() => {
        // 1. Text fade out on scroll
        gsap.to(textRef.current, {
            opacity: 0,
            y: -100,
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            }
        });

        // 2. Mood state sync
        ScrollTrigger.create({
            trigger: heroRef.current,
            start: "top bottom",
            end: "bottom center",
            onEnter: () => setMood(MOODS.HERO),
            onEnterBack: () => setMood(MOODS.HERO),
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [setMood]);

    return (
        <section ref={heroRef} className="h-screen w-full flex flex-col items-center justify-center pointer-events-none">
            <div ref={textRef} className="text-center pointer-events-auto">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500">
                    Siluna Nusal
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide mb-6">
                    Understanding systems from the ground up
                </p>
                <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-500 uppercase tracking-widest">
                    <span>Android</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                    <span>Systems</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                    <span>Security</span>
                </div>
            </div>
        </section>
    );
}
