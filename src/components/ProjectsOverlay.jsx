import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore, { MOODS } from '../store/useStore';

export default function ProjectsOverlay({ projects = [], isFiltered = false, children }) {
    const containerRef = useRef(null);
    const projectRefs = useRef([]);
    const setMood = useStore((state) => state.setMood);

    const [showAll, setShowAll] = useState(false);
    const DISPLAY_LIMIT = 4;
    const shouldLimit = !isFiltered && projects.length > DISPLAY_LIMIT;
    const displayedProjects = shouldLimit && !showAll ? projects.slice(0, DISPLAY_LIMIT) : projects;

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Trigger Owl Mode when reaching projects
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top center",
                end: "bottom top",
                onEnter: () => setMood(MOODS.OWL_MODE),
                onEnterBack: () => setMood(MOODS.OWL_MODE),
            });

            // We will create individual timelines for each project to handle the complex raindrop sequence
            projectRefs.current.forEach((el, index) => {
                if (!el) return;

                const raindrop = el.querySelector('.raindrop');
                const cardContainer = el.querySelector('.card-container');
                const cardContent = el.querySelector('.card-content');

                // Set initial states
                gsap.set(raindrop, { y: -800, scale: 1, opacity: 0 });
                gsap.set(cardContainer, { opacity: 0, scale: 0.95 });
                gsap.set(cardContent, { opacity: 0, y: 30 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: "top 80%", // Trigger when project wrapper enters
                        toggleActions: "play none none reverse"
                    }
                });

                // The Sequence
                // 1. Raindrop appears and falls
                tl.to(raindrop, { opacity: 1, duration: 0.1 })
                  .to(raindrop, { 
                      y: 0, 
                      duration: 0.6, 
                      ease: "power2.in" 
                  })
                  // 2. Raindrop hits and splashes (scales horizontally fast)
                  .to(raindrop, {
                      scaleX: 100,
                      scaleY: 0.5,
                      opacity: 0,
                      duration: 0.4,
                      ease: "power3.out"
                  })
                  // 3. Card glass container appears instantly as the splash happens
                  .to(cardContainer, {
                      opacity: 1,
                      scale: 1,
                      duration: 0.5,
                      ease: "back.out(1.2)"
                  }, "-=0.3") // Start slightly before raindrop fades out
                  // 4. Content inside fades up
                  .to(cardContent, {
                      opacity: 1,
                      y: 0,
                      duration: 0.5,
                      ease: "power3.out"
                  }, "-=0.2");
            });
        }, containerRef);

        return () => ctx.revert();
    }, [setMood, displayedProjects.length]);

    return (
        <section id="projects" ref={containerRef} className="relative w-full min-h-screen bg-transparent py-32 flex flex-col items-center">

            {/* Header */}
            <div className="w-full max-w-6xl mx-auto px-6 mb-12 md:mb-16">
                <span className="text-sm font-space tracking-widest text-cyber-violet mb-4 uppercase flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyber-violet animate-pulse shadow-[0_0_10px_var(--theme-secondary)]" />
                    Work Portfolio
                </span>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    FEATURED <span className="text-cyber-cyan drop-shadow-[0_0_20px_rgba(0,243,255,0.4)]">SYSTEMS</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-cyber-cyan to-cyber-violet mt-8 rounded-full shadow-[0_0_15px_#00f3ff]" />
            </div>

            {/* Filter Section */}
            {children}

            {/* Standard Flow Cards */}
            <div className="w-full max-w-6xl mx-auto px-6 pb-24 relative flex flex-col">
                {displayedProjects.map((project, index) => {
                    return (
                        <div
                            key={index}
                            ref={el => el && !projectRefs.current.includes(el) && projectRefs.current.push(el)}
                            className="w-full mb-16 md:mb-32 last:mb-0"
                        >
                            <div className="relative block w-full group cursor-pointer pt-20">
                                {/* The Raindrop */}
                                <div className="raindrop absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-12 bg-cyber-cyan rounded-full shadow-[0_0_20px_#00f3ff,0_0_40px_#00f3ff] z-50 pointer-events-none" />

                                <Link to={`/project/${project.id}`} className="block w-full">
                                    {/* The Card Container */}
                                    <div className="card-container w-full glass p-8 md:p-14 rounded-[2.5rem] border border-white/5 bg-[#050505]/90 backdrop-blur-2xl transition-colors duration-700 hover:border-cyber-violet/40 hover:shadow-[0_-15px_60px_rgba(181,55,242,0.2)] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">

                                        {/* Hover Ambient Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyber-violet/10 via-transparent to-cyber-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen" />

                                        {/* The Card Content */}
                                        <div className="card-content w-full flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
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

                                                <div className="mt-auto pt-4 flex flex-wrap items-center gap-4">
                                                    {project.github && (
                                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded border border-cyber-cyan/40 bg-cyber-cyan/5 text-cyber-cyan hover:bg-cyber-cyan/20 hover:border-cyber-cyan transition-all font-space text-xs tracking-widest uppercase flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                            </svg>
                                                            View Code
                                                        </a>
                                                    )}
                                                    {project.link && (
                                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded border border-cyber-violet/40 bg-cyber-violet/5 text-cyber-violet hover:bg-cyber-violet/20 hover:border-cyber-violet transition-all font-space text-xs tracking-widest uppercase flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Live Demo
                                                        </a>
                                                    )}
                                                    <div className="ml-auto inline-flex items-center gap-2 text-gray-500 font-space font-medium group-hover:text-white transition-colors tracking-widest text-xs uppercase">
                                                        Read Report
                                                        <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2 text-gray-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </div>
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
                                    </div>
                                </Link>
                            </div>
                        </div>
                    );
                })}

                {shouldLimit && (
                    <div className="w-full flex justify-center mt-12 relative z-20">
                        <button 
                            onClick={() => setShowAll(!showAll)}
                            className="px-8 py-4 rounded-full border border-cyber-cyan/50 bg-cyber-dark/80 text-cyber-cyan font-space tracking-widest text-sm uppercase hover:bg-cyber-cyan/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all flex items-center gap-3 backdrop-blur-md"
                        >
                            {showAll ? 'Collapse Stack' : `View All ${projects.length} Systems`}
                            <svg className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
