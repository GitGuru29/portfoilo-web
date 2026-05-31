import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore from '../store/useStore';

gsap.registerPlugin(ScrollTrigger);

export default function LenisWrapper({ children }) {
    const isTerminalOpen = useStore((state) => state.isTerminalOpen);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        window.lenis = lenis;

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
            delete window.lenis;
        };
    }, []);

    // Lock/unlock scroll when terminal opens/closes
    useEffect(() => {
        if (!window.lenis) return;
        if (isTerminalOpen) {
            window.lenis.stop();
            document.body.style.overflow = 'hidden';
        } else {
            window.lenis.start();
            document.body.style.overflow = '';
        }
    }, [isTerminalOpen]);

    return <>{children}</>;
}
