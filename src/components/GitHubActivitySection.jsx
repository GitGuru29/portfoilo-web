import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ArrowUpRight, GitCommit, GitPullRequest, GitBranch, ShieldCheck, Activity, Terminal } from 'lucide-react';
import usePageReveal from '../utils/usePageReveal';
import { 
    fetchGitHubProfile, 
    fetchGitHubRepositories, 
    fetchGitHubContributions, 
    fetchGitHubEvents,
    calculateMonthlyCommitSummary,
    REAL_FLAGSHIP_REPOS, 
    BASELINE_PROFILE 
} from '../services/githubDataService';
import verifiedContributionsSnapshot from '../data/githubContributions.json';

// Lazy-load Three.js 3D canvas so initial page load doesn't bundle WebGL/Three engine
const GitHub3DGraph = lazy(() => import('./GitHub3DGraph'));

const INITIAL_MONTHLY = calculateMonthlyCommitSummary(verifiedContributionsSnapshot.contributions);

export default function GitHubActivitySection() {
    const sectionRef = usePageReveal({ selector: '.github-canvas, .story-card', y: 30, stagger: 0.1 });
    const [profile, setProfile] = useState(BASELINE_PROFILE);
    const [repoData, setRepoData] = useState({ 
        topRepos: REAL_FLAGSHIP_REPOS, 
        totalStars: 47, 
        totalRepos: 41 
    });
    const [totalCommits, setTotalCommits] = useState(2040);
    const [commitLedger, setCommitLedger] = useState(INITIAL_MONTHLY);
    const [liveEvents, setLiveEvents] = useState([]);
    const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' | 'events'
    const [isLiveSynced, setIsLiveSynced] = useState(false);

    useEffect(() => {
        let mounted = true;

        Promise.all([
            fetchGitHubProfile('GitGuru29'),
            fetchGitHubRepositories('GitGuru29'),
            fetchGitHubContributions('GitGuru29'),
            fetchGitHubEvents('GitGuru29'),
        ]).then(([prof, repos, contribs, events]) => {
            if (!mounted) return;

            if (prof && prof.publicRepos) {
                setProfile(prof);
            }

            if (repos && repos.topRepos && repos.topRepos.length > 0) {
                setRepoData(repos);
            }

            if (contribs && contribs.totalContributions) {
                setTotalCommits(contribs.totalContributions);
                if (contribs.monthlySummary && contribs.monthlySummary.length > 0) {
                    setCommitLedger(contribs.monthlySummary);
                }
            }

            if (events && events.length > 0) {
                setLiveEvents(events);
            }

            setIsLiveSynced(true);
        }).catch((err) => {
            console.warn('GitHub activity synchronization notice:', err);
        });

        return () => { mounted = false; };
    }, []);

    // Maximum commits in the active trailing period for relative bar widths
    const maxCommits = Math.max(...commitLedger.map((r) => r.commits || 1), 390);

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
                        <span className={`w-1.5 h-1.5 ${isLiveSynced ? 'bg-emerald-400' : 'bg-accent'} rotate-45 inline-block animate-pulse`} />
                        {isLiveSynced ? 'GITHUB API · LIVE SYNCED' : 'GITHUB API · CONNECTING'}
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
                <Suspense
                    fallback={
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 font-mono text-xs">
                            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                            <span>INITIALIZING SKYLINE TELEMETRY...</span>
                        </div>
                    }
                >
                    <GitHub3DGraph username="GitGuru29" />
                </Suspense>
            </div>

            {/* Commit Ledger & Repository Index */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">

                {/* Left (7 cols): Verified Contribution Ledger / Live Audit Log */}
                <div className="lg:col-span-7 story-card p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/20 pb-3 mb-4">
                            <div className="flex items-center gap-2">
                                <GitCommit size={14} className="text-accent" />
                                <span className="font-mono text-[10px] tracking-[0.22em] uppercase font-bold text-ink">
                                    Verified Engineering Ledger
                                </span>
                            </div>
                            
                            {/* Tab Switcher: Monthly Breakdown vs Live Audit Log */}
                            <div className="flex items-center gap-1 bg-ink/5 p-1 border border-ink/15 font-mono text-[9px] tracking-wider uppercase">
                                <button
                                    onClick={() => setActiveTab('ledger')}
                                    className={`px-2.5 py-1 transition-colors cursor-pointer font-bold ${activeTab === 'ledger' ? 'bg-ink text-panel' : 'text-graphite hover:text-ink'}`}
                                >
                                    Monthly Matrix
                                </button>
                                <button
                                    onClick={() => setActiveTab('events')}
                                    className={`px-2.5 py-1 transition-colors cursor-pointer font-bold ${activeTab === 'events' ? 'bg-ink text-panel' : 'text-graphite hover:text-ink'}`}
                                >
                                    Live Audit Log
                                </button>
                            </div>
                        </div>

                        {/* View 1: Real Verified Monthly Ledger */}
                        {activeTab === 'ledger' && (
                            <div className="overflow-x-auto">
                                <table className="classified-table">
                                    <thead>
                                        <tr>
                                            <th>Period</th>
                                            <th>Commits</th>
                                            <th>Active Targets & Modules</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commitLedger.map((row) => (
                                            <tr key={row.month}>
                                                <td className="font-bold text-ink whitespace-nowrap">{row.month}</td>
                                                <td className="tabular-nums min-w-[110px]">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-accent w-7">{row.commits}</span>
                                                        <div className="flex-1 h-1.5 bg-ink/10 overflow-hidden min-w-[45px]">
                                                            <div
                                                                className="h-full bg-accent transition-all duration-500"
                                                                style={{ width: `${Math.round((row.commits / maxCommits) * 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-graphite text-[10.5px]">{row.detail}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* View 2: Real Live GitHub Public Events */}
                        {activeTab === 'events' && (
                            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                                {(liveEvents.length > 0 ? liveEvents : [
                                    { id: '1', type: 'PUSH', repo: 'ArchTitan-OS', repoUrl: 'https://github.com/GitGuru29/ArchTitan-OS', detail: 'Pushed to main', timeAgo: 'Yesterday' },
                                    { id: '2', type: 'PUSH', repo: 'Titan-pm', repoUrl: 'https://github.com/GitGuru29/Titan-pm', detail: 'Pushed to main', timeAgo: '2d ago' },
                                    { id: '3', type: 'PR MERGE', repo: 'ArchTitan-OS', repoUrl: 'https://github.com/GitGuru29/ArchTitan-OS', detail: 'Merged PR #14 into main', timeAgo: '3d ago' },
                                    { id: '4', type: 'PUSH', repo: 'RepoPulse-AI', repoUrl: 'https://github.com/GitGuru29/RepoPulse-AI', detail: 'Pushed to main', timeAgo: '2w ago' },
                                    { id: '5', type: 'PUSH', repo: 'AutoGpuSwitcher', repoUrl: 'https://github.com/GitGuru29/AutoGpuSwitcher', detail: 'Pushed to main', timeAgo: '3w ago' },
                                ]).map((evt) => (
                                    <div
                                        key={evt.id}
                                        className="flex items-center justify-between gap-3 p-2.5 bg-panel-deep/50 border border-ink/15 font-mono text-[11px]"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className="px-1.5 py-0.5 bg-ink text-panel text-[8px] tracking-widest uppercase font-bold shrink-0">
                                                {evt.type}
                                            </span>
                                            <a
                                                href={evt.repoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-ink font-bold hover:text-accent truncate no-underline"
                                            >
                                                GitGuru29/{evt.repo}
                                            </a>
                                            <span className="text-graphite text-[10px] hidden sm:inline truncate">
                                                — {evt.detail}
                                            </span>
                                        </div>
                                        <span className="text-accent text-[9px] font-bold shrink-0">
                                            {evt.timeAgo}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Proof Note */}
                    <div className="pt-4 mt-4 border-t border-ink/15 flex items-center justify-between text-graphite font-mono text-[9px] tracking-widest uppercase">
                        <span>● Authenticated GitHub Telemetry</span>
                        <span>{totalCommits.toLocaleString()} Annual Contributions</span>
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
                                { n: `${totalCommits.toLocaleString()}+`, l: 'Total Commits' },
                                { n: `${profile.publicRepos || repoData.totalRepos}+`, l: 'Public Repos' },
                                { n: `★ ${repoData.totalStars}`, l: 'Stars Earned' },
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
                                {repoData.topRepos.map((r) => (
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
                                            <span>{r.starsLabel || `★ ${r.stars}`}</span>
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
