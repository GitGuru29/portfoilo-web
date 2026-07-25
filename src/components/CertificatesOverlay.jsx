import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const placeholderCertificates = [
    {
        title: "Frontend Developer (React)",
        issuer: "HackerRank",
        date: "2026",
        description: "Verified proficiency in React fundamentals including hooks, state management, component lifecycle, and building modern UI interfaces.",
        link: "https://www.hackerrank.com/certificates/iframe/f5b570e3bb1b",
        image: "/hackerrank-logo.png",
        verified: true
    },
    {
        title: "Problem Solving (Intermediate)",
        issuer: "HackerRank",
        date: "24 Jul, 2026",
        id: "09751F9F55D8",
        description: "Certified intermediate-level problem solving skills covering data structures and algorithms including stacks, queues, trees, and dynamic programming.",
        link: "https://www.hackerrank.com/certificates/09751f9f55d8",
        image: "/hackerrank-logo.png",
        verified: true
    }
];

export default function CertificatesOverlay() {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const certRefs = useRef([]);

    useEffect(() => {
        gsap.fromTo(titleRef.current,
            { opacity: 0, y: 50, skewY: 2 },
            {
                opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: "power4.out",
                force3D: true,
                scrollTrigger: { trigger: containerRef.current, start: "top 80%" }
            }
        );

        gsap.fromTo(certRefs.current,
            { opacity: 0, y: 30, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1, duration: 1.0, stagger: 0.12, ease: "power3.out",
                force3D: true,
                scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section id="certificates" ref={containerRef} className="w-full py-32 px-6 flex flex-col items-center pointer-events-none z-10 relative">
            <div className="structural-line structural-line-h top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl hidden lg:block" />

            <div className="max-w-7xl w-full pointer-events-auto flex flex-col items-center">

                <div ref={titleRef} className="mb-16 md:mb-24 flex flex-col items-center text-center">
                    <span className="text-xs md:text-sm font-space tracking-[0.4em] text-[var(--color-geyser)]/40 mb-4 md:mb-6 uppercase">
                        Credentials
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-space font-light text-[var(--color-geyser)] leading-tight">
                        Industry Certificates.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {placeholderCertificates.map((cert, index) => (
                        <div
                            key={index}
                            ref={el => certRefs.current[index] = el}
                            data-cursor="View Credential"
                            className={`p-8 rounded-3xl border flex flex-col h-full backdrop-blur-md bg-gradient-to-br transition-all duration-500 group relative overflow-hidden will-change-transform hover:-translate-y-2
                                ${cert.verified
                                    ? 'border-blue-400/20 hover:border-blue-400/40 bg-[var(--color-quantum-black)]/40 from-blue-900/10 to-transparent shadow-[0_15px_40px_-10px_rgba(59,130,246,0.25)] hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.4)]'
                                    : 'border-[var(--color-geyser)]/8 hover:border-[var(--color-geyser)]/15 bg-[var(--color-quantum-black)]/20 from-white/[0.02] to-transparent shadow-[0_15px_40px_-10px_rgba(59,130,246,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.12)]'
                                }`}
                        >
                            <div className={`absolute top-0 left-0 w-[2px] h-full scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-[0.16,1,0.3,1] origin-top ${cert.verified ? 'bg-blue-400' : 'bg-[var(--color-geyser)]/30'}`} />

                            {/* Logo + Date row */}
                            <div className="flex justify-between items-start mb-8 gap-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-lg">
                                    <img src={cert.image} alt={cert.issuer} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col items-end gap-2 mt-1">
                                    {cert.verified && (
                                        <span className="text-[9px] font-space tracking-[0.15em] uppercase text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
                                            Verified
                                        </span>
                                    )}
                                    <span className={`text-[10px] font-space uppercase ${cert.verified ? 'text-blue-400/70' : 'text-[var(--color-geyser)]/30'}`}>{cert.date}</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className={`text-xl md:text-2xl font-space font-light mb-6 transition-colors duration-300 ${cert.verified ? 'text-[var(--color-geyser)]' : 'text-[var(--color-geyser)]/40'}`}>
                                {cert.title}
                            </h3>

                            {/* Description */}
                            <p className={`font-inter font-light text-sm leading-relaxed flex-grow ${cert.verified ? 'text-[var(--color-geyser)]/60' : 'text-[var(--color-geyser)]/25'}`}>
                                {cert.description}
                            </p>

                            {/* CTA */}
                            {cert.verified ? (
                                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-space uppercase text-blue-400/50 group-hover:text-blue-400 transition-colors">
                                    View Credential <span className="inline-block transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                                </a>
                            ) : (
                                <span className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-space uppercase text-[var(--color-geyser)]/20">
                                    In Progress…
                                </span>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
