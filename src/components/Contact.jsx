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
                            <h2 className="text-4xl md:text-5xl font-orbitron font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyber-violet">Initialize Connection</h2>
                            <p className="text-gray-400 font-inter font-light leading-relaxed text-lg">Looking to optimize a system, build a daemon, or discuss Android internals? Drop a packet below.</p>
                        </motion.div>

                        <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-400 ml-1">Name</label>
                                    <input
                                        type="text"
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyber-cyan/50 focus:bg-white/10 transition-all text-white placeholder-gray-600"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-400 ml-1">Email</label>
                                    <input
                                        type="email"
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyber-cyan/50 focus:bg-white/10 transition-all text-white placeholder-gray-600"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                <label className="text-sm text-gray-400 ml-1">Message</label>
                                <textarea
                                    rows="5"
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyber-cyan/50 focus:bg-white/10 transition-all text-white resize-none placeholder-gray-600"
                                    placeholder="What's on your mind?"
                                    spellCheck="false"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                />
                            </motion.div>

                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="mt-4 bg-gradient-to-r from-cyber-cyan to-cyber-violet text-white font-space font-bold tracking-widest uppercase py-4 rounded-xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(181,55,242,0.4)] transition-shadow border border-white/10"
                            >
                                Send Message <Send className="w-5 h-5 drop-shadow-md" />
                            </motion.button>
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
