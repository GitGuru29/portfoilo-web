import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const labelRef = useRef(null);
    const pos = useRef({ x: -100, y: -100 });
    const ring = useRef({ x: -100, y: -100 });
    const raf = useRef(null);
    const [label, setLabel] = useState('');

    useEffect(() => {
        const onMove = (e) => {
            pos.current = { x: e.clientX, y: e.clientY };
        };

        const onEnterInteractive = (e) => {
            dotRef.current?.classList.add('cursor--hover');
            ringRef.current?.classList.add('cursor--hover');
            // Pick up data-cursor label if exists
            const lbl = e.target.closest('[data-cursor]')?.getAttribute('data-cursor');
            if (lbl) setLabel(lbl);
        };

        const onLeaveInteractive = () => {
            dotRef.current?.classList.remove('cursor--hover');
            ringRef.current?.classList.remove('cursor--hover');
            setLabel('');
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

        const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select, label, [tabindex], [data-cursor]');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', onEnterInteractive);
            el.addEventListener('mouseleave', onLeaveInteractive);
        });

        const tick = () => {
            // Dot snaps immediately
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
            }
            // Ring lerps with spring-like lag
            ring.current.x += (pos.current.x - ring.current.x) * 0.1;
            ring.current.y += (pos.current.y - ring.current.y) * 0.1;
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
            }
            // Label follows ring
            if (labelRef.current) {
                labelRef.current.style.transform = `translate(${ring.current.x + 22}px, ${ring.current.y - 14}px)`;
            }
            raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            interactives.forEach(el => {
                el.removeEventListener('mouseenter', onEnterInteractive);
                el.removeEventListener('mouseleave', onLeaveInteractive);
            });
            cancelAnimationFrame(raf.current);
        };
    }, []);

    return (
        <>
            {/* Outer ring */}
            <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
            {/* Inner dot */}
            <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
            {/* Floating label (shown when data-cursor attribute is present) */}
            {label && (
                <div
                    ref={labelRef}
                    className="fixed top-0 left-0 z-[999997] pointer-events-none text-[9px] font-space tracking-[0.2em] uppercase text-[var(--color-geyser)]/60 bg-[var(--color-quantum-black)]/80 border border-[var(--color-geyser)]/10 px-2 py-1 whitespace-nowrap"
                    style={{ willChange: 'transform' }}
                    aria-hidden="true"
                >
                    {label}
                </div>
            )}
        </>
    );
}
