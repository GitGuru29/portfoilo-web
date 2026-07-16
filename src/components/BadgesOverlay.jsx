import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { badgesData } from '../data/badges';

export default function BadgesOverlay() {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const badgeRefs = useRef([]);

    useEffect(() => {
        gsap.fromTo(titleRef.current,
            { opacity: 0, y: 50, skewY: 2 },
            {
                opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: "power4.out",
                force3D: true,
                scrollTrigger: { trigger: containerRef.current, start: "top 80%" }
            }
        );

        gsap.fromTo(badgeRefs.current,
            { opacity: 0, y: 30, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1, duration: 1.0, stagger: 0.1, ease: "power3.out",
                force3D: true,
                scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section id="badges" ref={containerRef} className="w-full py-32 px-6 flex flex-col items-center pointer-events-none z-10 relative">
            <div className="structural-line structural-line-h top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl hidden lg:block" />

            <div className="max-w-7xl w-full pointer-events-auto flex flex-col items-center">
                
                <div ref={titleRef} className="mb-16 md:mb-24 flex flex-col items-center text-center">
                    <span className="text-xs md:text-sm font-space tracking-[0.4em] text-[var(--color-geyser)]/40 mb-4 md:mb-6 uppercase">
                        Community
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-space font-light text-[var(--color-geyser)] leading-tight">
                        Developer Badges.
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {badgesData.map((badge, index) => {
                        return (
                            <div 
                                key={index} 
                                ref={el => badgeRefs.current[index] = el} 
                                data-cursor="Google Dev" 
                                className={`p-8 rounded-3xl border border-[var(--color-geyser)]/10 flex flex-col h-full hover:border-blue-400/30 bg-[var(--color-quantum-black)]/40 backdrop-blur-md shadow-[0_15px_40px_-10px_rgba(59,130,246,0.25)] bg-gradient-to-br from-blue-900/10 to-transparent transition-all duration-500 group relative overflow-hidden will-change-transform hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.4)] hover:bg-[var(--color-quantum-black)]/60`}
                            >
                                <div className="absolute top-0 left-0 w-[2px] h-full bg-blue-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-[0.16,1,0.3,1] origin-top" />
                                
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-lg">
                                        <img src={badge.image} alt={badge.title} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-[10px] font-space text-[var(--color-geyser)]/60 uppercase text-right ml-4 mt-2">{badge.date}</span>
                                </div>
                                
                                <h3 className="text-lg font-space font-light text-[var(--color-geyser)] mb-4 transition-colors duration-300">
                                    {badge.title}
                                </h3>
                                
                                <p className="text-[var(--color-geyser)]/50 font-inter font-light text-xs leading-relaxed flex-grow">
                                    {badge.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
