import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Mail, Calendar, MapPin, Send, CheckCircle, Copy, Check, ExternalLink } from 'lucide-react';
import useStore from '../store/useStore';
import { playClickSound } from '../utils/soundFX';

// ── EmailJS Live Credentials ──
const EMAILJS_SERVICE_ID  = 'service_1exynem';
const EMAILJS_TEMPLATE_ID = 'template_2496aag';
const EMAILJS_PUBLIC_KEY  = 'kohy1zbTWHPEUKXq-';

const STATUS = { IDLE: 'idle', SENDING: 'sending', SUCCESS: 'success', ERROR: 'error' };

export default function Contact() {
    const formRef = useRef(null);
    const soundEnabled = useStore((s) => s.soundEnabled);
    const setMeetingModalOpen = useStore((s) => s.setMeetingModalOpen);

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(STATUS.IDLE);
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('sdangalla44@gmail.com');
        setCopiedEmail(true);
        playClickSound(soundEnabled);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;

        setStatus(STATUS.SENDING);
        playClickSound(soundEnabled);

        const isConfigured = EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' &&
                             EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
                             EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

        if (isConfigured) {
            try {
                await emailjs.sendForm(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    formRef.current,
                    EMAILJS_PUBLIC_KEY,
                );
                setStatus(STATUS.SUCCESS);
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus(STATUS.IDLE), 6000);
                return;
            } catch (err) {
                console.error('EmailJS error:', err);
            }
        }

        // Guaranteed Fail-Safe: Open pre-filled mailto dispatch + trigger success view
        const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
        
        setTimeout(() => {
            window.location.href = `mailto:sdangalla44@gmail.com?subject=${subject}&body=${body}`;
            setStatus(STATUS.SUCCESS);
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(STATUS.IDLE), 6000);
        }, 600);
    };

    return (
        <section id="contact" className="w-full py-24 md:py-32 px-4 md:px-8 relative z-10 overflow-hidden bg-transparent">
            <div className="max-w-7xl mx-auto">

                {/* Main Dark Blue Glass Container */}
                <div className="w-full rounded-[2.5rem] bg-gradient-to-br from-[#0c1322] via-[#0A0F1C] to-[#070b14] border border-blue-500/20 shadow-[0_20px_50px_-10px_rgba(59,130,246,0.25)] backdrop-blur-xl p-8 md:p-14 lg:p-16 relative overflow-hidden">
                    
                    {/* Ambient Blue Background Lighting */}
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-400/10 blur-[120px] pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">

                        {/* Left Column: Direct Info & Booking CTA */}
                        <div className="lg:col-span-5 space-y-8">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase mb-4">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>Available for Opportunities</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-space font-bold text-white tracking-tight leading-tight mb-4">
                                    Let's Build <br className="hidden md:block" />Something Exceptional.
                                </h2>
                                <p className="text-sm font-sans text-neutral-400 leading-relaxed max-w-md">
                                    Open to Android &amp; Systems Engineering roles, full-time contracts, and high-impact technical collaborations.
                                </p>
                            </div>

                            {/* Live Calendar Booking CTA Card */}
                            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
                                <div className="flex items-center gap-3 text-white font-space font-semibold text-sm">
                                    <Calendar className="w-5 h-5 text-[#D4AF37]" />
                                    <span>Prefer a direct conversation?</span>
                                </div>
                                <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                                    Schedule a 1-on-1 video call directly in my availability calendar (Colombo UTC+5:30).
                                </p>
                                <button
                                    onClick={() => {
                                        setMeetingModalOpen(true);
                                        playClickSound(soundEnabled);
                                    }}
                                    className="w-full py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-black font-space font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                                >
                                    <span>Schedule a Meeting</span>
                                    <Calendar className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Contact Details List */}
                            <div className="space-y-4 pt-2">
                                {/* Email */}
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-blue-400" />
                                        <div>
                                            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Direct Email</div>
                                            <a href="mailto:sdangalla44@gmail.com" className="text-xs font-mono text-white hover:text-blue-400 transition-colors">
                                                sdangalla44@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCopyEmail}
                                        title="Copy Email"
                                        className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
                                    >
                                        {copiedEmail ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                <span className="text-emerald-400">Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 text-xs font-mono text-neutral-300">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                    <span>Sri Lanka (UTC+5:30) · Remote Worldwide</span>
                                </div>
                            </div>

                            {/* Social Media Links */}
                            <div className="flex items-center gap-3 pt-2">
                                {[
                                    { label: 'GitHub', href: 'https://github.com/GitGuru29' },
                                    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/siluna-dangalla-0744a02b1/' },
                                    { label: 'X / Twitter', href: 'https://x.com/siluna36074' },
                                ].map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3.5 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs font-mono text-neutral-400 hover:text-white hover:border-blue-500/40 transition-all"
                                    >
                                        {item.label} ↗
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Direct Message Form */}
                        <div className="lg:col-span-7">
                            <div className="p-6 md:p-10 rounded-3xl bg-neutral-900/70 border border-neutral-800/90 shadow-2xl relative overflow-hidden">
                                
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-space font-bold text-white flex items-center gap-2">
                                        <Send className="w-5 h-5 text-blue-400" />
                                        <span>Send a Direct Message</span>
                                    </h3>

                                    <a
                                        href="mailto:sdangalla44@gmail.com"
                                        className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        <span>Open Mail App</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                <AnimatePresence mode="wait">
                                    {status === STATUS.SUCCESS ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="py-12 flex flex-col items-center text-center space-y-4"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                                                <CheckCircle className="w-8 h-8" />
                                            </div>
                                            <h4 className="text-xl font-space font-bold text-white">Message Transmitted!</h4>
                                            <p className="text-xs font-sans text-neutral-400 max-w-sm leading-relaxed">
                                                Thank you! Your message has been processed. If your default mail application opened, confirm send or I will reply directly to your email within 24 hours.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                                            {/* Variable aliases matching EmailJS template placeholders */}
                                            <input type="hidden" name="name" value={formData.name} />
                                            <input type="hidden" name="email" value={formData.email} />
                                            <input type="hidden" name="reply_to" value={formData.email} />
                                            <input type="hidden" name="title" value={`Message from ${formData.name}`} />
                                            <div>
                                                <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                                                    Your Name *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="from_name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="John Doe"
                                                    className="w-full px-4 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                                                    Email Address *
                                                </label>
                                                <input
                                                    required
                                                    type="email"
                                                    name="from_email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="john@company.com"
                                                    className="w-full px-4 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                                                    Message / Project Details *
                                                </label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    placeholder="Briefly describe your project, inquiry, or role..."
                                                    className="w-full px-4 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={status === STATUS.SENDING}
                                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-space font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
                                            >
                                                {status === STATUS.SENDING ? (
                                                    <span>Transmitting Message...</span>
                                                ) : (
                                                    <>
                                                        <span>Send Message</span>
                                                        <Send className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </AnimatePresence>

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
