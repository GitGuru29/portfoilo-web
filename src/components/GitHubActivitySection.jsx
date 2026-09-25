import React from 'react';
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
    { repo: 'aerolang', stars: '★ 48', note: 'Compiler in C++ / LLVM IR' },
    { repo: 'bybridge', stars: '★ 31', note: 'Zero-copy IPC for Linux' },
    { repo: 'aegislayer', stars: '★ 27', note: 'Telemetry security agent' },
    { repo: 'dotfiles', stars: '★ 19', note: 'Minimal Linux workstation' },
];

export default function GitHubActivitySection() {
    const sectionRef = usePageReveal({ selector: '.github-canvas, .story-card', y: 36, stagger: 0.12 });

    return (
        <section ref={sectionRef} className="relative w-full z-10 flex flex-col items-center">
            <div className="w-full flex flex-col md:flex-row items-start justify-between gap-5">
                <p className="text-sm md:text-base text-[var(--color-geyser)]/50 font-inter font-light leading-relaxed md:max-w-sm">
                    Live 3D architectural representation of my GitHub commits over the last 365 days. Drag to orbit the structure.
                </p>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="h-px flex-1 md:flex-none md:w-16 bg-ink/20" />
                    <span className="meta-tag text-[var(--color-geyser)]/50">GitHub API · live</span>
                </div>
            </div>

            {/* 3D Canvas Container */}
            <div
                data-cursor="Orbit Model"
                className="github-canvas w-full h-[320px] md:h-[420px] border border-ink/30 rounded-none relative overflow-hidden bg-transparent shadow-none"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />
                <GitHub3DGraph username="GitGuru29" />
            </div>

            {/* Commit Ledger — static fallback + editorial record */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">
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
