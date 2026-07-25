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
            <div aria-hidden className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div aria-hidden className="absolute bottom-0 right-1/4 translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

            {/* ── Structural Top Line ── */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

            {/* ── 1. HIGH-IMPACT KINETIC MARQUEE TICKER ── */}
            <div className="w-full bg-[#0A0E17] border-b border-slate-800/80 py-4 overflow-hidden relative">
                <div className="flex whitespace-nowrap animate-ticker">
                    {[...marqueeSkills, ...marqueeSkills, ...marqueeSkills].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-6 mx-4">
                            <span className="text-xs md:text-sm font-space tracking-[0.25em] font-bold text-slate-300 uppercase hover:text-amber-400 transition-colors">
                                {item}
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-amber-400/70" />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── 2. MAIN FOOTER CONTENT CONTAINER ── */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-20 pb-12 relative z-10">

                {/* ── Brand Header Block: Big Kinetic Headline ── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-16 border-b border-slate-800/80">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-space font-medium tracking-wider uppercase">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Available for Core Systems & Android Engineering Roles</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-6xl font-space font-extrabold tracking-tight text-white leading-none uppercase">
                            Siluna <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Dangalla</span>
                        </h2>

                        <p className="text-base md:text-lg text-slate-300 font-inter font-light leading-relaxed">
                            Crafting low-level systems, native Android architecture, high-performance compilers, and robust open-source tools.
                        </p>
                    </div>
                </div>

                {/* ── 3. FOUR-COLUMN GRID NAVIGATION & DETAILS ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-slate-800/80">
                    
                    {/* Col 1: System Status & Live Sri Lanka Time */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xs font-space tracking-[0.3em] font-bold text-amber-400 uppercase flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-amber-400" />
                                System Metrics
                            </h3>
                            <div className="h-0.5 w-12 bg-amber-400/40 rounded-full" />
                        </div>

                        {/* Live Colombo Time Card */}
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-space tracking-wider uppercase">
                                <span className="flex items-center gap-1.5">
                                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                                    Location / TZ
                                </span>
                                <span className="text-slate-300 font-mono">UTC+05:30</span>
                            </div>
                            <div className="text-xl font-mono font-bold text-white tracking-wide flex items-center justify-between">
                                <span>{timeStr || '13:00:00 PM'}</span>
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            </div>
                            <p className="text-xs text-slate-400 font-inter">Colombo, Sri Lanka</p>
                        </div>

                        {/* System Nominal Badge */}
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                            <div className="text-xs font-space tracking-wider text-slate-200">
                                OPERATIVE STATE: <span className="text-emerald-400 font-bold">NOMINAL</span>
                            </div>
                        </div>
                    </div>

                    {/* Col 2: Navigation Links */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xs font-space tracking-[0.3em] font-bold text-amber-400 uppercase">
                                Quick Navigation
                            </h3>
                            <div className="h-0.5 w-12 bg-amber-400/40 rounded-full" />
                        </div>

                        <ul className="space-y-3 font-space text-sm">
                            {[
                                { label: 'Home Overview', id: 'hero' },
                                { label: 'Tech Stack & Skills', id: 'skills' },
                                { label: 'Featured Projects', id: 'projects' },
                                { label: 'Timeline & History', id: 'timeline' },
                                { label: 'Active Research', id: 'research' },
                                { label: 'Certificates & Badges', id: 'certificates' },
                                { label: 'Contact Section', id: 'contact' },
                            ].map(({ label, id }) => (
                                <li key={id}>
                                    <a
                                        href={`#${id}`}
                                        onClick={(e) => handleNavClick(e, id)}
                                        className="text-slate-300 hover:text-amber-300 hover:translate-x-1.5 transition-all duration-200 flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-amber-400 transition-colors" />
                                        <span>{label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Flagship Systems */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xs font-space tracking-[0.3em] font-bold text-amber-400 uppercase">
                                Flagship Systems
                            </h3>
                            <div className="h-0.5 w-12 bg-amber-400/40 rounded-full" />
                        </div>

                        <ul className="space-y-3.5 font-space text-sm">
                            {[
                                { name: 'AeroLang Compiler', desc: 'Custom Language & Interpreter', href: 'https://aero-lang-web.vercel.app/' },
                                { name: 'AegisLayer Security', desc: 'Android Dynamic Sandbox', href: '/project/aegislayer' },
                                { name: 'ByBridge Engine', desc: 'High-speed Cross-IPC Layer', href: '/project/bybridge' },
                                { name: 'C-Matrix Visualizer', desc: 'Realtime System Memory Graph', href: '/#cmatrix' },
                            ].map((proj) => (
                                <li key={proj.name}>
                                    <a
                                        href={proj.href}
                                        target={proj.href.startsWith('http') ? '_blank' : '_self'}
                                        rel={proj.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="group block p-2.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between text-slate-100 font-semibold group-hover:text-amber-300">
                                            <span>{proj.name}</span>
                                            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                        </div>
                                        <div className="text-xs text-slate-400 font-inter font-light">{proj.desc}</div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4: Connect & Links */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xs font-space tracking-[0.3em] font-bold text-amber-400 uppercase">
                                Connect & Resume
                            </h3>
                            <div className="h-0.5 w-12 bg-amber-400/40 rounded-full" />
                        </div>

                        <div className="space-y-3">
                            {[
                                { label: 'GitHub Profile', href: 'https://github.com/GitGuru29', icon: Github },
                                { label: 'LinkedIn Network', href: 'https://www.linkedin.com/in/siluna-dangalla-0744a02b1/', icon: Linkedin },
                                { label: 'X / Twitter', href: 'https://x.com/siluna36074', icon: Twitter },
                                { label: 'Download Resume CV', href: '/Siluna_Nusal_CV.pdf', icon: FileText, highlight: true },
                            ].map(({ label, href, icon: Icon, highlight }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-space transition-all duration-200 group ${
                                        highlight
                                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400'
                                            : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">{label}</span>
                                    </div>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </a>
                            ))}

                            {/* Open Terminal Trigger */}
                            <button
                                onClick={toggleTerminal}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 text-sm font-space transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <Terminal className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                                    <span className="font-medium">Launch CLI Terminal</span>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-emerald-400">
                                    `
                                </span>
                            </button>
                        </div>
                    </div>

                </div>

                {/* ── 4. BOTTOM COPYRIGHT ── */}
                <div className="pt-8 flex items-center justify-center text-slate-400 text-xs font-space">
                    <span className="text-slate-300 font-medium text-center">
                        © {new Date().getFullYear()} Siluna Nusal Dangalla. All Rights Reserved.
                    </span>
                </div>

            </div>
        </footer>
    );
}
