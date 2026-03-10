import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function Contact() {
    return (
        <>
            <section className="min-h-[80vh] py-24 px-6 relative flex items-center justify-center bg-cyber-dark overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyber-violet/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

                <div className="w-full max-w-3xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="glass p-10 md:p-14 rounded-3xl border border-white/5 bg-cyber-dark/60 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="text-center mb-10">
                            <span className="text-sm font-space tracking-widest text-cyber-cyan mb-4 flex items-center justify-center gap-2 uppercase">
                                <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_8px_#00f3ff]" />
                                System.out.println("Hello");
                            </span>
                            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyber-violet tracking-tight">Initialize Connection</h2>
                            <p className="text-gray-400 font-inter font-light text-lg">Looking to optimize a system, build a daemon, or discuss Android internals? Drop a packet below.</p>
                        </div>

                        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-space text-gray-400 ml-1">Name</label>
                                    <input
                                        type="text"
                                        className="bg-black/50 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-cyber-cyan/50 focus:bg-cyber-cyan/5 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all font-inter text-white placeholder-gray-600"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-space text-gray-400 ml-1">Email</label>
                                    <input
                                        type="email"
                                        className="bg-black/50 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-cyber-cyan/50 focus:bg-cyber-cyan/5 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all font-inter text-white placeholder-gray-600"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-space text-gray-400 ml-1">Message</label>
                                <textarea
                                    rows="5"
                                    className="bg-black/50 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-cyber-cyan/50 focus:bg-cyber-cyan/5 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all font-inter text-white resize-none placeholder-gray-600"
                                    placeholder="What's on your mind?"
                                    spellCheck="false"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-4 bg-gradient-to-r from-cyber-cyan/80 to-cyber-violet/80 text-white font-space font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(181,55,242,0.5)] border border-white/10 transition-shadow"
                            >
                                Send Message <Send className="w-4 h-4 ml-2" />
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Footer in normal document flow below the section */}
            <footer className="w-full border-t border-white/5 bg-[#050505] py-8 px-6 relative z-20">
                <div className="max-w-6xl mx-auto grid grid-cols-3 items-center gap-4">

                    {/* Left: Small logo icon */}
                    <div className="flex items-center justify-start">
                        <img
                            src="/sn-logo.png"
                            alt="SN Logo"
                            className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(0,243,255,0.4)] hover:drop-shadow-[0_0_14px_rgba(0,243,255,0.8)] transition-all duration-300"
                        />
                    </div>

                    {/* Center: Brand + Status */}
                    <div className="flex flex-col items-center text-center">
                        <span className="text-sm md:text-base font-orbitron font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-violet">
                            SILUNA NUSAL
                        </span>
                        <div className="flex items-center gap-2 text-[10px] md:text-xs font-space font-medium tracking-widest text-[#00ff00] mt-1 shadow-[0_0_10px_rgba(0,255,0,0.2)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse shadow-[0_0_8px_#00ff00]" />
                            SYSTEM STATUS: ONLINE
                        </div>
                    </div>

                    {/* Right: Social Icons */}
                    <div className="flex items-center justify-end gap-6">
                        <a href="https://github.com/GitGuru29" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:-translate-y-1 transition-all duration-300">
                            <span className="sr-only">GitHub</span>
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-cyber-cyan hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.6)] transition-all duration-300">
                            <span className="sr-only">LinkedIn</span>
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="mailto:sdangalla66@gmail.com" className="text-gray-400 hover:text-cyber-violet hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(181,55,242,0.6)] transition-all duration-300">
                            <span className="sr-only">Email</span>
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Bottom: Copyright */}
                <div className="mt-8 text-center text-xs text-gray-500 border-t border-white/5 pt-6 max-w-6xl mx-auto flex flex-col md:flex-row justify-between font-space tracking-widest">
                    <span>© {new Date().getFullYear()} SILUNA NUSAL</span>
                    <span className="mt-2 md:mt-0 opacity-40 text-cyber-cyan">ENCRYPTED // CONNECTION SECURE</span>
                </div>
            </footer>
        </>
    );
}
