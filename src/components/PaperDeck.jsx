import React, { useEffect, useRef } from 'react';
import { scrollToSection } from '../utils/scrollToSection';

/**
 * PaperDeck — the folio as a continuous run of broadsheet sheets.
 *
 * Every child is a <PaperPage>. Sheets are stacked vertically in normal
 * document flow and scroll like any web page: no page-turning, no swipe
 * gestures, no wheel interception. Each sheet is at least one viewport
 * tall and grows with its own content, so long chapters simply run on.
 *
 * Navigation inputs:
 *   1. Normal document scroll (Lenis smooth scroll).
 *   2. Folio buttons in the newspaper footer ("Turn to folio XX →").
 *   3. Chapter rail dots (SectionDotsNav), the top nav, the footer links,
 *      the command palette and in-page anchor links — all routed through
 *      scrollToSection.
 */
export default function PaperDeck({ children }) {
    const stackRef = useRef(null);
    const pageIds = React.Children.toArray(children)
        .map((child) => (React.isValidElement(child) ? child.props.id : null))
        .filter(Boolean);

    // Legacy event hook: anything still dispatching `paper-deck:goto`
    // gets the same smooth scroll.
    useEffect(() => {
        const onGoto = (event) => {
            if (event.detail && event.detail.id) scrollToSection(event.detail.id);
        };
        window.addEventListener('paper-deck:goto', onGoto);
        return () => window.removeEventListener('paper-deck:goto', onGoto);
    }, []);

    return (
        <main id="folio" className="paper-deck">
            <div className="paper-deck__viewport">
                <div ref={stackRef} className="paper-deck__stack">
                    {React.Children.map(children, (child, idx) => {
                        if (!React.isValidElement(child)) return child;
                        return React.cloneElement(child, {
                            pageIndex: idx,
                            isCurrent: true,
                            hasNext: idx < pageIds.length - 1,
                            hasPrev: idx > 0,
                            onNextPage: () => scrollToSection(pageIds[idx + 1]),
                            onPrevPage: () => scrollToSection(pageIds[idx - 1]),
                        });
                    })}
                </div>
            </div>
        </main>
    );
}

/**
 * PaperPage — one sheet of the newspaper.
 */
export function PaperPage({
    id,
    chapter = '01',
    title = '',
    kicker = '',
    lede = '',
    watermark = '',
    bare = false,
    variant = 'poster',
    banner = null,
    className = '',
    children,
    pageIndex = 0,
    hasNext = false,
    hasPrev = false,
    onNextPage,
    onPrevPage,
}) {
    if (bare) {
        return (
            <article
                id={id}
                data-paper-page
                data-chapter={chapter}
                className={`paper-page paper-page--bare ${className}`}
            >
                <div className="paper-page__grade" aria-hidden="true" />
                <div className="paper-page__band" aria-hidden="true" />
                {/* No inner scroll box: the front page scrolls with the
                    document like every other sheet. */}
                <div className="paper-page__body paper-page__body--center">
                    {children}
                </div>
            </article>
        );
    }

    const nextFolioNum = String(parseInt(chapter, 10) + 1).padStart(2, '0');
    const prevFolioNum = String(Math.max(0, parseInt(chapter, 10) - 1)).padStart(2, '0');

    return (
        <article
            id={id}
            data-paper-page
            data-chapter={chapter}
            className={`paper-page ${banner ? 'paper-page--banner' : ''} ${className}`}
        >
            {/* Narrative banner — leads the page above the nameplate */}
            {banner && (
                <div className="broadsheet__banner">
                    <h1 className="broadsheet__banner-head">{banner.headline}</h1>
                    {banner.deck && <p className="broadsheet__banner-deck">{banner.deck}</p>}
                </div>
            )}

            <div className="paper-page__grade" aria-hidden="true" />
            <div className="paper-page__band" aria-hidden="true" />

            {watermark && (
                <span className="paper-page__watermark" aria-hidden="true">
                    {watermark}
                </span>
            )}

            <header className={`paper-page__header ${variant === 'broadsheet' ? 'paper-page__header--strip' : ''}`}>
                <div className="noise-bg absolute inset-0 opacity-40 pointer-events-none" />
                {variant === 'broadsheet' ? (
                    <div className="relative z-10 mx-auto w-full max-w-[78rem]">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="meta-tag text-accent">[ {chapter} ]</span>
                            <span className="broadsheet__nameplate">{title}</span>
                            <span className="h-px flex-1 min-w-[2rem] bg-ink/15" />
                            {lede && <span className="broadsheet__deck">{lede}</span>}
                            <span className="stamp">{kicker ? `verified ${kicker}` : 'verified page'}</span>
                        </div>
                    </div>
                ) : (
                <div className="relative z-10 mx-auto w-full max-w-[78rem] px-6 pt-6 pb-5">
                    <div className="mb-3 flex items-center gap-4">
                        <span className="meta-tag text-accent">[ {chapter} ]</span>
                        <span className="h-px w-14 md:w-24 bg-gradient-to-r from-accent to-transparent" />
                        {kicker && <span className="meta-tag text-cyanx truncate">{kicker}</span>}
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                        <h2 className="poster-title text-balance max-w-2xl">{title}</h2>
                        {lede && (
                            <p className="max-w-md text-sm md:text-right md:pb-1 font-mono leading-relaxed text-graphite font-light text-pretty">
                                {lede}
                            </p>
                        )}
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <span className="h-px flex-1 bg-ink/15" />
                        <span className="stamp">{kicker ? `verified ${kicker}` : 'verified page'}</span>
                        <span className="h-px flex-1 bg-ink/15" />
                    </div>
                </div>
                )}
            </header>

            <div className="paper-page__body">
                <div className="paper-page__content">{children}</div>
            </div>

            <footer className="paper-page__folio">
                <div className="flex items-center gap-3">
                    {hasPrev && (
                        <button
                            type="button"
                            onClick={onPrevPage}
                            className="meta-tag hover:text-accent flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
                            aria-label={`Go back to folio ${prevFolioNum}`}
                        >
                            <span className="text-accent">←</span> Back to folio {prevFolioNum}
                        </button>
                    )}
                    <span className="meta-tag hidden sm:inline text-graphite/80">The Daily Developer · Vol. 2026</span>
                </div>

                <span className="meta-tag text-accent font-semibold">
                    folio {chapter} — {title}
                </span>

                <div className="flex items-center gap-3">
                    <span className="meta-tag hidden sm:inline text-graphite/80">sheet {folioNumber(chapter)}</span>
                    {hasNext && (
                        <button
                            type="button"
                            onClick={onNextPage}
                            className="meta-tag hover:text-accent flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
                            aria-label={`Continue to folio ${nextFolioNum}`}
                        >
                            Continue to folio {nextFolioNum} <span className="text-accent">→</span>
                        </button>
                    )}
                </div>
            </footer>
        </article>
    );
}

function folioNumber(chapter = '') {
    const n = parseInt(chapter, 10) + 1;
    return Number.isNaN(n) ? '—' : String(n).padStart(2, '0');
}