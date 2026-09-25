import React from 'react';
import usePageReveal from '../utils/usePageReveal';

const MARKET_ROWS = [
    { item: 'C / C++', index: '95', delta: '▲ steady' },
    { item: 'Kotlin / Java', index: '90', delta: '▲ steady' },
    { item: 'Linux Internals', index: '92', delta: '▲ firming' },
    { item: 'Android NDK', index: '88', delta: '— flat' },
    { item: 'Bash / Shell', index: '85', delta: '— flat' },
    { item: 'Python', index: '80', delta: '▼ cooling' },
];

const COMMODITY_ROWS = [
    { item: 'Algorithmic Efficiency', rate: 'O(1)' },
    { item: 'Latency Targets', rate: '<1 ms' },
    { item: 'Systems Shipped', rate: '12+' },
    { item: 'Years of Practice', rate: '3+' },
];

const CLASSIFIEDS = [
    'LLVM IR · backend & pass work',
    'Compiler Design · front-end to IR',
    'System Design · distributed',
    'Reverse Engineering · ΔN',
    'POSIX / daemons / kernels',
    'CMake & GCC build systems',
    'Docker · container isolation',
    'AWS · cloud deployment',
    'React · web front-ends',
];

export default function SkillsOverlay() {
    const containerRef = usePageReveal({ selector: '.story-card', y: 36, stagger: 0.12 });

    return (
        <section id="skills" ref={containerRef} className="w-full flex flex-col bg-transparent relative z-10">

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">

                {/* MARKET INDICES table */}
                <div className="story-card p-6 md:p-7">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-geyser text-lg md:text-xl font-display font-bold uppercase tracking-tight">Market Indices</h3>
                        <span className="meta-tag text-cyanx">[01]</span>
                    </div>
                    <table className="classified-table">
                        <thead>
                            <tr>
                                <th>Quotation</th>
                                <th>Index</th>
                                <th>Delta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MARKET_ROWS.map((r) => (
                                <tr key={r.item}>
                                    <td className="font-mono">{r.item}</td>
                                    <td className="tabular-nums">{r.index}</td>
                                    <td className="text-accent">{r.delta}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* RATES / COMMODITIES + CLASSIFIEDS */}
                <div className="flex flex-col gap-5 md:gap-6">
                    <div className="story-card p-6 md:p-7">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-geyser text-lg md:text-xl font-display font-bold uppercase tracking-tight">Rates &amp; Commodities</h3>
                            <span className="meta-tag text-cyanx">[02]</span>
                        </div>
                        <table className="classified-table">
                            <thead>
                                <tr>
                                    <th>Commodity</th>
                                    <th>Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMMODITY_ROWS.map((r) => (
                                    <tr key={r.item}>
                                        <td className="font-mono">{r.item}</td>
                                        <td className="tabular-nums text-accent">{r.rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="story-card p-6 md:p-7">
                        <div className="flex items-center justify-between mb-5 border-b border-ink pb-3">
                            <h3 className="text-geyser text-lg md:text-xl font-display font-bold uppercase tracking-tight">Classifieds</h3>
                            <span className="meta-tag text-cyanx">[03]</span>
                        </div>
                        <ul className="classified-list">
                            {CLASSIFIEDS.map((c, i) => (
                                <li key={i} className="flex gap-3 items-baseline">
                                    <span className="text-accent font-mono">{String(i + 1).padStart(2, '0')}</span>
                                    <span>{c}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}