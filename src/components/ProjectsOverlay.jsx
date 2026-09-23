import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore, { MOODS } from '../store/useStore';
import Typewriter from './Typewriter';

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
                        <Typewriter text="Latest Bulletins / Dispatches" triggerOnScroll={true} loop={false} cursorChar="_" />
                    </h2>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-space font-light leading-tight text-[var(--color-geyser)]">
                        <Typewriter text={["Systems in Print.", "Featured Dispatches.", "Open-Source Builds."]} triggerOnScroll={true} pauseDuration={3000} cursorChar="_" />
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
<Link to={`/project/${project.id}`} data-cursor="Open Project" className="block w-full">
                            <div className="w-full story-card laser-card chamfer-sm p-6 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">


                                {/* Left content */}
                                <div className="flex flex-col z-10 flex-1 min-w-0 pr-0 md:pr-12">
                                    <div className="flex items-center gap-4 mb-5">
                                        <span className="text-[10px] md:text-xs font-mono text-accent-gradient tracking-widest tabular-nums border border-accent/30 px-2 py-1 rounded-none bg-accent/[0.06]">
                                            SYS.{String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] md:text-[10px] tracking-[0.3em] font-mono text-cyanx uppercase">
                                            {CATEGORY_LABELS[project.categoryId] || project.role}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl md:text-4xl lg:text-5xl font-space font-medium mb-4 text-geyser group-hover:text-accent transition-colors duration-300 leading-tight">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-titanium font-inter font-light leading-relaxed max-w-2xl">
                                        {project.description}
                                    </p>

                                    {/* Dossier metadata */}
                                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] tracking-[0.2em] uppercase text-graphite border-t border-bordertech pt-4 max-w-2xl">
                                        <span className="text-cyanx">[ COLOMBO / GIT HASH 7FA2 ]</span>
                                        <span>SYS.{String(index + 1).padStart(2, '0')} · {CATEGORY_LABELS[project.categoryId] || project.role}</span>
                                    </div>
                                </div>

                                {/* Right content */}
                                <div className="flex flex-col items-start md:items-end z-10 gap-6 shrink-0 w-full md:w-auto mt-2 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-geyser/10 md:border-transparent">
                                    {/* Tech tags */}
                                    <div className="flex flex-wrap gap-2 justify-start md:justify-end max-w-[280px]">
                                        {project.role.split(' / ').slice(0, 3).map((tag, ti) => (
                                            <span
                                                key={ti}
                                                className="chip-tech"
                                            >
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action rail */}
                                    <div className="flex items-center gap-2 mt-2 md:mt-auto">
                                        <span className="hud-btn">SOURCE</span>
                                        <span className="hud-btn hud-btn--volt">DEPLOY</span>
                                        <span className="hud-btn hud-btn--cyan">SYS_LOG</span>
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
                            className="group flex items-center gap-6 text-[10px] md:text-xs tracking-[0.3em] font-mono uppercase text-graphite hover:text-accent transition-colors duration-300 px-8 py-4 border border-bordertech hover:border-accent/50 bg-surface rounded-none"
                        >
                            {showAll ? '[-] Collapse Systems' : `[+] View all ${projects.length} systems`}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
