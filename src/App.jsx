import React, { useEffect, lazy, Suspense } from 'react';
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
import Preloader from './components/Preloader';
import WhatsAppChat from './components/WhatsAppChat';

// Code-split routes and modals to ensure critical initial load remains ultra-light
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const ScheduleMeetingModal = lazy(() => import('./components/ScheduleMeetingModal'));

// Edition presets — modern high-tech engineering color profiles
export const EDITION_PRESETS = {
    studio: {
        label: 'STUDIO WHITE',
        void: '#ffffff',
        panel: '#ffffff',
        panelDeep: '#f8fafc',
        ink: '#0f172a',
        graphite: '#475569',
        bordertech: '#e2e8f0',
        accent: '#2563eb',
        hot: '#1d4ed8',
        dim: 'rgba(37, 99, 235, 0.08)',
        cyan: '#0284c7',
        scheme: 'light',
    },
    white: {
        label: 'STUDIO WHITE',
        void: '#ffffff',
        panel: '#ffffff',
        panelDeep: '#f8fafc',
        ink: '#0f172a',
        graphite: '#475569',
        bordertech: '#e2e8f0',
        accent: '#2563eb',
        hot: '#1d4ed8',
        dim: 'rgba(37, 99, 235, 0.08)',
        cyan: '#0284c7',
        scheme: 'light',
    },
    cyber: {
        label: 'CYBER OBSIDIAN',
        void: '#07080c',
        panel: '#0e111a',
        panelDeep: '#141824',
        ink: '#f8fafc',
        graphite: '#94a3b8',
        bordertech: 'rgba(255, 255, 255, 0.08)',
        accent: '#00f0ff',
        hot: '#38bdf8',
        dim: 'rgba(0, 240, 255, 0.14)',
        cyan: '#00f0ff',
        scheme: 'dark',
    },
    cobalt: {
        label: 'MIDNIGHT BLUE',
        void: '#060a14',
        panel: '#0c1426',
        panelDeep: '#111b33',
        ink: '#f1f5f9',
        graphite: '#94a3b8',
        bordertech: 'rgba(59, 130, 246, 0.16)',
        accent: '#3b82f6',
        hot: '#60a5fa',
        dim: 'rgba(59, 130, 246, 0.15)',
        cyan: '#60a5fa',
        scheme: 'dark',
    },
    violet: {
        label: 'NEON TOKYO',
        void: '#090712',
        panel: '#120e22',
        panelDeep: '#1a1432',
        ink: '#faf5ff',
        graphite: '#c084fc',
        bordertech: 'rgba(168, 85, 247, 0.16)',
        accent: '#a855f7',
        hot: '#c084fc',
        dim: 'rgba(168, 85, 247, 0.15)',
        cyan: '#a855f7',
        scheme: 'dark',
    },
    // Backwards-compatible aliases — legacy newspaper themes safely map to modern white
    vermilion: {
        label: 'STUDIO WHITE',
        void: '#ffffff',
        panel: '#ffffff',
        panelDeep: '#f8fafc',
        ink: '#0f172a',
        graphite: '#475569',
        bordertech: '#e2e8f0',
        accent: '#2563eb',
        hot: '#1d4ed8',
        dim: 'rgba(37, 99, 235, 0.08)',
        cyan: '#0284c7',
        scheme: 'light',
    },
    crimson: {
        label: 'STUDIO WHITE',
        void: '#ffffff',
        panel: '#ffffff',
        panelDeep: '#f8fafc',
        ink: '#0f172a',
        graphite: '#475569',
        bordertech: '#e2e8f0',
        accent: '#2563eb',
        hot: '#1d4ed8',
        dim: 'rgba(37, 99, 235, 0.08)',
        cyan: '#0284c7',
        scheme: 'light',
    },
    amber: {
        label: 'STUDIO WHITE',
        void: '#ffffff',
        panel: '#ffffff',
        panelDeep: '#f8fafc',
        ink: '#0f172a',
        graphite: '#475569',
        bordertech: '#e2e8f0',
        accent: '#2563eb',
        hot: '#1d4ed8',
        dim: 'rgba(37, 99, 235, 0.08)',
        cyan: '#0284c7',
        scheme: 'light',
    },
    obsidian: {
        label: 'CYBER OBSIDIAN',
        void: '#07080c',
        panel: '#0e111a',
        panelDeep: '#141824',
        ink: '#f8fafc',
        graphite: '#94a3b8',
        bordertech: 'rgba(255, 255, 255, 0.08)',
        accent: '#00f0ff',
        hot: '#38bdf8',
        dim: 'rgba(0, 240, 255, 0.14)',
        cyan: '#00f0ff',
        scheme: 'dark',
    },
};

function App() {
    const isUnlocked = useStore((state) => state.isUnlocked);
    const isMeetingModalOpen = useStore((state) => state.isMeetingModalOpen);
    const setMeetingModalOpen = useStore((state) => state.setMeetingModalOpen);
    const accentTheme = useStore((state) => state.accentTheme);

    // Apply the modern engineering color profile to the root element
    useEffect(() => {
        const preset = EDITION_PRESETS[accentTheme] || EDITION_PRESETS.studio;
        const root = document.documentElement;
        root.dataset.edition = accentTheme in EDITION_PRESETS ? accentTheme : 'studio';
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
                <Suspense fallback={null}>
                    <CommandPalette />
                </Suspense>

                {/* Schedule Meeting Modal — rendered on demand */}
                {isMeetingModalOpen && (
                    <Suspense fallback={null}>
                        <ScheduleMeetingModal
                            isOpen={isMeetingModalOpen}
                            onClose={() => setMeetingModalOpen(false)}
                        />
                    </Suspense>
                )}

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
                                <Suspense fallback={null}>
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/project/:id" element={<ProjectDetails />} />
                                    </Routes>
                                </Suspense>
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
