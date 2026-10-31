import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Cpu, Layers, Calendar, CheckCircle2, Maximize2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { projectsData } from '../data/projects';
import useStore, { MOODS } from '../store/useStore';
import Footer from '../components/Footer';

export default function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const setMood = useStore((state) => state.setMood);
    const [lightboxImg, setLightboxImg] = useState(null);

    const projectIndex = projectsData.findIndex((p) => p.id === id);
    const project = projectIndex !== -1 ? projectsData[projectIndex] : null;
    const prevProject =
        projectIndex !== -1
            ? projectsData[(projectIndex - 1 + projectsData.length) % projectsData.length]
            : null;
    const nextProject =
        projectIndex !== -1
            ? projectsData[(projectIndex + 1) % projectsData.length]
            : null;

    useEffect(() => {
        window.scrollTo(0, 0);
        setLightboxImg(null);

        if (project) {
            setMood(project.mood || MOODS.OWL_MODE);
        } else {
            setMood(MOODS.OWL_MODE);
        }

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (lightboxImg) {
                    setLightboxImg(null);
                } else {
                    navigate('/');
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [project, setMood, navigate, lightboxImg]);

    if (!project) {
        return (
            <div className="relative z-10 w-full min-h-screen flex items-center justify-center flex-col gap-6 bg-panel p-6 text-center">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent font-bold">
                    ERR_404 // ARCHIVE RECORD MISSING
                </span>
                <h1 className="text-4xl md:text-5xl text-ink font-display font-bold">
                    Monograph Not Found
                </h1>
                <p className="text-graphite font-serif text-base max-w-md">
                    The technical dossier you requested may have been relocated or re-indexed in the broadsheet archive.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-ink text-void hover:bg-accent transition-colors flex items-center gap-2 font-mono text-xs tracking-widest uppercase cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" /> Return to Front Page [ESC]
                </button>
            </div>
        );
    }

    const allImages = [
        ...(project.images || []),
        ...(project.linuxImages || []),
        ...(project.androidImages || []),
    ];
    const serialNo = String(projectIndex + 1).padStart(2, '0');

    return (
        <div className="relative z-10 w-full min-h-screen pt-24 md:pt-28 bg-void text-ink">
            <div className="max-w-[1380px] mx-auto px-4 sm:px-8 md:px-12 pb-20">
                {/* Broadsheet Monograph Running Header */}
                <div
                    className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8 border-t-2 border-b border-ink"
                    style={{ borderTopWidth: '3px', borderTopStyle: 'double' }}
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 text-ink hover:text-accent transition-colors group font-mono text-[11px] font-bold tracking-[0.2em] uppercase"
                    >
                        <span className="p-1.5 border border-ink/30 group-hover:border-accent group-hover:bg-accent group-hover:text-void transition-all">
                            <ArrowLeft className="w-3.5 h-3.5" />
                        </span>
                        <span>
                            Return to Broadsheet <span className="text-graphite font-normal">[ESC]</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-graphite">
                        <span className="hidden md:inline">THE DAILY DEVELOPER · TECHNICAL MONOGRAPH</span>
                        <span className="px-2.5 py-1 bg-ink text-void font-bold">
                            DOSSIER // {serialNo} OF {String(projectsData.length).padStart(2, '0')}
                        </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
                        {prevProject && (
                            <Link
                                to={`/project/${prevProject.id}`}
                                className="px-2.5 py-1 border border-ink/25 bg-panel hover:border-accent hover:text-accent transition-colors"
                                title={`Previous: ${prevProject.title}`}
                            >
                                ← Prev
                            </Link>
                        )}
                        {nextProject && (
                            <Link
                                to={`/project/${nextProject.id}`}
                                className="px-2.5 py-1 border border-ink/25 bg-panel hover:border-accent hover:text-accent transition-colors"
                                title={`Next: ${nextProject.title}`}
                            >
                                Next →
                            </Link>
                        )}
                    </div>
                </div>

                {/* Monumental Monograph Title Plate */}
                <header className="bg-panel border-2 border-ink p-6 md:p-10 lg:p-12 mb-10 shadow-[6px_6px_0_rgba(13,13,13,0.12)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-ink/20">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-2.5 py-0.5 bg-accent text-void font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
                                MONOGRAPH № {serialNo}
                            </span>
                            <span className="text-xs font-mono tracking-[0.22em] text-accent uppercase font-bold">
                                {project.role}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
                            {project.year && (
                                <span className="px-2.5 py-0.5 border border-ink/25 bg-panel-deep text-ink">
                                    YEAR: {project.year}
                                </span>
                            )}
                            {project.status && (
                                <span className="px-2.5 py-0.5 border border-accent/40 bg-accent/10 text-accent font-bold">
                                    ● {project.status}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div className="max-w-3xl">
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-ink tracking-tight leading-[0.96]">
                                {project.title}
                            </h1>
                            {project.subtitle && (
                                <p className="mt-3 text-lg md:text-2xl font-display italic text-ink/80 leading-snug">
                                    {project.subtitle}
                                </p>
                            )}
                        </div>

                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-ink hover:bg-accent text-void transition-all font-mono text-xs font-bold tracking-[0.2em] uppercase flex-shrink-0 shadow-[4px_4px_0_var(--color-accent)] hover:shadow-none"
                            >
                                <span>Inspect Live System / Repo</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        )}
                    </div>

                    {/* Key Metrics Telemetry Bar */}
                    {project.metrics && project.metrics.length > 0 && (
                        <div className="mt-8 pt-6 border-t-2 border-ink/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {project.metrics.map((m, idx) => (
                                <div
                                    key={idx}
                                    className="px-4 py-3 bg-panel-deep/70 border border-ink/20 flex items-center justify-between"
                                >
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite">
                                        SPECIFICATION 0{idx + 1}
                                    </span>
                                    <span className="font-mono text-xs md:text-sm font-bold text-ink">
                                        {m}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </header>

                {/* 2-Column Editorial Body + Sticky Specification Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    {/* Left / Main Article & Schematics (8 cols) */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Editorial Article Sheet */}
                        <div className="bg-panel p-6 sm:p-8 md:p-11 border border-ink/25 shadow-[0_8px_28px_rgba(23,19,15,0.06)]">
                            <div className="flex items-center justify-between pb-3 mb-6 border-b border-ink/15 font-mono text-[10px] uppercase tracking-[0.2em] text-graphite">
                                <span>ARCHITECTURAL DISPATCH &amp; TECHNICAL NOTES</span>
                                <span>BY SILUNA.SYS</span>
                            </div>

                            {project.content ? (
                                <article className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-ink prose-p:text-ink/85 prose-p:font-serif prose-p:leading-relaxed prose-li:text-ink/85 prose-li:font-serif prose-strong:text-ink prose-a:text-accent hover:prose-a:underline prose-pre:bg-panel-deep prose-pre:border prose-pre:border-ink/20 prose-code:text-accent prose-code:font-mono">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {project.content}
                                    </ReactMarkdown>
                                </article>
                            ) : (
                                <p className="drop-cap text-base md:text-lg text-ink/85 font-serif leading-relaxed whitespace-pre-line">
                                    {project.description}
                                </p>
                            )}
                        </div>

                        {/* System Schematics & Interface Plates Gallery */}
                        {allImages.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-2 h-2 bg-accent" />
                                        <span className="font-mono text-xs tracking-[0.22em] uppercase font-bold text-ink">
                                            System Schematics &amp; Visual Plates
                                        </span>
                                    </div>
                                    <span className="text-accent font-mono text-xs font-bold">
                                        [{allImages.length} {allImages.length === 1 ? 'PLATE' : 'PLATES'} — CLICK TO ENLARGE]
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {allImages.map((img, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setLightboxImg({ src: img, index: i + 1 })}
                                            className="group rounded-xl border border-bordertech hover:border-accent/60 bg-panel/90 backdrop-blur-md overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
                                        >
                                            {/* Window Header */}
                                            <div className="px-3 py-2 bg-slate-900/90 border-b border-white/10 flex items-center justify-between font-mono text-[9px] text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-rose-500/80 inline-block" />
                                                    <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
                                                    <span className="ml-1.5 font-bold text-slate-300">
                                                        FIG. {String(i + 1).padStart(2, '0')} // {project.title}
                                                    </span>
                                                </div>
                                                <span className="text-accent uppercase font-bold flex items-center gap-1">
                                                    <span>Enlarge</span>
                                                    <Maximize2 className="w-3 h-3" />
                                                </span>
                                            </div>

                                            {/* Preview Image Viewport */}
                                            <div className="relative w-full bg-gradient-to-b from-slate-950 to-black flex items-center justify-center p-3 overflow-hidden min-h-[220px]">
                                                <img
                                                    src={img}
                                                    alt={`${project.title} plate ${i + 1}`}
                                                    className="max-w-full max-h-[340px] object-contain transition-transform duration-500 group-hover:scale-[1.03] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right / Sticky Specification Ledger (4 cols) */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                        {/* Technical Dossier Card */}
                        <div className="bg-panel border-2 border-ink p-6 space-y-5">
                            <div className="pb-3 border-b-2 border-ink flex items-center justify-between">
                                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                                    TECHNICAL DOSSIER
                                </span>
                                <span className="font-mono text-[10px] text-graphite">
                                    REF #{serialNo}
                                </span>
                            </div>

                            <dl className="space-y-3 font-mono text-xs">
                                <div className="flex items-center justify-between py-1.5 border-b border-ink/15">
                                    <dt className="text-graphite uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                        <Layers className="w-3.5 h-3.5 text-accent" />
                                        Domain
                                    </dt>
                                    <dd className="font-bold text-ink text-right">{project.role}</dd>
                                </div>
                                <div className="flex items-center justify-between py-1.5 border-b border-ink/15">
                                    <dt className="text-graphite uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-accent" />
                                        Chronicle Year
                                    </dt>
                                    <dd className="font-bold text-ink">{project.year || '2025'}</dd>
                                </div>
                                <div className="flex items-center justify-between py-1.5 border-b border-ink/15">
                                    <dt className="text-graphite uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                                        State
                                    </dt>
                                    <dd className="font-bold text-accent">{project.status || 'PRODUCTION'}</dd>
                                </div>
                                <div className="flex items-center justify-between py-1.5 border-b border-ink/15">
                                    <dt className="text-graphite uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                        <Cpu className="w-3.5 h-3.5 text-accent" />
                                        Visual Plates
                                    </dt>
                                    <dd className="font-bold text-ink">{allImages.length} Figures</dd>
                                </div>
                            </dl>

                            {/* Stack Tags */}
                            {project.stack && project.stack.length > 0 && (
                                <div className="pt-2">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite mb-2.5">
                                        Architecture &amp; Toolchain
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.stack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2.5 py-1 bg-panel-deep border border-ink/20 font-mono text-[10px] font-semibold text-ink uppercase tracking-wider"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-ink/20 flex flex-col gap-2.5">
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3 px-4 bg-ink hover:bg-accent text-void font-mono text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <span>Open Repository / Live Build</span>
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </a>
                                )}
                                <Link
                                    to="/"
                                    className="w-full py-2.5 px-4 bg-panel-deep hover:bg-ink hover:text-void border border-ink/25 text-ink font-mono text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Back to All Monographs</span>
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Sequential Monograph Navigation (Prev / Next Dossier) */}
                <div
                    className="mt-16 pt-10 border-t-2 border-ink grid grid-cols-1 md:grid-cols-2 gap-6"
                    style={{ borderTopWidth: '3px', borderTopStyle: 'double' }}
                >
                    {prevProject && (
                        <Link
                            to={`/project/${prevProject.id}`}
                            className="group p-6 bg-panel border border-ink/25 hover:border-accent transition-all flex flex-col justify-between"
                        >
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-graphite group-hover:text-accent">
                                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                                <span>Previous Monograph</span>
                            </div>
                            <div className="mt-3">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block">
                                    {prevProject.role}
                                </span>
                                <h4 className="text-xl md:text-2xl font-display font-bold text-ink group-hover:text-accent transition-colors mt-0.5">
                                    {prevProject.title}
                                </h4>
                            </div>
                        </Link>
                    )}

                    {nextProject && (
                        <Link
                            to={`/project/${nextProject.id}`}
                            className="group p-6 bg-panel border border-ink/25 hover:border-accent transition-all flex flex-col justify-between text-right items-end"
                        >
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-graphite group-hover:text-accent">
                                <span>Next Monograph</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="mt-3">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block">
                                    {nextProject.role}
                                </span>
                                <h4 className="text-xl md:text-2xl font-display font-bold text-ink group-hover:text-accent transition-colors mt-0.5">
                                    {nextProject.title}
                                </h4>
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            {/* Lightbox Modal for Inspecting Schematics */}
            {lightboxImg && (
                <div
                    onClick={() => setLightboxImg(null)}
                    className="fixed inset-0 z-[99999] bg-ink/85 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-6xl w-full bg-panel border-2 border-ink p-3 md:p-5 shadow-2xl"
                    >
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-ink/20 font-mono text-xs">
                            <span className="font-bold text-ink uppercase tracking-widest">
                                PLATE 0{lightboxImg.index} // {project.title}
                            </span>
                            <button
                                onClick={() => setLightboxImg(null)}
                                className="px-2.5 py-1 bg-ink text-void hover:bg-accent transition-colors flex items-center gap-1 text-[10px] uppercase tracking-widest cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" /> Close [ESC]
                            </button>
                        </div>
                        <div className="bg-[#0d1117] p-2 flex items-center justify-center max-h-[78vh] overflow-auto">
                            <img
                                src={lightboxImg.src}
                                alt={`${project.title} enlarged plate`}
                                className="max-w-full max-h-[74vh] object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Global Footer */}
            <Footer />
        </div>
    );
}

