import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore, { MOODS } from '../store/useStore';
import { projectsData as projects } from '../data/projects';

export default function ProjectsOverlay() {
    const containerRef = useRef(null);
    const setMood = useStore((state) => state.setMood);

    useEffect(() => {
        // Trigger Owl Mode when reaching projects
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top center",
            end: "bottom top",
            onEnter: () => setMood(MOODS.OWL_MODE),
            onEnterBack: () => setMood(MOODS.OWL_MODE),
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [setMood]);

    return (
        <section id="projects" ref={containerRef} className="relative w-full min-h-screen bg-transparent py-32 flex flex-col items-center">

            {/* Header */}
            <div className="w-full max-w-6xl mx-auto px-6 mb-24 md:mb-32">
                <span className="text-sm font-space tracking-widest text-cyber-violet mb-4 uppercase flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyber-violet animate-pulse shadow-[0_0_10px_#b537f2]" />
                    Work Portfolio
                </span>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    FEATURED <span className="text-cyber-cyan drop-shadow-[0_0_20px_rgba(0,243,255,0.4)]">SYSTEMS</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-cyber-cyan to-cyber-violet mt-8 rounded-full shadow-[0_0_15px_#00f3ff]" />
            </div>

            {/* Sticky Stacked Cards */}
            <div className="w-full max-w-6xl mx-auto px-6 pb-64 relative flex flex-col">
                {projects.map((project, index) => {
                    return (
                        <div
                            key={index}
                            className="sticky w-full mb-16 md:mb-32 last:mb-0"
                            style={{
                                top: `calc(10rem + ${index * 30}px)`,
                                zIndex: index + 10,
                            }}
                        >
                            <Link to={`/project/${project.id}`} className="block w-full group cursor-pointer">
                                <div className="w-full glass p-8 md:p-14 rounded-[2.5rem] border border-white/5 bg-[#050505]/90 backdrop-blur-2xl transition-all duration-700 hover:scale-[1.01] hover:border-cyber-violet/40 hover:shadow-[0_-15px_60px_rgba(181,55,242,0.2)] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">

                                    {/* Hover Ambient Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyber-violet/10 via-transparent to-cyber-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen" />

                                    <div className="w-full md:w-[65%] flex flex-col relative z-10">
                                        <span className="text-xs md:text-sm font-space tracking-widest text-cyber-violet mb-6 uppercase flex items-center gap-2">
                                            {project.role}
                                        </span>
                                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-orbitron font-black mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 group-hover:to-cyber-cyan transition-colors duration-500 pb-2">
                                            {project.title}
                                        </h3>
                                        <p className="text-lg md:text-xl text-gray-400 font-inter font-light leading-relaxed mb-10 max-w-2xl">
                                            {project.description}
                                        </p>

                                        <div className="mt-auto pt-4 inline-flex items-center gap-3 text-white font-space font-medium group-hover:text-cyber-cyan transition-colors tracking-widest text-sm uppercase">
                                            Access Terminal
                                            <svg className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-3 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Minimalist Tech Representation Line */}
                                    <div className="w-full md:w-[30%] flex-col items-end justify-center relative z-10 hidden md:flex border-r border-cyber-cyan/10 pr-8 transition-all duration-500 group-hover:border-cyber-cyan/40">
                                        <div className="flex flex-col gap-4 items-end opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                                            {['SYSTEM', 'ARCHITECTURE', 'DEPLOYMENT', 'ANALYSIS'].slice(0, index + 2).map((tech, i) => (
                                                <span key={i} className="font-space text-xs tracking-[0.3em] text-cyber-cyan uppercase">{tech}</span>
                                            ))}
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyber-pink shadow-[0_0_8px_#ff00ff] mt-4" />
                                        </div>
                                    </div>

                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
