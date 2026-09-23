import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const CHAPTERS = [
    { id: 'hero', num: '00', label: 'Home' },
    { id: 'projects', num: '01', label: 'Projects' },
    { id: 'timeline', num: '02', label: 'Experience' },
    { id: 'skills', num: '03', label: 'Skills' },
    { id: 'github', num: '04', label: 'GitHub' },
    { id: 'research', num: '05', label: 'Research' },
    { id: 'recognition', num: '06', label: 'Credentials' },
    { id: 'testimonials', num: '07', label: 'Testimonials' },
    { id: 'contact', num: '08', label: 'Contact' },
];

export default function SectionDotsNav() {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0.1,
        };

        const handleIntersect = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        CHAPTERS.forEach(({ id }) => {
            const el = document.getElementById(id);
            // "recognition" is a container spanning badges + certificates
            if (id === 'recognition') {
                const children = ['certificates', 'badges'];
                children.forEach((cid) => {
                    const cel = document.getElementById(cid);
                    if (cel) observer.observe(cel);
                });
                return;
            }
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Map active section back to a chapter
    const activeChapter = (() => {
        if (activeSection === 'certificates' || activeSection === 'badges') return 'recognition';
        return activeSection;
    })();

    const scrollToSection = (id) => {
        const targetEl = id === 'recognition' ? document.getElementById('certificates') : document.getElementById(id);
        if (!targetEl) return;

        if (window.lenis) {
            window.lenis.scrollTo(targetEl, { offset: -20 });
        } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <aside aria-label="Chapter Navigation" className="chapter-rail">
            {CHAPTERS.map(({ id, num, label }, index) => {
                const isActive = activeChapter === id;
                return (
                    <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className="chapter-rail__dot group focus:outline-none cursor-pointer"
                        style={isActive ? { borderColor: 'transparent' } : undefined}
                        aria-label={`Chapter ${num} — ${label}`}
                    >
                        <span className="chapter-rail__tip">
                            <span className="text-accent font-mono mr-1.5">{num}.</span>
                            {label}
                        </span>
                        <span
                            className={`block transition-all duration-300 ${
                                isActive
                                    ? 'w-2 h-2 bg-accent skew-x-[-12deg] shadow-[0_0_8px_rgba(185,28,28,0.5)]'
                                    : 'w-1.5 h-1.5 bg-graphite/70 group-hover:bg-ink group-hover:scale-125'
                            }`}
                        />
                    </button>
                );
            })}
        </aside>,
        document.body
    );
}