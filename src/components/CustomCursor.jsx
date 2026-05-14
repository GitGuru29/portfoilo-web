import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const ring = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const raf = useRef(null);

    useEffect(() => {
        const onMove = (e) => {
            pos.current = { x: e.clientX, y: e.clientY };
        };

        const onEnterInteractive = () => {
            dotRef.current?.classList.add('cursor--hover');
            ringRef.current?.classList.add('cursor--hover');
        };
        const onLeaveInteractive = () => {
            dotRef.current?.classList.remove('cursor--hover');
            ringRef.current?.classList.remove('cursor--hover');
        };

        window.addEventListener('mousemove', onMove);

        // Detect hover on interactive elements
        const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select, label, [tabindex]');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', onEnterInteractive);
            el.addEventListener('mouseleave', onLeaveInteractive);
        });

        const tick = () => {
            // Dot snaps immediately
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
            }
            // Ring lerps behind
            ring.current.x += (pos.current.x - ring.current.x) * 0.12;
            ring.current.y += (pos.current.y - ring.current.y) * 0.12;
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
            }
            raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', onMove);
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
        </>
    );
}
