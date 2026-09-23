import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Github, Linkedin, Twitter, FileText, ArrowUpRight, Cpu, Globe, Sparkles, Terminal } from 'lucide-react';
import useStore from '../store/useStore';

export default function Footer() {
    const location = useLocation();
    const navigate = useNavigate();
    const [timeStr, setTimeStr] = useState('');
    const toggleTerminal = useStore((state) => state.toggleTerminal);

    // Live Sri Lanka Clock (UTC+05:30)
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const options = {
                timeZone: 'Asia/Colombo',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            setTimeStr(new Intl.DateTimeFormat('en-US', options).format(now));
        };

        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    // Smooth Scroll Navigation Helper
    const handleNavClick = (e, id) => {
        e.preventDefault();
        const scrollToTarget = () => {
            const el = document.getElementById(id);
            if (el && window.lenis) {
                window.lenis.scrollTo(el, { offset: 0, duration: 1.2 });
            } else if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        };

        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(scrollToTarget, 150);
        } else {
            scrollToTarget();
        }
    };

    const marqueeSkills = [
        "SYSTEMS ARCHITECTURE",
        "ANDROID AOSP & KERNEL",
        "AEROLANG COMPILER",
        "LINUX NATIVE TOOLING",
        "AEGIS LAYER SECURITY",
        "BYBRIDGE PLATFORM",
        "HIGH PERFORMANCE C/C++"
    ];

    return (
        <footer className="w-full relative z-20 bg-void text-ink border-t-2 border-ink overflow-hidden font-sans" style={{ borderTop: '3px double #121212' }}>

            {/* 1. KINETIC MARQUEE TICKER — ink band */}
            <div className="w-full bg-[#121212] text-[#f5f2eb] border-b-2 border-ink py-2.5 overflow-hidden relative">
                <div className="flex whitespace-nowrap animate-ticker">
                    {[...marqueeSkills, ...marqueeSkills, ...marqueeSkills].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 mx-3">
                            <span className="text-[10px] md:text-xs tracking-[0.25em] font-mono font-semibold uppercase opacity-90">
                                {item}
                            </span>
                            <Sparkles className="w-3 h-3 text-accent" />
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. MAIN FOOTER — colophon */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 relative z-10">

                {/* Brand header & status strip */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8"
                    style={{ borderBottom: '3px double #121212' }}>
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-2 px-2 py-1 rounded-none border border-accent text-accent text-[10px] font-mono tracking-widest uppercase">
                            <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
                            Open for Core Systems & Android Roles
                        </span>
                        <h2 className="font-blackletter text-4xl md:text-5xl leading-none text-ink">
                            The Daily Developer
                        </h2>
                        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-graphite">
                            Independent Systems Engineering · Colombo
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono bg-panel/80 border border-ink text-ink px-4 py-2.5 rounded-none">
                        <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-accent" />
                            <span className="uppercase tracking-widest">Last Update:</span>
                            <span className="font-bold tabular-nums">{timeStr || '13:00:00 PM'} SLT</span>
                        </div>
                        <div className="w-[1px] h-4 bg-ink/40" />
                        <div className="flex items-center gap-1.5 text-accent">
                            <span className="w-2 h-2 bg-accent animate-pulse" />
                            <span className="uppercase tracking-widest">☀ NOMINAL</span>
                        </div>
                    </div>
                </div>

                {/* 3. FOUR-COLUMN GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8"
                    style={{ borderBottom: '3px double #121212' }}>

                    {/* Col 1: System Specs */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-mono tracking-[0.25em] font-bold text-accent uppercase flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5" />
                            System Focus
                        </h3>
                        <p className="text-xs text-graphite font-serif leading-relaxed">
                            Low-level C/C++ runtime engines, native Android architecture, kernel tooling, and compiled languages.
                        </p>
                    </div>

                    {/* Col 2: Navigation Links */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-mono tracking-[0.25em] font-bold text-accent uppercase">
                            Navigation
                        </h3>
                        <ul className="space-y-1.5 font-mono text-xs">
                            {[
                                { label: 'Overview', id: 'home' },
                                { label: 'Skills & Tech', id: 'skills' },
                                { label: 'Featured Projects', id: 'projects' },
                                { label: 'Build Log', id: 'timeline' },
                                { label: 'Active Research', id: 'research' },
                                { label: 'Contact', id: 'contact' },
                            ].map(({ label, id }) => (
                                <li key={id}>
                                    <a
                                        href={`#${id}`}
                                        onClick={(e) => handleNavClick(e, id)}
                                        className="text-graphite hover:text-accent transition-colors flex items-center gap-1.5"
                                    >
                                        <span className="w-1.5 h-1.5 border border-ink bg-transparent" />
                                        <span>{label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Flagship Builds */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-mono tracking-[0.25em] font-bold text-accent uppercase">
                            Flagship Builds
                        </h3>
                        <ul className="space-y-1.5 font-mono text-xs">
                            {[
                                { name: 'AeroLang Compiler', href: 'https://aero-lang-web.vercel.app/' },
                                { name: 'AegisLayer Security', href: '/project/aegislayer' },
                                { name: 'ByBridge IPC Engine', href: '/project/bybridge' },
                            ].map((proj) => (
                                <li key={proj.name}>
                                    <a
                                        href={proj.href}
                                        target={proj.href.startsWith('http') ? '_blank' : '_self'}
                                        rel={proj.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="text-graphite hover:text-accent transition-colors flex items-center justify-between group"
                                    >
                                        <span>{proj.name}</span>
                                        <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4: Connect & Dispatch */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-mono tracking-[0.25em] font-bold text-accent uppercase">
                            Dispatch Desk
                        </h3>
                        <div className="flex flex-col gap-2">
                            {[
                                { label: 'GitHub', href: 'https://github.com/GitGuru29', icon: Github },
                                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/siluna-dangalla-0744a02b1/', icon: Linkedin },
                                { label: 'X / Twitter', href: 'https://x.com/siluna36074', icon: Twitter },
                                { label: 'Resume CV ↗', href: '/Siluna_Nusal_CV.pdf', icon: FileText, highlight: true },
                            ].map(({ label, href, icon: Icon, highlight }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center justify-between px-3 py-1.5 rounded-none border font-mono text-xs transition-colors ${
                                        highlight
                                            ? 'bg-accent/10 border-accent/60 text-accent hover:bg-accent/20'
                                            : 'bg-panel/60 border-ink/50 text-graphite hover:text-accent'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-3.5 h-3.5 text-accent" />
                                        <span>{label}</span>
                                    </div>
                                    <ArrowUpRight className="w-3 h-3 opacity-50" />
                                </a>
                            ))}

                            <button
                                onClick={toggleTerminal}
                                className="flex items-center justify-between px-3 py-1.5 rounded-none bg-panel/60 border border-ink/50 text-graphite hover:text-accent font-mono text-xs transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-accent" />
                                    <span>CLI Terminal</span>
                                </div>
                                <span className="text-[9px] font-mono px-1.5 border border-ink/40 text-graphite">`</span>
                            </button>
                        </div>
                    </div>

                </div>

                {/* 4. BOTTOM COPYRIGHT */}
                <div className="pt-6 flex flex-col items-center gap-2">
                    <span className="block w-24 border-t-2 border-ink" />
                    <span className="text-graphite text-xs font-mono text-center">
                        © {new Date().getFullYear()} Siluna Nusal Dangalla · Set & Printed in Playfair Display & UnifrakturMaguntia
                    </span>
                </div>

            </div>
        </footer>
    );
}