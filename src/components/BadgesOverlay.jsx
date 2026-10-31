import React from 'react';
import usePageReveal from '../utils/usePageReveal';
import { badgesData } from '../data/badges';

export default function BadgesOverlay() {
    const containerRef = usePageReveal({ selector: '.badge-card', y: 30, scale: 0.97, stagger: 0.08 });

    return (
        <section id="badges" ref={containerRef} className="w-full flex flex-col relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {badgesData.map((badge, index) => (
                    <a
                        key={index}
                        href={badge.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="Google Dev"
                        className="badge-card p-5 rounded-none border border-ink/20 hover:border-accent bg-panel hover:bg-panel-deep flex flex-col h-full transition-all duration-300 group relative overflow-hidden will-change-transform hover:-translate-y-1 shadow-[0_4px_16px_rgba(23,19,15,0.06)] no-underline cursor-pointer"
                    >
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[0.16,1,0.3,1] origin-top" />

                        <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b border-ink/15 font-mono text-[9px] uppercase tracking-[0.2em] text-graphite">
                            <span>BADGE // 0{index + 1}</span>
                            <span className="text-accent font-bold group-hover:translate-x-0.5 transition-transform">VERIFY ↗</span>
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div className="w-14 h-14 p-1.5 bg-panel-deep border border-ink/15 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-accent/50">
                                <img src={badge.image} alt={badge.title} className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[10px] font-mono text-graphite uppercase text-right ml-2 mt-1">{badge.date}</span>
                        </div>

                        <h3 className="text-base font-display font-bold text-ink mb-2 leading-snug transition-colors duration-300 group-hover:text-accent">
                            {badge.title}
                        </h3>

                        <p className="text-ink/75 font-serif text-xs leading-relaxed flex-grow">
                            {badge.description}
                        </p>
                    </a>
                ))}
            </div>
        </section>
    );
}

