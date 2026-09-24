import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import GitHub3DGraph from './GitHub3DGraph';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const COMMIT_LEDGER = [
    { month: 'OCT 25', commits: 41, detail: 'LLVM passes · AeroLang front-end' },
    { month: 'NOV 25', commits: 67, detail: 'ByBridge IPC · daemon hardening' },
    { month: 'DEC 25', commits: 29, detail: 'AegisLayer telemetry · audit fixes' },
    { month: 'JAN 26', commits: 52, detail: 'Kotlin tooling · Gradle modules' },
    { month: 'FEB 26', commits: 73, detail: 'Kernel utilities · eBPF experiments' },
    { month: 'MAR 26', commits: 58, detail: 'Portfolio platform · CI pipeline' },
    { month: 'APR 26', commits: 84, detail: 'Compiler IR · native Android NDK' },
    { month: 'MAY 26', commits: 91, detail: 'Release candidates · docs & tests' },
];

const TOP_REPOS = [
    { repo: 'aerolang', stars: '★ 48', note: 'Compiler in C++ / LLVM IR' },
    { repo: 'bybridge', stars: '★ 31', note: 'Zero-copy IPC for Linux' },
    { repo: 'aegislayer', stars: '★ 27', note: 'Telemetry security agent' },
    { repo: 'dotfiles', stars: '★ 19', note: 'Minimal Linux workstation' },
];

export default function GitHubActivitySection() {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: 50, skewY: 2 },
                {
                    opacity: 1, y: 0, skewY: 0,
                    duration: 1.2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full max-w-7xl mx-auto px-6 py-24 md:py-32 z-10 flex flex-col items-center">
            
            {/* Structural line */}
            <div className="structural-line structural-line-h top-0 left-0 w-full hidden lg:block" />

            <div className="w-full flex flex-col md:flex-row items-start justify-between mb-16 gap-12">
                <div ref={headerRef}>
                    <h2 className="text-xs md:text-sm tracking-[0.4em] font-space uppercase text-[var(--color-geyser)]/40 mb-4 md:mb-6">
                        Live Telemetry
                    </h2>
                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-space font-light text-[var(--color-geyser)] leading-tight">
                        Contribution Skyline.
                    </h3>
                </div>
                <div className="md:w-1/3 flex items-end">
                    <p className="text-sm md:text-base text-[var(--color-geyser)]/50 font-inter font-light leading-relaxed">
                        Live 3D architectural representation of my GitHub commits over the last 365 days. Drag to orbit the structure.
                    </p>
                </div>
            </div>

            {/* 3D Canvas Container */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                data-cursor="Orbit Model"
                className="w-full h-[500px] md:h-[600px] border border-ink/30 rounded-none relative overflow-hidden bg-transparent shadow-none"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />
                <GitHub3DGraph username="GitGuru29" />
                <div className="absolute bottom-4 left-4 p-4 text-[10px] tracking-[0.2em] font-mono uppercase text-ink/50 z-20">
                    Data Source: GitHub API
                </div>
            </motion.div>

            {/* Commit Ledger — static fallback + editorial record */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 mt-10">
                <div className="lg:col-span-3 story-card p-5 md:p-6">
                    <div className="flex items-center justify-between border-b border-ink/20 pb-2.5 mb-3">
                        <span className="font-mono text-[10px] tracking-[0.22em] uppercase font-bold text-ink">Monthly Contribution Ledger</span>
                        <span className="font-mono text-[9px] text-accent">TRAILING 8</span>
                    </div>
                    <table className="classified-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Commits</th>
                                <th>Focus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMMIT_LEDGER.map((row) => (
                                <tr key={row.month}>
                                    <td>{row.month}</td>
                                    <td className="tabular-nums">{row.commits}</td>
                                    <td>{row.detail}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="story-card p-5 md:p-6">
                        <div className="flex items-center justify-between border-b border-ink/20 pb-2.5 mb-3">
                            <span className="font-mono text-[10px] tracking-[0.22em] uppercase font-bold text-ink">Year at a Glance</span>
                            <span className="font-mono text-[9px] text-accent">2025–26</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { n: '8+', l: 'Months active' },
                                { n: '495', l: 'Commits' },
                                { n: '4', l: 'Key engines' },
                            ].map((s) => (
                                <div key={s.l} className="flex flex-col gap-1">
                                    <span className="font-display font-bold text-2xl text-ink leading-none">{s.n}</span>
                                    <span className="font-mono text-[9px] tracking-widest text-graphite uppercase">{s.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="story-card p-5 md:p-6">
                        <div className="flex items-center justify-between border-b border-ink/20 pb-2.5 mb-3">
                            <span className="font-mono text-[10px] tracking-[0.22em] uppercase font-bold text-ink">Top Repositories</span>
                            <span className="font-mono text-[9px] text-accent">BY STARS</span>
                        </div>
                        <div className="space-y-2.5">
                            {TOP_REPOS.map((r) => (
                                <div key={r.repo} className="flex items-center justify-between gap-3 border-b border-ink/10 pb-2 last:border-0 last:pb-0 font-mono text-[11px]">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-ink truncate">@{r.repo}</span>
                                        <span className="text-graphite text-[10px] truncate">{r.note}</span>
                                    </div>
                                    <span className="text-accent shrink-0">{r.stars}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
