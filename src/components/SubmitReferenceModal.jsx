import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, CheckCircle2, User, Building, Linkedin, Upload, Trash2, Loader2 } from 'lucide-react';
import { submitDirectRecommendation, compressImageFile } from '../services/githubTestimonialsService';

export default function SubmitReferenceModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        company: '',
        relationship: 'Client',
        rating: 5,
        linkedin: '',
        avatar: '',
        text: '',
    });
    const [isDragging, setIsDragging] = useState(false);
    const [compressing, setCompressing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelected = async (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        try {
            setCompressing(true);
            const compressed = await compressImageFile(file);
            setFormData((prev) => ({ ...prev, avatar: compressed }));
        } catch (err) {
            console.error('Image compression failed:', err);
        } finally {
            setCompressing(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelected(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.text) return;

        try {
            setIsSubmitting(true);
            await submitDirectRecommendation(formData);
            setSubmitted(true);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        setFormData({
            name: '',
            role: '',
            company: '',
            relationship: 'Client',
            rating: 5,
            linkedin: '',
            avatar: '',
            text: '',
        });
        onClose();
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
                    {/* Backdrop Click */}
                    <div className="fixed inset-0" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full max-w-2xl bg-neutral-900 border border-white/15 rounded-2xl shadow-2xl p-6 md:p-8 text-white overflow-hidden my-auto"
                    >
                        {/* Background Ambient Glow */}
                        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                            <div>
                                <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">Endorsements & Testimonials</span>
                                <h3 className="text-2xl font-space font-bold text-white mt-1">Submit a Recommendation</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {submitted ? (
                            <div className="text-center py-10 space-y-4">
                                <div className="w-16 h-16 bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-space font-bold text-white">Recommendation Submitted!</h4>
                                <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                                    Thank you for your endorsement! Your recommendation has been submitted directly for review and will appear live on this portfolio.
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="mt-6 px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b8952b] text-neutral-950 font-space font-semibold rounded-lg transition-all shadow-lg"
                                >
                                    Done & Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Photo Upload Dropzone */}
                                <div>
                                    <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1.5">
                                        Profile Photo / Avatar
                                    </label>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => e.target.files && handleFileSelected(e.target.files[0])}
                                    />

                                    {formData.avatar ? (
                                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/15 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={formData.avatar}
                                                    alt="Avatar preview"
                                                    className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]"
                                                />
                                                <div>
                                                    <p className="text-xs font-space text-white">Photo Ready</p>
                                                    <p className="text-[11px] text-neutral-400">Compressed avatar preview</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, avatar: '' })}
                                                className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                                                title="Remove photo"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`w-full py-6 px-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                                                isDragging
                                                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                                    : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
                                            }`}
                                        >
                                            {compressing ? (
                                                <div className="flex items-center gap-2 text-sm text-[#D4AF37]">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Processing photo...
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                                                    <p className="text-xs font-space font-medium text-white">
                                                        Drag & drop your photo here, or <span className="text-[#D4AF37]">browse</span>
                                                    </p>
                                                    <p className="text-[11px] text-neutral-500 mt-1">Supports PNG, JPG, WebP</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1.5">
                                            Your Full Name <span className="text-[#D4AF37]">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g. Sarah Jenkins"
                                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Role & Company */}
                                    <div>
                                        <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1.5">
                                            Role / Company
                                        </label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                            <input
                                                type="text"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                placeholder="e.g. Lead Designer @ Acme"
                                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Relationship */}
                                    <div>
                                        <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1.5">
                                            Relationship
                                        </label>
                                        <select
                                            value={formData.relationship}
                                            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        >
                                            <option value="Client">Client</option>
                                            <option value="Manager / Supervisor">Manager / Supervisor</option>
                                            <option value="Colleague / Teammate">Colleague / Teammate</option>
                                            <option value="Mentor / Industry Peer">Mentor / Industry Peer</option>
                                        </select>
                                    </div>

                                    {/* Star Rating */}
                                    <div>
                                        <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1.5">
                                            Rating
                                        </label>
                                        <div className="flex items-center gap-1.5 py-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, rating: star })}
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`w-6 h-6 ${
                                                            star <= formData.rating
                                                                ? 'fill-[#D4AF37] text-[#D4AF37]'
                                                                : 'text-neutral-600'
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* LinkedIn */}
                                <div>
                                    <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1.5">
                                        LinkedIn Profile URL (Optional)
                                    </label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <input
                                            type="url"
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            placeholder="https://linkedin.com/in/..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Recommendation Text */}
                                <div>
                                    <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1.5">
                                        Your Endorsement / Recommendation <span className="text-[#D4AF37]">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.text}
                                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                        placeholder="Write your reference, experience working together, or feedback..."
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                                    />
                                </div>

                                {/* Submit Footer */}
                                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                                    <span className="text-xs text-neutral-400">
                                        Direct in-browser submission
                                    </span>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b8952b] text-neutral-950 font-space font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-[#D4AF37]/20 cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        {isSubmitting ? 'Submitting...' : 'Submit Recommendation'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
