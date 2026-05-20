import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Github, Cpu } from 'lucide-react';

export default function SystemMetricsWidget() {
    const [githubData, setGithubData] = useState({ repos: 30, followers: 0 });
    const [cpuLoad, setCpuLoad] = useState(18);
    const [time, setTime] = useState('');

    useEffect(() => {
        // Live clock
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }));
        };
        updateTime();
        const clockInterval = setInterval(updateTime, 1000);

        // GitHub stats
        fetch('https://api.github.com/users/GitGuru29')
            .then(res => res.json())
            .then(data => {
                if (data.public_repos !== undefined) {
                    setGithubData({ repos: data.public_repos, followers: data.followers });
                }
            })
            .catch(() => {});

        // Simulated CPU tick
        const cpuInterval = setInterval(() => {
            setCpuLoad(prev => Math.max(8, Math.min(72, prev + (Math.random() * 12 - 6))));
        }, 2200);

        return () => {
            clearInterval(clockInterval);
            clearInterval(cpuInterval);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[90] flex items-center justify-between px-4 md:px-8 py-2 bg-[var(--color-quantum-black)]/98 border-t border-[var(--color-geyser)]/8 select-none"
        >
            {/* Left: CPU + status */}
            <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-1.5">
                    <Cpu className="w-3 h-3 text-[var(--color-geyser)]/30" />
                    <span className="text-[9px] font-space tracking-[0.2em] text-[var(--color-geyser)]/40 tabular-nums">
                        CPU {cpuLoad.toFixed(0)}%
                    </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-space tracking-[0.2em] text-[var(--color-geyser)]/35 uppercase">
                        Nominal
                    </span>
                </div>
            </div>

            {/* Center: signature */}
            <div className="text-[9px] font-space tracking-[0.4em] text-[var(--color-geyser)]/25 uppercase hidden md:block">
                SilunaOS v3.0 — Sri Lanka
            </div>

            {/* Right: GitHub + clock */}
            <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-1.5">
                    <Github className="w-3 h-3 text-[var(--color-geyser)]/30" />
                    <span className="text-[9px] font-space tracking-[0.2em] text-[var(--color-geyser)]/40">
                        {githubData.repos} repos
                    </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-[var(--color-geyser)]/30" />
                    <span className="text-[9px] font-space tracking-[0.2em] text-[var(--color-geyser)]/40">
                        {githubData.followers} followers
                    </span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-[var(--color-geyser)]/30 tabular-nums">
                    {time}
                </span>
            </div>
        </motion.div>
    );
}
