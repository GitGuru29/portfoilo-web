import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const SECTIONS = [
    { id: 'hero', label: 'Hero' },
    { id: 'projects', label: 'Projects' },
    { id: 'timeline', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'github', label: 'GitHub Activity' },
    { id: 'research', label: 'Research' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'badges', label: 'Badges' },
    { id: 'testimonials', label: 'References' },
    { id: 'contact', label: 'Contact' },
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

        SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        const targetEl = document.getElementById(id);
        if (!targetEl) return;

        if (window.lenis) {
            window.lenis.scrollTo(targetEl, { offset: -20 });
        } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <aside
            aria-label="Section Navigation"
            className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-[99995] hidden lg:flex flex-col items-center gap-3.5 py-4 px-2 rounded-full bg-[#0F1E36]/90 border border-sky-400/35 shadow-[0_8px_32px_rgba(56,189,248,0.25)] backdrop-blur-xl transition-all duration-300"
        >
            {SECTIONS.map(({ id, label }, index) => {
                const isActive = activeSection === id;
                return (
                    <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className="group relative flex items-center justify-center p-1.5 focus:outline-none cursor-pointer"
                        aria-label={`Scroll to section ${label}`}
                    >
                        {/* Tooltip on hover */}
                        <span className="absolute right-9 px-3 py-1 text-[11px] font-space tracking-widest text-sky-100 bg-[#0B1528]/95 border border-sky-400/30 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl">
                            <span className="text-[#D4AF37] font-mono mr-1.5">0{index + 1}.</span>
                            {label}
                        </span>

                        {/* Dot indicator */}
                        <span
                            className={`block rounded-full transition-all duration-300 ${
                                isActive
                                    ? 'w-3 h-3 bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.9)] scale-110'
                                    : 'w-2 h-2 bg-sky-200/50 group-hover:bg-sky-100 hover:scale-125'
                            }`}
                        />
                    </button>
                );
            })}
        </aside>,
        document.body
    );
}


