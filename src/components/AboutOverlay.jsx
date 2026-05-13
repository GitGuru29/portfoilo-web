import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Shield, Smartphone, Terminal } from 'lucide-react';

const arsenal = [
    { icon: <Smartphone />, title: 'Android & AOSP', desc: 'Deep dive into OS internals & Native Android' },
    { icon: <Terminal />, title: 'Systems Programming', desc: 'C++, Linux Daemons, Low-level behavior' },
    { icon: <Shield />, title: 'Security', desc: 'Security-aware development and research' },
    { icon: <Cpu />, title: 'Performance', desc: 'System-level optimization & resource analysis' }
];

export default function AboutOverlay() {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const titleRef = useRef(null);
    const arsenalRefs = useRef([]);
    const listRefs = useRef([]);

    useEffect(() => {
        gsap.to(contentRef.current, {
            opacity: 1,
            duration: 1,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            }
        });

        gsap.fromTo(titleRef.current,
            { opacity: 0, x: -50, filter: 'blur(10px)' },
            {
                opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: titleRef.current, start: "top 85%" }
            }
        );

        gsap.fromTo(arsenalRefs.current,
            { opacity: 0, y: 50, scale: 0.9 },
            {
                opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.7)",
                scrollTrigger: { trigger: arsenalRefs.current[0], start: "top 85%" }
            }
        );

        if (listRefs.current.length > 0) {
            gsap.fromTo(listRefs.current,
                { opacity: 0, x: -20 },
                {
                    opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out",
                    scrollTrigger: { trigger: listRefs.current[0], start: "top 85%" }
                }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section id="about" ref={containerRef} className="w-full py-20 px-6 flex flex-col items-center pointer-events-none mt-20">
            <div ref={contentRef} className="max-w-5xl w-full pointer-events-auto flex flex-col items-center opacity-0">

                <div ref={titleRef} className="glass p-12 rounded-3xl border border-white/5 bg-cyber-dark/60 backdrop-blur-xl mb-12 w-full hover:border-cyber-cyan/30 transition-colors duration-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-white">The System Architecture</h2>
                    <p className="text-xl md:text-2xl text-gray-300 font-inter font-light leading-relaxed mb-10">
                        I am a software engineer specializing in system-level architecture, native Android development, and Linux infrastructure. My core focus is on engineering for maximum performance, determinism, and absolute reliability across low-level environments.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 text-gray-300 font-inter font-light">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h3 className="text-cyber-cyan font-space uppercase tracking-widest text-sm mb-5 font-bold flex items-center gap-3"><span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full shadow-[0_0_8px_#00f3ff]"></span>WHAT I BUILD</h3>
                            <ul className="list-none space-y-3">
                                <li ref={el => el && !listRefs.current.includes(el) && listRefs.current.push(el)} className="flex items-start gap-3"><span className="text-cyber-cyan opacity-60 mt-1.5 text-xs">▹</span> Android system-level applications</li>
                                <li ref={el => el && !listRefs.current.includes(el) && listRefs.current.push(el)} className="flex items-start gap-3"><span className="text-cyber-cyan opacity-60 mt-1.5 text-xs">▹</span> Linux CLI + automation tools</li>
                                <li ref={el => el && !listRefs.current.includes(el) && listRefs.current.push(el)} className="flex items-start gap-3"><span className="text-cyber-cyan opacity-60 mt-1.5 text-xs">▹</span> Performance + optimization systems</li>
                                <li ref={el => el && !listRefs.current.includes(el) && listRefs.current.push(el)} className="flex items-start gap-3"><span className="text-cyber-cyan opacity-60 mt-1.5 text-xs">▹</span> Experimental OS concepts (ArchTitan)</li>
                                <li ref={el => el && !listRefs.current.includes(el) && listRefs.current.push(el)} className="flex items-start gap-3"><span className="text-cyber-cyan opacity-60 mt-1.5 text-xs">▹</span> Developer productivity tools</li>
                            </ul>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h3 className="text-cyber-violet font-space uppercase tracking-widest text-sm mb-5 font-bold flex items-center gap-3"><span className="w-1.5 h-1.5 bg-cyber-violet rounded-full shadow-[0_0_8px_var(--theme-secondary)]"></span>FOCUS AREAS</h3>
                            <ul className="list-none space-y-3">
                                <li ref={el => el && !listRefs.current.includes(el) && listRefs.current.push(el)} className="flex items-start gap-3"><span className="text-cyber-violet opacity-60 mt-1.5 text-xs">▹</span> System software engineering</li>
                                <li ref={el => el && !listRefs.current.includes(el) && listRefs.current.push(el)} className="flex items-start gap-3"><span className="text-cyber-violet opacity-60 mt-1.5 text-xs">▹</span> Android OS-level development</li>
                                <li ref={el => el && !listRefs.current.includes(el) && listRefs.current.push(el)} className="flex items-start gap-3"><span className="text-cyber-violet opacity-60 mt-1.5 text-xs">▹</span> Linux tooling and automation</li>
                                <li ref={el => el && !listRefs.current.includes(el) && listRefs.current.push(el)} className="flex items-start gap-3"><span className="text-cyber-violet opacity-60 mt-1.5 text-xs">▹</span> Performance optimization systems</li>
                                <li ref={el => el && !listRefs.current.includes(el) && listRefs.current.push(el)} className="flex items-start gap-3"><span className="text-cyber-violet opacity-60 mt-1.5 text-xs">▹</span> Cross-device engineering (Android ↔ Linux)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {arsenal.map((item, index) => (
                        <div key={index} ref={el => arsenalRefs.current[index] = el} className="glass p-8 rounded-2xl border border-white/5 bg-cyber-dark/60 backdrop-blur-md flex gap-6 items-start hover:bg-cyber-cyan/5 hover:border-cyber-cyan/40 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] transition-all duration-300 group">
                            <div className="p-4 bg-cyber-cyan/10 rounded-2xl text-cyber-cyan border border-cyber-cyan/20 flex-shrink-0 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-space font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">{item.title}</h3>
                                <p className="text-gray-400 font-inter font-light">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
