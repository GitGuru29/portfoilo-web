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
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 150);
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-cyber-dark/80 backdrop-blur-xl border-b border-cyber-cyan/20 py-4 shadow-[0_5px_20px_rgba(0,243,255,0.05)]' : 'bg-transparent py-6'}`}
        >
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                <a href="#" onClick={(e) => handleNavClick(e, 'root')} className="text-2xl font-orbitron font-black tracking-widest text-white hover:scale-105 transition-transform group">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-violet group-hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.5)] transition-all">SN</span>
                </a>
                <div className="hidden md:flex items-center gap-8 bg-black/40 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md">
                    <button onClick={(e) => handleNavClick(e, 'about')} className="text-sm font-space font-medium text-gray-300 hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.5)] transition-all uppercase tracking-widest">About</button>
                    <button onClick={(e) => handleNavClick(e, 'projects')} className="text-sm font-space font-medium text-gray-300 hover:text-cyber-violet hover:drop-shadow-[0_0_8px_rgba(181,55,242,0.5)] transition-all uppercase tracking-widest">Work</button>
                    <button onClick={(e) => handleNavClick(e, 'contact')} className="text-sm font-space font-medium text-gray-300 hover:text-cyber-pink hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.5)] transition-all uppercase tracking-widest">Contact</button>
                </div>
            </div>
        </motion.nav>
    );
}
