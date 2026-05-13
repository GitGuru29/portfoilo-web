import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const lockSystem = useStore((state) => state.lockSystem);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, id) => {
        e.preventDefault();

        if (location.pathname !== '/') {
            navigate('/');
            // Wait slightly for the Home component to mount before scrolling
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    if (window.lenis) {
                        window.lenis.scrollTo(element, { offset: 0, duration: 1.2 });
                    } else {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }, 150);
        } else {
            const element = document.getElementById(id);
            if (element) {
                if (window.lenis) {
                    window.lenis.scrollTo(element, { offset: 0, duration: 1.2 });
                } else {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <a href="#" onClick={(e) => handleNavClick(e, 'root')} className="text-2xl font-orbitron font-black tracking-widest text-white hover:scale-105 transition-transform group">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f7ff] to-cyber-violet group-hover:drop-shadow-[0_0_8px_rgba(0,247,255,0.5)] transition-all">SN</span>
                </a>

                {/* Glass Nav Links */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-8 bg-black/20 px-8 py-2.5 rounded-full border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                        <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-[11px] font-space font-medium text-gray-300 hover:text-[#00f7ff] hover:drop-shadow-[0_0_8px_rgba(0,247,255,0.8)] transition-all uppercase tracking-[0.2em]">Home</a>
                        <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="text-[11px] font-space font-medium text-gray-300 hover:text-[#00f7ff] hover:drop-shadow-[0_0_8px_rgba(0,247,255,0.8)] transition-all uppercase tracking-[0.2em]">Projects</a>
                        <a href="#skills" onClick={(e) => handleNavClick(e, 'skills')} className="text-[11px] font-space font-medium text-gray-300 hover:text-[#00f7ff] hover:drop-shadow-[0_0_8px_rgba(0,247,255,0.8)] transition-all uppercase tracking-[0.2em]">Skills</a>
                        <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-[11px] font-space font-medium text-gray-300 hover:text-[#00f7ff] hover:drop-shadow-[0_0_8px_rgba(0,247,255,0.8)] transition-all uppercase tracking-[0.2em]">Contact</a>
                    </div>

                    {/* System Status Badge - Moved from Hero */}
                    <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,247,255,0.1)]">
                        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_10px_#00f7ff]" />
                        <span className="text-[10px] font-space tracking-widest text-cyber-cyan uppercase font-bold">System Status: Online</span>
                    </div>

                    {/* Terminal Access Button */}
                    <button 
                        onClick={() => lockSystem()}
                        className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 bg-black/40 hover:border-cyber-cyan hover:bg-cyber-cyan/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all group"
                        title="Open Terminal"
                    >
                        <span className="text-[14px] font-space font-bold text-gray-300 group-hover:text-cyber-cyan group-hover:drop-shadow-[0_0_8px_#00f7ff] transition-all">&gt;_</span>
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}
