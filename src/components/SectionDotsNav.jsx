import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const CHAPTERS = [
    { id: 'hero', num: '00', label: 'Home', hue: 350, sat: '82%', lum: '40%' },
    { id: 'projects', num: '01', label: 'Projects', hue: 18, sat: '92%', lum: '44%' },
    { id: 'timeline', num: '02', label: 'Experience', hue: 264, sat: '72%', lum: '46%' },
    { id: 'skills', num: '03', label: 'Skills', hue: 172, sat: '80%', lum: '30%' },
    { id: 'github', num: '04', label: 'GitHub', hue: 216, sat: '90%', lum: '42%' },
    { id: 'research', num: '05', label: 'Research', hue: 285, sat: '76%', lum: '44%' },
    { id: 'recognition', num: '06', label: 'Credentials', hue: 40, sat: '90%', lum: '38%' },
    { id: 'testimonials', num: '07', label: 'Testimonials', hue: 335, sat: '80%', lum: '44%' },
    { id: 'contact', num: '08', label: 'Contact', hue: 148, sat: '72%', lum: '32%' },
    { id: 'colophon', num: '09', label: 'Colophon', hue: 205, sat: '25%', lum: '34%' },
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

        const onDeckChange = (e) => {
            if (e.detail && e.detail.id) {
                setActiveSection(e.detail.id);
            }
        };
        window.addEventListener('paper-deck:change', onDeckChange);

        return () => {
            observer.disconnect();
            window.removeEventListener('paper-deck:change', onDeckChange);
        };
    }, []);

    // Map active section back to a chapter
    const activeChapter = (() => {
        if (activeSection === 'certificates' || activeSection === 'badges') return 'recognition';
        return activeSection;
    })();

    const scrollToSection = (id) => {
        window.dispatchEvent(new CustomEvent('paper-deck:goto', { detail: { id } }));
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <aside aria-label="Chapter Navigation" className="chapter-rail">
            {CHAPTERS.map(({ id, num, label, hue, sat, lum }, index) => {
                const isActive = activeChapter === id;
                const ink = `hsl(${hue} ${sat} ${lum})`;
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
                                isActive ? 'w-2.5 h-2.5 skew-x-[-12deg]' : 'w-1.5 h-1.5 group-hover:scale-125'
                            }`}
                            style={{
                                background: isActive
                                    ? `linear-gradient(135deg, hsl(${hue} ${sat} ${lum}), hsl(${(hue + 40) % 360} ${sat} ${Number(lum) + 12}%) 55%, hsl(${hue} ${sat} 34%))`
                                    : `hsl(${hue} 30% 40% / 0.7)`,
                                boxShadow: isActive ? `0 0 10px ${ink}, 0 0 22px ${ink}55` : undefined,
                            }}
                        />
                    </button>
                );
            })}
        </aside>,
        document.body
    );
}