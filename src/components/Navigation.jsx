import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-cyber-dark/80 backdrop-blur-xl border-b border-[var(--theme-primary)]/20 py-4 shadow-[0_5px_20px_var(--theme-primary)]/5' : 'bg-transparent py-6'}`}
        >
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                <a href="#" onClick={(e) => handleNavClick(e, 'root')} className="text-2xl font-orbitron font-black tracking-widest text-white hover:scale-105 transition-transform group">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] transition-all">SN</span>
                </a>

                <div className="hidden md:flex ml-auto">
                    <div className="flex items-center gap-8 bg-white/[0.04] px-6 py-2 rounded-full border border-white/[0.08] backdrop-blur-md">
                        <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-sm font-space font-medium text-gray-300 hover:text-[var(--theme-primary)] transition-all uppercase tracking-widest">Home</a>
                        <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="text-sm font-space font-medium text-gray-300 hover:text-[var(--theme-primary)] transition-all uppercase tracking-widest">Projects</a>
                        <a href="#skills" onClick={(e) => handleNavClick(e, 'skills')} className="text-sm font-space font-medium text-gray-300 hover:text-[var(--theme-primary)] transition-all uppercase tracking-widest">Skills</a>
                        <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-sm font-space font-medium text-gray-300 hover:text-[var(--theme-primary)] transition-all uppercase tracking-widest">Contact</a>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
