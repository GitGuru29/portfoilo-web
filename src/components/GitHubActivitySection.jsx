import React from 'react';
import { ArrowUpRight, GitCommit, Star, GitBranch } from 'lucide-react';
import GitHub3DGraph from './GitHub3DGraph';
import usePageReveal from '../utils/usePageReveal';

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
    { repo: 'aerolang', stars: '★ 48', lang: 'C++ / LLVM', note: 'Custom compiled language targeting LLVM IR & NDK', href: 'https://github.com/GitGuru29' },
    { repo: 'bybridge', stars: '★ 31', lang: 'C++ / Kotlin', note: 'Zero-copy cross-device IPC & H.264 RTP streaming', href: 'https://github.com/GitGuru29' },
    { repo: 'aegislayer', stars: '★ 27', lang: 'Kotlin', note: 'Autonomous Android daemon with 0-dep ML pipeline', href: 'https://github.com/GitGuru29' },
    { repo: 'titanshare', stars: '★ 24', lang: 'C++ / Linux', note: 'Kernel /dev/uinput hardware emulation & mDNS bridge', href: 'https://github.com/GitGuru29' },
];

export default function GitHubActivitySection() {
    const sectionRef = usePageReveal({ selector: '.github-canvas, .story-card', y: 30, stagger: 0.1 });

    return (
        <section ref={sectionRef} className="relative w-full z-10 flex flex-col gap-6 items-center">
            {/* Top Status Strip */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-ink/20">
                <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-ink text-panel font-mono text-[9px] tracking-[0.22em] uppercase font-bold">
                        ARCHITECTURAL TELEMETRY
                    </span>
                    <span className="font-mono text-xs text-graphite">
                        Interactive 3D Commit Skyline — <strong className="text-ink">@GitGuru29</strong>
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="meta-tag text-accent font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-accent rotate-45 inline-block animate-pulse" />
                        GITHUB API · LIVE FEED
                    </span>
                    <a
                        href="https://github.com/GitGuru29"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 border border-ink/30 bg-panel hover:border-accent hover:text-accent font-mono text-[9.5px] tracking-[0.2em] uppercase text-ink inline-flex items-center gap-1.5 transition-colors no-underline"
                    >
                        <span>Open Profile</span>
                        <ArrowUpRight size={12} />
                    </a>
                </div>
            </div>

            {/* 3D Canvas Container */}
            <div
                data-cursor="Orbit Skyline"
                className="github-canvas w-full h-[360px] md:h-[440px] border-2 border-ink rounded-none relative overflow-hidden bg-[#0a0c10] shadow-[6px_6px_0_rgba(0,0,0,0.1)]"
            >
                <GitHub3DGraph username="GitGuru29" />
            </div>

            {/* Commit Ledger & Repository Index */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">

                {/* Left (7 cols): Monthly Contribution Ledger */}
                <div className="lg:col-span-7 story-card p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-ink/20 pb-3 mb-4">
                            <div className="flex items-center gap-2">
                                <GitCommit size={14} className="text-accent" />
                                <span className="font-mono text-[10px] tracking-[0.22em] uppercase font-bold text-ink">
                                    Monthly Contribution Ledger
                                </span>
                            </div>
                            <span className="font-mono text-[9px] tracking-[0.2em] text-accent font-bold">
                                TRAILING 8 MONTHS
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="classified-table">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Commits</th>
                                        <th>Primary Engineering Focus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMMIT_LEDGER.map((row) => (
                                        <tr key={row.month}>
                                            <td className="font-bold text-ink whitespace-nowrap">{row.month}</td>
                                            <td className="tabular-nums min-w-[105px]">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-accent w-6">{row.commits}</span>
                                                    <div className="flex-1 h-1.5 bg-ink/10 overflow-hidden min-w-[45px]">
                                                        <div
                                                            className="h-full bg-accent"
                                                            style={{ width: `${Math.min(100, row.commits)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-graphite">{row.detail}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right (5 cols): Year at a Glance + Top Repositories */}
                <div className="lg:col-span-5 flex flex-col gap-5">
                    <div className="story-card p-5 sm:p-6">
                        <div className="flex items-center justify-between border-b border-ink/20 pb-2.5 mb-4">
                            <span className="font-mono text-[10px] tracking-[0.22em] uppercase font-bold text-ink">
                                Annual Output Summary
                            </span>
                            <span className="font-mono text-[9px] text-accent font-bold">2025–2026</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { n: '495+', l: 'Total Commits' },
                                { n: '30+', l: 'Public Repos' },
                                { n: '4', l: 'Core Engines' },
                            ].map((s) => (
                                <div key={s.l} className="p-3 bg-panel-deep/50 border border-ink/15 flex flex-col gap-1">
                                    <span className="font-display font-bold text-2xl text-ink leading-none tabular-nums">
                                        {s.n}
                                    </span>
                                    <span className="font-mono text-[8.5px] tracking-[0.18em] text-graphite uppercase">
                                        {s.l}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="story-card p-5 sm:p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between border-b border-ink/20 pb-2.5 mb-3.5">
                                <div className="flex items-center gap-2">
                                    <GitBranch size={13} className="text-accent" />
                                    <span className="font-mono text-[10px] tracking-[0.22em] uppercase font-bold text-ink">
                                        Flagship Repositories
                                    </span>
                                </div>
                                <span className="font-mono text-[9px] text-accent font-bold">INDEXED</span>
                            </div>
                            <div className="space-y-2.5">
                                {TOP_REPOS.map((r) => (
                                    <a
                                        key={r.repo}
                                        href={r.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center justify-between gap-3 border-b border-ink/10 pb-2.5 last:border-0 last:pb-0 font-mono text-[11px] no-underline"
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-ink font-bold group-hover:text-accent transition-colors truncate">
                                                    GitGuru29/{r.repo}
                                                </span>
                                                <span className="px-1.5 py-0.2 bg-panel-deep border border-ink/15 text-[8px] tracking-widest uppercase text-graphite">
                                                    {r.lang}
                                                </span>
                                            </div>
                                            <span className="text-graphite text-[10px] truncate mt-0.5">{r.note}</span>
                                        </div>
                                        <span className="text-accent font-bold shrink-0 flex items-center gap-1">
                                            <span>{r.stars}</span>
                                            <ArrowUpRight size={11} className="opacity-60 group-hover:opacity-100" />
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
