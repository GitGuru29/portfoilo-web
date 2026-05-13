import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
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
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0,
                    duration: 1,
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
        <section ref={sectionRef} className="relative w-full max-w-7xl mx-auto px-4 md:px-8 py-20 z-10">
            {/* Header */}
            <div ref={headerRef} className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 text-cyber-cyan font-space tracking-widest text-sm uppercase mb-4"
                    >
                        <Github className="w-5 h-5" />
                        <span>Live Telemetry</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50">
                        CONTRIBUTION <span className="text-cyber-cyan">SKYLINE</span>
                    </h2>
                </div>
                <div className="text-gray-400 font-mono text-sm max-w-sm">
                    <p>Live 3D isometric representation of my GitHub commits over the last 365 days. Drag to orbit.</p>
                </div>
            </div>

            {/* 3D Canvas Container */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="w-full h-[500px] md:h-[600px] glass rounded-3xl border border-cyber-cyan/20 overflow-hidden relative shadow-[0_0_50px_rgba(0,243,255,0.05)]"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
                <GitHub3DGraph username="GitGuru29" />
            </motion.div>
        </section>
    );
}
