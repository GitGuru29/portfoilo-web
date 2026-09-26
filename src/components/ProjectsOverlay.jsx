import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import usePageReveal from '../utils/usePageReveal';

const CATEGORY_LABELS = {
    'android-sys': 'Android Systems',
    'linux-sys':   'Linux Systems',
    'os-dev':      'OS / Compiler',
    'ai':          'AI / Quantitative',
    'cyber-sec':   'Cyber Security',
    'web':         'Web',
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
const dotColor   = (p) => CATEGORY_DOTS[p.categoryId] || 'var(--color-graphite)';
const tagsOf     = (p) => p.role.split(' / ').slice(0, 4).map((t) => t.trim());

/** Featured card — top of the list. */
function FeaturedCard({ project, num }) {
    return (
        <Link
            to={`/project/${project.id}`}
            data-cursor="Open Project"
            className="block group"
        >
            <article className="proj-featured">
                {/* Left: meta column */}
                <div className="proj-featured__meta">
                    <span className="proj-featured__index">{num}</span>
                    <span
                        className="proj-featured__dot"
                        style={{ background: dotColor(project) }}
                    />
                    <span className="proj-featured__cat">{categoryOf(project)}</span>
                </div>

                {/* Centre: title + body */}
                <div className="proj-featured__body">
                    <h3 className="proj-featured__title">{project.title}</h3>
                    <p  className="proj-featured__desc">{project.description}</p>
                    <div className="proj-featured__tags">
                        {tagsOf(project).map((tag, i) => (
                            <span key={i} className="proj-tag">{tag}</span>
                        ))}
                    </div>
                </div>

                {/* Right: arrow */}
                <div className="proj-featured__arrow">
                    <ArrowUpRight
                        size={18}
                        className="proj-featured__arrow-icon"
                        aria-hidden="true"
                    />
                </div>
            </article>
        </Link>
    );
}

/** Regular row card */
function ProjectRow({ project, num }) {
    return (
        <Link
            to={`/project/${project.id}`}
            data-cursor="Open Project"
            className="block group"
        >
            <article className="proj-row">
                <span className="proj-row__num">{num}</span>

                <span
                    className="proj-row__dot"
                    style={{ background: dotColor(project) }}
                />

                <div className="proj-row__main">
                    <span className="proj-row__title">{project.title}</span>
                    <span className="proj-row__desc">{project.description}</span>
                </div>

                <div className="proj-row__tags">
                    {tagsOf(project).map((tag, i) => (
                        <span key={i} className="proj-tag">{tag}</span>
                    ))}
                </div>

                <ArrowUpRight
                    size={14}
                    className="proj-row__arrow"
                    aria-hidden="true"
                />
            </article>
        </Link>
    );
}

export default function ProjectsOverlay({ projects = [], isFiltered = false, children }) {
    const containerRef = usePageReveal({
        selector: '.proj-featured, .proj-row',
        y: 20,
        scale: 1,
        stagger: 0.05,
    });

    const [showAll, setShowAll] = useState(false);
    const DISPLAY_LIMIT = 7;
    const shouldLimit = !isFiltered && projects.length > DISPLAY_LIMIT;
    const shown       = shouldLimit && !showAll ? projects.slice(0, DISPLAY_LIMIT) : projects;

    if (!shown.length) {
        return (
            <section id="projects" className="proj-shell">
                {children}
                <div className="proj-empty">
                    <span className="proj-empty__label">— No dispatches match —</span>
                </div>
            </section>
        );
    }

    const [featured, ...rest] = shown;

    return (
        <section id="projects" ref={containerRef} className="proj-shell">

            {children}

            {/* ── Rule ───────────────────────── */}
            <div className="proj-rule" aria-hidden="true" />

            {/* ── Featured ───────────────────── */}
            <FeaturedCard project={featured} num={pad(1)} />

            {/* ── Divider ────────────────────── */}
            {rest.length > 0 && (
                <div className="proj-divider">
                    <span className="proj-divider__label">Further dispatches</span>
                </div>
            )}

            {/* ── Row list ───────────────────── */}
            {rest.length > 0 && (
                <div className="proj-list">
                    {rest.map((p, i) => (
                        <ProjectRow key={p.id} project={p} num={pad(i + 2)} />
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
                        ? '[ − ] Condense'
                        : `[ + ] All ${projects.length} dispatches`}
                </button>
            )}
        </section>
    );
}
