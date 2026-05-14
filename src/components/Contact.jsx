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

            {/* Premium Cyber Footer */}
            <footer className="w-full relative z-20 bg-[#020202] border-t border-white/5 overflow-hidden">

                {/* Subtle grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/40 to-transparent" />

                <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-16 relative">

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                        {/* Brand Block */}
                        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src="/sn-logo.png"
                                    alt="SN Logo"
                                    className="w-14 h-14 object-contain drop-shadow-[0_0_12px_rgba(0,243,255,0.5)] hover:drop-shadow-[0_0_20px_rgba(0,243,255,0.8)] hover:scale-105 transition-all duration-300"
                                />
                                <div>
                                    <h3 className="text-2xl font-orbitron font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                        SILUNA
                                    </h3>
                                    <h3 className="text-2xl font-orbitron font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-violet">
                                        NUSAL
                                    </h3>
                                </div>
                            </div>
                            <p className="text-sm font-inter font-light text-gray-500 max-w-[280px] leading-relaxed mb-8">
                                Engineering low-level systems, native Android tooling, and robust developer infrastructure from the ground up.
                            </p>
                            {/* Social icon buttons */}
                            <div className="flex items-center gap-3">
                                <a href="https://github.com/GitGuru29" target="_blank" rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center border border-white/10 text-gray-500 hover:text-white hover:border-white/40 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                                </a>
                                <a href="https://www.linkedin.com/in/siluna-dangalla-0744a02b1/" target="_blank" rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center border border-white/10 text-gray-500 hover:text-[#0077B5] hover:border-[#0077B5]/40 hover:bg-[#0077B5]/5 hover:shadow-[0_0_15px_rgba(0,119,181,0.2)] transition-all">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                </a>
                                <a href="mailto:sdangalla44@gmail.com"
                                    className="w-10 h-10 flex items-center justify-center border border-white/10 text-gray-500 hover:text-cyber-pink hover:border-cyber-pink/40 hover:bg-cyber-pink/5 hover:shadow-[0_0_15px_rgba(255,0,255,0.15)] transition-all">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                </a>
                                <a href="https://x.com/siluna36074" target="_blank" rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center border border-white/10 text-gray-500 hover:text-white hover:border-white/40 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </a>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="md:col-span-2 flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-1 h-4 bg-cyber-cyan" />
                                <h4 className="text-[10px] font-space font-bold tracking-[0.3em] text-white/40 uppercase">Navigation</h4>
                            </div>
                            <div className="flex flex-col gap-4">
                                {['home','projects','skills','contact'].map(id => (
                                    <a key={id} href={`#${id}`} onClick={(e) => handleNavClick(e, id)}
                                        className="text-sm text-gray-500 hover:text-cyber-cyan hover:translate-x-1 hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.5)] transition-all font-space tracking-widest uppercase group flex items-center gap-2">
                                        <span className="w-0 group-hover:w-3 h-px bg-cyber-cyan transition-all duration-300" />
                                        {id}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Connect */}
                        <div className="md:col-span-3 flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-1 h-4 bg-cyber-pink" />
                                <h4 className="text-[10px] font-space font-bold tracking-[0.3em] text-white/40 uppercase">Connect</h4>
                            </div>
                            <div className="flex flex-col gap-4">
                                <a href="https://github.com/GitGuru29" target="_blank" rel="noopener noreferrer"
                                    className="text-sm text-gray-500 hover:text-white hover:translate-x-1 transition-all font-space tracking-widest uppercase group flex items-center gap-2">
                                    <span className="text-base">↗</span> GitHub
                                </a>
                                <a href="https://www.linkedin.com/in/siluna-dangalla-0744a02b1/" target="_blank" rel="noopener noreferrer"
                                    className="text-sm text-gray-500 hover:text-[#0077B5] hover:translate-x-1 transition-all font-space tracking-widest uppercase group flex items-center gap-2">
                                    <span className="text-base">↗</span> LinkedIn
                                </a>
                                <a href="mailto:sdangalla44@gmail.com"
                                    className="text-sm text-gray-500 hover:text-cyber-pink hover:translate-x-1 transition-all font-space tracking-widest uppercase group flex items-center gap-2">
                                    <span className="text-base">↗</span> Email
                                </a>
                                <a href="https://x.com/siluna36074" target="_blank" rel="noopener noreferrer"
                                    className="text-sm text-gray-500 hover:text-white hover:translate-x-1 transition-all font-space tracking-widest uppercase group flex items-center gap-2">
                                    <span className="text-base">↗</span> X / Twitter
                                </a>
                            </div>
                        </div>

                        {/* Systems */}
                        <div className="md:col-span-3 flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-1 h-4 bg-cyber-violet" />
                                <h4 className="text-[10px] font-space font-bold tracking-[0.3em] text-white/40 uppercase">Systems</h4>
                            </div>
                            <div className="flex flex-col gap-4 w-full">
                                {[
                                    { label: 'AeroLang Compiler', href: 'https://aero-lang-web.vercel.app/' },
                                    { label: 'AegisLayer Daemon', href: '/project/aegislayer' },
                                    { label: 'ByBridge', href: '/project/bybridge' },
                                    { label: 'Download Resume', href: '/Siluna_Nusal_CV.pdf' },
                                ].map(link => (
                                    <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                                        className="text-sm text-gray-500 hover:text-cyber-violet hover:translate-x-1 hover:drop-shadow-[0_0_8px_rgba(181,55,242,0.5)] transition-all font-space tracking-widest uppercase group flex items-center gap-2">
                                        <span className="w-0 group-hover:w-3 h-px bg-cyber-violet transition-all duration-300" />
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 font-mono text-[11px] text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_6px_#00f3ff]" />
                            <span>SYSTEM ONLINE</span>
                            <span className="text-white/10">|</span>
                            <span>© {new Date().getFullYear()} SILUNA NUSAL DANGALLA</span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-500 tracking-widest">ENCRYPTED // CONNECTION SECURE // ALL RIGHTS RESERVED</span>
                    </div>

                </div>
            </footer>
        </>
    );
}
