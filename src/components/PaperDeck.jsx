import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import useStore from '../store/useStore';
import { playPaperTurnSound } from '../utils/soundFX';

/**
 * PaperDeck — Authentic 3D Broadsheet Newspaper Page-Turn System.
 *
 * Each child is a <PaperPage> (one broadsheet spread).
 * Pages are stacked in 3D space:
 *   • Turning forward (page k -> k+1): The current page curls and lifts
 *     from the right edge, folding in 3D around the left spine over to
 *     the left, revealing the next page directly beneath it.
 *   • Turning backward (page k -> k-1): The previous page unfolds from
 *     the left back over onto the stack.
 *
 * Navigation inputs supported seamlessly:
 *   1. Mouse wheel / Trackpad:
 *      - If the active page body is scrollable, scrolls internal content first.
 *      - Once reaching the boundary (or if the page fits in 1 screen),
 *        scrolling turns to the next / previous newspaper page.
 *   2. Touch swipe (left = next page, right = prev page).
 *   3. Keyboard (Arrow Right / Arrow Down / Page Down = next, Arrow Left / Up = prev).
 *   4. Folio buttons: "Turn to Folio XX →" right in the newspaper footer.
 *   5. Chapter rail dots (SectionDotsNav) and anchor links (#projects).
 */
export default function PaperDeck({ children }) {
    const rootRef = useRef(null);
    const stackRef = useRef(null);
    const creaseRef = useRef(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const activeIdxRef = useRef(0);
    const isTurningRef = useRef(false);
    const pagesRef = useRef([]);

    const soundEnabled = useStore((state) => state.soundEnabled);
    const pageCount = React.Children.count(children);

    useEffect(() => {
        const root = rootRef.current;
        const stack = stackRef.current;
        const crease = creaseRef.current;
        if (!root || !stack) return;

        const pages = Array.from(stack.querySelectorAll('[data-paper-page]'));
        pagesRef.current = pages;
        if (pages.length === 0) return;

        // Initialize pages: page 0 is active and visible; all others hidden
        pages.forEach((page, i) => {
            const isBare = page.classList.contains('paper-page--bare');
            const dType = isBare ? 'block' : 'grid';
            page.classList.toggle('is-active', i === activeIdxRef.current);
            if (i === activeIdxRef.current) {
                gsap.set(page, {
                    display: dType,
                    rotationY: 0,
                    xPercent: 0,
                    rotateZ: 0,
                    opacity: 1,
                    zIndex: 10,
                    transformOrigin: 'left center',
                    transformPerspective: 2400,
                });
            } else {
                gsap.set(page, {
                    display: 'none',
                    rotationY: 0,
                    xPercent: 0,
                    rotateZ: 0,
                    opacity: 0,
                    zIndex: 1,
                    transformOrigin: 'left center',
                    transformPerspective: 2400,
                });
            }
        });

        // Broadcast initial active chapter
        if (pages[0]) {
            window.dispatchEvent(
                new CustomEvent('paper-deck:change', {
                    detail: { index: 0, id: pages[0].id },
                })
            );
        }

        // ── Page Turn Engine ──────────────────────────────────────────
        const goToPage = (targetIdx) => {
            if (isTurningRef.current) return;
            if (targetIdx < 0 || targetIdx >= pages.length) return;
            if (targetIdx === activeIdxRef.current) return;

            const fromIdx = activeIdxRef.current;
            const toIdx = targetIdx;
            const isForward = toIdx > fromIdx;
            isTurningRef.current = true;

            const fromPage = pages[fromIdx];
            const toPage = pages[toIdx];
            const toShadow = toPage.querySelector('.paper-page__under-shadow');
            const fromShadow = fromPage.querySelector('.paper-page__under-shadow');

            playPaperTurnSound(soundEnabled);

            if (isForward) {
                // Prepare incoming page directly beneath
                const isToBare = toPage.classList.contains('paper-page--bare');
                gsap.set(toPage, {
                    display: isToBare ? 'block' : 'grid',
                    zIndex: 5,
                    opacity: 1,
                    rotationY: 0,
                    rotateZ: 0,
                    xPercent: 0,
                    transformOrigin: 'left center',
                    transformPerspective: 2400,
                });

                const toGrade = toPage.querySelector('.paper-page__grade');
                if (toGrade) {
                    gsap.fromTo(
                        toGrade,
                        { opacity: 0, scale: 1.06 },
                        { opacity: 1, scale: 1, duration: 1.05, ease: 'power2.out', overwrite: true }
                    );
                }

                if (toShadow) {
                    gsap.fromTo(
                        toShadow,
                        { opacity: 0.55 },
                        { opacity: 0, duration: 0.85, ease: 'power2.out' }
                    );
                }

                // Crease highlight sweep
                if (crease) {
                    gsap.fromTo(
                        crease,
                        { display: 'block', opacity: 0, x: window.innerWidth * 0.8 },
                        {
                            x: -20,
                            opacity: 0.75,
                            duration: 0.85,
                            ease: 'power2.inOut',
                            onComplete: () => {
                                gsap.set(crease, { display: 'none', opacity: 0 });
                            },
                        }
                    );
                }

                // Turn the outgoing page over to the left
                gsap.set(fromPage, {
                    zIndex: 20,
                    transformOrigin: 'left center',
                    transformPerspective: 2400,
                });

                gsap.to(fromPage, {
                    rotationY: -112,
                    rotateZ: -2.5,
                    xPercent: -8,
                    duration: 0.85,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        gsap.set(fromPage, {
                            display: 'none',
                            zIndex: 1,
                            rotationY: 0,
                            rotateZ: 0,
                            xPercent: 0,
                        });
                        gsap.set(toPage, { zIndex: 10 });
                        fromPage.classList.remove('is-active');
                        toPage.classList.add('is-active');
                        activeIdxRef.current = toIdx;
                        setActiveIdx(toIdx);
                        isTurningRef.current = false;
                        const body = toPage.querySelector('.paper-page__body');
                        if (body) body.scrollTop = 0;
                        window.dispatchEvent(
                            new CustomEvent('paper-deck:change', {
                                detail: { index: toIdx, id: toPage.id },
                            })
                        );
                    },
                });
            } else {
                // Turning backward (from left back onto stack)
                const isToBare = toPage.classList.contains('paper-page--bare');
                gsap.set(toPage, {
                    display: isToBare ? 'block' : 'grid',
                    zIndex: 20,
                    opacity: 1,
                    rotationY: -112,
                    rotateZ: -2.5,
                    xPercent: -8,
                    transformOrigin: 'left center',
                    transformPerspective: 2400,
                });
                gsap.set(fromPage, { zIndex: 5 });

                if (fromShadow) {
                    gsap.fromTo(
                        fromShadow,
                        { opacity: 0 },
                        {
                            opacity: 0.55,
                            duration: 0.45,
                            yoyo: true,
                            repeat: 1,
                            ease: 'power2.inOut',
                            onComplete: () => gsap.set(fromShadow, { opacity: 0 }),
                        }
                    );
                }

                // Crease highlight sweep reverse
                if (crease) {
                    gsap.fromTo(
                        crease,
                        { display: 'block', opacity: 0, x: -20 },
                        {
                            x: window.innerWidth * 0.8,
                            opacity: 0.75,
                            duration: 0.85,
                            ease: 'power2.inOut',
                            onComplete: () => {
                                gsap.set(crease, { display: 'none', opacity: 0 });
                            },
                        }
                    );
                }

                gsap.to(toPage, {
                    rotationY: 0,
                    rotateZ: 0,
                    xPercent: 0,
                    duration: 0.85,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        gsap.set(fromPage, { display: 'none', zIndex: 1 });
                        gsap.set(toPage, { zIndex: 10 });
                        fromPage.classList.remove('is-active');
                        toPage.classList.add('is-active');
                        activeIdxRef.current = toIdx;
                        setActiveIdx(toIdx);
                        isTurningRef.current = false;
                        const body = toPage.querySelector('.paper-page__body');
                        if (body) body.scrollTop = 0;
                        window.dispatchEvent(
                            new CustomEvent('paper-deck:change', {
                                detail: { index: toIdx, id: toPage.id },
                            })
                        );
                    },
                });
            }
        };

        // ── 1. Wheel / Trackpad Controller ────────────────────────────
        let wheelDeltaAcc = 0;
        let wheelTimeout = null;
        const WHEEL_THRESHOLD = 45;

        const onWheel = (e) => {
            if (isTurningRef.current) {
                e.preventDefault();
                return;
            }

            const activeEl = pages[activeIdxRef.current];
            const body = activeEl ? activeEl.querySelector('.paper-page__body') : null;

            if (body && body.scrollHeight > body.clientHeight + 8) {
                const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 6;
                const atTop = body.scrollTop <= 6;

                // Inside scrollable body: let native scroll handle it
                if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
                    wheelDeltaAcc = 0;
                    return;
                }
            }

            e.preventDefault();

            wheelDeltaAcc += e.deltaY;
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                wheelDeltaAcc = 0;
            }, 180);

            if (wheelDeltaAcc > WHEEL_THRESHOLD) {
                wheelDeltaAcc = 0;
                goToPage(activeIdxRef.current + 1);
            } else if (wheelDeltaAcc < -WHEEL_THRESHOLD) {
                wheelDeltaAcc = 0;
                goToPage(activeIdxRef.current - 1);
            }
        };

        root.addEventListener('wheel', onWheel, { passive: false });

        // ── 2. Touch Gestures (Swipe) ─────────────────────────────────
        let touchX = 0;
        let touchY = 0;

        const onTouchStart = (e) => {
            touchX = e.touches[0].clientX;
            touchY = e.touches[0].clientY;
        };

        const onTouchEnd = (e) => {
            if (isTurningRef.current) return;
            const dx = e.changedTouches[0].clientX - touchX;
            const dy = e.changedTouches[0].clientY - touchY;

            // Horizontal swipe has priority (swiping left turns page forward)
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 35) {
                if (dx < 0) goToPage(activeIdxRef.current + 1);
                else goToPage(activeIdxRef.current - 1);
                return;
            }

            // Vertical swipe at top/bottom boundary
            if (Math.abs(dy) > 45) {
                const activeEl = pages[activeIdxRef.current];
                const body = activeEl ? activeEl.querySelector('.paper-page__body') : null;
                if (body && body.scrollHeight > body.clientHeight + 8) {
                    const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 6;
                    const atTop = body.scrollTop <= 6;
                    if (dy < 0 && atBottom) goToPage(activeIdxRef.current + 1);
                    if (dy > 0 && atTop) goToPage(activeIdxRef.current - 1);
                } else {
                    if (dy < 0) goToPage(activeIdxRef.current + 1);
                    if (dy > 0) goToPage(activeIdxRef.current - 1);
                }
            }
        };

        root.addEventListener('touchstart', onTouchStart, { passive: true });
        root.addEventListener('touchend', onTouchEnd, { passive: true });

        // ── 3. Keyboard Navigation ────────────────────────────────────
        const onKeyDown = (e) => {
            if (e.target && ['input', 'textarea'].includes(e.target.tagName?.toLowerCase())) return;
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                goToPage(activeIdxRef.current + 1);
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                goToPage(activeIdxRef.current - 1);
            }
        };

        window.addEventListener('keydown', onKeyDown);

        // ── 4. Custom Events (SectionDotsNav, hash, in-page links) ──────
        const onGotoEvent = (e) => {
            if (!e.detail) return;
            const id = e.detail.id;
            const idx = pages.findIndex((p) => p.id === id);
            if (idx !== -1) {
                goToPage(idx);
            }
        };

        window.addEventListener('paper-deck:goto', onGotoEvent);

        const onHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (!hash) return;
            const idx = pages.findIndex((p) => p.id === hash);
            if (idx !== -1) {
                goToPage(idx);
            }
        };

        window.addEventListener('hashchange', onHashChange);

        return () => {
            root.removeEventListener('wheel', onWheel);
            root.removeEventListener('touchstart', onTouchStart);
            root.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('paper-deck:goto', onGotoEvent);
            window.removeEventListener('hashchange', onHashChange);
            clearTimeout(wheelTimeout);
        };
    }, [soundEnabled]);

    return (
        <main ref={rootRef} className="paper-deck">
            <div className="paper-deck__viewport">
                <div ref={stackRef} className="paper-deck__stack">
                    {React.Children.map(children, (child, idx) => {
                        if (!React.isValidElement(child)) return child;
                        return React.cloneElement(child, {
                            pageIndex: idx,
                            isCurrent: idx === activeIdx,
                            hasNext: idx < pageCount - 1,
                            hasPrev: idx > 0,
                            onNextPage: () => {
                                window.dispatchEvent(
                                    new CustomEvent('paper-deck:goto', {
                                        detail: { id: pagesRef.current[idx + 1]?.id },
                                    })
                                );
                            },
                            onPrevPage: () => {
                                window.dispatchEvent(
                                    new CustomEvent('paper-deck:goto', {
                                        detail: { id: pagesRef.current[idx - 1]?.id },
                                    })
                                );
                            },
                        });
                    })}
                </div>

                {/* 3D Fold Crease Highlight Line */}
                <div ref={creaseRef} className="paper-deck__fold-line" aria-hidden="true" />

                {/* Seam Shading at Viewport Edges */}
                <div className="paper-deck__shade paper-deck__shade--l" aria-hidden="true" />
                <div className="paper-deck__shade paper-deck__shade--r" aria-hidden="true" />
            </div>
        </main>
    );
}

/**
 * PaperPage — one full-screen spread of the newspaper.
 */
export function PaperPage({
    id,
    chapter = '01',
    title = '',
    kicker = '',
    lede = '',
    watermark = '',
    bare = false,
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
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    overflow: 'hidden',
                }}
            >
                <div className="paper-page__grade" aria-hidden="true" />
                <div className="paper-page__band" aria-hidden="true" />
                <div className="paper-page__under-shadow" aria-hidden="true" />
                <div
                    className="paper-page__body paper-page__body--center"
                    data-lenis-prevent
                    data-lenis-prevent-touch
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'block',
                        overflowY: 'auto',
                    }}
                >
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
            className={`paper-page ${className}`}
        >
            <div className="paper-page__grade" aria-hidden="true" />
            <div className="paper-page__band" aria-hidden="true" />

            {/* Under-shadow cast by page turning above this sheet */}
            <div className="paper-page__under-shadow" aria-hidden="true" />

            {watermark && (
                <span className="paper-page__watermark" aria-hidden="true">
                    {watermark}
                </span>
            )}

            <header className="paper-page__header">
                <div className="noise-bg absolute inset-0 opacity-40 pointer-events-none" />
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
            </header>

            <div className="paper-page__body" data-lenis-prevent data-lenis-prevent-touch>
                <div className="paper-page__content">{children}</div>
            </div>

            <footer className="paper-page__folio">
                <div className="flex items-center gap-3">
                    {hasPrev && (
                        <button
                            type="button"
                            onClick={onPrevPage}
                            className="meta-tag hover:text-accent flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
                            aria-label={`Turn back to folio ${prevFolioNum}`}
                        >
                            <span className="text-accent">←</span> Turn to folio {prevFolioNum}
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
                            aria-label={`Turn forward to folio ${nextFolioNum}`}
                        >
                            Turn to folio {nextFolioNum} <span className="text-accent">→</span>
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