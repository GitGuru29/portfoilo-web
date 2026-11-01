import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Linkedin, ChevronLeft, ChevronRight, MessageSquarePlus, RefreshCw, ShieldCheck } from 'lucide-react';
import { fetchApprovedTestimonials } from '../services/githubTestimonialsService';
import SubmitReferenceModal from './SubmitReferenceModal';
import AdminModerationModal from './AdminModerationModal';

export default function TestimonialsOverlay() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const loadTestimonials = async () => {
        setLoading(true);
        const data = await fetchApprovedTestimonials();
        setTestimonials(data);
        setLoading(false);
    };

    useEffect(() => {
        loadTestimonials();
    }, []);

    const nextSlide = () => {
        if (testimonials.length === 0) return;
        setIsExpanded(false);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        if (testimonials.length === 0) return;
        setIsExpanded(false);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const current = testimonials[currentIndex];

    return (
        <div className="w-full relative overflow-hidden bg-transparent">
            <div className="w-full relative z-10 space-y-6">
                {/* Top Ledger Bar & Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ink/20">
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-graphite">
                        <span className="w-2 h-2 bg-accent" />
                        <span className="font-bold text-ink">LETTERS TO THE EDITOR // PEER &amp; CLIENT ENDORSEMENTS</span>
                        {!loading && testimonials.length > 0 && (
                            <span className="px-2 py-0.5 bg-panel-deep border border-ink/15 text-ink font-bold">
                                {testimonials.length} ON FILE
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            onClick={() => setIsAdminOpen(true)}
                            title="Admin Moderation Desk"
                            className="p-2.5 rounded-none bg-panel border border-ink/20 text-graphite hover:text-accent hover:border-accent transition-all cursor-pointer"
                        >
                            <ShieldCheck className="w-4 h-4" />
                        </button>
                        <button
                            onClick={loadTestimonials}
                            title="Refresh endorsements"
                            className="p-2.5 rounded-none bg-panel border border-ink/20 text-graphite hover:text-ink hover:border-ink transition-all cursor-pointer"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-accent' : ''}`} />
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-5 py-2.5 rounded-none bg-ink hover:bg-accent text-void font-mono font-bold text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 transition-all shadow-[3px_3px_0_var(--color-accent)] hover:shadow-none cursor-pointer"
                        >
                            <MessageSquarePlus className="w-3.5 h-3.5" />
                            Submit Endorsement
                        </button>
                    </div>
                </div>

                {/* Main Recommendation Plate */}
                {loading ? (
                    <div className="w-full h-72 rounded-none bg-panel border border-ink/20 flex items-center justify-center">
                        <div className="flex items-center gap-3 text-graphite font-mono text-xs uppercase tracking-[0.2em]">
                            <RefreshCw className="w-4 h-4 animate-spin text-accent" />
                            Retrieving Verified Endorsements...
                        </div>
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="w-full py-16 rounded-none bg-panel border border-ink/20 text-center px-6">
                        <p className="text-graphite font-serif text-base mb-5">
                            No verified endorsements on file in this edition yet.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-ink hover:bg-accent text-void font-mono font-bold rounded-none text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer"
                        >
                            File the First Endorsement ↗
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Editorial Quote Card */}
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full rounded-none bg-panel border-2 border-ink/80 p-6 md:p-10 lg:p-12 shadow-[6px_6px_0_rgba(13,13,13,0.12)] overflow-hidden"
                        >
                            <Quote className="absolute right-6 top-6 w-20 h-20 text-ink/5 pointer-events-none" />

                            {/* Top Metadata Strip */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-ink/15">
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-0.5 bg-ink text-void font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
                                        LETTER // 0{currentIndex + 1} OF 0{testimonials.length}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {[...Array(current.rating || 5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                                        ))}
                                    </div>
                                </div>

                                <span className="px-3 py-1 text-[10px] font-mono font-bold tracking-[0.18em] text-accent bg-accent/10 border border-accent/35 uppercase">
                                    {current.relationship || 'Verified Collaborator'}
                                </span>
                            </div>

                            {/* Quote Text */}
                            <div className="mb-8 relative z-10">
                                <p
                                    className={`text-lg md:text-2xl font-display text-ink leading-relaxed italic ${
                                        isExpanded ? '' : 'line-clamp-4'
                                    }`}
                                >
                                    &ldquo;{current.text}&rdquo;
                                </p>
                                {current.text && current.text.length > 180 && (
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="mt-3 text-[10px] font-mono font-bold tracking-[0.2em] text-accent hover:text-ink uppercase transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        {isExpanded ? '[ Collapse Dispatch − ]' : '[ Read Full Dispatch + ]'}
                                    </button>
                                )}
                            </div>

                            {/* Author Byline Footer */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t-2 border-ink/20">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={current.avatar}
                                        alt={current.name}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-12 h-12 rounded-none object-cover border border-ink/40 p-0.5 bg-panel-deep"
                                        onError={(e) => {
                                            e.target.src =
                                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';
                                        }}
                                    />
                                    <div>
                                        <h4 className="text-base md:text-lg font-display font-bold text-ink leading-tight">
                                            {current.name}
                                        </h4>
                                        <p className="text-[11px] text-graphite font-mono uppercase tracking-wider mt-0.5">
                                            {current.role}{' '}
                                            {current.company ? `· ${current.company}` : ''}
                                        </p>
                                    </div>
                                </div>

                                {current.linkedin && (
                                    <a
                                        href={current.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3.5 py-2 rounded-none border border-ink/25 bg-panel-deep text-ink hover:border-accent hover:text-accent transition-colors inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest"
                                        title="View LinkedIn Profile"
                                    >
                                        <Linkedin className="w-3.5 h-3.5" />
                                        <span>Verified Profile ↗</span>
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        {/* Pagination & Controls */}
                        <div className="flex items-center justify-between mt-5 pt-3 border-t border-ink/15">
                            <div className="flex items-center gap-2">
                                {testimonials.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setIsExpanded(false);
                                            setCurrentIndex(idx);
                                        }}
                                        title={item.name}
                                        className={`h-2 rounded-none transition-all duration-300 cursor-pointer ${
                                            idx === currentIndex
                                                ? 'w-8 bg-accent'
                                                : 'w-2.5 bg-ink/20 hover:bg-ink/50'
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prevSlide}
                                    aria-label="Previous recommendation"
                                    className="px-3 py-2 rounded-none bg-panel border border-ink/25 text-ink hover:border-accent hover:text-accent transition-colors flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Prev</span>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    aria-label="Next recommendation"
                                    className="px-3 py-2 rounded-none bg-panel border border-ink/25 text-ink hover:border-accent hover:text-accent transition-colors flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest cursor-pointer"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Submission Modal */}
            <SubmitReferenceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadTestimonials}
            />

            {/* Admin Control Dashboard */}
            <AdminModerationModal
                isOpen={isAdminOpen}
                onClose={() => setIsAdminOpen(false)}
                onRefreshPublic={loadTestimonials}
            />
        </div>
    );
}


