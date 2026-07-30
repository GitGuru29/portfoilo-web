import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LenisWrapper from './components/LenisWrapper';
import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import SystemMetricsWidget from './components/SystemMetricsWidget';
import ScrollToTop from './components/ScrollToTop';
import useStore from './store/useStore';

import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import Preloader from './components/Preloader';
import CommandPalette from './components/CommandPalette';
import WhatsAppChat from './components/WhatsAppChat';

function App() {
    const isUnlocked = useStore((state) => state.isUnlocked);

    // Force scroll to top on refresh
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
    }, []);

    return (
        <HashRouter>
            <div className="relative text-[var(--color-geyser)] font-sans overflow-clip min-h-screen bg-[var(--color-quantum-black)]">

                {/* Premium custom cursor — always on top */}
                <CustomCursor />

                {/* Developer Command Palette (Cmd + K) */}
                <CommandPalette />

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
