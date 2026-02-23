import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore, { MOODS } from '../store/useStore';

const projects = [
    {
        title: 'GameModeX',
        role: 'Android / Performance Optimization',
        mood: MOODS.OS,
        description: 'A System-level Game Launcher & Optimizer for Android featuring 4K recording, AI Game Booster, and Thermal Monitoring. Built with Native Kotlin and Android System APIs.'
    },
    {
        title: 'Bybridge',
        role: 'C++ Daemon / WebSockets',
        mood: MOODS.NETWORKING,
        description: 'A Cross-Device Ecosystem Daemon to control Arch Linux from Android, including biometric integration and real-time device synchronization.'
    },
    {
        title: 'AeroLang',
        role: 'Compiler Development',
        mood: MOODS.OS,
        description: 'A custom compiled programming language built from scratch using C++ and LLVM. Currently in Lexer and Parser phase.',
        images: [
            '/aerolang/aero-1.png',
            '/aerolang/aero-2.jpg',
            '/aerolang/aero-3.jpg',
            '/aerolang/aero-4.jpg'
        ]
    },
    {
        title: 'LankaSmartMart',
        role: 'Android / E-Commerce',
        mood: MOODS.MOBILE,
        description: 'A modern, secure E-Commerce Android app built with Jetpack Compose & Firebase featuring ML Kit Card Scanning and Google Maps.'
    },
    {
        title: 'NeonMonitor',
        role: 'Linux / System Processing',
        mood: MOODS.AI,
        description: 'A high-performance Linux task manager and resource monitor utilizing Procfs and system calls for real-time tracking.'
    }
];

export default function ProjectsOverlay() {
    const containerRef = useRef(null);
    const sectionsRef = useRef([]);
    const setMood = useStore((state) => state.setMood);

    // Set ref array
    sectionsRef.current = [];
    const addToRefs = (el) => {
        if (el && !sectionsRef.current.includes(el)) {
            sectionsRef.current.push(el);
        }
    };

    useEffect(() => {
        // 1. Enter Owl Mode when container hits viewport
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top center",
            end: "bottom top",
            onEnter: () => setMood(MOODS.OWL_MODE),
            onEnterBack: () => setMood(MOODS.OWL_MODE),
        });

        // 2. Horizontal pinning or scrub mechanics
        const pinAnimation = gsap.to(sectionsRef.current, {
            xPercent: -100 * (sectionsRef.current.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                scrub: 1, // smooth scrubbing
                end: () => "+=" + containerRef.current.offsetWidth * sectionsRef.current.length,
                onUpdate: (self) => {
                    // Calculate the current active slide based on scroll progress
                    const index = Math.min(
                        projects.length - 1,
                        Math.floor(self.progress * projects.length)
                    );
                    setMood(projects[index].mood);
                }
            }
        });

        return () => {
            pinAnimation.scrollTrigger?.kill();
            pinAnimation.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [setMood]);

    return (
        <section id="projects" ref={containerRef} className="h-screen flex items-center overflow-hidden bg-transparent">
            <div className="flex w-full h-full items-center">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        ref={addToRefs}
                        className="w-[100vw] h-screen flex-shrink-0 flex items-center justify-center p-6 md:p-12"
                    >
                        <div className={`flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-7xl`}>
                            {/* Text Info */}
                            <div className="max-w-2xl glass p-8 md:p-10 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md">
                                <span className="text-xs md:text-sm font-mono tracking-widest text-[#a855f7] mb-4 uppercase flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#a855f7] animate-pulse" />
                                    {project.role}
                                </span>
                                <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-white">{project.title}</h2>
                                <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                                    {project.description}
                                </p>
                            </div>

                            {/* Stacked Image Cards (if available) */}
                            {project.images && (
                                <div className="flex relative w-full lg:w-96 h-64 lg:h-96 items-center justify-center group cursor-pointer perspective-1000 mt-8 lg:mt-0">
                                    {project.images.map((img, i) => {
                                        // Slight offsets to create a messy stack
                                        const rot = [-10, -3, 4, 12][i % 4];
                                        const zInd = [10, 20, 30, 40][i % 4];

                                        // We use peer or group hover classes, but inline custom properties are safer here since group-hover dynamic translates need to be applied specifically per child.
                                        // The easiest Tailwind-only approach for complex per-child group-hover is to assign a unique class or just inject a standard <style> (not jsx="true").

                                        return (
                                            <div
                                                key={i}
                                                className={`card-${i} absolute w-48 h-48 lg:w-72 lg:h-72 rounded-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 ease-out origin-bottom bg-[#0a0a0a]`}
                                                style={{
                                                    transform: `rotate(${rot}deg)`,
                                                    zIndex: zInd,
                                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                                                }}
                                            >
                                                <div className="w-full h-full transition-all duration-500 hover:scale-105 opacity-90 group-hover:opacity-100">
                                                    <img src={img} className="w-full h-full object-cover" alt={`${project.title} screenshot ${i + 1}`} />
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {/* Standard React style block for the complex fan-out interactions */}
                                    <style>{`
                                        .group:hover .card-0 { transform: translate(-80px, 15px) rotate(-15deg) !important; z-index: 50 !important; }
                                        .group:hover .card-1 { transform: translate(-25px, -10px) rotate(-5deg) !important; z-index: 50 !important; }
                                        .group:hover .card-2 { transform: translate(30px, -10px) rotate(5deg) !important; z-index: 50 !important; }
                                        .group:hover .card-3 { transform: translate(90px, 15px) rotate(15deg) !important; z-index: 50 !important; }
                                        
                                        @media (min-width: 1024px) {
                                            .group:hover .card-0 { transform: translate(-100px, 20px) rotate(-15deg) !important; }
                                            .group:hover .card-1 { transform: translate(-30px, -10px) rotate(-5deg) !important; }
                                            .group:hover .card-2 { transform: translate(40px, -10px) rotate(5deg) !important; }
                                            .group:hover .card-3 { transform: translate(110px, 20px) rotate(15deg) !important; }
                                        }

                                        /* Bring the actively hovered card all the way to the front and scale it up */
                                        .group .card-0:hover, .group .card-1:hover, .group .card-2:hover, .group .card-3:hover {
                                            transform: scale(1.15) translateY(-20px) !important;
                                            z-index: 100 !important;
                                            box-shadow: 0 0 40px rgba(168, 85, 247, 0.4) !important;
                                        }
                                    `}</style>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
