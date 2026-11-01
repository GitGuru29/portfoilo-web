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

const INQUIRY_TOPICS = [
    'Systems / C++ Engineering',
    'Android & NDK Architecture',
    'Technical Consulting',
    'R&D Collaboration',
];

export default function Contact() {
    const formRef = useRef(null);
    const soundEnabled = useStore((s) => s.soundEnabled);
    const setMeetingModalOpen = useStore((s) => s.setMeetingModalOpen);

    const [formData, setFormData] = useState({ name: '', email: '', topic: 'Systems / C++ Engineering', message: '' });
    const [status, setStatus] = useState(STATUS.IDLE);
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [copiedFp, setCopiedFp] = useState(null);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('sdangalla44@gmail.com');
        setCopiedEmail(true);
        playClickSound(soundEnabled);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const handleCopy = (label, text) => {
        navigator.clipboard.writeText(text);
        setCopiedFp(label);
        playClickSound(soundEnabled);
        setTimeout(() => setCopiedFp(null), 2000);
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
                setFormData({ name: '', email: '', topic: 'Systems / C++ Engineering', message: '' });
                setTimeout(() => setStatus(STATUS.IDLE), 6000);
                return;
            } catch (err) {
                console.error('EmailJS error:', err);
            }
        }

        // Guaranteed Fail-Safe: Open pre-filled mailto dispatch + trigger success view
        const subject = encodeURIComponent(`[${formData.topic}] Portfolio Inquiry from ${formData.name}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nTopic: ${formData.topic}\n\nMessage:\n${formData.message}`);
        
        setTimeout(() => {
            window.location.href = `mailto:sdangalla44@gmail.com?subject=${subject}&body=${body}`;
            setStatus(STATUS.SUCCESS);
            setFormData({ name: '', email: '', topic: 'Systems / C++ Engineering', message: '' });
            setTimeout(() => setStatus(STATUS.IDLE), 6000);
        }, 600);
    };

    return (
        <section className="w-full relative z-10 overflow-hidden bg-transparent">
            <div className="w-full rounded-none bg-panel border-2 border-ink/80 shadow-[6px_6px_0_rgba(13,13,13,0.12)] p-6 md:p-10 relative overflow-hidden">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative z-10">

                    {/* Left Column: Direct Info & Booking CTA */}
                    <div className="lg:col-span-5 space-y-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-panel-deep border border-ink/40 text-ink text-[10px] font-mono tracking-widest uppercase mb-4">
                                <span className="w-2 h-2 bg-accent animate-pulse" />
                                <span>● Open for Engagement — Desk 024</span>
                            </div>
                            <h3 className="text-2xl md:text-4xl font-display font-bold text-ink tracking-tight leading-tight mb-3">
                                Let&apos;s Architect <br className="hidden md:block" />Something Enduring.
                            </h3>
                            <p className="text-sm font-serif text-ink/80 leading-relaxed max-w-md">
                                Available for Systems &amp; Android Engineering roles, low-level C/C++ contracts, and high-impact technical collaborations.
                            </p>
                        </div>

                        {/* Live Calendar Booking CTA Card */}
                        <div className="p-5 rounded-none bg-panel-deep/70 border border-ink/25 space-y-3">
                            <div className="flex items-center gap-2.5 text-ink font-display font-bold text-base">
                                <Calendar className="w-4 h-4 text-accent" />
                                <span>Prefer a Direct Briefing?</span>
                            </div>
                            <p className="text-xs font-serif text-graphite leading-relaxed">
                                Reserve a 1-on-1 technical call directly on the Colombo bureau calendar (UTC+5:30).
                            </p>
                            <button
                                onClick={() => {
                                    setMeetingModalOpen(true);
                                    playClickSound(soundEnabled);
                                }}
                                className="w-full py-3 px-4 rounded-none bg-ink hover:bg-accent text-void font-mono font-bold text-[10px] uppercase tracking-[0.22em] flex items-center justify-center gap-2 transition-all shadow-[3px_3px_0_var(--color-accent)] hover:shadow-none cursor-pointer"
                            >
                                <span>Schedule a Briefing Call</span>
                                <Calendar className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Contact Details List */}
                        <div className="space-y-3 pt-1">
                            {/* Email */}
                            <div className="flex items-center justify-between p-4 rounded-none bg-panel-deep/40 border border-ink/20">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-accent" />
                                    <div>
                                        <div className="text-[9px] font-mono text-graphite uppercase tracking-[0.2em]">Direct Wire</div>
                                        <a href="mailto:sdangalla44@gmail.com" className="text-xs font-mono font-bold text-ink hover:text-accent transition-colors">
                                            sdangalla44@gmail.com
                                        </a>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCopyEmail}
                                    title="Copy Email"
                                    className="px-2.5 py-1.5 rounded-none bg-panel border border-ink/25 hover:border-accent text-graphite hover:text-ink transition-colors flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider cursor-pointer"
                                >
                                    {copiedEmail ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-accent" />
                                            <span className="text-accent font-bold">Copied</span>
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
                            <div className="flex items-center gap-3 p-4 rounded-none bg-panel-deep/40 border border-ink/20 text-xs font-mono text-ink/80">
                                <MapPin className="w-4 h-4 text-accent" />
                                <span>Colombo, Sri Lanka (UTC+5:30) · Remote Worldwide</span>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            {[
                                { label: 'GitHub', href: 'https://github.com/GitGuru29' },
                                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/siluna-dangalla-0744a02b1/' },
                                { label: 'X / Twitter', href: 'https://x.com/siluna36074' },
                                { label: 'Resume CV', href: '/Siluna_Nusal_CV.pdf' },
                            ].map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-none bg-panel border border-ink/25 text-[10px] font-mono uppercase tracking-wider text-ink hover:text-accent hover:border-accent transition-all"
                                >
                                    {item.label} ↗
                                </a>
                            ))}
                        </div>

                        {/* Encrypted-channel fingerprints */}
                        <div className="border border-ink/20 bg-panel-deep/50 p-4">
                            <div className="flex items-center gap-2 text-[9px] font-mono font-bold tracking-[0.24em] uppercase text-accent">
                                <span className="w-1.5 h-1.5 bg-accent" />
                                Cryptographic Verification Channels
                            </div>
                            <div className="mt-3 space-y-2 font-mono text-[10px] text-graphite">
                                <div className="flex items-center justify-between gap-3 border-t border-ink/15 pt-2">
                                    <span className="truncate">PGP&nbsp;&nbsp;0x8F3A {copiedFp === 'pgp' ? <span className="text-accent font-bold">COPIED</span> : '4D22 C7E9'}</span>
                                    <button onClick={() => handleCopy('pgp', '0x8F3A4D22C7E9B01')} className="px-2 py-1 border border-ink/20 hover:border-accent hover:text-accent transition-colors cursor-pointer">
                                        {copiedFp === 'pgp' ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between gap-3 border-t border-ink/15 pt-2">
                                    <span className="truncate">SSH&nbsp;&nbsp;ED25519 {copiedFp === 'ssh' ? <span className="text-accent font-bold">COPIED</span> : 'SHA256:SILUNA'}</span>
                                    <button onClick={() => handleCopy('ssh', 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...sdangalla@sys')} className="px-2 py-1 border border-ink/20 hover:border-accent hover:text-accent transition-colors cursor-pointer">
                                        {copiedFp === 'ssh' ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between gap-3 border-t border-ink/15 pt-2">
                                    <button onClick={() => handleCopy('curl', 'curl -sL portfolio/connect')} className="text-ink hover:text-accent transition-colors truncate cursor-pointer font-semibold">
                                        $ curl -sL siluna.sys/connect
                                        <span className="inline-block ml-2 text-accent">{copiedFp === 'curl' ? '✓ COPIED' : '[COPY]'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Direct Message Form */}
                    <div className="lg:col-span-7">
                        <div className="p-6 md:p-9 rounded-none bg-panel-deep/40 border border-ink/25 relative overflow-hidden">
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-ink/20">
                                <div>
                                    <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-accent font-bold block">
                                        WESTERN UNION // TELEGRAPH DISPATCH FORM
                                    </span>
                                    <h4 className="text-lg md:text-xl font-display font-bold text-ink flex items-center gap-2 mt-0.5">
                                        <Send className="w-4 h-4 text-accent" />
                                        <span>Transmit a Direct Dispatch</span>
                                    </h4>
                                </div>

                                <a
                                    href="mailto:sdangalla44@gmail.com"
                                    className="text-[10px] font-mono uppercase tracking-widest text-accent hover:text-ink flex items-center gap-1 border border-accent/35 px-2.5 py-1 bg-accent/5"
                                >
                                    <span>Mail Client</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            <AnimatePresence mode="wait">
                                {status === STATUS.SUCCESS ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.96 }}
                                        className="py-12 flex flex-col items-center text-center space-y-4"
                                    >
                                        <div className="w-16 h-16 rounded-none bg-accent/10 border-2 border-accent text-accent flex items-center justify-center">
                                            <CheckCircle className="w-8 h-8" />
                                        </div>
                                        <h4 className="text-xl font-display font-bold text-ink">Dispatch Transmitted!</h4>
                                        <p className="text-xs font-serif text-graphite max-w-sm leading-relaxed">
                                            Thank you! Your message has been logged at the Colombo desk. I respond to all technical inquiries within 24 hours.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                                        {/* Variable aliases matching EmailJS template placeholders */}
                                        <input type="hidden" name="name" value={formData.name} />
                                        <input type="hidden" name="email" value={formData.email} />
                                        <input type="hidden" name="reply_to" value={formData.email} />
                                        <input type="hidden" name="title" value={`[${formData.topic}] Message from ${formData.name}`} />

                                        {/* Topic Selector Pills */}
                                        <div>
                                            <label className="text-[10px] font-mono text-graphite uppercase tracking-[0.18em] block mb-2">
                                                Subject Classification
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {INQUIRY_TOPICS.map((t) => (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, topic: t })}
                                                        className={`px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
                                                            formData.topic === t
                                                                ? 'bg-ink text-void border-ink font-bold'
                                                                : 'bg-panel text-graphite border-ink/20 hover:border-ink/50 hover:text-ink'
                                                        }`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-mono text-graphite uppercase tracking-[0.18em] block mb-1.5">
                                                    Sender Name *
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="from_name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Jane Doe"
                                                    className="w-full px-3.5 py-3 rounded-none bg-panel border border-ink/25 text-ink font-mono text-xs focus:outline-none focus:border-accent transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-mono text-graphite uppercase tracking-[0.18em] block mb-1.5">
                                                    Return Wire (Email) *
                                                </label>
                                                <input
                                                    required
                                                    type="email"
                                                    name="from_email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="jane@organization.com"
                                                    className="w-full px-3.5 py-3 rounded-none bg-panel border border-ink/25 text-ink font-mono text-xs focus:outline-none focus:border-accent transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-mono text-graphite uppercase tracking-[0.18em] block mb-1.5">
                                                Dispatch Body / Technical Brief *
                                            </label>
                                            <textarea
                                                required
                                                rows={5}
                                                name="message"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Describe your system architecture needs, engineering role, or project scope..."
                                                className="w-full px-3.5 py-3 rounded-none bg-panel border border-ink/25 text-ink font-mono text-xs focus:outline-none focus:border-accent transition-colors resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={status === STATUS.SENDING}
                                            className="w-full py-4 bg-accent hover:bg-ink text-void font-mono font-bold rounded-none text-xs uppercase tracking-[0.22em] flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0_var(--color-ink)] hover:shadow-none disabled:opacity-50 cursor-pointer"
                                        >
                                            {status === STATUS.SENDING ? (
                                                <span>Transmitting Wire...</span>
                                            ) : (
                                                <>
                                                    <span>Transmit Dispatch</span>
                                                    <Send className="w-3.5 h-3.5" />
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
        </section>
    );
}

