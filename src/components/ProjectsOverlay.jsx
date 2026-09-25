import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import usePageReveal from '../utils/usePageReveal';

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
    const containerRef = usePageReveal({ selector: '.project-row', y: 40, stagger: 0.1 });

    const [showAll, setShowAll] = useState(false);
    const DISPLAY_LIMIT = 5;
    const shouldLimit = !isFiltered && projects.length > DISPLAY_LIMIT;
    const displayedProjects = shouldLimit && !showAll ? projects.slice(0, DISPLAY_LIMIT) : projects;

    return (
        <section id="projects" ref={containerRef} className="relative w-full bg-transparent flex flex-col items-center">

            {/* Filters */}
            <div className="w-full">
                {children}
            </div>

            {/* Project Cards */}
            <div className="w-full relative flex flex-col gap-4 md:gap-5">
                {displayedProjects.map((project, index) => (
                    <div
                        key={project.id}
                        className="project-row w-full group will-change-all"
                    >
                        <Link to={`/project/${project.id}`} data-cursor="Open Project" className="block w-full">
                            <div className="w-full story-card laser-card chamfer-sm p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-8 relative overflow-hidden">


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
                                     <h4 className="text-xl md:text-3xl lg:text-4xl font-space font-medium mb-3 text-geyser group-hover:text-accent transition-colors duration-300 leading-tight">
                                         {project.title}
                                     </h4>
                                     <p className="text-sm text-titanium font-inter font-light leading-relaxed max-w-2xl">
                                         {project.description}
                                     </p>

                                     {/* Dossier metadata */}
                                     <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] tracking-[0.2em] uppercase text-graphite border-t border-bordertech pt-3 max-w-2xl">
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
                    <div className="w-full flex justify-center mt-6 relative z-20">
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
