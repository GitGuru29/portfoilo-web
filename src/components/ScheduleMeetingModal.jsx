import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Globe, User, Mail, Building, CheckCircle, X, ArrowRight, Download, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import { playClickSound, playChimeSound } from '../utils/soundFX';

export default function ScheduleMeetingModal({ isOpen, onClose }) {
    const soundEnabled = useStore((s) => s.soundEnabled);

    // Live clock state for Colombo, LK (UTC+5:30)
    const [lkTime, setLkTime] = useState('');
    const [userTimezone, setUserTimezone] = useState('');

    useEffect(() => {
        const updateClocks = () => {
            const now = new Date();
            // Colombo time formatting
            const lkFormatted = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Colombo',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            }).format(now);
            setLkTime(lkFormatted);

            // Detect visitor local timezone
            try {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                setUserTimezone(tz || 'Local Time');
            } catch {
                setUserTimezone('Local Time');
            }
        };

        updateClocks();
        const interval = setInterval(updateClocks, 1000);
        return () => clearInterval(interval);
    }, []);

    // Form state
    const [step, setStep] = useState(1);
    const [topic, setTopic] = useState('Software Engineering Role');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('02:00 PM LK Time');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Pre-calculate next 5 available business dates
    const getUpcomingDates = () => {
        const dates = [];
        let d = new Date();
        while (dates.length < 5) {
            d.setDate(d.getDate() + 1);
            if (d.getDay() !== 0 && d.getDay() !== 6) { // Exclude weekends
                dates.push(new Date(d));
            }
        }
        return dates;
    };

    const upcomingDates = getUpcomingDates();

    // Auto-select first date if empty
    useEffect(() => {
        if (upcomingDates.length > 0 && !selectedDate) {
            setSelectedDate(upcomingDates[0].toISOString().split('T')[0]);
        }
    }, [upcomingDates, selectedDate]);

    const TIME_SLOTS = [
        '10:00 AM LK Time (04:30 AM UTC)',
        '02:00 PM LK Time (08:30 AM UTC)',
        '05:00 PM LK Time (11:30 AM UTC)',
        '08:00 PM LK Time (02:30 PM UTC)',
    ];

    const TOPICS = [
        { id: 'role', label: 'Full-Time Engineering Role', desc: 'Discuss software engineering opportunities' },
        { id: 'consulting', label: 'Android & Systems Consulting', desc: 'Low-level architecture & mobile development' },
        { id: 'freelance', label: 'Custom Project / Freelance', desc: 'Collaborative development & technical builds' },
        { id: 'chat', label: 'Technical Chat & Networking', desc: 'General inquiry & open source networking' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        playClickSound(soundEnabled);

        // Simulate booking dispatch & email notification
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            playChimeSound(soundEnabled);
        }, 1200);
    };

    // Generate `.ics` Calendar event file for download
    const downloadICSFile = () => {
        playClickSound(soundEnabled);
        const eventTitle = `Meeting with Siluna Dangalla - ${topic}`;
        const eventDescription = `Topic: ${topic}\\nClient: ${formData.name} (${formData.email})\\nCompany: ${formData.company}\\nNotes: ${formData.notes}`;

        const icsData = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Siluna Dangalla Portfolio//NONSGML v1.0//EN',
            'BEGIN:VEVENT',
            `SUMMARY:${eventTitle}`,
            `DESCRIPTION:${eventDescription}`,
            `LOCATION:Google Meet / Online Call`,
            `STATUS:CONFIRMED`,
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\n');

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Meeting_Siluna_Dangalla.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetAndClose = () => {
        onClose();
        setTimeout(() => {
            setStep(1);
            setIsSubmitted(false);
        }, 300);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 overflow-y-auto">
                    {/* Dark Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={resetAndClose}
                        className="fixed inset-0 bg-black/85 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-xl bg-[#0d0d12] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 md:p-8"
                    >
                        {/* Header Bar */}
                        <div className="flex items-center justify-between pb-5 border-b border-neutral-800/80">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono tracking-wider uppercase mb-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>Available for Opportunities</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-space font-bold text-white tracking-tight">
                                    Schedule a Technical Chat
                                </h3>
                            </div>
                            <button
                                onClick={resetAndClose}
                                className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Live Timezone Banner */}
                        <div className="my-5 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-[#D4AF37]" />
                                <span>Colombo, LK (UTC+5:30): <strong className="text-white">{lkTime}</strong></span>
                            </div>
                            <div className="hidden sm:flex items-center gap-1.5 text-neutral-500">
                                <span>Your Zone: {userTimezone}</span>
                            </div>
                        </div>

                        {/* Main Body */}
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Step Indicators */}
                                <div className="flex items-center justify-between text-xs font-mono tracking-widest text-neutral-500 border-b border-neutral-800/50 pb-3 uppercase">
                                    <span className={step === 1 ? 'text-[#D4AF37] font-bold' : ''}>1. Select Topic</span>
                                    <span className={step === 2 ? 'text-[#D4AF37] font-bold' : ''}>2. Date & Time</span>
                                    <span className={step === 3 ? 'text-[#D4AF37] font-bold' : ''}>3. Your Details</span>
                                </div>

                                {/* Step 1: Topic Selection */}
                                {step === 1 && (
                                    <div className="space-y-3">
                                        <label className="text-xs font-mono tracking-wider text-neutral-400 uppercase block">
                                            What would you like to discuss?
                                        </label>
                                        <div className="grid grid-cols-1 gap-2.5">
                                            {TOPICS.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setTopic(item.label);
                                                        playClickSound(soundEnabled);
                                                    }}
                                                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                                                        topic === item.label
                                                            ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-lg'
                                                            : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                                                    }`}
                                                >
                                                    <div className="font-space font-semibold text-sm text-white">{item.label}</div>
                                                    <div className="text-xs font-sans text-neutral-400 mt-0.5">{item.desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => { setStep(2); playClickSound(soundEnabled); }}
                                            className="w-full mt-4 py-3.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-space font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                                        >
                                            <span>Next: Choose Date & Time</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Step 2: Date & Time Slot */}
                                {step === 2 && (
                                    <div className="space-y-4">
                                        {/* Date Selection */}
                                        <div>
                                            <label className="text-xs font-mono tracking-wider text-neutral-400 uppercase block mb-2">
                                                Select Preferred Date
                                            </label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {upcomingDates.map((d) => {
                                                    const dateStr = d.toISOString().split('T')[0];
                                                    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                                                    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                                    const isSelected = selectedDate === dateStr;

                                                    return (
                                                        <button
                                                            key={dateStr}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedDate(dateStr);
                                                                playClickSound(soundEnabled);
                                                            }}
                                                            className={`p-3 rounded-xl border text-center transition-all ${
                                                                isSelected
                                                                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold'
                                                                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                                                            }`}
                                                        >
                                                            <div className="text-xs font-mono uppercase">{dayName}</div>
                                                            <div className="text-sm font-space font-bold mt-0.5">{monthDay}</div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Time Slot Selection */}
                                        <div>
                                            <label className="text-xs font-mono tracking-wider text-neutral-400 uppercase block mb-2">
                                                Select Preferred Time Slot
                                            </label>
                                            <div className="space-y-2">
                                                {TIME_SLOTS.map((slot) => (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedTimeSlot(slot);
                                                            playClickSound(soundEnabled);
                                                        }}
                                                        className={`w-full p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${
                                                            selectedTimeSlot === slot
                                                                ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white'
                                                                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                                                            <span>{slot}</span>
                                                        </div>
                                                        {selectedTimeSlot === slot && <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="w-1/3 py-3.5 border border-neutral-800 text-neutral-400 hover:text-white font-space font-semibold rounded-2xl text-xs uppercase"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setStep(3); playClickSound(soundEnabled); }}
                                                className="w-2/3 py-3.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-space font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                                            >
                                                <span>Next: Your Info</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Contact Info & Confirm */}
                                {step === 3 && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[11px] font-mono text-neutral-400 uppercase block mb-1">Your Name *</label>
                                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs">
                                                    <User className="w-4 h-4 text-neutral-500" />
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="John Doe"
                                                        className="w-full bg-transparent focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-mono text-neutral-400 uppercase block mb-1">Email Address *</label>
                                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs">
                                                    <Mail className="w-4 h-4 text-neutral-500" />
                                                    <input
                                                        required
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        placeholder="john@company.com"
                                                        className="w-full bg-transparent focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-mono text-neutral-400 uppercase block mb-1">Company / Organization</label>
                                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs">
                                                <Building className="w-4 h-4 text-neutral-500" />
                                                <input
                                                    type="text"
                                                    value={formData.company}
                                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                    placeholder="Acme Corp (Optional)"
                                                    className="w-full bg-transparent focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-mono text-neutral-400 uppercase block mb-1">Short Note / Agenda</label>
                                            <textarea
                                                rows={3}
                                                value={formData.notes}
                                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                placeholder="Briefly describe what you'd like to talk about..."
                                                className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none resize-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                className="w-1/3 py-3.5 border border-neutral-800 text-neutral-400 hover:text-white font-space font-semibold rounded-2xl text-xs uppercase"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-2/3 py-3.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-space font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Confirming...' : 'Confirm Meeting Booking'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        ) : (
                            /* Success Confirmation View */
                            <div className="py-8 text-center space-y-6">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                                    <CheckCircle className="w-8 h-8" />
                                </div>

                                <div>
                                    <h4 className="text-2xl font-space font-bold text-white mb-2">
                                        Meeting Requested!
                                    </h4>
                                    <p className="text-xs font-sans text-neutral-400 max-w-md mx-auto leading-relaxed">
                                        Thank you, <strong className="text-white">{formData.name}</strong>. Your request for <strong className="text-[#D4AF37]">{topic}</strong> on <strong className="text-white">{selectedDate}</strong> at <strong className="text-white">{selectedTimeSlot}</strong> has been logged.
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-left text-xs font-mono space-y-2 max-w-md mx-auto">
                                    <div className="text-[#D4AF37] font-bold uppercase tracking-wider text-[10px]">Booking Summary</div>
                                    <div className="text-neutral-300">Name: {formData.name} ({formData.email})</div>
                                    <div className="text-neutral-300">Topic: {topic}</div>
                                    <div className="text-neutral-300">Slot: {selectedDate} @ {selectedTimeSlot}</div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                                    <button
                                        onClick={downloadICSFile}
                                        className="px-6 py-3 rounded-xl bg-neutral-900 border border-[#D4AF37]/40 text-[#D4AF37] font-space font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#D4AF37]/10 transition-all"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Calendar (.ics)
                                    </button>
                                    <button
                                        onClick={resetAndClose}
                                        className="px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-space font-bold text-xs uppercase tracking-wider"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
