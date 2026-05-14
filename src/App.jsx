import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LenisWrapper from './components/LenisWrapper';
import CanvasScene from './components/canvas/CanvasScene';
import Navigation from './components/Navigation';

import TerminalSection from './components/TerminalSection';
import SystemMetricsWidget from './components/SystemMetricsWidget';
import CustomCursor from './components/CustomCursor';
import { Terminal } from 'lucide-react';
import useStore from './store/useStore';

import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';

import Preloader from './components/Preloader';

function App() {
    const isUnlocked = useStore((state) => state.isUnlocked);
    const toggleTerminal = useStore((state) => state.toggleTerminal);

    // Force scroll to top on refresh
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
    }, []);

    return (
        <HashRouter>
            <div className="relative text-white font-sans overflow-clip min-h-screen bg-[#020202]">
                {/* Premium custom cursor — always on top */}
                <CustomCursor />

                {/* The Fast BIOS Boot Preloader */}
                <AnimatePresence>
                    {!isUnlocked && <Preloader />}
                </AnimatePresence>

                {/* The Toggable Interactive Terminal (Only renders when requested) */}
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


                                {/* The Scrollable DOM Content Overlay */}
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/project/:id" element={<ProjectDetails />} />
                                </Routes>
                            </LenisWrapper>

                            {/* Floating UI Elements */}
                            <SystemMetricsWidget />
                            
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.5, duration: 0.5 }}
                                onClick={() => toggleTerminal()}
                                className="fixed bottom-10 right-6 z-[90] glass p-4 rounded-full border border-cyber-cyan/30 bg-[#050505]/80 text-cyber-cyan hover:bg-cyber-cyan/20 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all backdrop-blur-xl group"
                            >
                                <Terminal className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </HashRouter>
    );
}

export default App;
