/**
 * Anchor navigation for the folio.
 *
 * Sheets live in normal document flow, so every in-page jump is just a
 * smooth scroll. Lenis is used when it is mounted, with a native fallback
 * so navigation still works before (or without) the smooth-scroll wrapper.
 *
 * The app routes with HashRouter, so real `#id` anchors would be swallowed
 * by the router. Use `anchorToSection` on links to keep the URL untouched.
 */

const NAV_OFFSET = -72;

/**
 * Scroll a sheet into view.
 * @param {string} id - Element id of the target sheet.
 * @param {object} [options]
 * @param {number} [options.offset] - Px offset; negative clears the fixed nav.
 * @param {number} [options.duration] - Lenis tween duration in seconds.
 * @param {string} [options.behavior] - Native scroll behavior fallback.
 */
export function scrollToSection(
    id,
    { offset = NAV_OFFSET, duration = 1.2, behavior = 'smooth' } = {}
) {
    if (!id || typeof document === 'undefined') return;
    const el = document.getElementById(id);
    if (!el) return;

    if (window.lenis) {
        window.lenis.scrollTo(el, { offset, duration });
        return;
    }

    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: Math.max(0, top), behavior });
}

/**
 * onClick handler that scrolls instead of following the href.
 * @param {string} id - Element id of the target sheet.
 * @param {object} [options] - Forwarded to scrollToSection.
 * @returns {(event: import('react').MouseEvent) => void}
 */
export function anchorToSection(id, options) {
    return (event) => {
        event.preventDefault();
        scrollToSection(id, options);
    };
}

export default scrollToSection;