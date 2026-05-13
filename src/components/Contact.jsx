import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Contact() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const location = useLocation();
    const navigate = useNavigate();

    const handleNavClick = (e, id) => {
        e.preventDefault();

        if (location.pathname !== '/') {
            navigate('/');
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

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const { name, email, message } = formData;

        if (!name || !email || !message) {
            alert("Please fill in all fields to send a message.");
            return;
        }

        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:sdangalla44@gmail.com?subject=${subject}&body=${body}`;

        window.open(mailtoLink, '_blank');

        // Optional: clear the form after opening the mail client
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <>
            <section className="min-h-[80vh] py-24 px-6 relative flex items-center justify-center bg-cyber-dark overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyber-violet/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

                <div className="w-full max-w-3xl z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="glass p-10 md:p-14 rounded-3xl border border-white/5 bg-cyber-dark/80 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                    >
                        <motion.div variants={itemVariants} className="text-center mb-10">
                            <span className="text-sm font-space tracking-widest text-cyber-cyan mb-4 flex items-center justify-center gap-2 uppercase">
                                <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_8px_#00f3ff]" />
                                System.out.println("Hello");
                            </span>
                            <h2 className="text-4xl md:text-5xl font-orbitron font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyber-violet">Let's build systems together</h2>
                            <p className="text-gray-400 font-inter font-light leading-relaxed text-lg">Open to Android / Linux engineering roles. Available for internships & system projects.</p>
                        </motion.div>

                        <form className="flex flex-col gap-8 relative" onSubmit={handleFormSubmit}>
                            {/* Technical HUD Accents for the Form */}
                            <div className="absolute -left-4 -top-4 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan/50 pointer-events-none" />
                            <div className="absolute -right-4 -bottom-4 w-8 h-8 border-b-2 border-r-2 border-cyber-violet/50 pointer-events-none" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Name Input */}
                                <motion.div variants={itemVariants} className="relative group">
                                    <label className="absolute -top-3 left-4 bg-cyber-dark px-2 text-xs font-mono tracking-widest text-cyber-cyan z-10 group-focus-within:text-white transition-colors">
                                        ID_STRING
                                    </label>
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/10 to-transparent blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                    <input
                                        type="text"
                                        className="relative w-full bg-[#050505]/80 border border-white/10 px-5 py-4 outline-none focus:border-cyber-cyan transition-all text-white font-mono text-sm placeholder-gray-700"
                                        placeholder="[ ENTER IDENTIFIER ]"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    {/* Corner Accents */}
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-cyan opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-cyan opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                </motion.div>

                                {/* Email Input */}
                                <motion.div variants={itemVariants} className="relative group">
                                    <label className="absolute -top-3 left-4 bg-cyber-dark px-2 text-xs font-mono tracking-widest text-cyber-violet z-10 group-focus-within:text-white transition-colors">
                                        NETWORK_NODE
                                    </label>
                                    <div className="absolute inset-0 bg-gradient-to-l from-cyber-violet/10 to-transparent blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                    <input
                                        type="email"
                                        className="relative w-full bg-[#050505]/80 border border-white/10 px-5 py-4 outline-none focus:border-cyber-violet transition-all text-white font-mono text-sm placeholder-gray-700"
                                        placeholder="[ ENTER ADDRESS ]"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                    {/* Corner Accents */}
                                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-violet opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-violet opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                </motion.div>
                            </div>

                            {/* Message Input */}
                            <motion.div variants={itemVariants} className="relative group">
                                <label className="absolute -top-3 left-4 bg-cyber-dark px-2 text-xs font-mono tracking-widest text-white/50 z-10 group-focus-within:text-cyber-cyan transition-colors">
                                    DATA_PAYLOAD
                                </label>
                                <div className="absolute inset-0 bg-gradient-to-t from-cyber-cyan/5 to-transparent blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                <textarea
                                    rows="6"
                                    className="relative w-full bg-[#050505]/80 border border-white/10 px-5 py-5 outline-none focus:border-white/30 transition-all text-white font-mono text-sm resize-none placeholder-gray-700"
                                    placeholder="> INITIALIZE SECURE TRANSMISSION..."
                                    spellCheck="false"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                />
                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/30 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/30 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            </motion.div>

                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="relative mt-2 w-full overflow-hidden group bg-[#0a0a0a] border border-cyber-cyan/50 px-8 py-5 flex items-center justify-center gap-4 transition-all"
                            >
                                {/* Glitch Hover Effect Background */}
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,243,255,0.05)_2px,rgba(0,243,255,0.05)_4px)] transition-opacity" />
                                
                                <span className="relative z-10 text-cyber-cyan font-space font-black tracking-[0.3em] uppercase text-sm group-hover:text-white transition-colors flex items-center gap-3">
                                    TRANSMIT_DATA <Send className="w-4 h-4" />
                                </span>
                                
                                {/* Corner brackets for the button */}
                                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-cyber-cyan transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-cyber-cyan transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                            </motion.button>
                            
                            {/* Small warning text */}
                            <motion.div variants={itemVariants} className="text-center">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                    // Transmission is routed via default mail client
                                </span>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Floating Glassmorphism Footer */}
            <footer className="w-full pb-10 px-6 relative z-20 flex justify-center bg-cyber-dark">
                <div className="w-full max-w-5xl glass p-8 md:p-10 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col gap-8">

                    {/* Top Row: Links & Brand */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4 items-start">

                        {/* Left: Brand Identity */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <img
                                src="/sn-logo.png"
                                alt="SN Logo"
                                className="w-12 h-12 object-contain mb-4 drop-shadow-[0_0_8px_rgba(0,243,255,0.4)] hover:drop-shadow-[0_0_14px_rgba(0,243,255,0.7)] hover:scale-105 transition-all duration-300"
                            />
                            <h3 className="text-xl font-orbitron font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-violet mb-2">
                                SILUNA NUSAL
                            </h3>
                            <p className="text-sm font-inter font-light text-gray-400 max-w-[250px]">
                                Engineering low-level systems & architecting robust security protocols.
                            </p>
                        </div>

                        {/* Center: Quick Links */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left font-space tracking-widest text-sm">
                            <h4 className="text-white/60 font-bold mb-4 uppercase text-xs">Navigation</h4>
                            <div className="flex flex-col gap-3">
                                <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-gray-400 hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_var(--theme-primary)] transition-all">Home</a>
                                <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="text-gray-400 hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_var(--theme-primary)] transition-all">Projects</a>
                                <a href="#skills" onClick={(e) => handleNavClick(e, 'skills')} className="text-gray-400 hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_var(--theme-primary)] transition-all">Skills</a>
                                <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-gray-400 hover:text-cyber-cyan hover:drop-shadow-[0_0_8px_var(--theme-primary)] transition-all">Contact</a>
                                <a href="/Siluna_Nusal_CV.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyber-violet hover:drop-shadow-[0_0_8px_var(--theme-secondary)] transition-all">Download CV</a>
                            </div>
                        </div>

                        {/* Right: Connect & Status */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left font-space tracking-widest text-sm">
                            <h4 className="text-white/60 font-bold mb-4 uppercase text-xs">Connect</h4>
                            <div className="flex flex-col gap-3 mb-6">
                                <a href="https://github.com/GitGuru29" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                    <span className="text-lg">↗</span> GitHub
                                </a>
                                <a href="https://www.linkedin.com/in/siluna-dangalla-0744a02b1/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0077B5] transition-colors flex items-center gap-2">
                                    <span className="text-lg">↗</span> LinkedIn
                                </a>
                                <a href="mailto:sdangalla44@gmail.com" className="text-gray-400 hover:text-cyber-pink transition-colors flex items-center gap-2">
                                    <span className="text-lg">↗</span> Email
                                </a>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] font-space tracking-widest text-cyber-cyan">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_8px_#00f3ff]" />
                                SYSTEM STATUS: ONLINE
                            </div>
                        </div>

                    </div>

                    {/* Bottom Row: Copyright */}
                    <div className="mt-4 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 border-t border-white/5 font-mono gap-4">
                        <span>© {new Date().getFullYear()} SILUNA NUSAL</span>
                        <span className="opacity-40">ENCRYPTED // CONNECTION SECURE</span>
                    </div>

                </div>
            </footer>
        </>
    );
}
