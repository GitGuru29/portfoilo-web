import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Github, Cpu, MemoryStick } from 'lucide-react';

export default function SystemMetricsWidget() {
    const [githubData, setGithubData] = useState({ repos: 0, followers: 0 });
    const [cpuLoad, setCpuLoad] = useState(12);
    const [memLoad, setMemLoad] = useState(4.2);

    useEffect(() => {
        // Fetch GitHub stats
        fetch('https://api.github.com/users/GitGuru29')
            .then(res => res.json())
            .then(data => {
                if (data.public_repos !== undefined) {
                    setGithubData({
                        repos: data.public_repos,
                        followers: data.followers
                    });
                }
            })
            .catch(err => console.error('Failed to fetch github stats', err));

        // Ticking system metrics simulation
        const interval = setInterval(() => {
            setCpuLoad(prev => Math.max(5, Math.min(95, prev + (Math.random() * 10 - 5))));
            setMemLoad(prev => Math.max(2.0, Math.min(16.0, prev + (Math.random() * 0.4 - 0.2))));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="fixed bottom-0 left-0 w-full z-[90] flex items-center justify-between px-4 md:px-6 py-1.5 bg-[#050505]/95 backdrop-blur-md border-t border-white/10 text-[10px] md:text-xs font-mono tracking-widest text-gray-400 select-none"
        >
            {/* Left Side: CPU & MEM */}
            <div className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center gap-1.5 text-cyber-cyan">
                    <Cpu className="w-3.5 h-3.5" />
                    <span className="w-12 text-left">{cpuLoad.toFixed(1)}%</span>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <div className="flex items-center gap-1.5 text-cyber-violet">
                    <MemoryStick className="w-3.5 h-3.5" />
                    <span className="w-12 text-left">{memLoad.toFixed(1)}GB</span>
                </div>
            </div>

            {/* Right Side: GitHub & Status */}
            <div className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5" />
                    <span>{githubData.repos} REPOS</span>
                </div>
                <div className="w-px h-3 bg-white/20 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>{githubData.followers} NODE{githubData.followers !== 1 ? 'S' : ''}</span>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <div className="flex items-center gap-1.5 text-[#74E1A6]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#74E1A6] shadow-[0_0_5px_#74E1A6] animate-pulse" />
                    <span className="hidden sm:inline">SYSTEM ONLINE</span>
                    <span className="sm:hidden">OK</span>
                </div>
            </div>
        </motion.div>
    );
}
