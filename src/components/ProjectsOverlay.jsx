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
        description: 'A custom compiled programming language built from scratch using C++ and LLVM. Currently in Lexer and Parser phase.'
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
                        className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-12"
                    >
                        <div className="max-w-3xl glass p-12 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md">
                            <span className="text-sm font-mono tracking-widest text-[#a855f7] mb-4 block uppercase flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#a855f7] animate-pulse" />
                                {project.role}
                            </span>
                            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">{project.title}</h2>
                            <p className="text-2xl text-gray-400 font-light leading-relaxed">
                                {project.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
