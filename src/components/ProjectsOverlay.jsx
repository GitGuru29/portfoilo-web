import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore, { MOODS } from '../store/useStore';
import { projectsData as projects } from '../data/projects';

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
                        <Link to={`/project/${project.id}`} className={`flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-7xl group cursor-pointer`}>
                            {/* Text Info */}
                            <div className="max-w-2xl glass p-8 md:p-10 rounded-3xl border border-white/5 bg-cyber-dark/60 backdrop-blur-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_0_40px_rgba(181,55,242,0.3)] group-hover:border-cyber-violet/50 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyber-violet/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <span className="text-xs md:text-sm font-space tracking-widest text-cyber-violet mb-4 uppercase flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-cyber-violet animate-pulse shadow-[0_0_8px_#b537f2]" />
                                    {project.role}
                                </span>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl pb-2 font-orbitron font-black mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 group-hover:to-cyber-violet transition-colors duration-500">{project.title}</h2>
                                <p className="text-lg md:text-xl text-gray-400 font-inter font-light leading-relaxed mb-6">
                                    {project.description}
                                </p>
                                <div className="inline-flex items-center gap-2 text-cyber-violet font-space font-medium border border-cyber-violet/30 px-6 py-3 rounded-full hover:bg-cyber-violet/10 hover:shadow-[0_0_15px_rgba(181,55,242,0.4)] transition-all duration-300">
                                    View Full Project Details
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
