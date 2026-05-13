import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Smartphone, Database, Network, Settings, Globe, Server } from 'lucide-react';
import {
    SiKotlin, SiPython, SiCplusplus, SiJavascript, SiDart,
    SiAndroid, SiFirebase, SiApachespark, SiMongodb, SiLinux, SiXcode,
    SiGooglecolab, SiCloudinary, SiPostgresql, SiPhp,
    SiGnubash, SiFishshell, SiSwift
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa';

const techStack = [
    {
        category: "Languages",
        items: [
            { name: "C/C++", icon: <SiCplusplus className="text-[#00599C] w-6 h-6" /> },
            { name: "Kotlin", icon: <SiKotlin className="text-[#7F52FF] w-6 h-6" /> },
            { name: "Java", icon: <FaJava className="text-[#007396] w-6 h-6" /> },
            { name: "Python", icon: <SiPython className="text-[#3776AB] w-6 h-6" /> },
            { name: "Bash", icon: <SiGnubash className="text-[#4EAA25] w-6 h-6" /> },
            { name: "Fish", icon: <SiFishshell className="text-[#4EAA25] w-6 h-6" /> },
            { name: "Swift", icon: <SiSwift className="text-[#F05138] w-6 h-6" /> }
        ]
    },
    {
        category: "System & Mobile Architecture",
        items: [
            { name: "Android SDK", icon: <SiAndroid className="text-[#3DDC84] w-6 h-6" /> },
            { name: "Android NDK", icon: <Cpu className="text-[#3DDC84] w-6 h-6" /> },
            { name: "Jetpack Compose", icon: <SiAndroid className="text-[#4285F4] w-6 h-6" /> },
            { name: "Linux Internals", icon: <SiLinux className="text-[#FCC624] w-6 h-6" /> }
        ]
    },
    {
        category: "Infrastructure & Data",
        items: [
            { name: "AWS", icon: <FaAws className="text-[#232F3E] w-6 h-6" /> },
            { name: "PostgreSQL", icon: <SiPostgresql className="text-[#336791] w-6 h-6" /> },
            { name: "MongoDB", icon: <SiMongodb className="text-[#47A248] w-6 h-6" /> },
            { name: "PySpark", icon: <SiApachespark className="text-[#E25A1C] w-6 h-6" /> }
        ]
    },
    {
        category: "Core Competencies",
        items: [
            { name: "System Design", icon: <Server className="text-gray-400 w-6 h-6" /> },
            { name: "Kernel Modules", icon: <Settings className="text-gray-400 w-6 h-6" /> },
            { name: "Performance Optimization", icon: <Cpu className="text-gray-400 w-6 h-6" /> },
            { name: "Distributed Systems", icon: <Network className="text-gray-400 w-6 h-6" /> },
            { name: "Security & Privacy", icon: <Database className="text-gray-400 w-6 h-6" /> }
        ]
    }
];

export default function SkillsOverlay() {
    const containerRef = useRef(null);
    const techRefs = useRef([]);

    useEffect(() => {
        gsap.fromTo(techRefs.current,
            { opacity: 0, x: 50, filter: 'blur(5px)' },
            {
                opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.2, ease: "power2.out",
                scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section id="skills" ref={containerRef} className="w-full py-20 px-6 flex flex-col items-center pointer-events-none">
            <div className="max-w-5xl w-full pointer-events-auto flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-cyber-pink tracking-tight drop-shadow-[0_0_15px_rgba(255,0,255,0.2)]">
                    CORE <span className="text-cyber-cyan drop-shadow-[0_0_20px_rgba(0,243,255,0.4)]">CAPABILITIES</span>
                </h2>
                
                <div className="flex flex-col gap-12 w-full">
                    {techStack.map((category, idx) => (
                        <div key={idx} ref={el => techRefs.current[idx] = el} className="glass p-8 rounded-3xl border border-white/5 bg-cyber-dark/60 backdrop-blur-xl hover:border-cyber-pink/20 transition-colors duration-500 shadow-lg">
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
        </section>
    );
}
