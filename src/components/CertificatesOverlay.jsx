import React from 'react';
import usePageReveal from '../utils/usePageReveal';

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
    },
    {
        title: "Java (Intermediate)",
        issuer: "HackerRank",
        date: "2026",
        description: "Verified intermediate Java covering generics, concurrency, collections, and integer/string manipulation across time-constrained problems.",
        link: "https://www.hackerrank.com/certificates",
        image: "/hackerrank-logo.png",
        verified: true
    },
    {
        title: "Kotlin for Android Development",
        issuer: "JetBrains Academy",
        date: "In Progress",
        description: "Building toward certification in Kotlin coroutines, Android toolchain internals, Gradle modules, and reactive UI architecture.",
        link: "#",
        image: "/sn-logo.png",
        verified: false
    },
    {
        title: "Linux Systems Administration (LPIC-style)",
        issuer: "Linux Professional Institute",
        date: "In Progress",
        description: "Working towards LPIC-level coverage: filesystem hierarchy, process management, shell scripting, networking, and security hardening.",
        link: "#",
        image: "/sn-logo.png",
        verified: false
    },
    {
        title: "Compiler Construction & LLVM",
        issuer: "Independent Study",
        date: "In Progress",
        description: "Structured self-study across lexers, parsers, SSA form, and LLVM IR passes — the materials behind the AeroLang compiler work.",
        link: "#",
        image: "/sn-logo.png",
        verified: false
    }
];

export default function CertificatesOverlay() {
    const containerRef = usePageReveal({ selector: '.cert-card', y: 30, scale: 0.97, stagger: 0.1 });

    return (
        <section id="certificates" ref={containerRef} className="w-full flex flex-col relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full">
                    {placeholderCertificates.map((cert, index) => (
                        <div
                            key={index}
                            data-cursor="View Credential"
                            className={`cert-card p-6 rounded-3xl border flex flex-col h-full backdrop-blur-md bg-gradient-to-br transition-all duration-500 group relative overflow-hidden will-change-transform hover:-translate-y-2
                                ${cert.verified
                                    ? 'border-accent/25 hover:border-accent/45 bg-panel-deep/70 from-accent/[0.05] to-transparent shadow-[0_12px_34px_-18px_rgba(23,19,15,0.3)] hover:shadow-[0_18px_44px_-18px_rgba(185,28,28,0.35)]'
                                    : 'border-geyser/8 hover:border-geyser/15 bg-panel from-white/[0.6] to-transparent shadow-[0_12px_34px_-18px_rgba(23,19,15,0.3)] hover:shadow-[0_18px_44px_-18px_rgba(18,18,18,0.3)]'
                                }`}
                        >
                            <div className={`absolute top-0 left-0 w-[2px] h-full scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-[0.16,1,0.3,1] origin-top ${cert.verified ? 'bg-accent' : 'bg-[var(--color-geyser)]/30'}`} />

                            {/* Logo + Date row */}
                            <div className="flex justify-between items-start mb-5 gap-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-lg">
                                    <img src={cert.image} alt={cert.issuer} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col items-end gap-2 mt-1">
                                    {cert.verified && (
                                        <span className="text-[9px] font-space tracking-[0.15em] uppercase text-accent border border-accent/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
                                            Verified
                                        </span>
                                    )}
                                    <span className={`text-[10px] font-space uppercase ${cert.verified ? 'text-accent/70' : 'text-[var(--color-geyser)]/30'}`}>{cert.date}</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className={`text-lg md:text-xl font-space font-light mb-3 transition-colors duration-300 ${cert.verified ? 'text-[var(--color-geyser)]' : 'text-[var(--color-geyser)]/40'}`}>
                                {cert.title}
                            </h3>

                            {/* Description */}
                            <p className={`font-inter font-light text-sm leading-relaxed flex-grow ${cert.verified ? 'text-[var(--color-geyser)]/60' : 'text-[var(--color-geyser)]/25'}`}>
                                {cert.description}
                            </p>

                            {/* CTA */}
                            {cert.verified ? (
                                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-space uppercase text-accent/50 group-hover:text-accent transition-colors">
                                    View Credential <span className="inline-block transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                                </a>
                            ) : (
                                <span className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-space uppercase text-[var(--color-geyser)]/20">
                                    In Progress…
                                </span>
                            )}
                        </div>
                    ))}
                </div>
        </section>
    );
}
