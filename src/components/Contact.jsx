import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { useLocation, useNavigate } from 'react-router-dom';

// ─── EmailJS Config ───────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
// ─────────────────────────────────────────────────────────────────

const STATUS = { IDLE: 'idle', SENDING: 'sending', SUCCESS: 'success', ERROR: 'error' };

export default function Contact() {
    const formRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(STATUS.IDLE);
    const [focusedField, setFocusedField] = useState(null);

    // ── Nav helper ────────────────────────────────────────────────
    const handleNavClick = (e, id) => {
        e.preventDefault();
        const scrollTo = () => {
            const el = document.getElementById(id);
            if (el && window.lenis) window.lenis.scrollTo(el, { offset: 0, duration: 1.2 });
            else if (el) el.scrollIntoView({ behavior: 'smooth' });
        };
        if (location.pathname !== '/') { navigate('/'); setTimeout(scrollTo, 150); }
        else scrollTo();
    };

    // ── Email send ────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;

        setStatus(STATUS.SENDING);
        try {
            await emailjs.sendForm(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                formRef.current,
                EMAILJS_PUBLIC_KEY,
            );
            setStatus(STATUS.SUCCESS);
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(STATUS.IDLE), 5000);
        } catch (err) {
            console.error('EmailJS error:', err);
            setStatus(STATUS.ERROR);
            setTimeout(() => setStatus(STATUS.IDLE), 5000);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    };

    return (
        <>
            {/* ── Contact Section ─────────────────────────────────── */}
            <section id="contact" className="w-full pt-32 pb-16 px-4 md:px-6 flex flex-col items-center relative z-10 overflow-hidden bg-transparent">

                {/* Structural line */}
                <div className="structural-line structural-line-h top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl hidden lg:block" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="w-full max-w-7xl mx-auto"
                >
                    {/* ── Grid: left info | right form ──────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 md:gap-20 lg:gap-0">

                        {/* Left — info panel */}
                        <motion.div variants={itemVariants} className="lg:pr-20 xl:pr-32 flex flex-col justify-between">
                            <div>
                                <span className="text-[10px] tracking-[0.4em] font-space uppercase text-[var(--color-geyser)]/40 mb-6 block">
                                    Initiate Contact
                                </span>
                                <h2 className="text-4xl md:text-5xl xl:text-6xl font-space font-light text-[var(--color-geyser)] leading-tight mb-8">
                                    Let's build<br />systems.
                                </h2>
                                <p className="text-sm md:text-base font-inter font-light text-[var(--color-geyser)]/50 leading-relaxed max-w-sm mb-12">
                                    Open to Android / Linux engineering roles.<br />
                                    Available for internships &amp; deep tech projects.
                                </p>
                            </div>

                            {/* Contact meta */}
                            <div className="space-y-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-space tracking-[0.3em] uppercase text-[var(--color-geyser)]/30">Email</span>
                                    <a href="mailto:sdangalla44@gmail.com" className="text-sm font-inter text-[var(--color-geyser)]/70 hover:text-[var(--color-geyser)] transition-colors">
                                        sdangalla44@gmail.com
                                    </a>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-space tracking-[0.3em] uppercase text-[var(--color-geyser)]/30">Based in</span>
                                    <span className="text-sm font-inter text-[var(--color-geyser)]/70">Sri Lanka · Remote Friendly</span>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[9px] font-space tracking-[0.25em] uppercase text-[var(--color-geyser)]/40">Available for work</span>
                                </div>
                                {/* Social links */}
                                <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--color-geyser)]/10">
                                    {[
                                        { label: 'GitHub', href: 'https://github.com/GitGuru29' },
                                        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/siluna-dangalla-0744a02b1/' },
                                        { label: 'X / Twitter', href: 'https://x.com/siluna36074' },
                                    ].map(({ label, href }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[9px] font-space tracking-[0.25em] uppercase text-[var(--color-geyser)]/40 hover:text-[var(--color-geyser)] transition-colors border-b border-transparent hover:border-[var(--color-geyser)]/30 pb-0.5"
                                        >
                                            {label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right — light gray form card */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-[#F5F5F7] rounded-[28px] md:rounded-[36px] p-8 md:p-12 xl:p-16 relative overflow-hidden border border-slate-200/60 shadow-[0_8px_40px_rgba(59,130,246,0.06)]"
                        >
                            {/* Ambient glow */}
                            <div className="absolute top-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-300/10 rounded-full blur-[80px] translate-x-1/4 translate-y-1/4 pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {status === STATUS.SUCCESS ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex flex-col items-center justify-center h-full min-h-[320px] text-center gap-6"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                                            <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-space font-light text-slate-800 mb-2">Message Transmitted</h3>
                                            <p className="text-sm font-inter text-slate-500">Packet received. I'll respond within 24 hours.</p>
                                        </div>
                                    </motion.div>
                                ) : status === STATUS.ERROR ? (
                                    <motion.div
                                        key="error"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex flex-col items-center justify-center h-full min-h-[320px] text-center gap-6"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center">
                                            <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-space font-light text-slate-800 mb-2">Transmission Failed</h3>
                                            <p className="text-sm font-inter text-slate-500">Connection error. Try emailing directly at<br />sdangalla44@gmail.com</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        ref={formRef}
                                        onSubmit={handleSubmit}
                                        initial={{ opacity: 1 }}
                                        className="flex flex-col gap-8 relative z-10"
                                    >
                                        <div className="mb-2">
                                            <h3 className="text-[10px] font-space tracking-[0.35em] uppercase text-blue-500/80 mb-1">New Transmission</h3>
                                        </div>

                                        {/* Name */}
                                        <div className="relative">
                                            <label className={`block text-[9px] tracking-[0.35em] font-space uppercase mb-3 transition-colors duration-300 ${focusedField === 'name' ? 'text-blue-600' : 'text-slate-400'}`}>
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                name="from_name"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="Your full name"
                                                required
                                                className="w-full bg-white/50 border border-blue-200 focus:border-blue-400 rounded-xl px-5 py-4 outline-none text-slate-800 font-inter text-sm placeholder-slate-400/60 transition-all duration-300 focus:bg-white"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="relative">
                                            <label className={`block text-[9px] tracking-[0.35em] font-space uppercase mb-3 transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-600' : 'text-slate-400'}`}>
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="from_email"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="your@email.com"
                                                required
                                                className="w-full bg-white/50 border border-blue-200 focus:border-blue-400 rounded-xl px-5 py-4 outline-none text-slate-800 font-inter text-sm placeholder-slate-400/60 transition-all duration-300 focus:bg-white"
                                            />
                                        </div>

                                        {/* Message */}
                                        <div className="relative">
                                            <label className={`block text-[9px] tracking-[0.35em] font-space uppercase mb-3 transition-colors duration-300 ${focusedField === 'message' ? 'text-blue-600' : 'text-slate-400'}`}>
                                                Message
                                            </label>
                                            <textarea
                                                name="message"
                                                rows={5}
                                                value={formData.message}
                                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                onFocus={() => setFocusedField('message')}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="Describe your project or inquiry..."
                                                required
                                                spellCheck="false"
                                                className="w-full bg-white/50 border border-blue-200 focus:border-blue-400 rounded-xl px-5 py-4 outline-none text-slate-800 font-inter text-sm placeholder-slate-400/60 transition-all duration-300 resize-none focus:bg-white"
                                            />
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={status === STATUS.SENDING}
                                            className="group w-full bg-blue-600 text-white rounded-xl py-4 font-space text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-blue-700 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md shadow-blue-500/20"
                                        >
                                            {status === STATUS.SENDING ? (
                                                <>
                                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                                    Transmitting...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <span className="inline-block group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200">↗</span>
                                                </>
                                            )}
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* ── Footer ──────────────────────────────────────────── */}
            <footer className="w-full relative z-20 bg-[#0A0F1C] border-t border-blue-500/10 pb-20 md:pb-24 rounded-t-[32px]">
                <div className="w-full max-w-7xl mx-auto px-6 pt-14 pb-8 relative">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-10">
                        <div className="md:col-span-6 flex flex-col items-start">
                            <img src="/favicon.png" alt="SIDAN Logo" className="h-14 w-14 object-contain mb-3 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                            <p className="text-sm font-inter font-light text-slate-300 max-w-sm leading-relaxed mb-8">
                                Engineering low-level systems, native Android tooling, and robust developer infrastructure from the ground up.
                            </p>
                            <div className="flex items-center gap-6">
                                {[
                                    { label: 'GitHub', href: 'https://github.com/GitGuru29' },
                                    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/siluna-dangalla-0744a02b1/' },
                                    { label: 'X', href: 'https://x.com/siluna36074' },
                                    { label: 'Resume ↗', href: '/Siluna_Nusal_CV.pdf' },
                                ].map(({ label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[9px] font-space tracking-[0.25em] uppercase text-slate-400 hover:text-white transition-colors border-b border-transparent hover:border-white/50 pb-0.5"
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-3 flex flex-col items-center md:items-start">
                            <h4 className="text-[10px] font-space tracking-[0.3em] text-slate-500 uppercase mb-6">Navigation</h4>
                            <div className="flex flex-col gap-4">
                                {['home', 'projects', 'skills', 'contact'].map(id => (
                                    <a
                                        key={id}
                                        href={`#${id}`}
                                        onClick={e => handleNavClick(e, id)}
                                        className="text-xs text-slate-300 hover:text-white transition-colors font-space tracking-[0.2em] uppercase"
                                    >
                                        {id}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-3 flex flex-col items-center md:items-start">
                            <h4 className="text-[10px] font-space tracking-[0.3em] text-slate-500 uppercase mb-6">Systems</h4>
                            <div className="flex flex-col gap-4">
                                {[
                                    { label: 'AeroLang', href: 'https://aero-lang-web.vercel.app/' },
                                    { label: 'AegisLayer', href: '/project/aegislayer' },
                                    { label: 'ByBridge', href: '/project/bybridge' },
                                    { label: 'Resume', href: '/Siluna_Nusal_CV.pdf' },
                                ].map(({ label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target={href?.startsWith('http') ? '_blank' : undefined}
                                        rel="noopener noreferrer"
                                        className="text-xs text-slate-300 hover:text-white transition-colors font-space tracking-[0.2em] uppercase"
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col items-center justify-center gap-4">
                        <span className="font-space text-[9px] tracking-[0.25em] text-slate-500 uppercase text-center">
                            © {new Date().getFullYear()} Siluna Nusal Dangalla · All Rights Reserved
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-space text-[9px] tracking-[0.25em] text-slate-500 uppercase">Operative State: Nominal</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
