import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LenisWrapper from './components/LenisWrapper';
import CanvasScene from './components/canvas/CanvasScene';
import Navigation from './components/Navigation';
import NightCodingScene from './components/NightCodingScene';
import TerminalSection from './components/TerminalSection';
import useStore from './store/useStore';

import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';

function App() {
    const isUnlocked = useStore((state) => state.isUnlocked);
    const currentTheme = useStore((state) => state.currentTheme);

    return (
        <HashRouter>
            <div data-theme={currentTheme === 'default' ? undefined : currentTheme} className="relative text-white font-sans overflow-clip selection:bg-blue-500/30 min-h-screen bg-[#020202]">

                {/* The Boot Screen Terminal */}
                <TerminalSection />

                {/* The Main Application - Mounts only when unlocked */}
                <AnimatePresence>
                    {isUnlocked && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }} // Wait for terminal to fade out
                            className="relative w-full h-full"
                        >
                            <LenisWrapper>
                                <Navigation />

                                {/* The permanent WebGL Background */}
                                <CanvasScene />
                                <NightCodingScene />

                                {/* The Scrollable DOM Content Overlay */}
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/project/:id" element={<ProjectDetails />} />
                                </Routes>
                            </LenisWrapper>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </HashRouter>
    );
}

export default App;
