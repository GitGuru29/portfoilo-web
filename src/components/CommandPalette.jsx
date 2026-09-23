import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, Code, Cpu, ShieldCheck, Sparkles, Volume2, VolumeX, Download, Github, Linkedin, Mail, ExternalLink, Command, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import { playClickSound, playChimeSound, playHoverSound } from '../utils/soundFX';

export default function CommandPalette() {
    const isCommandPaletteOpen = useStore((s) => s.isCommandPaletteOpen);
    const setCommandPaletteOpen = useStore((s) => s.setCommandPaletteOpen);
    const soundEnabled = useStore((s) => s.soundEnabled);
    const toggleSound = useStore((s) => s.toggleSound);
    const accentTheme = useStore((s) => s.accentTheme);
    const setAccentTheme = useStore((s) => s.setAccentTheme);
    const toggleTerminal = useStore((s) => s.toggleTerminal);

    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    // Global Cmd+K / Ctrl+K keyboard shortcut trigger
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(!isCommandPaletteOpen);
                if (!isCommandPaletteOpen) playChimeSound(soundEnabled);
            } else if (e.key === 'Escape' && isCommandPaletteOpen) {
                setCommandPaletteOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCommandPaletteOpen, setCommandPaletteOpen, soundEnabled]);

    // Focus input on open
    useEffect(() => {
        if (isCommandPaletteOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isCommandPaletteOpen]);

    const scrollToSection = (id) => {
        const targetEl = document.getElementById(id);
        if (!targetEl) return;
        setCommandPaletteOpen(false);
        playClickSound(soundEnabled);

        if (window.lenis) {
            window.lenis.scrollTo(targetEl, { offset: -20, duration: 1.2 });
        } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const COMMAND_ITEMS = [
        // Navigation Section
        { id: 'nav-hero', label: 'Go to Hero / Home', category: 'Navigation', icon: Terminal, action: () => scrollToSection('hero') },
        { id: 'nav-skills', label: 'Go to Skills & Competencies', category: 'Navigation', icon: Cpu, action: () => scrollToSection('skills') },
        { id: 'nav-github', label: 'Go to GitHub Activity', category: 'Navigation', icon: Github, action: () => scrollToSection('github') },
        { id: 'nav-projects', label: 'Go to Featured Projects', category: 'Navigation', icon: Code, action: () => scrollToSection('projects') },
        { id: 'nav-timeline', label: 'Go to Experience & Build Log', category: 'Navigation', icon: Sparkles, action: () => scrollToSection('timeline') },
        { id: 'nav-research', label: 'Go to Active Research', category: 'Navigation', icon: Cpu, action: () => scrollToSection('research') },
        { id: 'nav-testimonials', label: 'Go to Recommendations & References', category: 'Navigation', icon: ShieldCheck, action: () => scrollToSection('testimonials') },
        { id: 'nav-certificates', label: 'Go to Certificates', category: 'Navigation', icon: Sparkles, action: () => scrollToSection('certificates') },
        { id: 'nav-badges', label: 'Go to Badges & Achievements', category: 'Navigation', icon: Sparkles, action: () => scrollToSection('badges') },
        { id: 'nav-contact', label: 'Go to Contact', category: 'Navigation', icon: Mail, action: () => scrollToSection('contact') },

        // Actions & External Links
        { id: 'act-cv', label: 'Download Resume / CV (PDF)', category: 'Quick Actions', icon: Download, action: () => { window.open('/Siluna_Nusal_CV.pdf', '_blank'); setCommandPaletteOpen(false); } },
        { id: 'act-terminal', label: 'Toggle Interactive Floating Terminal', category: 'Quick Actions', icon: Terminal, action: () => { toggleTerminal(); setCommandPaletteOpen(false); } },
        { id: 'act-github', label: 'Open GitHub Profile', category: 'Quick Actions', icon: ExternalLink, action: () => { window.open('https://github.com/GitGuru29', '_blank'); setCommandPaletteOpen(false); } },
        { id: 'act-linkedin', label: 'Open LinkedIn Profile', category: 'Quick Actions', icon: Linkedin, action: () => { window.open('https://linkedin.com/in/siluna-dangalla', '_blank'); setCommandPaletteOpen(false); } },

        // Theme & Audio Settings
        { id: 'set-theme-sky',   label: 'Plate: SKY · RISO_01', category: 'Appearance & Audio', icon: Sparkles, action: () => { setAccentTheme('sky'); playChimeSound(soundEnabled); } },
        { id: 'set-theme-deep',  label: 'Plate: DEEP SKY · RISO_02', category: 'Appearance & Audio', icon: Sparkles, action: () => { setAccentTheme('deep'); playChimeSound(soundEnabled); } },
        { id: 'set-theme-ochre', label: 'Plate: OCHRE · RISO_03', category: 'Appearance & Audio', icon: Sparkles, action: () => { setAccentTheme('ochre'); playChimeSound(soundEnabled); } },
        { id: 'set-sound', label: `Audio: ${soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}`, category: 'Appearance & Audio', icon: soundEnabled ? VolumeX : Volume2, action: () => { toggleSound(); playClickSound(!soundEnabled); } },
    ];

    const filteredItems = COMMAND_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    const handleKeyDownInInput = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            playHoverSound(soundEnabled);
            setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            playHoverSound(soundEnabled);
            setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
            e.preventDefault();
            filteredItems[selectedIndex].action();
        }
    };

    const listRef = useRef(null);

    // Auto-scroll selected item into view when navigating with Arrow Up/Down
    useEffect(() => {
        if (listRef.current) {
            const selectedEl = listRef.current.children[selectedIndex];
            if (selectedEl) {
                selectedEl.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex]);

    return (
        <AnimatePresence>
            {isCommandPaletteOpen && (
                <div className="fixed inset-0 z-[999999] flex items-start justify-center pt-20 px-4">
                    {/* Paper Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCommandPaletteOpen(false)}
                        className="fixed inset-0 bg-ink/25 backdrop-blur-sm"
                    />

                    {/* Command Palette Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: -16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -16 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-2xl bg-panel border-[1.5px] border-ink/20 rounded-none shadow-[0_20px_60px_-24px_rgba(23,19,15,0.4)] overflow-hidden z-10"
                    >
                        {/* Search Input Bar */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-ink/10 bg-panel-deep/60">
                            <Search className="w-5 h-5 text-accent" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                                onKeyDown={handleKeyDownInInput}
                                placeholder="Type a command or search sections..."
                                className="w-full bg-transparent text-ink placeholder-graphite font-sans text-sm focus:outline-none"
                            />
                            <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-graphite px-2 py-1 rounded border border-ink/15 uppercase">
                                <span>ESC</span>
                            </div>
                        </div>

                        {/* Filtered Command List - data-lenis-prevent allows mouse wheel / trackpad scroll inside Lenis */}
                        <div
                            ref={listRef}
                            data-lenis-prevent
                            data-lenis-prevent-touch
                            className="max-h-[380px] overflow-y-auto p-2 scrollbar-thin overscroll-contain"
                        >
                            {filteredItems.length === 0 ? (
                                <div className="py-12 text-center text-graphite font-mono text-xs">
                                    No matching commands found.
                                </div>
                            ) : (
                                filteredItems.map((item, idx) => {
                                    const IconComponent = item.icon;
                                    const isSelected = idx === selectedIndex;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => item.action()}
                                            onMouseEnter={() => setSelectedIndex(idx)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left ${
                                                isSelected
                                                    ? 'bg-[#B91C1C]/10 border border-[#B91C1C]/30 text-ink'
                                                    : 'text-graphite hover:text-ink border border-transparent'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#B91C1C] text-black' : 'bg-panel text-graphite'}`}>
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-space font-medium block">
                                                        {item.label}
                                                    </span>
                                                    <span className="text-[10px] font-mono tracking-wider text-graphite uppercase">
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <div className="flex items-center gap-1 text-[11px] font-mono text-[#B91C1C]">
                                                    <span>Execute</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer Hints */}
                        <div className="flex items-center justify-between px-5 py-3 border-t border-ink/10 bg-panel-deep/60 text-[11px] font-mono text-graphite">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1"><Command className="w-3 h-3 text-accent" /> + K</span>
                                <span>• Navigate: ↑ ↓</span>
                                <span>• Select: ↵</span>
                            </div>
                            <span className="text-accent font-sans font-semibold font-space">Siluna Dangalla Portfolio</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
