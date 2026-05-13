import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, ExternalLink } from 'lucide-react';

const placeholderCertificates = [
    {
        title: "eJPT - eLearnSecurity Junior Penetration Tester",
        issuer: "INE / eLearnSecurity",
        date: "2025 (Expected)",
        description: "Hands-on penetration testing certification covering networking, web apps, and system exploitation.",
        link: "#",
        icon: <Award className="w-8 h-8 text-cyber-cyan" />
    },
    {
        title: "Red Hat Certified System Administrator (RHCSA)",
        issuer: "Red Hat",
        date: "2024",
        description: "Core system administration skills in Red Hat Enterprise Linux environments.",
        link: "#",
        icon: <Award className="w-8 h-8 text-[#cc0000]" />
    },
    {
        title: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        date: "2024",
        description: "Designing distributed systems and deploying secure, robust applications on AWS.",
        link: "#",
        icon: <Award className="w-8 h-8 text-[#FF9900]" />
    }
];

export default function CertificatesOverlay() {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const certRefs = useRef([]);

    useEffect(() => {
        gsap.fromTo(titleRef.current,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: containerRef.current, start: "top 80%" }
            }
        );

        gsap.fromTo(certRefs.current,
            { opacity: 0, y: 50, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.2, ease: "back.out(1.5)",
                scrollTrigger: { trigger: containerRef.current, start: "top 70%" }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section id="certificates" ref={containerRef} className="w-full py-32 px-6 flex flex-col items-center pointer-events-none z-10 relative">
            <div className="max-w-6xl w-full pointer-events-auto flex flex-col items-center">
                
                <div ref={titleRef} className="mb-16 text-center opacity-0">
                    <span className="text-sm font-space tracking-widest text-cyber-violet mb-4 uppercase flex justify-center items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyber-violet animate-pulse shadow-[0_0_10px_var(--theme-secondary)]" />
                        Credentials
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        INDUSTRY <span className="text-cyber-cyan drop-shadow-[0_0_20px_rgba(0,243,255,0.4)]">CERTIFICATES</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {placeholderCertificates.map((cert, index) => (
                        <div key={index} ref={el => certRefs.current[index] = el} className="glass p-8 rounded-3xl border border-white/5 bg-cyber-dark/80 backdrop-blur-xl flex flex-col h-full hover:border-cyber-cyan/30 hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] transition-all duration-500 group">
                            
                            <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-flex w-max group-hover:scale-110 group-hover:bg-cyber-cyan/10 transition-all duration-300">
                                {cert.icon}
                            </div>
                            
                            <h3 className="text-xl font-orbitron font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors duration-300">
                                {cert.title}
                            </h3>
                            
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-space text-gray-400 tracking-wider uppercase">{cert.issuer}</span>
                                <span className="text-sm font-mono text-cyber-violet/80 bg-cyber-violet/10 px-2 py-1 rounded">{cert.date}</span>
                            </div>
                            
                            <p className="text-gray-400 font-inter font-light text-sm leading-relaxed flex-grow">
                                {cert.description}
                            </p>
                            
                            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-space uppercase tracking-widest text-cyber-cyan hover:text-white transition-colors">
                                View Credential
                                <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
