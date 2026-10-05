import React from 'react';
import usePageReveal from '../utils/usePageReveal';
import { badgesData } from '../data/badges';

export default function BadgesOverlay() {
    const containerRef = usePageReveal({ selector: '.badge-card', y: 30, scale: 0.97, stagger: 0.08 });

    return (
        <section id="badges" ref={containerRef} className="w-full flex flex-col relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full">
                    {badgesData.map((badge, index) => {
                        return (
                            <a
                                key={index}
                                href={badge.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-cursor="Google Dev"
                                className="badge-card p-5 rounded-none border border-ink/15 hover:border-accent/60 bg-panel hover:bg-panel-deep flex flex-col h-full transition-all duration-300 group relative overflow-hidden will-change-transform hover:-translate-y-1 shadow-[0_4px_16px_rgba(23,19,15,0.06)] no-underline cursor-pointer"
                            >
                                <div className="absolute top-0 left-0 w-[2px] h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[0.16,1,0.3,1] origin-top" />

                                {/* External link icon – appears on hover */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 p-1 bg-panel-deep/60 border border-ink/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                                        <img src={badge.image} alt={badge.title} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-[10px] font-mono text-graphite uppercase text-right ml-2 mt-1">{badge.date}</span>
                                </div>

                                <h3 className="text-sm md:text-base font-space font-bold text-ink mb-2 transition-colors duration-300 group-hover:text-accent">
                                    {badge.title}
                                </h3>

                                <p className="text-graphite font-sans text-xs leading-relaxed flex-grow">
                                    {badge.description}
                                </p>
                            </a>
                        );
                    })}
                </div>
        </section>
    );
}
