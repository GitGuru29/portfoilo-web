import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Reveal-on-enter for the folio.
 *
 * Sheets scroll with the document, so reveals are observed against the
 * viewport: content set to opacity 0 animates in as the reader reaches it,
 * once. Elements are tagged with `data-page-revealed` so a reveal is never
 * replayed.
 *
 * @param {object} options
 * @param {string} [options.selector] - Child selector to reveal. Defaults to the container.
 * @param {number} [options.y] - Start offset in px.
 * @param {number} [options.scale] - Start scale.
 * @param {number} [options.duration] - Tween duration per element.
 * @param {number} [options.stagger] - Delay between elements.
 * @param {number} [options.threshold] - Fraction visible before revealing.
 * @param {string} [options.margin] - Root margin, px.
 * @param {string} [options.ease] - GSAP ease.
 * @returns {React.RefObject} Ref to attach to the container element.
 */
export default function usePageReveal({
    selector,
    y = 40,
    scale = 0.98,
    duration = 1,
    stagger = 0.12,
    threshold = 0.12,
    margin = 0,
    ease = 'power3.out',
} = {}) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const targets = selector
            ? Array.from(container.querySelectorAll(selector))
            : [container];

        if (targets.length === 0) return;

        const play = (elements) => {
            if (!elements || elements.length === 0) return;
            gsap.killTweensOf(elements);
            gsap.fromTo(
                elements,
                { opacity: 0, y, scale, force3D: true },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration,
                    stagger,
                    ease,
                    overwrite: true,
                    force3D: true,
                }
            );
        };

        const onEnter = (entries) => {
            const entering = entries
                .filter((entry) => entry.isIntersecting)
                .map((entry) => entry.target);

            if (entering.length === 0) return;

            if (!selector) {
                play(entering);
                return;
            }

            const pending = entering.filter((el) => !el.dataset.pageRevealed);
            if (pending.length === 0) return;
            pending.forEach((el) => {
                el.dataset.pageRevealed = 'true';
            });
            play(pending);
        };

        const observer = new IntersectionObserver(onEnter, {
            root: null,
            rootMargin: `${margin}px`,
            threshold,
        });

        targets.forEach((el) => observer.observe(el));

        // Anything already on screen at mount reveals immediately.
        const raf = requestAnimationFrame(() => {
            const visible = targets.filter((el) => {
                if (el.dataset.pageRevealed) return false;
                const r = el.getBoundingClientRect();
                return r.top < window.innerHeight && r.bottom > 0;
            });
            if (visible.length === 0) return;
            visible.forEach((el) => {
                el.dataset.pageRevealed = 'true';
            });
            play(visible);
        });

        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
            gsap.killTweensOf(targets);
        };
    }, [selector, y, scale, duration, stagger, threshold, margin, ease]);

    return containerRef;
}
