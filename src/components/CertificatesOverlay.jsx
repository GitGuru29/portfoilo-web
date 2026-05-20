import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const placeholderCertificates = [
    {
        title: "eJPT - eLearnSecurity Junior Penetration Tester",
        issuer: "INE / eLearnSecurity",
        date: "2025 (Expected)",
        description: "Hands-on penetration testing certification covering networking, web apps, and system exploitation.",
        link: "#"
    },
    {
        title: "Red Hat Certified System Administrator (RHCSA)",
        issuer: "Red Hat",
        date: "2024",
        description: "Core system administration skills in Red Hat Enterprise Linux environments.",
        link: "#"
    },
    {
        title: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        date: "2024",
        description: "Designing distributed systems and deploying secure, robust applications on AWS.",
        link: "#"
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
            { opacity: 0, y: 50, scale: 0.98 },
            {
                opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: "power3.out",
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {placeholderCertificates.map((cert, index) => (
                        <div key={index} ref={el => certRefs.current[index] = el} data-cursor="View Credential" className="p-8 md:p-10 border border-[var(--color-geyser)]/10 flex flex-col h-full hover:border-[var(--color-geyser)]/30 bg-[var(--color-quantum-black)] hover:bg-[var(--color-geyser)]/[0.02] transition-colors duration-500 group relative overflow-hidden will-change-all">
                            
                            <div className="absolute top-0 left-0 w-[2px] h-full bg-[var(--color-geyser)] scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-[0.16,1,0.3,1] origin-top" />

                            <div className="flex justify-between items-start mb-8 gap-4">
                                <span className="text-[10px] font-space text-[var(--color-geyser)]/50 tracking-[0.2em] uppercase">{cert.issuer}</span>
                                <span className="text-[10px] font-space text-[var(--color-geyser)]/80 uppercase">{cert.date}</span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-space font-light text-[var(--color-geyser)] mb-6 transition-colors duration-300">
                                {cert.title}
                            </h3>
                            
                            <p className="text-[var(--color-geyser)]/60 font-inter font-light text-sm leading-relaxed flex-grow">
                                {cert.description}
                            </p>
                            
                            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-space uppercase text-[var(--color-geyser)]/40 group-hover:text-[var(--color-geyser)] transition-colors">
                                View Credential <span className="inline-block transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                            </a>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
