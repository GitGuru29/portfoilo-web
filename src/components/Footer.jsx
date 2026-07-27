import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Github, 
    Linkedin, 
    Twitter, 
    FileText, 
    ArrowUpRight, 
    Cpu, 
    Globe, 
    Sparkles, 
    Terminal
} from 'lucide-react';
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
        <footer className="w-full relative z-20 bg-[#070A10] text-slate-100 border-t border-slate-800/80 overflow-hidden font-sans">
            
            {/* ── Ambient Background Gradient Lights ── */}
            <div aria-hidden className="absolute top-0 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div aria-hidden className="absolute bottom-0 right-1/4 translate-y-1/2 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* ── 1. KINETIC MARQUEE TICKER ── */}
            <div className="w-full bg-[#0A0E17] border-b border-slate-800/80 py-2.5 overflow-hidden relative">
                <div className="flex whitespace-nowrap animate-ticker">
                    {[...marqueeSkills, ...marqueeSkills, ...marqueeSkills].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 mx-3">
                            <span className="text-[10px] md:text-xs font-space tracking-[0.25em] font-semibold text-slate-400 uppercase hover:text-amber-400 transition-colors">
                                {item}
                            </span>
                            <Sparkles className="w-3 h-3 text-amber-400/60" />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── 2. MAIN FOOTER CONTAINER ── */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 relative z-10">

                {/* ── Brand Header & Status Strip ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-space font-medium tracking-wider uppercase mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Available for Core Systems & Android Roles</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-space font-extrabold tracking-tight text-white uppercase">
                            Siluna <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Dangalla</span>
                        </h2>
                    </div>

                    {/* Compact Colombo Live Clock & System Status */}
                    <div className="flex items-center gap-4 text-xs font-space bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl">
                        <div className="flex items-center gap-2 text-slate-300">
                            <Globe className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-slate-400">Colombo:</span>
                            <span className="font-mono font-bold text-white">{timeStr || '13:00:00 PM'}</span>
                        </div>
                        <div className="w-[1px] h-4 bg-slate-800" />
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>NOMINAL</span>
                        </div>
                    </div>
                </div>

                {/* ── 3. FOUR-COLUMN GRID NAVIGATION ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-slate-800/80">
                    
                    {/* Col 1: System Specs */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-space tracking-[0.25em] font-bold text-amber-400 uppercase flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5" />
                            System Focus
                        </h3>
                        <p className="text-xs text-slate-400 font-inter font-light leading-relaxed">
                            Low-level C/C++ runtime engines, native Android architecture, kernel tooling, and compiled languages.
                        </p>
                    </div>

                    {/* Col 2: Navigation Links */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-space tracking-[0.25em] font-bold text-amber-400 uppercase">
                            Navigation
                        </h3>
                        <ul className="space-y-1.5 font-space text-xs">
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
                                        className="text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                                        <span>{label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Flagship Builds */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-space tracking-[0.25em] font-bold text-amber-400 uppercase">
                            Flagship Builds
                        </h3>
                        <ul className="space-y-1.5 font-space text-xs">
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
                                        className="text-slate-400 hover:text-amber-300 transition-colors flex items-center justify-between group"
                                    >
                                        <span>{proj.name}</span>
                                        <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4: Connect & Links */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-space tracking-[0.25em] font-bold text-amber-400 uppercase">
                            Connect
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
                                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-space transition-colors ${
                                        highlight
                                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-3.5 h-3.5 text-amber-400" />
                                        <span>{label}</span>
                                    </div>
                                    <ArrowUpRight className="w-3 h-3 opacity-50" />
                                </a>
                            ))}

                            <button
                                onClick={toggleTerminal}
                                className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 text-xs font-space transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>CLI Terminal</span>
                                </div>
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">`</span>
                            </button>
                        </div>
                    </div>

                </div>

                {/* ── 4. BOTTOM COPYRIGHT ── */}
                <div className="pt-6 flex items-center justify-center text-slate-400 text-xs font-space">
                    <span className="text-slate-400 font-medium text-center">
                        © {new Date().getFullYear()} Siluna Nusal Dangalla. All Rights Reserved.
                    </span>
                </div>

            </div>
        </footer>
    );
}
