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

import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import Preloader from './components/Preloader';
import CommandPalette from './components/CommandPalette';
import ScheduleMeetingModal from './components/ScheduleMeetingModal';
import WhatsAppChat from './components/WhatsAppChat';

// Edition presets — drive the accent via runtime CSS vars so every
// Tailwind utility that references --color-accent follows the active edition.
// All values stay inside the broadsheet palette (paper / ink / pressed inks).
const ACCENT_PRESETS = {
    sky:   { accent: '#0EA5E9', hot: '#38BDF8', dim: 'rgba(14,165,233,0.35)', cyan: '#121212' },
    deep:  { accent: '#121212', hot: '#57544D', dim: 'rgba(18,18,18,0.14)', cyan: '#0EA5E9' },
    ochre: { accent: '#0284C7', hot: '#38BDF8', dim: 'rgba(2,132,199,0.35)', cyan: '#121212' },
};

function App() {
    const isUnlocked = useStore((state) => state.isUnlocked);
    const isMeetingModalOpen = useStore((state) => state.isMeetingModalOpen);
    const setMeetingModalOpen = useStore((state) => state.setMeetingModalOpen);
    const accentTheme = useStore((state) => state.accentTheme);

    // Apply the riso plate to the root element
    useEffect(() => {
        const preset = ACCENT_PRESETS[accentTheme] || ACCENT_PRESETS.sky;
        const root = document.documentElement;
        root.style.setProperty('--color-accent', preset.accent);
        root.style.setProperty('--color-accent-hot', preset.hot);
        root.style.setProperty('--color-accent-dim', preset.dim);
        root.style.setProperty('--color-cyanx', preset.cyan);
        root.style.setProperty('--color-telemetry', preset.cyan);
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
            <div className="relative text-ink font-sans overflow-clip min-h-screen bg-[var(--color-quantum-dark)]">

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
                            initial={{ opacity: 0, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full h-full z-content"
                        >
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
