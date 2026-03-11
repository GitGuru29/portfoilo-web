import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Shield, Smartphone, Terminal, Database, Network, Settings, Globe, Server } from 'lucide-react';
import {
    SiKotlin, SiPython, SiCplusplus, SiJavascript, SiDart,
    SiAndroid, SiFirebase, SiApachespark, SiMongodb, SiLinux, SiXcode,
    SiGooglecolab, SiCloudinary, SiPostgresql, SiPhp,
    SiGnubash, SiFishshell, SiSwift
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa';

const arsenal = [
    { icon: <Smartphone />, title: 'Android & AOSP', desc: 'Deep dive into OS internals & Native Android' },
    { icon: <Terminal />, title: 'Systems Programming', desc: 'C++, Linux Daemons, Low-level behavior' },
    { icon: <Shield />, title: 'Security', desc: 'Security-aware development and research' },
    { icon: <Cpu />, title: 'Performance', desc: 'System-level optimization & resource analysis' }
];

const techStack = [
    {
        category: "Languages",
        items: [
            { name: "Kotlin", icon: <SiKotlin className="text-[#7F52FF] w-6 h-6" /> },
            { name: "Python", icon: <SiPython className="text-[#3776AB] w-6 h-6" /> },
            { name: "Java", icon: <FaJava className="text-[#007396] w-6 h-6" /> },
            { name: "C/C++", icon: <SiCplusplus className="text-[#00599C] w-6 h-6" /> },
            { name: "JavaScript", icon: <SiJavascript className="text-[#F7DF1E] w-6 h-6" /> },
            { name: "Dart", icon: <SiDart className="text-[#0175C2] w-6 h-6" /> },
            { name: "PHP", icon: <SiPhp className="text-[#777BB3] w-6 h-6" /> },
            { name: "Bash", icon: <SiGnubash className="text-[#4EAA25] w-6 h-6" /> },
            { name: "Fish", icon: <SiFishshell className="text-[#4EAA25] w-6 h-6" /> },
            { name: "Swift", icon: <SiSwift className="text-[#F05138] w-6 h-6" /> }
        ]
    },
    {
        category: "Frameworks & Libraries",
        items: [
            { name: "Android SDK", icon: <SiAndroid className="text-[#3DDC84] w-6 h-6" /> },
            { name: "Jetpack Compose", icon: <SiAndroid className="text-[#4285F4] w-6 h-6" /> },
            { name: "PySpark", icon: <SiApachespark className="text-[#E25A1C] w-6 h-6" /> }
        ]
    },
    {
        category: "Tools & Platforms",
        items: [
            { name: "Firebase", icon: <SiFirebase className="text-[#FFCA28] w-6 h-6" /> },
            { name: "MongoDB", icon: <SiMongodb className="text-[#47A248] w-6 h-6" /> },
            { name: "PostgreSQL", icon: <SiPostgresql className="text-[#336791] w-6 h-6" /> },
            { name: "AWS", icon: <FaAws className="text-[#232F3E] w-6 h-6" /> },
            { name: "Linux", icon: <SiLinux className="text-[#FCC624] w-6 h-6" /> },
            { name: "Xcode", icon: <SiXcode className="text-[#147EFB] w-6 h-6" /> },
            { name: "Colab", icon: <SiGooglecolab className="text-[#F9AB00] w-6 h-6" /> },
            { name: "Cloudinary", icon: <SiCloudinary className="text-[#3448C5] w-6 h-6" /> }
        ]
    },
    {
        category: "Areas of Interest",
        items: [
            { name: "System Design", icon: <Server className="text-gray-400 w-6 h-6" /> },
            { name: "Mobile Architecture", icon: <Smartphone className="text-gray-400 w-6 h-6" /> },
            { name: "Low-Level Comm", icon: <Cpu className="text-gray-400 w-6 h-6" /> },
            { name: "Performance", icon: <Settings className="text-gray-400 w-6 h-6" /> },
            { name: "Distributed Data", icon: <Network className="text-gray-400 w-6 h-6" /> },
            { name: "Backend Dev", icon: <Database className="text-gray-400 w-6 h-6" /> },
            { name: "Web Dev", icon: <Globe className="text-gray-400 w-6 h-6" /> }
        ]
    }
];

export default function AboutOverlay() {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const titleRef = useRef(null);
    const arsenalRefs = useRef([]);
    const techRefs = useRef([]);

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

        gsap.fromTo(techRefs.current,
            { opacity: 0, x: 50, filter: 'blur(5px)' },
            {
                opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.2, ease: "power2.out",
                scrollTrigger: { trigger: techRefs.current[0], start: "top 80%" }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section id="about" ref={containerRef} className="min-h-[150vh] w-full py-32 px-6 flex flex-col items-center pointer-events-none">
            <div ref={contentRef} className="max-w-5xl w-full pointer-events-auto flex flex-col items-center opacity-0">

                <div ref={titleRef} className="glass p-12 rounded-3xl border border-white/5 bg-cyber-dark/60 backdrop-blur-xl mb-12 w-full hover:border-cyber-cyan/30 transition-colors duration-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-white">The System Architecture</h2>
                    <p className="text-2xl text-gray-300 font-inter font-light leading-relaxed mb-8">
                        I focus on building practical projects that help me understand how systems work under the hood, while improving performance, reliability, and maintainability.
                    </p>
                    <div className="flex items-center gap-3 text-sm text-cyber-cyan/80 font-space uppercase tracking-widest bg-cyber-cyan/10 inline-flex px-5 py-3 rounded-lg border border-cyber-cyan/20">
                        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_8px_#00f3ff]" />
                        Current Focus: Face Recognition System (Final Year Project)
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-20">
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

                {/* Tech Stack Section */}
                <div id="skills" className="w-full pt-10">
                    <h2 className="text-4xl font-orbitron font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-cyber-pink">Core Libraries & Packages</h2>
                    <div className="flex flex-col gap-12 w-full">
                        {techStack.map((category, idx) => (
                            <div key={idx} ref={el => techRefs.current[idx] = el} className="glass p-8 rounded-3xl border border-white/5 bg-cyber-dark/60 backdrop-blur-xl hover:border-cyber-pink/20 transition-colors duration-500">
                                <h3 className="text-2xl font-space font-semibold mb-8 text-cyber-pink/90 border-b border-white/10 pb-4">{category.category}</h3>
                                <div className="flex flex-wrap gap-4">
                                    {category.items.map((tech, tIdx) => (
                                        <div key={tIdx} className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-5 py-3 hover:bg-cyber-pink/10 hover:scale-105 hover:border-cyber-pink/30 hover:shadow-[0_0_15px_rgba(255,0,255,0.2)] transition-all cursor-default relative overflow-hidden group/tech">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/tech:translate-x-full transition-transform duration-1000" />
                                            {tech.icon}
                                            <span className="text-gray-200 font-inter font-medium tracking-wide">{tech.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
