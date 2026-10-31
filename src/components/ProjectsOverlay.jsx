import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, Layers, Cpu, Terminal } from 'lucide-react';
import usePageReveal from '../utils/usePageReveal';

const CATEGORY_LABELS = {
    'android-sys': 'Android Internals',
    'linux-sys':   'Linux Systems',
    'os-dev':      'OS & Compilers',
    'ai':          'AI & Quantitative',
    'cyber-sec':   'Cyber Security',
    'web':         'Web Architecture',
};

const CATEGORY_DOTS = {
    'android-sys': '#16a34a',
    'linux-sys':   '#2563eb',
    'os-dev':      '#9333ea',
    'ai':          '#ea580c',
    'cyber-sec':   '#dc2626',
    'web':         '#0891b2',
};

const pad        = (n) => String(n).padStart(2, '0');
const categoryOf = (p) => CATEGORY_LABELS[p.categoryId] || p.role;
const dotColor   = (p) => CATEGORY_DOTS[p.categoryId] || 'var(--color-accent)';
const tagsOf     = (p) => p.stack && p.stack.length ? p.stack : p.role.split(' / ').slice(0, 4).map((t) => t.trim());
const coverImage = (p) => (p.images && p.images[0]) || (p.androidImages && p.androidImages[0]) || (p.linuxImages && p.linuxImages[0]) || null;

/** Lead Flagship Feature (#01) — Full-width 2-column broadsheet spread */
function LeadFeatureCard({ project, num }) {
    const img = coverImage(project);
    const tags = tagsOf(project);
    const metrics = project.metrics || [];

    return (
        <div className="proj-feature-lead py-6 md:py-8 border-b-2 border-ink/25">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

                {/* Left Column: Editorial Lead Story */}
                <div className="lg:col-span-7 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-3">
                        {/* Eyebrow Strip */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-ink/15">
                            <div className="flex items-center gap-2.5">
                                <span className="font-display font-bold text-xl text-accent leading-none tabular-nums">
                                    {num}
                                </span>
                                <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ background: dotColor(project) }}
                                />
                                <span className="font-mono text-[9.5px] tracking-[0.24em] uppercase font-bold text-ink">
                                    LEAD MONOGRAPH · {categoryOf(project)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {project.year && (
                                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-graphite">
                                        {project.year}
                                    </span>
                                )}
                                {project.status && (
                                    <span className="px-2 py-0.5 border border-accent/50 bg-accent/10 text-accent font-mono text-[8.5px] tracking-[0.2em] uppercase font-bold">
                                        ● {project.status}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                            <Link
                                to={`/project/${project.id}`}
                                data-cursor="Open Monograph"
                                className="group inline-block no-underline"
                            >
                                <h3 className="font-display font-bold text-3xl sm:text-4xl md:text-[2.75rem] text-ink group-hover:text-accent transition-colors leading-[0.98] tracking-tight">
                                    {project.title}
                                </h3>
                            </Link>
                            {project.subtitle && (
                                <div className="mt-1.5 font-mono text-xs tracking-[0.14em] uppercase text-graphite font-semibold">
                                    {project.subtitle}
                                </div>
                            )}
                        </div>

                        {/* Standfirst with Drop Cap */}
                        <p className="drop-cap font-serif text-sm sm:text-[15px] leading-relaxed text-ink/85 text-justify m-0 pt-1">
                            {project.description}
                        </p>

                        {/* Metrics Bar */}
                        {metrics.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-panel-deep/60 border border-ink/20 mt-1">
                                {metrics.map((m, idx) => (
                                    <div key={idx} className="flex flex-col gap-0.5 border-r last:border-r-0 border-ink/15 pr-2">
                                        <span className="font-mono text-[8.5px] tracking-[0.22em] uppercase text-graphite">
                                            {m.label}
                                        </span>
                                        <span className="font-mono text-xs font-bold text-ink truncate">
                                            {m.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Tags + Action Buttons */}
                    <div className="pt-3 border-t border-ink/15 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-1.5">
                            {tags.map((tag, i) => (
                                <span key={i} className="proj-tag">{tag}</span>
                            ))}
                        </div>

                        <div className="flex items-center gap-2.5">
                            {project.link && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-2 border border-ink/35 bg-panel hover:border-accent hover:text-accent font-mono text-[10px] tracking-[0.2em] uppercase font-semibold inline-flex items-center gap-1.5 transition-colors no-underline text-ink"
                                >
                                    <span>Live System</span>
                                    <ExternalLink size={12} />
                                </a>
                            )}
                            <Link
                                to={`/project/${project.id}`}
                                data-cursor="Open Monograph"
                                className="px-4 py-2 bg-ink text-panel hover:bg-accent hover:text-white font-mono text-[10px] tracking-[0.2em] uppercase font-bold inline-flex items-center gap-2 transition-colors no-underline"
                            >
                                <span>Inspect Dossier</span>
                                <ArrowUpRight size={13} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column: Specimen Plate / Architectural Blueprint */}
                <div className="lg:col-span-5 flex flex-col">
                    <Link
                        to={`/project/${project.id}`}
                        data-cursor="Inspect Plates"
                        className="group flex-1 flex flex-col justify-between border border-ink bg-ink text-panel p-4 relative overflow-hidden no-underline shadow-[6px_6px_0_rgba(0,0,0,0.1)]"
                    >
                        <div className="flex items-center justify-between border-b border-panel/20 pb-2.5 mb-3">
                            <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-accent-hot font-bold flex items-center gap-1.5">
                                <Cpu size={12} />
                                <span>SPECIMEN PLATE // {num}</span>
                            </span>
                            <span className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-panel/60">
                                {project.role}
                            </span>
                        </div>

                        {img ? (
                            <div className="relative overflow-hidden border border-panel/20 bg-[#0a0c10] my-auto">
                                <img
                                    src={img}
                                    alt={project.title}
                                    className="w-full h-48 sm:h-56 object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                                />
                                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 border border-white/20 font-mono text-[8px] tracking-[0.2em] uppercase text-white">
                                    FIG. {num}.1 — SYSTEM SNAPSHOT
                                </div>
                            </div>
                        ) : (
                            <div className="my-auto py-8 px-4 border border-panel/15 bg-black/30 font-mono text-xs space-y-2">
                                <div className="text-accent-hot font-bold uppercase tracking-widest text-[10px]">
                                    // ARCHITECTURAL SPECIFICATION
                                </div>
                                <div className="text-panel/80 text-[11px] leading-relaxed">
                                    MODULE: {project.id.toUpperCase()}<br />
                                    DOMAIN: {categoryOf(project).toUpperCase()}<br />
                                    STACK : {tags.join(' · ')}
                                </div>
                            </div>
                        )}

                        <div className="mt-3 pt-2.5 border-t border-panel/20 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] uppercase text-panel/75 group-hover:text-accent-hot transition-colors">
                            <span>OPEN TECHNICAL MONOGRAPH &amp; SCHEMATICS</span>
                            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}

/** Secondary Feature Card (#02 & #03) — 2-column broadsheet feature box */
function SecondaryFeatureCard({ project, num }) {
    const img = coverImage(project);
    const tags = tagsOf(project);
    const metrics = project.metrics || [];

    return (
        <Link
            to={`/project/${project.id}`}
            data-cursor="Read Monograph"
            className="proj-secondary group flex flex-col justify-between p-5 md:p-6 border border-ink/25 bg-panel hover:border-accent transition-all duration-300 relative overflow-hidden no-underline shadow-[4px_4px_0_rgba(0,0,0,0.05)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.1)]"
        >
            {/* Top accent hover bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            <div>
                {/* Meta header */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-ink/15">
                    <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-lg text-accent leading-none tabular-nums">
                            {num}
                        </span>
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: dotColor(project) }}
                        />
                        <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-graphite font-semibold">
                            {categoryOf(project)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {project.year && (
                            <span className="font-mono text-[8.5px] tracking-[0.18em] text-graphite uppercase">
                                {project.year}
                            </span>
                        )}
                        <ArrowUpRight
                            size={15}
                            className="text-graphite group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                    </div>
                </div>

                {/* Optional Specimen Thumbnail */}
                {img && (
                    <div className="mb-3.5 relative overflow-hidden border border-ink/20 bg-[#0d1117] h-36">
                        <img
                            src={img}
                            alt={project.title}
                            className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                        />
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-ink/85 text-panel font-mono text-[7.5px] tracking-[0.2em] uppercase">
                            PLATE {num}
                        </span>
                    </div>
                )}

                {/* Title & Subtitle */}
                <h3 className="font-display font-bold text-xl md:text-2xl text-ink group-hover:text-accent transition-colors leading-tight">
                    {project.title}
                </h3>
                {project.subtitle && (
                    <div className="mt-1 font-mono text-[9.5px] tracking-[0.15em] uppercase text-accent/90 font-semibold">
                        {project.subtitle}
                    </div>
                )}

                {/* Description */}
                <p className="mt-2.5 font-sans text-xs sm:text-[13px] text-graphite leading-relaxed line-clamp-3">
                    {project.description}
                </p>
            </div>

            <div className="mt-4 pt-3 border-t border-ink/15 space-y-2.5">
                {metrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 py-1.5 px-2.5 bg-panel-deep/55 border border-ink/10">
                        {metrics.slice(0, 3).map((m, idx) => (
                            <div key={idx} className="flex flex-col min-w-0">
                                <span className="font-mono text-[7.5px] tracking-[0.18em] uppercase text-graphite truncate">
                                    {m.label}
                                </span>
                                <span className="font-mono text-[9.5px] font-bold text-ink truncate">
                                    {m.value}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                    {tags.slice(0, 5).map((tag, i) => (
                        <span key={i} className="proj-tag">{tag}</span>
                    ))}
                </div>
            </div>
        </Link>
    );
}

/** Regular Archival Ledger Row (#04+) */
function ProjectRow({ project, num }) {
    const tags = tagsOf(project);
    const primaryMetric = project.metrics && project.metrics[0];

    return (
        <Link
            to={`/project/${project.id}`}
            data-cursor="Open Dossier"
            className="block group no-underline"
        >
            <article className="proj-row px-2 sm:px-3">
                <span className="proj-row__num font-bold text-accent">{num}</span>

                <span
                    className="proj-row__dot"
                    style={{ background: dotColor(project) }}
                    title={categoryOf(project)}
                />

                <div className="proj-row__main">
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                        <span className="proj-row__title">{project.title}</span>
                        {project.subtitle && (
                            <span className="hidden md:inline font-mono text-[9px] tracking-[0.14em] uppercase text-graphite">
                                — {project.subtitle}
                            </span>
                        )}
                        {project.year && (
                            <span className="font-mono text-[8.5px] tracking-[0.18em] uppercase text-graphite/70 ml-auto sm:ml-0">
                                [{project.year}]
                            </span>
                        )}
                    </div>
                    <span className="proj-row__desc">{project.description}</span>
                </div>

                <div className="proj-row__tags">
                    {primaryMetric && (
                        <span className="hidden xl:inline-block px-2 py-0.5 font-mono text-[8.5px] tracking-[0.14em] uppercase bg-accent/10 border border-accent/30 text-accent font-semibold mr-1">
                            {primaryMetric.value}
                        </span>
                    )}
                    {tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="proj-tag">{tag}</span>
                    ))}
                </div>

                <ArrowUpRight
                    size={15}
                    className="proj-row__arrow"
                    aria-hidden="true"
                />
            </article>
        </Link>
    );
}

export default function ProjectsOverlay({ projects = [], isFiltered = false, children }) {
    const containerRef = usePageReveal({
        selector: '.proj-feature-lead, .proj-secondary, .proj-row',
        y: 20,
        scale: 1,
        stagger: 0.05,
    });

    const [showAll, setShowAll] = useState(false);
    const DISPLAY_LIMIT = 9;
    const shouldLimit = !isFiltered && projects.length > DISPLAY_LIMIT;
    const shown       = shouldLimit && !showAll ? projects.slice(0, DISPLAY_LIMIT) : projects;

    if (!shown.length) {
        return (
            <section id="projects" className="proj-shell">
                {children}
                <div className="proj-empty">
                    <span className="proj-empty__label">— No dispatches match your filter criteria —</span>
                </div>
            </section>
        );
    }

    const featured = shown[0];
    const secondary = !isFiltered && shown.length >= 3 ? shown.slice(1, 3) : [];
    const rest = !isFiltered && shown.length >= 3 ? shown.slice(3) : shown.slice(1);
    const restStartIndex = !isFiltered && shown.length >= 3 ? 4 : 2;

    return (
        <section id="projects" ref={containerRef} className="proj-shell">

            {children}

            {/* ── Rule ───────────────────────── */}
            <div className="proj-rule" aria-hidden="true" />

            {/* ── Lead Flagship Monograph (#01) ── */}
            <LeadFeatureCard project={featured} num={pad(1)} />

            {/* ── Secondary Feature Pair (#02 & #03) ── */}
            {secondary.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 pb-2">
                    {secondary.map((p, i) => (
                        <SecondaryFeatureCard key={p.id} project={p} num={pad(i + 2)} />
                    ))}
                </div>
            )}

            {/* ── Divider ────────────────────── */}
            {rest.length > 0 && (
                <div className="proj-divider">
                    <span className="proj-divider__label">
                        Archival System Dispatches ({rest.length} {shouldLimit && !showAll ? `of ${projects.length - 3}` : 'indexed'})
                    </span>
                </div>
            )}

            {/* ── Row list ───────────────────── */}
            {rest.length > 0 && (
                <div className="proj-list">
                    {rest.map((p, i) => (
                        <ProjectRow key={p.id} project={p} num={pad(restStartIndex + i)} />
                    ))}
                </div>
            )}

            {/* ── Show more ──────────────────── */}
            {shouldLimit && (
                <button
                    onClick={() => setShowAll((v) => !v)}
                    className="proj-more"
                >
                    {showAll
                        ? '[ − ] Condense Archival Index'
                        : `[ + ] Expand All ${projects.length} System Monographs`}
                </button>
            )}
        </section>
    );
}
