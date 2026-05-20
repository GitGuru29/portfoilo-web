import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import GitHub3DGraph from './GitHub3DGraph';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GitHubActivitySection() {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: 50, skewY: 2 },
                {
                    opacity: 1, y: 0, skewY: 0,
                    duration: 1.2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full max-w-7xl mx-auto px-6 py-24 md:py-32 z-10 flex flex-col items-center">
            
            {/* Structural line */}
            <div className="structural-line structural-line-h top-0 left-0 w-full hidden lg:block" />

            <div className="w-full flex flex-col md:flex-row items-start justify-between mb-16 gap-12">
                <div ref={headerRef}>
                    <h2 className="text-xs md:text-sm tracking-[0.4em] font-space uppercase text-[var(--color-geyser)]/40 mb-4 md:mb-6">
                        Live Telemetry
                    </h2>
                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-space font-light text-[var(--color-geyser)] leading-tight">
                        Contribution Skyline.
                    </h3>
                </div>
                <div className="md:w-1/3 flex items-end">
                    <p className="text-sm md:text-base text-[var(--color-geyser)]/50 font-inter font-light leading-relaxed">
                        Live 3D architectural representation of my GitHub commits over the last 365 days. Drag to orbit the structure.
                    </p>
                </div>
            </div>

            {/* 3D Canvas Container */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                data-cursor="Orbit Model"
                className="w-full h-[500px] md:h-[600px] border border-[var(--color-geyser)]/10 relative overflow-hidden bg-[var(--color-quantum-black)]"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-quantum-black)] via-transparent to-transparent pointer-events-none z-10" />
                <GitHub3DGraph username="GitGuru29" />
                <div className="absolute bottom-4 left-4 p-4 text-[10px] tracking-[0.2em] font-space uppercase text-[var(--color-geyser)]/40 z-20">
                    Data Source: GitHub API
                </div>
            </motion.div>
        </section>
    );
}
