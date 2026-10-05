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
                            className={`cert-card p-6 rounded-none border flex flex-col h-full bg-panel hover:bg-panel-deep transition-all duration-300 group relative overflow-hidden will-change-transform hover:-translate-y-1 ${
                                cert.verified
                                    ? 'border-ink/20 hover:border-accent/60 shadow-[0_4px_16px_rgba(23,19,15,0.06)]'
                                    : 'border-ink/10 hover:border-ink/30 opacity-80 hover:opacity-100'
                            }`}
                        >
                            <div className={`absolute top-0 left-0 w-[2px] h-full scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[0.16,1,0.3,1] origin-top ${cert.verified ? 'bg-accent' : 'bg-ink/30'}`} />

                            {/* Logo + Date row */}
                            <div className="flex justify-between items-start mb-5 gap-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 p-1.5 bg-panel-deep/60 border border-ink/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                                    <img src={cert.image} alt={cert.issuer} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col items-end gap-1.5 mt-1">
                                    {cert.verified ? (
                                        <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-accent border border-accent/40 bg-accent/10 px-2 py-0.5 flex items-center gap-1 font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-graphite border border-ink/15 px-2 py-0.5">
                                            In Progress
                                        </span>
                                    )}
                                    <span className="text-[10px] font-mono uppercase text-graphite">{cert.date}</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-space font-bold text-ink mb-2 transition-colors duration-300 group-hover:text-accent">
                                {cert.title}
                            </h3>

                            {/* Issuer */}
                            <div className="text-[10px] font-mono uppercase tracking-widest text-graphite/80 mb-3">
                                {cert.issuer}
                            </div>

                            {/* Description */}
                            <p className="font-sans text-sm text-graphite leading-relaxed flex-grow">
                                {cert.description}
                            </p>

                            {/* CTA */}
                            {cert.verified ? (
                                <a
                                    href={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-mono font-bold uppercase text-accent hover:text-accent-hot transition-colors"
                                >
                                    View Credential <span className="inline-block transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                                </a>
                            ) : (
                                <span className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-mono uppercase text-graphite">
                                    Self-Study Track…
                                </span>
                            )}
                        </div>
                    ))}
                </div>
        </section>
    );
}
