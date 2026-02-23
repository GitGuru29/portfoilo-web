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

                            {/* Scrolling Image Gallery for detailed shots */}
                            {project.images && (
                                <div className="absolute bottom-12 md:bottom-20 left-0 w-full px-6 md:px-12 pointer-events-none">
                                    <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory pointer-events-auto items-end justify-start xl:justify-center custom-scrollbar">
                                        {project.images.map((img, i) => (
                                            <div
                                                key={i}
                                                className="shrink-0 w-[85vw] md:w-[600px] snap-center rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] group-card"
                                            >
                                                <img
                                                    src={img}
                                                    className="w-full h-auto object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                                                    alt={`${project.title} screenshot ${i + 1}`}
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Subdued custom scrollbar styling */}
                                    <style>{`
                                        .custom-scrollbar::-webkit-scrollbar {
                                            height: 6px;
                                        }
                                        .custom-scrollbar::-webkit-scrollbar-track {
                                            background: rgba(255, 255, 255, 0.05);
                                            border-radius: 10px;
                                        }
                                        .custom-scrollbar::-webkit-scrollbar-thumb {
                                            background: rgba(168, 85, 247, 0.5);
                                            border-radius: 10px;
                                        }
                                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                            background: rgba(168, 85, 247, 0.8);
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
