import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import useStore from '../store/useStore';
import { Terminal } from 'lucide-react';

// Magnetic link — pulls toward cursor on hover
function MagneticLink({ href, id, children, onClick, external }) {
    const linkRef = useRef(null);
    const raf = useRef(null);
    const pos = useRef({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e) => {
        const rect = linkRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.25;
        const dy = (e.clientY - cy) * 0.25;
        pos.current = { x: dx, y: dy };
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(() => {
            if (linkRef.current) {
                linkRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
            }
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        cancelAnimationFrame(raf.current);
        gsap.to(linkRef.current, {
            x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)',
        });
    }, []);

    if (external) {
        return (
            <a
                ref={linkRef}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="text-xs font-space font-semibold text-current opacity-75 hover:opacity-100 transition-all duration-300 uppercase tracking-[0.25em] inline-block"
            >
                {children}
            </a>
        );
    }

    return (
        <a
            ref={linkRef}
            href={href}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="text-xs font-space font-semibold text-current opacity-75 hover:opacity-100 transition-all duration-300 uppercase tracking-[0.25em] inline-block"
        >
            {children}
        </a>
    );
}

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const navRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const toggleTerminal = useStore((state) => state.toggleTerminal);
    const isTerminalOpen = useStore((state) => state.isTerminalOpen);

    useEffect(() => {
        gsap.fromTo(navRef.current,
            { y: -100 },
            { y: 0, duration: 0.9, ease: 'power3.out' }
        );

        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animate mobile menu
    useEffect(() => {
        if (!mobileMenuRef.current) return;
        if (menuOpen) {
            gsap.fromTo(mobileMenuRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
        } else {
            gsap.to(mobileMenuRef.current, {
                opacity: 0, y: -10, duration: 0.2, ease: 'power2.in',
            });
        }
    }, [menuOpen]);

    const handleNavClick = (e, id) => {
        e.preventDefault();
        setMenuOpen(false);
        const doScroll = () => {
            const element = document.getElementById(id);
            if (!element) return;
            if (window.lenis) {
                window.lenis.scrollTo(element, { offset: 0, duration: 1.2 });
            } else {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        };
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(doScroll, 150);
        } else {
            doScroll();
        }
    };

    const navLinks = [
        { label: 'Home', id: 'home' },
        { label: 'Work', id: 'projects' },
        { label: 'Skills', id: 'skills' },
        { label: 'References', id: 'testimonials' },
        { label: 'Contact', id: 'contact' },
    ];

    return (
        <>
            <nav
                ref={navRef}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 will-change-transform ${
                    isTerminalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                } ${
                    scrolled
                        ? 'py-3 bg-[var(--color-quantum-black)]/98 border-b border-[var(--color-geyser)]/8 text-[var(--color-geyser)]'
                        : 'py-7 text-white'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                    {/* Logo (Hidden on initial load to match reference image) */}
                    <a
                        href="#"
                        onClick={(e) => handleNavClick(e, 'home')}
                        className={`text-lg font-space font-medium tracking-[0.35em] transition-opacity duration-300 ${scrolled ? 'opacity-100 text-current hover:opacity-60' : 'opacity-0 pointer-events-none'}`}
                    >
                        SN.
                    </a>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map(({ label, id }) => (
                            <MagneticLink key={id} href={`#${id}`} id={id} onClick={(e) => handleNavClick(e, id)}>
                                {label}
                            </MagneticLink>
                        ))}
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-4">
                        {/* Terminal toggle */}
                        <button
                            onClick={toggleTerminal}
                            aria-label="Open terminal"
                            className={`group relative flex items-center gap-2 border px-3 py-1.5 transition-all duration-300 ${
                                isTerminalOpen
                                    ? 'border-current opacity-100 bg-current/10'
                                    : 'border-current/20 opacity-50 hover:opacity-100 hover:border-current/40'
                            }`}
                        >
                            <Terminal size={12} className="text-current transition-colors" />
                            <span className="hidden sm:inline text-[10px] font-space tracking-[0.2em] uppercase text-current transition-colors">
                                Terminal
                            </span>
                            {/* Active pulse */}
                            {isTerminalOpen && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            )}
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMenuOpen(v => !v)}
                            aria-label="Toggle menu"
                            className="md:hidden flex flex-col gap-[5px] p-1 opacity-50 hover:opacity-100"
                        >
                            <span className={`block w-5 h-[1px] bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
                            <span className={`block w-5 h-[1px] bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                            <span className={`block w-5 h-[1px] bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="fixed top-0 left-0 right-0 z-40 pt-20 pb-8 px-6 bg-[var(--color-quantum-black)]/98 border-b border-[var(--color-geyser)]/10 md:hidden flex flex-col gap-6"
                >
                    {navLinks.map(({ label, id }) => (
                        <a
                            key={id}
                            href={`#${id}`}
                            onClick={(e) => handleNavClick(e, id)}
                            className="text-base font-space tracking-[0.2em] uppercase text-[var(--color-geyser)]/60 hover:text-[var(--color-geyser)] transition-colors border-b border-[var(--color-geyser)]/8 pb-4"
                        >
                            {label}
                        </a>
                    ))}
                    <a
                        href="https://github.com/GitGuru29"
                        target="_blank"
                        rel="noreferrer"
                        className="text-base font-space tracking-[0.2em] uppercase text-[var(--color-geyser)]/40 hover:text-[var(--color-geyser)] transition-colors"
                    >
                        GitHub ↗
                    </a>
                </div>
            )}
        </>
    );
}
