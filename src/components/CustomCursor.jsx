import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const labelRef = useRef(null);
    const pos = useRef({ x: -100, y: -100 });
    const ring = useRef({ x: -100, y: -100 });
    const raf = useRef(null);
    const [label, setLabel] = useState('');
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
            setIsTouchDevice(true);
            return;
        }

        const onMove = (e) => {
            pos.current = { x: e.clientX, y: e.clientY };
        };

        // Event delegation for dynamic elements in React Portals & Modals
        const onMouseOver = (e) => {
            const target = e.target.closest('a, button, [role="button"], input, textarea, select, label, [tabindex], [data-cursor]');
            if (target) {
                dotRef.current?.classList.add('cursor--hover');
                ringRef.current?.classList.add('cursor--hover');
                const lbl = target.getAttribute('data-cursor');
                if (lbl) setLabel(lbl);
            } else {
                dotRef.current?.classList.remove('cursor--hover');
                ringRef.current?.classList.remove('cursor--hover');
                setLabel('');
            }
        };

        const onMouseDown = () => {
            if (ringRef.current) {
                ringRef.current.style.transform = ringRef.current.style.transform.replace(/scale\([^)]*\)/, '') + ' scale(0.88)';
            }
        };
        const onMouseUp = () => {
            if (ringRef.current) {
                ringRef.current.style.transform = ringRef.current.style.transform.replace(/scale\([^)]*\)/, '');
            }
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mouseover', onMouseOver);

        const tick = () => {
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
            }

            ring.current.x += (pos.current.x - ring.current.x) * 0.15;
            ring.current.y += (pos.current.y - ring.current.y) * 0.15;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
            }

            if (labelRef.current) {
                labelRef.current.style.transform = `translate3d(${pos.current.x + 16}px, ${pos.current.y + 16}px, 0)`;
            }

            raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mouseover', onMouseOver);
            cancelAnimationFrame(raf.current);
        };
    }, []);

    if (isTouchDevice) return null;

    return (
        <>
            {/* Outer ring */}
            <div ref={ringRef} className="cursor-ring" aria-hidden="true" style={{ zIndex: 9999999 }} />
            {/* Inner dot */}
            <div ref={dotRef} className="cursor-dot" aria-hidden="true" style={{ zIndex: 9999999 }} />
            {/* Floating label */}
            {label && (
                <div
                    ref={labelRef}
                    className="fixed top-0 left-0 z-[9999999] pointer-events-none text-[9px] font-space tracking-[0.2em] uppercase text-[var(--color-geyser)]/60 bg-[var(--color-quantum-black)]/80 border border-[var(--color-geyser)]/10 px-2 py-1 whitespace-nowrap"
                    style={{ willChange: 'transform' }}
                    aria-hidden="true"
                >
                    {label}
                </div>
            )}
        </>
    );
}
