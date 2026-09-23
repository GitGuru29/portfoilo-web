import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Typewriter from './Typewriter';

gsap.registerPlugin(ScrollTrigger);

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
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(titleRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
                    scrollTrigger: { trigger: containerRef.current, start: "top 80%" }
                }
            );
            gsap.fromTo(cardsRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "power3.out",
                    force3D: true,
                    scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="skills" ref={containerRef} className="w-full py-32 px-6 flex flex-col items-center bg-transparent relative z-10">

            {/* Header */}
            <div ref={titleRef} className="w-full max-w-7xl mx-auto flex flex-col mb-16 md:mb-20 px-4">
                <span className="kicker mb-5">
                    <Typewriter text="Market Indices & Classifieds" triggerOnScroll={true} loop={false} cursorChar="_" />
                </span>
                <h2 className="poster-title uppercase text-3xl md:text-5xl lg:text-6xl text-geyser leading-none">
                    <Typewriter text={["Market Indices.", "Classifieds & Rates.", "Stack Quotations."]} triggerOnScroll={true} pauseDuration={3000} cursorChar="_" />
                </h2>
            </div>

            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 px-4">

                {/* MARKET INDICES table */}
                <div ref={el => cardsRef.current[0] = el} className="story-card p-6 md:p-8">
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
                <div className="flex flex-col gap-8">
                    <div ref={el => cardsRef.current[1] = el} className="story-card p-6 md:p-8">
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

                    <div ref={el => cardsRef.current[2] = el} className="story-card p-6 md:p-8">
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