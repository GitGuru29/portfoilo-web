import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore, { MOODS } from '../store/useStore';

gsap.registerPlugin(ScrollTrigger);

// Maps categoryId to a short label shown on the card
const CATEGORY_LABELS = {
    'android-sys': 'Android Systems',
    'linux-sys': 'Linux Systems',
    'os-dev': 'OS / Compiler',
    'ai': 'AI / Quantitative',
    'cyber-sec': 'Cyber Security',
    'web': 'Web',
};

export default function ProjectsOverlay({ projects = [], isFiltered = false, children }) {
    const containerRef = useRef(null);
    const projectRefs = useRef([]);
    const setMood = useStore((state) => state.setMood);

    const [showAll, setShowAll] = useState(false);
    const DISPLAY_LIMIT = 5;
    const shouldLimit = !isFiltered && projects.length > DISPLAY_LIMIT;
    const displayedProjects = shouldLimit && !showAll ? projects.slice(0, DISPLAY_LIMIT) : projects;

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top center',
                end: 'bottom top',
                onEnter: () => setMood(MOODS.OWL_MODE),
                onEnterBack: () => setMood(MOODS.OWL_MODE),
            });

            projectRefs.current.forEach((el) => {
                if (!el) return;
                gsap.fromTo(el,
                    { opacity: 0, y: 50, scale: 0.98 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out",
                        force3D: true,
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                        }
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, [setMood, displayedProjects.length]);

    return (
        <section id="projects" ref={containerRef} className="relative w-full min-h-screen bg-transparent py-32 flex flex-col items-center">

            {/* Header */}
            <div className="w-full max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row justify-between items-end gap-12 lg:gap-8">
                <div>
                    <h2 className="text-[10px] md:text-xs tracking-[0.4em] font-space uppercase text-[var(--color-geyser)]/40 mb-4 md:mb-6">
                        System Architecture
                    </h2>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-space font-light leading-tight text-[var(--color-geyser)]">
                        Featured Systems.
                    </h3>
                </div>
            </div>

            {/* Filters */}
            <div className="w-full max-w-7xl mx-auto px-6 mb-16">
                {children}
            </div>

            {/* Project Cards */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-24 relative flex flex-col gap-6 md:gap-8">
                {displayedProjects.map((project, index) => (
                    <div
                        key={project.id}
                        ref={el => {
                            if (el && !projectRefs.current.includes(el)) projectRefs.current.push(el);
                        }}
                        className="w-full group will-change-all"
                    >
                        <Link to={`/project/${project.id}`} data-cursor="View Project" className="block w-full">
                            <div className="w-full bg-[#F5F5F7] rounded-[24px] md:rounded-[32px] p-6 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden border border-slate-200/60 hover:border-blue-300/80 transition-all duration-500 shadow-xl shadow-blue-900/5 hover:shadow-[0_8px_40px_rgba(59,130,246,0.08)]">

                                {/* Hover ambient glow */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/10 to-blue-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                                {/* Left content */}
                                <div className="flex flex-col z-10 flex-1 min-w-0 pr-0 md:pr-12">
                                    <div className="flex items-center gap-4 mb-5">
                                        <span className="text-[10px] md:text-xs font-mono text-blue-400 tracking-widest tabular-nums border border-blue-200 px-2 py-1 rounded">
                                            SYS.{String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] md:text-[10px] tracking-[0.3em] font-space text-slate-400 uppercase">
                                            {CATEGORY_LABELS[project.categoryId] || project.role}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl md:text-4xl lg:text-5xl font-space font-light mb-4 text-slate-800 group-hover:text-slate-900 transition-colors duration-300 leading-tight">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-slate-500 font-inter font-light leading-relaxed max-w-2xl">
                                        {project.description}
                                    </p>
                                </div>

                                {/* Right content */}
                                <div className="flex flex-col items-start md:items-end z-10 gap-6 shrink-0 w-full md:w-auto mt-2 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-blue-200/50 md:border-transparent">
                                    {/* Tech tags */}
                                    <div className="flex flex-wrap gap-2 justify-start md:justify-end max-w-[280px]">
                                        {project.role.split(' / ').slice(0, 3).map((tag, ti) => (
                                            <span
                                                key={ti}
                                                className="text-[9px] font-space tracking-[0.15em] uppercase text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full group-hover:border-blue-300 group-hover:text-blue-800 hover:bg-blue-100 transition-colors duration-300"
                                            >
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Explore CTA */}
                                    <div className="flex items-center gap-3 text-slate-400 font-space text-[11px] md:text-xs tracking-[0.2em] uppercase group-hover:text-blue-600 transition-all duration-300 mt-2 md:mt-auto">
                                        Explore Architecture
                                        <div className="w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-500 transition-all duration-300">
                                            <span className="inline-block transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-blue-400 group-hover:text-white transition-transform duration-300">↗</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}

                {/* Show all / collapse */}
                {shouldLimit && (
                    <div className="w-full flex justify-center mt-12 relative z-20">
                        <button
                            onClick={() => setShowAll(v => !v)}
                            className="group flex items-center gap-6 text-[10px] md:text-xs tracking-[0.3em] font-space uppercase text-[var(--color-geyser)]/50 hover:text-[var(--color-geyser)] transition-colors duration-300 px-8 py-4 border border-[var(--color-geyser)]/10 hover:border-[var(--color-geyser)]/30 rounded-full bg-[#EFF6FF]"
                        >
                            {showAll ? 'Collapse Systems' : `View all ${projects.length} systems`}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
