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

    return (
        <div className="w-full py-24 md:py-32 px-6 relative overflow-hidden bg-transparent">
            {/* Background Accent Gradients */}
            <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-neutral-200 text-xs font-mono tracking-widest text-[#D4AF37] uppercase mb-4 shadow-sm">
                            <Quote className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Client Endorsements & References</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-space font-bold text-neutral-900 tracking-tight">
                            Trusted by Leaders & Clients
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAdminOpen(true)}
                            title="Admin Control Panel"
                            className="p-3 rounded-full glass border border-neutral-200 text-neutral-500 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all"
                        >
                            <ShieldCheck className="w-4 h-4" />
                        </button>
                        <button
                            onClick={loadTestimonials}
                            title="Refresh recommendations"
                            className="p-3 rounded-full glass border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-[#D4AF37]/40 transition-all"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-5 py-3 rounded-full bg-[#D4AF37] hover:bg-[#b8952b] text-neutral-950 font-space font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-lg hover:shadow-[#D4AF37]/20"
                        >
                            <MessageSquarePlus className="w-4 h-4" />
                            Leave a Recommendation
                        </button>
                    </div>
                </div>

                {/* Main Recommendation Carousel / Card View */}
                {loading ? (
                    <div className="w-full h-80 rounded-2xl glass border border-neutral-200 flex items-center justify-center">
                        <div className="flex items-center gap-3 text-neutral-500 font-mono text-sm">
                            <RefreshCw className="w-5 h-5 animate-spin text-[#D4AF37]" />
                            Loading references...
                        </div>
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="w-full py-16 rounded-2xl glass border border-neutral-200 text-center px-6">
                        <p className="text-neutral-500 text-sm mb-4">No recommendations submitted yet.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-2.5 bg-[#D4AF37] text-neutral-950 font-space font-semibold rounded-lg text-xs uppercase"
                        >
                            Be the first to submit a reference
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Recommendation Card */}
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full rounded-2xl glass border border-neutral-200 p-8 md:p-12 shadow-2xl overflow-hidden"
                        >
                            <Quote className="absolute right-8 top-8 w-24 h-24 text-neutral-900/5 pointer-events-none" />

                            {/* Rating Stars & Tag */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(testimonials[currentIndex].rating || 5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                                    ))}
                                </div>
                                <span className="px-3 py-1 text-[11px] font-mono tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-md uppercase">
                                    {testimonials[currentIndex].relationship || 'Client'}
                                </span>
                            </div>

                            {/* Quote Text */}
                            <div className="mb-8">
                                <p className={`text-lg md:text-2xl font-sans text-neutral-700 leading-relaxed font-normal italic ${isExpanded ? '' : 'line-clamp-4'}`}>
                                    "{testimonials[currentIndex].text}"
                                </p>
                                {testimonials[currentIndex].text.length > 180 && (
                                    <button 
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="mt-3 text-xs font-space tracking-widest text-[#D4AF37] hover:text-neutral-900 uppercase transition-colors flex items-center gap-1"
                                    >
                                        {isExpanded ? 'Show Less' : 'See Full Review'}
                                    </button>
                                )}
                            </div>

                            {/* Author Info Footer */}
                            <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonials[currentIndex].avatar}
                                        alt={testimonials[currentIndex].name}
                                        className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/40 shadow-md"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';
                                        }}
                                    />
                                    <div>
                                        <h4 className="text-base font-space font-bold text-neutral-900">
                                            {testimonials[currentIndex].name}
                                        </h4>
                                        <p className="text-xs text-neutral-500 font-mono">
                                            {testimonials[currentIndex].role} {testimonials[currentIndex].company ? `@ ${testimonials[currentIndex].company}` : ''}
                                        </p>
                                    </div>
                                </div>

                                {testimonials[currentIndex].linkedin && (
                                    <a
                                        href={testimonials[currentIndex].linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 rounded-full glass text-neutral-500 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-colors"
                                        title="View LinkedIn Profile"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        {/* Controls */}
                        <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-2">
                                {testimonials.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setIsExpanded(false);
                                            setCurrentIndex(idx);
                                        }}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            idx === currentIndex ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prevSlide}
                                    className="p-3 rounded-full glass border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-[#D4AF37]/40 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="p-3 rounded-full glass border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-[#D4AF37]/40 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
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

