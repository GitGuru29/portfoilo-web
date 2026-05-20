import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    const btnRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > window.innerHeight * 0.6);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animate in/out
    useEffect(() => {
        if (!btnRef.current) return;
        gsap.to(btnRef.current, {
            opacity: visible ? 1 : 0,
            y: visible ? 0 : 12,
            duration: 0.4,
            ease: 'power2.out',
            pointerEvents: visible ? 'auto' : 'none',
        });
    }, [visible]);

    const handleClick = () => {
        if (window.lenis) {
            window.lenis.scrollTo(0, { duration: 1.4 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <button
            ref={btnRef}
            onClick={handleClick}
            aria-label="Scroll to top"
            className="fixed bottom-10 right-6 md:right-8 z-[89] w-10 h-10 flex items-center justify-center border border-[var(--color-geyser)]/15 bg-[var(--color-quantum-black)]/98 hover:border-[var(--color-geyser)]/40 hover:bg-[var(--color-geyser)]/[0.03] transition-colors duration-300 group opacity-0"
            style={{ willChange: 'transform, opacity' }}
        >
            <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="text-[var(--color-geyser)]/40 group-hover:text-[var(--color-geyser)]/80 transition-colors group-hover:-translate-y-0.5 transition-transform duration-300"
            >
                <path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}
