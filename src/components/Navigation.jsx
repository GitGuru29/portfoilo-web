import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/50 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}
        >
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                <a href="#" className="text-xl font-bold tracking-widest text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">SN</span>
                </a>
                <div className="hidden md:flex items-center gap-8">
                    <NavLink href="#about">About</NavLink>
                    <NavLink href="#projects">Work</NavLink>
                    <NavLink href="#contact">Contact</NavLink>
                </div>
            </div>
        </motion.nav>
    );
}

function NavLink({ href, children }) {
    return (
        <a href={href} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            {children}
        </a>
    );
}
