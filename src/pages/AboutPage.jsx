import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Shield, Code, Server, ArrowLeft, Mail, Github, Linkedin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Typewriter from '../components/Typewriter';
import Footer from '../components/Footer';

export default function AboutPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const pageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={pageVariants}
            className="min-h-screen w-full bg-[var(--color-quantum-black)] text-[var(--color-geyser)] pt-28 pb-16 px-4 md:px-8 relative z-10 font-sans"
        >
            {/* Ambient Background Glows */}
            <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
            <div aria-hidden className="absolute bottom-1/3 right-10 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-6xl mx-auto space-y-20 relative z-10">

                {/* Top Back Navigation Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-space uppercase tracking-[0.25em] text-white/50 hover:text-amber-400 transition-colors group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Return to Overview</span>
                    </Link>
                    <span className="text-[10px] font-mono tracking-widest text-amber-400/60 uppercase border border-amber-400/20 px-3 py-1 rounded-full bg-amber-400/5">
                        System Spec // About Protocol
                    </span>
                </div>

                {/* Header Banner */}
                <div className="text-center max-w-3xl mx-auto space-y-6">
                    <span className="text-xs md:text-sm tracking-[0.4em] font-space uppercase text-[var(--color-geyser)]/40 block">
                        <Typewriter text="Architectural Profile" triggerOnScroll={false} loop={false} cursorChar="_" />
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-space font-light text-white leading-tight uppercase">
                        Siluna <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 font-bold">Dangalla</span>
                    </h1>
                    <p className="text-base md:text-xl font-inter font-light text-[var(--color-geyser)]/70 leading-relaxed">
                        Final-year Software Engineering undergraduate specializing in high-performance system-level software, native Android architecture, and custom compilers.
                    </p>
                </div>

                {/* Main Content Grid */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Bio Card */}
                    <motion.div variants={itemVariants} className="md:col-span-2 bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                            <Cpu className="w-5 h-5 text-amber-400" />
                            <h2 className="text-lg font-space font-semibold uppercase text-white tracking-wider">Engineering Background</h2>
                        </div>
                        <div className="space-y-4 font-inter text-sm md:text-base font-light text-slate-300 leading-relaxed">
                            <p>
                                I am an undergraduate developer focused on building software that operates close to the hardware. My passion lies in low-level systems programming, operating system internals, and compiler design.
                            </p>
                            <p>
                                From designing custom interpreted languages like <strong className="text-amber-300 font-normal">AeroLang</strong> to developing kernel-level sandboxing utilities like <strong className="text-amber-300 font-normal">AegisLayer</strong>, I aim to craft deterministic, high-efficiency software components.
                            </p>
                            <p>
                                My primary tech stack revolves around C/C++, Java/Kotlin for native Android, Rust, and POSIX Linux system APIs.
                            </p>
                        </div>
                    </motion.div>

                    {/* Quick Specs Sidebar */}
                    <motion.div variants={itemVariants} className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                            <Terminal className="w-5 h-5 text-emerald-400" />
                            <h2 className="text-lg font-space font-semibold uppercase text-white tracking-wider">System Info</h2>
                        </div>
                        <dl className="space-y-4 text-xs font-space">
                            <div>
                                <dt className="text-slate-500 uppercase tracking-widest">Education</dt>
                                <dd className="text-slate-200 font-medium mt-1">BSc (Hons) Software Engineering</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 uppercase tracking-widest">Focus Areas</dt>
                                <dd className="text-slate-200 font-medium mt-1">Systems Programming, Android AOSP, Compilers</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 uppercase tracking-widest">Location</dt>
                                <dd className="text-slate-200 font-medium mt-1">Sri Lanka (UTC+05:30) · Remote Friendly</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 uppercase tracking-widest">Status</dt>
                                <dd className="text-emerald-400 font-medium mt-1 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Available for Engineering Roles
                                </dd>
                            </div>
                        </dl>
                    </motion.div>

                </motion.div>

                {/* Core Pillars */}
                <div className="space-y-8">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <h2 className="text-2xl md:text-3xl font-space font-light text-white uppercase tracking-wider">Core Engineering Directives</h2>
                        <div className="h-0.5 w-16 bg-amber-400/50 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Shield,
                                title: "Absolute Reliability",
                                desc: "Zero runtime crashes, strict memory management, and deterministic execution under heavy loads."
                            },
                            {
                                icon: Code,
                                title: "Low-Level Control",
                                desc: "Fine-grained resource control with native C/C++, POSIX APIs, and custom kernel hooks."
                            },
                            {
                                icon: Server,
                                title: "Modular Architecture",
                                desc: "Decoupled IPC communication layers, extensible CLI interfaces, and clean component isolation."
                            }
                        ].map((pillar, i) => (
                            <div key={i} className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-amber-500/30 transition-colors space-y-3">
                                <pillar.icon className="w-6 h-6 text-amber-400" />
                                <h3 className="text-base font-space font-semibold text-white">{pillar.title}</h3>
                                <p className="text-xs font-inter text-slate-400 font-light leading-relaxed">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call To Action Banner */}
                <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-blue-500/10 border border-amber-500/20 text-center space-y-6">
                    <h2 className="text-2xl md:text-4xl font-space font-light text-white uppercase">Ready to Build Core Systems?</h2>
                    <p className="text-sm md:text-base font-inter font-light text-slate-300 max-w-xl mx-auto">
                        Explore my projects or get in touch to discuss low-level engineering, Android development, or research projects.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <Link
                            to="/#contact"
                            className="px-6 py-3 rounded-xl bg-amber-400 text-black font-space font-semibold text-xs uppercase tracking-widest hover:bg-amber-300 transition-colors inline-flex items-center gap-2"
                        >
                            <Mail size={14} />
                            <span>Initiate Contact</span>
                        </Link>
                        <a
                            href="https://github.com/GitGuru29"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-space font-semibold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Github size={14} />
                            <span>GitHub Profile</span>
                            <ExternalLink size={12} className="opacity-60" />
                        </a>
                    </div>
                </div>

            </div>

            {/* Global Footer */}
            <div className="mt-20">
                <Footer />
            </div>
        </motion.div>
    );
}
