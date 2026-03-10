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

    // Handle scroll after navigating from another page
    useEffect(() => {
        if (location.pathname === '/' && location.state?.scrollTo) {
            setTimeout(() => {
                const element = document.getElementById(location.state.scrollTo);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location.pathname, location.state]);

    const handleNavClick = (e, sectionId) => {
        e.preventDefault();
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo: sectionId } });
        } else {
            const element = document.getElementById(sectionId);
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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cyber-dark/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'}`}
        >
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                <a
                    href="#/"
                    onClick={(e) => handleNavClick(e, 'root')}
                    className="text-2xl font-orbitron font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-violet drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]"
                >
                    SN
                </a>
                <div className="hidden md:flex items-center gap-8">
                    <NavLink onClick={(e) => handleNavClick(e, 'about')}>System.About()</NavLink>
                    <NavLink onClick={(e) => handleNavClick(e, 'projects')}>System.Work()</NavLink>
                    <NavLink onClick={(e) => handleNavClick(e, 'contact')}>System.Contact()</NavLink>
                </div>
            </div>
        </motion.nav>
    );
}

function NavLink({ onClick, children }) {
    return (
        <a
            href="#"
            onClick={onClick}
            className="text-sm font-space font-medium text-gray-300 hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.6)] transition-all duration-300 uppercase tracking-widest"
        >
            {children}
        </a>
    );
}
