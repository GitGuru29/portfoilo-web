import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Github, Cpu, Calendar, Palette } from 'lucide-react';
import useStore from '../store/useStore';
import { playClickSound } from '../utils/soundFX';
import { fetchGitHubProfile } from '../services/githubDataService';

const EDITION_CYCLE = ['studio', 'cyber', 'cobalt', 'violet'];
const EDITION_NAMES = {
    studio: 'STUDIO WHITE',
    white: 'STUDIO WHITE',
    cyber: 'CYBER OBSIDIAN',
    cobalt: 'MIDNIGHT BLUE',
    violet: 'NEON TOKYO',
    vermilion: 'STUDIO WHITE',
    crimson: 'STUDIO WHITE',
    obsidian: 'CYBER OBSIDIAN',
    amber: 'STUDIO WHITE',
};

export default function SystemMetricsWidget() {
    const [githubData, setGithubData] = useState({ repos: 41, followers: 69 });
    const [cpuLoad, setCpuLoad] = useState(18);
    const [time, setTime] = useState('');
    const soundEnabled = useStore((s) => s.soundEnabled);
    const setMeetingModalOpen = useStore((s) => s.setMeetingModalOpen);
    const accentTheme = useStore((s) => s.accentTheme);
    const setAccentTheme = useStore((s) => s.setAccentTheme);

    const cycleEdition = () => {
        const idx = EDITION_CYCLE.indexOf(accentTheme);
        const next = EDITION_CYCLE[(idx + 1) % EDITION_CYCLE.length];
        setAccentTheme(next);
        playClickSound(soundEnabled);
    };

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
            );
        };
        updateTime();
        const clockInterval = setInterval(updateTime, 1000);

        fetchGitHubProfile('GitGuru29').then((p) => {
            if (p && p.publicRepos !== undefined) {
                setGithubData({ repos: p.publicRepos, followers: p.followers });
            }
        });

        const cpuInterval = setInterval(() => {
            setCpuLoad((prev) => Math.max(8, Math.min(72, prev + (Math.random() * 12 - 6))));
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
            transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[90] flex items-center justify-between px-4 md:px-8 py-1.5 bg-panel/95 border-t-2 border-ink/20 backdrop-blur-md select-none"
        >
            {/* Left: CPU + status */}
            <div className="flex items-center gap-4 md:gap-5">
                <div className="flex items-center gap-1.5">
                    <Cpu className="w-3 h-3 text-accent" />
                    <span className="text-[9px] font-mono tracking-[0.2em] text-ink font-semibold tabular-nums">
                        CPU {cpuLoad.toFixed(0)}%
                    </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
                    <span className="text-[9px] font-mono tracking-[0.2em] text-graphite uppercase">
                        SYS NOMINAL
                    </span>
                </div>
            </div>

            {/* Center: signature */}
            <div className="text-[9px] font-mono tracking-[0.3em] text-graphite uppercase hidden lg:block">
                SILUNA.SYS v3.4 — COLOMBO PRESS TELEMETRY
            </div>

            {/* Right: Edition + Schedule Meeting + GitHub + clock */}
            <div className="flex items-center gap-3 md:gap-4">
                <button
                    onClick={cycleEdition}
                    title="Cycle Theme"
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-panel-deep border border-ink/20 text-ink hover:border-accent hover:text-accent transition-all text-[9px] font-mono tracking-wider uppercase cursor-pointer"
                >
                    <Palette className="w-2.5 h-2.5 text-accent" />
                    <span>THEME: {EDITION_NAMES[accentTheme] || 'STUDIO WHITE'}</span>
                </button>

                <button
                    onClick={() => {
                        setMeetingModalOpen(true);
                        playClickSound(soundEnabled);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-accent text-void hover:bg-ink transition-all text-[9px] font-mono tracking-wider uppercase font-bold cursor-pointer"
                >
                    <Calendar className="w-2.5 h-2.5" />
                    <span>Book Call</span>
                </button>

                <div className="hidden md:flex items-center gap-1.5">
                    <Github className="w-3 h-3 text-graphite" />
                    <span className="text-[9px] font-mono tracking-[0.18em] text-graphite">
                        {githubData.repos} REPOS
                    </span>
                </div>
                <div className="hidden xl:flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-graphite" />
                    <span className="text-[9px] font-mono tracking-[0.18em] text-graphite">
                        {githubData.followers} FOLLOWERS
                    </span>
                </div>
                <span className="text-[9px] font-mono font-bold tracking-widest text-ink tabular-nums">
                    {time}
                </span>
            </div>
        </motion.div>
    );
}

