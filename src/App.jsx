import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LenisWrapper from './components/LenisWrapper';
import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import SystemMetricsWidget from './components/SystemMetricsWidget';
import ScrollToTop from './components/ScrollToTop';
import StoryProgress from './components/StoryProgress';
import useStore from './store/useStore';
import { anchorToSection } from './utils/scrollToSection';

import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import Preloader from './components/Preloader';
import CommandPalette from './components/CommandPalette';
import ScheduleMeetingModal from './components/ScheduleMeetingModal';
import WhatsAppChat from './components/WhatsAppChat';

// Edition presets — drive the entire broadsheet palette + spot ink via runtime CSS vars.
export const EDITION_PRESETS = {
    crimson: {
        label: 'VERMILION',
        void: '#f2ede4',
        panel: '#faf7f0',
        panelDeep: '#e6e0d4',
        ink: '#0d0d0d',
        graphite: '#4a463f',
        bordertech: '#c6bfb0',
        accent: '#c81e1e',
        hot: '#e02424',
        dim: 'rgba(200, 30, 30, 0.14)',
        cyan: '#0d0d0d',
        scheme: 'light',
    },
    cobalt: {
        label: 'BLUEPRINT',
        void: '#edf1f7',
        panel: '#f7f9fc',
        panelDeep: '#dde4ef',
        ink: '#0b1324',
        graphite: '#3b475e',
        bordertech: '#b6c2d6',
        accent: '#1d4ed8',
        hot: '#2563eb',
        dim: 'rgba(29, 78, 216, 0.14)',
        cyan: '#0b1324',
        scheme: 'light',
    },
    amber: {
        label: 'ARCHIVAL',
        void: '#f3ede0',
        panel: '#fbf8f1',
        panelDeep: '#e5decb',
        ink: '#14110d',
        graphite: '#52493e',
        bordertech: '#c7bca8',
        accent: '#b45309',
        hot: '#d97706',
        dim: 'rgba(180, 83, 9, 0.14)',
        cyan: '#14110d',
        scheme: 'light',
    },
    obsidian: {
        label: 'NIGHT PRESS',
        void: '#0b0c0f',
        panel: '#12141a',
        panelDeep: '#191c24',
        ink: '#f0ede6',
        graphite: '#9ca3af',
        bordertech: '#2a2f3d',
        accent: '#f97316',
        hot: '#fb923c',
        dim: 'rgba(249, 115, 22, 0.16)',
        cyan: '#f0ede6',
        scheme: 'dark',
    },
};

function App() {
    const isUnlocked = useStore((state) => state.isUnlocked);
    const isMeetingModalOpen = useStore((state) => state.isMeetingModalOpen);
    const setMeetingModalOpen = useStore((state) => state.setMeetingModalOpen);
    const accentTheme = useStore((state) => state.accentTheme);

    // Apply the press edition plate to the root element
    useEffect(() => {
        const preset = EDITION_PRESETS[accentTheme] || EDITION_PRESETS.crimson;
        const root = document.documentElement;
        root.dataset.edition = accentTheme in EDITION_PRESETS ? accentTheme : 'crimson';
        root.style.colorScheme = preset.scheme;
        root.style.setProperty('--color-void', preset.void);
        root.style.setProperty('--color-panel', preset.panel);
        root.style.setProperty('--color-panel-deep', preset.panelDeep);
        root.style.setProperty('--color-ink', preset.ink);
        root.style.setProperty('--color-graphite', preset.graphite);
        root.style.setProperty('--color-bordertech', preset.bordertech);
        root.style.setProperty('--color-accent', preset.accent);
        root.style.setProperty('--color-accent-hot', preset.hot);
        root.style.setProperty('--color-accent-dim', preset.dim);
        root.style.setProperty('--color-cyanx', preset.cyan);
        root.style.setProperty('--color-telemetry', preset.accent);
        root.style.setProperty('--color-quantum-dark', preset.void);
        root.style.setProperty('--color-surface', preset.panel);
        root.style.setProperty('--color-geyser', preset.ink);
        root.style.setProperty('--color-titanium', preset.graphite);
        root.style.setProperty('--color-aura', preset.bordertech);
    }, [accentTheme]);

    // Force scroll to top on refresh
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
    }, []);

    return (
        <HashRouter>
            <div className="relative text-ink font-sans min-h-screen bg-[var(--color-quantum-dark)]">

                {/* Premium custom cursor — always on top */}
                <CustomCursor />

                {/* Story reading progress — thin gold line */}
                <StoryProgress />

                {/* Developer Command Palette (Cmd + K) */}
                <CommandPalette />

                {/* Schedule Meeting Modal */}
                <ScheduleMeetingModal
                    isOpen={isMeetingModalOpen}
                    onClose={() => setMeetingModalOpen(false)}
                />

                {/* The Sleek Preloader */}
                <AnimatePresence>
                    {!isUnlocked && <Preloader />}
                </AnimatePresence>

                {/* The Main Application - Mounts only when unlocked */}
                <AnimatePresence>
                    {isUnlocked && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full h-full z-content"
                        >
                            {/* Keyboard users jump straight past the chrome */}
                            <a
                                href="#folio"
                                onClick={anchorToSection('folio', { offset: 0 })}
                                className="skip-link"
                            >
                                Skip to content
                            </a>

                            <LenisWrapper>
                                <Navigation />

                                {/* Scrollable DOM Content */}
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/project/:id" element={<ProjectDetails />} />
                                </Routes>
                            </LenisWrapper>

                            {/* Fixed global UI — outside scroll context */}
                            <SystemMetricsWidget />
                            <ScrollToTop />
                            <WhatsAppChat />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </HashRouter>
    );
}

export default App;
