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

    useEffect(() => {
        gsap.fromTo(contentRef.current,
            { opacity: 0, scale: 0.95, y: 50 },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    end: "bottom center",
                    scrub: 1
                }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section id="about" ref={containerRef} className="min-h-[150vh] w-full py-32 px-6 flex flex-col items-center pointer-events-none">
            <div ref={contentRef} className="max-w-5xl w-full pointer-events-auto flex flex-col items-center">

                <div className="glass p-12 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md mb-12 w-full">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">The Mindset</h2>
                    <p className="text-2xl text-gray-400 font-light leading-relaxed mb-6">
                        I focus on building practical projects that help me understand how systems work under the hood, while improving performance, reliability, and maintainability.
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-mono bg-white/5 inline-flex px-4 py-2 rounded-lg border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Current Focus: Face Recognition System (Final Year Project)
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-20">
                    {arsenal.map((item, index) => (
                        <div key={index} className="glass p-8 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md flex gap-6 items-start hover:bg-white/5 hover:border-white/10 transition-colors">
                            <div className="p-4 bg-white/5 rounded-2xl text-blue-400 border border-white/10 flex-shrink-0">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tech Stack Section */}
                <div className="w-full">
                    <h2 className="text-4xl font-bold mb-12 text-center text-white">Tech I Build With</h2>
                    <div className="flex flex-col gap-12 w-full">
                        {techStack.map((category, idx) => (
                            <div key={idx} className="glass p-8 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md">
                                <h3 className="text-2xl font-semibold mb-8 text-gray-300 border-b border-white/10 pb-4">{category.category}</h3>
                                <div className="flex flex-wrap gap-4">
                                    {category.items.map((tech, tIdx) => (
                                        <div key={tIdx} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 hover:bg-white/10 hover:scale-105 hover:border-white/20 transition-all cursor-default">
                                            {tech.icon}
                                            <span className="text-gray-200 font-medium">{tech.name}</span>
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
