import React from 'react';
import usePageReveal from '../utils/usePageReveal';

const placeholderCertificates = [
    {
        serial: 'CERT-01',
        title: "Frontend Developer (React)",
        issuer: "HackerRank",
        date: "2026",
        id: "F5B570E3BB1B",
        description: "Verified proficiency in React fundamentals including hooks, state management, component lifecycle, and building modern UI interfaces.",
        link: "https://www.hackerrank.com/certificates/iframe/f5b570e3bb1b",
        image: "/hackerrank-logo.png",
        verified: true
    },
    {
        serial: 'CERT-02',
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
        serial: 'CERT-03',
        title: "Java (Intermediate)",
        issuer: "HackerRank",
        date: "2026",
        id: "HR-JAVA-INT",
        description: "Verified intermediate Java covering generics, concurrency, collections, and integer/string manipulation across time-constrained problems.",
        link: "https://www.hackerrank.com/certificates",
        image: "/hackerrank-logo.png",
        verified: true
    },
    {
        serial: 'TRACK-04',
        title: "Kotlin for Android Development",
        issuer: "JetBrains Academy",
        date: "In Progress",
        id: "JB-KT-AOSP",
        description: "Building toward certification in Kotlin coroutines, Android toolchain internals, Gradle modules, and reactive UI architecture.",
        link: "#",
        image: "/sn-logo.png",
        verified: false
    },
    {
        serial: 'TRACK-05',
        title: "Linux Systems Administration (LPIC-style)",
        issuer: "Linux Professional Institute",
        date: "In Progress",
        id: "LPI-SYS-101",
        description: "Working towards LPIC-level coverage: filesystem hierarchy, process management, shell scripting, networking, and security hardening.",
        link: "#",
        image: "/sn-logo.png",
        verified: false
    },
    {
        serial: 'TRACK-06',
        title: "Compiler Construction & LLVM",
        issuer: "Independent Study",
        date: "In Progress",
        id: "LLVM-IR-SSA",
        description: "Structured self-study across lexers, parsers, SSA form, and LLVM IR passes — the materials behind the AeroLang compiler work.",
        link: "#",
        image: "/sn-logo.png",
        verified: false
    }
];

export default function CertificatesOverlay() {
    const containerRef = usePageReveal({ selector: '.cert-card', y: 30, scale: 0.97, stagger: 0.08 });

    return (
        <section id="certificates" ref={containerRef} className="w-full flex flex-col relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full">
                {placeholderCertificates.map((cert, index) => (
                    <div
                        key={index}
                        data-cursor="View Credential"
                        className={`cert-card p-6 rounded-none border flex flex-col h-full bg-panel hover:bg-panel-deep transition-all duration-300 group relative overflow-hidden will-change-transform hover:-translate-y-1 ${
                            cert.verified
                                ? 'border-ink/25 hover:border-accent shadow-[0_4px_16px_rgba(23,19,15,0.06)]'
                                : 'border-ink/15 hover:border-ink/35 opacity-85 hover:opacity-100'
                        }`}
                    >
                        <div className={`absolute top-0 left-0 w-[3px] h-full scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[0.16,1,0.3,1] origin-top ${cert.verified ? 'bg-accent' : 'bg-ink/40'}`} />

                        {/* Top Serial Bar */}
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink/15 font-mono text-[9px] uppercase tracking-[0.2em] text-graphite">
                            <span>{cert.serial} // ID: {cert.id}</span>
                            <span>{cert.date}</span>
                        </div>

                        {/* Logo + Status row */}
                        <div className="flex justify-between items-start mb-4 gap-4">
                            <div className="w-12 h-12 p-1.5 bg-panel-deep border border-ink/15 flex items-center justify-center transition-all duration-300 group-hover:border-accent/50">
                                <img src={cert.image} alt={cert.issuer} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                                {cert.verified ? (
                                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-accent border border-accent/40 bg-accent/10 px-2.5 py-0.5 flex items-center gap-1.5 font-bold">
                                        <span className="w-1.5 h-1.5 bg-accent animate-pulse inline-block" />
                                        Verified Seal
                                    </span>
                                ) : (
                                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-graphite border border-ink/20 bg-panel-deep px-2.5 py-0.5">
                                        Active Track
                                    </span>
                                )}
                                <span className="text-[10px] font-mono uppercase tracking-widest text-graphite font-semibold">
                                    {cert.issuer}
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-display font-bold text-ink mb-2.5 leading-snug transition-colors duration-300 group-hover:text-accent">
                            {cert.title}
                        </h3>

                        {/* Description */}
                        <p className="font-serif text-xs md:text-sm text-ink/80 leading-relaxed flex-grow">
                            {cert.description}
                        </p>

                        {/* CTA */}
                        <div className="mt-5 pt-3.5 border-t border-ink/10 flex items-center justify-between">
                            {cert.verified ? (
                                <a
                                    href={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-mono font-bold uppercase text-accent hover:text-ink transition-colors"
                                >
                                    Inspect Certificate <span className="inline-block transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                                </a>
                            ) : (
                                <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-mono uppercase text-graphite">
                                    Curriculum In Progress
                                </span>
                            )}
                            <span className="text-[9px] font-mono text-graphite/60 uppercase">FOLIO 06</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

