import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import useStore from '../store/useStore';
import { EDITION_PRESETS } from '../App';
import { Terminal, Volume2, VolumeX, Sparkles, Calendar } from 'lucide-react';
import { playClickSound } from '../utils/soundFX';
import { scrollToSection } from '../utils/scrollToSection';

// Magnetic link — pulls toward cursor on hover
function MagneticLink({ href, num, active, children, onClick, external }) {
    const linkRef = useRef(null);
    const raf = useRef(null);
    const pos = useRef({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e) => {
        const rect = linkRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.22;
        const dy = (e.clientY - cy) * 0.22;
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
                className="text-[11px] font-mono font-semibold text-current opacity-75 hover:opacity-100 transition-all duration-300 uppercase tracking-[0.2em] inline-block"
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
            className={`group text-[11px] font-mono font-semibold uppercase tracking-[0.2em] inline-flex items-center gap-1.5 transition-all duration-300 relative py-1 ${
                active
                    ? 'text-accent opacity-100'
                    : 'text-ink/70 hover:text-ink'
            }`}
        >
            {num && (
                <span className={`text-[9px] font-mono transition-colors ${active ? 'text-accent' : 'text-graphite/60 group-hover:text-accent'}`}>
                    {num}
                </span>
            )}
            <span>{children}</span>
            {active && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-accent" />
            )}
        </a>
    );
}

const EDITION_ORDER = ['studio', 'cyber', 'cobalt', 'violet'];

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeNav, setActiveNav] = useState('home');
    const location = useLocation();
    const navigate = useNavigate();
    const navRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const toggleTerminal = useStore((state) => state.toggleTerminal);
    const isTerminalOpen = useStore((state) => state.isTerminalOpen);
    const accentTheme = useStore((state) => state.accentTheme);
    const soundEnabled = useStore((state) => state.soundEnabled);
    const setMeetingModalOpen = useStore((state) => state.setMeetingModalOpen);

    const activePreset = EDITION_PRESETS[accentTheme] || EDITION_PRESETS.studio;

    useEffect(() => {
        gsap.fromTo(navRef.current,
            { y: -100 },
            { y: 0, duration: 0.9, ease: 'power3.out' }
        );

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 40);

                    // Active section detection across all chapters
                    const threshold = window.innerHeight * 0.42;
                    const sections = ['contact', 'testimonials', 'recognition', 'research', 'github', 'skills', 'timeline', 'projects', 'hero'];
                    for (const s of sections) {
                        const el = document.getElementById(s);
                        if (el) {
                            const rect = el.getBoundingClientRect();
                            if (rect.top <= threshold) {
                                setActiveNav(s === 'hero' ? 'home' : s);
                                break;
                            }
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
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
        setActiveNav(id);
        const targetId = id === 'home' ? 'hero' : id;
        const doScroll = () => scrollToSection(targetId);
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(doScroll, 150);
        } else {
            doScroll();
        }
    };

    const cycleEdition = () => {
        const current = useStore.getState().accentTheme;
        const idx = EDITION_ORDER.indexOf(current);
        const next = EDITION_ORDER[(idx + 1) % EDITION_ORDER.length];
        useStore.getState().setAccentTheme(next);
        playClickSound(useStore.getState().soundEnabled);
    };

    const navLinks = [
        { label: 'Front', id: 'home', num: '00' },
        { label: 'Work', id: 'projects', num: '01' },
        { label: 'Log', id: 'timeline', num: '02' },
        { label: 'Specs', id: 'skills', num: '03' },
        { label: 'GitHub', id: 'github', num: '04' },
        { label: 'R&D', id: 'research', num: '05' },
        { label: 'Voices', id: 'testimonials', num: '07' },
        { label: 'Contact', id: 'contact', num: '08' },
    ];

    return (
        <>
            <nav
                ref={navRef}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 will-change-transform ${
                    isTerminalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                } ${
                    scrolled
                        ? 'py-2 bg-panel/95 backdrop-blur-md border-b border-ink/25 text-ink shadow-[0_4px_20px_-8px_rgba(0,0,0,0.18)]'
                        : 'py-2.5 bg-panel/90 backdrop-blur-md border-b border-ink/25 text-ink'
                }`}
            >
                <div className="max-w-[84rem] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">

                    {/* Masthead Brand Mark */}
                    <a
                        href="#"
                        onClick={(e) => handleNavClick(e, 'home')}
                        className="group flex items-center gap-2.5 text-ink no-underline shrink-0"
                    >
                        <span className="w-6 h-6 rounded-md bg-accent text-void flex items-center justify-center font-mono font-bold text-xs leading-none shadow-[0_0_12px_-2px_var(--color-accent)] group-hover:scale-105 transition-transform">
                            S
                        </span>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold tracking-[0.24em] uppercase leading-none text-ink group-hover:text-accent transition-colors">
                                SILUNA.SYS
                            </span>
                            <span className="text-[8px] font-mono tracking-[0.18em] uppercase text-graphite leading-tight mt-0.5 hidden sm:inline">
                                ARCHITECT · COLOMBO
                            </span>
                        </div>
                    </a>

                    {/* Desktop links */}
                    <div className="hidden xl:flex items-center gap-6">
                        {navLinks.map(({ label, id, num }) => (
                            <MagneticLink
                                key={id}
                                href={`#${id}`}
                                id={id}
                                num={num}
                                active={activeNav === id}
                                onClick={(e) => handleNavClick(e, id)}
                            >
                                {label}
                            </MagneticLink>
                        ))}
                    </div>

                    {/* Compact Desktop links for md-lg */}
                    <div className="hidden md:flex xl:hidden items-center gap-5">
                        {navLinks.filter((_, i) => [0, 1, 2, 3, 7].includes(i)).map(({ label, id, num }) => (
                            <MagneticLink
                                key={id}
                                href={`#${id}`}
                                id={id}
                                num={num}
                                active={activeNav === id}
                                onClick={(e) => handleNavClick(e, id)}
                            >
                                {label}
                            </MagneticLink>
                        ))}
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 md:gap-2.5 shrink-0">
                        {/* Modern Theme Switcher */}
                        <button
                            onClick={cycleEdition}
                            title="Switch Theme (Cyber Obsidian · Midnight Blue · Neon Tokyo · Studio Light)"
                            aria-label="Switch Theme"
                            data-cursor="Switch Theme"
                            className="flex items-center gap-2 border border-ink/20 bg-panel-deep/60 hover:border-accent px-3 py-1.5 text-[9px] font-mono tracking-[0.18em] text-ink transition-all rounded-full cursor-pointer shadow-sm"
                        >
                            <span
                                className="w-2 h-2 rounded-full inline-block animate-pulse"
                                style={{ background: activePreset.accent }}
                            />
                            <span className="hidden sm:inline text-graphite">THEME:</span>
                            <span className="font-bold text-accent">
                                {activePreset.label}
                            </span>
                        </button>

                        {/* Cmd + K Command Palette Trigger */}
                        <button
                            onClick={() => {
                                useStore.getState().setCommandPaletteOpen(true);
                                playClickSound(soundEnabled);
                            }}
                            title="Command Palette (Cmd + K)"
                            aria-label="Open Command Palette"
                            data-cursor="Command Palette"
                            className="hidden sm:flex items-center gap-1.5 border border-ink/25 bg-panel-deep/30 hover:border-accent px-2.5 py-1.5 text-[10px] font-mono tracking-widest text-ink/80 hover:text-ink transition-all rounded-none cursor-pointer"
                        >
                            <span className="text-accent font-bold">⌘</span>
                            <span>K</span>
                        </button>

                        {/* Sound FX Toggle */}
                        <button
                            onClick={() => {
                                const current = useStore.getState().soundEnabled;
                                useStore.getState().toggleSound();
                                playClickSound(!current);
                            }}
                            title={soundEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
                            aria-label="Toggle Sound Effects"
                            className="p-1.5 border border-ink/25 bg-panel-deep/30 hover:border-accent transition-all rounded-none text-ink cursor-pointer"
                        >
                            {soundEnabled ? (
                                <Volume2 size={13} className="text-accent" />
                            ) : (
                                <VolumeX size={13} className="text-graphite/60" />
                            )}
                        </button>

                        {/* Terminal toggle */}
                        <button
                            onClick={toggleTerminal}
                            aria-label="Open terminal"
                            data-cursor="Launch CLI"
                            className={`group relative flex items-center gap-2 border px-2.5 py-1.5 transition-all duration-300 rounded-none cursor-pointer ${
                                isTerminalOpen
                                    ? 'border-accent bg-accent text-white'
                                    : 'border-ink/25 bg-ink text-panel hover:bg-accent hover:border-accent hover:text-white'
                            }`}
                        >
                            <Terminal size={12} className="transition-colors" />
                            <span className="hidden sm:inline text-[9px] font-mono font-bold tracking-[0.2em] uppercase">
                                Shell
                            </span>
                            {isTerminalOpen && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                            )}
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMenuOpen(v => !v)}
                            aria-label="Toggle menu"
                            aria-expanded={menuOpen}
                            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 border border-ink/25 bg-panel-deep/40 hover:border-accent cursor-pointer"
                        >
                            <span className={`block w-4 h-[1.5px] bg-ink transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                            <span className={`block w-4 h-[1.5px] bg-ink transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                            <span className={`block w-4 h-[1.5px] bg-ink transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="fixed top-0 left-0 right-0 z-40 pt-16 pb-8 px-6 bg-panel border-b-2 border-ink md:hidden flex flex-col gap-3 shadow-2xl"
                >
                    <div className="flex items-center justify-between py-2 border-b border-ink/15 text-[10px] font-mono uppercase tracking-widest text-graphite">
                        <span>Chapter Index</span>
                        <span>Issue No. 024</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        {navLinks.map(({ label, id, num }) => (
                            <a
                                key={id}
                                href={`#${id}`}
                                onClick={(e) => handleNavClick(e, id)}
                                className={`px-3 py-2.5 border text-xs font-mono tracking-[0.18em] uppercase transition-colors flex items-center justify-between ${
                                    activeNav === id
                                        ? 'border-accent bg-accent/10 text-accent font-bold'
                                        : 'border-ink/15 bg-panel-deep/40 text-ink/80 hover:text-ink'
                                }`}
                            >
                                <span><span className="text-accent mr-1.5">{num}.</span>{label}</span>
                                {activeNav === id && <span className="w-1.5 h-1.5 bg-accent rotate-45" />}
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-ink/15">
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                setMeetingModalOpen(true);
                            }}
                            className="flex-1 py-2.5 bg-accent text-white font-mono text-[10px] tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2"
                        >
                            <Calendar size={12} />
                            <span>Book Technical Chat</span>
                        </button>
                        <a
                            href="https://github.com/GitGuru29"
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2.5 border border-ink/25 font-mono text-[10px] tracking-[0.2em] uppercase text-ink hover:border-accent"
                        >
                            GitHub ↗
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}
