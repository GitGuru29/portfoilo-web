import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../utils/scrollToSection';

gsap.registerPlugin(ScrollTrigger);

export default function LenisWrapper({ children }) {
    useEffect(() => {
        // Honour the OS motion preference: no smoothing, no wheel easing.
        const reduced = prefersReducedMotion();

        const lenis = new Lenis({
            duration: reduced ? 0 : 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: !reduced,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        window.lenis = lenis;

        // Keep GSAP ScrollTrigger in sync with Lenis smooth scroll
        lenis.on('scroll', () => {
            ScrollTrigger.update();
        });

        // Use native requestAnimationFrame for silky smooth 60fps/120fps scrolling
        let rafId;
        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            delete window.lenis;
        };
    }, []);

    return <>{children}</>;
}
